// Module 2: The ledger page. Ideas: ledger-columns, running-balance,
// carry-forward. Still Date, Items and Balance only; money in and out are
// written beside the sheet. Amounts are illustrative.

import { money, NAMES, splitBuckets, explainTemplate } from '../helpers.js';
import { M01_LESSON } from './m01.js';

const EARLY = ['date', 'items', 'balance'];
const num = (id, part, params, build) => ({ id, module: 'm02', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });

// A bucket page from a list of [date, items, cents in, cents out].
function page(account, rows, { name = 'Jordan (example)', sheetNo = 1, accountNo = 2, askFrom = null, broughtForward = false } = {}) {
  return {
    sheetNo, accountNo, name, account, type: 'asset', activeColumns: EARLY,
    rows: rows.map(([date, items, inCents, outCents], i) => ({
      date, items, folio: '', debit: inCents, credit: outCents, posted: [false, false],
      ...(broughtForward && i === 0 ? { broughtForward: true } : {}),
      ...(askFrom !== null && i >= askFrom ? { ask: ['balance', 'side'] } : {}),
    })),
  };
}

const runningAfter = (start, moves) => moves.reduce((b, [inC, outC]) => b + inC - outC, start);

// --- Question templates -----------------------------------------------------

const afterSpending = num('m02-after-spending', 'interpreting', { start: { min: 30000, max: 70000, step: 1 }, cost: { min: 501, max: 9999, step: 1 }, item: { pick: ['Groceries', 'Bus pass', 'Phone bill', 'Gas', 'Laundry'] } }, (p) => ({
  prompt: `The Spending page balance is ${money(p.start)}. The next line is "${p.item}": money out ${money(p.cost)}. What does the Balance column read after it?`,
  answer: p.start - p.cost,
  misconceptions: [{ cents: p.start + p.cost, explanation: 'Money out makes the balance go down, so subtract.' }],
  explanation: `${money(p.start)} − ${money(p.cost)} = ${money(p.start - p.cost)}.`,
  ledger: page('Spending bucket', [['2026-06-06', 'Brought forward', p.start, 0], ['2026-06-09', p.item, 0, p.cost]], { askFrom: 1, broughtForward: true }),
  highlightRow: 1,
}));

const broughtForwardThenIn = num('m02-brought-forward', 'interpreting', { carried: { min: 50000, max: 250000, step: 1 }, take: { min: 80000, max: 130000, step: 1 } }, (p) => {
  const saving = splitBuckets(p.take).saving;
  return {
    prompt: `Sheet 1 of a Saving bucket is full. Its last balance is ${money(p.carried)}. On Sheet 2, the first line brings that balance forward. The next line adds ${money(saving)} from payday. What is the balance after the payday line?`,
    answer: p.carried + saving,
    misconceptions: [{ cents: saving, explanation: 'Sheet 2 starts with the balance brought forward, not with zero.' }],
    explanation: `Brought forward ${money(p.carried)} + ${money(saving)} = ${money(p.carried + saving)}.`,
  };
});

