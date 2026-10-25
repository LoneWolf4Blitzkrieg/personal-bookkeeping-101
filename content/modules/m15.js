// Module 15: Final project I: plan your month. No new ideas: the learner
// opens a month's books and plans it, using their own month or the sample
// month (content/sampleMonth.js), where every figure below comes from. There
// is no module check: the last step is the project checklist and rubric.

import { money, chartPage, PAYCHECK_SOURCES } from '../helpers.js';
import * as S from '../sampleMonth.js';

const [PAY1, PAY2] = S.PAYCHECKS;
const SPENDING_IN = PAY1.split.spending + PAY2.split.spending;
const OPENING_SPENDING = S.OPENING.find(([id]) => id === 'spending')[1];
const OPENING_FUND = S.OPENING.find(([id]) => id === 'emergency')[1];
const CARD_DUE = S.OPENING.find(([id]) => id === 'card')[1];
const UNPLANNED = OPENING_SPENDING + SPENDING_IN - S.BUDGET_TOTAL - CARD_DUE;
const FUND_GAP = S.FUND_MINIMUM - (OPENING_FUND + 2 * S.TO_EMERGENCY);
const deductions = (p) => p.gross - p.net;

export const M15_FIGURES = [
  ['Net worth at the start of the month', S.OPENING_NET_WORTH],
  ['Take-home pay from the second paycheck', PAY2.pay.net],
  ['Spending bucket money not yet planned', UNPLANNED],
  ['How far the Emergency fund will still be below its minimum at month-end', FUND_GAP],
].map(([label, answer]) => ({ label, answer }));

