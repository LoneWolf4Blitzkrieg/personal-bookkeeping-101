// Shared building blocks for course content.

import { percentOf, formatCents } from '../js/money.js';
import { paycheck } from '../js/paycheck.js';
import { TAX_2026 } from './tax2026.js';

export const money = (cents) => `$${formatCents(cents)}`;

export const NAMES = ['Jordan', 'Maya', 'Luis', 'Ana', 'Devon', 'Kai', 'Rosa', 'Eli'];

// The course's suggested split of take-home pay. Spending gets whatever is
// left after the other four, so the buckets always add up to the paycheck.
export const BUCKET_RATES = { saving: 0.15, investing: 0.10, charity: 0.05, blow: 0.10 };

export function splitBuckets(takeHomeCents) {
  const saving = percentOf(takeHomeCents, BUCKET_RATES.saving);
  const investing = percentOf(takeHomeCents, BUCKET_RATES.investing);
  const charity = percentOf(takeHomeCents, BUCKET_RATES.charity);
  const blow = percentOf(takeHomeCents, BUCKET_RATES.blow);
  return { saving, investing, charity, blow, spending: takeHomeCents - saving - investing - charity - blow };
}

// A two-week paycheck at the 2026 Arizona minimum wage.
export function standardPaycheck(hours = 80) {
  return paycheck({ rateCents: TAX_2026.azMinimumWageCents, hours, tax: TAX_2026 });
}

export const PAYCHECK_SOURCES = ['azica-min-wage-2026', 'ssa-cola-2026', 'irs-p15t-2026', 'azdor-a4-2026'];

// A pay stub as a source document (amounts in cents).
export function payStub(hours, { employer = 'Sunny Days Car Wash (fictional)', detail = true } = {}) {
  const p = standardPaycheck(hours);
  const lines = [
    ['Employer', employer],
    ['Hours', `${hours} at $15.15`],
    ['Gross pay', p.gross],
  ];
  if (detail) {
    lines.push(['Social Security (6.2%)', p.socialSecurity], ['Medicare (1.45%)', p.medicare], ['Federal income tax', p.federal], ['Arizona income tax (2.0%)', p.arizona], ['Take-home pay', p.net]);
  }
  return { kind: 'paystub', title: 'Pay stub: two weeks', lines, note: 'Employer is fictional; rates are the real 2026 figures.' };
}

// Builds an explanation template from a list of prompt variants, so each
// gate version asks a differently worded question.
export function explainTemplate({ id, module, part = 'explaining', points = 2, variants }) {
  return {
    id, module, kind: 'explain', part, points,
    params: { variant: { pick: variants.map((_, i) => i) } },
    build: (p) => ({ ...variants[p.variant] }),
  };
}

// The exact, unrounded percentage of an amount, written as dollars (at least
// two decimal places): exactPercent(121200, 0.062) -> "$75.144". Explanations
// show this so learners round once, at the end.
export function exactPercent(cents, rate) {
  const scaled = BigInt(Math.round(rate * 1e6)) * BigInt(cents); // dollars × 10^8
  const whole = scaled / 100000000n;
  let frac = (scaled % 100000000n).toString().padStart(8, '0').replace(/0+$/, '');
  if (frac.length < 2) frac = frac.padEnd(2, '0');
  return `$${whole.toLocaleString('en-US')}.${frac}`;
}

// --- Credit cards (Module 8) -------------------------------------------------
// APRs are whole basis points (22.15% = 2215). A month's interest is taught as
// balance × APR ÷ 12; the exact amount is cut after the thousandths of a
// dollar and rounded once by the thousandths rule. (Card companies work it
// out day by day; the lesson says so.)

export function monthlyInterest(balanceCents, aprBasisPoints) {
  if (!Number.isSafeInteger(balanceCents) || balanceCents < 0) throw new TypeError(`Expected whole cents, got ${balanceCents}`);
  const tenthsOfCents = (BigInt(balanceCents) * BigInt(aprBasisPoints) * 10n) / 120000n;
  return Number(tenthsOfCents / 10n + (tenthsOfCents % 10n >= 5n ? 1n : 0n));
}

// The unrounded month's interest in dollars, to four decimal places, with
// "…" when more digits follow: exactMonthlyInterest(50000, 2215) -> "$9.2291…".
export function exactMonthlyInterest(balanceCents, aprBasisPoints) {
  const numerator = BigInt(balanceCents) * BigInt(aprBasisPoints); // cents × 120000
  const tenThousandths = (numerator * 100n) / 120000n; // dollars × 10^4
  const more = (numerator * 100n) % 120000n !== 0n;
  const whole = tenThousandths / 10000n;
  let frac = (tenThousandths % 10000n).toString().padStart(4, '0');
  if (!more) frac = frac.replace(/0+$/, '').padEnd(2, '0');
  return `$${whole.toLocaleString('en-US')}.${frac}${more ? '…' : ''}`;
}

