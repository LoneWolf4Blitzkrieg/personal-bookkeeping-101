// Module 6: The journal and posting. Ideas: journal-entry, posting,
// posted-marks. From here every event is written in the journal first; the
// ledger Folio holds the journal page (J1) and the journal Folio holds the
// ledger account number. Amounts are illustrative.

import { money, NAMES, explainTemplate, splitBuckets, accountOptions, chartPage, journal, CHART } from '../helpers.js';
import { M02_LESSON } from './m02.js';
import { M04_LESSON } from './m04.js';
import { M05_LESSON, M05_GATE } from './m05.js';

const num = (id, part, params, build) => ({ id, module: 'm06', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });

// --- Question templates -----------------------------------------------------

// One journal entry and the ledger page it goes to. The line is dated with
// its folio, but its amount is left for the learner to post from the journal;
// in the journal that line's folio is still empty (not yet posted).
const TO_POST = ['debit', 'credit', 'balance', 'side'];
const POST_EVENTS = {
  groceries: { page: 'spending', explanation: 'Groceries', lines: (a) => [['groceries', a, 0, true], ['spending', 0, a, false]], debitPage: false },
  share: { page: 'saving', explanation: 'Saving share of paycheck', lines: (a) => [['saving', a, 0, false], ['checking', 0, a, true]], debitPage: true },
  lunch: { page: 'cash', explanation: 'Lunch', lines: (a) => [['eating-out', a, 0, true], ['cash', 0, a, false]], debitPage: false },
};
const postBalance = num('m06-post-balance', 'interpreting', { start: { min: 9000, max: 60000, step: 1 }, amount: { min: 500, max: 8000, step: 1 }, event: { pick: Object.keys(POST_EVENTS) }, name: { pick: NAMES } }, (p) => {
  const e = POST_EVENTS[p.event];
  const answer = e.debitPage ? p.start + p.amount : p.start - p.amount;
  const wrong = e.debitPage ? p.start - p.amount : p.start + p.amount;
  const pageName = CHART[e.page].name;
  return {
    prompt: `Post this journal entry to the ${pageName} page. The line already has its date and folio. What will the ${pageName} balance be after it?`,
    journalPage: journal([['2026-06-10', 'J2', e.explanation, e.lines(p.amount)]], { sheetNo: 2, name: p.name }),
    ledger: chartPage(e.page, [['2026-06-06', 'Brought forward', '', p.start, 0], ['2026-06-10', e.explanation, 'J2', e.debitPage ? p.amount : 0, e.debitPage ? 0 : p.amount]], { name: p.name, askFrom: 1, askKeys: TO_POST }),
    highlightRow: 1,
    answer,
    misconceptions: [{ cents: wrong, explanation: `In the journal, ${pageName} is ${e.debitPage ? 'debited' : 'credited'}, so it is posted as a ${e.debitPage ? 'debit: add' : 'credit: subtract'}.` }],
    explanation: `${money(p.start)} ${e.debitPage ? '+' : '−'} ${money(p.amount)} = ${money(answer)}.`,
  };
});

// A journal page where one line has not been posted (empty Folio).
const unposted = num('m06-unposted', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, a: { min: 1000, max: 8000, step: 1 }, b: { min: 1500, max: 9000, step: 1 }, second: { pick: ['phone', 'household', 'transport'] }, name: { pick: NAMES } }, (p) => {
  const answer = p.start - p.a - p.b;
  return {
    prompt: `One line on ${p.name}'s journal page has not been posted: its Folio column is empty. When it is posted, what will the Spending bucket balance be?`,
    journalPage: journal([
      ['2026-06-12', 'J2', 'Groceries', [['groceries', p.a, 0, true], ['spending', 0, p.a, true]]],
      ['2026-06-13', 'J2', CHART[p.second].name, [[p.second, p.b, 0, true], ['spending', 0, p.b, false]]],
    ], { sheetNo: 2, name: p.name }),
    ledger: chartPage('spending', [['2026-06-06', 'Brought forward', '', p.start, 0], ['2026-06-12', 'Groceries', 'J2', 0, p.a, true]], { name: p.name }),
    highlightRow: 1,
    answer,
    misconceptions: [{ cents: p.start - p.a, explanation: `That is the balance before the missing line. The Spending line of the ${CHART[p.second].name} entry still has to be posted.` }],
    explanation: `The ${CHART[p.second].name} entry's credit to the Spending bucket has no folio yet. Posting it: ${money(p.start - p.a)} − ${money(p.b)} = ${money(answer)}.`,
  };
});

