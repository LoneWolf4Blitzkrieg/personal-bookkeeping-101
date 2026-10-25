// The sample month for the final project (Modules 15 and 16): one fictional
// young adult with a part-time job, July 2026. Everything below is worked out
// from the opening balances, the two paychecks and the list of the month's
// events, so the journal, the ledger pages, the bank statement, the
// reconciliation, the budget and both statements always agree.
// Pay uses the real 2026 Arizona minimum wage and tax rates; the bank pays
// the October 2026 average savings rate on the saving pages. Names, places
// and everyday amounts are fictional (illustrative).

import { money, standardPaycheck, splitBuckets, monthlyInterest, chartPage, journal, payStub, CHART } from './helpers.js';
import { runningBalances } from '../js/ledger.js';
import { RATES_2026 } from './rates2026.js';

export const PERSON = 'Riley (sample month)';
export const MONTH = 'July 2026';
const EMPLOYER = 'Saguaro Burger (fictional)';
const BANK = 'Desert Bank (fictional)';
const NOTE = 'Bank, shops and amounts are fictional (illustrative).';
const RENT_CHECK = 215;
const UTILITIES_CHECK = 216;

// Balances brought forward on July 1 (June was closed, so income and expense
// pages start at zero). Pages held at the bank are marked.
export const OPENING = [
  ['checking', 0], ['spending', 31000], ['saving', 12000], ['emergency', 90000], ['sinking', 6000],
  ['investing', 15000], ['charity', 2000], ['blow', 3500], ['cash', 4000], ['card', 8540],
];
export const BANK_PAGES = ['checking', 'spending', 'saving', 'emergency', 'sinking', 'investing', 'charity', 'blow'];
const SAVING_PAGES = ['saving', 'emergency', 'sinking'];
const openingOf = (id) => OPENING.find(([a]) => a === id)?.[1] ?? 0;
const isDebitSide = (id) => ['asset', 'expense'].includes(CHART[id].type);
export const OPENING_NET_WORTH = OPENING.reduce((s, [id, v]) => s + (isDebitSide(id) ? v : -v), 0);

export const PAYCHECKS = [{ date: '2026-07-10', hours: 56 }, { date: '2026-07-24', hours: 60 }]
  .map((p) => ({ ...p, pay: standardPaycheck(p.hours), split: splitBuckets(standardPaycheck(p.hours).net) }));

// Riley's plan (Module 15): the needs in the Spending bucket's budget, the
// emergency fund's three-month minimum, and two transfers from the Saving
// bucket after each paycheck.
export const BUDGET_PLAN = [['rent', 42500], ['groceries', 18000], ['transport', 6400], ['phone', 4500], ['utilities', 4000], ['household', 2500], ['eating-out', 2000]];
export const ESSENTIAL = ['rent', 'groceries', 'transport', 'phone', 'utilities', 'household'];
export const ESSENTIAL_MONTH = BUDGET_PLAN.filter(([id]) => ESSENTIAL.includes(id)).reduce((s, [, v]) => s + v, 0);
export const FUND_MINIMUM = 3 * ESSENTIAL_MONTH;
export const TO_EMERGENCY = 4000; // after each paycheck
export const TO_SINKING = 1500; // once a month: $180.00 renter's insurance, due in 12 months

const split = (p) => [['spending', p.split.spending, 0], ['saving', p.split.saving, 0], ['investing', p.split.investing, 0], ['charity', p.split.charity, 0], ['blow', p.split.blow, 0], ['checking', 0, p.pay.net]];
const paycheckLines = (p) => [['checking', p.pay.net, 0], ['taxes', p.pay.gross - p.pay.net, 0], ['wages', 0, p.pay.gross]];
const [PAY1, PAY2] = PAYCHECKS;