export const M15_LESSON = {
  id: 'm15',
  title: 'Final project I: plan your month',
  project: true,
  next: { id: 'm16', title: 'Final project II' },
  coreIdea: 'The final project is one full month of books. In this part, open the books and plan the month: what you own and owe at the start, the pay you expect, the budget, and what goes to your emergency and sinking funds.',
  steps: [
    {
      id: 'project', kind: 'explain', title: 'The final project', uses: ['ledger-columns', 'personal-accounts'],
      text: [
        'You will keep one full month of books from start to finish. In this module you open the books and plan the month. In Module 16 you record it, prove it, match it to the bank and report it.',
        'Choose your month. Use a real month of your own, or the sample month: Riley, 19, who works part-time at a restaurant in Arizona. Riley is fictional. Choose the sample month if you would rather keep your own money private, or if you have no income yet.',
        'Work on paper (print blank sheets below) or in a spreadsheet. You may use a calculator. There is no module check: at the end, a checklist and a rubric show what a finished plan has. If you use the sample month, you also enter a few of its figures, and they must be right.',
        'Riley\'s sample month is the worked example in every step. Work each step yourself first, then compare.',
      ],
      prompt: 'Why keep a whole month, from opening balances to the final reports?',
      promptAnswer: 'Each part checks the others. A whole month shows that every dollar is followed from where it started to where it ended up.',
      printLinks: ['blank', 'journal', 'sample-month'],
    },
    {
      id: 'open', kind: 'explain', title: 'Open the books', uses: ['personal-accounts', 'account-numbers', 'carry-forward'],
      text: [
        'Open a ledger page for every account you will use this month, numbered from the chart of accounts. Each page starts with its balance brought forward from the end of last month. Income and expense pages start at zero, because last month was closed.',
        'Riley\'s pages at the bank: Checking (1), the Spending (2), Saving (3), Investing (4) and Charity (5) buckets, Blow money (6), and the Emergency fund (8) and Sinking fund (9). Riley also has Cash (7) and owes on a Credit card (21).',
        'Then write a net-worth statement for the start of the month. The Net worth page (30) opens with its result.',
      ],
      prompt: 'Why do income and expense pages start the month at zero?',
      promptAnswer: 'Last month was closed: their balances were moved into Net worth, so each starts the new month empty.',
      ledger: chartPage('spending', [['2026-07-01', 'Brought forward', '', OPENING_SPENDING, 0]], { name: S.PERSON }),
      highlightRow: 0,
    },
    {
      id: 'predict-opening', kind: 'predict', title: 'Check: net worth at the start', uses: ['net-worth-statement'],
      text: ['Riley\'s net-worth statement for June 30 has its totals left blank. What is Riley\'s net worth at the start of July?'],
      report: S.openingNetWorthStatement({ ask: ['total-assets', 'total-liabilities', 'net'] }),
      answer: S.OPENING_NET_WORTH,
      misconceptions: [{ cents: S.OPENING_NET_WORTH + 2 * CARD_DUE, explanation: 'The credit card is owed: subtract it.' }],
      explanation: `Assets ${money(S.OPENING_NET_WORTH + CARD_DUE)} − the card ${money(CARD_DUE)} = ${money(S.OPENING_NET_WORTH)}.`,
    },
    {
      id: 'paychecks', kind: 'explain', title: 'The pay you expect', uses: ['gross-vs-net', 'recording-paycheck', 'five-buckets', 'transfers'],
      text: [
        `Riley is paid every two weeks at the Arizona minimum wage of $15.15 an hour. July has two paydays: July 10 for ${PAY1.hours} hours and July 24 for ${PAY2.hours} hours.`,
        'Each paycheck is recorded in two entries. First the pay: debit Checking for the take-home pay, debit Taxes withheld, and credit Wages for the gross pay. Then the split: debit each bucket its share and credit Checking.',
        'Riley uses the course\'s split: Saving 15%, Investing 10%, Charity 5%, Blow money 10%, and the Spending bucket gets what is left.',
      ],
      prompt: 'Why is Wages credited with the gross pay, not the take-home pay?',
      promptAnswer: 'Riley earned the gross pay. The taxes were taken out of it, so they are recorded as an expense, and the take-home pay goes to Checking.',
      sourceDoc: S.payStubs()[0],
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-pay', kind: 'predict', title: 'Check: the second paycheck', uses: ['gross-vs-net', 'paycheck-deductions'],
      text: [`Riley's July 24 paycheck is for ${PAY2.hours} hours at $15.15. What is the take-home pay?`],
      answer: PAY2.pay.net,
      misconceptions: [{ cents: PAY2.pay.gross, explanation: 'That is the gross pay. Take out Social Security, Medicare and both income taxes.' }],
      explanation: `Gross ${money(PAY2.pay.gross)}. Social Security ${money(PAY2.pay.socialSecurity)}, Medicare ${money(PAY2.pay.medicare)}, federal ${money(PAY2.pay.federal)}, Arizona ${money(PAY2.pay.arizona)}: ${money(deductions(PAY2.pay))} in all. Take-home: ${money(PAY2.pay.net)}.`,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-split', kind: 'predict', title: 'Check: the Spending bucket\'s share', uses: ['five-buckets', 'percentages'],
      text: [`The July 10 paycheck brings home ${money(PAY1.pay.net)}. How much of it goes to the Spending bucket?`],
      answer: PAY1.split.spending,
      misconceptions: [{ cents: PAY1.pay.net - PAY1.split.saving, explanation: 'Take out all four shares, not just Saving: Saving, Investing, Charity and Blow money.' }],
      explanation: `Saving ${money(PAY1.split.saving)} + Investing ${money(PAY1.split.investing)} + Charity ${money(PAY1.split.charity)} + Blow money ${money(PAY1.split.blow)} = ${money(PAY1.pay.net - PAY1.split.spending)}. ${money(PAY1.pay.net)} − ${money(PAY1.pay.net - PAY1.split.spending)} = ${money(PAY1.split.spending)}.`,
    },
    {
      id: 'budget', kind: 'explain', title: 'The budget', uses: ['budget-as-ledger', 'spending-rules', 'essential-expenses'],
      text: [
        'Plan the month\'s spending before it happens, needs first. Riley\'s budget covers rent, groceries, the bus pass, the phone, utilities and household supplies, then a little for eating out. Movies and other fun come from Blow money, and donations from the Charity bucket.',
        `Riley also owes ${money(CARD_DUE)} on the credit card from June. Paying it is planned too, but it is not an expense this month: that spending was recorded in June.`,
        `The budget must fit what the Spending bucket will hold: ${money(OPENING_SPENDING)} brought forward, plus its share of both paychecks.`,
      ],
      prompt: 'Why plan the needs first?',
      promptAnswer: 'Needs must be paid to live and work. Planning them first makes sure the money is there before any wants.',
      report: S.budgetPlan(),
    },
    {
      id: 'predict-left', kind: 'predict', title: 'Check: what is not planned yet', uses: ['budget-as-ledger'],
      text: [`The Spending bucket starts July with ${money(OPENING_SPENDING)} and gets ${money(PAY1.split.spending)} and ${money(PAY2.split.spending)} from the two paychecks. After the budget and the ${money(CARD_DUE)} card payment, how much is not planned yet?`],
      report: S.budgetPlan(),
      answer: UNPLANNED,
      misconceptions: [{ cents: UNPLANNED + CARD_DUE, explanation: 'The card payment comes out of the Spending bucket too.' }],
      explanation: `${money(OPENING_SPENDING)} + ${money(PAY1.split.spending)} + ${money(PAY2.split.spending)} = ${money(OPENING_SPENDING + SPENDING_IN)}. Minus the budget ${money(S.BUDGET_TOTAL)} and the card ${money(CARD_DUE)} leaves ${money(UNPLANNED)}.`,
    },
    {
      id: 'funds', kind: 'explain', title: 'The emergency and sinking funds', uses: ['fund-sizing', 'fund-rules', 'sinking-funds'],
      text: [
        `Riley's essential expenses are the budget's needs: ${money(S.ESSENTIAL_MONTH)} a month. The three-month minimum is 3 × ${money(S.ESSENTIAL_MONTH)} = ${money(S.FUND_MINIMUM)}, and the Emergency fund holds ${money(OPENING_FUND)}.`,
        `Riley's plan: move ${money(S.TO_EMERGENCY)} from the Saving bucket into the Emergency fund after each paycheck, until it reaches the minimum.`,
        `Riley's renter's insurance, $180.00 a year, is due in 12 months, so ${money(S.TO_SINKING)} a month goes into the Sinking fund.`,
      ],
      prompt: 'Why does the plan move money into the Emergency fund every paycheck, even though it is far from the minimum?',
      promptAnswer: 'Small regular transfers build the fund steadily, and even part of the minimum gives some security.',
    },
    {
      id: 'predict-gap', kind: 'predict', title: 'Check: the fund at month-end', uses: ['fund-sizing'],
      text: [`After this month's two transfers of ${money(S.TO_EMERGENCY)}, how far below its three-month minimum will Riley's Emergency fund still be?`],
      answer: FUND_GAP,
      misconceptions: [{ cents: S.FUND_MINIMUM - OPENING_FUND, explanation: 'Count both of this month\'s transfers into the fund first.' }],
      explanation: `${money(OPENING_FUND)} + 2 × ${money(S.TO_EMERGENCY)} = ${money(OPENING_FUND + 2 * S.TO_EMERGENCY)}. ${money(S.FUND_MINIMUM)} − ${money(OPENING_FUND + 2 * S.TO_EMERGENCY)} = ${money(FUND_GAP)}.`,
    },
    {
      id: 'project-check', kind: 'project', title: 'Finish Final project I', uses: [],
      text: ['Check your plan against the list below. When every item is ticked, mark this part complete. Module 16 then opens, and you will keep the month you planned.'],
      sampleLabel: 'Riley\'s sample month',
      completeLabel: 'Final project I',
      figures: M15_FIGURES,
      checklist: [
        'I opened a ledger page for every account I will use, each with its number from the chart and its balance brought forward.',
        'I wrote a net-worth statement for the start of the month.',
        'I listed the paychecks I expect, with each one\'s take-home pay and bucket split.',
        'I wrote a budget for the Spending bucket, needs first.',
        'I worked out my essential expenses and my emergency fund\'s three-month minimum, and planned this month\'s transfers to it.',
        'I planned a sinking fund for at least one cost I know is coming.',
      ],
      rubric: [
        'My opening net-worth statement equals what I own minus what I owe, and its figures match the balances brought forward.',
        'My budget\'s total fits what the Spending bucket will hold, with any card payment planned too.',
        'Every figure is worked out from the documents (pay stubs, bills, last month\'s balances), not guessed.',
        'I checked every figure a second time.',
      ],
    },
  ],
  resources: ['cfpb-budget', 'cfpb-emergency-fund'],
};
