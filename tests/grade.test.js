import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateItem } from '../js/items.js';
import { gradeItem, scoreGate, scoreCheckpoint, scoreExam } from '../js/grade.js';
import { splitBalance, recordSplit, explainDebit } from './fixtures/templates.js';
import { formatCents } from '../js/money.js';

const numeric = generateItem(splitBalance, 3);
const entry = generateItem(recordSplit, 3);
const explain = generateItem(explainDebit, 3);

test('a numeric answer in any loose format earns full points', () => {
  for (const typed of [formatCents(numeric.answer), `$${formatCents(numeric.answer)}`, ` ${(numeric.answer / 100).toFixed(2)} `]) {
    const r = gradeItem(numeric, typed);
    assert.equal(r.points, 2, typed);
    assert.equal(r.max, 2);
    assert.equal(r.correct, true);
  }
});

test('a wrong numeric answer earns nothing and names a known misconception', () => {
  const wrong = numeric.misconceptions[0].cents;
  const r = gradeItem(numeric, formatCents(wrong));
  assert.equal(r.points, 0);
  assert.equal(r.correct, false);
  assert.equal(r.misconception, numeric.misconceptions[0].explanation);
  assert.ok(r.feedback.includes(formatCents(numeric.answer)), 'feedback gives the right answer');
});

test('text that is not a number is not marked wrong', () => {
  const r = gradeItem(numeric, 'about two hundred');
  assert.equal(r.invalid, true);
  assert.equal(r.points, undefined);
  assert.ok(r.feedback.length > 0);
});

const answerLines = () => entry.answer.map((l) => ({ ...l }));

test('an entry scores 4/4 only when accounts, sides and cents all match, in any order', () => {
  const r = gradeItem(entry, [...answerLines()].reverse());
  assert.equal(r.points, 4);
  assert.equal(r.correct, true);
  assert.deepEqual(r.rubric.map((x) => x.met), [true, true, true, true]);
});

test('an entry with the right accounts but a wrong amount loses the amount line only... and balance if unequal', () => {
  const lines = answerLines();
  lines[0].debit += 100;
  lines[1].credit += 100; // still balances, both amounts wrong
  const r = gradeItem(entry, lines);
  assert.equal(r.points, 3);
  assert.deepEqual(r.rubric.map((x) => x.met), [true, true, false, true]);
});

test('an entry with debits and credits reversed scores 0 (author\'s rule): the accounts are wrong on both sides', () => {
  const lines = answerLines().map((l) => ({ account: l.account, debit: l.credit, credit: l.debit }));
  const r = gradeItem(entry, lines);
  assert.equal(r.points, 0);
  assert.equal(r.correct, false);
  assert.deepEqual(r.rubric.map((x) => x.met), [false, false, true, true], 'the rubric still shows what was right');
  assert.match(r.feedback, /reversed|both sides/i);
});

test('only a true reversal gets the reversal message; other entries wrong on both sides score 0 with a neutral one', () => {
  const three = { kind: 'entry', points: 4, accounts: [], answer: [{ account: 'groceries', debit: 3000, credit: 0 }, { account: 'household', debit: 1000, credit: 0 }, { account: 'spending', debit: 0, credit: 4000 }], explanation: '' };
  const reversed = gradeItem(three, [{ account: 'groceries', debit: 0, credit: 3000 }, { account: 'household', debit: 0, credit: 1000 }, { account: 'spending', debit: 4000, credit: 0 }]);
  assert.equal(reversed.points, 0);
  assert.match(reversed.feedback, /reversed/);
  const misnamed = gradeItem(three, [{ account: 'groceries', debit: 3000, credit: 0 }, { account: 'fun', debit: 1000, credit: 0 }, { account: 'checking', debit: 0, credit: 4000 }]);
  assert.equal(misnamed.points, 0);
  assert.doesNotMatch(misnamed.feedback, /reversed/);
  assert.match(misnamed.feedback, /wrong on both sides/);
  const oneSide = gradeItem(three, [{ account: 'groceries', debit: 3000, credit: 0 }, { account: 'fun', debit: 1000, credit: 0 }, { account: 'spending', debit: 0, credit: 4000 }]);
  assert.equal(oneSide.points, 3, 'one side wrong keeps partial credit');
});

test('the right amount on the wrong account loses only the account line', () => {
  const lines = answerLines();
  lines[0].account = 'spending';
  const r = gradeItem(entry, lines);
  assert.deepEqual(r.rubric.map((x) => x.met), [false, true, true, true]);
});

test('one amount split across two lines for the same account still counts', () => {
  const [dr, cr] = answerLines();
  const half = Math.floor(dr.debit / 2);
  const r = gradeItem(entry, [{ ...dr, debit: half }, { ...dr, debit: dr.debit - half }, cr]);
  assert.equal(r.points, 4);
});

test('an empty entry, or an amount without an account, is not marked', () => {
  assert.equal(gradeItem(entry, []).invalid, true);
  assert.equal(gradeItem(entry, [{ account: 'saving', debit: 0, credit: 0 }]).invalid, true);
  const r = gradeItem(entry, [{ account: '', debit: 500, credit: 0 }, { account: 'checking', debit: 0, credit: 500 }]);
  assert.equal(r.invalid, true);
  assert.match(r.feedback, /account/i);
});

test('a one-sided entry fails the balance line', () => {
  const r = gradeItem(entry, [answerLines()[0]]);
  assert.equal(r.rubric[3].met, false);
  assert.equal(r.correct, false);
});