// The month's events in date order: [date, what happened, lines, bank line?].
// Lines are [account, debit, credit]. A bank line is how the event shows on
// the statement: [label, 'in'|'out'], or null when it never reaches the bank.
// The last two events are on the bank's books only until the statement
// arrives; the reconciliation finds them.
const EVENTS = [
  ['2026-07-03', 'Groceries, debit card (Desert Mart)', [['groceries', 4618, 0], ['spending', 0, 4618]], ['Debit card: Desert Mart', 'out']],
  ['2026-07-06', 'Monthly bus pass, debit card', [['transport', 6400, 0], ['spending', 0, 6400]], ['Debit card: City bus pass', 'out']],
  ['2026-07-08', 'Phone bill, automatic payment', [['phone', 4500, 0], ['spending', 0, 4500]], ['Autopay: phone bill', 'out']],
  [PAY1.date, `Paycheck, ${PAY1.hours} hours`, paycheckLines(PAY1), [`Payroll deposit: ${EMPLOYER}`, 'in']],
  [PAY1.date, 'Split the paycheck into buckets', split(PAY1), null],
  ['2026-07-11', 'To the Emergency fund', [['emergency', TO_EMERGENCY, 0], ['saving', 0, TO_EMERGENCY]], null],
  ['2026-07-12', 'Eating out, cash (Taco Stand)', [['eating-out', 1285, 0], ['cash', 0, 1285]], null],
  ['2026-07-14', 'Household supplies, credit card', [['household', 2347, 0], ['card', 0, 2347]], null],
  ['2026-07-15', `Rent share, check ${RENT_CHECK}`, [['rent', 42500, 0], ['spending', 0, 42500]], [`Check ${RENT_CHECK}`, 'out', '2026-07-16']],
  ['2026-07-18', 'Groceries, debit card (Saguaro Grocery)', [['groceries', 5890, 0], ['spending', 0, 5890]], ['Debit card: Saguaro Grocery', 'out']],
  ['2026-07-20', 'Credit card payment (June balance)', [['card', 8540, 0], ['spending', 0, 8540]], ['Online payment: credit card', 'out']],
  ['2026-07-22', 'Movie, debit card, from Blow money', [['fun', 1400, 0], ['blow', 0, 1400]], ['Debit card: Starlight Cinema', 'out']],
  [PAY2.date, `Paycheck, ${PAY2.hours} hours`, paycheckLines(PAY2), [`Payroll deposit: ${EMPLOYER}`, 'in']],
  [PAY2.date, 'Split the paycheck into buckets', split(PAY2), null],
  ['2026-07-25', 'To the Emergency fund and the Sinking fund', [['emergency', TO_EMERGENCY, 0], ['sinking', TO_SINKING, 0], ['saving', 0, TO_EMERGENCY + TO_SINKING]], null],
  ['2026-07-25', 'Donation to the food bank, from the Charity bucket', [['donations', 2000, 0], ['charity', 0, 2000]], ['Online payment: Valley Food Bank', 'out']],
  ['2026-07-26', 'ATM withdrawal', [['cash', 4000, 0], ['spending', 0, 4000]], ['ATM withdrawal', 'out']],
  ['2026-07-28', 'Groceries, debit card (Desert Mart)', [['groceries', 6137, 0], ['spending', 0, 6137]], ['Debit card: Desert Mart', 'out']],
  ['2026-07-29', `Utilities share to roommate, check ${UTILITIES_CHECK}`, [['utilities', 3800, 0], ['spending', 0, 3800]], null],
  ['2026-07-31', 'Birthday gift from Grandma, deposited', [['saving', 5000, 0], ['gifts', 0, 5000]], null],
];

// Found on the statement: interest on the saving pages (the October 2026
// average rate, one month) and a fee for using another bank's ATM.
export const INTEREST = monthlyInterest(SAVING_PAGES.reduce((s, id) => s + openingOf(id), 0), RATES_2026.savingsRateBasisPoints);
export const ATM_FEE = 300;
const BANK_ITEMS = [
  ['2026-07-31', 'Interest paid (statement)', [['saving', INTEREST, 0], ['interest-earned', 0, INTEREST]], null],
  ['2026-07-31', 'Fee for another bank\'s ATM (statement)', [['bank-fees', ATM_FEE, 0], ['spending', 0, ATM_FEE]], null],
];
const STATEMENT_ONLY = [['2026-07-26', 'ATM fee: another bank', ATM_FEE, 'out'], ['2026-07-31', 'Interest paid', INTEREST, 'in']];
export const OUTSTANDING = { deposits: [{ label: 'Jul 31 Deposit: birthday gift', amount: 5000 }], payments: [{ label: `Check ${UTILITIES_CHECK}: utilities share`, amount: 3800 }] };

// Journal pages hold six entries each, so an entry's folio is its page.
const PER_PAGE = 6;
const toEntries = (events, start) => events.map(([date, explanation, lines], i) => ({ date, explanation, lines, folio: `J${Math.floor((start + i) / PER_PAGE) + 1}` }));
export const ENTRIES = toEntries(EVENTS, 0);
export const BANK_ENTRIES = toEntries(BANK_ITEMS, EVENTS.length);

// --- Ledger pages -------------------------------------------------------------

