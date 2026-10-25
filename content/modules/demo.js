// A sample lesson for checking the lesson page. Positioned at Module 6 (it
// shows a journal page, folios and posted ticks). Amounts are illustrative.

export const DEMO_LESSON = {
  id: 'demo',
  position: 'm06',
  checkId: 'demo',
  title: 'Sample lesson: debits raise an asset',
  coreIdea: 'An asset, such as a bucket of money, goes up on the debit side.',
  steps: [
    {
      id: 'into-bucket', kind: 'explain', title: 'Money coming into a bucket', uses: ['debit-credit-rules', 'ledger-columns'],
      text: [
        'Your Saving bucket is an asset: money that belongs to you.',
        'When money goes into an asset, you write the amount in the Debits column. The balance goes up.',
      ],
      prompt: 'Why does the balance go up on this line?',
      promptAnswer: 'Money came into the bucket, and an asset goes up on the debit side.',
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
        rows: [{ date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] }],
      },
      highlightRow: 0,
    },
    {
      id: 'predict', kind: 'predict', title: 'Predict the next balance', uses: ['debit-credit-rules', 'running-balance'],
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
      id: 'two-sides', kind: 'explain', title: 'Where the entry starts', uses: ['equal-sides', 'debit-credit-rules'],
      text: ['Every entry has two sides. Moving money into Saving debits Saving and credits Checking by the same amount, so the two sides are equal.'],
      journalPage: {
        sheetNo: 1, name: 'Jordan (example)',
        entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Saving share of paycheck', lines: [
          { account: 'saving', label: 'Saving bucket', debit: 18180, credit: 0, folio: 3 },
          { account: 'checking', label: 'Checking', debit: 0, credit: 18180, folio: 1 },
        ] }],
      },
      highlightEntry: 0,
    },
  ],
  resources: ['cfpb-budget'],
};
