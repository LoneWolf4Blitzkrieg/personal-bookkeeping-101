// Module 13: The emergency fund. Ideas: essential-expenses, fund-sizing,
// fund-rules. The Emergency fund (8) is a named sub-page of the Saving bucket,
// filled by transfers from it. The rule of thumb (the author's, October 25,
// 2026) is at least three months of essential expenses: three months is the
// minimum. Graded items always state the number of months. Amounts are
// illustrative; the guidance figures are cited.

import { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } from '../helpers.js';
import { M09_LESSON } from './m09.js';
import { M11_LESSON } from './m11.js';
import { M12_LESSON, M12_GATE } from './m12.js';

const num = (id, part, params, build) => ({ id, module: 'm13', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const bline = (id, budget) => ({ no: CHART[id].no, name: CHART[id].name, budget });
const sum = (list) => list.reduce((s, x) => s + x, 0);
const MONTHS = 3;
const FUND_SOURCES = ['cfpb-emergency-fund', 'fed-shed-2025-emergency'];

// An Emergency fund page: brought forward, then two transfers in from the
// Saving bucket.
const fundPage = (name, opening, a, b, extra = [], opts = {}) => chartPage('emergency', [
  ['2026-07-01', 'Brought forward', '', opening, 0],
  ['2026-07-10', 'From Saving bucket', 'J7', a, 0, true],
  ['2026-07-24', 'From Saving bucket', 'J8', b, 0, true],
  ...extra,
], { name, ...opts });

// --- Question templates -----------------------------------------------------

// Four needs and two wants, listed in a mixed order.
const essentialTotal = num('m13-essential-total', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 32000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, phone: { min: 3500, max: 6000, step: 500 },
  concert: { min: 3000, max: 9000, step: 500 }, takeout: { min: 1500, max: 6000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const needs = p.rent + p.groceries + p.bus + p.phone;
  return {
    prompt: `${p.name}'s monthly spending: rent ${money(p.rent)}; concert tickets ${money(p.concert)}; groceries ${money(p.groceries)}; a bus pass to get to work ${money(p.bus)}; takeout ${money(p.takeout)}; phone ${money(p.phone)}. What are ${p.name}'s essential expenses for one month?`,
    answer: needs,
    misconceptions: [{ cents: needs + p.concert + p.takeout, explanation: 'Concert tickets and takeout are wants. They could stop for a while if pay stopped, so they are not essential.' }],
    explanation: `Essential: rent ${money(p.rent)} + groceries ${money(p.groceries)} + bus pass ${money(p.bus)} + phone ${money(p.phone)} = ${money(needs)}.`,
  };
});

const minimumFund = num('m13-minimum-fund', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 32000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, utilities: { min: 2500, max: 6000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const month = p.rent + p.groceries + p.bus + p.utilities;
  return {
    prompt: `${p.name}'s essential expenses each month are rent ${money(p.rent)}, groceries ${money(p.groceries)}, a bus pass ${money(p.bus)} and utilities ${money(p.utilities)}. Using the rule of thumb of three months of essential expenses, what is the smallest emergency fund ${p.name} should aim for?`,
    answer: MONTHS * month,
    misconceptions: [{ cents: month, explanation: 'That covers one month. The rule of thumb is at least three months of essential expenses.' }],
    explanation: `One month: ${money(month)}. Three months: 3 × ${money(month)} = ${money(MONTHS * month)}.`,
  };
});

// The page's balance is shown; the essentials are large enough that the
// three-month minimum is always above it.
const stillNeeded = num('m13-still-needed', 'interpreting', {
  opening: { min: 20000, max: 90000, step: 1 }, a: { min: 2500, max: 15000, step: 500 }, b: { min: 2500, max: 15000, step: 500 }, essentials: { min: 70000, max: 98000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const balance = p.opening + p.a + p.b;
  const target = MONTHS * p.essentials;
  return {
    prompt: `${p.name}'s essential expenses are ${money(p.essentials)} a month. How much more does the Emergency fund need to reach the three-month minimum?`,
    ledger: fundPage(p.name, p.opening, p.a, p.b),
    highlightRow: 2,
    answer: target - balance,
    misconceptions: [{ cents: target, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
    explanation: `Minimum: 3 × ${money(p.essentials)} = ${money(target)}. The page shows ${money(balance)}. ${money(target)} − ${money(balance)} = ${money(target - balance)}.`,
  };
});

// Using the fund for an urgent repair: the new balance is asked.
const afterUse = num('m13-after-use', 'interpreting', {
  opening: { min: 60000, max: 150000, step: 1 }, a: { min: 2500, max: 15000, step: 500 }, b: { min: 2500, max: 15000, step: 500 }, repair: { min: 4000, max: 40000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const before = p.opening + p.a + p.b;
  return {
    prompt: `${p.name}'s bike, which ${p.name} rides to work, needed an urgent repair, paid from the Emergency fund. What does the page show after the last line?`,
    ledger: fundPage(p.name, p.opening, p.a, p.b, [['2026-07-28', 'Bike repair (urgent)', 'J9', 0, p.repair, true]], { askFrom: 3 }),
    highlightRow: 3,
    answer: before - p.repair,
    misconceptions: [{ cents: before + p.repair, explanation: 'Paying from the fund is a credit to its page, so the balance goes down.' }],
    explanation: `${money(before)} − ${money(p.repair)} = ${money(before - p.repair)}.`,
  };
});

// Equal amounts from each paycheck: the amount still needed is built from a
// whole number of cents per paycheck, so it divides exactly.
const perPaycheck = num('m13-per-paycheck', 'interpreting', { per: { min: 3000, max: 12000, step: 1 }, paychecks: { pick: [4, 6, 8, 10] }, name: { pick: NAMES } }, (p) => {
  const needed = p.per * p.paychecks;
  return {
    prompt: `${p.name}'s Emergency fund is ${money(needed)} short of its three-month minimum. ${p.name} will move the same amount from the Saving bucket after each of the next ${p.paychecks} paychecks to close the gap. How much is each transfer?`,
    answer: p.per,
    misconceptions: [{ cents: needed, explanation: 'That is the whole gap. Share it equally across the paychecks.' }],
    explanation: `${money(needed)} ÷ ${p.paychecks} = ${money(p.per)} from each paycheck.`,
  };
});

// Refilling after the fund was used.
const refillAfter = num('m13-refill-after', 'interpreting', { left: { min: 20000, max: 120000, step: 1 }, refill: { min: 2500, max: 12000, step: 500 }, months: { pick: [2, 3, 4, 5] }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} used the Emergency fund in an emergency, and it now holds ${money(p.left)}. Following the rule "refill it first," ${p.name} moves ${money(p.refill)} into it from the Saving bucket each month. What will the page show after ${p.months} months?`,
  answer: p.left + p.refill * p.months,
  misconceptions: [{ cents: p.left + p.refill, explanation: `That is one month's refill. Add ${money(p.refill)} for each of the ${p.months} months.` }],
  explanation: `${money(p.left)} + ${p.months} × ${money(p.refill)} = ${money(p.left + p.refill * p.months)}.`,
}));

const RECORD_ACCOUNTS = accountOptions(['emergency', 'saving', 'spending', 'cash', 'transport', 'phone', 'eating-out']);
const RECORD_EVENTS = {
  refill: (p) => ({
    prompt: `${p.name} moves ${money(p.amount)} from the Saving bucket into the Emergency fund. Record the entry.`,
    answer: [{ account: 'emergency', debit: p.amount, credit: 0 }, { account: 'saving', debit: 0, credit: p.amount }],
    explanation: 'A transfer between your own pages: debit the page that receives (Emergency fund), credit the page that gives (Saving bucket).',
  }),
  repair: (p) => ({
    prompt: `${p.name}'s bike, needed to get to work, breaks down. The urgent repair costs ${money(p.amount)}, paid from the Emergency fund. Record the entry.`,
    answer: [{ account: 'transport', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'The repair is a transportation expense, so debit it. The money came from the Emergency fund, so credit it.',
  }),
  'income-gap': (p) => ({
    prompt: `${p.name}'s hours were cut this month, so the paychecks fell short of the rent. ${p.name} moves ${money(p.amount)} from the Emergency fund to the Spending bucket. Record the entry.`,
    answer: [{ account: 'spending', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'Covering lost income is a transfer: debit the Spending bucket, which receives it, and credit the Emergency fund, which gives it.',
  }),
  phone: (p) => ({
    prompt: `${p.name}'s phone, needed for work shifts, stops working. A replacement costs ${money(p.amount)}, paid from the Emergency fund. Record the entry.`,
    answer: [{ account: 'phone', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'The replacement is a phone expense, so debit it. Credit the Emergency fund, which paid for it.',
  }),
};
const recordFund = {
  id: 'm13-record-fund', module: 'm13', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 4000, max: 40000, step: 1 }, name: { pick: NAMES }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

// Production: a fund plan from a month's spending. The fund's balance is
// chosen so the gap divides exactly into the months given.
const fundPlan = {
  id: 'm13-fund-plan', module: 'm13', kind: 'amounts', part: 'producing', points: 4,
  params: {
    rent: { min: 40000, max: 55000, step: 500 }, groceries: { min: 18000, max: 30000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, phone: { min: 3500, max: 6000, step: 500 },
    fun: { min: 2000, max: 6000, step: 500 }, per: { min: 5000, max: 15000, step: 1 }, months: { pick: [6, 8, 10, 12] }, name: { pick: NAMES },
  },
  build: (p) => {
    const month = p.rent + p.groceries + p.bus + p.phone;
    const target = MONTHS * month;
    const balance = target - p.per * p.months;
    return {
      prompt: `${p.name}'s month: rent ${money(p.rent)}, groceries ${money(p.groceries)}, a bus pass to work ${money(p.bus)}, phone ${money(p.phone)} and fun ${money(p.fun)}. The Emergency fund holds ${money(balance)}. ${p.name} wants to reach the three-month minimum in ${p.months} months, moving the same amount each month. Work out the plan.`,
      fields: [['Essential expenses for one month', month], ['The three-month minimum', target], ['Still needed', target - balance], ['To move into the fund each month', p.per]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: `Essentials (fun is a want): ${money(p.rent)} + ${money(p.groceries)} + ${money(p.bus)} + ${money(p.phone)} = ${money(month)}. Minimum: 3 × ${money(month)} = ${money(target)}. Still needed: ${money(target)} − ${money(balance)} = ${money(target - balance)}. Each month: ${money(target - balance)} ÷ ${p.months} = ${money(p.per)}.`,
    };
  },
};

const explainFund = explainTemplate({
  id: 'm13-explain', module: 'm13',
  variants: [
    { prompt: 'In one or two sentences: why is an emergency fund sized from essential expenses, not from all your spending?',
      modelAnswer: 'In an emergency, such as losing your pay, you can stop the wants for a while. The fund only has to keep paying for what you cannot stop: a place to live, food and a way to get to work.',
      rubric: ['Says wants can stop for a while in an emergency', 'Says the fund must cover what cannot stop (the essentials)'] },
    { prompt: 'In one or two sentences: why is three months of essential expenses called a minimum?',
      modelAnswer: 'Three months gives time to find new work or recover from a big bill. A longer emergency needs more, so more is safer.',
      rubric: ['Says three months gives time to recover (find work, pay a big bill)', 'Says more is safer, because an emergency can last longer'] },
    { prompt: 'In one or two sentences: why should the emergency fund not pay for a planned cost, such as a yearly insurance bill?',
      modelAnswer: 'A planned cost is known in advance, so it can be saved for separately. Using the fund for it leaves less for a real emergency.',
      rubric: ['Says a planned cost is known in advance (save for it separately)', 'Says using the fund for it leaves less for a real emergency'] },
    { prompt: 'In one or two sentences: why refill the emergency fund first after using it?',
      modelAnswer: 'Until it is refilled, the next emergency finds less money waiting. Refilling first puts the safety back before other goals.',
      rubric: ['Says a used fund leaves less for the next emergency', 'Says refilling first restores the safety before other goals'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

// Luis's July: five needs and two wants; the fund grows by transfers.
const LUIS_PLAN = [bline('rent', 45000), bline('groceries', 26000), bline('transport', 6400), bline('phone', 4500), bline('utilities', 4000), bline('eating-out', 6000), bline('fun', 4000)];
const LUIS_ESSENTIALS = 45000 + 26000 + 6400 + 4500 + 4000; // $859.00
const luisFund = (extra = [], opts = {}) => fundPage('Luis (example)', 90000, 7500, 7500, extra, opts);
const LUIS_FUND = 90000 + 7500 + 7500; // $1,050.00
const fundJournal = journal([
  ['2026-08-03', 'J9', 'Urgent bike repair, paid from the Emergency fund', [['transport', 8500, 0, true], ['emergency', 0, 8500, true]]],
  ['2026-08-07', 'J10', 'Refill the Emergency fund first', [['emergency', 8500, 0, true], ['saving', 0, 8500, true]]],
], { sheetNo: 9, name: 'Luis (example)' });
const LUIS_AFTER = [['2026-08-03', 'Bike repair (urgent)', 'J9', 0, 8500, true], ['2026-08-07', 'Refill from Saving bucket', 'J10', 8500, 0, true]];

export const M13_LESSON = {
  id: 'm13',
  title: 'The emergency fund',
  coreIdea: 'An emergency fund pays for the unplanned things you cannot put off. Size it from your essential expenses: at least three months of them. Use it only for emergencies, and refill it first.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['net-worth-statement'],
      text: ['From Module 12: a net-worth statement shows assets of $1,620.00 and liabilities of $95.40. What is the net worth?'],
      answer: 152460,
      misconceptions: [{ cents: 171540, explanation: 'What you owe is subtracted from what you own.' }],
      explanation: '$1,620.00 − $95.40 = $1,524.60.',
    },
    {
      id: 'essentials', kind: 'explain', title: 'Essential expenses', uses: ['essential-expenses', 'budget-as-ledger'],
      text: [
        'An emergency is something unplanned that you cannot put off: losing your job or hours, a medical bill, an urgent repair to the car or bike you need for work.',
        'Essential expenses are the ones you would still have to pay if your pay stopped: a place to live, food, getting to work, the phone you need to find shifts, utilities. Wants such as eating out and fun could stop for a while.',
        'Taxes withheld are not on the list. With no pay, nothing is withheld.',
        'Here is Luis\'s budget for July. Five of its lines are essential.',
      ],
      prompt: 'Why are eating out and fun left off the list of essential expenses?',
      promptAnswer: 'They are wants. If Luis\'s pay stopped, he could stop them for a while; the essentials he would still have to pay.',
      report: { report: 'budget', name: 'Luis (example)', period: 'July 2026', lines: LUIS_PLAN },
    },
    {
      id: 'predict-essentials', kind: 'predict', title: 'Predict: one month of essentials', uses: ['essential-expenses'],
      text: ['From Luis\'s budget (its total is left blank): what are his essential expenses for one month?'],
      report: { report: 'budget', name: 'Luis (example)', period: 'July 2026', lines: LUIS_PLAN, ask: ['total'] },
      answer: LUIS_ESSENTIALS,
      misconceptions: [{ cents: LUIS_ESSENTIALS + 10000, explanation: 'Eating out and fun are wants. Add the five essential lines only.' }],
      explanation: '$450.00 + $260.00 + $64.00 + $45.00 + $40.00 = $859.00.',
    },
    {
      id: 'sizing', kind: 'explain', title: 'How big a fund?', uses: ['fund-sizing', 'essential-expenses'],
      text: [
        'This course uses a rule of thumb: an emergency fund should hold at least three months of essential expenses. Three months is the minimum; more is safer, because an emergency can last longer than you expect.',
        'There is no official figure. The Consumer Financial Protection Bureau says the right amount depends on your situation. It also says that even a small amount gives some security, so start with a first goal and build from there. In a 2025 Federal Reserve survey, 55% of adults said they had three months of emergency savings.',
        'Luis: 3 × $859.00 = $2,577.00. That is his minimum.',
      ],
      prompt: 'Why is the fund sized from essential expenses rather than from everything you spend?',
      promptAnswer: 'In an emergency you can stop the wants for a while. The fund only has to keep paying what cannot stop.',
      sources: FUND_SOURCES,
    },
    {
      id: 'predict-minimum', kind: 'predict', title: 'Predict: the minimum', uses: ['fund-sizing'],
      text: ['Maya\'s essential expenses come to $912.40 a month. What is her three-month minimum?'],
      answer: 273720,
      misconceptions: [{ cents: 91240, explanation: 'That is one month. Multiply by three.' }],
      explanation: '3 × $912.40 = $2,737.20.',
    },
    {
      id: 'fund-page', kind: 'explain', title: 'The Emergency fund page', uses: ['fund-sizing', 'transfers', 'account-numbers'],
      text: [
        'Keep the fund on its own page: Emergency fund, account 8, an asset. It is a named part of your Saving bucket, so money reaches it by a transfer: debit Emergency fund, credit Saving bucket.',
        'Luis moves $75.00 into it after each paycheck. On its own page, the fund never gets mixed up with money saved for other things.',
      ],
      prompt: 'Why does moving money into the Emergency fund leave Luis\'s net worth unchanged?',
      promptAnswer: 'It is a transfer between his own pages: the Emergency fund goes up and the Saving bucket goes down by the same amount. Nothing is spent.',
      ledger: luisFund(),
      highlightRow: 1,
    },
    {
      id: 'predict-needed', kind: 'predict', title: 'Predict: still needed', uses: ['fund-sizing'],
      text: ['Luis\'s minimum is $2,577.00. How much more does his Emergency fund need?'],
      ledger: luisFund(),
      highlightRow: 2,
      answer: MONTHS * LUIS_ESSENTIALS - LUIS_FUND,
      misconceptions: [{ cents: MONTHS * LUIS_ESSENTIALS, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
      explanation: '$2,577.00 − $1,050.00 = $1,527.00.',
    },
    {
      id: 'rules', kind: 'explain', title: 'Rules for using and refilling it', uses: ['fund-rules', 'recording-purchases', 'transfers', 'journal-entry'],
      text: [
        'Write your rules down before you need them. This course suggests three:',
        '1. Use it only for an emergency: something unplanned that cannot wait, such as lost pay, a medical bill or an urgent repair.',
        '2. Not for planned costs or wants: a yearly bill you know is coming gets its own savings (Module 14). A sale or a concert is never an emergency.',
        '3. Refill it first. After you use it, money from the Saving bucket goes back into the fund until it reaches its target again.',
        'Paying from the fund works like any purchase: debit the expense, credit the Emergency fund. Refilling is a transfer.',
      ],
      prompt: 'Why refill the fund before saving for anything else?',
      promptAnswer: 'Until it is refilled, the next emergency finds less money waiting. Refilling first puts the safety back.',
      journalPage: fundJournal,
      highlightEntry: 0,
      ledger: luisFund(LUIS_AFTER),
      highlightRow: 3,
      source: 'cfpb-emergency-fund',
    },
    {
      id: 'predict-use', kind: 'predict', title: 'Predict: covering lost pay', uses: ['fund-rules', 'transfers'],
      text: ['In August, Luis\'s hours are cut, so he moves $230.00 from the Emergency fund to the Spending bucket to pay the rent. What does the fund page show after the last line?'],
      ledger: luisFund([...LUIS_AFTER, ['2026-08-21', 'To Spending bucket (hours cut)', 'J11', 0, 23000, true]], { askFrom: 5 }),
      highlightRow: 5,
      answer: LUIS_FUND - 23000,
      misconceptions: [{ cents: LUIS_FUND + 23000, explanation: 'Money leaving the fund is a credit to its page, so the balance goes down.' }],
      explanation: '$1,050.00 − $230.00 = $820.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['fund-rules'],
      text: ['Luis refills his fund first: $75.00 from each of his two paychecks a month. The fund holds $820.00. Step 1 is done: that is $150.00 a month. Finish Step 2: what will the page show after two months?'],
      answer: 82000 + 2 * 15000,
      misconceptions: [{ cents: 82000 + 15000, explanation: 'That is one month. Add $150.00 for each of the two months.' }],
      explanation: '$820.00 + 2 × $150.00 = $1,120.00.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['fund-sizing'],
      text: ['Ana\'s essential expenses are $780.00 a month, and her Emergency fund holds $1,150.00. How much more does she need for the three-month minimum?'],
      answer: 3 * 78000 - 115000,
      misconceptions: [{ cents: 3 * 78000, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
      explanation: '3 × $780.00 = $2,340.00. $2,340.00 − $1,150.00 = $1,190.00.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['essential-expenses'],
      text: ['A month\'s spending: rent $500.00; groceries $240.00; concert tickets $75.00; a bus pass to work $64.00; takeout $30.00; phone $50.00. What are the essential expenses?'],
      answer: 50000 + 24000 + 6400 + 5000,
      misconceptions: [{ cents: 50000 + 24000 + 6400 + 5000 + 7500 + 3000, explanation: 'Concert tickets and takeout are wants.' }],
      explanation: '$500.00 + $240.00 + $64.00 + $50.00 = $854.00.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['fund-sizing'],
      text: ['Essential expenses are $905.25 a month. What is the three-month minimum for the emergency fund?'],
      answer: 3 * 90525,
      misconceptions: [{ cents: 90525, explanation: 'Multiply by three.' }],
      explanation: '3 × $905.25 = $2,715.75.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['fund-rules'],
      text: ['The Emergency fund holds $1,400.00. An urgent $260.00 repair is paid from it. What does the page show now?'],
      answer: 140000 - 26000,
      misconceptions: [{ cents: 140000 + 26000, explanation: 'Paying from the fund lowers its balance.' }],
      explanation: '$1,400.00 − $260.00 = $1,140.00.',
    },
  ],
  resources: ['cfpb-emergency-fund', 'cfpb-start-small'],
  recallTemplates: [essentialTotal, minimumFund].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: three months of essential expenses.
const drill = [1, 2, 3].map((n) => num(`m13-drill-${n}`, 'interpreting', { month: { min: 50000, max: 120000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: essential expenses are ${money(p.month)} a month. What is the three-month minimum?`, answer: MONTHS * p.month,
  explanation: `3 × ${money(p.month)} = ${money(MONTHS * p.month)}.`,
})));

const closingMixed = { ...M12_GATE.templates.find((t) => t.part === 'producing'), id: 'm12-record-closing-mixed-m13' };

export const M13_PRACTICE = {
  id: 'm13-practice', kind: 'practice', module: 'm13', title: 'Module 13 practice set',
  templates: [...M12_LESSON.recallTemplates, ...M11_LESSON.recallTemplates, ...M09_LESSON.recallTemplates, ...drill, essentialTotal, minimumFund, stillNeeded, fundPlan, recordFund, closingMixed, { ...explainFund, id: 'm13-explain-practice' }],
};

export const M13_EXTRA = {
  id: 'm13-extra', kind: 'practice', module: 'm13', title: 'Module 13 extra practice',
  templates: [essentialTotal, stillNeeded, afterUse, perPaycheck, refillAfter, fundPlan, recordFund].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M13_REMEDIAL = {
  id: 'm13-remedial', kind: 'practice', module: 'm13', title: 'Module 13: common mistakes',
  templates: [essentialTotal, minimumFund, recordFund].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
export const M13_GATE = {
  id: 'm13', kind: 'gate', title: 'Module 13 check',
  templates: [essentialTotal, minimumFund, stillNeeded, afterUse, perPaycheck, refillAfter, drill[0], recordFund, fundPlan, explainFund],
};