const ACCOUNT_ORDER = Object.keys(CHART);
function postAll(entries) {
  const rows = {};
  for (const [id, v] of OPENING) rows[id] = [['2026-07-01', 'Brought forward', '', isDebitSide(id) ? v : 0, isDebitSide(id) ? 0 : v]];
  rows['net-worth'] = [['2026-07-01', 'Brought forward', '', 0, OPENING_NET_WORTH]];
  for (const e of entries) {
    for (const [id, dr, cr] of e.lines) (rows[id] ??= []).push([e.date, e.explanation, e.folio, dr, cr, true]);
  }
  return rows;
}
const pagesFrom = (rows) => ACCOUNT_ORDER.filter((id) => rows[id]).map((id, i) => ({ id, page: chartPage(id, rows[id], { name: PERSON, sheetNo: i + 1 }) }));
const balanceOf = (page) => runningBalances(page).at(-1) ?? { balance: 0, side: 'Dr' };
const signed = (id, page) => { const b = balanceOf(page); return (b.side === 'Dr') === isDebitSide(id) ? b.balance : -b.balance; };

// stage: 'month' = the month's events; 'bank' = after recording what the
// statement showed; 'closed' = after the closing entries.
export function ledgerPages(stage = 'bank') {
  const entries = stage === 'month' ? ENTRIES : [...ENTRIES, ...BANK_ENTRIES, ...(stage === 'closed' ? CLOSING_ENTRIES : [])];
  return pagesFrom(postAll(entries));
}
export const pageFor = (id, stage) => ledgerPages(stage).find((p) => p.id === id)?.page;
export const balance = (id, stage = 'bank') => { const p = pageFor(id, stage); return p ? signed(id, p) : 0; };

// The closing entries: income pages into Net worth, then expense pages.
const kindIds = (type) => ACCOUNT_ORDER.filter((id) => CHART[id].type === type);
const closingAt = pagesFrom(postAll([...ENTRIES, ...BANK_ENTRIES]));
const closingBalance = (id) => { const p = closingAt.find((x) => x.id === id); return p ? signed(id, p.page) : 0; };
const INCOME_IDS = kindIds('income').filter((id) => closingBalance(id) > 0);
const EXPENSE_IDS = kindIds('expense').filter((id) => closingBalance(id) > 0);
export const TOTAL_INCOME = INCOME_IDS.reduce((s, id) => s + closingBalance(id), 0);
export const TOTAL_EXPENSES = EXPENSE_IDS.reduce((s, id) => s + closingBalance(id), 0);
const CLOSING_EVENTS = [
  ['2026-07-31', 'Close income to net worth', [...INCOME_IDS.map((id) => [id, closingBalance(id), 0]), ['net-worth', 0, TOTAL_INCOME]]],
  ['2026-07-31', 'Close expenses to net worth', [['net-worth', TOTAL_EXPENSES, 0], ...EXPENSE_IDS.map((id) => [id, 0, closingBalance(id)])]],
];
export const CLOSING_ENTRIES = toEntries(CLOSING_EVENTS, EVENTS.length + BANK_ITEMS.length);

// --- Documents and reports -----------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (d) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}`;

// The bank statement: every event that reached the bank, plus the bank's
// own items, in date order.
const statementLines = () => {
  const moves = [];
  for (const [date, , lines, bank] of EVENTS) {
    if (!bank) continue;
    const [label, dir, cleared = date] = bank;
    const amount = lines.reduce((s, [id, dr, cr]) => s + (BANK_PAGES.includes(id) ? (dir === 'in' ? dr - cr : cr - dr) : 0), 0);
    moves.push([cleared, label, amount, dir]);
  }
  moves.push(...STATEMENT_ONLY);
  return moves.sort((a, b) => a[0].localeCompare(b[0]));
};
export const STATEMENT_OPENING = BANK_PAGES.reduce((s, id) => s + openingOf(id), 0);
export const STATEMENT_CLOSING = statementLines().reduce((b, [, , v, d]) => b + (d === 'in' ? v : -v), STATEMENT_OPENING);
export const STATEMENT = {
  kind: 'statement', title: `Bank statement: ${BANK}, ${MONTH}`,
  lines: [['Opening balance', STATEMENT_OPENING], ...statementLines().map(([date, label, v, d]) => [`${shortDate(date)} ${label}`, v, d]), ['Closing balance', STATEMENT_CLOSING]],
  note: NOTE,
};

export const payStubs = () => PAYCHECKS.map((p) => ({ ...payStub(p.hours, { employer: EMPLOYER }), title: `Pay stub: two weeks to ${shortDate(p.date)}` }));

