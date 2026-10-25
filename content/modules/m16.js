// Module 16: Final project II: keep, prove, reconcile and report. No new
// ideas: the learner records the month planned in Module 15, proves it with a
// trial balance, matches it to the bank, compares it with the budget, closes
// it and writes the two statements. Every figure comes from the sample month
// (content/sampleMonth.js). There is no module check: the last step is the
// project checklist and rubric.

import { money } from '../helpers.js';
import { reportRows } from '../../js/reports.js';
import * as S from '../sampleMonth.js';

// Every row of a report, so a check can hide all of it until it is answered.
const allRows = (report) => reportRows(report).rows.filter((r) => r.values).map((r) => r.key);
const hideAll = (report) => ({ ...report, ask: allRows(report) });

const SPENDING_MONTH_END = S.balance('spending', 'month');
const ADDED = S.TOTAL_INCOME - S.TOTAL_EXPENSES;
const UNDER = S.BUDGET_TOTAL - S.ACTUAL_TOTAL;

// The project's figures are running balances and column totals from the
// learner's own pages, printed nowhere in the course, so they can only be got
// by doing the work.
const spendingCredits = S.pageFor('spending', 'month').rows.reduce((sum, r) => sum + r.credit, 0);
export const M16_FIGURES = [
  ['Spending bucket just after the rent check (July 15)', S.balanceAfter('spending', '2026-07-15', 'Rent share, check 215')],
  ['Credit card balance just after the household supplies (July 14)', S.balanceAfter('card', '2026-07-14', 'Household supplies, credit card')],
  ['Total of the Spending bucket\'s Credits column for the month, before the bank items', spendingCredits],
  ['Blow money just after the movie (July 22)', S.balanceAfter('blow', '2026-07-22', 'Movie, debit card, from Blow money')],
].map(([label, answer]) => ({ label, answer }));

