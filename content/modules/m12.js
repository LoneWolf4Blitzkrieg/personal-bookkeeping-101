// Module 12: Month-end. Ideas: closing-entries, income-statement,
// net-worth-statement. Income and expense pages are closed straight into Net
// worth (30). The worked example finishes Sam's June books from Module 9.
// Amounts are illustrative.

import { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } from '../helpers.js';
import { M08_LESSON } from './m08.js';
import { M10_LESSON } from './m10.js';
import { M11_LESSON, M11_GATE } from './m11.js';

const num = (id, part, params, build) => ({ id, module: 'm12', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const item = (id, amount) => ({ no: CHART[id].no, name: CHART[id].name, amount });
const incomeStatement = (name, income, expenses, extra = {}) => ({ report: 'income-statement', name, period: 'June 2026', income, expenses, ...extra });
const netWorthStatement = (name, assets, liabilities, extra = {}) => ({ report: 'net-worth', name, date: '2026-06-30', assets, liabilities, ...extra });
const sum = (list) => list.reduce((s, x) => s + x.amount, 0);

// --- Question templates -----------------------------------------------------

const added = num('m12-added', 'interpreting', {
  wages: { min: 100000, max: 130000, step: 1 }, gifts: { min: 0, max: 6000, step: 500 }, rent: { min: 40000, max: 55000, step: 500 },
  groceries: { min: 15000, max: 30000, step: 1 }, phone: { min: 3500, max: 6000, step: 500 }, name: { pick: NAMES },
}, (p) => {
  const income = [item('wages', p.wages), ...(p.gifts ? [item('gifts', p.gifts)] : [])];
  const expenses = [item('rent', p.rent), item('groceries', p.groceries), item('phone', p.phone)];
  const answer = sum(income) - sum(expenses);
  return {
    prompt: `${p.name}'s income statement has its totals left blank. How much did the month add to ${p.name}'s net worth?`,
    report: incomeStatement(p.name, income, expenses, { ask: ['total-income', 'total-expenses', 'net'] }),
    answer,
    misconceptions: [{ cents: sum(income) + sum(expenses), explanation: 'Expenses are subtracted from income, not added to it.' }],
    explanation: `Income ${money(sum(income))} − expenses ${money(sum(expenses))} = ${money(answer)}.`,
  };
});

const nwStatement = num('m12-nw-statement', 'interpreting', {
  spending: { min: 20000, max: 70000, step: 1 }, saving: { min: 30000, max: 200000, step: 1 }, investing: { min: 5000, max: 60000, step: 1 },
  cash: { min: 500, max: 6000, step: 1 }, card: { min: 1000, max: 30000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const assets = [item('spending', p.spending), item('saving', p.saving), item('investing', p.investing), item('cash', p.cash)];
  const liabilities = [item('card', p.card)];
  const answer = sum(assets) - p.card;
  return {
    prompt: `${p.name}'s net-worth statement has its totals left blank. What is ${p.name}'s net worth?`,
    report: netWorthStatement(p.name, assets, liabilities, { ask: ['total-assets', 'total-liabilities', 'net'] }),
    answer,
    misconceptions: [{ cents: sum(assets) + p.card, explanation: 'What you owe is subtracted from what you own.' }],
    explanation: `Assets ${money(sum(assets))} − liabilities ${money(p.card)} = ${money(answer)}.`,
  };
});

// Every scenario closes two pages in one entry: three lines.
const CLOSE_ACCOUNTS = accountOptions(['net-worth', 'wages', 'gifts', 'interest-earned', 'rent', 'groceries', 'phone', 'eating-out']);
const CLOSE_EVENTS = {
  income: (p) => ({
    prompt: `Write the closing entry for the income pages: Wages has a credit balance of ${money(p.a)} and Gifts received ${money(p.b)}.`,
    answer: [{ account: 'wages', debit: p.a, credit: 0 }, { account: 'gifts', debit: p.b, credit: 0 }, { account: 'net-worth', debit: 0, credit: p.a + p.b }],
    explanation: `Each income page is debited to bring it to zero. Net worth is credited for both: ${money(p.a + p.b)}.`,
  }),
  expenses: (p) => ({
    prompt: `Write the closing entry for these expense pages: Rent has a debit balance of ${money(p.c)} and Groceries ${money(p.d)}.`,
    answer: [{ account: 'net-worth', debit: p.c + p.d, credit: 0 }, { account: 'rent', debit: 0, credit: p.c }, { account: 'groceries', debit: 0, credit: p.d }],
    explanation: `Each expense page is credited to bring it to zero. Net worth is debited for both: ${money(p.c + p.d)}.`,
  }),
  interest: (p) => ({
    prompt: `Write the closing entry for the income pages: Wages has a credit balance of ${money(p.a)} and Interest earned ${money(p.e)}.`,
    answer: [{ account: 'wages', debit: p.a, credit: 0 }, { account: 'interest-earned', debit: p.e, credit: 0 }, { account: 'net-worth', debit: 0, credit: p.a + p.e }],
    explanation: `Each income page is debited to bring it to zero. Net worth is credited for both: ${money(p.a + p.e)}.`,
  }),
  bills: (p) => ({
    prompt: `Write the closing entry for these expense pages: Phone has a debit balance of ${money(p.f)} and Eating out ${money(p.g)}.`,
    answer: [{ account: 'net-worth', debit: p.f + p.g, credit: 0 }, { account: 'phone', debit: 0, credit: p.f }, { account: 'eating-out', debit: 0, credit: p.g }],
    explanation: `Each expense page is credited to bring it to zero. Net worth is debited for both: ${money(p.f + p.g)}.`,
  }),
};
const recordClosing = {
  id: 'm12-record-closing', module: 'm12', kind: 'entry', part: 'producing', points: 4,
  params: {
    a: { min: 100000, max: 130000, step: 1 }, b: { min: 1000, max: 6000, step: 500 }, c: { min: 40000, max: 55000, step: 500 }, d: { min: 15000, max: 30000, step: 1 },
    e: { min: 20, max: 300, step: 1 }, f: { min: 3500, max: 6000, step: 500 }, g: { min: 2000, max: 9000, step: 1 }, event: { byVersion: Object.keys(CLOSE_EVENTS) },
  },
  build: (p) => ({ accounts: CLOSE_ACCOUNTS, ...CLOSE_EVENTS[p.event](p) }),
};

const explainMonthEnd = explainTemplate({
  id: 'm12-explain', module: 'm12',
  variants: [
    { prompt: 'In one or two sentences: why are income and expense pages closed at the end of each month?',
      modelAnswer: 'They measure one month. Closing moves their balances into Net worth, so each starts the next month at zero.',
      rubric: ['Says they measure one month (one period)', 'Says closing moves the balances into Net worth and starts them at zero'] },
    { prompt: 'In one or two sentences: what does the income statement show?',
      modelAnswer: 'The month\'s income and expenses, and the difference: what the month added to, or took from, your net worth.',
      rubric: ['Says it lists the month\'s income and expenses', 'Says the difference is what the month added to (or took from) net worth'] },
    { prompt: 'In one or two sentences: why must the net-worth statement agree with the Net worth page after closing?',
      modelAnswer: 'Both show what you own minus what you owe. Closing brought the month\'s income and expenses into the Net worth page, so the two must match.',
      rubric: ['Says both measure what you own minus what you owe', 'Says closing brings the month into the Net worth page, so the two must match'] },
    { prompt: 'In one or two sentences: why is an expense page credited when it is closed?',
      modelAnswer: 'An expense page has a debit balance. A credit of the same amount brings it to zero, and the matching debit goes to Net worth.',
      rubric: ['Says the expense page has a debit balance', 'Says a credit of the same amount brings it to zero (and Net worth is debited)'] },
  ],
});

const nwAfterClose = num('m12-nw-after-close', 'interpreting', { opening: { min: 20000, max: 150000, step: 1 }, income: { min: 100000, max: 130000, step: 1 }, expenses: { min: 60000, max: 99000, step: 1 } }, (p) => ({
  prompt: `Net worth started the month at ${money(p.opening)}. The month's income was ${money(p.income)} and its expenses ${money(p.expenses)}. After closing, what does the Net worth page show?`,
  answer: p.opening + p.income - p.expenses,
  misconceptions: [{ cents: p.opening + p.income + p.expenses, explanation: 'Closing the expenses debits Net worth: subtract them.' }],
  explanation: `${money(p.opening)} + ${money(p.income)} − ${money(p.expenses)} = ${money(p.opening + p.income - p.expenses)}.`,
}));

// Completion: the month-end figures from a trial balance. Wages is whatever
// makes the trial balance balance; the ranges keep it above the expenses.
const monthEndFigures = {
  id: 'm12-month-end-figures', module: 'm12', kind: 'amounts', part: 'producing', points: 4,
  params: { spending: { min: 40000, max: 70000, step: 1 }, saving: { min: 10000, max: 40000, step: 1 }, card: { min: 1000, max: 8000, step: 1 }, opening: { min: 5000, max: 20000, step: 1 }, rent: { min: 40000, max: 50000, step: 500 }, groceries: { min: 8000, max: 20000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const expenses = p.rent + p.groceries;
    const wages = p.spending + p.saving - p.card - p.opening + expenses;
    const net = wages - expenses;
    const accounts = [
      { no: 2, name: 'Spending bucket', debit: p.spending }, { no: 3, name: 'Saving bucket', debit: p.saving }, { no: 21, name: 'Credit card', credit: p.card },
      { no: 30, name: 'Net worth', credit: p.opening }, { no: 40, name: 'Wages', credit: wages }, { no: 51, name: 'Rent', debit: p.rent }, { no: 52, name: 'Groceries', debit: p.groceries },
    ];
    return {
      prompt: `From ${p.name}'s trial balance before closing, work out the month-end figures.`,
      report: { report: 'trial-balance', name: p.name, date: '2026-06-30', accounts },
      fields: [['Total expenses', expenses], ['Added to net worth this month', net], ['Net worth after closing', p.opening + net], ['Total assets on the net-worth statement', p.spending + p.saving]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: `Expenses ${money(p.rent)} + ${money(p.groceries)} = ${money(expenses)}. Added: ${money(wages)} − ${money(expenses)} = ${money(net)}. Net worth: ${money(p.opening)} + ${money(net)} = ${money(p.opening + net)}. Assets: ${money(p.spending)} + ${money(p.saving)} = ${money(p.spending + p.saving)}; minus ${money(p.card)} owed gives the same net worth.`,
    };
  },
};

// --- Lesson -------------------------------------------------------------------

// Sam's June (trial balance in Module 9).
const EXPENSES = [item('taxes', 17854), item('rent', 45000), item('groceries', 9640), item('eating-out', 3175)];
const INCOME = [item('wages', 121200)];
const closingJournal = journal([
  ['2026-06-30', 'J6', 'Close income to net worth', [['wages', 121200, 0, true], ['net-worth', 0, 121200, true]]],
  ['2026-06-30', 'J6', 'Close expenses to net worth', [['net-worth', 75669, 0, true], ['taxes', 0, 17854, true], ['rent', 0, 45000, true], ['groceries', 0, 9640, true], ['eating-out', 0, 3175, true]]],
], { sheetNo: 6, name: 'Sam (example)' });
const netWorthPage = (askFrom = null) => chartPage('net-worth', [
  ['2026-06-01', 'Opening net worth', '', 0, 30000],
  ['2026-06-30', 'Closing: income', 'J6', 0, 121200, true],
  ['2026-06-30', 'Closing: expenses', 'J6', 75669, 0, true],
], { name: 'Sam (example)', askFrom });
const JUNE_ASSETS = [item('spending', 62694), item('saving', 15502), item('cash', 2240)];
const JUNE_LIABILITIES = [item('card', 4905)];
const OTHER_INCOME = [item('wages', 98000), item('gifts', 4000)];
const OTHER_EXPENSES = [item('rent', 45000), item('groceries', 21035), item('phone', 4500)];
const OTHER_ASSETS = [item('spending', 51240), item('saving', 98000), item('investing', 20670), item('cash', 3125)];

export const M12_LESSON = {
  id: 'm12',
  title: 'Month-end',
  coreIdea: 'At month-end, close the income and expense pages into Net worth. The income statement shows what the month added. The net-worth statement shows what you own minus what you owe. It must equal the Net worth page.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['budget-vs-actual'],
      text: ['From Module 11: eating out had a budget of $80.00 and actual spending of $104.50. By how much is it over?'],
      answer: 2450,
      explanation: '$104.50 − $80.00 = $24.50 over.',
    },
    {
      id: 'closing', kind: 'explain', title: 'Closing the month', uses: ['closing-entries', 'debit-credit-rules', 'journal-entry'],
      text: [
        'Income and expense pages measure one month. At month-end, close them: move each balance into Net worth (30), so each page starts the next month at zero.',
        'An income page has a credit balance, so it is closed with a debit: debit Wages and credit Net worth. An expense page has a debit balance, so it is closed with a credit: credit each expense and debit Net worth for the total.',
        'These are Sam\'s closing entries for June, from the trial balance in Module 9. Afterward, Net worth has grown by the month\'s income minus its expenses.',
      ],
      prompt: 'Why is Wages debited to close it?',
      promptAnswer: 'Wages has a credit balance. A debit of the same amount brings it to zero and moves the amount into Net worth.',
      journalPage: closingJournal,
      highlightEntry: 0,
      ledger: chartPage('wages', [['2026-06-19', 'Paycheck', 'J3', 0, 121200, true], ['2026-06-30', 'Closing to net worth', 'J6', 121200, 0, true]], { name: 'Sam (example)' }),
      highlightRow: 1,
    },
    {
      id: 'predict-close', kind: 'predict', title: 'Predict: Net worth after closing', uses: ['closing-entries'],
      text: ['Sam\'s two closing entries are posted to the Net worth page. What does it show after the last line?'],
      journalPage: closingJournal,
      ledger: netWorthPage(2),
      highlightRow: 2,
      answer: 75531,
      misconceptions: [{ cents: 226869, explanation: 'Closing the expenses debits Net worth: subtract.' }],
      explanation: '$300.00 + $1,212.00 − $756.69 = $755.31.',
    },
    {
      id: 'income-statement', kind: 'explain', title: 'The income statement', uses: ['income-statement', 'trial-balance'],
      text: [
        'Before closing, the income and expense balances tell the story of the month. The income statement lists them: total income, total expenses, and the difference.',
        'The difference is what the month added to your net worth. If expenses were more than income, it is what the month took from it.',
        'Take the figures from the trial balance, before the closing entries.',
      ],
      prompt: 'Where do the figures on the income statement come from?',
      promptAnswer: 'From the income and expense balances at month-end, before closing: the trial balance lists them.',
      report: incomeStatement('Sam (example)', INCOME, EXPENSES),
    },
    {
      id: 'predict-added', kind: 'predict', title: 'Predict: what the month added', uses: ['income-statement'],
      text: ['This income statement has its totals left blank. How much did the month add to net worth?'],
      report: incomeStatement('Maya (example)', OTHER_INCOME, OTHER_EXPENSES, { ask: ['total-income', 'total-expenses', 'net'] }),
      answer: sum(OTHER_INCOME) - sum(OTHER_EXPENSES),
      misconceptions: [{ cents: sum(OTHER_INCOME) + sum(OTHER_EXPENSES), explanation: 'Expenses are subtracted from income.' }],
      explanation: '$980.00 + $40.00 = $1,020.00 income. $450.00 + $210.35 + $45.00 = $705.35 expenses. $1,020.00 − $705.35 = $314.65.',
    },
    {
      id: 'net-worth-statement', kind: 'explain', title: 'The net-worth statement', uses: ['net-worth-statement', 'accounting-equation', 'closing-entries'],
      text: [
        'The net-worth statement lists, on one date, everything you own and everything you owe. What you own minus what you owe is your net worth.',
        'It must equal the Net worth page after closing. A match is the last check that the month\'s books add up. Like the trial balance, it cannot catch an amount posted to the wrong page.',
        'Sam: $804.36 owned − $49.05 owed = $755.31, the same as the Net worth page.',
      ],
      prompt: 'Why should the net-worth statement agree with the Net worth page after closing?',
      promptAnswer: 'Both show what you own minus what you owe. Closing brought the month\'s income and expenses into the Net worth page, so the two must match.',
      report: netWorthStatement('Sam (example)', JUNE_ASSETS, JUNE_LIABILITIES),
      ledger: netWorthPage(),
      highlightRow: 2,
    },
    {
      id: 'predict-net-worth', kind: 'predict', title: 'Predict: net worth', uses: ['net-worth-statement'],
      text: ['This net-worth statement has its totals left blank. What is the net worth?'],
      report: netWorthStatement('Maya (example)', OTHER_ASSETS, [item('card', 12835)], { ask: ['total-assets', 'total-liabilities', 'net'] }),
      answer: sum(OTHER_ASSETS) - 12835,
      misconceptions: [{ cents: sum(OTHER_ASSETS) + 12835, explanation: 'What you owe is subtracted from what you own.' }],
      explanation: '$512.40 + $980.00 + $206.70 + $31.25 = $1,730.35 owned. $1,730.35 − $128.35 = $1,602.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['closing-entries'],
      text: ['Closing Maya\'s expense pages. Step 1 is done: Rent ($450.00), Groceries ($210.35) and Phone ($45.00) are each credited. Finish Step 2: how much is debited to Net worth?'],
      answer: 70535,
      misconceptions: [{ cents: 45000, explanation: 'One debit to Net worth covers all three expense pages.' }],
      explanation: '$450.00 + $210.35 + $45.00 = $705.35.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['closing-entries', 'income-statement'],
      text: ['Net worth started the month at $600.00. The month\'s income was $1,212.00 and its expenses $940.18. After closing, what does the Net worth page show?'],
      answer: 87182,
      misconceptions: [{ cents: 275218, explanation: 'Closing the expenses debits Net worth: subtract them.' }],
      explanation: '$600.00 + $1,212.00 − $940.18 = $871.82.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['income-statement'],
      text: ['Income: Wages $1,212.00. Expenses: $1,046.75 in all. How much did the month add to net worth?'],
      answer: 16525,
      explanation: '$1,212.00 − $1,046.75 = $165.25.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['net-worth-statement'],
      text: ['A net-worth statement shows assets of $1,450.00 and liabilities of $230.40. What is the net worth?'],
      answer: 121960,
      misconceptions: [{ cents: 168040, explanation: 'Subtract what you owe.' }],
      explanation: '$1,450.00 − $230.40 = $1,219.60.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['closing-entries'],
      text: ['Wages ($1,212.00) and Interest earned ($0.85) are closed in one entry. How much is credited to Net worth?'],
      answer: 121285,
      explanation: '$1,212.00 + $0.85 = $1,212.85.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [added, nwStatement].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M12_GATE = { id: 'm12', kind: 'gate', title: 'Module 12 check', templates: [added, nwStatement, recordClosing, explainMonthEnd] };

// Fluency drill on the core operation: one debit to Net worth closes the expenses.
const drill = [1, 2, 3].map((n) => num(`m12-drill-${n}`, 'interpreting', { a: { min: 1000, max: 60000, step: 1 }, b: { min: 500, max: 30000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: two expense pages show ${money(p.a)} and ${money(p.b)}. Closing them debits Net worth by how much?`, answer: p.a + p.b,
  explanation: `${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

const bvaMixed = { ...M11_GATE.templates.find((t) => t.part === 'producing'), id: 'm11-bva-from-pages-mixed-m12' };

export const M12_PRACTICE = {
  id: 'm12-practice', kind: 'practice', module: 'm12', title: 'Module 12 practice set',
  templates: [...M11_LESSON.recallTemplates, ...M10_LESSON.recallTemplates, ...M08_LESSON.recallTemplates, ...drill, added, nwStatement, nwAfterClose, monthEndFigures, recordClosing, bvaMixed, { ...explainMonthEnd, id: 'm12-explain-practice' }],
};

export const M12_EXTRA = {
  id: 'm12-extra', kind: 'practice', module: 'm12', title: 'Module 12 extra practice',
  templates: [added, nwAfterClose, recordClosing].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M12_REMEDIAL = {
  id: 'm12-remedial', kind: 'practice', module: 'm12', title: 'Module 12: common mistakes',
  templates: [nwStatement, monthEndFigures, recordClosing].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint C draws from this module.
export const M12_CHECKPOINT = [added, nwStatement, recordClosing, explainMonthEnd];
