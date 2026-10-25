import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../content/sampleMonth.js';
import { entryBalances, runningBalances } from '../js/ledger.js';
import { checkReport, reportRows } from '../js/reports.js';
import { CHART } from '../content/helpers.js';

const totals = (tb) => tb.accounts.reduce(([d, c], a) => [d + (a.debit ?? 0), c + (a.credit ?? 0)], [0, 0]);
const value = (report, key) => reportRows(report).rows.find((r) => r.key === key).values[0];

test('every journal entry in the sample month balances', () => {
  for (const e of [...S.ENTRIES, ...S.BANK_ENTRIES, ...S.CLOSING_ENTRIES]) {
    assert.ok(entryBalances({ lines: e.lines.map(([, debit, credit]) => ({ debit, credit })) }), `${e.date} ${e.explanation}`);
  }
});

test('the opening books balance, and the trial balance balances at every stage', () => {
  assert.equal(S.OPENING_NET_WORTH, S.openingNetWorthStatement().assets.reduce((s, a) => s + a.amount, 0) - S.openingNetWorthStatement().liabilities.reduce((s, a) => s + a.amount, 0));
  for (const stage of ['month', 'bank', 'closed']) {
    const [d, c] = totals(S.trialBalance(stage));
    assert.equal(d, c, `${stage}: debits ${d}, credits ${c}`);
  }
});

test('no page in the sample month ever goes below zero, and every stored balance agrees', () => {
  for (const stage of ['month', 'bank', 'closed']) {
    for (const { id, page } of S.ledgerPages(stage)) {
      const normal = ['asset', 'expense'].includes(CHART[id].type) ? 'Dr' : 'Cr';
      for (const [i, b] of runningBalances(page).entries()) {
        assert.ok(b.balance === 0 || b.side === normal, `${stage} ${id} row ${i}: ${b.balance} on the ${b.side} side`);
      }
    }
  }
});

test('the books close: every income and expense page is at zero afterwards', () => {
  for (const { id } of S.ledgerPages('closed')) {
    if (['income', 'expense'].includes(CHART[id].type)) assert.equal(S.balance(id, 'closed'), 0, id);
  }
});

test('the bank statement adds up, and the books reconcile to it', () => {
  const moves = S.STATEMENT.lines.filter((l) => l[2] === 'in' || l[2] === 'out');
  assert.equal(moves.reduce((b, [, v, d]) => b + (d === 'in' ? v : -v), S.STATEMENT_OPENING), S.STATEMENT_CLOSING);
  const rec = S.reconciliation();
  assert.deepEqual(checkReport(rec), []);
  assert.equal(value(rec, 'adjusted-bank'), S.ADJUSTED_BANK);
  assert.equal(value(rec, 'adjusted-book'), S.ADJUSTED_BANK);
  // After the interest and the fee are recorded, the pages at the bank equal the adjusted bank balance.
  assert.equal(S.BANK_PAGES.reduce((s, id) => s + S.balance(id, 'bank'), 0), S.ADJUSTED_BANK);
  assert.equal(S.BOOK_BALANCE, value(rec, 'book'));
});

test('the income statement and the net-worth statement agree with the Net worth page', () => {
  const is = S.incomeStatement();
  const nw = S.netWorthStatement();
  for (const r of [is, nw, S.openingNetWorthStatement(), S.budgetPlan(), S.budgetActual(), S.trialBalance('month'), S.trialBalance('bank'), S.trialBalance('closed')]) assert.deepEqual(checkReport(r), [], r.report);
  assert.equal(value(is, 'total-income') - value(is, 'total-expenses'), S.NET_WORTH_END - S.OPENING_NET_WORTH, 'the month added what the income statement says');
  assert.equal(value(nw, 'net'), S.NET_WORTH_END, 'what Riley owns minus owes equals the Net worth page');
  assert.equal(S.TOTAL_INCOME, value(is, 'total-income'));
  assert.equal(S.TOTAL_EXPENSES, value(is, 'total-expenses'));
});

test('the plan is sound: the budget fits the Spending bucket, and the transfers come out of the Saving bucket', () => {
  const spendingIn = S.PAYCHECKS.reduce((s, p) => s + p.split.spending, 0);
  assert.ok(S.BUDGET_TOTAL <= spendingIn + S.OPENING.find(([id]) => id === 'spending')[1], 'budget within the Spending bucket');
  const savingIn = S.PAYCHECKS.reduce((s, p) => s + p.split.saving, 0);
  assert.ok(2 * S.TO_EMERGENCY + S.TO_SINKING <= savingIn, 'transfers within the Saving share');
  assert.ok(S.FUND_MINIMUM > S.OPENING.find(([id]) => id === 'emergency')[1], 'the fund starts below its minimum, so there is a plan to make');
});