const fourBalances = {
  id: 'm02-four-balances', module: 'm02', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 5000, max: 30000, step: 1 }, pay: { min: 40000, max: 70000, step: 1 }, a: { min: 500, max: 6000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, c: { min: 300, max: 4000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    // The first line brings a balance forward; the learner works out the next four.
    const moves = [[p.pay, 0], [0, p.a], [0, p.b], [0, p.c]];
    const balances = moves.map((_, i) => runningAfter(p.start, moves.slice(0, i + 1)));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending page.`,
      ledger: page('Spending bucket', [
        ['2026-06-06', 'Brought forward', p.start, 0],
        ['2026-06-06', 'From paycheck', p.pay, 0],
        ['2026-06-08', 'Groceries', 0, p.a],
        ['2026-06-11', 'Phone bill', 0, p.b],
        ['2026-06-13', 'Lunch', 0, p.c],
      ], { name: p.name, askFrom: 1, broughtForward: true }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Money in adds. Money out subtracts. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

const explainLedger = explainTemplate({
  id: 'm02-explain', module: 'm02',
  variants: [
    { prompt: 'In one or two sentences: why does the balance go down on a line where money goes out?',
      modelAnswer: 'The balance is how much is left in the bucket. Money going out leaves less, so it is subtracted from the balance on the line above.',
      rubric: ['Says the balance is what is left now', 'Says money out is subtracted from the previous balance'] },
    { prompt: 'In one or two sentences: why does a new sheet start with a "Brought forward" line?',
      modelAnswer: 'So the new sheet continues from the old one. The last balance on the full sheet is carried to the first line of the new sheet.',
      rubric: ['Says the last balance of the full sheet is carried over', 'Says the new sheet continues instead of starting from zero'] },
    { prompt: 'In one or two sentences: what do the Date, Items and Balance columns each tell you?',
      modelAnswer: 'Date says when it happened, Items says what it was, and Balance says how much is in the bucket after that line.',
      rubric: ['Explains Date and Items', 'Says Balance is the amount after that line'] },
    { prompt: 'In one or two sentences: why is the balance written on every line instead of only at the end?',
      modelAnswer: 'So you always know how much is in the bucket right now. You can also find a mistake at the line where it happened.',
      rubric: ['Says you always know the current amount', 'Says mistakes can be found at the line they happened'] },
  ],
});

const recallSplit = num('m02-recall-split', 'interpreting', { take: { min: 80000, max: 130000, step: 1 } }, (p) => ({
  prompt: `Recall: how much of a ${money(p.take)} take-home pay goes into the Saving bucket (15%)?`, answer: splitBuckets(p.take).saving,
  explanation: `15% rounds to ${money(splitBuckets(p.take).saving)}.`,
}));

const afterIncome = num('m02-after-income', 'interpreting', { start: { min: 1000, max: 30000, step: 1 }, add: { min: 5000, max: 20000, step: 1 } }, (p) => ({
  prompt: `The Blow money page balance is ${money(p.start)}. Payday adds ${money(p.add)}. What is the new balance?`,
  answer: p.start + p.add, explanation: `Money in adds: ${money(p.start)} + ${money(p.add)} = ${money(p.start + p.add)}.`,
}));

const twoLines = num('m02-two-lines', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, a: { min: 300, max: 5000, step: 1 }, b: { min: 300, max: 5000, step: 1 } }, (p) => ({
  prompt: `A Spending page shows ${money(p.start)}. The next two lines are money out ${money(p.a)} and then money out ${money(p.b)}. What is the balance after both lines?`,
  answer: p.start - p.a - p.b, explanation: `${money(p.start)} − ${money(p.a)} − ${money(p.b)} = ${money(p.start - p.a - p.b)}.`,
}));

const pageEnd = num('m02-page-end', 'interpreting', { start: { min: 10000, max: 40000, step: 1 }, pay: { min: 40000, max: 70000, step: 1 }, a: { min: 500, max: 8000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const end = p.start + p.pay - p.a - p.b;
  return {
    prompt: `What does the Balance column read on the last line of ${p.name}'s Spending page?`,
    ledger: page('Spending bucket', [['2026-06-06', 'Brought forward', p.start, 0], ['2026-06-06', 'From paycheck', p.pay, 0], ['2026-06-08', 'Groceries', 0, p.a], ['2026-06-12', 'Gas', 0, p.b]], { name: p.name, askFrom: 1, broughtForward: true }),
    highlightRow: 3,
    answer: end,
    misconceptions: [{ cents: p.start + p.pay + p.a + p.b, explanation: 'Money out is subtracted, not added.' }],
    explanation: `${money(p.start)} + ${money(p.pay)} − ${money(p.a)} − ${money(p.b)} = ${money(end)}.`,
  };
});

// Working a running balance backward: the line above from the line below.
const findStart = num('m02-find-start', 'interpreting', { before: { min: 10000, max: 60000, step: 1 }, cost: { min: 500, max: 9000, step: 1 }, item: { pick: ['Groceries', 'Bus pass', 'Phone bill', 'Laundry'] } }, (p) => ({
  prompt: `On a Spending page, the line "${p.item}" has money out of ${money(p.cost)}, and its balance reads ${money(p.before - p.cost)}. What did the balance read on the line above it?`,
  answer: p.before,
  misconceptions: [{ cents: p.before - 2 * p.cost, explanation: 'Money out made the balance smaller, so the line above was larger: add it back.' }],
  explanation: `Going back up the page, add the money out back: ${money(p.before - p.cost)} + ${money(p.cost)} = ${money(p.before)}.`,
}));

// Production: carry a full sheet forward and keep the new sheet going.
const newSheet = {
  id: 'm02-new-sheet', module: 'm02', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 90000, step: 1 }, a: { min: 500, max: 9000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, take: { min: 80000, max: 130000, step: 1 }, bus: { min: 2000, max: 6400, step: 100 }, name: { pick: NAMES } },
  build: (p) => {
    const last = p.start - p.a - p.b;
    const share = splitBuckets(p.take).spending;
    return {
      prompt: `${p.name}'s Spending page, Sheet 1, is full. Work out its last balance, then start Sheet 2: bring the balance forward, add ${money(share)} from payday, then take out ${money(p.bus)} for a bus pass.`,
      ledger: page('Spending bucket', [['2026-06-20', 'Brought forward', p.start, 0], ['2026-06-24', 'Groceries', 0, p.a], ['2026-06-27', 'Phone bill', 0, p.b]], { name: p.name, askFrom: 1, broughtForward: true }),
      fields: [
        { label: 'Sheet 1: last balance', answer: last },
        { label: 'Sheet 2: brought forward', answer: last },
        { label: 'Sheet 2: balance after payday', answer: last + share },
        { label: 'Sheet 2: balance after the bus pass', answer: last + share - p.bus },
      ],
      explanation: `Sheet 1 ends at ${money(last)}, and Sheet 2 starts with that same amount brought forward. Then + ${money(share)} = ${money(last + share)}, and − ${money(p.bus)} = ${money(last + share - p.bus)}.`,
    };
  },
};

