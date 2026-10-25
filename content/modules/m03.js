// Module 3: Debit and credit. Ideas: accounting-equation, debit-credit-rules,
// equal-sides. From here on the sheet shows every column. Amounts are
// illustrative.

import { money, NAMES, explainTemplate } from '../helpers.js';

const num = (id, part, params, build) => ({ id, module: 'm03', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const ACCOUNTS = [
  { id: 'checking', label: 'Checking (asset)' },
  { id: 'saving', label: 'Saving bucket (asset)' },
  { id: 'wages', label: 'Wages (income)' },
  { id: 'owed-friend', label: 'Owed to a friend (liability)' },
];

function ledger(account, type, rows, { accountNo = 1, name = 'Jordan (example)', askFrom = null } = {}) {
  return {
    sheetNo: 1, accountNo, name, account, type,
    rows: rows.map(([date, items, folio, debit, credit], i) => ({
      date, items, folio, debit, credit, posted: [debit > 0, credit > 0],
      ...(askFrom !== null && i >= askFrom ? { ask: ['balance', 'side'] } : {}),
    })),
  };
}

// --- Question templates -----------------------------------------------------

const netWorth = num('m03-net-worth', 'interpreting', { own: { min: 80000, max: 400000, step: 1 }, owe: { min: 5000, max: 70000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} owns ${money(p.own)} (cash, checking and buckets) and owes ${money(p.owe)}. Use what you own = what you owe + what you are worth. What is ${p.name}'s net worth?`,
  answer: p.own - p.owe,
  misconceptions: [{ cents: p.own + p.owe, explanation: 'What you owe is not yours. Net worth is what you own minus what you owe.' }],
  explanation: `${money(p.own)} − ${money(p.owe)} = ${money(p.own - p.owe)}.`,
}));

const liabilityBalance = num('m03-liability-balance', 'interpreting', { start: { min: 2000, max: 20000, step: 1 }, borrow: { min: 1000, max: 8000, step: 1 }, repay: { min: 500, max: 3000, step: 1 } }, (p) => ({
  prompt: `An "Owed to a friend" page (a liability) has a credit balance of ${money(p.start)}. You borrow another ${money(p.borrow)} (a credit). Then you pay back ${money(p.repay)} (a debit). What is the balance now?`,
  answer: p.start + p.borrow - p.repay,
  misconceptions: [{ cents: p.start - p.borrow + p.repay, explanation: 'A liability goes up with a credit and down with a debit. That is the opposite of an asset.' }],
  explanation: `${money(p.start)} + ${money(p.borrow)} − ${money(p.repay)} = ${money(p.start + p.borrow - p.repay)} (a credit balance).`,
}));

const recordTransfer = {
  id: 'm03-record-transfer', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 5000, max: 30000, step: 1 }, kind: { pick: ['save', 'pay'] } },
  build: (p) => (p.kind === 'save'
    ? {
      prompt: `Write the journal entry for moving ${money(p.amount)} from Checking into the Saving bucket.`,
      accounts: ACCOUNTS,
      answer: [{ account: 'saving', debit: p.amount, credit: 0 }, { account: 'checking', debit: 0, credit: p.amount }],
      explanation: 'Saving (an asset) goes up: debit. Checking (an asset) goes down: credit. Both sides are equal.',
    }
    : {
      prompt: `Write the journal entry for ${money(p.amount)} of wages arriving in your Checking account.`,
      accounts: ACCOUNTS,
      answer: [{ account: 'checking', debit: p.amount, credit: 0 }, { account: 'wages', debit: 0, credit: p.amount }],
      explanation: 'Checking (an asset) goes up: debit. Wages (income) goes up: credit. Both sides are equal.',
    }),
};

const explainRules = explainTemplate({
  id: 'm03-explain', module: 'm03',
  variants: [
    { prompt: 'In one or two sentences: why does a liability (money you owe) go up on the credit side?',
      modelAnswer: 'Because liabilities sit on the other side of the equation from assets. Assets increase with debits, so liabilities and net worth increase with credits.',
      rubric: ['Says liabilities are on the other side from assets', 'Says that is why they increase with a credit'] },
    { prompt: 'In one or two sentences: why must the debit side and the credit side of every entry be equal?',
      modelAnswer: 'Every event changes at least two accounts by the same amount. So the equation, what you own = what you owe + what you are worth, stays balanced.',
      rubric: ['Says every entry changes two (or more) accounts by the same amount', 'Says this keeps the equation (or the books) balanced'] },
    { prompt: 'In one or two sentences: why does paying back a debt not change your net worth?',
      modelAnswer: 'You own less (the cash leaves) and you owe less by the same amount, so what you own minus what you owe stays the same.',
      rubric: ['Says what you own and what you owe both fall', 'Says they fall by the same amount, so net worth is unchanged'] },
    { prompt: 'In one or two sentences: when wages arrive in Checking, which account is debited and which is credited, and why?',
      modelAnswer: 'Checking is debited because an asset goes up. Wages is credited because income goes up with a credit.',
      rubric: ['Debits Checking because an asset increases', 'Credits Wages because income increases with a credit'] },
  ],
});