const JOURNAL_ACCOUNTS = accountOptions(['checking', 'spending', 'saving', 'investing', 'charity', 'blow', 'rent', 'phone', 'groceries', 'household']);
// Every scenario is a three-line entry: two debits and one credit.
const JOURNAL_EVENTS = {
  split: (p) => ({
    prompt: `Write the journal entry: one shopping trip, paid from the Spending bucket, was ${money(p.a)} of groceries and ${money(p.b)} of household supplies.`,
    answer: [{ account: 'groceries', debit: p.a, credit: 0 }, { account: 'household', debit: p.b, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b }],
    explanation: `Groceries and Household supplies (expenses) are debited. The Spending bucket is credited for both: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
  }),
  shares: (p) => {
    const s = splitBuckets(p.take);
    return {
      prompt: `Write the journal entry for moving two shares of a ${money(p.take)} paycheck out of Checking: Saving ${money(s.saving)} and Investing ${money(s.investing)}.`,
      answer: [{ account: 'saving', debit: s.saving, credit: 0 }, { account: 'investing', debit: s.investing, credit: 0 }, { account: 'checking', debit: 0, credit: s.saving + s.investing }],
      explanation: `Both buckets (assets) are debited. Checking is credited for both: ${money(s.saving + s.investing)}.`,
    };
  },
  bills: (p) => ({
    prompt: `Write the journal entry: from the Spending bucket you pay ${money(p.rent)} rent and a ${money(p.b)} phone bill.`,
    answer: [{ account: 'rent', debit: p.rent, credit: 0 }, { account: 'phone', debit: p.b, credit: 0 }, { account: 'spending', debit: 0, credit: p.rent + p.b }],
    explanation: `Rent and Phone (expenses) are debited. The Spending bucket is credited for both: ${money(p.rent + p.b)}.`,
  }),
  smallShares: (p) => {
    const s = splitBuckets(p.take);
    return {
      prompt: `Write the journal entry for moving two shares of a ${money(p.take)} paycheck out of Checking: Charity ${money(s.charity)} and Blow money ${money(s.blow)}.`,
      answer: [{ account: 'charity', debit: s.charity, credit: 0 }, { account: 'blow', debit: s.blow, credit: 0 }, { account: 'checking', debit: 0, credit: s.charity + s.blow }],
      explanation: `Both buckets (assets) are debited. Checking is credited for both: ${money(s.charity + s.blow)}.`,
    };
  },
};
const recordJournal = {
  id: 'm06-record-journal', module: 'm06', kind: 'entry', part: 'producing', points: 4,
  params: { a: { min: 1000, max: 9000, step: 1 }, b: { min: 300, max: 6000, step: 1 }, rent: { min: 30000, max: 60000, step: 500 }, take: { min: 80000, max: 120000, step: 1 }, event: { byVersion: Object.keys(JOURNAL_EVENTS) } },
  build: (p) => ({ accounts: JOURNAL_ACCOUNTS, ...JOURNAL_EVENTS[p.event](p) }),
};

const explainJournal = explainTemplate({
  id: 'm06-explain', module: 'm06',
  variants: [
    { prompt: 'In one or two sentences: why is every event written in the journal before it reaches the ledger pages?',
      modelAnswer: 'The journal keeps the whole event in one place, in date order. You can check that the debits equal the credits before posting, and find any event later by its date.',
      rubric: ['Says the whole event (both sides) is in one place, in date order', 'Says this lets you check debits equal credits (or find the event later)'] },
    { prompt: 'In one or two sentences: what does the Folio column hold in the journal, and what does it hold on a ledger page?',
      modelAnswer: 'In the journal it holds the ledger account number the line was posted to. On a ledger page it holds the journal page the entry came from, so each points to the other.',
      rubric: ['Journal folio = the ledger account number', 'Ledger folio = the journal page (so they point to each other)'] },
    { prompt: 'In one or two sentences: what does a ✓ beside an amount on a ledger page tell you?',
      modelAnswer: 'It means the amount has been posted from the journal and checked against it: same date, same amount, same side.',
      rubric: ['Says the amount was posted from the journal', 'Says it was checked against the journal entry'] },
    { prompt: 'In one or two sentences: you were interrupted while posting. How do you find where to start again?',
      modelAnswer: 'Look for the first journal line with an empty Folio column. Lines above it have been posted, so start posting from there.',
      rubric: ['Looks for journal lines with no folio (or ledger amounts with no ✓)', 'Says posting starts again from the first such line'] },
  ],
});

const journalCredit = num('m06-journal-credit', 'interpreting', { a: { min: 2000, max: 60000, step: 1 }, b: { min: 1000, max: 9000, step: 1 }, pair: { pick: [0, 1, 2] } }, (p) => {
  const [x, y] = [['rent', 'phone'], ['groceries', 'household'], ['saving', 'investing']][p.pair];
  return {
    prompt: `A journal entry debits ${CHART[x].name} ${money(p.a)} and ${CHART[y].name} ${money(p.b)}, and credits one account for the whole amount. How much is the credit?`,
    answer: p.a + p.b,
    misconceptions: [{ cents: p.a, explanation: 'One credit pays for both debits, so it equals both added together.' }],
    explanation: `Debits equal credits: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
  };
});