// --- Lesson -------------------------------------------------------------------

const spendingRows = [
  ['2026-06-06', 'From paycheck', 62007, 0],
  ['2026-06-07', 'Groceries', 0, 4826],
  ['2026-06-08', 'Bus pass', 0, 6400],
  ['2026-06-10', 'Phone bill', 0, 4500],
];

export const M02_LESSON = {
  id: 'm02',
  title: 'The ledger page',
  coreIdea: 'Each line of a ledger page records one event. The Balance column always shows what is in the account after that line.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['five-buckets', 'percentages'],
      text: ['From Module 1: a take-home pay of $1,000.00 is split into buckets. How much goes into the Saving bucket (15%)?'],
      answer: 15000,
      misconceptions: [{ cents: 1500, explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
      explanation: '10% is $100.00 and 5% is $50.00, so 15% is $150.00.',
    },
    {
      id: 'columns', kind: 'explain', title: 'Reading the columns', uses: ['ledger-columns', 'page-per-bucket'],
      text: [
        'Here is a Spending bucket page. Read it left to right, one line at a time.',
        'Date: when it happened. Items: what it was, in a few words. Balance: how much is in the bucket after this line. Money in and money out are listed beside the sheet for now. Module 3 gives them their own columns.',
        'The header tells you whose page this is (Name), which bucket it is (Account), and which sheet of that account you are on (Sheet No.).',
      ],
      prompt: 'On the highlighted line, what happened and how much was left after it?',
      promptAnswer: 'Groceries cost $48.26 on June 7, and $571.81 was left in the Spending bucket after that line.',
      ledger: page('Spending bucket', spendingRows.slice(0, 2)),
      highlightRow: 1,
    },
    {
      id: 'running', kind: 'explain', title: 'Keeping a running balance', uses: ['running-balance', 'ledger-columns'],
      text: [
        'Worked example. Step 1: start from the balance on the line above. Step 2: money in adds to it. Money out subtracts from it. Step 3: write the new balance on this line.',
        'Groceries: $620.07 − $48.26 = $571.81. Bus pass: $571.81 − $64.00 = $507.81. Phone bill: $507.81 − $45.00 = $462.81.',
        'Because every line has its own balance, you always know what is in the bucket right now. And if a balance ever looks wrong, you can find the exact line where the mistake happened.',
      ],
      prompt: 'Why do we start from the balance on the line above, not from the first line?',
      promptAnswer: 'The line above already includes everything that happened before. Starting there means each line only adds or subtracts one new amount.',
      ledger: page('Spending bucket', spendingRows),
      highlightRow: 3,
    },
    {
      id: 'predict-out', kind: 'predict', title: 'Predict: money out', uses: ['running-balance'],
      text: ['On June 12, lunch costs $12.50 from the Spending bucket. What will the Balance column read on that line?'],
      ledger: page('Spending bucket', [...spendingRows, ['2026-06-12', 'Lunch', 0, 1250]], { askFrom: 4 }),
      highlightRow: 4,
      answer: 45031,
      misconceptions: [{ cents: 47531, explanation: 'Money out makes the balance go down, so subtract $12.50 instead of adding it.' }],
      explanation: '$462.81 − $12.50 = $450.31.',
    },
    {
      id: 'predict-in', kind: 'predict', title: 'Predict: money in again', uses: ['running-balance'],
      text: ['The Blow money page got $103.35 on payday. Then a movie cost $18.75. On the next payday, another $103.35 comes in. What is the balance after that line?'],
      ledger: page('Blow money', [['2026-06-06', 'From paycheck', 10335, 0], ['2026-06-13', 'Movie', 0, 1875], ['2026-06-20', 'From paycheck', 10335, 0]], { askFrom: 1, accountNo: 6 }),
      highlightRow: 2,
      answer: 18795,
      misconceptions: [{ cents: 20670, explanation: 'The movie took $18.75 out before the second payday, so subtract it first.' }],
      explanation: '$103.35 − $18.75 = $84.60, then $84.60 + $103.35 = $187.95.',
    },
    {
      id: 'carry', kind: 'explain', title: 'When a sheet is full', uses: ['carry-forward', 'running-balance'],
      text: [
        'A paper sheet has room for about 25 lines. When it is full, start Sheet 2 for the same account.',
        'Its first line says "Brought forward". It carries the last balance from Sheet 1, so the account continues where it left off. Here, Sheet 1 of the Saving bucket ended at $1,240.16.',
      ],
      prompt: 'What would go wrong if Sheet 2 started from zero?',
      promptAnswer: 'The money from Sheet 1 would disappear from your books, and every balance on Sheet 2 would be too low.',
      ledger: page('Saving bucket', [['2026-08-01', 'Brought forward', 124016, 0]], { sheetNo: 2, accountNo: 3, broughtForward: true }),
      highlightRow: 0,
    },
    {
      id: 'predict-carry', kind: 'predict', title: 'Predict: after carrying forward', uses: ['carry-forward', 'running-balance'],
      text: ['On Sheet 2, payday adds $155.02 to the Saving bucket. What is the balance after that line?'],
      ledger: page('Saving bucket', [['2026-08-01', 'Brought forward', 124016, 0], ['2026-08-01', 'From paycheck, 15%', 15502, 0]], { sheetNo: 2, accountNo: 3, broughtForward: true, askFrom: 1 }),
      highlightRow: 1,
      answer: 139518,
      misconceptions: [{ cents: 15502, explanation: 'Sheet 2 starts from the balance brought forward, not from zero.' }],
      explanation: '$1,240.16 + $155.02 = $1,395.18.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked lines', uses: ['running-balance'],
      text: ['Two lines are done for you. After the paycheck the Spending balance was $500.00. After groceries of $38.80 it was $461.20. Finish the next line: a phone bill of $45.00 goes out. What is the balance?'],
      answer: 41620,
      misconceptions: [{ cents: 50620, explanation: 'Money out makes the balance go down. Subtract $45.00 from $461.20.' }],
      explanation: '$461.20 − $45.00 = $416.20.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['running-balance'],
      text: ['A Charity bucket page shows $50.00 in, then $35.40 out, then $12.99 out, then $51.67 in. What is the balance after the last line?'],
      ledger: page('Charity bucket', [['2026-06-06', 'From paycheck', 5000, 0], ['2026-06-09', 'Food bank', 0, 3540], ['2026-06-14', 'Fundraiser', 0, 1299], ['2026-06-20', 'From paycheck', 5167, 0]], { askFrom: 0, accountNo: 5 }),
      highlightRow: 3,
      answer: 5328,
      explanation: '$50.00 − $35.40 = $14.60; − $12.99 = $1.61; + $51.67 = $53.28.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['running-balance'],
      text: ['A bucket shows $210.00. Then there is money out of $47.50. What is the new balance?'],
      answer: 16250,
      explanation: '$210.00 − $47.50 = $162.50.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['running-balance'],
      text: ['The same bucket then gets money in of $103.35. What is the new balance?'],
      answer: 26585,
      misconceptions: [{ cents: 31335, explanation: 'Start from the balance after the money out, not from $210.00.' }],
      explanation: '$162.50 + $103.35 = $265.85.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['carry-forward', 'running-balance'],
      text: ['That sheet is now full. Sheet 2 starts with a "Brought forward" line, then money out of $19.99. What is the balance after the money out?'],
      answer: 24586,
      explanation: 'Brought forward $265.85, then $265.85 − $19.99 = $245.86.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [afterSpending, broughtForwardThenIn].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation.
const drill = [1, 2, 3].map((n) => num(`m02-drill-${n}`, 'interpreting', { a: { min: 5000, max: 50000, step: 1 }, b: { min: 100, max: 4999, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: balance ${money(p.a)}, money out ${money(p.b)}. New balance?`, answer: p.a - p.b,
  explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

export const M02_PRACTICE = {
  id: 'm02-practice', kind: 'practice', module: 'm02', title: 'Module 2 practice set',
  templates: [...drill, recallSplit, ...M01_LESSON.recallTemplates, afterIncome, afterSpending, twoLines, broughtForwardThenIn, fourBalances, { ...explainLedger, id: 'm02-explain-practice' }],
};

export const M02_EXTRA = {
  id: 'm02-extra', kind: 'practice', module: 'm02', title: 'Module 2 extra practice',
  templates: [afterIncome, twoLines, pageEnd, findStart, fourBalances, newSheet].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M02_REMEDIAL = {
  id: 'm02-remedial', kind: 'practice', module: 'm02', title: 'Module 2: common mistakes',
  templates: [afterSpending, broughtForwardThenIn, twoLines].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
export const M02_GATE = {
  id: 'm02', kind: 'gate', title: 'Module 2 check',
  templates: [afterSpending, broughtForwardThenIn, afterIncome, twoLines, pageEnd, findStart, drill[0], fourBalances, newSheet, explainLedger],
};

// Questions Checkpoint A draws from this module.
export const M02_CHECKPOINT = [afterSpending, fourBalances];