export const M16_LESSON = {
  id: 'm16',
  title: 'Final project II: keep, prove and report',
  project: true,
  next: { id: 'a1', title: 'Add-on A1: The Federal Reserve' },
  coreIdea: 'Keep the month you planned. Record every event, post it, prove the books with a trial balance, match them to the bank, compare them with the budget, close the month and report it. When the reports agree, you can say where every dollar went.',
  steps: [
    {
      id: 'record', kind: 'explain', title: 'Record the month', uses: ['journal-entry', 'posting', 'posted-marks', 'source-documents'],
      text: [
        'Record every event in your journal, in date order, from its source document: pay stubs, receipts, checks, bills. Then post each entry to its ledger pages, writing the folio references and the posted ticks.',
        'Riley\'s July is listed beside this step and on the printable sample-month sheet. Here is the first page of Riley\'s journal as a model. Record the rest yourself.',
        `Keep the plan from Module 15: ${money(S.TO_EMERGENCY)} into the Emergency fund after each paycheck, and ${money(S.TO_SINKING)} into the Sinking fund once a month. The July 25 line is both: ${money(S.TO_EMERGENCY)} + ${money(S.TO_SINKING)}.`,
      ],
      prompt: 'Why record from the source documents rather than from memory?',
      promptAnswer: 'The documents show the exact date and amount, so the books match what really happened, and you can check the bank statement against them later.',
      sourceDoc: S.EVENT_DOC,
      journalPage: S.JOURNAL(S.ENTRIES.slice(0, 6), 1),
      printLinks: ['sample-month', 'journal', 'blank'],
    },
    {
      id: 'predict-spending', kind: 'predict', title: 'Check: the Spending bucket', uses: ['posting', 'running-balance'],
      text: ['Once every July event is posted, what does Riley\'s Spending bucket page show on July 31, before the bank statement arrives?'],
      sourceDoc: S.EVENT_DOC,
      answer: SPENDING_MONTH_END,
      misconceptions: [{ cents: SPENDING_MONTH_END + S.OPENING.find(([id]) => id === 'card')[1], explanation: 'The credit card payment came out of the Spending bucket too.' }],
      explanation: `Start with ${money(S.OPENING.find(([id]) => id === 'spending')[1])} brought forward, add both paychecks' shares, and subtract every payment from the bucket: ${money(SPENDING_MONTH_END)}. If your page differs, compare it with Riley's line by line.`,
    },
    {
      id: 'reconcile', kind: 'explain', title: 'Match the bank', uses: ['bank-reconciliation', 'outstanding-items'],
      text: [
        'When the bank statement arrives, tick each of its lines against your books.',
        'Riley finds two things in the books that are not on the statement yet: check 216 for the utilities share, which has not been cashed, and the birthday gift, deposited late on July 31, after the bank had made the statement.',
        'Riley also finds two things on the statement that are not in the books: interest the bank paid, and a fee for using another bank\'s ATM. Reconcile the statement with the pages held at the bank.',
        'Riley keeps the Saving bucket and its two funds in a savings account at the same bank, so one statement covers everything at Desert Bank. The bank paid interest on the savings account.',
      ],
      prompt: 'Why is Cash left out of the bank reconciliation?',
      promptAnswer: 'Cash is in the wallet, not at the bank, so the bank statement cannot show it.',
      sourceDoc: S.STATEMENT,
    },
    {
      id: 'predict-adjusted', kind: 'predict', title: 'Check: the reconciliation', uses: ['bank-reconciliation', 'outstanding-items'],
      text: ['Riley\'s reconciliation has its figures left blank. What is the adjusted bank balance?'],
      sourceDoc: S.STATEMENT,
      report: S.reconciliation({ ask: ['adjusted-bank', 'book', 'adjusted-book', ...S.reconciliation().pages.map((_, i) => `page-${i}`)] }),
      answer: S.ADJUSTED_BANK,
      misconceptions: [{ cents: S.STATEMENT_CLOSING - S.OUTSTANDING.deposits[0].amount + S.OUTSTANDING.payments[0].amount, explanation: 'Add the deposit the statement does not show yet, and subtract the uncashed check.' }],
      explanation: `${money(S.STATEMENT_CLOSING)} + ${money(S.OUTSTANDING.deposits[0].amount)} deposit − ${money(S.OUTSTANDING.payments[0].amount)} check 216 = ${money(S.ADJUSTED_BANK)}. The book side agrees: ${money(S.BOOK_BALANCE)} + ${money(S.INTEREST)} interest − ${money(S.ATM_FEE)} fee = ${money(S.ADJUSTED_BANK)}.`,
    },
    {
      id: 'bank-items', kind: 'explain', title: 'Record what the bank found', uses: ['bank-fee-interest-entries', 'trial-balance'],
      text: [
        'Record the interest and the fee, and post them. Now your books and the bank agree.',
        'Then prove the books. List every page\'s balance in a trial balance. The two columns must have the same total.',
      ],
      prompt: 'Why record the bank\'s interest and fee before the trial balance?',
      promptAnswer: 'They are part of the month. Without them the pages would not match the bank, and the reports would leave them out.',
      journalPage: S.JOURNAL(S.BANK_ENTRIES, 4),
    },
    {
      id: 'predict-trial', kind: 'predict', title: 'Check: the trial balance', uses: ['trial-balance', 'equal-sides'],
      text: ['After the bank items are posted, what is the total of each column of Riley\'s trial balance?'],
      report: hideAll(S.trialBalance()),
      answer: S.TRIAL_BALANCE_TOTAL,
      explanation: `Both columns total ${money(S.TRIAL_BALANCE_TOTAL)}. If yours do not agree, the size of the difference points to the error (Module 9).`,
    },
    {
      id: 'predict-budget', kind: 'predict', title: 'Check: budget and actual', uses: ['budget-vs-actual'],
      text: [`Riley's budget for July totaled ${money(S.BUDGET_TOTAL)}. Compare it with the expense pages. Taken as a whole, by how much did July come in under budget?`],
      report: hideAll(S.budgetActual()),
      answer: UNDER,
      misconceptions: [{ cents: S.ACTUAL_TOTAL, explanation: 'That is the actual spending. Subtract it from the budget.' }],
      explanation: `Budget ${money(S.BUDGET_TOTAL)} − actual ${money(S.ACTUAL_TOTAL)} = ${money(UNDER)} under budget.`,
    },
    {
      id: 'predict-added', kind: 'predict', title: 'Check: the income statement', uses: ['income-statement'],
      text: ['Write the income statement from the trial balance. How much did July add to Riley\'s net worth?'],
      report: hideAll(S.incomeStatement()),
      answer: ADDED,
      misconceptions: [{ cents: S.TOTAL_INCOME, explanation: 'That is total income. Subtract the month\'s expenses, taxes withheld included.' }],
      explanation: `Income ${money(S.TOTAL_INCOME)} − expenses ${money(S.TOTAL_EXPENSES)} = ${money(ADDED)}.`,
    },
    {
      id: 'predict-net-worth', kind: 'predict', title: 'Check: the net-worth statement', uses: ['net-worth-statement'],
      text: ['Write the net-worth statement for July 31. What is Riley\'s net worth?'],
      report: hideAll(S.netWorthStatement()),
      answer: S.NET_WORTH_END,
      misconceptions: [{ cents: S.NET_WORTH_END + 2 * S.balance('card', 'closed'), explanation: 'Riley owes the credit card balance. Subtract it.' }],
      explanation: `What Riley owns minus what Riley owes is ${money(S.NET_WORTH_END)}.`,
    },
    {
      id: 'close', kind: 'explain', title: 'Close the month', uses: ['closing-entries', 'net-worth-statement'],
      text: [
        'Finally, close the income and expense pages into Net worth. Afterward, the Net worth page must show the same figure as the net-worth statement. It must also have grown by what the income statement says the month added.',
        `For Riley, ${money(S.OPENING_NET_WORTH)} at the start plus ${money(ADDED)} added is ${money(S.NET_WORTH_END)}. The books agree from the first entry to the last report.`,
      ],
      prompt: 'What does it prove when the net-worth statement equals the Net worth page after closing?',
      promptAnswer: 'The month\'s books add up from start to finish. What you own minus what you owe matches the record of everything that changed it.',
      journalPage: S.JOURNAL(S.CLOSING_ENTRIES, 4),
      ledger: S.pageFor('net-worth', 'closed'),
      highlightRow: 2,
    },
    {
      id: 'project-check', kind: 'project', title: 'Finish Final project II', uses: [],
      text: ['Check your month against the list below. When every item is ticked, mark the final project complete. Then the add-on modules open, followed by the final exam.'],
      sampleLabel: 'Riley\'s sample month',
      completeLabel: 'Final project II',
      figures: M16_FIGURES,
      checklist: [
        'I recorded every event of the month in my journal in date order, each entry with equal debits and credits.',
        'I posted every entry to its ledger pages, with folio references and posted ticks.',
        'I reconciled my bank pages with the bank statement and recorded the interest and fees it showed.',
        'I wrote a trial balance whose debit and credit columns have the same total.',
        'I compared the month with my budget, line by line.',
        'I closed the income and expense pages into Net worth.',
        'I wrote an income statement and a net-worth statement for the month.',
      ],
      rubric: [
        'My adjusted bank balance equals my adjusted book balance.',
        'My net-worth statement equals my Net worth page after closing.',
        'My Net worth page grew (or fell) by exactly what my income statement says the month added (or took).',
        'With my ledger in front of me, I can say where every dollar of the month went.',
      ],
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
};
