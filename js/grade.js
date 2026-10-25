// Marking items and scoring gates, checkpoints and the final exam.
//
// Item fields by kind (from a template's build()):
//   numeric: { prompt, answer: cents, misconceptions?: [{ cents, explanation }], explanation }
//   entry:   { prompt, accounts: [{ id, label }], answer: [{ account, debit, credit }], explanation }
//   explain: { prompt, modelAnswer, rubric: [criterion, ...] }
// Responses: numeric -> typed text; entry -> [{ account, debit, credit }] in cents;
// explain -> { text, ticks?: [bool, ...] } (ticks are the learner's self-marking).

import { parseAmount, formatCents } from './money.js';
import { entryBalances } from './ledger.js';
import { MODULES } from '../content/course.js';

const INVALID_MESSAGES = {
  empty: 'Type an amount first, for example 75.14.',
  'not-an-amount': 'That doesn\'t look like an amount. Use digits, for example 75.14 or $1,212.00.',
  'too-many-decimals': 'Money only goes to the cent: use at most two digits after the point.',
  'too-large': 'That amount is far too large. Check the number of digits.',
};

function gradeNumeric(item, typed) {
  const parsed = parseAmount(typed);
  if (!parsed.ok) return { invalid: true, feedback: INVALID_MESSAGES[parsed.reason] ?? INVALID_MESSAGES['not-an-amount'] };
  const max = item.points;
  if (parsed.cents === item.answer) {
    return { points: max, max, correct: true, feedback: `Correct. ${item.explanation ?? ''}`.trim() };
  }
  const known = (item.misconceptions ?? []).find((m) => m.cents === parsed.cents);
  return {
    points: 0,
    max,
    correct: false,
    misconception: known?.explanation,
    feedback: `The answer is $${formatCents(item.answer)}. ${known ? `${known.explanation} ` : ''}${item.explanation ?? ''}`.trim(),
  };
}

function totalsByAccount(lines) {
  const totals = new Map();
  for (const l of lines) {
    const t = totals.get(l.account) ?? { debit: 0, credit: 0 };
    t.debit += l.debit || 0;
    t.credit += l.credit || 0;
    totals.set(l.account, t);
  }
  return totals;
}

const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const accountsOn = (totals, side) => new Set([...totals].filter(([, t]) => t[side] > 0).map(([a]) => a));

function sameTotals(a, b) {
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    const x = a.get(k) ?? { debit: 0, credit: 0 };
    const y = b.get(k) ?? { debit: 0, credit: 0 };
    if (x.debit !== y.debit || x.credit !== y.credit) return false;
  }
  return true;
}

// Four rubric lines, one point each.
function gradeEntry(item, lines) {
  const given = lines.filter((l) => l.account || l.debit || l.credit);
  const want = totalsByAccount(item.answer);
  const got = totalsByAccount(given);
  const rubric = [
    { criterion: 'Debits the right accounts', met: sameSet(accountsOn(want, 'debit'), accountsOn(got, 'debit')) },
    { criterion: 'Credits the right accounts', met: sameSet(accountsOn(want, 'credit'), accountsOn(got, 'credit')) },
    { criterion: 'Uses the right amounts', met: sameTotals(want, got) },
    { criterion: 'Debits equal credits', met: entryBalances({ lines: given }) },
  ];
  const points = rubric.filter((r) => r.met).length * (item.points / rubric.length);
  const correct = rubric.every((r) => r.met);
  const missed = rubric.filter((r) => !r.met).map((r) => r.criterion.toLowerCase());
  return {
    points,
    max: item.points,
    correct,
    rubric,
    feedback: correct ? `Correct. ${item.explanation ?? ''}`.trim() : `Check: ${missed.join('; ')}. ${item.explanation ?? ''}`.trim(),
  };
}

function gradeExplain(item, response) {
  const shown = { selfMarked: true, max: item.points, modelAnswer: item.modelAnswer, rubric: item.rubric };
  if (!Array.isArray(response?.ticks)) return shown;
  const met = response.ticks.filter(Boolean).length;
  return { ...shown, points: Math.round((met * item.points) / item.rubric.length) };
}

export function gradeItem(item, response) {
  if (item.kind === 'numeric') return gradeNumeric(item, response);
  if (item.kind === 'entry') return gradeEntry(item, response);
  if (item.kind === 'explain') return gradeExplain(item, response);
  throw new Error(`Unknown item kind: ${item.kind}`);
}

const sum = (results, key) => results.reduce((s, r) => s + r[key], 0);

// Pass: at least 8 of 10 points, and the producing item fully correct.
export function scoreGate(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  const producingResults = results.filter((r) => r.part === 'producing');
  const producing = sum(producingResults, 'points');
  const producingMax = sum(producingResults, 'max');
  return { points, max, producing, passed: points >= 8 && producing === producingMax && producingMax > 0 };
}

const passesEighty = (points, max) => max > 0 && points * 100 >= 80 * max;
const percentOfMax = (points, max) => (max > 0 ? Math.round((points * 1000) / max) / 10 : 0);
const moduleOrder = (id) => {
  const i = MODULES.findIndex((m) => m.id === id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

export function scoreCheckpoint(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  const missed = new Set(results.filter((r) => r.points < r.max).map((r) => r.module));
  const missedModules = [...missed].sort((a, b) => moduleOrder(a) - moduleOrder(b) || a.localeCompare(b));
  return { points, max, percent: percentOfMax(points, max), passed: passesEighty(points, max), missedModules };
}

export function scoreExam(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  return { percent: percentOfMax(points, max), passed: passesEighty(points, max) };
}