const recallBalance = num('m03-recall-balance', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, out: { min: 500, max: 8000, step: 1 } }, (p) => ({
  prompt: `Recall: a bucket shows ${money(p.start)}. Then ${money(p.out)} goes out. What is the new balance?`, answer: p.start - p.out,
  explanation: `${money(p.start)} − ${money(p.out)} = ${money(p.start - p.out)}.`,
}));

const assetAfterDebit = num('m03-asset-debit', 'interpreting', { start: { min: 10000, max: 60000, step: 1 }, debit: { min: 1000, max: 20000, step: 1 } }, (p) => ({
  prompt: `The Saving bucket (an asset) has a debit balance of ${money(p.start)}. It is debited ${money(p.debit)}. What is its balance now?`,
  answer: p.start + p.debit,
  misconceptions: [{ cents: p.start - p.debit, explanation: 'An asset goes up with a debit.' }],
  explanation: `Assets increase with a debit: ${money(p.start)} + ${money(p.debit)} = ${money(p.start + p.debit)}.`,
}));

const otherSide = num('m03-other-side', 'interpreting', { a: { min: 5000, max: 20000, step: 1 }, b: { min: 3000, max: 15000, step: 1 } }, (p) => ({
  prompt: `An entry debits the Saving bucket ${money(p.a)} and the Investing bucket ${money(p.b)}. Checking is credited for the whole amount. How much is the credit?`,
  answer: p.a + p.b,
  explanation: `The two sides must be equal: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
}));

// --- Lesson -------------------------------------------------------------------

export const M03_LESSON = {
  id: 'm03',
  title: 'Debit and credit',
  coreIdea: 'What you own equals what you owe plus what you are worth. Every entry has a debit side and a credit side, and the two sides are equal.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['running-balance'],
      text: ['From Module 2: a bucket shows $300.00. Then $45.25 goes out and $20.00 comes in. What is the balance?'],
      answer: 27475,
      explanation: '$300.00 − $45.25 = $254.75, then + $20.00 = $274.75.',
    },
    {
      id: 'equation', kind: 'explain', title: 'Own, owe, worth', uses: ['accounting-equation'],
      text: [
        'Everything in your books fits one sentence: what you own = what you owe + what you are worth.',
        'What you own (assets) is cash, checking and your buckets. What you owe (liabilities) is money you borrowed or a card balance. What you are worth (net worth) is what would be left if you paid back everything you owe.',
        'Example: you own $1,500.00 and owe $400.00, so you are worth $1,100.00. Check: $1,500.00 = $400.00 + $1,100.00.',
      ],
      prompt: 'If you owe nothing, how does your net worth compare with what you own?',
    },
    {
      id: 'predict-worth', kind: 'predict', title: 'Predict: net worth', uses: ['accounting-equation'],
      text: ['Rosa owns $2,350.00 and owes $615.40. What is her net worth?'],
      answer: 173460,
      misconceptions: [{ cents: 296540, explanation: 'What you owe is not yours. Subtract it from what you own.' }],
      explanation: '$2,350.00 − $615.40 = $1,734.60.',
    },
    {
      id: 'rules', kind: 'explain', title: 'The debit and credit rules', uses: ['debit-credit-rules', 'accounting-equation', 'ledger-columns'],
      text: [
        'Now the grayed-out columns open up. Debits is the left money column. Credits is the right money column. Every account goes up on one side and down on the other.',
        'Assets (what you own) and expenses go up with a debit. Liabilities (what you owe), income and net worth go up with a credit. That is the whole set of rules.',
        'Look at the two pages. A debit raises the Saving bucket (an asset). A credit raises "Owed to a friend" (a liability). The Dr/Cr column shows which side the balance is on.',
      ],
      prompt: 'Why do you think liabilities go up on the opposite side from assets?',
      ledgers: [
        ledger('Saving bucket', 'asset', [['2026-06-06', 'From paycheck, 15%', 'J1', 15502, 0]], { accountNo: 3 }),
        ledger('Owed to a friend', 'liability', [['2026-06-09', 'Borrowed for a phone repair', 'J2', 0, 6000]], { accountNo: 20 }),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-liability', kind: 'predict', title: 'Predict: a liability page', uses: ['debit-credit-rules'],
      text: ['You owe a friend $60.00. You pay back $25.00 (a debit). What is the balance now?'],
      ledger: ledger('Owed to a friend', 'liability', [['2026-06-09', 'Borrowed for a phone repair', 'J2', 0, 6000], ['2026-06-20', 'Paid back part', 'J3', 2500, 0]], { accountNo: 20, askFrom: 1 }),
      highlightRow: 1,
      answer: 3500,
      misconceptions: [{ cents: 8500, explanation: 'A debit makes a liability go down: you owe less after paying back.' }],
      explanation: 'A liability goes down with a debit: $60.00 − $25.00 = $35.00. It is still a credit balance.',
    },
    {
      id: 'equal', kind: 'explain', title: 'Two equal sides', uses: ['equal-sides', 'debit-credit-rules'],
      text: [
        'Every event changes at least two accounts. Moving $155.02 from Checking into Saving raises Saving (debit) and lowers Checking (credit). Both change by the same amount.',
        'An entry like this is written in the journal. List the accounts debited first. List the accounts credited underneath, indented. Then add a short explanation. The debit total must equal the credit total, so the equation always balances.',
      ],
      prompt: 'What would happen to the equation if an entry had only a debit?',
      journalPage: {
        sheetNo: 1, name: 'Jordan (example)',
        entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Saving share of paycheck', lines: [
          { account: 'saving', label: 'Saving bucket', debit: 15502, credit: 0 },
          { account: 'checking', label: 'Checking', debit: 0, credit: 15502 },
        ] }],
      },
    },
    {
      id: 'predict-credit', kind: 'predict', title: 'Predict: the other side', uses: ['equal-sides'],
      text: ['An entry debits the Saving bucket $155.02 and the Investing bucket $103.35. It credits Checking for the whole amount. How much is the credit?'],
      answer: 25837,
      misconceptions: [{ cents: 15502, explanation: 'Checking pays for both buckets, so the credit is the total of both debits.' }],
      explanation: '$155.02 + $103.35 = $258.37. The credit equals the two debits added together.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['accounting-equation', 'equal-sides'],
      text: ['Eli owns $1,800.00 and owes $300.00. He uses $100.00 from Checking to pay back part of the debt. What is his net worth afterward?'],
      answer: 150000,
      misconceptions: [{ cents: 140000, explanation: 'Paying a debt lowers what you own and what you owe by the same amount. So net worth does not change.' }],
      explanation: 'Before: $1,800.00 − $300.00 = $1,500.00. After: $1,700.00 − $200.00 = $1,500.00. Net worth is unchanged.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check', uses: ['debit-credit-rules'],
      text: ['The Checking account (an asset) has a debit balance of $412.00. It is credited $57.80. What is its balance now?'],
      answer: 35420,
      explanation: 'An asset goes down with a credit: $412.00 − $57.80 = $354.20.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [netWorth, assetAfterDebit].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M03_GATE = { id: 'm03', kind: 'gate', title: 'Module 3 check', templates: [netWorth, liabilityBalance, recordTransfer, explainRules] };

export const M03_PRACTICE = {
  id: 'm03-practice', kind: 'practice', module: 'm03', title: 'Module 3 practice set',
  templates: [recallBalance, assetAfterDebit, netWorth, liabilityBalance, otherSide, recordTransfer, { ...explainRules, id: 'm03-explain-practice' }],
};

export const M03_EXTRA = {
  id: 'm03-extra', kind: 'practice', module: 'm03', title: 'Module 3 extra practice',
  templates: [assetAfterDebit, otherSide, recordTransfer].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M03_REMEDIAL = {
  id: 'm03-remedial', kind: 'practice', module: 'm03', title: 'Module 3: common mistakes',
  templates: [liabilityBalance, netWorth, recordTransfer].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint A draws from this module.
export const M03_CHECKPOINT = [netWorth, liabilityBalance, recordTransfer];
