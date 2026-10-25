// Module 11: Budgeting with logic. Ideas: budget-as-ledger, budget-vs-actual,
// spending-rules. Budgets are reports (Budget, Actual, Under, Over). Spending
// rules are taught as rules the learner chooses in advance; graded items
// only apply a stated rule or sort clear-cut needs from wants. Amounts are
// illustrative.

import { money, NAMES, explainTemplate, chartPage, splitBuckets, standardPaycheck, CHART, PAYCHECK_SOURCES } from '../helpers.js';
import { M07_LESSON } from './m07.js';
import { M09_LESSON } from './m09.js';
import { M10_LESSON, M10_GATE } from './m10.js';

const num = (id, part, params, build) => ({ id, module: 'm11', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const bline = (id, budget, actual) => ({ no: CHART[id].no, name: CHART[id].name, budget, ...(actual == null ? {} : { actual }) });
const budget = (name, lines, extra = {}) => ({ report: 'budget', name, period: 'June 2026', lines, ...extra });
const sum = (list, key) => list.reduce((s, x) => s + x[key], 0);

// The Spending bucket's share of two standard paychecks.
const SPENDING_SHARE = 2 * splitBuckets(standardPaycheck().net).spending;

// --- Question templates -----------------------------------------------------

// Lines over and under; taken as a whole the month comes in under, because
// groceries come in at least $1.00 further under than eating out goes over.
const netUnder = num('m11-net-under', 'interpreting', {
  groc: { min: 25000, max: 35000, step: 500 }, gUnder: { min: 500, max: 4000, step: 1 }, eat: { min: 5000, max: 9000, step: 500 }, eOver: { min: 200, max: 2500, step: 1 },
  house: { min: 3000, max: 5000, step: 500 }, hUnder: { min: 300, max: 1500, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const gUnder = Math.max(p.gUnder, p.eOver + 100);
  const lines = [bline('rent', 55000, 55000), bline('groceries', p.groc, p.groc - gUnder), bline('eating-out', p.eat, p.eat + p.eOver), bline('household', p.house, p.house - p.hUnder)];
  const under = gUnder + p.hUnder;
  const net = under - p.eOver;
  return {
    prompt: `${p.name}'s budget report has its totals left blank. Taken as a whole, by how much did the month come in under budget?`,
    report: budget(p.name, lines, { ask: ['total'] }),
    answer: net,
    misconceptions: [{ cents: under, explanation: 'That is the Under column alone. The month as a whole also has to cover the line that went over.' }],
    explanation: `Total budget ${money(sum(lines, 'budget'))} − total actual ${money(sum(lines, 'actual'))} = ${money(net)}. (Under ${money(under)}, over ${money(p.eOver)}.)`,
  };
});

const leftToPlan = num('m11-left-to-plan', 'interpreting', {
  take: { min: 90000, max: 110000, step: 1 }, rent: { min: 40000, max: 55000, step: 500 }, groc: { min: 20000, max: 32000, step: 500 },
  phone: { min: 3500, max: 6000, step: 500 }, bus: { min: 4000, max: 6400, step: 100 }, name: { pick: NAMES },
}, (p) => {
  const share = 2 * splitBuckets(p.take).spending;
  const planned = p.rent + p.groc + p.phone + p.bus;
  return {
    prompt: `${p.name}'s two paychecks put ${money(share)} into the Spending bucket this month. The budget plans rent ${money(p.rent)}, groceries ${money(p.groc)}, phone ${money(p.phone)} and a bus pass ${money(p.bus)}. How much is not planned yet?`,
    answer: share - planned,
    misconceptions: [{ cents: planned, explanation: 'That is the planned total. Subtract it from the Spending bucket\'s share.' }],
    explanation: `${money(p.rent)} + ${money(p.groc)} + ${money(p.phone)} + ${money(p.bus)} = ${money(planned)}. ${money(share)} − ${money(planned)} = ${money(share - planned)}.`,
  };
});

// Production: the budget is given as a plan and the month's spending is on
// the expense pages. The learner works out the Actual column and the Under
// and Over totals, which only come out right if each line's direction is.
// Groceries always come in under and transportation always goes over; the
// other two lines can go either way.
const bvaFromPages = {
  id: 'm11-bva-from-pages', module: 'm11', kind: 'amounts', part: 'producing', points: 4,
  params: {
    g1: { min: 5000, max: 9500, step: 1 }, g2: { min: 5000, max: 9500, step: 1 }, g3: { min: 5000, max: 9500, step: 1 }, e1: { min: 1000, max: 4000, step: 1 }, e2: { min: 1000, max: 4000, step: 1 },
    fares: { min: 150, max: 900, step: 25 }, h1: { min: 800, max: 2500, step: 1 }, h2: { min: 800, max: 2500, step: 1 }, name: { pick: NAMES },
  },
  build: (p) => {
    const plan = [bline('groceries', 30000), bline('eating-out', 6000), bline('transport', 6400), bline('household', 4000)];
    const actual = [p.g1 + p.g2 + p.g3, p.e1 + p.e2, 6400 + p.fares, p.h1 + p.h2];
    const under = plan.reduce((s, l, i) => s + Math.max(0, l.budget - actual[i]), 0);
    const over = plan.reduce((s, l, i) => s + Math.max(0, actual[i] - l.budget), 0);
    const actualTotal = actual.reduce((s, x) => s + x, 0);
    const word = (l, i) => (actual[i] > l.budget ? `over by ${money(actual[i] - l.budget)}` : actual[i] < l.budget ? `under by ${money(l.budget - actual[i])}` : 'exactly on budget');
    return {
      prompt: `${p.name}'s budget for June is on the report, and the month's spending is on the expense pages. Work out each line's actual amount and whether it is under or over, then give the totals.`,
      report: budget(p.name, plan),
      ledgers: [
        chartPage('groceries', [['2026-06-06', 'Desert Mart', 'J1', p.g1, 0, true], ['2026-06-14', 'Saguaro Grocery', 'J2', p.g2, 0, true], ['2026-06-24', 'Desert Mart', 'J3', p.g3, 0, true]], { name: p.name }),
        chartPage('eating-out', [['2026-06-10', 'Taco Stand', 'J1', p.e1, 0, true], ['2026-06-21', 'Pizza', 'J3', p.e2, 0, true]], { name: p.name }),
        chartPage('transport', [['2026-06-01', 'Bus pass', 'J1', 6400, 0, true], ['2026-06-27', 'Extra bus fares', 'J3', p.fares, 0, true]], { name: p.name }),
        chartPage('household', [['2026-06-06', 'Desert Mart', 'J1', p.h1, 0, true], ['2026-06-24', 'Desert Mart', 'J3', p.h2, 0, true]], { name: p.name }),
      ],
      fields: [['Total of the Actual column', actualTotal], ['Total of the Under column', under], ['Total of the Over column', over], ['Groceries: amount under budget', 30000 - actual[0]]].map(([label, answer]) => ({ label, answer })),
      explanation: `${plan.map((l, i) => `${l.name} ${money(actual[i])}, ${word(l, i)}`).join('; ')}. Actual total ${money(actualTotal)}; Under ${money(under)}; Over ${money(over)}.`,
    };
  },
};

// Needs first: plan the needs, then see what is left for wants.
const needsFirst = num('m11-needs-first', 'interpreting', {
  take: { min: 90000, max: 110000, step: 1 }, rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 35000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 },
  concert: { min: 3500, max: 9000, step: 1 }, takeout: { min: 1500, max: 4000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const share = 2 * splitBuckets(p.take).spending;
  const needs = p.rent + p.groceries + p.bus;
  return {
    prompt: `${p.name}'s rule is "needs first". This month the Spending bucket holds ${money(share)}. The list: rent ${money(p.rent)}; a concert ticket ${money(p.concert)}; groceries ${money(p.groceries)}; takeout ${money(p.takeout)}; a bus pass to get to work ${money(p.bus)}. After the needs are planned, how much is left for wants?`,
    answer: share - needs,
    misconceptions: [{ cents: share - needs - p.concert - p.takeout, explanation: 'The concert and the takeout are wants. Plan only the needs first; the wants come out of what is left.' }],
    explanation: `Needs: rent ${money(p.rent)} + groceries ${money(p.groceries)} + bus pass ${money(p.bus)} = ${money(needs)}. ${money(share)} − ${money(needs)} = ${money(share - needs)} left for wants.`,
  };
});

const explainBudget = explainTemplate({
  id: 'm11-explain', module: 'm11',
  variants: [
    { prompt: 'In one or two sentences: why is a budget written before the month starts?',
      modelAnswer: 'So the decisions are made calmly, in advance. During the month you follow the plan instead of deciding on impulse.',
      rubric: ['Says decisions are made in advance (before the spending)', 'Says this replaces deciding on impulse or mood'] },
    { prompt: 'In one or two sentences: the month came in under budget overall. Why still look at each line?',
      modelAnswer: 'The total can hide a problem: a line that went over is covered by another that came in under. Each line shows where the plan and the spending differ.',
      rubric: ['Says one line over can be hidden by another under', 'Says each line shows where to change the plan or the spending'] },
    { prompt: 'In one or two sentences: why pay the needs in the budget before the wants?',
      modelAnswer: 'Needs, such as rent and groceries, must be paid to live and work. If wants come first, there may be nothing left for them.',
      rubric: ['Says needs are what you must pay to live or work', 'Says paying wants first can leave too little for needs'] },
    { prompt: 'In one or two sentences: what is a waiting-period rule for?',
      modelAnswer: 'It puts time between wanting something and buying it, so you decide with the budget in front of you whether you still want it and whether the money is there.',
      rubric: ['Says it puts time between wanting something and buying it', 'Says you then decide with the budget (whether you still want it and the money is there)'] },
  ],
});

const NEEDS = [['rent', 'Rent'], ['groceries', 'Groceries'], ['bus', 'A bus pass to get to work']];
const WANTS = [['concert', 'A concert ticket'], ['takeout', 'Takeout dinner'], ['game', 'A new video game']];
const needsTotal = num('m11-needs-total', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 35000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 },
  concert: { min: 3500, max: 9000, step: 1 }, takeout: { min: 1500, max: 4000, step: 1 }, game: { min: 2999, max: 6999, step: 100 }, name: { pick: NAMES },
}, (p) => {
  const needs = NEEDS.reduce((s, [k]) => s + p[k], 0);
  const wants = WANTS.reduce((s, [k]) => s + p[k], 0);
  const list = [NEEDS[0], WANTS[0], NEEDS[1], WANTS[1], NEEDS[2], WANTS[2]].map(([k, words]) => `${words.toLowerCase()} ${money(p[k])}`).join('; ');
  return {
    prompt: `${p.name}'s list for the month: ${list}. What is the total of the needs?`,
    answer: needs,
    misconceptions: [{ cents: needs + wants, explanation: 'That is everything. The concert, the takeout and the game are wants.' }],
    explanation: `Needs are rent, groceries and the bus pass to work: ${money(p.rent)} + ${money(p.groceries)} + ${money(p.bus)} = ${money(needs)}.`,
  };
});

const lineOver = num('m11-line-over', 'interpreting', { budget: { min: 4000, max: 35000, step: 500 }, over: { min: 100, max: 4000, step: 1 }, line: { pick: ['groceries', 'eating-out', 'household', 'phone'] }, name: { pick: NAMES } }, (p) => {
  return {
    prompt: `${p.name}'s ${CHART[p.line].name} line had a budget of ${money(p.budget)}, and the page shows ${money(p.budget + p.over)} spent. By how much did it go over?`,
    answer: p.over,
    misconceptions: [{ cents: p.budget + p.over, explanation: 'That is the actual amount. The amount over is actual minus budget.' }],
    explanation: `Actual ${money(p.budget + p.over)} − budget ${money(p.budget)} = ${money(p.over)} over.`,
  };
});

// Completion: a budget report with each line worked out; the learner writes
// the four totals.
const underOverTotals = {
  id: 'm11-under-over-totals', module: 'm11', kind: 'amounts', part: 'producing', points: 4,
  params: { gUnder: { min: 500, max: 4000, step: 1 }, eOver: { min: 200, max: 2500, step: 1 }, hUnder: { min: 300, max: 1500, step: 1 }, fares: { min: 150, max: 900, step: 25 }, name: { pick: NAMES } },
  build: (p) => {
    const lines = [bline('groceries', 30000, 30000 - p.gUnder), bline('eating-out', 6000, 6000 + p.eOver), bline('transport', 6400, 6400 + p.fares), bline('household', 4000, 4000 - p.hUnder)];
    return {
      prompt: `Finish ${p.name}'s budget report: write the total of each column.`,
      report: budget(p.name, lines, { ask: ['total'] }),
      fields: [
        { label: 'Total of the Budget column', answer: sum(lines, 'budget') },
        { label: 'Total of the Actual column', answer: sum(lines, 'actual') },
        { label: 'Total of the Under column', answer: p.gUnder + p.hUnder },
        { label: 'Total of the Over column', answer: p.eOver + p.fares },
      ],
      explanation: `Budget ${money(sum(lines, 'budget'))}; Actual ${money(sum(lines, 'actual'))}; Under ${money(p.gUnder)} + ${money(p.hUnder)} = ${money(p.gUnder + p.hUnder)}; Over ${money(p.eOver)} + ${money(p.fares)} = ${money(p.eOver + p.fares)}.`,
    };
  },
};

// Applying a stated waiting-period rule (the rule is given; only its use is graded).
const waitRule = num('m11-wait-rule', 'interpreting', { blow: { min: 6000, max: 15000, step: 1 }, small: { min: 800, max: 4900, step: 1 }, big: { min: 5100, max: 12000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s rule: anything not in the budget comes out of Blow money. Under $50.00, it can be bought right away. $50.00 or more waits a week. Blow money holds ${money(p.blow)}. This week ${p.name} buys a ${money(p.small)} item and decides to wait on a ${money(p.big)} item. What does Blow money hold at the end of the week?`,
  answer: p.blow - p.small,
  misconceptions: [{ cents: p.blow - p.small - p.big, explanation: 'The second item is $50.00 or more, so under the rule it waits a week. It is not bought yet.' }],
  explanation: `Only the item under $50.00 is bought this week: ${money(p.blow)} − ${money(p.small)} = ${money(p.blow - p.small)}.`,
}));

// --- Lesson -------------------------------------------------------------------

const PLAN = [bline('rent', 55000), bline('groceries', 32000), bline('phone', 4500), bline('transport', 6400), bline('eating-out', 8000), bline('household', 4000)];
const ACTUAL = [bline('rent', 55000, 55000), bline('groceries', 32000, 29765), bline('phone', 4500, 4500), bline('transport', 6400, 6400), bline('eating-out', 8000, 10450), bline('household', 4000, 3120)];
const planned = sum(PLAN, 'budget');

export const M11_LESSON = {
  id: 'm11',
  title: 'Budgeting with logic',
  coreIdea: 'A budget is your ledger written in advance: the Spending bucket\'s money is given its jobs before the month starts. At month-end, compare each line with what you actually spent.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['outstanding-items'],
      text: ['From Module 10: a statement closes at $500.00, and a $42.00 check you wrote has not been cashed. What is the adjusted bank balance?'],
      answer: 45800,
      misconceptions: [{ cents: 54200, explanation: 'A payment not yet on the statement is subtracted.' }],
      explanation: '$500.00 − $42.00 = $458.00.',
    },
    {
      id: 'budget', kind: 'explain', title: 'A ledger written in advance', uses: ['budget-as-ledger', 'five-buckets'],
      text: [
        `A budget is a plan written before the month starts. The five buckets come first. From each paycheck, the Spending bucket gets ${money(SPENDING_SHARE / 2)}, so Rosa's two June paychecks put ${money(SPENDING_SHARE)} in it.`,
        'The budget gives that money its jobs: one line for each expense page, with the amount you plan to spend. Anything not planned stays in the Spending bucket for surprises.',
        'This is Rosa\'s plan for June. The Actual column stays empty until the month is over.',
      ],
      prompt: 'Why plan the spending before the month starts, instead of looking back at the end?',
      promptAnswer: 'Deciding in advance lets logic set the plan. During the month you follow it instead of deciding on impulse.',
      report: budget('Rosa (example)', PLAN),
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-left', kind: 'predict', title: 'Predict: what is not planned', uses: ['budget-as-ledger'],
      text: [`Rosa's Spending bucket holds ${money(SPENDING_SHARE)} for June. How much of it does this plan leave unplanned?`],
      report: budget('Rosa (example)', PLAN),
      answer: SPENDING_SHARE - planned,
      misconceptions: [{ cents: planned, explanation: 'That is the planned total. Subtract it from what the bucket holds.' }],
      explanation: `${money(SPENDING_SHARE)} − ${money(planned)} = ${money(SPENDING_SHARE - planned)}, kept for surprises.`,
    },
    {
      id: 'actual', kind: 'explain', title: 'Budget and actual', uses: ['budget-vs-actual', 'personal-accounts'],
      text: [
        'At month-end, write the actual amount from each expense page beside its budget. Under means you spent less than planned. Over means you spent more.',
        'Look at each line, then at the totals. Rosa came in under on groceries and household supplies, but over on eating out.',
        'A line that is often over tells you something: either the plan did not fit real life, or the spending needs a rule. That is how next month\'s plan gets better.',
      ],
      prompt: 'Eating out went over, but the month as a whole came in under. Why still look at the line?',
      promptAnswer: 'The total can hide a problem: one line over is covered by another under. The line shows where the plan and the spending differ.',
      report: budget('Rosa (example)', ACTUAL),
    },
    {
      id: 'predict-over', kind: 'predict', title: 'Predict: one line', uses: ['budget-vs-actual'],
      text: ['Groceries: budget $320.00, actual $341.85. By how much is the line over?'],
      answer: 2185,
      misconceptions: [{ cents: 66185, explanation: 'Find the difference between the two amounts.' }],
      explanation: '$341.85 − $320.00 = $21.85 over.',
    },
    {
      id: 'rules', kind: 'explain', title: 'Rules decided in advance', uses: ['spending-rules', 'five-buckets'],
      text: [
        'A rule set before the moment you want something lets you decide calmly. Two rules many people use:',
        'Needs come first. A need is something you must pay to live and work, such as rent, groceries or a bus pass to get to work. A want is something nice to have, such as takeout or a concert. The budget pays the needs before the wants.',
        'A waiting period for anything not in the budget. For example, wait a day for a small purchase and a week for a large one. If you still want it after the wait, and the money is there, buy it with Blow money.',
        'You choose your own rules. Write them down at the start of the month, next to the budget.',
      ],
      prompt: 'Why decide the rule before you see the thing you want?',
      promptAnswer: 'In the moment, wanting it makes the decision for you. A rule made calmly in advance lets logic decide.',
      ledger: chartPage('blow', [['2026-06-06', 'From paycheck', 'J1', 10335, 0, true], ['2026-06-17', 'Jacket (waited two days)', 'J3', 0, 5999, true]], { name: 'Rosa (example)' }),
      highlightRow: 1,
    },
    {
      id: 'predict-needs', kind: 'predict', title: 'Predict: needs first', uses: ['spending-rules'],
      text: ['This month\'s list: rent $550.00; groceries $320.00; a concert ticket $65.00; a bus pass to get to work $64.00; takeout $38.50. What is the total of the needs?'],
      answer: 93400,
      misconceptions: [{ cents: 103750, explanation: 'The concert ticket and the takeout are wants.' }],
      explanation: 'Rent, groceries and the bus pass: $550.00 + $320.00 + $64.00 = $934.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['budget-vs-actual'],
      text: ['Step 1 is done: the budget lines add up to $1,099.00. Step 2 is done: the expense pages add up to $1,082.40. Finish Step 3: taken as a whole, by how much did the month come in under budget?'],
      answer: 1660,
      explanation: '$1,099.00 − $1,082.40 = $16.60 under.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['spending-rules', 'five-buckets'],
      text: ['Your rule: anything not in the budget waits two days, and if you still want it, it comes out of Blow money. Blow money holds $86.20. After two days you still want a $47.95 pair of shoes. What does Blow money hold after you buy it?'],
      answer: 3825,
      misconceptions: [{ cents: 13415, explanation: 'Buying the shoes takes money out of Blow money: subtract.' }],
      explanation: '$86.20 − $47.95 = $38.25.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['budget-vs-actual'],
      text: ['Phone: budget $45.00, actual $45.00. Eating out: budget $80.00, actual $62.10. How much under budget are these two lines together?'],
      answer: 1790,
      explanation: 'Phone is on budget. Eating out: $80.00 − $62.10 = $17.90 under.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['budget-as-ledger'],
      text: [`The Spending bucket holds ${money(SPENDING_SHARE)}. The budget lines add up to $1,155.00. How much is not planned?`],
      answer: SPENDING_SHARE - 115500,
      explanation: `${money(SPENDING_SHARE)} − $1,155.00 = ${money(SPENDING_SHARE - 115500)}.`,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['spending-rules'],
      text: ['The list: rent $480.00; a movie $14.75; groceries $260.00; a new video game $59.99; a bus pass to get to work $64.00. What is the total of the needs?'],
      answer: 80400,
      misconceptions: [{ cents: 87874, explanation: 'The movie and the video game are wants.' }],
      explanation: '$480.00 + $260.00 + $64.00 = $804.00.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [netUnder, leftToPlan].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: one budget line against its actual.
const drill = [1, 2, 3].map((n) => num(`m11-drill-${n}`, 'interpreting', { budget: { min: 3000, max: 40000, step: 500 }, gap: { min: 100, max: 2900, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: budget ${money(p.budget)}, actual ${money(p.budget - p.gap)}. How much under?`, answer: p.gap,
  explanation: `${money(p.budget)} − ${money(p.budget - p.gap)} = ${money(p.gap)}.`,
})));

const bankMixed = { ...M10_GATE.templates.find((t) => t.part === 'producing'), id: 'm10-record-bank-mixed-m11' };

export const M11_PRACTICE = {
  id: 'm11-practice', kind: 'practice', module: 'm11', title: 'Module 11 practice set',
  templates: [...M10_LESSON.recallTemplates, ...M09_LESSON.recallTemplates, ...M07_LESSON.recallTemplates, ...drill, netUnder, needsFirst, leftToPlan, needsTotal, lineOver, waitRule, underOverTotals, bvaFromPages, bankMixed, { ...explainBudget, id: 'm11-explain-practice' }],
};

export const M11_EXTRA = {
  id: 'm11-extra', kind: 'practice', module: 'm11', title: 'Module 11 extra practice',
  templates: [leftToPlan, needsTotal, bvaFromPages].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M11_REMEDIAL = {
  id: 'm11-remedial', kind: 'practice', module: 'm11', title: 'Module 11: common mistakes',
  templates: [netUnder, needsTotal, bvaFromPages].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). bvaFromPages comes first: later modules mix it in.
export const M11_GATE = {
  id: 'm11', kind: 'gate', title: 'Module 11 check',
  templates: [netUnder, needsFirst, leftToPlan, needsTotal, lineOver, waitRule, drill[0], bvaFromPages, underOverTotals, explainBudget],
};

// Questions Checkpoint C draws from this module.
export const M11_CHECKPOINT = [needsFirst, bvaFromPages];