export const JOURNAL = (entries = ENTRIES, sheetNo = 1) => journal(entries.map((e) => [e.date, e.folio, e.explanation, e.lines.map(([id, dr, cr]) => [id, dr, cr, true])]), { sheetNo, name: PERSON });

const item = (id, amount) => ({ no: CHART[id].no, name: CHART[id].name, amount });
const bookPages = (stage) => BANK_PAGES.map((id) => item(id, balance(id, stage))).filter((x) => x.amount > 0);
export const BOOK_BALANCE = BANK_PAGES.reduce((s, id) => s + balance(id, 'month'), 0);
export const ADJUSTED_BANK = STATEMENT_CLOSING + OUTSTANDING.deposits.reduce((s, x) => s + x.amount, 0) - OUTSTANDING.payments.reduce((s, x) => s + x.amount, 0);

export const reconciliation = (extra = {}) => ({
  report: 'reconciliation', name: PERSON, date: '2026-07-31', statement: STATEMENT_CLOSING, ...OUTSTANDING,
  pages: bookPages('month'), interest: [{ label: 'Interest paid', amount: INTEREST }], fees: [{ label: 'Fee for another bank\'s ATM', amount: ATM_FEE }], ...extra,
});

export const trialBalance = (stage = 'bank', extra = {}) => ({
  report: 'trial-balance', name: PERSON, date: '2026-07-31',
  accounts: ledgerPages(stage).map(({ id, page }) => ({ id, page, last: balanceOf(page) })).filter(({ last }) => last.balance > 0)
    .map(({ page, last }) => ({ no: page.accountNo, name: page.account, [last.side === 'Dr' ? 'debit' : 'credit']: last.balance })),
  ...extra,
});
export const TRIAL_BALANCE_TOTAL = trialBalance().accounts.reduce((s, a) => s + (a.debit ?? 0), 0);

export const budgetPlan = (extra = {}) => ({ report: 'budget', name: PERSON, period: MONTH, lines: BUDGET_PLAN.map(([id, b]) => ({ no: CHART[id].no, name: CHART[id].name, budget: b })), ...extra });
export const budgetActual = (extra = {}) => ({ report: 'budget', name: PERSON, period: MONTH, lines: BUDGET_PLAN.map(([id, b]) => ({ no: CHART[id].no, name: CHART[id].name, budget: b, actual: balance(id, 'bank') })), ...extra });
export const BUDGET_TOTAL = BUDGET_PLAN.reduce((s, [, v]) => s + v, 0);
export const ACTUAL_TOTAL = BUDGET_PLAN.reduce((s, [id]) => s + balance(id, 'bank'), 0);

export const incomeStatement = (extra = {}) => ({
  report: 'income-statement', name: PERSON, period: MONTH,
  income: INCOME_IDS.map((id) => item(id, closingBalance(id))), expenses: EXPENSE_IDS.map((id) => item(id, closingBalance(id))), ...extra,
});
export const NET_WORTH_END = balance('net-worth', 'closed');
export const netWorthStatement = (extra = {}) => ({
  report: 'net-worth', name: PERSON, date: '2026-07-31',
  assets: kindIds('asset').map((id) => item(id, balance(id, 'closed'))).filter((x) => x.amount > 0),
  liabilities: kindIds('liability').map((id) => item(id, balance(id, 'closed'))).filter((x) => x.amount > 0), ...extra,
});
export const openingNetWorthStatement = (extra = {}) => ({
  report: 'net-worth', name: PERSON, date: '2026-06-30',
  assets: OPENING.filter(([id]) => isDebitSide(id) && openingOf(id) > 0).map(([id, v]) => item(id, v)),
  liabilities: OPENING.filter(([id]) => !isDebitSide(id)).map(([id, v]) => item(id, v)), ...extra,
});

// The month's events as a dated list, for learners working on paper. A
// paycheck points to its pay stub; a split points to the bucket rule.
const eventValue = ([, what, lines]) => {
  if (what.startsWith('Paycheck')) return 'see the pay stub';
  if (what.startsWith('Split')) return 'by the five-bucket split';
  return lines.reduce((s, [, dr]) => s + dr, 0);
};
export const EVENT_DOC = {
  kind: 'list', title: `What happened in ${MONTH}: ${PERSON}`,
  lines: EVENTS.map((e) => [`${shortDate(e[0])} ${e[1]}`, eventValue(e)]),
  note: `${NOTE} Record each line in your journal in this order.`,
};
export const PLAN_NOTE = `Plan: ${money(TO_EMERGENCY)} into the Emergency fund after each paycheck, and ${money(TO_SINKING)} into the Sinking fund once a month.`;
