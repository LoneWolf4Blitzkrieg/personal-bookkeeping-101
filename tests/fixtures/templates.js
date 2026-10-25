// Small item templates used by the tests. Real templates live in content/.

import { percentOf } from '../../js/money.js';

export const splitBalance = {
  id: 'fx-split-balance', module: 'm01', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 80000, max: 150000, step: 100 }, rate: { pick: [0.1, 0.15, 0.2] }, name: { pick: ['Jordan', 'Maya', 'Luis'] } },
  build: (p) => ({
    prompt: `${p.name} puts ${p.rate * 100}% of a paycheck of $${p.pay / 100} into the Saving bucket. What does the Saving page balance read?`,
    answer: percentOf(p.pay, p.rate),
    misconceptions: [{ cents: p.pay - percentOf(p.pay, p.rate), explanation: 'That is what is left for the other buckets, not the Saving share.' }],
    explanation: `${p.rate * 100}% of the paycheck goes to Saving.`,
  }),
};

export const splitRemainder = {
  id: 'fx-split-remainder', module: 'm01', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 80000, max: 150000, step: 100 } },
  build: (p) => ({ prompt: `What is left after 40% of $${p.pay / 100}?`, answer: p.pay - percentOf(p.pay, 0.4), explanation: '60% remains.' }),
};

export const recordSplit = {
  id: 'fx-record-split', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { pay: { min: 80000, max: 150000, step: 100 } },
  build: (p) => ({
    prompt: `Record moving 15% of a $${p.pay / 100} deposit from Checking to the Saving bucket.`,
    accounts: [{ id: 'checking', label: 'Checking' }, { id: 'saving', label: 'Saving bucket' }, { id: 'spending', label: 'Spending bucket' }],
    answer: [
      { account: 'saving', debit: percentOf(p.pay, 0.15), credit: 0 },
      { account: 'checking', debit: 0, credit: percentOf(p.pay, 0.15) },
    ],
    explanation: 'Saving (an asset) increases with a debit; Checking decreases with a credit.',
  }),
};

export const explainDebit = {
  id: 'fx-explain-debit', module: 'm03', kind: 'explain', part: 'explaining', points: 2,
  params: { bucket: { pick: ['Saving', 'Spending', 'Charity', 'Investing'] } },
  build: (p) => ({
    prompt: `Why is the ${p.bucket} bucket debited when money moves into it?`,
    modelAnswer: 'Saving is an asset, and assets increase on the debit side, so the transfer is recorded as a debit to Saving.',
    rubric: ['Says Saving is an asset', 'Says assets increase with a debit'],
  }),
};

// A module gate: 7 interpreting (2 points), 2 producing (4), 1 explaining (2).
const asInterpreting = (t, n) => ({ ...t, id: `${t.id}-${n}` });
export const gateTemplates = [
  splitBalance, splitRemainder,
  ...[1, 2, 3].map((n) => asInterpreting(splitBalance, n)), ...[1, 2].map((n) => asInterpreting(splitRemainder, n)),
  recordSplit, { ...recordSplit, id: 'fx-record-split-2' },
  explainDebit,
];

// Four items of each kind, for tests of a single sitting.
export const fourTemplates = [splitBalance, splitRemainder, recordSplit, explainDebit];
