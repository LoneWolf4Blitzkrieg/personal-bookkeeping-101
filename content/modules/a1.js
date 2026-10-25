// Add-on A1: The Federal Reserve. Ideas: what-the-fed-is, money-flows,
// fed-money-supply. Money moving among people, banks, the government and the
// Fed is shown on simplified ledger pages, one set of books per institution:
// the Fed (F1 Treasury securities, F2 Banks' reserves, F3 Treasury's account),
// a bank (B1 Reserves at the Fed, B2 Customers' deposits, B3 Treasury
// securities) and the Treasury (T1 Account at the Fed). The bank, the people
// and the everyday amounts are fictional (illustrative); the history and the
// money-supply figures are cited.

import { money, NAMES, explainTemplate, bookPage, per100 } from '../helpers.js';
import { M2, M2_SOURCE, monthName } from '../addonData.js';
import { M12_LESSON } from './m12.js';
import { M13_LESSON } from './m13.js';
import { M14_LESSON, M14_GATE } from './m14.js';

const num = (id, part, params, build) => ({ id, module: 'a1', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const BANK = 'Desert Bank (fictional)';
const FED = 'Federal Reserve (simplified)';
const BOOKS = {
  fedSecurities: { name: FED, account: 'Treasury securities', accountNo: 'F1', type: 'asset' },
  fedReserves: { name: FED, account: 'Banks\' reserves', accountNo: 'F2', type: 'liability' },
  fedTreasury: { name: FED, account: 'Treasury\'s account', accountNo: 'F3', type: 'liability' },
  bankReserves: { name: BANK, account: 'Reserves at the Fed', accountNo: 'B1', type: 'asset' },
  bankDeposits: { name: BANK, account: 'Customers\' deposits', accountNo: 'B2', type: 'liability' },
  treasuryAccount: { name: 'U.S. Treasury (simplified)', account: 'Account at the Fed', accountNo: 'T1', type: 'asset' },
};
const page = (book, rows, opts) => bookPage(BOOKS[book], rows, opts);
const HISTORY_SOURCES = ['fed-act-signed', 'fed-act-title', 'fed-who-we-are'];
const M2_PAIRS = [['2019-10', '2020-10'], ['2019-11', '2020-11'], ['2019-12', '2020-12']];
const billions = (tenths) => `$${(tenths / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} billion`;

// --- Question templates -----------------------------------------------------

const reservesPage = num('a1-reserves-page', 'interpreting', { opening: { min: 15000000, max: 40000000, step: 1 }, inflow: { min: 1000000, max: 9000000, step: 1 }, outflow: { min: 1000000, max: 9000000, step: 1 } }, (p) => ({
  prompt: `${BANK}'s customers received payments from other banks and made payments to other banks. Each one moved reserves at the Fed. What does the bank's Reserves at the Fed page show after the last line?`,
  ledger: page('bankReserves', [['2026-07-01', 'Brought forward', '', p.opening, 0], ['2026-07-02', 'Payments in from other banks', 'R1', p.inflow, 0], ['2026-07-02', 'Payments out to other banks', 'R1', 0, p.outflow]], { askFrom: 1 }),
  highlightRow: 2,
  answer: p.opening + p.inflow - p.outflow,
  misconceptions: [{ cents: p.opening - p.inflow + p.outflow, explanation: 'Reserves are an asset of the bank. Money coming in is a debit and adds. Money going out is a credit and subtracts.' }],
  explanation: `${money(p.opening)} + ${money(p.inflow)} − ${money(p.outflow)} = ${money(p.opening + p.inflow - p.outflow)}.`,
}));

const taxToTreasury = num('a1-tax-to-treasury', 'interpreting', { opening: { min: 50000000, max: 90000000, step: 1 }, a: { min: 100000, max: 900000, step: 1 }, b: { min: 100000, max: 900000, step: 1 } }, (p) => ({
  prompt: `The Treasury's account at the Fed holds ${money(p.opening)}. Taxpayers at two banks pay ${money(p.a)} and ${money(p.b)} in taxes. What does the Treasury's account show now?`,
  answer: p.opening + p.a + p.b,
  misconceptions: [{ cents: p.opening + p.a, explanation: 'Both payments reach the Treasury\'s account. Add each one.' }],
  explanation: `Taxes paid move into the Treasury's account at the Fed: ${money(p.opening)} + ${money(p.a)} + ${money(p.b)} = ${money(p.opening + p.a + p.b)}.`,
}));

const paymentDeposits = num('a1-payment-deposits', 'interpreting', { opening: { min: 20000000, max: 60000000, step: 1 }, pay: { min: 50000, max: 300000, step: 100 }, name: { pick: NAMES } }, (p) => ({
  prompt: `The government sends ${p.name}, a customer of ${BANK}, a payment of ${money(p.pay)}. What does the bank's Customers' deposits page show after it?`,
  ledger: page('bankDeposits', [['2026-07-01', 'Brought forward', '', 0, p.opening], ['2026-07-03', `Government payment to ${p.name}`, 'D1', 0, p.pay]], { askFrom: 1 }),
  highlightRow: 1,
  answer: p.opening + p.pay,
  misconceptions: [{ cents: p.opening - p.pay, explanation: 'Deposits are what the bank owes its customers. They are a liability, so the payment is a credit and adds to it.' }],
  explanation: `The bank now owes ${p.name} more: ${money(p.opening)} + ${money(p.pay)} = ${money(p.opening + p.pay)}.`,
}));

const fedBuys = num('a1-fed-buys', 'interpreting', { reserves: { min: 300000000, max: 900000000, step: 1 }, buy: { min: 10000000, max: 90000000, step: 1 } }, (p) => ({
  prompt: `The Fed's Banks' reserves page shows ${money(p.reserves)}. The Fed buys ${money(p.buy)} of Treasury securities from banks and pays by crediting their reserve accounts. What does the page show now?`,
  source: 'powell-balance-sheet-2025',
  answer: p.reserves + p.buy,
  misconceptions: [{ cents: p.reserves - p.buy, explanation: 'The Fed pays by crediting the banks\' reserves, so they go up. Buying securities adds money.' }],
  explanation: `${money(p.reserves)} + ${money(p.buy)} = ${money(p.reserves + p.buy)}. The new reserves did not come from anywhere else. The Fed created them.`,
}));

const fedSells = num('a1-fed-sells', 'interpreting', { reserves: { min: 300000000, max: 900000000, step: 1 }, sell: { min: 10000000, max: 90000000, step: 1 } }, (p) => ({
  prompt: `The Fed's Banks' reserves page shows ${money(p.reserves)}. The Fed sells ${money(p.sell)} of Treasury securities to banks, which pay from their reserve accounts. What does the page show now?`,
  answer: p.reserves - p.sell,
  misconceptions: [{ cents: p.reserves + p.sell, explanation: 'The banks pay from their reserves, so reserves go down. Selling securities takes money out.' }],
  explanation: `${money(p.reserves)} − ${money(p.sell)} = ${money(p.reserves - p.sell)}.`,
}));

// Three real pairs of months, each asked two ways: the new money per $100.00,
// or what each $100.00 became.
const m2Growth = num('a1-m2-growth', 'interpreting', { pair: { pick: M2_PAIRS }, ask: { pick: ['new', 'became'] } }, (p) => {
  const [from, to] = p.pair;
  const growth = per100(M2[to] - M2[from], M2[from]);
  const became = per100(M2[to], M2[from]);
  const isNew = p.ask === 'new';
  return {
    prompt: isNew
      ? `The money supply (M2) was ${billions(M2[from])} in ${monthName(from)} and ${billions(M2[to])} in ${monthName(to)}. For every $100.00 of money in ${monthName(from)}, how many dollars of new money were there a year later?`
      : `The money supply (M2) was ${billions(M2[from])} in ${monthName(from)} and ${billions(M2[to])} in ${monthName(to)}. Every $100.00 of money in ${monthName(from)} had grown to how much a year later?`,
    source: M2_SOURCE,
    answer: isNew ? growth : became,
    misconceptions: [isNew
      ? { cents: became, explanation: 'That is what each $100.00 grew to. The new money is the part above $100.00.' }
      : { cents: growth, explanation: 'That is the new money alone. Add the $100.00 you started with.' }],
    explanation: `${billions(M2[to])} ÷ ${billions(M2[from])} × 100 = ${money(became)} (rounded to the cent), so each $100.00 grew by ${money(growth)}.`,
  };
});

const FED_ACCOUNTS = [
  { id: 'fed-securities', label: 'F1 Treasury securities' },
  { id: 'fed-reserves', label: 'F2 Banks\' reserves' },
  { id: 'fed-treasury', label: 'F3 Treasury\'s account' },
];
const FED_EVENTS = {
  buy: (p) => ({
    prompt: `In the Fed's books, record this: the Fed buys ${money(p.amount)} of Treasury securities from banks and pays by crediting their reserve accounts.`,
    answer: [{ account: 'fed-securities', debit: p.amount, credit: 0 }, { account: 'fed-reserves', debit: 0, credit: p.amount }],
    explanation: 'The Fed now owns more securities, an asset, so debit F1. It owes the banks more reserves, a liability, so credit F2.',
  }),
  sell: (p) => ({
    prompt: `In the Fed's books, record this: the Fed sells ${money(p.amount)} of Treasury securities to banks, which pay from their reserve accounts.`,
    answer: [{ account: 'fed-reserves', debit: p.amount, credit: 0 }, { account: 'fed-securities', debit: 0, credit: p.amount }],
    explanation: 'The Fed owes the banks less in reserves, so debit F2. It owns fewer securities, so credit F1.',
  }),
  tax: (p) => ({
    prompt: `In the Fed's books, record this: people pay ${money(p.amount)} of taxes from their banks to the Treasury.`,
    answer: [{ account: 'fed-reserves', debit: p.amount, credit: 0 }, { account: 'fed-treasury', debit: 0, credit: p.amount }],
    explanation: 'The banks\' reserves go down, so debit F2. The Treasury\'s account goes up, so credit F3. The money moves from one account at the Fed to another.',
  }),
  spend: (p) => ({
    prompt: `In the Fed's books, record this: the Treasury pays ${money(p.amount)} to people, whose banks receive it in their reserve accounts.`,
    answer: [{ account: 'fed-treasury', debit: p.amount, credit: 0 }, { account: 'fed-reserves', debit: 0, credit: p.amount }],
    explanation: 'The Treasury\'s account goes down, so debit F3. The banks\' reserves go up, so credit F2.',
  }),
};
const recordFed = {
  id: 'a1-record-fed', module: 'a1', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 1000000, max: 90000000, step: 1 }, event: { byVersion: Object.keys(FED_EVENTS) } },
  build: (p) => ({ accounts: FED_ACCOUNTS, ...FED_EVENTS[p.event](p) }),
};

