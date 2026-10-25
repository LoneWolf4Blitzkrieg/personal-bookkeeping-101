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

test('monthly card interest is balance × APR ÷ 12, rounded once by the thousandths digit', async () => {
  const { monthlyInterest, exactMonthlyInterest } = await import('../content/helpers.js');
  // $500.00 × 22.15% ÷ 12 = $9.22916… → thousandths 9 → $9.23
  assert.equal(monthlyInterest(50000, 2215), 923);
  // $523.47 × 22.15% ÷ 12 = $9.66238… → thousandths 2 → $9.66
  assert.equal(monthlyInterest(52347, 2215), 966);
  // $1,000.00 × 22.15% ÷ 12 = $18.4583… → thousandths 8 → $18.46
  assert.equal(monthlyInterest(100000, 2215), 1846);
  assert.equal(monthlyInterest(0, 2215), 0);
  assert.equal(exactMonthlyInterest(50000, 2215), '$9.2291…');
  assert.equal(exactMonthlyInterest(120000, 2000), '$20.00');
  assert.throws(() => monthlyInterest(100.5, 2215));
});

test('the example minimum payment is interest + 1% of the balance, at least $25, never more than is owed', async () => {
  const { minimumPayment } = await import('../content/helpers.js');
  assert.equal(minimumPayment(100000, 1846), 2846); // $18.46 + $10.00
  assert.equal(minimumPayment(50000, 923), 2500); // $9.23 + $5.00 is under $25
  assert.equal(minimumPayment(1500, 28), 1528); // owes only $15.28
});

test('paying only the minimum on $1,000.00 at 22.15% takes 71 months; $100.00 a month takes 12', async () => {
  const { payoff } = await import('../content/helpers.js');
  const min = payoff(100000, 2215);
  assert.equal(min.months, 71);
  assert.equal(min.interest, 77542);
  assert.deepEqual(min.rows.slice(0, 2), [{ interest: 1846, payment: 2846, balance: 99000 }, { interest: 1827, payment: 2817, balance: 98010 }]);
  const fixed = payoff(100000, 2215, { payment: 10000 });
  assert.equal(fixed.months, 12);
  assert.equal(fixed.interest, 11579);
  assert.equal(payoff(50000, 2215).months, 26);
});

test('the chart of accounts groups numbers by kind of account', async () => {
  const { CHART, accountOptions } = await import('../content/helpers.js');
  const group = { asset: [1, 19], liability: [20, 29], networth: [30, 30], income: [40, 49], expense: [50, 99] };
  const numbers = new Set();
  for (const [id, a] of Object.entries(CHART)) {
    const [lo, hi] = group[a.type];
    assert.ok(a.no >= lo && a.no <= hi, `${id} (${a.no}) is outside the ${a.type} numbers`);
    assert.ok(!numbers.has(a.no), `account number ${a.no} used twice`);
    numbers.add(a.no);
  }
  // From Module 5 the number tells the kind of account, so labels leave the kind out.
  assert.deepEqual(accountOptions(['groceries', 'card']), [{ id: 'groceries', label: '52 Groceries' }, { id: 'card', label: '21 Credit card' }]);
});

test('chartPage builds a ledger page from the chart, with folios, ticks and asked rows', async () => {
  const { chartPage } = await import('../content/helpers.js');
  const page = chartPage('cash', [['2026-06-03', 'From Spending', 'J1', 6000, 0, true], ['2026-06-05', 'Lunch', 'J2', 0, 1140]], { askFrom: 1 });
  assert.equal(page.accountNo, 7);
  assert.equal(page.account, 'Cash');
  assert.equal(page.type, 'asset');
  assert.deepEqual(page.rows[0], { date: '2026-06-03', items: 'From Spending', folio: 'J1', debit: 6000, credit: 0, posted: [true, false] });
  assert.deepEqual(page.rows[1].posted, [false, false]);
  assert.deepEqual(page.rows[1].ask, ['balance', 'side']);
  assert.equal(chartPage('card', [], { creditLimit: 50000 }).creditLimit, 50000);
  // A line still to be posted can hide its amounts too, so the learner works them out from the journal.
  assert.deepEqual(chartPage('cash', [['2026-06-05', 'Lunch', 'J2', 0, 1140]], { askFrom: 0, askKeys: ['debit', 'credit', 'balance', 'side'] }).rows[0].ask, ['debit', 'credit', 'balance', 'side']);
});

test('journal builds entries whose posted lines carry the ledger account number', async () => {
  const { journal } = await import('../content/helpers.js');
  const page = journal([['2026-06-06', 'J1', 'Saving share of paycheck', [['saving', 15502, 0, true], ['checking', 0, 15502]]]]);
  assert.equal(page.sheetNo, 1);
  assert.deepEqual(page.entries[0].lines, [
    { account: 'saving', label: 'Saving bucket', debit: 15502, credit: 0, folio: '3' },
    { account: 'checking', label: 'Checking', debit: 0, credit: 15502, folio: '' },
  ]);
  assert.equal(page.entries[0].folio, 'J1');
});