// Completion: post a journal page to the Spending bucket and fill in its balances.
const postPage = {
  id: 'm06-post-page', module: 'm06', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 50000, step: 1 }, a: { min: 1000, max: 7000, step: 1 }, b: { min: 2000, max: 5000, step: 1 }, c: { min: 30000, max: 60000, step: 1 }, d: { min: 500, max: 3000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const moves = [[0, p.a], [0, p.b], [p.c, 0], [0, p.d]];
    let b = p.start;
    const balances = moves.map(([dr, cr]) => (b += dr - cr));
    return {
      prompt: `Post ${p.name}'s journal page J3 to the Spending bucket page. Each line already has its date and folio. Fill in the Balance column for lines 2 to 5.`,
      journalPage: journal([
        ['2026-06-15', 'J3', 'Groceries', [['groceries', p.a, 0, true], ['spending', 0, p.a]]],
        ['2026-06-16', 'J3', 'Phone bill', [['phone', p.b, 0, true], ['spending', 0, p.b]]],
        ['2026-06-19', 'J3', 'Spending share of paycheck', [['spending', p.c, 0], ['checking', 0, p.c, true]]],
        ['2026-06-20', 'J3', 'Bus fare', [['transport', p.d, 0, true], ['spending', 0, p.d]]],
      ], { sheetNo: 3, name: p.name }),
      ledger: chartPage('spending', [
        ['2026-06-13', 'Brought forward', '', p.start, 0],
        ['2026-06-15', 'Groceries', 'J3', 0, p.a],
        ['2026-06-16', 'Phone bill', 'J3', 0, p.b],
        ['2026-06-19', 'From Checking', 'J3', p.c, 0],
        ['2026-06-20', 'Bus fare', 'J3', 0, p.d],
      ], { name: p.name, askFrom: 1, askKeys: TO_POST }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Credits to the Spending bucket subtract and debits add. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

// --- Lesson -------------------------------------------------------------------

const paycheckJ1 = ['2026-06-05', 'J1', 'Paycheck', [['checking', 103346, 0, true], ['taxes', 17854, 0, true], ['wages', 0, 121200, true]]];
const sharesJ1 = (posted) => ['2026-06-06', 'J1', 'Saving and Investing shares of paycheck', [['saving', 15502, 0, posted], ['investing', 10335, 0, posted], ['checking', 0, 25837, posted]]];

export const M06_LESSON = {
  id: 'm06',
  title: 'The journal and posting',
  coreIdea: 'Every event is written first as a journal entry, with equal debits and credits. Posting copies each line to its ledger page, and the folios and ✓ marks show what has been posted.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['account-numbers'],
      text: ['From Module 5: account 2, $300.00; account 3, $450.00; account 21, $120.00; account 55, $45.00. What is the total of the assets?'],
      answer: 75000,
      misconceptions: [{ cents: 87000, explanation: 'Account 21 is a liability (20 to 29).' }],
      explanation: 'Assets are accounts 1 to 19: $300.00 + $450.00 = $750.00.',
    },
    {
      id: 'journal', kind: 'explain', title: 'The journal', uses: ['journal-entry', 'equal-sides'],
      text: [
        'Until now, each event went straight onto two ledger pages. Bookkeepers first write every event in a journal, the book of original entry. It is one book where events are written in date order, as they happen.',
        'A journal entry has the date, the accounts debited (written first), the accounts credited (written below and indented to the right), the amounts, and a short explanation of what happened. Journal pages are numbered J1, J2 and so on.',
        'Because the whole event sits in one place, you can check that the debits equal the credits before anything reaches the ledger. In this entry, $155.02 + $103.35 = $258.37.',
      ],
      prompt: 'Why write the whole event in the journal before you touch the ledger pages?',
      promptAnswer: 'The journal keeps each event in one place, in date order. You can check that debits equal credits before posting, and find any event later by its date.',
      journalPage: journal([sharesJ1(false)]),
      highlightEntry: 0,
    },
    {
      id: 'predict-entry', kind: 'predict', title: 'Predict: the credit side', uses: ['journal-entry', 'equal-sides'],
      text: ['Maya buys groceries for $48.30 and household supplies for $12.95 in one trip, paid from her Spending bucket. In the journal entry, how much is credited to the Spending bucket?'],
      answer: 6125,
      misconceptions: [{ cents: 4830, explanation: 'The Spending bucket paid for both, so the credit is both debits added together.' }],
      explanation: 'Groceries $48.30 and Household supplies $12.95 are debited. The credit equals both: $61.25.',
    },
    {
      id: 'posting', kind: 'explain', title: 'Posting', uses: ['posting', 'folio-reference'],
      text: [
        'Posting means copying each journal line to its ledger page: the same date, the same amount on the same side, and a short item.',
        'In the ledger Folio column, write the journal page the entry came from: J1. Then go back to the journal and write the ledger account number in the journal\'s Folio column. The two folios point at each other, so you can always go from a ledger line to its journal entry and back.',
        'Both entries on journal page J1 have been posted. Look at the Checking page: the paycheck came in, then the two shares went out.',
      ],
      prompt: 'Looking only at the journal, how can you tell that a line has been posted?',
      promptAnswer: 'Its Folio column holds the ledger account number. A line with an empty Folio column has not been posted yet.',
      journalPage: journal([paycheckJ1, sharesJ1(true)]),
      highlightEntry: 1,
      ledgers: [
        chartPage('checking', [['2026-06-05', 'Paycheck', 'J1', 103346, 0], ['2026-06-06', 'To Saving and Investing', 'J1', 0, 25837]]),
        chartPage('saving', [['2026-06-06', 'Paycheck share', 'J1', 15502, 0]]),
        chartPage('investing', [['2026-06-06', 'Paycheck share', 'J1', 10335, 0]]),
      ],
      highlightRow: 1,
    },
    {
      id: 'predict-post', kind: 'predict', title: 'Predict: after posting', uses: ['posting', 'running-balance'],
      text: ['The entry for a $14.75 movie ticket, paid from Blow money, has been posted. What does the Blow money balance read on the highlighted line?'],
      journalPage: journal([['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]]], { sheetNo: 2 }),
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 10335, 0], ['2026-06-09', 'Movie ticket', 'J2', 0, 1475]], { askFrom: 1 }),
      highlightRow: 1,
      answer: 8860,
      misconceptions: [{ cents: 11810, explanation: 'Blow money paid for the ticket: the posted line is a credit, so subtract.' }],
      explanation: 'Blow money is credited: $103.35 − $14.75 = $88.60.',
    },
    {
      id: 'ticks', kind: 'explain', title: 'The ✓ columns', uses: ['posted-marks', 'posting'],
      text: [
        'Each money column on the ledger page has a ✓ column beside it. After you post an amount, check it against the journal (same date, same amount, same side), then tick ✓ beside it.',
        'Together, the journal folios and the ticks show how far posting has gone. A journal line with an empty Folio column has not been posted. A ledger amount with no ✓ has been written but not yet checked.',
        'If you are interrupted, look for the first journal line with no folio. That is where to start again.',
      ],
      prompt: 'You were interrupted halfway through posting a journal page. How do you find where you stopped?',
      promptAnswer: 'Look for the first journal line with an empty Folio column. Everything above it has been posted, so start again there.',
      journalPage: journal([['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]]], { sheetNo: 2 }),
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 10335, 0], ['2026-06-09', 'Movie ticket', 'J2', 0, 1475, true]]),
      highlightRow: 1,
    },
    {
      id: 'predict-unposted', kind: 'predict', title: 'Predict: the missing line', uses: ['posted-marks', 'posting'],
      text: ['One line on this journal page has not been posted: its Folio column is empty. When it is posted, what will the Spending bucket balance be?'],
      journalPage: journal([
        ['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]],
        ['2026-06-12', 'J2', 'Groceries', [['groceries', 3610, 0, true], ['spending', 0, 3610, true]]],
        ['2026-06-13', 'J2', 'Phone bill', [['phone', 4500, 0, true], ['spending', 0, 4500, false]]],
      ], { sheetNo: 2 }),
      ledger: chartPage('spending', [['2026-06-06', 'Brought forward', '', 40000, 0], ['2026-06-12', 'Groceries', 'J2', 0, 3610, true]]),
      highlightRow: 1,
      answer: 31890,
      misconceptions: [{ cents: 36390, explanation: 'That is the balance before the missing line. The phone bill\'s credit to the Spending bucket still has to be posted.' }],
      explanation: 'The phone bill\'s Spending line has no folio. Posting it: $363.90 − $45.00 = $318.90.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['posting', 'posted-marks'],
      text: ['You are posting the entry for moving $50.00 from the Spending bucket into Saving. Step 1 is done: the Saving line is written with folio J3 and ticked, and 3 is written in the journal. Step 2 is done: the Spending line is written with folio J3. Finish Step 3: what is the Spending balance on that line?'],
      journalPage: journal([['2026-06-15', 'J3', 'To Saving bucket', [['saving', 5000, 0, true], ['spending', 0, 5000, false]]]], { sheetNo: 3 }),
      ledger: chartPage('spending', [['2026-06-14', 'Brought forward', '', 31890, 0], ['2026-06-15', 'To Saving bucket', 'J3', 0, 5000]], { askFrom: 1 }),
      highlightRow: 1,
      answer: 26890,
      misconceptions: [{ cents: 36890, explanation: 'The Spending bucket gives the money: a credit, so subtract.' }],
      explanation: '$318.90 − $50.00 = $268.90. Then tick ✓ and write 2 in the journal\'s Folio column.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['journal-entry', 'posting'],
      text: ['You pay back $60.00 you owe a friend, from the Spending bucket. Write the journal entry in your head, then post it. "Owed to a friend" (account 20, a liability) had a credit balance of $85.00. What is it after posting?'],
      answer: 2500,
      misconceptions: [{ cents: 14500, explanation: 'Paying back debits the liability: you owe less.' }],
      explanation: 'The entry debits Owed to a friend $60.00 and credits the Spending bucket $60.00. $85.00 − $60.00 = $25.00, still a credit balance.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['journal-entry', 'equal-sides'],
      text: ['A journal entry debits Rent $450.00 and Phone $45.00, and credits the Spending bucket. How much is the credit?'],
      answer: 49500,
      misconceptions: [{ cents: 45000, explanation: 'The credit pays for both debits.' }],
      explanation: '$450.00 + $45.00 = $495.00.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['posting'],
      text: ['A journal entry debits Groceries $27.40 and credits Cash $27.40. The Cash page had a debit balance of $61.00. What is it after posting?'],
      answer: 3360,
      misconceptions: [{ cents: 8840, explanation: 'Cash is credited: subtract.' }],
      explanation: '$61.00 − $27.40 = $33.60.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['journal-entry', 'equal-sides'],
      text: ['A journal page has three entries. Their debits are $155.02, $103.35 and $51.67. What must the Credits column of the page add up to?'],
      answer: 31004,
      explanation: 'Every entry balances, so the credits add up to the same as the debits: $155.02 + $103.35 + $51.67 = $310.04.',
    },
  ],
  resources: ['cfpb-budget', 'cfpb-bank-accounts'],
  recallTemplates: [postBalance, journalCredit].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M06_GATE = { id: 'm06', kind: 'gate', title: 'Module 6 check', templates: [postBalance, unposted, recordJournal, explainJournal] };

// Fluency drill on the core operation: posting one line.
const drill = [1, 2, 3].map((n) => num(`m06-drill-${n}`, 'interpreting', { a: { min: 10000, max: 60000, step: 1 }, b: { min: 100, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the Spending bucket shows ${money(p.a)}. A journal line crediting it ${money(p.b)} is posted. New balance?`, answer: p.a - p.b,
  explanation: `A credit lowers an asset: ${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const recordNumbersMixed = { ...M05_GATE.templates.find((t) => t.part === 'producing'), id: 'm05-record-numbers-mixed-m06' };

export const M06_PRACTICE = {
  id: 'm06-practice', kind: 'practice', module: 'm06', title: 'Module 6 practice set',
  templates: [...M05_LESSON.recallTemplates, ...M04_LESSON.recallTemplates, ...M02_LESSON.recallTemplates, ...drill, postBalance, unposted, journalCredit, postPage, recordJournal, recordNumbersMixed, { ...explainJournal, id: 'm06-explain-practice' }],
};

export const M06_EXTRA = {
  id: 'm06-extra', kind: 'practice', module: 'm06', title: 'Module 6 extra practice',
  templates: [postBalance, journalCredit, recordJournal].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M06_REMEDIAL = {
  id: 'm06-remedial', kind: 'practice', module: 'm06', title: 'Module 6: common mistakes',
  templates: [unposted, postPage, recordJournal].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint B draws from this module.
export const M06_CHECKPOINT = [postBalance, unposted, recordJournal];
