// Module 5: Your chart of accounts. Ideas: personal-accounts, account-numbers,
// folio-reference. From here the Folio column is used: until the journal
// (Module 6) it holds the number of the page with the other side of the
// entry. Amounts are illustrative.

import { money, NAMES, explainTemplate, CHART, accountOptions, chartPage } from '../helpers.js';
import { M01_LESSON } from './m01.js';
import { M03_LESSON } from './m03.js';
import { M04_LESSON, M04_GATE } from './m04.js';

const num = (id, part, params, build) => ({ id, module: 'm05', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const no = (id) => CHART[id].no;
const balancesList = (pairs) => pairs.map(([id, cents]) => `account ${no(id)}, ${money(cents)}`).join('; ');

// The chart of accounts, one line per group, from CHART.
const GROUPS = [['asset', 'Assets'], ['liability', 'Liabilities'], ['networth', 'Net worth'], ['income', 'Income'], ['expense', 'Expenses']];
const CHART_LINES = GROUPS.map(([type, word]) => `${word}: ${Object.values(CHART).filter((a) => a.type === type).map((a) => `${a.no} ${a.name}`).join(', ')}.`);

// --- Question templates -----------------------------------------------------

const GROUP_WORDS = {
  assets: { ids: ['spending', 'saving'], range: '1 to 19', kind: 'assets' },
  expenses: { ids: ['groceries', 'phone'], range: '50 to 99', kind: 'expenses' },
};

const groupTotal = num('m05-group-total', 'interpreting', {
  spending: { min: 10000, max: 60000, step: 1 }, saving: { min: 20000, max: 200000, step: 1 }, card: { min: 1000, max: 50000, step: 1 },
  groceries: { min: 1000, max: 20000, step: 1 }, phone: { min: 2000, max: 8000, step: 1 }, group: { pick: ['assets', 'expenses'] }, name: { pick: NAMES },
}, (p) => {
  const g = GROUP_WORDS[p.group];
  const list = [['spending', p.spending], ['saving', p.saving], ['card', p.card], ['groceries', p.groceries], ['phone', p.phone]];
  const answer = g.ids.reduce((s, id) => s + p[id], 0);
  return {
    prompt: `${p.name}'s pages show these balances: ${balancesList(list)}. Using the account numbers, what is the total of the ${g.kind}?`,
    answer,
    misconceptions: [{ cents: answer + p.card, explanation: 'Account 21 is between 20 and 29, so it is a liability.' }],
    explanation: `The ${g.kind} are numbered ${g.range}: accounts ${g.ids.map(no).join(' and ')}. ${g.ids.map((id) => money(p[id])).join(' + ')} = ${money(answer)}.`,
  };
});

// Two transfers on the same day for the same amount: only the folio tells
// which line matches the other page.
const TRANSFER_TARGETS = ['saving', 'cash', 'blow'];
const followFolio = num('m05-follow-folio', 'interpreting', {
  start: { min: 30000, max: 70000, step: 1 }, move: { min: 2000, max: 9000, step: 1 },
  first: { pick: [0, 1, 2] }, second: { pick: [1, 2] }, matchFirst: { pick: [true, false] }, name: { pick: NAMES },
}, (p) => {
  const a = TRANSFER_TARGETS[p.first];
  const b = TRANSFER_TARGETS[(p.first + p.second) % 3];
  const target = p.matchFirst ? a : b;
  const afterFirst = p.start - p.move;
  const afterSecond = p.start - 2 * p.move;
  const answer = p.matchFirst ? afterFirst : afterSecond;
  const other = p.matchFirst ? afterSecond : afterFirst;
  return {
    prompt: `Both lines dated Jun 10 on ${p.name}'s Spending bucket page say only "Transfer". The ${CHART[target].name} page (account ${no(target)}) has this line: Jun 10, folio 2, debit ${money(p.move)}. Which Spending line matches it? What is the Spending balance right after that line?`,
    ledger: chartPage('spending', [
      ['2026-06-06', 'Brought forward', '', p.start, 0],
      ['2026-06-10', 'Transfer', String(no(a)), 0, p.move],
      ['2026-06-10', 'Transfer', String(no(b)), 0, p.move],
    ], { name: p.name, askFrom: 1 }),
    highlightRow: null,
    answer,
    misconceptions: [{ cents: other, explanation: `That is the balance after the other transfer. The matching line has folio ${no(target)}, the number of the ${CHART[target].name} page.` }],
    explanation: `The matching line is the one with folio ${no(target)}. The balance after it is ${money(answer)}.`,
  };
});

const RECORD_ACCOUNTS = accountOptions(['checking', 'spending', 'saving', 'cash', 'gifts', 'phone']);
const RECORD_EVENTS = {
  atm: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you take ${money(p.amount)} out of account 2 as cash for your wallet, account 7.`,
    answer: [{ account: 'cash', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Accounts 7 and 2 are both assets (1 to 19). Account 7, Cash, goes up: debit. Account 2, the Spending bucket, goes down: credit.',
  }),
  gift: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: a relative gives you ${money(p.amount)} in cash. Use account 7 for the cash and account 41 for the gift.`,
    answer: [{ account: 'cash', debit: p.amount, credit: 0 }, { account: 'gifts', debit: 0, credit: p.amount }],
    explanation: 'Account 7, Cash, is an asset (1 to 19) and goes up: debit. Account 41, Gifts received, is income (40 to 49) and goes up: credit.',
  }),
  phone: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you pay a ${money(p.amount)} bill that belongs on account 55, from account 2.`,
    answer: [{ account: 'phone', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Account 55, Phone, is an expense (50 to 99) and goes up: debit. Account 2, the Spending bucket, is an asset (1 to 19) and goes down: credit.',
  }),
  save: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you move ${money(p.amount)} from account 2 to account 3.`,
    answer: [{ account: 'saving', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Accounts 3 and 2 are both assets (1 to 19). Account 3, the Saving bucket, goes up: debit. Account 2, the Spending bucket, goes down: credit.',
  }),
};
const recordNumbers = {
  id: 'm05-record-numbers', module: 'm05', kind: 'entry', part: 'producing', points: 4,
  // Each gate version gets a different scenario; all four are two-line entries.
  params: { amount: { min: 1000, max: 15000, step: 1 }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

const explainChart = explainTemplate({
  id: 'm05-explain', module: 'm05',
  variants: [
    { prompt: 'In one or two sentences: why are account numbers grouped by kind of account?',
      modelAnswer: 'So the number alone tells you what kind of account a page is, and so which side makes it go up. Pages of the same kind also stay together.',
      rubric: ['Says the number shows the kind of account', 'Says this tells you how the account behaves, or keeps the pages in order'] },
    { prompt: 'In one or two sentences: what does the Folio column on a ledger line tell you?',
      modelAnswer: 'It gives the number of the page that holds the other side of the entry, so you can find the matching line.',
      rubric: ['Says it holds the number of another page', 'Says that page has the other side (the matching line) of the entry'] },
    { prompt: 'In one or two sentences: why does each kind of spending get its own expense page?',
      modelAnswer: 'So you can see how much went to each thing, such as groceries compared with eating out, and plan from it.',
      rubric: ['Says each kind of spending is kept apart', 'Says this shows how much went to each one (to plan or budget)'] },
    { prompt: 'In one or two sentences: Cash and Checking are both your money. Why do they get separate pages?',
      modelAnswer: 'The money is held in different places: your wallet and the bank. Separate pages show how much is in each, and you can check each page against what is really there.',
      rubric: ['Says the money is held in different places', 'Says separate pages show (or let you check) how much is in each'] },
  ],
});

const netWorthChart = num('m05-net-worth-chart', 'interpreting', {
  spending: { min: 10000, max: 50000, step: 1 }, saving: { min: 20000, max: 150000, step: 1 }, cash: { min: 500, max: 9000, step: 1 },
  // What is owed stays below what is owned, so net worth is never below zero.
  friend: { min: 1000, max: 6000, step: 1 }, card: { min: 1000, max: 15000, step: 1 },
}, (p) => {
  const own = p.spending + p.saving + p.cash;
  const owe = p.friend + p.card;
  return {
    prompt: `These pages show balances: ${balancesList([['spending', p.spending], ['saving', p.saving], ['cash', p.cash], ['owed-friend', p.friend], ['card', p.card]])}. What is the net worth?`,
    answer: own - owe,
    misconceptions: [{ cents: own + owe, explanation: 'Accounts 20 and 21 are liabilities (20 to 29): subtract what you owe.' }],
    explanation: `Assets (accounts 2, 3 and 7): ${money(own)}. Liabilities (accounts 20 and 21): ${money(owe)}. ${money(own)} − ${money(owe)} = ${money(own - owe)}.`,
  };
});

// Completion: the learner fills in the balances on a page with folios.
const folioBalances = {
  id: 'm05-folio-balances', module: 'm05', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 50000, step: 1 }, a: { min: 1000, max: 8000, step: 1 }, b: { min: 2000, max: 6000, step: 1 }, c: { min: 20000, max: 60000, step: 1 }, d: { min: 2000, max: 7000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const moves = [[0, p.a], [0, p.b], [p.c, 0], [0, p.d]];
    let b = p.start;
    const balances = moves.map(([dr, cr]) => (b += dr - cr));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending bucket page. Use each line's folio to see where the money came from or went.`,
      ledger: chartPage('spending', [
        ['2026-06-06', 'Brought forward', '', p.start, 0],
        ['2026-06-08', 'Groceries', '52', 0, p.a],
        ['2026-06-09', 'Transfer', '7', 0, p.b],
        ['2026-06-12', 'From Checking', '1', p.c, 0],
        ['2026-06-13', 'Phone bill', '55', 0, p.d],
      ], { name: p.name, askFrom: 1 }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Credits take money out of this asset and debits put it in. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

const incomeTotal = num('m05-income-total', 'interpreting', {
  wages: { min: 90000, max: 130000, step: 1 }, gifts: { min: 1000, max: 8000, step: 1 }, spending: { min: 10000, max: 60000, step: 1 }, groceries: { min: 2000, max: 20000, step: 1 }, card: { min: 1000, max: 30000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const answer = p.wages + p.gifts;
  return {
    prompt: `${p.name}'s pages show these balances: ${balancesList([['spending', p.spending], ['card', p.card], ['wages', p.wages], ['gifts', p.gifts], ['groceries', p.groceries]])}. Using the account numbers, what is the total of the income accounts?`,
    answer,
    misconceptions: [{ cents: answer + p.spending, explanation: 'Account 2 is an asset (1 to 19). Income accounts are numbered 40 to 49.' }],
    explanation: `Income accounts are numbered 40 to 49. Here that means accounts 40 and 41. ${money(p.wages)} + ${money(p.gifts)} = ${money(answer)}.`,
  };
});

// Follow a folio to the other page and work out its balance there.
const folioOtherPage = num('m05-folio-other-page', 'interpreting', { before: { min: 9000, max: 30000, step: 1 }, amount: { min: 500, max: 9000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Spending bucket page (account 2) has this line: Jun 14, Groceries, folio 52, credit ${money(p.amount)}. Just before the matching line, the page that folio points to showed a debit balance of ${money(p.before)}. What is that page's balance after the matching line?`,
  answer: p.before + p.amount,
  misconceptions: [{ cents: p.before - p.amount, explanation: 'That subtracts. Folio 52 is Groceries, an expense (50 to 99). The matching line there is a debit, so the balance goes up.' }],
  explanation: `Folio 52 is the Groceries page. The Spending credit is matched by a Groceries debit: ${money(p.before)} + ${money(p.amount)} = ${money(p.before + p.amount)}.`,
}));

const cashAfter = num('m05-cash-after', 'interpreting', { before: { min: 500, max: 9000, step: 1 }, amount: { min: 2000, max: 8000, step: 100 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Cash page (account 7) shows ${money(p.before)}. A line on the Spending bucket page reads: To Cash, folio 7, credit ${money(p.amount)}. What does the Cash page show after the matching line?`,
  answer: p.before + p.amount,
  misconceptions: [{ cents: Math.abs(p.before - p.amount), explanation: 'Money leaving the Spending bucket arrives in Cash. The matching line on the Cash page is a debit, so add.' }],
  explanation: `The Spending credit is matched by a debit on the Cash page: ${money(p.before)} + ${money(p.amount)} = ${money(p.before + p.amount)}.`,
}));

// --- Lesson -------------------------------------------------------------------

export const M05_LESSON = {
  id: 'm05',
  title: 'Your chart of accounts',
  coreIdea: 'Every account has its own page and number, and the number tells you what kind of account it is. The Folio column on each line points to the page with the other side of the entry.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['gross-vs-net', 'recording-paycheck'],
      text: ['From Module 4: a paycheck has gross pay of $1,212.00 and take-home pay of $1,033.46. How much is debited to Taxes withheld?'],
      answer: 17854,
      explanation: '$1,212.00 − $1,033.46 = $178.54, the four taxes together.',
    },
    {
      id: 'accounts', kind: 'explain', title: 'One page for each account', uses: ['personal-accounts', 'accounting-equation'],
      text: [
        'Your books have one ledger page for each account. A personal set of books uses the five kinds of account you met in Module 3.',
        'Assets (what you own): Cash, the money in your wallet. Checking, take-home pay that has reached the bank and is not yet split into buckets. Your five bucket pages are assets too.',
        'Liabilities (what you owe): a credit card (Module 8) and any money you owe a person. Net worth: one page that records what you were worth on the day you started your books.',
        'Income: Wages, and Gifts received for money people give you. Expenses: one page for each kind of spending, such as Rent, Groceries, Eating out, Transportation and Phone.',
      ],
      prompt: 'Why give each kind of spending its own expense page instead of one page for everything you spend?',
      promptAnswer: 'So you can see how much went to each thing, such as groceries compared with eating out, and plan next month from it.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'From Spending bucket', '', 4000, 0]]),
        chartPage('groceries', [['2026-06-08', 'Desert Mart (fictional)', '', 2136, 0]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-expense', kind: 'predict', title: 'Predict: an expense page', uses: ['personal-accounts', 'debit-credit-rules'],
      text: ['Kai\'s Transportation page (an expense) shows a debit balance of $28.50. He buys a $52.00 bus pass with money from the Spending bucket. What is the Transportation balance now?'],
      answer: 8050,
      misconceptions: [{ cents: 2350, explanation: 'An expense goes up with a debit, so add.' }],
      explanation: 'Transportation is an expense, so the bus pass is a debit: $28.50 + $52.00 = $80.50.',
    },
    {
      id: 'numbers', kind: 'explain', title: 'Account numbers', uses: ['account-numbers', 'personal-accounts'],
      text: [
        'Each page has an account number in its header. The numbers are grouped by kind of account, so the number alone tells you what kind of account a page is. Accounts 1 to 19 are assets, 20 to 29 are liabilities, 30 is net worth, 40 to 49 are income, and 50 to 99 are expenses.',
        'The list of every account and its number is your chart of accounts. This course uses this one:',
        ...CHART_LINES,
        'Your own chart can have different expense pages. Keep the groups, and give a new page the next free number in its group. Keep the pages in number order, so any page is easy to find.',
      ],
      prompt: 'Account 63 is not on this list. If you added it, what kind of account would it be, and how can you tell?',
      promptAnswer: 'An expense, because every number from 50 to 99 is an expense.',
      ledger: chartPage('groceries', [['2026-06-08', 'Desert Mart (fictional)', '', 2136, 0]]),
    },
    {
      id: 'predict-group', kind: 'predict', title: 'Predict: adding up a group', uses: ['account-numbers'],
      text: ['These pages show balances: account 2, $410.00; account 3, $1,250.00; account 21, $380.00; account 52, $96.40. What is the total of the assets?'],
      answer: 166000,
      misconceptions: [{ cents: 204000, explanation: 'Account 21 is between 20 and 29, so it is a liability, not an asset.' }],
      explanation: 'Assets are numbered 1 to 19: accounts 2 and 3. $410.00 + $1,250.00 = $1,660.00.',
    },
    {
      id: 'folio', kind: 'explain', title: 'The Folio column', uses: ['folio-reference', 'equal-sides'],
      text: [
        'Every entry has two sides, written on two pages. The Folio column ties them together: on each line, write the number of the page that holds the other side.',
        'Jordan moves $40.00 from the Spending bucket (account 2) into Cash (account 7). On the Cash page, the line is a debit with folio 2. On the Spending page, it is a credit with folio 7. Follow either folio to find the other half of the entry.',
        'In Module 6 you will start a journal. From then on, the Folio column points to the journal page instead.',
      ],
      prompt: 'You find a line on a page and cannot remember what it was for. How does its folio help?',
      promptAnswer: 'The folio is the number of the page with the other side of the entry, so you can turn to that page and see where the money came from or went.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'From Spending bucket', '2', 4000, 0]]),
        chartPage('spending', [['2026-06-01', 'Brought forward', '', 41200, 0], ['2026-06-03', 'To Cash', '7', 0, 4000]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-folio', kind: 'predict', title: 'Predict: follow the folio', uses: ['folio-reference', 'running-balance'],
      text: ['Both lines dated Jun 10 say only "Transfer". The Cash page (account 7) has this line: Jun 10, folio 2, debit $50.00. Which Spending line matches it? What is the Spending balance right after that line?'],
      ledger: chartPage('spending', [
        ['2026-06-06', 'Brought forward', '', 41200, 0],
        ['2026-06-10', 'Transfer', '3', 0, 5000],
        ['2026-06-10', 'Transfer', '7', 0, 5000],
      ], { askFrom: 1 }),
      answer: 31200,
      misconceptions: [{ cents: 36200, explanation: 'That is the balance after the transfer with folio 3, which went to the Saving bucket. The matching line has folio 7, the Cash page\'s number.' }],
      explanation: 'The line with folio 7 matches the Cash page. Its balance is $412.00 − $50.00 − $50.00 = $312.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['folio-reference', 'debit-credit-rules'],
      text: ['Ana moves $25.00 from her Spending bucket (account 2) to Blow money (account 6). Step 1 is done: the Blow money line is a debit with folio 2. Step 2 is done: the Spending line is a credit with folio 6. Finish Step 3: Blow money had a debit balance of $31.40. What is it now?'],
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 3140, 0], ['2026-06-12', 'From Spending bucket', '2', 2500, 0]], { name: 'Ana (example)', askFrom: 1 }),
      highlightRow: 1,
      answer: 5640,
      misconceptions: [{ cents: 640, explanation: 'Blow money is an asset that receives money, so it is a debit: add.' }],
      explanation: '$31.40 + $25.00 = $56.40, a debit balance.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['personal-accounts', 'account-numbers', 'accounting-equation'],
      text: ['Luis\'s pages show these balances: account 2, $350.00; account 3, $900.00; account 7, $45.00; account 20, $60.00; account 21, $215.50. What is his net worth?'],
      answer: 101950,
      misconceptions: [{ cents: 157050, explanation: 'Accounts 20 and 21 are liabilities: subtract what he owes.' }],
      explanation: 'Assets (2, 3 and 7): $1,295.00. Liabilities (20 and 21): $275.50. $1,295.00 − $275.50 = $1,019.50.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['account-numbers'],
      text: ['These pages show balances: account 50, $178.54; account 52, $88.20; account 3, $155.02; account 55, $45.00. What is the total of the expense accounts?'],
      answer: 31174,
      misconceptions: [{ cents: 46676, explanation: 'Account 3 is an asset (1 to 19), not an expense.' }],
      explanation: 'Expenses are numbered 50 to 99: $178.54 + $88.20 + $45.00 = $311.74.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['folio-reference', 'running-balance'],
      text: ['The Groceries page (account 52) has this line: Jun 14, folio 2, debit $37.65. Just before the matching line, the Spending bucket page (account 2) had a balance of $260.00. What is its balance after it?'],
      answer: 22235,
      misconceptions: [{ cents: 29765, explanation: 'The Spending bucket paid for the groceries, so its matching line is a credit: subtract.' }],
      explanation: 'Folio 2 points to the Spending bucket, where the matching line is a credit: $260.00 − $37.65 = $222.35.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['personal-accounts', 'debit-credit-rules'],
      text: ['A relative gives you $40.00 in cash. Cash (account 7) is debited and Gifts received (account 41, income) is credited. Gifts received had a credit balance of $25.00. What is it now?'],
      answer: 6500,
      misconceptions: [{ cents: 1500, explanation: 'Income goes up with a credit, so add.' }],
      explanation: 'Income goes up with a credit: $25.00 + $40.00 = $65.00.',
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
  recallTemplates: [groupTotal, followFolio].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: adding up one group of accounts.
const drill = [1, 2, 3].map((n) => num(`m05-drill-${n}`, 'interpreting', { a: { min: 5000, max: 50000, step: 1 }, b: { min: 5000, max: 90000, step: 1 }, c: { min: 500, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: account 2, ${money(p.a)}; account 3, ${money(p.b)}; account 52, ${money(p.c)}. Total of the assets?`, answer: p.a + p.b,
  misconceptions: [{ cents: p.a + p.b + p.c, explanation: 'Account 52 is an expense (50 to 99).' }],
  explanation: `Accounts 2 and 3 are assets: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

// Interleaving starts here: one production task comes from an earlier module.
const paycheckMixed = { ...M04_GATE.templates.find((t) => t.part === 'producing'), id: 'm04-record-paycheck-mixed-m05' };

export const M05_PRACTICE = {
  id: 'm05-practice', kind: 'practice', module: 'm05', title: 'Module 5 practice set',
  templates: [...M04_LESSON.recallTemplates, ...M03_LESSON.recallTemplates, ...M01_LESSON.recallTemplates, ...drill, groupTotal, followFolio, netWorthChart, folioBalances, recordNumbers, paycheckMixed, { ...explainChart, id: 'm05-explain-practice' }],
};

export const M05_EXTRA = {
  id: 'm05-extra', kind: 'practice', module: 'm05', title: 'Module 5 extra practice',
  templates: [groupTotal, followFolio, incomeTotal, folioOtherPage, cashAfter, recordNumbers].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M05_REMEDIAL = {
  id: 'm05-remedial', kind: 'practice', module: 'm05', title: 'Module 5: common mistakes',
  templates: [netWorthChart, followFolio, recordNumbers].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordNumbers comes first: later modules mix it in.
export const M05_GATE = {
  id: 'm05', kind: 'gate', title: 'Module 5 check',
  templates: [groupTotal, followFolio, netWorthChart, incomeTotal, folioOtherPage, cashAfter, drill[0], recordNumbers, folioBalances, explainChart],
};

// Questions Checkpoint B draws from this module.
export const M05_CHECKPOINT = [groupTotal, followFolio, recordNumbers];