// Production: follow two events through three sets of books.
const flowTable = {
  id: 'a1-flow-table', module: 'a1', kind: 'amounts', part: 'producing', points: 4,
  params: {
    reserves: { min: 20000000, max: 60000000, step: 1 }, deposits: { min: 100000000, max: 300000000, step: 1 }, fedReserves: { min: 300000000, max: 900000000, step: 1 },
    treasury: { min: 50000000, max: 90000000, step: 1 }, tax: { min: 100000, max: 900000, step: 1 }, buy: { min: 1000000, max: 9000000, step: 1 },
  },
  build: (p) => ({
    prompt: `Start: ${BANK} has ${money(p.reserves)} of reserves at the Fed and owes its customers ${money(p.deposits)} in deposits. The Fed's Banks' reserves page shows ${money(p.fedReserves)}, and the Treasury's account at the Fed ${money(p.treasury)}. Then two things happen. First, the bank's customers pay ${money(p.tax)} in taxes. Second, the Fed buys ${money(p.buy)} of Treasury securities from the bank itself. Work out each page afterward.`,
    fields: [
      ['Bank: Reserves at the Fed', p.reserves - p.tax + p.buy],
      ['Bank: Customers\' deposits', p.deposits - p.tax],
      ['Fed: Banks\' reserves', p.fedReserves - p.tax + p.buy],
      ['Fed: Treasury\'s account', p.treasury + p.tax],
    ].map(([label, answer]) => ({ label, answer })),
    explanation: `Taxes: the bank's reserves and its customers' deposits both fall by ${money(p.tax)}. At the Fed, banks' reserves fall and the Treasury's account rises by ${money(p.tax)}. The purchase: the bank swaps ${money(p.buy)} of securities for reserves. Its reserves and the Fed's Banks' reserves both rise by ${money(p.buy)}. Its deposits do not change, because the bank itself sold the securities.`,
  }),
};

