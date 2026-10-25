import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalSide, runningBalances, entryBalances, postEntry, trialBalance } from '../js/ledger.js';

const row = (date, debit, credit, items = 'x') => ({ date, items, folio: '', debit, credit, posted: [false, false] });

test('normal sides follow the debit and credit rules', () => {
  assert.equal(normalSide('asset'), 'Dr');
  assert.equal(normalSide('expense'), 'Dr');
  assert.equal(normalSide('liability'), 'Cr');
  assert.equal(normalSide('income'), 'Cr');
  assert.equal(normalSide('networth'), 'Cr');
  assert.throws(() => normalSide('banana'));
});

test('running balance on an asset page', () => {
  const page = { type: 'asset', rows: [row('2026-06-06', 24000, 0), row('2026-06-20', 24000, 0), row('2026-06-25', 0, 5000)] };
  assert.deepEqual(runningBalances(page), [
    { balance: 24000, side: 'Dr' },
    { balance: 48000, side: 'Dr' },
    { balance: 43000, side: 'Dr' },
  ]);
});

test('a liability page carries a credit balance', () => {
  const page = { type: 'liability', rows: [row('2026-06-03', 0, 6500), row('2026-06-10', 2000, 0)] };
  assert.deepEqual(runningBalances(page), [
    { balance: 6500, side: 'Cr' },
    { balance: 4500, side: 'Cr' },
  ]);
});

test('a balance that crosses zero flips side, and zero shows the normal side', () => {
  const page = { type: 'asset', rows: [row('d1', 3000, 0), row('d2', 0, 3000), row('d3', 0, 1000)] };
  assert.deepEqual(runningBalances(page), [
    { balance: 3000, side: 'Dr' },
    { balance: 0, side: 'Dr' },
    { balance: 1000, side: 'Cr' },
  ]);
});

const paycheckSplit = {
  date: '2026-06-06', folio: 'J1', explanation: 'Paycheck split into buckets',
  lines: [
    { account: 'spending', debit: 60000, credit: 0 },
    { account: 'saving', debit: 15000, credit: 0 },
    { account: 'checking', debit: 0, credit: 75000 },
  ],
};

test('entryBalances is true only when debits equal credits and are not zero', () => {
  assert.equal(entryBalances(paycheckSplit), true);
  assert.equal(entryBalances({ lines: [{ account: 'saving', debit: 15000, credit: 0 }] }), false);
  assert.equal(entryBalances({ lines: [{ account: 'a', debit: 0, credit: 0 }, { account: 'b', debit: 0, credit: 0 }] }), false);
});

function pages() {
  return [
    { id: 'checking', type: 'asset', account: 'Checking', rows: [{ date: '2026-06-01', items: 'Opening balance', folio: '', debit: 75000, credit: 0, posted: [true, false] }] },
    { id: 'spending', type: 'asset', account: 'Spending bucket', rows: [] },
    { id: 'saving', type: 'asset', account: 'Saving bucket', rows: [] },
    { id: 'networth', type: 'networth', account: 'Net worth', rows: [{ date: '2026-06-01', items: 'Opening balance', folio: '', debit: 0, credit: 75000, posted: [false, true] }] },
  ];
}

test('postEntry adds a ticked, cross-referenced row to each page and leaves the input untouched', () => {
  const before = pages();
  const snapshot = JSON.stringify(before);
  const after = postEntry(paycheckSplit, before);
  assert.equal(JSON.stringify(before), snapshot, 'input pages not mutated');
  const saving = after.find((p) => p.id === 'saving');
  assert.deepEqual(saving.rows, [{ date: '2026-06-06', items: 'Paycheck split into buckets', folio: 'J1', debit: 15000, credit: 0, posted: [true, false] }]);
  const checking = after.find((p) => p.id === 'checking');
  assert.deepEqual(checking.rows[1], { date: '2026-06-06', items: 'Paycheck split into buckets', folio: 'J1', debit: 0, credit: 75000, posted: [false, true] });
});

test('postEntry refuses a line whose account page does not exist', () => {
  assert.throws(() => postEntry({ date: 'd', folio: 'J1', explanation: 'x', lines: [{ account: 'nope', debit: 1, credit: 0 }] }, pages()), /nope/);
});

test('trial balance is balanced after posting a balanced entry', () => {
  const tb = trialBalance(postEntry(paycheckSplit, pages()));
  assert.deepEqual(tb, { debits: 75000, credits: 75000, balanced: true });
});

test('trial balance catches a transposed amount', () => {
  const books = postEntry(paycheckSplit, pages());
  books.find((p) => p.id === 'saving').rows[0].debit = 51000; // 15000 written as 51000
  const tb = trialBalance(books);
  assert.equal(tb.balanced, false);
  assert.equal(tb.debits - tb.credits, 36000);
});
