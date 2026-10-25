// Module data used to prove each content rule catches what it should.

export const goodModule = {
  id: 'm03', title: 'Debit and credit', coreIdea: 'Every entry has a debit side and a credit side that are equal.',
  ideas: ['accounting-equation', 'debit-credit-rules', 'equal-sides'],
  steps: [
    { kind: 'explain', text: ['Assets increase on the debit side.'], uses: ['debit-credit-rules', 'ledger-columns'],
      ledger: { id: 'saving', sheetNo: 1, accountNo: 3, name: 'Jordan', account: 'Saving bucket', type: 'asset',
        rows: [{ date: '2026-06-06', items: 'From paycheck', folio: 'J1', debit: 18180, credit: 0, posted: [true, false], balance: 18180, side: 'Dr' }] },
      journal: { date: '2026-06-06', folio: 'J1', explanation: 'Split', lines: [{ account: 'saving', debit: 18180, credit: 0 }, { account: 'checking', debit: 0, credit: 18180 }] },
      source: 'irs-p15t-2026' },
  ],
  resources: ['cfpb-budget'],
};

const clone = (x) => structuredClone(x);
const step = (m) => m.steps[0];

export const badModules = {
  unbalancedJournal: (() => { const m = clone(goodModule); step(m).journal.lines[1].credit = 100; return m; })(),
  wrongStoredBalance: (() => { const m = clone(goodModule); step(m).ledger.rows[0].balance = 999; return m; })(),
  wrongStoredSide: (() => { const m = clone(goodModule); step(m).ledger.rows[0].side = 'Cr'; return m; })(),
  untaughtIdea: (() => { const m = clone(goodModule); step(m).uses.push('trial-balance'); return m; })(),
  unknownIdea: (() => { const m = clone(goodModule); step(m).uses.push('made-up-idea'); return m; })(),
  missingSource: (() => { const m = clone(goodModule); step(m).source = 'no-such-source'; return m; })(),
  unofficialResource: (() => { const m = clone(goodModule); m.resources = ['https://example.com/money-tips']; return m; })(),
  unknownResource: (() => { const m = clone(goodModule); m.resources = ['no-such-resource']; return m; })(),
  askGivesAwayAnswer: (() => { const m = clone(goodModule); step(m).ledger.rows[0].ask = ['debit']; return m; })(),
  earlyColumnsInModule1: (() => { const m = clone(goodModule); m.id = 'm01'; m.ideas = ['money-uses', 'five-buckets', 'page-per-bucket']; step(m).uses = ['five-buckets']; return m; })(),
  stepWithoutUses: (() => { const m = clone(goodModule); delete step(m).uses; return m; })(),
};