// The course's example minimum-payment rule: the month's interest plus 1% of
// the balance, or $25.00 if that is more, but never more than is owed.
export const MINIMUM_RULE = 'the month\'s interest plus 1% of the balance, or $25.00 if that is more';

export function minimumPayment(balanceCents, interestCents) {
  const rule = Math.max(2500, interestCents + percentOf(balanceCents, 0.01));
  return Math.min(rule, balanceCents + interestCents);
}

// Month-by-month payoff with no new charges: { months, interest, rows }.
// Pays the example minimum unless a fixed monthly payment is given.
export function payoff(balanceCents, aprBasisPoints, { payment = null } = {}) {
  const rows = [];
  let balance = balanceCents;
  let interest = 0;
  while (balance > 0) {
    const charge = monthlyInterest(balance, aprBasisPoints);
    const paid = payment === null ? minimumPayment(balance, charge) : Math.min(payment, balance + charge);
    if (paid <= charge) throw new Error('This payment never pays the balance off: it does not cover the interest.');
    balance = balance + charge - paid;
    interest += charge;
    rows.push({ interest: charge, payment: paid, balance });
  }
  return { months: rows.length, interest, rows };
}

// --- The chart of accounts (Module 5 on) --------------------------------------
// Numbers are grouped by kind: 1–19 assets, 20–29 liabilities, 30 net worth,
// 40–49 income, 50–99 expenses.

export const CHART = {
  checking: { no: 1, name: 'Checking', type: 'asset' },
  spending: { no: 2, name: 'Spending bucket', type: 'asset' },
  saving: { no: 3, name: 'Saving bucket', type: 'asset' },
  investing: { no: 4, name: 'Investing bucket', type: 'asset' },
  charity: { no: 5, name: 'Charity bucket', type: 'asset' },
  blow: { no: 6, name: 'Blow money', type: 'asset' },
  cash: { no: 7, name: 'Cash', type: 'asset' },
  'owed-friend': { no: 20, name: 'Owed to a friend', type: 'liability' },
  card: { no: 21, name: 'Credit card', type: 'liability' },
  'net-worth': { no: 30, name: 'Net worth', type: 'networth' },
  wages: { no: 40, name: 'Wages', type: 'income' },
  gifts: { no: 41, name: 'Gifts received', type: 'income' },
  taxes: { no: 50, name: 'Taxes withheld', type: 'expense' },
  rent: { no: 51, name: 'Rent', type: 'expense' },
  groceries: { no: 52, name: 'Groceries', type: 'expense' },
  'eating-out': { no: 53, name: 'Eating out', type: 'expense' },
  transport: { no: 54, name: 'Transportation', type: 'expense' },
  phone: { no: 55, name: 'Phone', type: 'expense' },
  fun: { no: 56, name: 'Fun', type: 'expense' },
  donations: { no: 57, name: 'Donations', type: 'expense' },
  'card-interest': { no: 58, name: 'Card interest', type: 'expense' },
  household: { no: 59, name: 'Household supplies', type: 'expense' },
};

const TYPE_WORDS = { asset: 'asset', liability: 'liability', networth: 'net worth', income: 'income', expense: 'expense' };

export const accountLabel = (id) => `${CHART[id].no} ${CHART[id].name} (${TYPE_WORDS[CHART[id].type]})`;
export const accountOptions = (ids) => ids.map((id) => ({ id, label: accountLabel(id) }));

// A ledger page for an account in the chart. Rows are
// [date, items, folio, debit, credit, ticked?]; a ticked row has the posting
// mark on the side its amount is on. Rows from askFrom on ask for the
// balance and side.
export function chartPage(id, rows, { name = 'Jordan (example)', sheetNo = 1, askFrom = null, creditLimit } = {}) {
  const a = CHART[id];
  return {
    sheetNo, accountNo: a.no, name, account: a.name, type: a.type,
    ...(creditLimit ? { creditLimit } : {}),
    rows: rows.map(([date, items, folio, debit, credit, ticked = false], i) => ({
      date, items, folio, debit, credit, posted: [ticked && debit > 0, ticked && credit > 0],
      ...(askFrom !== null && i >= askFrom ? { ask: ['balance', 'side'] } : {}),
    })),
  };
}

// A journal page. Entries are [date, folio, explanation, lines], with lines
// [accountId, debit, credit, posted?]; a posted line shows the ledger
// account number in the journal's Folio column.
export function journal(entries, { sheetNo = 1, name = 'Jordan (example)' } = {}) {
  return {
    sheetNo, name,
    entries: entries.map(([date, folio, explanation, lines]) => ({
      date, folio, explanation,
      lines: lines.map(([account, debit, credit, posted = false]) => ({ account, label: CHART[account].name, debit, credit, folio: posted ? String(CHART[account].no) : '' })),
    })),
  };
}
