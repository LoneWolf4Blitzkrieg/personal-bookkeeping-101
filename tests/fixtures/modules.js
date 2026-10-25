// Module data used to prove each content rule catches what it should.

export const goodModule = {
  id: 'm06', title: 'The journal and posting', coreIdea: 'Every entry has a debit side and a credit side that are equal.',
  ideas: ['journal-entry', 'posting', 'posted-marks'],
  steps: [
    { id: 'intro', kind: 'explain', text: ['Assets increase on the debit side.'], uses: ['debit-credit-rules', 'ledger-columns'],
      ledger: { id: 'saving', sheetNo: 1, accountNo: 3, name: 'Jordan', account: 'Saving bucket', type: 'asset',
        rows: [{ date: '2026-06-06', items: 'From paycheck', folio: 'J1', debit: 18180, credit: 0, posted: [true, false], balance: 18180, side: 'Dr' }] },
      journalPage: { sheetNo: 1, name: 'Jordan', entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Split', lines: [{ account: 'saving', debit: 18180, credit: 0 }, { account: 'checking', debit: 0, credit: 18180 }] }] },
      source: 'irs-p15t-2026' },
  ],
  resources: ['cfpb-budget'],
};

const clone = (x) => structuredClone(x);
const step = (m) => m.steps[0];

export const badModules = {
  unbalancedJournal: (() => { const m = clone(goodModule); step(m).journalPage.entries[0].lines[1].credit = 100; return m; })(),
  wrongStoredBalance: (() => { const m = clone(goodModule); step(m).ledger.rows[0].balance = 999; return m; })(),
  wrongStoredSide: (() => { const m = clone(goodModule); step(m).ledger.rows[0].side = 'Cr'; return m; })(),
  untaughtIdea: (() => { const m = clone(goodModule); step(m).uses.push('trial-balance'); return m; })(),
  folioTooEarly: (() => { const m = clone(goodModule); m.id = 'm03'; delete step(m).journalPage; step(m).ledger.rows[0].posted = [false, false]; return m; })(),
  ticksTooEarly: (() => { const m = clone(goodModule); m.id = 'm05'; delete step(m).journalPage; return m; })(),
  journalTooEarly: (() => { const m = clone(goodModule); m.id = 'm04'; step(m).ledger.rows[0].folio = ''; step(m).ledger.rows[0].posted = [false, false]; return m; })(),
  promptWithoutAnswer: (() => { const m = clone(goodModule); step(m).prompt = 'Why?'; return m; })(),
  unknownIdea: (() => { const m = clone(goodModule); step(m).uses.push('made-up-idea'); return m; })(),
  missingSource: (() => { const m = clone(goodModule); step(m).source = 'no-such-source'; return m; })(),
  unofficialResource: (() => { const m = clone(goodModule); m.resources = ['https://example.com/money-tips']; return m; })(),
  unknownResource: (() => { const m = clone(goodModule); m.resources = ['no-such-resource']; return m; })(),
  askGivesAwayAnswer: (() => { const m = clone(goodModule); step(m).ledger.rows[0].ask = ['debit']; return m; })(),
  earlyColumnsInModule1: (() => { const m = clone(goodModule); m.id = 'm01'; m.ideas = ['money-uses', 'five-buckets', 'page-per-bucket']; step(m).uses = ['five-buckets']; return m; })(),
  stepWithoutUses: (() => { const m = clone(goodModule); delete step(m).uses; return m; })(),
  stepWithoutId: (() => { const m = clone(goodModule); delete step(m).id; return m; })(),
  duplicateStepIds: (() => { const m = clone(goodModule); m.steps.push({ ...clone(step(m)) }); return m; })(),
  noSteps: (() => { const m = clone(goodModule); m.steps = []; return m; })(),
  predictAnswerShown: (() => { const m = clone(goodModule); m.steps.push({ id: 'p', kind: 'predict', text: ['Balance?'], uses: ['debit-credit-rules'], ledger: clone(step(m).ledger), answer: 18180, explanation: 'One deposit.' }); return m; })(),
  predictWithoutAnswer: (() => { const m = clone(goodModule); m.steps.push({ id: 'p', kind: 'predict', text: ['Balance?'], uses: ['debit-credit-rules'], explanation: 'x' }); return m; })(),
  askBalanceThenLaterShown: (() => {
    const m = clone(goodModule);
    const page = step(m).ledger;
    page.rows[0].ask = ['balance', 'side'];
    page.rows.push({ date: '2026-06-20', items: 'More', folio: 'J2', debit: 100, credit: 0, posted: [true, false] });
    return m;
  })(),
  journalInModule1: (() => { const m = clone(goodModule); m.id = 'm01'; m.ideas = []; step(m).uses = ['five-buckets']; step(m).ledger.activeColumns = ['date', 'items', 'balance']; return m; })(),
  emptyActiveColumnsModule1: (() => { const m = clone(goodModule); m.id = 'm01'; step(m).uses = ['five-buckets']; delete step(m).journalPage; step(m).ledger.activeColumns = []; return m; })(),
  untaughtIdeaInPractice: (() => { const m = clone(goodModule); m.practice = { recall: [{ id: 'r1', uses: ['trial-balance'] }] }; return m; })(),
  sourceDocNotCents: (() => { const m = clone(goodModule); step(m).sourceDoc = { kind: 'paystub', title: 'Pay stub', lines: [['Gross pay', 1212.5]] }; return m; })(),
  negativeAnswer: (() => { const m = clone(goodModule); m.steps.push({ id: 'n', kind: 'predict', text: ['Balance?'], uses: ['debit-credit-rules'], answer: -500, explanation: 'x' }); return m; })(),
  reportTooEarly: (() => { const m = clone(goodModule); step(m).report = { report: 'trial-balance', name: 'Jordan', date: '2026-06-30', accounts: [{ no: 3, name: 'Saving bucket', debit: 18180 }, { no: 1, name: 'Checking', credit: 18180 }] }; return m; })(),
  badReport: (() => { const m = clone(goodModule); m.id = 'm09'; m.position = 'm09'; step(m).reports = [{ report: 'trial-balance', name: 'Jordan', date: '2026-06-30', accounts: [{ no: 3, name: 'Saving bucket', debit: 18180 }, { no: 1, name: 'Checking', credit: 18100 }] }]; return m; })(),
  statementNotAddingUp: (() => { const m = clone(goodModule); step(m).sourceDoc = { kind: 'statement', title: 'Bank statement', lines: [['Opening balance', 10000], ['Jun 5 Paycheck', 5000, 'in'], ['Jun 9 Debit card', 2000, 'out'], ['Closing balance', 14000]] }; return m; })(),
};
