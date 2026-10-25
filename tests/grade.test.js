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

test('an entry with debit and credit swapped scores only for balancing', () => {
  const lines = answerLines().map((l) => ({ account: l.account, debit: l.credit, credit: l.debit }));
  const r = gradeItem(entry, lines);
  assert.equal(r.points, 1);
  assert.deepEqual(r.rubric.map((x) => x.met), [false, false, false, true]);
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

const part = (p, points, max) => ({ part: p, points, max });

test('scoreGate: 9/10 with producing 4/4 passes', () => {
  const r = scoreGate([part('interpreting', 2, 2), part('interpreting', 2, 2), part('producing', 4, 4), part('explaining', 1, 2)]);
  assert.deepEqual(r, { points: 9, max: 10, producing: 4, passed: true });
});

test('scoreGate: 9/10 with producing 3/4 fails', () => {
  const r = scoreGate([part('interpreting', 2, 2), part('interpreting', 2, 2), part('producing', 3, 4), part('explaining', 2, 2)]);
  assert.equal(r.points, 9);
  assert.equal(r.passed, false);
});

test('scoreGate: 7/10 fails', () => {
  const r = scoreGate([part('interpreting', 2, 2), part('interpreting', 0, 2), part('producing', 4, 4), part('explaining', 1, 2)]);
  assert.equal(r.passed, false);
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
