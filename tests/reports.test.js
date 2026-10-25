import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportRows, checkReport, reportHTML } from '../js/reports.js';

const values = (rows, key) => rows.find((r) => r.key === key)?.values;

const tb = {
  report: 'trial-balance', name: 'Jordan', date: '2026-06-30',
  accounts: [
    { no: 2, name: 'Spending bucket', debit: 41200 },
    { no: 21, name: 'Credit card', credit: 4905 },
    { no: 30, name: 'Net worth', credit: 36295 },
  ],
};

test('a trial balance lists each account on its side and totals both columns', () => {
  const { columns, rows } = reportRows(tb);
  assert.deepEqual(columns, ['Debits', 'Credits']);
  assert.deepEqual(rows.slice(0, 3).map((r) => r.values), [[41200, null], [null, 4905], [null, 36295]]);
  assert.deepEqual(values(rows, 'total'), [41200, 41200]);
  assert.deepEqual(checkReport(tb), []);
});

test('a trial balance that does not balance is a problem unless it is shown on purpose', () => {
  const off = { ...tb, accounts: [...tb.accounts.slice(0, 2), { no: 30, name: 'Net worth', credit: 36925 }] };
  assert.ok(checkReport(off).some((p) => /does not balance/.test(p)));
  assert.deepEqual(checkReport({ ...off, errorShown: true }), []);
  assert.ok(checkReport({ ...tb, errorShown: true }).some((p) => /balances/.test(p)), 'flag on a balanced trial balance');
  assert.ok(checkReport({ ...tb, accounts: [{ no: 2, name: 'x', debit: 100, credit: 100 }] }).some((p) => /one side/.test(p)));
});

test('an income statement totals income and expenses and shows what was added to net worth', () => {
  const is = { report: 'income-statement', name: 'Jordan', period: 'June 2026',
    income: [{ no: 40, name: 'Wages', amount: 242400 }], expenses: [{ no: 50, name: 'Taxes withheld', amount: 35708 }, { no: 51, name: 'Rent', amount: 90000 }] };
  const { columns, rows } = reportRows(is);
  assert.deepEqual(columns, ['Amount']);
  assert.deepEqual(values(rows, 'total-income'), [242400]);
  assert.deepEqual(values(rows, 'total-expenses'), [125708]);
  assert.deepEqual(values(rows, 'net'), [116692]);
  assert.equal(rows.find((r) => r.key === 'net').label, 'Added to net worth');
  const loss = reportRows({ ...is, income: [{ no: 40, name: 'Wages', amount: 100000 }] }).rows.find((r) => r.key === 'net');
  assert.deepEqual([loss.label, loss.values], ['Taken from net worth', [25708]]);
});

test('a net-worth statement subtracts what is owed from what is owned', () => {
  const nw = { report: 'net-worth', name: 'Jordan', date: '2026-06-30',
    assets: [{ no: 2, name: 'Spending bucket', amount: 41200 }, { no: 3, name: 'Saving bucket', amount: 90000 }], liabilities: [{ no: 21, name: 'Credit card', amount: 4905 }] };
  const { rows } = reportRows(nw);
  assert.deepEqual([values(rows, 'total-assets'), values(rows, 'total-liabilities'), values(rows, 'net')], [[131200], [4905], [126295]]);
  assert.deepEqual(checkReport(nw), []);
  assert.ok(checkReport({ ...nw, liabilities: [{ no: 21, name: 'Credit card', amount: 200000 }] }).some((p) => /below zero/.test(p)));
});

test('a budget shows each line under or over, never both, with totals', () => {
  const b = { report: 'budget', name: 'Jordan', period: 'June 2026', lines: [{ no: 52, name: 'Groceries', budget: 30000, actual: 27450 }, { no: 53, name: 'Eating out', budget: 6000, actual: 8125 }] };
  const { columns, rows } = reportRows(b);
  assert.deepEqual(columns, ['Budget', 'Actual', 'Under', 'Over']);
  assert.deepEqual(rows[0].values, [30000, 27450, 2550, null]);
  assert.deepEqual(rows[1].values, [6000, 8125, null, 2125]);
  assert.deepEqual(values(rows, 'total'), [36000, 35575, 2550, 2125]);
});

test('a bank reconciliation brings the statement and the books to the same adjusted balance', () => {
  const rec = { report: 'reconciliation', name: 'Jordan', date: '2026-06-30',
    statement: 51500, deposits: [{ label: 'Jun 30 paycheck', amount: 20000 }], payments: [{ label: 'Check 101', amount: 4500 }],
    pages: [{ no: 1, name: 'Checking', amount: 30000 }, { no: 2, name: 'Spending bucket', amount: 37500 }], interest: [{ label: 'Interest', amount: 100 }], fees: [{ label: 'Monthly fee', amount: 600 }] };
  const { rows } = reportRows(rec);
  assert.deepEqual(values(rows, 'adjusted-bank'), [67000]);
  assert.deepEqual(values(rows, 'book'), [67500]);
  assert.deepEqual(values(rows, 'adjusted-book'), [67000]);
  assert.deepEqual(checkReport(rec), []);
  assert.ok(checkReport({ ...rec, fees: [] }).some((p) => /do not agree/.test(p)));
});

test('report amounts must be whole cents, not below zero', () => {
  assert.ok(checkReport({ ...tb, accounts: [{ no: 2, name: 'x', debit: 10.5 }] }).some((p) => /whole cents/.test(p)));
  assert.ok(checkReport({ report: 'nonsense' }).some((p) => /unknown report/.test(p)));
});

test('reports are drawn on ledger paper, with asked rows left blank until revealed', () => {
  const html = reportHTML({ ...tb, ask: ['total'] });
  assert.match(html, /class="ledger-sheet report-sheet"/);
  assert.match(html, /<table class="ledger report[^"]*"[^>]*aria-label="Trial balance"/);
  assert.ok(html.includes('Jun 30, 2026'), 'dates are written out');
  assert.ok(html.includes('412.00') && html.includes('Spending bucket'));
  assert.ok(!html.includes('412.00</td><td class="money col-money">412.00'), 'totals hidden');
  assert.match(html, /to work out/);
  assert.match(reportHTML({ ...tb, ask: ['total'] }, { showAnswers: true }), /class="money col-money answer"/);
});

test('a budget written before the month has no actual amounts yet', () => {
  const plan = { report: 'budget', name: 'Jordan', period: 'June 2026', lines: [{ no: 51, name: 'Rent', budget: 55000 }, { no: 52, name: 'Groceries', budget: 32000 }] };
  const { rows } = reportRows(plan);
  assert.deepEqual(rows[0].values, [55000, null, null, null]);
  assert.deepEqual(values(rows, 'total'), [87000, null, null, null]);
  assert.deepEqual(checkReport(plan), []);
});

test('a reconciliation leaves out headings with nothing under them', () => {
  const rec = { report: 'reconciliation', name: 'Jordan', date: '2026-06-30', statement: 50000, deposits: [], payments: [], pages: [{ no: 2, name: 'Spending bucket', amount: 50000 }], interest: [], fees: [] };
  const labels = reportRows(rec).rows.map((r) => r.label);
  assert.ok(!labels.some((l) => /^(Add|Less):/.test(l)), labels.join(' / '));
  assert.ok(labels.includes('Your pages at this bank'));
});

test('each report row is named for screen readers, so a blank box says which line it belongs to', () => {
  const html = reportHTML({ ...tb, ask: ['total'] });
  assert.match(html, /<th scope="row" class="col-items">Totals<\/th>/);
  assert.match(html, /<th scope="row" class="col-items">Spending bucket<\/th>/);
});
