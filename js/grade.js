// Marking items and scoring gates, checkpoints and the final exam.
//
// Item fields by kind (from a template's build()):
//   numeric: { prompt, answer: cents, misconceptions?: [{ cents, explanation }], explanation }
//   entry:   { prompt, accounts: [{ id, label }], answer: [{ account, debit, credit }], explanation }
//   explain: { prompt, modelAnswer, rubric: [criterion, ...] }
//   amounts: { prompt, fields: [{ label, answer: cents }], explanation } — one point per field
// Responses: numeric -> typed text; entry -> [{ account, debit, credit }] in cents;
// explain -> { text, ticks?: [bool, ...] } (ticks are the learner's self-marking);
// amounts -> [typed text, ...] in field order.

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
// The amounts written on one side, per account, ignoring which account.
const amountsOn = (totals, side) => [...totals.values()].map((t) => t[side]).filter((n) => n > 0).sort((a, b) => a - b);
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// Four rubric lines, one point each (entry items are worth 4 points).
function gradeEntry(item, lines) {
  const given = lines.filter((l) => l.debit || l.credit);
  if (given.length === 0) return { invalid: true, feedback: 'Write at least one line with an account and an amount.' };
  if (given.some((l) => !l.account)) return { invalid: true, feedback: 'Every line with an amount needs an account. Choose one for each line.' };
  const want = totalsByAccount(item.answer);
  const got = totalsByAccount(given);
  const rubric = [
    { criterion: 'Debits the right accounts', met: sameSet(accountsOn(want, 'debit'), accountsOn(got, 'debit')) },
    { criterion: 'Credits the right accounts', met: sameSet(accountsOn(want, 'credit'), accountsOn(got, 'credit')) },
    { criterion: 'Uses the right amounts', met: sameList(amountsOn(want, 'debit'), amountsOn(got, 'debit')) && sameList(amountsOn(want, 'credit'), amountsOn(got, 'credit')) },
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
  if (!String(response?.text ?? '').trim()) return { invalid: true, feedback: 'Write your explanation first, then compare it with the model answer.' };
  const shown = { selfMarked: true, max: item.points, modelAnswer: item.modelAnswer, rubric: item.rubric };
  if (!Array.isArray(response.ticks)) return shown;
  const met = response.ticks.slice(0, item.rubric.length).filter(Boolean).length;
  return { ...shown, points: Math.floor((met * item.points) / item.rubric.length) };
}

// Several labelled amounts (bucket shares, running balances), one point each.
// A blank or non-number field is not marked: the learner is asked to fix it.
function gradeAmounts(item, typed) {
  const parsed = item.fields.map((f, i) => ({ field: f, result: parseAmount(typed?.[i]) }));
  const bad = parsed.find((p) => !p.result.ok);
  if (bad) return { invalid: true, feedback: `Check "${bad.field.label}": ${INVALID_MESSAGES[bad.result.reason] ?? INVALID_MESSAGES['not-an-amount']}` };
  const rubric = parsed.map(({ field, result }) => ({ criterion: field.label, met: result.cents === field.answer, answer: field.answer }));
  const each = item.points / item.fields.length;
  const correct = rubric.every((r) => r.met);
  const misses = rubric.filter((r) => !r.met).map((r) => `${r.criterion}: $${formatCents(r.answer)}`);
  return {
    points: rubric.filter((r) => r.met).length * each,
    max: item.points,
    correct,
    rubric,
    feedback: correct ? `Correct. ${item.explanation ?? ''}`.trim() : `The right amounts: ${misses.join('; ')}. ${item.explanation ?? ''}`.trim(),
  };
}

export function gradeItem(item, response) {
  if (item.kind === 'numeric') return gradeNumeric(item, response);
  if (item.kind === 'amounts') return gradeAmounts(item, response);
  if (item.kind === 'entry') return gradeEntry(item, response);
  if (item.kind === 'explain') return gradeExplain(item, response);
  throw new Error(`Unknown item kind: ${item.kind}`);
}

const sum = (results, key) => results.reduce((s, r) => s + r[key], 0);

const passesEighty = (points, max) => max > 0 && points * 100 >= 80 * max;

// Pass: 80% of the points, like every check (author's rule). Recording
// questions carry more points, so missing both of them cannot pass.
export function scoreGate(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  const producing = sum(results.filter((r) => r.part === 'producing'), 'points');
  return { points, max, producing, passed: passesEighty(points, max) };
}

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