const explainFed = explainTemplate({
  id: 'a1-explain', module: 'a1',
  variants: [
    { prompt: 'In one or two sentences: why is the Fed called a bank for banks and for the government?',
      modelAnswer: 'Banks keep their reserve accounts at the Fed, and the Treasury keeps its account there. Payments between banks, and to and from the government, move between these accounts.',
      rubric: ['Says banks keep reserve accounts at the Fed', 'Says the Treasury (the government) keeps its account at the Fed'] },
    { prompt: 'In one or two sentences: how does the Fed add money when it buys Treasury securities?',
      modelAnswer: 'It pays by crediting the reserve accounts of the banks involved. Those reserves are new: they did not come out of anyone else\'s account.',
      rubric: ['Says the Fed pays by crediting banks\' reserve accounts', 'Says the reserves are newly created (not moved from someone else)'] },
    { prompt: 'In one or two sentences: when you pay a tax from your checking account, why does your bank\'s Customers\' deposits page go down?',
      modelAnswer: 'Deposits are what the bank owes you. After the payment it owes you less, so the liability is debited. The money moves on to the Treasury\'s account at the Fed.',
      rubric: ['Says deposits are what the bank owes its customers (a liability)', 'Says the payment lowers what it owes, as the money moves to the Treasury'] },
    { prompt: 'In one or two sentences: what did the Federal Reserve Act of 1913 mean by an "elastic currency"?',
      modelAnswer: 'It means money whose amount can grow or shrink as the country needs. The Fed can add money by buying securities and take it out by selling them.',
      rubric: ['Says the amount of money can grow or shrink with the country\'s needs', 'Names a way the Fed does it (buying or selling securities)'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

const BANK_OPENING = 25000000; // $250,000.00 of reserves (illustrative)
const DEPOSITS_OPENING = 180000000;
const FED_RESERVES = 3200000000; // all banks, simplified
const TAX = 30000;
const flowPages = () => [
  page('bankDeposits', [['2026-07-01', 'Brought forward', '', 0, DEPOSITS_OPENING], ['2026-07-15', 'Ana pays her tax', 'D1', TAX, 0]]),
  page('bankReserves', [['2026-07-01', 'Brought forward', '', BANK_OPENING, 0], ['2026-07-15', 'Ana\'s tax to the Treasury', 'R1', 0, TAX]]),
  page('fedReserves', [['2026-07-01', 'Brought forward', '', 0, FED_RESERVES], ['2026-07-15', 'Tax paid from Desert Bank', 'F7', TAX, 0]]),
  page('fedTreasury', [['2026-07-01', 'Brought forward', '', 0, 75000000], ['2026-07-15', 'Tax from Desert Bank', 'F7', 0, TAX]]),
];
const PURCHASE = 200000000;
const purchasePages = () => [
  page('fedSecurities', [['2026-07-01', 'Brought forward', '', 4500000000, 0], ['2026-07-20', 'Bought from banks', 'F9', PURCHASE, 0]]),
  page('fedReserves', [['2026-07-01', 'Brought forward', '', 0, FED_RESERVES], ['2026-07-20', 'Paid for securities bought', 'F9', 0, PURCHASE]]),
];
const [M2_FROM, M2_TO] = ['2019-12', '2020-12'];

export const A1_LESSON = {
  id: 'a1',
  title: 'The Federal Reserve',
  coreIdea: 'The Federal Reserve is the central bank of the United States. It is the bank for banks and for the government. Every payment you make moves through several sets of books, and the Fed can add money to them or take it out.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['sinking-funds'],
      text: ['From Module 14: a $420.00 bill is due in 7 months. How much goes into the Sinking fund each month?'],
      answer: 6000,
      misconceptions: [{ cents: 42000, explanation: 'Divide the bill by the 7 months.' }],
      explanation: '$420.00 ÷ 7 = $60.00.',
    },
    {
      id: 'the-fed', kind: 'explain', title: 'What the Fed is', uses: ['what-the-fed-is', 'accounting-equation'],
      text: [
        'The Federal Reserve, or the Fed, is the central bank of the United States. President Woodrow Wilson signed the Federal Reserve Act on December 23, 1913. Its official title says it was passed "to furnish an elastic currency": money whose amount can grow or shrink as the country needs.',
        'The Fed has a Board of Governors in Washington, D.C., and 12 regional Federal Reserve Banks around the country.',
        'You cannot open an account at the Fed. It is the bank for banks and for the government. Banks keep reserve accounts there, and the U.S. Treasury keeps its account there. When money moves from one bank to another, it moves between their reserve accounts.',
        'From here on, the course shows other people\'s books on simplified ledger pages: the Fed\'s, a bank\'s and the Treasury\'s. Each keeps its own books, and debits equal credits, just like yours.',
      ],
      prompt: 'Why does a payment from your bank to someone at another bank change two reserve accounts at the Fed?',
      promptAnswer: 'The money leaves your bank\'s reserve account and arrives in the other bank\'s reserve account. Both accounts are at the Fed.',
      sources: HISTORY_SOURCES,
      ledger: page('bankReserves', [['2026-07-01', 'Brought forward', '', BANK_OPENING, 0]]),
      highlightRow: 0,
    },
    {
      id: 'predict-reserves', kind: 'predict', title: 'Predict: a bank\'s reserves', uses: ['what-the-fed-is', 'running-balance'],
      text: [`During one day, ${BANK}'s customers receive $38,500.00 from people at other banks and pay out $51,200.00 to people at other banks. What does the bank's Reserves at the Fed page show at the end of the day?`],
      ledger: page('bankReserves', [['2026-07-01', 'Brought forward', '', BANK_OPENING, 0], ['2026-07-02', 'Payments in from other banks', 'R1', 3850000, 0], ['2026-07-02', 'Payments out to other banks', 'R1', 0, 5120000]], { askFrom: 1 }),
      highlightRow: 2,
      answer: BANK_OPENING + 3850000 - 5120000,
      misconceptions: [{ cents: BANK_OPENING - 3850000 + 5120000, explanation: 'Money coming in adds to the bank\'s reserves; money going out subtracts.' }],
      explanation: '$250,000.00 + $38,500.00 − $51,200.00 = $237,300.00.',
    },
    {
      id: 'flows', kind: 'explain', title: 'One payment, four sets of books', uses: ['money-flows', 'debit-credit-rules', 'transfers'],
      text: [
        'Ana pays $300.00 of federal tax from her checking account at Desert Bank. Follow it through every set of books.',
        'Ana: credit Checking, debit her tax expense. Desert Bank: debit Customers\' deposits, because it now owes Ana less, and credit Reserves at the Fed, because its reserves go to pay the tax.',
        'The Fed: debit Banks\' reserves, because Desert Bank\'s account goes down, and credit the Treasury\'s account. The Treasury: debit its Account at the Fed.',
        'Every set of books balances. When the government pays someone, the same path runs the other way.',
      ],
      prompt: 'Why does Desert Bank debit Customers\' deposits when Ana pays her tax?',
      promptAnswer: 'Deposits are what the bank owes its customers. They are a liability. After the payment it owes Ana $300.00 less, so the page is debited.',
      ledgers: flowPages(),
      highlightRow: 1,
    },
    {
      id: 'predict-payment', kind: 'predict', title: 'Predict: a government payment', uses: ['money-flows'],
      text: ['The government sends Ana a $1,200.00 payment. It goes the other way: out of the Treasury\'s account, into Desert Bank\'s reserves, and into Ana\'s deposit. What does the bank\'s Customers\' deposits page show after it?'],
      ledger: page('bankDeposits', [['2026-07-01', 'Brought forward', '', 0, DEPOSITS_OPENING], ['2026-07-15', 'Ana pays her tax', 'D1', TAX, 0], ['2026-07-22', 'Government payment to Ana', 'D2', 0, 120000]], { askFrom: 1 }),
      highlightRow: 2,
      answer: DEPOSITS_OPENING - TAX + 120000,
      misconceptions: [{ cents: DEPOSITS_OPENING - TAX - 120000, explanation: 'The bank now owes Ana more. Deposits are credited and go up.' }],
      explanation: '$1,800,000.00 − $300.00 + $1,200.00 = $1,800,900.00.',
    },
    {
      id: 'money', kind: 'explain', title: 'How the Fed changes the amount of money', uses: ['fed-money-supply', 'money-flows'],
      text: [
        'The Fed adds money by buying Treasury securities, which are the government\'s IOUs. In the words of the Fed\'s chair, it does so "by purchasing Treasury securities in the open market and crediting the reserve accounts of the banks involved." Those reserves are new. They do not come out of anyone else\'s account.',
        'In the Fed\'s books: debit Treasury securities (an asset) and credit Banks\' reserves (what it owes the banks). If a bank\'s customer sold the securities, the bank also credits that customer\'s deposit, so the money in people\'s and companies\' accounts grows too.',
        'Selling securities does the reverse and takes money out. The Fed also sets a target for the federal funds rate, the rate banks charge each other overnight, which affects what loans cost.',
        `The amount of money can change quickly. The money supply called M2 (cash, checking and savings deposits, and similar accounts) was ${billions(M2[M2_FROM])} in ${monthName(M2_FROM)} and ${billions(M2[M2_TO])} a year later.`,
      ],
      prompt: 'Why does the Fed\'s purchase add to the amount of money, while a payment from one person to another does not?',
      promptAnswer: 'A payment only moves existing money between accounts. The Fed pays for securities with newly created reserves, so the total grows.',
      sources: ['powell-balance-sheet-2025', 'fed-open-market', M2_SOURCE],
      ledgers: purchasePages(),
      highlightRow: 1,
    },
    {
      id: 'predict-sell', kind: 'predict', title: 'Predict: the Fed sells', uses: ['fed-money-supply'],
      text: ['After its purchase, the Fed sells $500,000.00 of Treasury securities to banks, which pay from their reserve accounts. What does the Fed\'s Banks\' reserves page show now?'],
      ledger: page('fedReserves', [['2026-07-01', 'Brought forward', '', 0, FED_RESERVES], ['2026-07-20', 'Paid for securities bought', 'F9', 0, PURCHASE], ['2026-07-27', 'Received for securities sold', 'F10', 50000000, 0]], { askFrom: 2 }),
      highlightRow: 2,
      answer: FED_RESERVES + PURCHASE - 50000000,
      misconceptions: [{ cents: FED_RESERVES + PURCHASE + 50000000, explanation: 'The banks pay from their reserves. The page is debited and goes down.' }],
      explanation: '$32,000,000.00 + $2,000,000.00 − $500,000.00 = $33,500,000.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['fed-money-supply', 'percentages'],
      text: [`M2 was ${billions(M2[M2_FROM])} in ${monthName(M2_FROM)} and ${billions(M2[M2_TO])} in ${monthName(M2_TO)}. Step 1 is done: ${billions(M2[M2_TO])} − ${billions(M2[M2_FROM])} = ${billions(M2[M2_TO] - M2[M2_FROM])} of new money. Finish Step 2: for every $100.00 that existed in ${monthName(M2_FROM)}, how many dollars of new money were there? Round to the cent.`],
      answer: per100(M2[M2_TO] - M2[M2_FROM], M2[M2_FROM]),
      misconceptions: [{ cents: per100(M2[M2_TO], M2[M2_FROM]), explanation: 'That is what each $100.00 grew to. The new money is the part above $100.00.' }],
      explanation: `${billions(M2[M2_TO] - M2[M2_FROM])} ÷ ${billions(M2[M2_FROM])} × 100 = ${money(per100(M2[M2_TO] - M2[M2_FROM], M2[M2_FROM]))}. That is about a quarter more money in one year.`,
      source: M2_SOURCE,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['fed-money-supply'],
      text: ['Desert Bank has $237,300.00 of reserves at the Fed. The Fed buys $40,000.00 of Treasury securities from the bank. What do the bank\'s reserves show now?'],
      answer: 23730000 + 4000000,
      misconceptions: [{ cents: 23730000 - 4000000, explanation: 'The Fed pays the bank by crediting its reserve account. Reserves go up.' }],
      explanation: '$237,300.00 + $40,000.00 = $277,300.00. (The bank\'s securities page goes down by the same amount.)',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['money-flows'],
      text: ['The Treasury\'s account at the Fed holds $820,000.00. Taxpayers pay $3,500.00 in taxes. What does the Treasury\'s account show now?'],
      answer: 82000000 + 350000,
      misconceptions: [{ cents: 82000000 - 350000, explanation: 'Taxes paid move into the Treasury\'s account.' }],
      explanation: '$820,000.00 + $3,500.00 = $823,500.00.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['fed-money-supply'],
      text: ['The Fed\'s Treasury securities page shows $45,000,000.00. It buys $1,250,000.00 more. What does the page show now?'],
      answer: 4500000000 + 125000000,
      misconceptions: [{ cents: 4500000000 - 125000000, explanation: 'Buying adds to the securities the Fed owns.' }],
      explanation: '$45,000,000.00 + $1,250,000.00 = $46,250,000.00.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['fed-money-supply'],
      text: ['A bank has $90,000.00 of reserves at the Fed. The Fed sells it $15,000.00 of Treasury securities. What do its reserves show now?'],
      answer: 9000000 - 1500000,
      misconceptions: [{ cents: 9000000 + 1500000, explanation: 'The bank pays from its reserves. They go down.' }],
      explanation: '$90,000.00 − $15,000.00 = $75,000.00.',
    },
  ],
  resources: ['fed-explained'],
  recallTemplates: [taxToTreasury, fedBuys].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: a purchase adds to the banks' reserves.
const drill = [1, 2, 3].map((n) => num(`a1-drill-${n}`, 'interpreting', { r: { min: 10000000, max: 90000000, step: 1 }, b: { min: 100000, max: 9000000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: banks' reserves are ${money(p.r)}. The Fed buys ${money(p.b)} of securities from them. What are the reserves now?`, answer: p.r + p.b,
  explanation: `${money(p.r)} + ${money(p.b)} = ${money(p.r + p.b)}.`,
})));

const planMixed = { ...M14_GATE.templates.find((t) => t.part === 'producing'), id: 'm14-record-plan-mixed-a1' };

export const A1_PRACTICE = {
  id: 'a1-practice', kind: 'practice', module: 'a1', title: 'Add-on A1 practice set',
  templates: [...M14_LESSON.recallTemplates, ...M13_LESSON.recallTemplates, ...M12_LESSON.recallTemplates, ...drill, reservesPage, fedBuys, m2Growth, recordFed, flowTable, planMixed, { ...explainFed, id: 'a1-explain-practice' }],
};

export const A1_EXTRA = {
  id: 'a1-extra', kind: 'practice', module: 'a1', title: 'Add-on A1 extra practice',
  templates: [reservesPage, taxToTreasury, paymentDeposits, fedSells, m2Growth, flowTable, recordFed].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const A1_REMEDIAL = {
  id: 'a1-remedial', kind: 'practice', module: 'a1', title: 'Add-on A1: common mistakes',
  templates: [paymentDeposits, fedSells, recordFed].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
export const A1_GATE = {
  id: 'a1', kind: 'gate', title: 'Add-on A1 check',
  templates: [reservesPage, taxToTreasury, paymentDeposits, fedBuys, fedSells, m2Growth, drill[0], recordFed, flowTable, explainFed],
};