test('blank entry lines are ignored', () => {
  const r = gradeItem(entry, [...answerLines(), { account: '', debit: 0, credit: 0 }]);
  assert.equal(r.points, 4);
});

test('explanation items are self-marked from the learner\'s ticks', () => {
  const shown = gradeItem(explain, { text: 'Because Saving is an asset.' });
  assert.equal(shown.selfMarked, true);
  assert.equal(shown.modelAnswer, explain.modelAnswer);
  assert.deepEqual(shown.rubric, explain.rubric);
  assert.equal(shown.points, undefined, 'not scored until ticked');
  assert.equal(gradeItem(explain, { text: 'x', ticks: [true, false] }).points, 1);
  assert.equal(gradeItem(explain, { text: 'x', ticks: [true, true] }).points, 2);
});

test('self-marking never exceeds the maximum and rounds down', () => {
  assert.equal(gradeItem(explain, { text: 'x', ticks: [true, true, true, true] }).points, 2);
  const four = { ...explain, rubric: ['a', 'b', 'c', 'd'] };
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => gradeItem(four, { text: 'x', ticks: [0, 1, 2, 3].map((i) => i < n) }).points), [0, 0, 1, 1, 2]);
});

test('a blank explanation is not accepted', () => {
  assert.equal(gradeItem(explain, { text: '   ' }).invalid, true);
});

const part = (p, points, max) => ({ part: p, points, max });

// A gate: 7 interpreting × 2, 2 producing × 4, 1 explaining × 2 = 24 points.
const gate = ({ interp = 14, prod = [4, 4], explain = 2 } = {}) => [
  ...Array.from({ length: 7 }, (_, i) => part('interpreting', Math.max(0, Math.min(2, interp - 2 * i)), 2)),
  ...prod.map((p) => part('producing', p, 4)),
  part('explaining', explain, 2),
];

test('scoreGate: 80% of the points passes, with no other condition', () => {
  assert.deepEqual(scoreGate(gate({ interp: 14, prod: [4, 0], explain: 2 })), { points: 20, max: 24, producing: 4, passed: true });
  assert.equal(scoreGate(gate({ interp: 13, prod: [4, 0], explain: 2 })).passed, false, '19 of 24 is below 80%');
});

test('scoreGate: partial credit on both recording questions can still pass (author\'s ruling); 0 on both cannot', () => {
  assert.equal(scoreGate(gate({ prod: [3, 3] })).passed, true, '22 of 24');
  assert.equal(scoreGate(gate({ prod: [2, 2] })).passed, true, '20 of 24');
  assert.equal(scoreGate(gate({ prod: [2, 2], explain: 0 })).passed, false, '18 of 24');
});

test('scoreGate: missing both recording questions cannot pass', () => {
  assert.deepEqual(scoreGate(gate({ interp: 14, prod: [0, 0], explain: 2 })), { points: 16, max: 24, producing: 0, passed: false });
});

test('scoreGate: a full score passes', () => {
  assert.equal(scoreGate(gate()).passed, true);
});

const cp = (module, points, max) => ({ module, points, max });

test('scoreCheckpoint lists missed modules earliest first', () => {
  const r = scoreCheckpoint([cp('m04', 2, 2), cp('m02', 0, 2), cp('m03', 1, 2), cp('m01', 2, 2), cp('m02', 2, 2)]);
  assert.deepEqual(r.missedModules, ['m02', 'm03']);
});

test('scoreCheckpoint: 80.0% passes and 79.9% fails', () => {
  assert.equal(scoreCheckpoint([cp('m01', 800, 1000)]).passed, true);
  assert.equal(scoreCheckpoint([cp('m01', 800, 1000)]).percent, 80);
  assert.equal(scoreCheckpoint([cp('m01', 799, 1000)]).passed, false);
  assert.equal(scoreCheckpoint([cp('m01', 799, 1000)]).percent, 79.9);
});

test('scoreExam uses the same 80% pass mark', () => {
  assert.deepEqual(scoreExam([cp('m01', 32, 40)]), { percent: 80, passed: true });
  assert.equal(scoreExam([cp('m01', 31, 40)]).passed, false);
});

const amounts = {
  kind: 'amounts', points: 4, module: 'm01', part: 'producing',
  fields: [
    { label: 'Saving (15%)', answer: 15502 },
    { label: 'Investing (10%)', answer: 10335 },
    { label: 'Charity (5%)', answer: 5167 },
    { label: 'Spending (what is left)', answer: 62007 },
  ],
  explanation: 'Work out the four percentage buckets, then Spending gets what is left so the buckets add up exactly.',
};

test('an amounts question scores one point per correct field', () => {
  const r = gradeItem(amounts, ['155.02', '103.35', '51.67', '620.08']);
  assert.equal(r.points, 3);
  assert.equal(r.max, 4);
  assert.equal(r.correct, false);
  assert.deepEqual(r.rubric.map((x) => x.met), [true, true, true, false]);
  assert.ok(r.feedback.includes('620.07'));
});

test('an amounts question is fully correct only when every field is', () => {
  assert.equal(gradeItem(amounts, ['155.02', '$103.35', '51.67', '620.07']).correct, true);
});

test('an amounts question with a blank or non-number field is not marked', () => {
  const r = gradeItem(amounts, ['155.02', '', '51.67', '620.07']);
  assert.equal(r.invalid, true);
  assert.match(r.feedback, /Investing/);
});
