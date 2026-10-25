// A demonstration gate used to check the assessment page before real module
// gates exist. Amounts are illustrative.

import { percentOf, formatCents } from '../../js/money.js';

const money = (cents) => `$${formatCents(cents)}`;

const savingShare = {
  id: 'demo-saving-share', module: 'm01', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 90000, max: 130000, step: 100 }, name: { pick: ['Jordan', 'Maya', 'Luis', 'Ana'] } },
  build: (p) => ({
    prompt: `${p.name} is paid ${money(p.pay)} and puts 15% into the Saving bucket on payday. What does the Saving page balance read after this line?`,
    ledger: {
      sheetNo: 1, accountNo: 3, name: p.name, account: 'Saving bucket', type: 'asset',
      rows: [{ date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: percentOf(p.pay, 0.15), credit: 0, posted: [true, false], ask: ['balance', 'side'] }],
    },
    answer: percentOf(p.pay, 0.15),
    misconceptions: [{ cents: p.pay - percentOf(p.pay, 0.15), explanation: 'That is what is left for the other buckets.' }],
    explanation: `15% of ${money(p.pay)} is ${money(percentOf(p.pay, 0.15))}, and it is the only line on the page.`,
  }),
};

const blowMoney = {
  id: 'demo-blow-money', module: 'm01', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 90000, max: 130000, step: 100 } },
  build: (p) => ({
    prompt: `A paycheck of ${money(p.pay)} is split with 10% going to blow money. How much is that?`,
    answer: percentOf(p.pay, 0.1),
    misconceptions: [{ cents: percentOf(p.pay, 0.01), explanation: 'That is 1%, not 10%.' }],
    explanation: `10% of ${money(p.pay)} is ${money(percentOf(p.pay, 0.1))}.`,
  }),
};

const recordTransfer = {
  id: 'demo-record-transfer', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 5000, max: 25000, step: 500 } },
  build: (p) => ({
    prompt: `Record moving ${money(p.amount)} from Checking into the Saving bucket.`,
    accounts: [{ id: 'checking', label: 'Checking' }, { id: 'saving', label: 'Saving bucket' }, { id: 'spending', label: 'Spending bucket' }],
    answer: [
      { account: 'saving', debit: p.amount, credit: 0 },
      { account: 'checking', debit: 0, credit: p.amount },
    ],
    explanation: 'Saving is an asset that increases, so it is debited; Checking is an asset that decreases, so it is credited.',
  }),
};

const explainDebit = {
  id: 'demo-explain-debit', module: 'm03', kind: 'explain', part: 'explaining', points: 2,
  params: {},
  build: () => ({
    prompt: 'In one or two sentences: why is the Saving bucket debited when money moves into it?',
    modelAnswer: 'The Saving bucket is an asset, and an asset increases on the debit side, so money coming in is written as a debit.',
    rubric: ['Says the Saving bucket is an asset', 'Says an asset increases with a debit'],
  }),
};

export const DEMO_GATE = {
  id: 'demo',
  title: 'Practice gate (demonstration)',
  kind: 'gate',
  templates: [savingShare, blowMoney, recordTransfer, explainDebit],
};
