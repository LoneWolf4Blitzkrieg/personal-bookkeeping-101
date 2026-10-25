// Module 7: Everyday spending. Ideas: source-documents, recording-purchases,
// transfers. Receipts appear beside the journal as the thing being recorded.
// Stores and prices are fictional (illustrative).

import { money, NAMES, explainTemplate, accountOptions, chartPage, journal } from '../helpers.js';
import { M03_LESSON } from './m03.js';
import { M05_LESSON } from './m05.js';
import { M06_LESSON, M06_GATE } from './m06.js';

const num = (id, part, params, build) => ({ id, module: 'm07', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const sum = (list) => list.reduce((s, x) => s + x, 0);

// A receipt as a source document. Items are [label, cents].
function receipt(store, items, paidBy = 'Debit card') {
  return {
    kind: 'receipt',
    title: `Receipt: ${store}`,
    lines: [...items, ['Total', sum(items.map(([, c]) => c))], ['Paid by', paidBy]],
    note: 'Store and prices are fictional (illustrative). Prices include sales tax.',
  };
}

const STORES = ['Desert Mart (fictional)', 'Saguaro Grocery (fictional)', 'Corner Market (fictional)'];
const GROCERY_ITEMS = [['Bread', 'Milk', 'Apples'], ['Rice', 'Beans', 'Eggs'], ['Pasta', 'Tomato sauce', 'Cheese']];
const HOUSEHOLD_ITEMS = [['Dish soap', 'Paper towels'], ['Laundry soap', 'Trash bags'], ['Sponges', 'Toilet paper']];

// --- Question templates -----------------------------------------------------

const receiptSplit = num('m07-receipt-split', 'interpreting', {
  g1: { min: 150, max: 900, step: 1 }, g2: { min: 150, max: 900, step: 1 }, g3: { min: 150, max: 1200, step: 1 },
  h1: { min: 199, max: 1200, step: 1 }, h2: { min: 199, max: 900, step: 1 }, set: { pick: [0, 1, 2] }, store: { pick: [0, 1, 2] }, ask: { pick: ['groceries', 'household'] },
}, (p) => {
  const g = [p.g1, p.g2, p.g3];
  const h = [p.h1, p.h2];
  const items = [...GROCERY_ITEMS[p.set].map((l, i) => [l, g[i]]), ...HOUSEHOLD_ITEMS[p.set].map((l, i) => [l, h[i]])];
  const want = p.ask === 'groceries' ? sum(g) : sum(h);
  const page = p.ask === 'groceries' ? 'Groceries' : 'Household supplies';
  return {
    prompt: `This receipt has groceries and household supplies on it, so it is recorded on two expense pages. How much is debited to ${page}?`,
    sourceDoc: receipt(STORES[p.store], items),
    answer: want,
    misconceptions: [{ cents: sum(g) + sum(h), explanation: `That is the whole receipt. Only the ${p.ask === 'groceries' ? 'food' : 'household'} items go to ${page}.` }],
    explanation: `${page}: ${(p.ask === 'groceries' ? g : h).map(money).join(' + ')} = ${money(want)}.`,
  };
});

const spentOrMoved = num('m07-spent', 'interpreting', {
  atm: { min: 2000, max: 8000, step: 100 }, groc: { min: 1500, max: 9000, step: 1 }, save: { min: 1000, max: 6000, step: 100 }, lunch: { min: 500, max: 1500, step: 1 },
  ask: { pick: ['spent', 'bucket'] }, name: { pick: NAMES },
}, (p) => {
  const events = `${p.name} takes ${money(p.atm)} out of an ATM, pays ${money(p.groc)} for groceries by debit card, moves ${money(p.save)} from the Spending bucket into Saving, and pays ${money(p.lunch)} cash for lunch.`;
  if (p.ask === 'spent') {
    return {
      prompt: `In one week, ${events} How much did ${p.name} spend, that is, how much was debited to expense pages?`,
      answer: p.groc + p.lunch,
      misconceptions: [{ cents: p.atm + p.groc + p.save + p.lunch, explanation: 'The ATM withdrawal and the move to Saving are transfers: no expense page changes.' }],
      explanation: `Only the groceries and the lunch are expenses: ${money(p.groc)} + ${money(p.lunch)} = ${money(p.groc + p.lunch)}.`,
    };
  }
  return {
    prompt: `In one week, ${events} By how much did the Spending bucket go down?`,
    answer: p.atm + p.groc + p.save,
    misconceptions: [{ cents: p.groc + p.lunch, explanation: 'Transfers out of the Spending bucket lower it too, and the lunch was paid from Cash, not from the Spending bucket.' }],
    explanation: `The Spending bucket is credited for the ATM withdrawal, the groceries and the move to Saving: ${money(p.atm)} + ${money(p.groc)} + ${money(p.save)} = ${money(p.atm + p.groc + p.save)}. The lunch came out of Cash.`,
  };
});

const PURCHASE_ACCOUNTS = accountOptions(['spending', 'charity', 'blow', 'cash', 'groceries', 'eating-out', 'donations', 'household']);
const PURCHASE_EVENTS = {
  split: (p) => ({
    prompt: 'Write the journal entry for this receipt.',
    sourceDoc: receipt(STORES[p.store], [['Bread', p.a], ['Eggs', p.b], ['Dish soap', p.c]]),
    answer: [{ account: 'groceries', debit: p.a + p.b, credit: 0 }, { account: 'household', debit: p.c, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b + p.c }],
    explanation: `Groceries (bread and eggs, ${money(p.a + p.b)}) and Household supplies (dish soap, ${money(p.c)}) are debited. It was paid by debit card, so the Spending bucket is credited for the total.`,
  }),
  cash: (p) => ({
    prompt: `Write the journal entry: you pay ${money(p.a + p.b)} in cash for a meal out.`,
    answer: [{ account: 'eating-out', debit: p.a + p.b, credit: 0 }, { account: 'cash', debit: 0, credit: p.a + p.b }],
    explanation: 'Eating out (an expense) is debited. The money came from your wallet, so Cash is credited.',
  }),
  atm: (p) => ({
    prompt: `Write the journal entry: you take ${money(p.a + p.b + p.c)} out of an ATM, from the money in your Spending bucket.`,
    answer: [{ account: 'cash', debit: p.a + p.b + p.c, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b + p.c }],
    explanation: 'A transfer: Cash goes up (debit) and the Spending bucket goes down (credit). No expense page changes.',
  }),
  donation: (p) => ({
    prompt: `Write the journal entry: you give ${money(p.a + p.b)} to a food bank by debit card, from your Charity bucket.`,
    answer: [{ account: 'donations', debit: p.a + p.b, credit: 0 }, { account: 'charity', debit: 0, credit: p.a + p.b }],
    explanation: 'Donations (an expense) is debited. The money came from the Charity bucket, so it is credited.',
  }),
};
const recordPurchase = {
  id: 'm07-record-purchase', module: 'm07', kind: 'entry', part: 'producing', points: 4,
  params: { a: { min: 200, max: 1500, step: 1 }, b: { min: 200, max: 1500, step: 1 }, c: { min: 199, max: 900, step: 1 }, store: { pick: [0, 1, 2] }, event: { pick: Object.keys(PURCHASE_EVENTS) } },
  build: (p) => ({ accounts: PURCHASE_ACCOUNTS, ...PURCHASE_EVENTS[p.event](p) }),
};

const explainSpending = explainTemplate({
  id: 'm07-explain', module: 'm07',
  variants: [
    { prompt: 'In one or two sentences: why is moving money from the Spending bucket into Cash not an expense?',
      modelAnswer: 'Nothing is used up. One asset goes down and another goes up by the same amount, so no expense page changes and net worth stays the same.',
      rubric: ['Says one of your own pages goes down and another goes up (a transfer)', 'Says no expense is recorded, or net worth does not change'] },
    { prompt: 'In one or two sentences: why keep a receipt after you have recorded it?',
      modelAnswer: 'It is the proof of the amount. If a balance looks wrong, or you return something, you can check the entry against it.',
      rubric: ['Says it proves the amount (it is the source document)', 'Says you can check the entry against it later (errors, returns)'] },
    { prompt: 'In one or two sentences: a purchase paid by debit card credits the Spending bucket, but one paid in cash credits Cash. Why?',
      modelAnswer: 'The credit goes to the page the money came from. A debit card takes bank money held in the Spending bucket; cash comes out of your wallet.',
      rubric: ['Says the credit goes where the money came from', 'Names the bank money (Spending bucket) for a debit card and the wallet (Cash) for cash'] },
    { prompt: 'In one or two sentences: why is one receipt sometimes recorded on two expense pages?',
      modelAnswer: 'Because it can hold two kinds of spending, such as groceries and household supplies. Each kind has its own page, so the amounts are split between them.',
      rubric: ['Says the receipt has more than one kind of spending', 'Says each kind goes to its own expense page'] },
  ],
});

const cashPage = num('m07-cash-page', 'interpreting', { atm: { min: 2000, max: 8000, step: 100 }, a: { min: 300, max: 1500, step: 1 }, b: { min: 150, max: 800, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} takes cash out of an ATM, then pays cash for lunch and a bus fare. What does the Cash page read after the bus fare?`,
  ledger: chartPage('cash', [
    ['2026-06-03', 'ATM withdrawal', 'J4', p.atm, 0, true],
    ['2026-06-05', 'Lunch', 'J4', 0, p.a, true],
    ['2026-06-06', 'Bus fare', 'J4', 0, p.b, true],
  ], { name: p.name, askFrom: 1 }),
  highlightRow: 2,
  answer: p.atm - p.a - p.b,
  misconceptions: [{ cents: p.atm - p.a + p.b, explanation: 'Cash pays for the bus fare too: subtract.' }],
  explanation: `${money(p.atm)} − ${money(p.a)} − ${money(p.b)} = ${money(p.atm - p.a - p.b)}.`,
}));

// Completion: a week on the Spending bucket page, with purchases and transfers.
const weekBalances = {
  id: 'm07-week-balances', module: 'm07', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 30000, max: 60000, step: 1 }, a: { min: 1500, max: 7000, step: 1 }, atm: { min: 2000, max: 6000, step: 100 }, save: { min: 2000, max: 5000, step: 100 }, d: { min: 500, max: 2500, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const credits = [p.a, p.atm, p.save, p.d];
    let b = p.start;
    const balances = credits.map((c) => (b -= c));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending bucket page. Two lines are purchases and two are transfers.`,
      ledger: chartPage('spending', [
        ['2026-06-13', 'Brought forward', '', p.start, 0],
        ['2026-06-14', 'Groceries (receipt)', 'J5', 0, p.a, true],
        ['2026-06-15', 'ATM withdrawal', 'J5', 0, p.atm, true],
        ['2026-06-16', 'To Saving bucket', 'J5', 0, p.save, true],
        ['2026-06-18', 'Bus pass (receipt)', 'J5', 0, p.d, true],
      ], { name: p.name, askFrom: 1 }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Purchases and transfers out are both credits to the Spending bucket. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

// --- Lesson -------------------------------------------------------------------

export const M07_LESSON = {
  id: 'm07',
  title: 'Everyday spending',
  coreIdea: 'Every purchase is recorded from its source document: the expense is debited and the page the money came from is credited. A transfer between your own pages is not spending.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['posting'],
      text: ['From Module 6: the Spending bucket shows $275.40. A journal line crediting it $38.15 is posted. What is the new balance?'],
      answer: 23725,
      misconceptions: [{ cents: 31355, explanation: 'A credit lowers an asset: subtract.' }],
      explanation: '$275.40 − $38.15 = $237.25.',
    },
    {
      id: 'source-docs', kind: 'explain', title: 'Source documents', uses: ['source-documents', 'journal-entry'],
      text: [
        'Every entry starts from a source document: the paper or screen that proves the event happened and shows the amount. Receipts, pay stubs, checks, and bank and card statements are all source documents.',
        'Write the journal entry from the source document, and name it in the explanation, such as "Desert Mart receipt". Then keep it. One envelope or folder per month is enough.',
      ],
      prompt: 'Why keep the receipt after you have written the entry?',
      promptAnswer: 'It proves the amount. If a balance looks wrong, or you return something, you can check the entry against it.',
      sourceDoc: receipt(STORES[0], [['Bread', 349], ['Eggs', 412], ['Apples', 580]]),
      journalPage: journal([['2026-06-08', 'J4', 'Desert Mart receipt', [['groceries', 1341, 0], ['spending', 0, 1341]]]], { sheetNo: 4 }),
      highlightEntry: 0,
    },
    {
      id: 'predict-split', kind: 'predict', title: 'Predict: one receipt, two pages', uses: ['source-documents', 'personal-accounts'],
      text: ['This receipt has groceries and household supplies on it. Each goes to its own expense page. How much is debited to Groceries?'],
      sourceDoc: receipt(STORES[0], [['Bread', 349], ['Milk', 389], ['Bananas', 215], ['Paper towels', 699], ['Dish soap', 375]]),
      answer: 953,
      misconceptions: [{ cents: 2027, explanation: 'The paper towels and dish soap are household supplies, which have their own page.' }],
      explanation: 'Groceries: $3.49 + $3.89 + $2.15 = $9.53. The other $10.74 goes to Household supplies.',
    },
    {
      id: 'purchases', kind: 'explain', title: 'Recording purchases', uses: ['recording-purchases', 'debit-credit-rules'],
      text: [
        'A purchase uses money up, so its expense page is debited. The credit goes to the page the money came from.',
        'Paid by debit card: the money leaves the bank at once, so credit the bucket it came from, usually the Spending bucket (2). Paid with cash: credit Cash (7). A treat from blow money: credit Blow money (6). A donation: debit Donations (57) and credit the Charity bucket (5).',
        'The journal page shows a debit-card purchase, a cash purchase and a donation.',
      ],
      prompt: 'Why is the Spending bucket credited for a debit-card purchase, but Cash for a cash purchase?',
      promptAnswer: 'The credit goes to wherever the money came from. A debit card takes bank money held in the Spending bucket; cash comes from your wallet.',
      journalPage: journal([
        ['2026-06-08', 'J4', 'Desert Mart receipt (debit card)', [['groceries', 1341, 0, true], ['spending', 0, 1341, true]]],
        ['2026-06-09', 'J4', 'Lunch, paid in cash', [['eating-out', 975, 0, true], ['cash', 0, 975, true]]],
        ['2026-06-11', 'J4', 'Food bank donation', [['donations', 2000, 0, true], ['charity', 0, 2000, true]]],
      ], { sheetNo: 4 }),
      ledger: chartPage('cash', [['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true], ['2026-06-09', 'Lunch', 'J4', 0, 975, true]]),
      highlightRow: 1,
    },
    {
      id: 'predict-cash', kind: 'predict', title: 'Predict: the Cash page', uses: ['recording-purchases', 'posting'],
      text: ['Devon pays cash for lunch and for a $2.00 bus fare. What does the Cash page read after the bus fare?'],
      ledger: chartPage('cash', [
        ['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true],
        ['2026-06-09', 'Lunch', 'J4', 0, 975, true],
        ['2026-06-10', 'Bus fare', 'J4', 0, 200, true],
      ], { name: 'Devon (example)', askFrom: 1 }),
      highlightRow: 2,
      answer: 4825,
      misconceptions: [{ cents: 5225, explanation: 'Cash pays for the bus fare too: subtract.' }],
      explanation: '$60.00 − $9.75 − $2.00 = $48.25.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['recording-purchases', 'source-documents'],
      text: ['Rosa paid for this receipt by debit card. Step 1 is done: the groceries add up to $21.85, debited to Groceries. Step 2 is done: the Spending bucket is credited the whole $34.60. Finish Step 3: how much is debited to Household supplies?'],
      sourceDoc: receipt(STORES[1], [['Rice', 840], ['Beans', 315], ['Chicken', 1030], ['Paper towels', 699], ['Sponges', 576]]),
      answer: 1275,
      misconceptions: [{ cents: 5645, explanation: 'The two debits together must equal the $34.60 credit: subtract the groceries from the total.' }],
      explanation: '$34.60 − $21.85 = $12.75, which is $6.99 + $5.76. Debits: $21.85 + $12.75 = $34.60, equal to the credit.',
    },
    {
      id: 'transfers', kind: 'explain', title: 'Transfers are not spending', uses: ['transfers', 'accounting-equation'],
      text: [
        'Moving money between your own pages is a transfer: an ATM withdrawal (debit Cash, credit the Spending bucket), moving money into the Saving bucket, or splitting a paycheck into buckets.',
        'A transfer is not spending. Nothing is used up and no expense page changes, so your net worth stays the same. Only the place the money is kept changes.',
        'A purchase is different. It debits an expense, and your net worth goes down by the amount spent.',
      ],
      prompt: 'You take $60.00 out of an ATM. Have you spent $60.00? Explain using the two pages.',
      promptAnswer: 'No. Cash went up by $60.00 and the Spending bucket went down by $60.00. You still have the money, now in your wallet, and no expense page changed.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true]]),
        chartPage('spending', [['2026-06-01', 'Brought forward', '', 41200, 0], ['2026-06-03', 'ATM withdrawal', 'J4', 0, 6000, true]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-networth', kind: 'predict', title: 'Predict: net worth', uses: ['transfers', 'accounting-equation'],
      text: ['Devon\'s net worth is $1,240.00. He takes $60.00 cash out of his Spending bucket at an ATM, then spends $9.50 of it on lunch. What is his net worth now?'],
      answer: 123050,
      misconceptions: [{ cents: 117050, explanation: 'The ATM withdrawal is a transfer: it does not change net worth. Only the lunch does.' }],
      explanation: 'Only the lunch is an expense: $1,240.00 − $9.50 = $1,230.50.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['recording-purchases', 'transfers'],
      text: ['Rosa\'s Spending bucket shows $380.00. She moves $50.00 to Blow money, then pays $42.18 for groceries by debit card. What does the Spending bucket show now?'],
      answer: 28782,
      misconceptions: [{ cents: 33782, explanation: 'Moving money to Blow money is a transfer, but it still leaves the Spending bucket: credit it.' }],
      explanation: '$380.00 − $50.00 − $42.18 = $287.82.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['source-documents'],
      text: ['How much of this receipt is debited to Household supplies?'],
      sourceDoc: receipt(STORES[2], [['Pasta', 189], ['Tomato sauce', 249], ['Laundry soap', 1199], ['Trash bags', 725]]),
      answer: 1924,
      misconceptions: [{ cents: 2362, explanation: 'That is the whole receipt. The pasta and sauce are groceries.' }],
      explanation: 'Laundry soap and trash bags: $11.99 + $7.25 = $19.24.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['transfers', 'recording-purchases'],
      text: ['In one week Kai takes $40.00 out of an ATM, pays $63.10 for groceries by debit card, moves $25.00 into Saving, and pays $8.75 cash for lunch. How much did he spend, that is, how much was debited to expense pages?'],
      answer: 7185,
      misconceptions: [{ cents: 13685, explanation: 'The ATM withdrawal and the move to Saving are transfers, not spending.' }],
      explanation: 'Groceries and lunch: $63.10 + $8.75 = $71.85.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['recording-purchases'],
      text: ['The Cash page shows $33.60. You buy a $4.25 drink with cash. What does the Cash page show now?'],
      answer: 2935,
      misconceptions: [{ cents: 3785, explanation: 'Cash paid, so it is credited: subtract.' }],
      explanation: '$33.60 − $4.25 = $29.35.',
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
  recallTemplates: [receiptSplit, spentOrMoved].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M07_GATE = { id: 'm07', kind: 'gate', title: 'Module 7 check', templates: [receiptSplit, spentOrMoved, recordPurchase, explainSpending] };

// Fluency drill on the core operation: a debit-card purchase.
const drill = [1, 2, 3].map((n) => num(`m07-drill-${n}`, 'interpreting', { a: { min: 10000, max: 50000, step: 1 }, b: { min: 150, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the Spending bucket shows ${money(p.a)}. You pay ${money(p.b)} by debit card. New balance?`, answer: p.a - p.b,
  explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const recordJournalMixed = { ...M06_GATE.templates.find((t) => t.part === 'producing'), id: 'm06-record-journal-mixed-m07' };

export const M07_PRACTICE = {
  id: 'm07-practice', kind: 'practice', module: 'm07', title: 'Module 7 practice set',
  templates: [...drill, ...M06_LESSON.recallTemplates, ...M05_LESSON.recallTemplates, ...M03_LESSON.recallTemplates, receiptSplit, spentOrMoved, cashPage, weekBalances, recordPurchase, recordJournalMixed, { ...explainSpending, id: 'm07-explain-practice' }],
};

export const M07_EXTRA = {
  id: 'm07-extra', kind: 'practice', module: 'm07', title: 'Module 7 extra practice',
  templates: [receiptSplit, cashPage, recordPurchase].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M07_REMEDIAL = {
  id: 'm07-remedial', kind: 'practice', module: 'm07', title: 'Module 7: common mistakes',
  templates: [spentOrMoved, weekBalances, recordPurchase].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint B draws from this module.
export const M07_CHECKPOINT = [receiptSplit, spentOrMoved, recordPurchase];
