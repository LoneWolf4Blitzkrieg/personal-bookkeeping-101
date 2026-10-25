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
  const { pages: after } = postEntry(paycheckSplit, before);
  assert.equal(JSON.stringify(before), snapshot, 'input pages not mutated');
  const saving = after.find((p) => p.id === 'saving');
  assert.deepEqual(saving.rows, [{ date: '2026-06-06', items: 'Paycheck split into buckets', folio: 'J1', debit: 15000, credit: 0, posted: [true, false] }]);
  const checking = after.find((p) => p.id === 'checking');
  assert.deepEqual(checking.rows[1], { date: '2026-06-06', items: 'Paycheck split into buckets', folio: 'J1', debit: 0, credit: 75000, posted: [false, true] });
});

test('postEntry refuses a line whose account page does not exist', () => {
  assert.throws(() => postEntry({ date: 'd', folio: 'J1', explanation: 'x', lines: [{ account: 'nope', debit: 1, credit: 0 }, { account: 'saving', debit: 0, credit: 1 }] }, pages()), /nope/);
});

test('trial balance is balanced after posting a balanced entry', () => {
  const tb = trialBalance(postEntry(paycheckSplit, pages()).pages);
  assert.deepEqual(tb, { debits: 75000, credits: 75000, balanced: true });
});

test('trial balance catches a transposed amount', () => {
  const books = postEntry(paycheckSplit, pages()).pages;
  books.find((p) => p.id === 'saving').rows[0].debit = 51000; // 15000 written as 51000
  const tb = trialBalance(books);
  assert.equal(tb.balanced, false);
  assert.equal(tb.debits - tb.credits, 36000);
});

test('entryBalances rejects negative amounts and lines with both sides filled', () => {
  assert.equal(entryBalances({ lines: [{ account: 'a', debit: 100, credit: 0 }, { account: 'b', debit: -50, credit: 0 }, { account: 'c', debit: 0, credit: 50 }] }), false);
  assert.equal(entryBalances({ lines: [{ account: 'a', debit: 100, credit: 100 }, { account: 'b', debit: 0, credit: 0 }] }), false);
  assert.equal(entryBalances({ lines: [{ account: 'a', debit: 1.5, credit: 0 }, { account: 'b', debit: 0, credit: 1.5 }] }), false);
});

test('postEntry refuses an entry that does not balance', () => {
  assert.throws(() => postEntry({ date: 'd', folio: 'J1', explanation: 'x', lines: [{ account: 'saving', debit: 100, credit: 0 }] }, pages()), /balance/i);
});

test('postEntry tolerates rows saved without tick marks', () => {
  const books = pages();
  books[1].rows.push({ date: '2026-06-02', items: 'Old row', folio: '', debit: 500, credit: 0 });
  books[0].rows.push({ date: '2026-06-02', items: 'Old row', folio: '', debit: 0, credit: 500 });
  assert.doesNotThrow(() => postEntry(paycheckSplit, books));
});

test('postEntry returns the journal entry with ledger folios and posted marks', () => {
  const books = pages().map((p, i) => ({ ...p, accountNo: i + 1 }));
  const { entry } = postEntry(paycheckSplit, books);
  assert.deepEqual(entry.lines.map((l) => [l.account, l.folio, l.posted]), [['spending', 2, true], ['saving', 3, true], ['checking', 1, true]]);
  assert.equal(paycheckSplit.lines[0].posted, undefined, 'original entry not mutated');
});

test('a liability that is overpaid crosses to a debit balance', () => {
  const page = { type: 'liability', rows: [row('d1', 0, 2000), row('d2', 2500, 0)] };
  assert.deepEqual(runningBalances(page).at(-1), { balance: 500, side: 'Dr' });
});
