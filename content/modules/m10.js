// Module 10: Matching the bank. Ideas: bank-reconciliation, outstanding-items,
// bank-fee-interest-entries. Bank statements appear as source documents
// whose lines are marked in or out; reconciliations are reports. The book
// side is the pages held at the bank (Checking and the buckets), never Cash.
// The bank and every amount are fictional (illustrative).

import { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } from '../helpers.js';
import { M06_LESSON } from './m06.js';
import { M08_LESSON } from './m08.js';
import { M09_LESSON, M09_GATE } from './m09.js';

const num = (id, part, params, build) => ({ id, module: 'm10', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const BANK = 'Desert Bank (fictional)';
const NOTE = 'Bank and amounts are fictional (illustrative).';

// A statement from its opening balance and its lines [label, cents, 'in'|'out'].
function statement(period, opening, lines) {
  const closing = lines.reduce((b, [, v, d]) => b + (d === 'in' ? v : -v), opening);
  return { kind: 'statement', title: `Bank statement: ${BANK}, ${period}`, lines: [['Opening balance', opening], ...lines, ['Closing balance', closing]], note: NOTE };
}
const closingOf = (doc) => doc.lines[doc.lines.length - 1][1];
const page = (id, amount) => ({ no: CHART[id].no, name: CHART[id].name, amount });
const rec = (name, fields) => ({ report: 'reconciliation', name, date: '2026-06-30', deposits: [], payments: [], interest: [], fees: [], ...fields });

// --- Question templates -----------------------------------------------------

const adjustedBank = num('m10-adjusted-bank', 'interpreting', {
  opening: { min: 30000, max: 90000, step: 1 }, pay: { min: 90000, max: 110000, step: 1 }, a: { min: 1000, max: 9000, step: 1 }, rent: { min: 40000, max: 60000, step: 500 },
  dep: { min: 2000, max: 9000, step: 100 }, c1: { min: 1500, max: 8000, step: 1 }, c2: { min: 1000, max: 6000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const doc = statement('June 2026', p.opening, [['Jun 5 Paycheck deposit', p.pay, 'in'], ['Jun 9 Debit card: Desert Mart', p.a, 'out'], ['Jun 12 Check 101: rent', p.rent, 'out']]);
  const closing = closingOf(doc);
  const answer = closing + p.dep - p.c1 - p.c2;
  return {
    prompt: `${p.name}'s books show three things this statement does not have yet: a ${money(p.dep)} deposit made on Jun 30, and checks 102 (${money(p.c1)}) and 103 (${money(p.c2)}) that have not been cashed. What is the adjusted bank balance?`,
    sourceDoc: doc,
    answer,
    misconceptions: [{ cents: closing - p.dep + p.c1 + p.c2, explanation: 'Deposits not yet on the statement are added to its balance. Payments not yet on it are subtracted.' }],
    explanation: `${money(closing)} + ${money(p.dep)} − ${money(p.c1)} − ${money(p.c2)} = ${money(answer)}.`,
  };
});

const adjustedBook = num('m10-adjusted-book', 'interpreting', {
  spending: { min: 20000, max: 70000, step: 1 }, saving: { min: 30000, max: 150000, step: 1 }, cash: { min: 1000, max: 6000, step: 1 },
  // Interest always stays below the smallest fee, so the two never cancel out.
  interest: { min: 20, max: 290, step: 1 }, fee: { min: 300, max: 1200, step: 100 }, name: { pick: NAMES },
}, (p) => {
  const book = p.spending + p.saving;
  const answer = book + p.interest - p.fee;
  return {
    prompt: `${p.name}'s pages: Spending bucket ${money(p.spending)} and Saving bucket ${money(p.saving)}, both held at the bank, and Cash ${money(p.cash)} in the wallet. The statement shows ${money(p.interest)} of interest and a ${money(p.fee)} fee that are not in the books yet. What is the adjusted book balance for the bank?`,
    answer,
    misconceptions: [
      { cents: answer + p.cash, explanation: 'Cash is in the wallet, not at the bank, so it is left out.' },
      { cents: book - p.interest + p.fee, explanation: 'Interest the bank paid is added to the book balance. A fee it charged is subtracted.' },
    ],
    explanation: `${money(p.spending)} + ${money(p.saving)} = ${money(book)}. Then + ${money(p.interest)} interest − ${money(p.fee)} fee = ${money(answer)}.`,
  };
});

const BANK_ACCOUNTS = accountOptions(['checking', 'spending', 'saving', 'cash', 'interest-earned', 'bank-fees']);
const BANK_EVENTS = {
  fee: (p) => ({
    prompt: 'Write the journal entry for the fee on this statement. Fees come out of your Spending bucket.',
    sourceDoc: statement('July 2026', p.opening, [['Jul 3 Paycheck deposit', p.pay, 'in'], ['Jul 31 Monthly service fee', p.fee, 'out']]),
    answer: [{ account: 'bank-fees', debit: p.fee, credit: 0 }, { account: 'spending', debit: 0, credit: p.fee }],
    explanation: 'Bank fees (60, an expense) is debited. The Spending bucket, which paid it, is credited.',
  }),
  interest: (p) => ({
    prompt: 'Write the journal entry for the interest on this statement. Interest goes into your Saving bucket.',
    sourceDoc: statement('July 2026', p.opening, [['Jul 3 Paycheck deposit', p.pay, 'in'], ['Jul 31 Interest paid', p.interest, 'in']]),
    answer: [{ account: 'saving', debit: p.interest, credit: 0 }, { account: 'interest-earned', debit: 0, credit: p.interest }],
    explanation: 'The Saving bucket (an asset) goes up, so it is debited. Interest earned (42, income) goes up, so it is credited.',
  }),
};
const recordBank = {
  id: 'm10-record-bank', module: 'm10', kind: 'entry', part: 'producing', points: 4,
  params: { opening: { min: 30000, max: 90000, step: 1 }, pay: { min: 90000, max: 110000, step: 1 }, fee: { min: 300, max: 1500, step: 1 }, interest: { min: 20, max: 400, step: 1 }, event: { byVersion: ['fee', 'interest', 'fee', 'interest'] } },
  build: (p) => ({ accounts: BANK_ACCOUNTS, ...BANK_EVENTS[p.event](p) }),
};

const explainBank = explainTemplate({
  id: 'm10-explain', module: 'm10',
  variants: [
    { prompt: 'In one or two sentences: why is the statement balance often different from your books on the same day?',
      modelAnswer: 'Some things are in your books but have not reached the bank yet, such as a deposit just made or a check not yet cashed. The bank may also have charged a fee or paid interest that is not in your books yet.',
      rubric: ['Names items in the books but not yet at the bank (deposits in transit, uncashed checks)', 'Names items at the bank not yet in the books (fees, interest), or says the difference is timing'] },
    { prompt: 'In one or two sentences: why is Cash left out of a bank reconciliation?',
      modelAnswer: 'Cash is money in your wallet, not at the bank, so it can never appear on the bank\'s statement.',
      rubric: ['Says cash is not held at the bank', 'Says so it cannot be on the statement (only pages at that bank are compared)'] },
    { prompt: 'In one or two sentences: why do you record a bank fee from the statement?',
      modelAnswer: 'The bank took the fee itself, so the statement is the source document that tells you about it. Recording it makes your books match the bank.',
      rubric: ['Says the statement is where you learn of the fee (its source document)', 'Says recording it makes the books match the bank'] },
    { prompt: 'In one or two sentences: what does it mean when the adjusted bank balance and the adjusted book balance agree?',
      modelAnswer: 'Your books and the bank agree once you allow for timing differences: the pages for that bank, taken together, hold the same money the bank does. (It cannot show an amount put on the wrong bucket page.)',
      rubric: ['Says the books and the bank agree after the timing differences', 'Says the pages for that bank, taken together, match what the bank holds'] },
  ],
});

const drill = [1, 2, 3].map((n) => num(`m10-drill-${n}`, 'interpreting', { a: { min: 30000, max: 150000, step: 1 }, b: { min: 500, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the statement shows ${money(p.a)}. A ${money(p.b)} check you wrote has not been cashed yet. What is the adjusted bank balance?`, answer: p.a - p.b,
  misconceptions: [{ cents: p.a + p.b, explanation: 'A payment not yet on the statement is subtracted.' }],
  explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const statementClosing = num('m10-statement-closing', 'interpreting', { opening: { min: 20000, max: 80000, step: 1 }, pay: { min: 90000, max: 110000, step: 1 }, a: { min: 1000, max: 9000, step: 1 }, b: { min: 2000, max: 6000, step: 1 } }, (p) => {
  const doc = statement('June 2026', p.opening, [['Jun 5 Paycheck deposit', p.pay, 'in'], ['Jun 9 Debit card: Desert Mart', p.a, 'out'], ['Jun 15 Phone bill', p.b, 'out']]);
  const shown = { ...doc, lines: [...doc.lines.slice(0, -1), ['Closing balance', 'left blank']] };
  return {
    prompt: 'The closing balance on this statement has been left blank. What should it be?',
    sourceDoc: shown,
    answer: closingOf(doc),
    explanation: `${money(p.opening)} + ${money(p.pay)} − ${money(p.a)} − ${money(p.b)} = ${money(closingOf(doc))}.`,
  };
});

// Completion: a reconciliation with the statement balance and the totals
// blank. The statement balance can only be found by working the bank side
// back from the adjusted balance.
const recBlanks = {
  id: 'm10-rec-blanks', module: 'm10', kind: 'amounts', part: 'producing', points: 4,
  params: { spending: { min: 20000, max: 60000, step: 1 }, saving: { min: 30000, max: 90000, step: 1 }, dep: { min: 2000, max: 8000, step: 100 }, c1: { min: 1000, max: 6000, step: 1 }, fee: { min: 300, max: 900, step: 100 }, name: { pick: NAMES } },
  build: (p) => {
    const book = p.spending + p.saving;
    const adjusted = book - p.fee;
    const statementBalance = adjusted - p.dep + p.c1;
    return {
      prompt: `Finish ${p.name}'s bank reconciliation. The statement's closing balance is torn off, so work out the book side first, then the bank side back to the statement.`,
      report: rec(p.name, {
        statement: statementBalance, deposits: [{ label: 'Jun 30 deposit', amount: p.dep }], payments: [{ label: 'Check 104', amount: p.c1 }],
        pages: [page('spending', p.spending), page('saving', p.saving)], fees: [{ label: 'Monthly service fee', amount: p.fee }],
        ask: ['statement', 'adjusted-bank', 'book', 'adjusted-book'],
      }),
      fields: [['Book balance', book], ['Adjusted book balance', adjusted], ['Adjusted bank balance', adjusted], ['Bank statement: closing balance', statementBalance]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: `Books: ${money(book)} − ${money(p.fee)} = ${money(adjusted)}. The adjusted bank balance must agree: ${money(adjusted)}. Working back, the statement shows ${money(adjusted)} − ${money(p.dep)} + ${money(p.c1)} = ${money(statementBalance)}.`,
    };
  },
};

const bookBalance = num('m10-book-balance', 'interpreting', { spending: { min: 10000, max: 60000, step: 1 }, saving: { min: 20000, max: 120000, step: 1 }, investing: { min: 5000, max: 40000, step: 1 }, cash: { min: 500, max: 6000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const answer = p.spending + p.saving + p.investing;
  return {
    prompt: `${p.name} keeps the Spending, Saving and Investing buckets at one bank. The pages show Spending ${money(p.spending)}, Saving ${money(p.saving)}, Investing ${money(p.investing)} and Cash ${money(p.cash)}. What is the book balance for that bank?`,
    answer,
    misconceptions: [{ cents: answer + p.cash, explanation: 'Cash is in the wallet, not at the bank, so it is left out.' }],
    explanation: `${money(p.spending)} + ${money(p.saving)} + ${money(p.investing)} = ${money(answer)}.`,
  };
});

const savingAfterInterest = num('m10-saving-after-interest', 'interpreting', { saving: { min: 20000, max: 150000, step: 1 }, interest: { min: 20, max: 400, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s statement shows ${money(p.interest)} of interest paid into savings. The Saving bucket shows ${money(p.saving)}. After the entry is posted, what does the Saving bucket show?`,
  answer: p.saving + p.interest,
  misconceptions: [{ cents: p.saving - p.interest, explanation: 'Interest paid to you raises the Saving bucket. It is debited, so add.' }],
  explanation: `Debit the Saving bucket, credit Interest earned: ${money(p.saving)} + ${money(p.interest)} = ${money(p.saving + p.interest)}.`,
}));

// Working back from the books to the statement.
// The check is an odd number of cents and the deposit whole dollars, so the two
// never match (a learner who swaps them would otherwise be marked right).
const statementFromBooks = num('m10-statement-from-books', 'interpreting', { book: { min: 40000, max: 160000, step: 1 }, dep: { min: 2000, max: 9000, step: 100 }, chk: { min: 1001, max: 7999, step: 2 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s pages at the bank add up to ${money(p.book)}, with no fees or interest to record. A ${money(p.dep)} deposit has not reached the bank yet, and a ${money(p.chk)} check has not been cashed. What should the bank statement's closing balance be?`,
  answer: p.book - p.dep + p.chk,
  misconceptions: [{ cents: p.book + p.dep - p.chk, explanation: 'The statement does not have the deposit yet, so it shows less. It still has the check money, so it shows more.' }],
  explanation: `The adjusted bank balance must equal the books. Working back: ${money(p.book)} − ${money(p.dep)} + ${money(p.chk)} = ${money(p.book - p.dep + p.chk)}.`,
}));

// --- Lesson -------------------------------------------------------------------

// Devon keeps the Spending and Saving buckets at this bank, so each payday
// deposit there is those two shares of a standard paycheck: $620.07 + $155.02.
// June's closing balances carry into July. Kai is a second, separate example.
const JUNE = statement('June 2026', 80000, [['Jun 5 Deposit: Spending and Saving shares', 77509, 'in'], ['Jun 9 Debit card: Desert Mart', 1341, 'out'], ['Jun 12 Check 101: rent', 45000, 'out']]);
const KAI_JUNE = statement('June 2026', 52000, [['Jun 5 Deposit: Spending and Saving shares', 77509, 'in'], ['Jun 10 Debit card: Saguaro Grocery', 2865, 'out'], ['Jun 12 Check 101: rent', 40000, 'out']]);
const JULY = statement('July 2026', closingOf(JUNE), [['Jul 3 Deposit: Spending and Saving shares', 77509, 'in'], ['Jul 31 Monthly service fee', 500, 'out'], ['Jul 31 Interest paid', 85, 'in']]);

export const M10_LESSON = {
  id: 'm10',
  title: 'Matching the bank',
  coreIdea: 'Once a month, check your books against the bank statement. After allowing for items not yet on the statement and for fees and interest not yet in your books, the two balances agree.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['error-by-size'],
      text: ['From Module 9: a trial balance is off by $45.50 because one amount was posted on the wrong side. What amount do you look for?'],
      answer: 2275,
      misconceptions: [{ cents: 4500, explanation: 'Halve the difference for a wrong-side posting.' }],
      explanation: 'Half of $45.50 is $22.75.',
    },
    {
      id: 'reconcile', kind: 'explain', title: 'Checking against the bank', uses: ['bank-reconciliation', 'source-documents'],
      text: [
        'Each month your bank sends a statement: the money in and out of your account, and the balance. It is a source document.',
        'A bank reconciliation checks your books against it. Add up your pages for money held at that bank: Checking and the buckets kept there. That is your book balance. Cash in your wallet is left out, because it is not at the bank.',
        'Devon keeps the Spending and Saving buckets at this bank, so each payday only those two shares are deposited there. At the end of June, the Spending bucket ($356.66) and the Saving bucket ($755.02) add up exactly to the statement\'s closing balance.',
      ],
      prompt: 'Why is Cash left out of the bank reconciliation?',
      promptAnswer: 'Cash is in your wallet, not at the bank, so it can never be on the bank\'s statement.',
      sourceDoc: JUNE,
      report: rec('Devon (example)', { statement: closingOf(JUNE), pages: [page('spending', 35666), page('saving', 75502)] }),
    },
    {
      id: 'predict-book', kind: 'predict', title: 'Predict: the book balance', uses: ['bank-reconciliation', 'account-numbers'],
      text: ['Your pages show: Spending bucket $412.30 and Saving bucket $905.00, both held at the bank, and Cash (account 7) $38.00 in your wallet. What is your book balance for the bank?'],
      answer: 131730,
      misconceptions: [{ cents: 135530, explanation: 'Leave out Cash. It is not at the bank.' }],
      explanation: '$412.30 + $905.00 = $1,317.30. Cash is not at the bank.',
    },
    {
      id: 'outstanding', kind: 'explain', title: 'Items not on the statement yet', uses: ['outstanding-items', 'bank-reconciliation'],
      text: [
        'The statement and your books are rarely the same on any given day. A deposit you have recorded may not have reached the bank yet. A check you wrote may not have been cashed yet. These are outstanding items.',
        'Start from the statement\'s closing balance. Add deposits not yet on it, and subtract payments not yet on it. That gives the adjusted bank balance, which should equal your book balance.',
        'Here is Kai\'s June. On Jun 30 Kai deposited $40.00 of birthday cash and wrote check 102 for $60.00 to pay back a friend. Neither is on the statement yet.',
      ],
      prompt: 'You wrote a $60.00 check yesterday, and your books show it. Why is it not on the statement yet?',
      promptAnswer: 'The person has not cashed it yet, so the bank has not paid it. It is an outstanding payment.',
      sourceDoc: KAI_JUNE,
      report: rec('Kai (example)', {
        statement: closingOf(KAI_JUNE), deposits: [{ label: 'Jun 30 deposit: birthday cash', amount: 4000 }], payments: [{ label: 'Check 102: paying back a friend', amount: 6000 }],
        pages: [page('spending', 44644), page('saving', 40000)],
      }),
    },
    {
      id: 'predict-adjusted', kind: 'predict', title: 'Predict: the adjusted bank balance', uses: ['outstanding-items'],
      text: ['Work out the adjusted bank balance on this reconciliation. The statement closed at $1,180.40.'],
      report: rec('Maya (example)', {
        statement: 118040, deposits: [{ label: 'Jun 30 deposit', amount: 7500 }], payments: [{ label: 'Check 104', amount: 4250 }, { label: 'Check 105', amount: 1890 }],
        pages: [page('spending', 44400), page('saving', 75000)], ask: ['adjusted-bank', 'book', 'adjusted-book', 'page-0', 'page-1'],
      }),
      answer: 119400,
      misconceptions: [{ cents: 116680, explanation: 'Deposits not yet on the statement are added. Payments not yet on it are subtracted.' }],
      explanation: '$1,180.40 + $75.00 − $42.50 − $18.90 = $1,194.00.',
    },
    {
      id: 'fees', kind: 'explain', title: 'Fees and interest', uses: ['bank-fee-interest-entries', 'journal-entry'],
      text: [
        'Sometimes the statement shows something your books do not have yet: a fee the bank charged, or interest it paid you. Record them from the statement.',
        'A fee is an expense: debit Bank fees (60) and credit the bucket it comes out of, usually the Spending bucket. Interest is income: debit the bucket it goes into (here, the Saving bucket) and credit Interest earned (42).',
        'On the reconciliation, add the interest to the book balance and subtract the fee. Then record both, so next month starts in agreement.',
      ],
      prompt: 'Why do the fee and the interest show up on the statement before they are in your books?',
      promptAnswer: 'The bank charged or paid them itself. You only learn about them from the statement, so you record them then.',
      sourceDoc: JULY,
      journalPage: journal([
        ['2026-07-31', 'J7', 'Monthly service fee (statement)', [['bank-fees', 500, 0], ['spending', 0, 500]]],
        ['2026-07-31', 'J7', 'Interest paid (statement)', [['saving', 85, 0], ['interest-earned', 0, 85]]],
      ], { sheetNo: 7, name: 'Devon (example)' }),
      report: rec('Devon (example)', {
        date: '2026-07-31', statement: closingOf(JULY), pages: [page('spending', 97673), page('saving', 91004)],
        interest: [{ label: 'Interest paid by the bank', amount: 85 }], fees: [{ label: 'Monthly service fee', amount: 500 }],
      }),
    },
    {
      id: 'predict-fee', kind: 'predict', title: 'Predict: posting the fee', uses: ['bank-fee-interest-entries', 'posting'],
      text: ['The $5.00 service fee is posted to the Spending bucket. What is the balance on that line?'],
      ledger: chartPage('spending', [['2026-07-30', 'Brought forward', '', 97673, 0], ['2026-07-31', 'Service fee', 'J7', 0, 500]], { name: 'Devon (example)', askFrom: 1 }),
      highlightRow: 1,
      answer: 97173,
      misconceptions: [{ cents: 98173, explanation: 'The fee comes out of the Spending bucket. That is a credit, so subtract.' }],
      explanation: '$976.73 − $5.00 = $971.73.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['bank-reconciliation', 'bank-fee-interest-entries'],
      text: ['Step 1 is done: your pages at the bank add up to $1,524.60, the book balance. Step 2 is done: the statement shows $0.92 of interest you had not recorded, so add it. Finish Step 3: it also shows a $6.00 fee. What is the adjusted book balance?'],
      answer: 151952,
      misconceptions: [{ cents: 153152, explanation: 'A fee is subtracted from the book balance.' }],
      explanation: '$1,524.60 + $0.92 − $6.00 = $1,519.52.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['outstanding-items', 'bank-reconciliation'],
      text: ['The statement closes at $820.00. You made a $120.00 deposit it does not show yet, and a $35.75 payment has not cleared. What should your book balance for this bank be?'],
      answer: 90425,
      misconceptions: [{ cents: 73575, explanation: 'Add the deposit not yet on the statement and subtract the payment.' }],
      explanation: '$820.00 + $120.00 − $35.75 = $904.25. With no fees or interest, the books should show the same.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['outstanding-items'],
      text: ['A statement closes at $640.18. A $55.00 payment you made is not on it yet. What is the adjusted bank balance?'],
      answer: 58518,
      misconceptions: [{ cents: 69518, explanation: 'A payment not yet on the statement is subtracted.' }],
      explanation: '$640.18 − $55.00 = $585.18.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['bank-fee-interest-entries', 'posting'],
      text: ['The statement shows $0.85 of interest paid into savings. After the entry is posted, what does the Saving bucket show?'],
      ledger: chartPage('saving', [['2026-07-30', 'Brought forward', '', 91004, 0], ['2026-07-31', 'Interest', 'J7', 85, 0]], { name: 'Devon (example)', askFrom: 1 }),
      highlightRow: 1,
      answer: 91089,
      misconceptions: [{ cents: 90919, explanation: 'Interest paid to you raises the Saving bucket. That is a debit, so add.' }],
      explanation: '$910.04 + $0.85 = $910.89.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['bank-reconciliation'],
      text: ['At the bank: Spending bucket $230.15, Saving bucket $480.00 and Investing bucket $103.35. In your wallet: Cash $25.00. What is your book balance for the bank?'],
      answer: 81350,
      misconceptions: [{ cents: 83850, explanation: 'Cash is not at the bank.' }],
      explanation: '$230.15 + $480.00 + $103.35 = $813.50.',
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
  recallTemplates: [adjustedBank, adjustedBook].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


const tbMixed = { ...M09_GATE.templates.find((t) => t.part === 'producing'), id: 'm09-tb-from-pages-mixed-m10' };

export const M10_PRACTICE = {
  id: 'm10-practice', kind: 'practice', module: 'm10', title: 'Module 10 practice set',
  templates: [...M09_LESSON.recallTemplates, ...M08_LESSON.recallTemplates, ...M06_LESSON.recallTemplates, ...drill, adjustedBank, adjustedBook, statementClosing, recBlanks, recordBank, tbMixed, { ...explainBank, id: 'm10-explain-practice' }],
};

export const M10_EXTRA = {
  id: 'm10-extra', kind: 'practice', module: 'm10', title: 'Module 10 extra practice',
  templates: [adjustedBank, statementClosing, bookBalance, statementFromBooks, recordBank].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M10_REMEDIAL = {
  id: 'm10-remedial', kind: 'practice', module: 'm10', title: 'Module 10: common mistakes',
  templates: [adjustedBook, recBlanks, recordBank].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordBank comes first: later modules mix it in.
export const M10_GATE = {
  id: 'm10', kind: 'gate', title: 'Module 10 check',
  templates: [adjustedBank, adjustedBook, statementClosing, bookBalance, savingAfterInterest, statementFromBooks, drill[0], recordBank, recBlanks, explainBank],
};

// Questions Checkpoint C draws from this module.
export const M10_CHECKPOINT = [adjustedBank, recordBank];
