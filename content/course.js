// Course structure: modules in teaching order, the ideas each one introduces,
// and the cumulative checkpoints. Source: docs/design.md, section 4.

export const PHASES = {
  foundations: 'Weeks 1–2: Foundations',
  core: 'Weeks 3–4: Core bookkeeping',
  extension: 'Weeks 5–6: Proving and planning',
  integration: 'Weeks 7–8: Saving ahead and the final project',
  addon: 'Add-on: the Fed, inflation and IRAs',
};

export const MODULES = [
  { id: 'm01', title: 'What money is', phase: 'foundations',
    ideas: ['money-uses', 'five-buckets', 'page-per-bucket'] },
  { id: 'm02', title: 'The ledger page', phase: 'foundations',
    ideas: ['ledger-columns', 'running-balance', 'carry-forward'] },
  { id: 'm03', title: 'Debit and credit', phase: 'foundations',
    ideas: ['accounting-equation', 'debit-credit-rules', 'equal-sides'] },
  { id: 'm04', title: 'Your paycheck', phase: 'foundations',
    ideas: ['gross-vs-net', 'paycheck-deductions', 'recording-paycheck'] },

  { id: 'm05', title: 'Your chart of accounts', phase: 'core',
    ideas: ['personal-accounts', 'account-numbers', 'folio-reference'] },
  { id: 'm06', title: 'The journal and posting', phase: 'core',
    ideas: ['journal-entry', 'posting', 'posted-marks'] },
  { id: 'm07', title: 'Everyday spending', phase: 'core',
    ideas: ['source-documents', 'recording-purchases', 'transfers'] },
  { id: 'm08', title: 'Credit cards and debt', phase: 'core',
    ideas: ['card-as-liability', 'card-entries', 'minimum-payment-cost'] },

  { id: 'm09', title: 'Proving your books', phase: 'extension',
    ideas: ['trial-balance', 'common-errors', 'error-by-size'] },
  { id: 'm10', title: 'Matching the bank', phase: 'extension',
    ideas: ['bank-reconciliation', 'outstanding-items', 'bank-fee-entries'] },
  { id: 'm11', title: 'Budgeting with logic', phase: 'extension',
    ideas: ['budget-as-ledger', 'budget-vs-actual', 'spending-rules'] },
  { id: 'm12', title: 'Month-end', phase: 'extension',
    ideas: ['closing-entries', 'income-statement', 'net-worth-statement'] },

  { id: 'm13', title: 'The emergency fund', phase: 'integration',
    ideas: ['essential-expenses', 'fund-sizing', 'fund-rules'] },
  { id: 'm14', title: 'Planning ahead', phase: 'integration',
    ideas: ['buying-power', 'compound-interest', 'sinking-funds'] },
  { id: 'm15', title: 'Final project I: plan your month', phase: 'integration', ideas: [] },
  { id: 'm16', title: 'Final project II: keep, prove and report', phase: 'integration', ideas: [] },

  { id: 'a1', title: 'The Federal Reserve', phase: 'addon',
    ideas: ['what-the-fed-is', 'money-flows', 'fed-money-supply'] },
  { id: 'a2', title: 'Inflation and its causes', phase: 'addon',
    ideas: ['measuring-inflation', 'accepted-causes', 'corporate-pricing'] },
  { id: 'a3', title: 'IRAs and saving for later', phase: 'addon',
    ideas: ['what-an-ira-is', 'traditional-vs-roth', 'long-term-growth'] },
];

export const CHECKPOINTS = [
  { id: 'ca', after: 'm04' },
  { id: 'cb', after: 'm08' },
  { id: 'cc', after: 'm12' },
];
