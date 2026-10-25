import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBuckets, standardPaycheck, money } from '../content/helpers.js';

test('the five buckets add up exactly, with Spending taking what is left', () => {
  assert.deepEqual(splitBuckets(103346), { saving: 15502, investing: 10335, charity: 5167, blow: 10335, spending: 62007 });
  const b = splitBuckets(98765);
  assert.equal(b.saving + b.investing + b.charity + b.blow + b.spending, 98765);
  assert.equal(b.spending, 59258);
});

test('the standard paycheck is 80 hours at the 2026 Arizona minimum wage', () => {
  assert.deepEqual(standardPaycheck(), { gross: 121200, socialSecurity: 7514, medicare: 1757, federal: 6159, arizona: 2424, net: 103346 });
  assert.equal(standardPaycheck(72).gross, 109080);
});

test('money() writes cents as dollars', () => {
  assert.equal(money(103346), '$1,033.46');
});

test('exactPercent shows the unrounded amount, so learners round only at the end', async () => {
  const { exactPercent } = await import('../content/helpers.js');
  assert.equal(exactPercent(125366, 0.1), '$125.366');
  assert.equal(exactPercent(125366, 0.05), '$62.6830'.replace(/0$/, ''));
  assert.equal(exactPercent(121200, 0.062), '$75.144');
  assert.equal(exactPercent(121200, 0.0145), '$17.574');
  assert.equal(exactPercent(100000, 0.1), '$100.00');
});
