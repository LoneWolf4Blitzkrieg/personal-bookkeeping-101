// Module 8: Credit cards and debt. Ideas: card-as-liability, card-entries,
// minimum-payment-cost. The APR is the 2026 national average from the
// Federal Reserve (content/rates2026.js); the minimum-payment rule is an
// example, since every card agreement sets its own. Other amounts are
// illustrative.

import { money, NAMES, explainTemplate, accountOptions, chartPage, journal, monthlyInterest, exactMonthlyInterest, exactPercent, minimumPayment, payoff, MINIMUM_RULE } from '../helpers.js';
import { percentOf } from '../../js/money.js';
import { RATES_2026 } from '../rates2026.js';
import { M04_LESSON } from './m04.js';
import { M06_LESSON } from './m06.js';
import { M07_LESSON, M07_GATE } from './m07.js';

const num = (id, part, params, build) => ({ id, module: 'm08', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const APR = RATES_2026.cardAprBasisPoints;
const APR_TEXT = `${(APR / 100).toFixed(2)}%`;
const APR_DECIMAL = APR / 10000;
const APR_SOURCES = [RATES_2026.cardAprSource];
const yearly = (cents) => exactPercent(cents, APR_DECIMAL);

// --- Question templates -----------------------------------------------------

// The payment is a share of what is owed (30% to 80%, in whole $5), so it
// never clears the balance; the amounts always fit under the $500.00 limit.
const cardBalance = num('m08-card-balance', 'interpreting', {
  start: { min: 5000, max: 30000, step: 1 }, a: { min: 1000, max: 9000, step: 1 }, b: { min: 500, max: 7000, step: 1 }, share: { min: 30, max: 80, step: 1 },
  limit: { pick: [50000, 80000, 100000] }, name: { pick: NAMES },
}, (p) => {
  const owed = p.start + p.a + p.b;
  const pay = Math.floor((owed * p.share) / 100 / 500) * 500;
  return {
    prompt: `${p.name} makes two charges and then a payment on the card. What does the card page show after the payment?`,
    ledger: chartPage('card', [
      ['2026-06-01', 'Brought forward', '', 0, p.start],
      ['2026-06-06', 'Gas', 'J6', 0, p.a, true],
      ['2026-06-12', 'Shoes', 'J6', 0, p.b, true],
      ['2026-06-25', 'Payment', 'J6', pay, 0, true],
    ], { name: p.name, askFrom: 3, creditLimit: p.limit }),
    highlightRow: 3,
    answer: owed - pay,
    misconceptions: [{ cents: owed + pay, explanation: 'A payment lowers what you owe: the card is debited, so subtract.' }],
    explanation: `Charges add to what is owed and the payment takes it down: ${money(p.start)} + ${money(p.a)} + ${money(p.b)} − ${money(pay)} = ${money(owed - pay)}, a credit balance.`,
  };
});

// Works out a month's interest, adds it, then takes off a minimum payment:
// what a learner has to see to understand why a minimum payment costs so much.
const afterMinimum = num('m08-after-minimum', 'interpreting', { balance: { min: 100000, max: 300000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const i = monthlyInterest(p.balance, APR);
  const pay = minimumPayment(p.balance, i);
  const answer = p.balance + i - pay;
  return {
    prompt: `${p.name}'s card balance is ${money(p.balance)} at ${APR_TEXT} APR. This month's interest (balance × APR ÷ 12, rounded to the cent) is added, then ${p.name} pays the minimum of ${money(pay)}. What is owed after the payment?`,
    answer,
    misconceptions: [
      { cents: p.balance - pay, explanation: 'The month\'s interest is added to the balance before the payment comes off.' },
      { cents: p.balance + percentOf(p.balance, APR_DECIMAL) - pay, explanation: 'That adds a whole year\'s interest. One month is the year\'s interest ÷ 12.' },
    ],
    explanation: `Interest: ${money(p.balance)} × ${APR_DECIMAL} ÷ 12 = ${exactMonthlyInterest(p.balance, APR)}, which rounds to ${money(i)}. ${money(p.balance)} + ${money(i)} − ${money(pay)} = ${money(answer)}. Only ${money(p.balance - answer)} of the ${money(pay)} payment lowered what is owed.`,
    sources: APR_SOURCES,
  };
});

const interest = num('m08-interest', 'interpreting', { balance: { min: 10000, max: 300000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const i = monthlyInterest(p.balance, APR);
  return {
    prompt: `${p.name}'s card balance is ${money(p.balance)} and the APR is ${APR_TEXT}. Using balance × APR ÷ 12, how much interest is charged for one month? Round to the cent.`,
    answer: i,
    misconceptions: [{ cents: percentOf(p.balance, APR_DECIMAL), explanation: 'That is a whole year\'s interest. Divide by 12 for one month.' }],
    explanation: `${money(p.balance)} × ${APR_DECIMAL} = ${yearly(p.balance)} a year. ÷ 12 = ${exactMonthlyInterest(p.balance, APR)}, which rounds to ${money(i)}.`,
    sources: APR_SOURCES,
  };
});

const CARD_ACCOUNTS = accountOptions(['spending', 'card', 'card-interest', 'groceries', 'eating-out', 'transport']);
const CHARGES = [['groceries', 'groceries'], ['eating-out', 'a meal out'], ['transport', 'gas for the car']];
const CARD_EVENTS = {
  charge: (p) => {
    const [account, words] = CHARGES[p.what];
    return {
      prompt: `Write the journal entry: you buy ${words} for ${money(p.amount)} with your credit card.`,
      answer: [{ account, debit: p.amount, credit: 0 }, { account: 'card', debit: 0, credit: p.amount }],
      explanation: 'The expense is debited. Credit card (a liability) goes up because you now owe more, so it is credited. No bucket changes yet.',
    };
  },
  payment: (p) => ({
    prompt: `Write the journal entry: you pay ${money(p.amount)} to your credit card company from the Spending bucket.`,
    answer: [{ account: 'card', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Credit card (a liability) goes down because you owe less, so it is debited. The Spending bucket (an asset) goes down, so it is credited.',
  }),
  interest: (p) => ({
    prompt: `Write the journal entry: your card statement charges ${money(p.amount)} of interest.`,
    answer: [{ account: 'card-interest', debit: p.amount, credit: 0 }, { account: 'card', debit: 0, credit: p.amount }],
    explanation: 'Card interest (an expense) is debited. It adds to what you owe, so Credit card is credited.',
  }),
};
const recordCard = {
  id: 'm08-record-card', module: 'm08', kind: 'entry', part: 'producing', points: 4,
  // Each gate version gets a scenario: a charge, a payment, interest, then another charge.
  params: { amount: { min: 500, max: 15000, step: 1 }, what: { pick: [0, 1, 2] }, event: { byVersion: ['charge', 'payment', 'interest', 'charge'] } },
  build: (p) => ({ accounts: CARD_ACCOUNTS, ...CARD_EVENTS[p.event](p) }),
};

const explainCard = explainTemplate({
  id: 'm08-explain', module: 'm08',
  variants: [
    { prompt: 'In one or two sentences: why does paying only the minimum take so long to clear a card balance?',
      modelAnswer: 'Most of each minimum payment goes to the month\'s interest. Only a small part, about 1% of the balance, lowers what you owe.',
      rubric: ['Says most of the payment goes to interest', 'Says only a small part lowers the balance (what you owe)'] },
    { prompt: 'In one or two sentences: why does the credit card page normally have a credit balance?',
      modelAnswer: 'The card is a liability, money you owe. Liabilities go up with a credit, and each charge adds to what you owe.',
      rubric: ['Says the card is a liability (money you owe)', 'Says liabilities go up with a credit, so charges are credits'] },
    { prompt: 'In one or two sentences: why does paying the full statement balance by the due date save money?',
      modelAnswer: 'Most cards charge no interest on purchases when the whole statement balance is paid by the due date, so nothing extra is added to what you owe.',
      rubric: ['Says paying in full by the due date usually means no interest on purchases', 'Says so nothing is added to what you owe (no Card interest expense)'] },
    { prompt: 'In one or two sentences: a card has a $1,000.00 credit limit. Why is that not $1,000.00 you have?',
      modelAnswer: 'The limit is how much you may borrow. Every dollar you use is owed back, so it raises your liabilities, not your assets.',
      rubric: ['Says the limit is borrowing (money you would owe)', 'Says using it adds a liability, not an asset (it must be paid back)'] },
  ],
});

const available = num('m08-available', 'interpreting', { limit: { pick: [50000, 75000, 100000, 150000] }, owed: { min: 2000, max: 45000, step: 1 } }, (p) => ({
  prompt: `A card has a credit limit of ${money(p.limit)} and a balance owed of ${money(p.owed)}. How much available credit is left?`,
  answer: p.limit - p.owed,
  misconceptions: [{ cents: p.limit + p.owed, explanation: 'Available credit is the limit minus what you already owe.' }],
  explanation: `${money(p.limit)} − ${money(p.owed)} = ${money(p.limit - p.owed)}.`,
}));

const minimum = num('m08-minimum', 'interpreting', { balance: { min: 150000, max: 400000, step: 1 } }, (p) => {
  const i = monthlyInterest(p.balance, APR);
  const pay = minimumPayment(p.balance, i);
  return {
    prompt: `The example rule sets the minimum payment as ${MINIMUM_RULE}. The balance is ${money(p.balance)} and this month's interest is ${money(i)}. What is the minimum payment?`,
    answer: pay,
    misconceptions: [{ cents: percentOf(p.balance, 0.01), explanation: 'The minimum is the interest plus 1% of the balance.' }],
    explanation: `${money(i)} + 1% of ${money(p.balance)} (${money(percentOf(p.balance, 0.01))}) = ${money(pay)}.`,
  };
});

// Completion: a month on the card page.
const cardMonth = {
  id: 'm08-card-month', module: 'm08', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 80000, step: 1 }, a: { min: 1000, max: 8000, step: 1 }, b: { min: 500, max: 5000, step: 1 }, pay: { min: 10000, max: 20000, step: 500 }, name: { pick: NAMES } },
  build: (p) => {
    const i = monthlyInterest(p.start, APR);
    const moves = [[0, i], [0, p.a], [0, p.b], [p.pay, 0]];
    let owed = p.start;
    const balances = moves.map(([dr, cr]) => (owed += cr - dr));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s credit card page.`,
      ledger: chartPage('card', [
        ['2026-07-01', 'Brought forward', '', 0, p.start],
        ['2026-07-01', 'Interest', 'J7', 0, i, true],
        ['2026-07-03', 'Groceries', 'J7', 0, p.a, true],
        ['2026-07-08', 'Eating out', 'J7', 0, p.b, true],
        ['2026-07-20', 'Payment', 'J7', p.pay, 0, true],
      ], { name: p.name, askFrom: 1, creditLimit: 100000 }),
      fields: balances.map((answer, k) => ({ label: `Balance after line ${k + 2}`, answer })),
      explanation: `Interest and charges are credits that raise what is owed. The payment is a debit that lowers it. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

// --- Lesson -------------------------------------------------------------------

const minOnly = payoff(100000, APR);
const hundred = payoff(100000, APR, { payment: 10000 });
const [m1, m2] = minOnly.rows;
const i1500 = monthlyInterest(150000, APR);
const min1500 = minimumPayment(150000, i1500);
const after1500 = 150000 + i1500 - min1500;

export const M08_LESSON = {
  id: 'm08',
  title: 'Credit cards and debt',
  coreIdea: 'A credit card is a liability: charges and interest are credits that raise what you owe, and payments are debits that lower it. Paying only the minimum makes a debt last years and cost far more.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['recording-purchases'],
      text: ['From Module 7: the Spending bucket shows $300.00. You pay $54.20 for groceries by debit card. What does it show now?'],
      answer: 24580,
      misconceptions: [{ cents: 35420, explanation: 'The Spending bucket paid, so it is credited: subtract.' }],
      explanation: '$300.00 − $54.20 = $245.80.',
    },
    {
      id: 'liability', kind: 'explain', title: 'A card is money you owe', uses: ['card-as-liability', 'debit-credit-rules'],
      text: [
        'A credit card lets you buy now and pay the card company later. Every charge is money you owe, so the card is a liability: account 21 in the chart. Its page normally has a credit balance, the amount you owe.',
        'The header shows the credit limit: the most the card company lets you owe. Available credit is the limit minus the balance. A limit is not money you have. Every dollar of it that you use must be paid back.',
      ],
      prompt: 'Why does the credit card page normally have a credit balance?',
      promptAnswer: 'It is a liability, money you owe, and liabilities go up with a credit. Each charge adds to what you owe.',
      ledger: chartPage('card', [['2026-06-04', 'Groceries', 'J5', 0, 3680, true], ['2026-06-09', 'Eating out', 'J5', 0, 1225, true]], { creditLimit: 50000 }),
      highlightRow: 1,
    },
    {
      id: 'predict-available', kind: 'predict', title: 'Predict: available credit', uses: ['card-as-liability'],
      text: ['The card page shows the credit limit and the balance owed. How much available credit is left?'],
      ledger: chartPage('card', [['2026-06-04', 'Groceries', 'J5', 0, 3680, true], ['2026-06-09', 'Eating out', 'J5', 0, 1225, true]], { creditLimit: 50000 }),
      highlightRow: 1,
      answer: 45095,
      misconceptions: [{ cents: 54905, explanation: 'Available credit is the limit minus what you owe.' }],
      explanation: '$500.00 − $49.05 = $450.95.',
    },
    {
      id: 'entries', kind: 'explain', title: 'Charges and payments', uses: ['card-entries', 'recording-purchases'],
      text: [
        'A charge: debit the expense and credit Credit card. A payment: debit Credit card, because you owe less, and credit the bucket you pay from, usually the Spending bucket.',
        'A charge does not touch any bucket. So treat it as money already spent: keep enough in the Spending bucket to pay the card in full.',
        'Most cards give a grace period: the time between the end of the billing month and the payment due date. If you pay the whole statement balance by the due date, you usually pay no interest on purchases.',
      ],
      prompt: 'You pay $49.05 to the card from the Spending bucket. Which two pages change, and how?',
      promptAnswer: 'Credit card is debited, so you owe $49.05 less. The Spending bucket is credited, so it holds $49.05 less.',
      journalPage: journal([
        ['2026-06-04', 'J5', 'Groceries on the card', [['groceries', 3680, 0, true], ['card', 0, 3680, true]]],
        ['2026-06-09', 'J5', 'Eating out on the card', [['eating-out', 1225, 0, true], ['card', 0, 1225, true]]],
        ['2026-06-25', 'J5', 'Card payment', [['card', 4905, 0, true], ['spending', 0, 4905, true]]],
      ], { sheetNo: 5 }),
      highlightEntry: 2,
      ledger: chartPage('card', [['2026-06-04', 'Groceries', 'J5', 0, 3680, true], ['2026-06-09', 'Eating out', 'J5', 0, 1225, true], ['2026-06-25', 'Payment', 'J5', 4905, 0, true]], { creditLimit: 50000 }),
      highlightRow: 2,
      sources: ['cfpb-grace-period'],
    },
    {
      id: 'predict-payment', kind: 'predict', title: 'Predict: after a payment', uses: ['card-entries'],
      text: ['Kai pays $150.00 toward his card. What does the card page show after the payment?'],
      ledger: chartPage('card', [
        ['2026-06-01', 'Brought forward', '', 0, 21000],
        ['2026-06-06', 'Gas', 'J6', 0, 3840, true],
        ['2026-06-12', 'Shoes', 'J6', 0, 5499, true],
        ['2026-06-25', 'Payment', 'J6', 15000, 0, true],
      ], { name: 'Kai (example)', askFrom: 3, creditLimit: 80000 }),
      highlightRow: 3,
      answer: 15339,
      misconceptions: [{ cents: 45339, explanation: 'A payment is a debit: it lowers what you owe.' }],
      explanation: '$303.39 owed − $150.00 = $153.39, still a credit balance.',
    },
    {
      id: 'interest', kind: 'explain', title: 'Interest', uses: ['card-entries', 'percentages'],
      text: [
        `If you do not pay the whole balance, the card company charges interest on what is left. Card interest is stated as an APR, a yearly rate. In the second quarter of 2026, the average rate on credit card accounts that were charged interest was ${APR_TEXT} (Federal Reserve).`,
        `A month's interest is about balance × APR ÷ 12. On a $500.00 balance: $500.00 × ${APR_DECIMAL} = ${yearly(50000)} a year, and ${yearly(50000)} ÷ 12 = ${exactMonthlyInterest(50000, APR)} a month, which rounds to ${money(monthlyInterest(50000, APR))}. Some card companies work it out day by day instead, with a daily rate (the APR divided by 360 or 365), so the real amount can differ a little.`,
        'Interest is recorded like a charge: debit Card interest (58, an expense) and credit Credit card. It adds to what you owe.',
      ],
      prompt: 'Why is card interest debited to an expense page?',
      promptAnswer: 'It is the price of borrowing: money used up that buys nothing you keep, so it is an expense. It also adds to what you owe, so the card is credited.',
      ledger: chartPage('card', [['2026-07-01', 'Brought forward', '', 0, 50000], ['2026-07-01', 'Interest', 'J7', 0, monthlyInterest(50000, APR), true]], { creditLimit: 100000 }),
      highlightRow: 1,
      sources: [...APR_SOURCES, 'cfpb-apr', 'cfpb-daily-rate'],
    },
    {
      id: 'predict-interest', kind: 'predict', title: 'Predict: a month\'s interest', uses: ['card-entries', 'percentages'],
      text: [`Your card balance is $800.00 and the APR is ${APR_TEXT}. Using balance × APR ÷ 12, how much interest is charged for one month? Round to the cent.`],
      answer: monthlyInterest(80000, APR),
      misconceptions: [{ cents: percentOf(80000, APR_DECIMAL), explanation: 'That is a whole year\'s interest. Divide by 12 for one month.' }],
      explanation: `$800.00 × ${APR_DECIMAL} = ${yearly(80000)} a year. ÷ 12 = ${exactMonthlyInterest(80000, APR)}, and the thousandths digit is 6, so it rounds up to ${money(monthlyInterest(80000, APR))}.`,
      sources: APR_SOURCES,
    },
    {
      id: 'minimum', kind: 'explain', title: 'The cost of the minimum payment', uses: ['minimum-payment-cost', 'card-entries'],
      text: [
        `Each card statement shows a minimum payment: the least you must pay that month. Each card agreement sets its own rule. This course uses an example rule: ${MINIMUM_RULE}.`,
        `On a $1,000.00 balance, the month's interest is ${money(m1.interest)}, so the minimum is ${money(m1.interest)} + $10.00 = ${money(m1.payment)}. Only $10.00 of the payment lowers what you owe. The rest pays the interest.`,
        `Paying only the minimum, with no new charges, this card takes ${minOnly.months} months (about ${Math.round(minOnly.months / 12)} years) to pay off and costs ${money(minOnly.interest)} in interest. Paying $100.00 a month takes ${hundred.months} months and costs ${money(hundred.interest)}. The course worked these out month by month with the example rule.`,
        'By law, card statements show a "Minimum Payment Warning": how long paying only the minimum would take, and how much to pay each month to clear the balance in three years.',
      ],
      prompt: 'Why does the balance fall so slowly when you pay only the minimum?',
      promptAnswer: 'Most of each payment goes to interest. Only about 1% of the balance goes to paying down what you owe each month.',
      ledger: chartPage('card', [
        ['2026-07-01', 'Brought forward', '', 0, 100000],
        ['2026-07-01', 'Interest', 'J7', 0, m1.interest, true],
        ['2026-07-15', 'Minimum payment', 'J7', m1.payment, 0, true],
        ['2026-08-01', 'Interest', 'J8', 0, m2.interest, true],
        ['2026-08-15', 'Minimum payment', 'J8', m2.payment, 0, true],
      ], { creditLimit: 150000 }),
      highlightRow: 4,
      sources: [...APR_SOURCES, 'cfpb-minimum-warning'],
    },
    {
      id: 'predict-principal', kind: 'predict', title: 'Predict: after a minimum payment', uses: ['minimum-payment-cost', 'card-entries'],
      text: [`Your card balance is $1,500.00. This month's interest of ${money(i1500)} is added, and you pay the minimum of ${money(min1500)}. What do you owe after the payment?`],
      answer: after1500,
      misconceptions: [{ cents: 150000 - min1500, explanation: 'The interest is added to the balance before the payment comes off.' }],
      explanation: `$1,500.00 + ${money(i1500)} − ${money(min1500)} = ${money(after1500)}. A payment of ${money(min1500)} lowered the debt by only ${money(150000 - after1500)}.`,
      sources: APR_SOURCES,
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['card-entries', 'percentages'],
      text: [`Work out one month's interest on a $620.00 balance at ${APR_TEXT}. Step 1 is done: $620.00 × ${APR_DECIMAL} = ${yearly(62000)} a year. Finish Steps 2 and 3: divide by 12, then round to the cent.`],
      answer: monthlyInterest(62000, APR),
      misconceptions: [{ cents: percentOf(62000, APR_DECIMAL), explanation: 'That is the year\'s interest. Divide it by 12.' }],
      explanation: `${yearly(62000)} ÷ 12 = ${exactMonthlyInterest(62000, APR)}, which rounds to ${money(monthlyInterest(62000, APR))}.`,
      sources: APR_SOURCES,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['card-entries', 'card-as-liability'],
      text: ['Ana\'s card page shows a credit balance of $240.00. She charges $35.60 and $18.25, then pays $150.00 from her Spending bucket. What does the card page show now?'],
      answer: 14385,
      misconceptions: [{ cents: 44385, explanation: 'The payment is a debit that lowers what she owes.' }],
      explanation: '$240.00 + $35.60 + $18.25 − $150.00 = $143.85, a credit balance.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['card-entries', 'percentages'],
      text: [`A card balance is $350.00 at ${APR_TEXT} APR. Using balance × APR ÷ 12, how much is one month's interest?`],
      answer: monthlyInterest(35000, APR),
      misconceptions: [{ cents: percentOf(35000, APR_DECIMAL), explanation: 'That is a year\'s interest. Divide by 12.' }],
      explanation: `$350.00 × ${APR_DECIMAL} = ${yearly(35000)} a year. ÷ 12 = ${exactMonthlyInterest(35000, APR)}, which rounds to ${money(monthlyInterest(35000, APR))}.`,
      sources: APR_SOURCES,
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['minimum-payment-cost'],
      text: [`With the example rule (${MINIMUM_RULE}), what is the minimum payment on a $2,000.00 balance when this month's interest is ${money(monthlyInterest(200000, APR))}?`],
      answer: minimumPayment(200000, monthlyInterest(200000, APR)),
      misconceptions: [{ cents: 2000, explanation: 'The minimum is the interest plus 1% of the balance.' }],
      explanation: `${money(monthlyInterest(200000, APR))} + $20.00 (1% of $2,000.00) = ${money(minimumPayment(200000, monthlyInterest(200000, APR)))}.`,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['card-as-liability'],
      text: ['A card has a credit limit of $1,000.00 and a balance owed of $412.30. How much available credit is left?'],
      answer: 58770,
      misconceptions: [{ cents: 141230, explanation: 'Available credit is the limit minus what you owe.' }],
      explanation: '$1,000.00 − $412.30 = $587.70.',
    },
  ],
  resources: ['cfpb-credit-cards', 'cfpb-minimum-payments', 'cfpb-card-statement'],
  recallTemplates: [cardBalance, interest].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M08_GATE = { id: 'm08', kind: 'gate', title: 'Module 8 check', templates: [cardBalance, afterMinimum, recordCard, explainCard] };

// Fluency drill on the core operation: a charge raises what is owed.
const drill = [1, 2, 3].map((n) => num(`m08-drill-${n}`, 'interpreting', { a: { min: 2000, max: 60000, step: 1 }, b: { min: 300, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the card page shows a credit balance of ${money(p.a)}. A ${money(p.b)} charge is posted. New balance?`, answer: p.a + p.b,
  misconceptions: [{ cents: p.a - p.b, explanation: 'A charge is a credit to the card, because you owe more.' }],
  explanation: `A charge adds to what you owe: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

const recordPurchaseMixed = { ...M07_GATE.templates.find((t) => t.part === 'producing'), id: 'm07-record-purchase-mixed-m08' };

export const M08_PRACTICE = {
  id: 'm08-practice', kind: 'practice', module: 'm08', title: 'Module 8 practice set',
  templates: [...M07_LESSON.recallTemplates, ...M06_LESSON.recallTemplates, ...M04_LESSON.recallTemplates, ...drill, cardBalance, interest, afterMinimum, available, minimum, cardMonth, recordCard, recordPurchaseMixed, { ...explainCard, id: 'm08-explain-practice' }],
};

export const M08_EXTRA = {
  id: 'm08-extra', kind: 'practice', module: 'm08', title: 'Module 8 extra practice',
  templates: [cardBalance, interest, recordCard].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M08_REMEDIAL = {
  id: 'm08-remedial', kind: 'practice', module: 'm08', title: 'Module 8: common mistakes',
  templates: [available, minimum, recordCard].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint B draws from this module.
export const M08_CHECKPOINT = [cardBalance, afterMinimum, interest, recordCard, explainCard];
