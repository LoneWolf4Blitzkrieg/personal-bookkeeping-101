// A sample lesson for checking the lesson page before the real modules exist.
// Positioned at Module 3 so its ideas are checked against what is taught by
// then. Amounts are illustrative.

export const DEMO_LESSON = {
  id: 'demo',
  position: 'm03',
  checkId: 'demo',
  title: 'Sample lesson: debits raise an asset',
  coreIdea: 'An asset, such as a bucket of money, goes up on the debit side.',
  steps: [
    {
      kind: 'explain', title: 'Money coming into a bucket', uses: ['debit-credit-rules', 'ledger-columns'],
      text: [
        'Your Saving bucket is an asset: money that belongs to you.',
        'When money goes into an asset, you write the amount in the Debits column. The balance goes up.',
      ],
      prompt: 'Why does the balance go up on this line?',
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
        rows: [{ date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] }],
      },
      highlightRow: 0,
    },
    {
      kind: 'predict', title: 'Predict the next balance', uses: ['debit-credit-rules', 'running-balance'],
      text: ['Two weeks later another 15% goes in. Before you check, work out what the Balance column will read on the highlighted line.'],
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
        rows: [
          { date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] },
          { date: '2026-06-20', items: 'From paycheck, 15%', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance', 'side'] },
        ],
      },
      highlightRow: 1,
      answer: 36360,
      misconceptions: [{ cents: 18180, explanation: 'That is only the new deposit. The balance adds it to what was already there.' }],
      explanation: '$181.80 + $181.80 = $363.60. Each debit adds to the asset.',
    },
    {
      kind: 'explain', title: 'Where the entry starts', uses: ['equal-sides', 'debit-credit-rules'],
      text: ['Every entry has two sides. Moving money into Saving debits Saving and credits Checking by the same amount, so the two sides are equal.'],
      journalPage: {
        sheetNo: 1, name: 'Jordan (example)',
        entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Saving share of paycheck', lines: [
          { account: 'saving', label: 'Saving bucket', debit: 18180, credit: 0, folio: 3 },
          { account: 'checking', label: 'Checking', debit: 0, credit: 18180, folio: 1 },
        ] }],
      },
      journal: { date: '2026-06-06', folio: 'J1', lines: [{ account: 'saving', debit: 18180, credit: 0 }, { account: 'checking', debit: 0, credit: 18180 }] },
      highlightEntry: 0,
    },
  ],
  resources: ['cfpb-budget'],
};
