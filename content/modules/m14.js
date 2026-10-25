// Module 14: Planning ahead. Ideas: buying-power, compound-interest,
// sinking-funds. Rates are the real 2026 figures (content/rates2026.js):
// inflation 3.7% (BLS, 12 months to September 2026), average savings 0.38% and
// 12-month CD 1.76% (FDIC, October 2026). Interest is worked out once a year
// on a 12-month CD that is renewed, and rounded by the thousandths rule. The
// Sinking fund (9) is a named sub-page of the Saving bucket. Everyday amounts
// are illustrative.

import { percentOf } from '../../js/money.js';
import { money, NAMES, explainTemplate, accountOptions, chartPage, journal } from '../helpers.js';
import { RATES_2026 } from '../rates2026.js';
import { M10_LESSON } from './m10.js';
import { M12_LESSON } from './m12.js';
import { M13_LESSON, M13_GATE } from './m13.js';

const num = (id, part, params, build) => ({ id, module: 'm14', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const rate = (bp) => bp / 10000;
const INFLATION = rate(RATES_2026.inflationBasisPoints);
const SAVINGS = rate(RATES_2026.savingsRateBasisPoints);
const CD = rate(RATES_2026.cdRateBasisPoints);
const INFLATION_SOURCE = RATES_2026.inflationSource;
const DEPOSIT_SOURCE = RATES_2026.depositRatesSource;
const priceAfter = (cents) => cents + percentOf(cents, INFLATION);
const yearOn = (cents) => cents + percentOf(cents, CD);

// A Saving bucket page holding a 12-month CD: brought forward, then a line of
// interest each year it is renewed.
function cdPage(name, opening, years, opts = {}) {
  const rows = [['2026-10-01', 'Brought forward (12-month CD)', '', opening, 0]];
  let balance = opening;
  for (let y = 1; y <= years; y++) {
    const interest = percentOf(balance, CD);
    rows.push([`${2026 + y}-10-01`, `CD interest, year ${y}`, `J${y}`, interest, 0, true]);
    balance += interest;
  }
  return chartPage('saving', rows, { name, ...opts });
}

// --- Question templates -----------------------------------------------------

const priceRise = num('m14-price-after', 'interpreting', { price: { min: 2000, max: 90000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `Prices rose 3.7% over the past year (the Consumer Price Index, to September 2026). Something ${p.name} bought a year ago for ${money(p.price)} rose by that much. What does it cost now?`,
  source: INFLATION_SOURCE,
  answer: priceAfter(p.price),
  misconceptions: [{ cents: percentOf(p.price, INFLATION), explanation: 'That is the increase alone. Add it to the old price.' }],
  explanation: `3.7% of ${money(p.price)} is ${money(percentOf(p.price, INFLATION))} (rounded to the cent). ${money(p.price)} + ${money(percentOf(p.price, INFLATION))} = ${money(priceAfter(p.price))}.`,
}));

const cashShort = num('m14-cash-short', 'interpreting', { cash: { min: 60000, max: 200000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const rise = percentOf(p.cash, INFLATION);
  return {
    prompt: `${p.name} kept ${money(p.cash)} in cash in a safe for a year. A year ago it would have bought a month of groceries and bills. Since then, those prices rose 3.7%. How far short of buying the same things is the cash now?`,
    source: INFLATION_SOURCE,
    answer: rise,
    misconceptions: [{ cents: p.cash + rise, explanation: 'That is the new price. The shortfall is the new price minus the cash.' }],
    explanation: `The same things now cost ${money(p.cash)} + 3.7% = ${money(p.cash + rise)}. The cash is still ${money(p.cash)}, so it is ${money(rise)} short.`,
  };
});

const savingShort = num('m14-saving-short', 'interpreting', { saved: { min: 20000, max: 300000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const interest = percentOf(p.saved, SAVINGS);
  const rise = percentOf(p.saved, INFLATION);
  return {
    prompt: `${p.name} kept ${money(p.saved)} for a year in a savings account paying the 2026 average, 0.38% a year. Prices rose 3.7% over the same year. After the interest is added, how much short of last year's buying power is ${p.name}?`,
    sources: [INFLATION_SOURCE, DEPOSIT_SOURCE],
    answer: rise - interest,
    misconceptions: [{ cents: rise, explanation: 'The account paid interest. Subtract it, because the savings fell behind by less than cash would.' }],
    explanation: `Interest: 0.38% of ${money(p.saved)} = ${money(interest)}, so the account holds ${money(p.saved + interest)}. Prices: ${money(p.saved)} + 3.7% = ${money(p.saved + rise)}. Short: ${money(p.saved + rise)} − ${money(p.saved + interest)} = ${money(rise - interest)}.`,
  };
});

const secondYear = num('m14-second-year', 'interpreting', { amount: { min: 30000, max: 400000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const first = percentOf(p.amount, CD);
  const second = percentOf(p.amount + first, CD);
  return {
    prompt: `${p.name} puts ${money(p.amount)} in a 12-month CD at the October 2026 average rate, 1.76% a year, and renews it, interest and all, for a second year. How much interest does the second year earn?`,
    source: DEPOSIT_SOURCE,
    answer: second,
    misconceptions: [{ cents: first, explanation: 'That is the first year\'s interest. The second year earns interest on the larger balance, including the first year\'s interest.' }],
    explanation: `Year 1: 1.76% of ${money(p.amount)} = ${money(first)}, so the balance is ${money(p.amount + first)}. Year 2: 1.76% of ${money(p.amount + first)} = ${money(second)}.`,
  };
});

const cdBalance = num('m14-cd-balance', 'interpreting', { amount: { min: 30000, max: 400000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const answer = yearOn(yearOn(p.amount));
  return {
    prompt: `${p.name}'s Saving bucket holds a 12-month CD at 1.76% a year, renewed each year. The interest for year 2 is on the page. What does the page show after it?`,
    source: DEPOSIT_SOURCE,
    ledger: cdPage(p.name, p.amount, 2, { askFrom: 2 }),
    highlightRow: 2,
    answer,
    misconceptions: [{ cents: p.amount + 2 * percentOf(p.amount, CD), explanation: 'Year 2 earns 1.76% of the larger balance, so add the interest line on the page, not the year 1 amount again.' }],
    explanation: `${money(yearOn(p.amount))} + ${money(answer - yearOn(p.amount))} = ${money(answer)}.`,
  };
});

// A known cost, divided into equal monthly amounts (built from whole cents
// per month, so it divides exactly). The bill comes to $72.00–$360.00.
const sinkingMonthly = num('m14-sinking-monthly', 'interpreting', { per: { min: 1200, max: 3000, step: 1 }, months: { pick: [6, 8, 9, 10, 12] }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s yearly renter's insurance bill of ${money(p.per * p.months)} is due in ${p.months} months. How much should ${p.name} move into the Sinking fund each month to have it ready?`,
  answer: p.per,
  misconceptions: [{ cents: p.per * p.months, explanation: 'That is the whole bill. Share it equally across the months until it is due.' }],
  explanation: `${money(p.per * p.months)} ÷ ${p.months} = ${money(p.per)} a month.`,
}));

// The phone always costs less than what was set aside, so something is left.
const sinkingLeft = num('m14-sinking-left', 'interpreting', { opening: { min: 100, max: 6000, step: 1 }, per: { min: 2000, max: 6000, step: 1 }, left: { min: 100, max: 2500, step: 1 }, name: { pick: NAMES } }, (p) => {
  const saved = p.opening + 3 * p.per;
  const bill = saved - p.left;
  return {
    prompt: `${p.name} saved for a new phone on the Sinking fund page, then bought it. What does the page show after the last line?`,
    ledger: chartPage('sinking', [
      ['2026-08-01', 'Brought forward', '', p.opening, 0], ['2026-08-07', 'From Saving bucket', 'J2', p.per, 0, true], ['2026-09-07', 'From Saving bucket', 'J5', p.per, 0, true],
      ['2026-10-07', 'From Saving bucket', 'J8', p.per, 0, true], ['2026-10-15', 'New phone', 'J9', 0, bill, true],
    ], { name: p.name, askFrom: 4 }),
    highlightRow: 4,
    answer: p.left,
    misconceptions: [{ cents: saved + bill, explanation: 'Paying the bill is a credit to the Sinking fund: subtract it.' }],
    explanation: `${money(saved)} saved − ${money(bill)} paid = ${money(p.left)}.`,
  };
});

const RECORD_ACCOUNTS = accountOptions(['sinking', 'emergency', 'saving', 'spending', 'insurance', 'phone', 'interest-earned']);
const RECORD_EVENTS = {
  'set-aside': (p) => ({
    prompt: `${p.name} moves ${money(p.amount)} from the Saving bucket into the Sinking fund for next year's renter's insurance. Record the entry.`,
    answer: [{ account: 'sinking', debit: p.amount, credit: 0 }, { account: 'saving', debit: 0, credit: p.amount }],
    explanation: 'A transfer between your own pages: debit the Sinking fund, which receives, and credit the Saving bucket, which gives.',
  }),
  'pay-bill': (p) => ({
    prompt: `The yearly renter's insurance bill of ${money(p.amount)} arrives, and ${p.name} pays it from the Sinking fund. Record the entry.`,
    answer: [{ account: 'insurance', debit: p.amount, credit: 0 }, { account: 'sinking', debit: 0, credit: p.amount }],
    explanation: 'The bill is an insurance expense, so debit it. The money set aside for it pays the bill, so credit the Sinking fund.',
  }),
  'cd-interest': (p) => ({
    prompt: `${p.name}'s 12-month CD, held in the Saving bucket, pays ${money(p.amount)} of interest when it renews. Record the entry.`,
    answer: [{ account: 'saving', debit: p.amount, credit: 0 }, { account: 'interest-earned', debit: 0, credit: p.amount }],
    explanation: 'The Saving bucket grows, so debit it. Interest is income, so credit Interest earned.',
  }),
  'new-phone': (p) => ({
    prompt: `${p.name} saved for a new phone in the Sinking fund. The phone costs ${money(p.amount)}, paid from it. Record the entry.`,
    answer: [{ account: 'phone', debit: p.amount, credit: 0 }, { account: 'sinking', debit: 0, credit: p.amount }],
    explanation: 'A new phone is recorded on the Phone expense page, so debit it. Credit the Sinking fund, which saved for it.',
  }),
};
const recordPlan = {
  id: 'm14-record-plan', module: 'm14', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 6000, max: 40000, step: 1 }, name: { pick: NAMES }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

// Production: two years of a renewed CD, interest rounded each year.
const growthTable = {
  id: 'm14-growth-table', module: 'm14', kind: 'amounts', part: 'producing', points: 4,
  params: { amount: { min: 30000, max: 500000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const i1 = percentOf(p.amount, CD);
    const b1 = p.amount + i1;
    const i2 = percentOf(b1, CD);
    return {
      prompt: `${p.name} puts ${money(p.amount)} in a 12-month CD at 1.76% a year (the October 2026 average) and renews it, interest and all, for a second year. Work out each year. Round each year's interest to the cent.`,
      source: DEPOSIT_SOURCE,
      fields: [['Interest, year 1', i1], ['Balance after year 1', b1], ['Interest, year 2', i2], ['Balance after year 2', b1 + i2]].map(([label, answer]) => ({ label, answer })),
      explanation: `Year 1: 1.76% of ${money(p.amount)} = ${money(i1)}; balance ${money(b1)}. Year 2: 1.76% of ${money(b1)} = ${money(i2)}; balance ${money(b1 + i2)}.`,
    };
  },
};

const explainPlanning = explainTemplate({
  id: 'm14-explain', module: 'm14',
  variants: [
    { prompt: 'In one or two sentences: why does cash kept in a safe lose buying power?',
      modelAnswer: 'The cash stays the same while prices rise, so each year the same cash buys less.',
      rubric: ['Says the cash amount stays the same', 'Says prices rise (inflation), so it buys less'] },
    { prompt: 'In one or two sentences: why does the second year of a renewed CD earn more interest than the first?',
      modelAnswer: 'The first year\'s interest is added to the balance, so the second year earns interest on a larger amount: interest on interest.',
      rubric: ['Says the first year\'s interest is added to the balance', 'Says the second year earns interest on the larger amount (interest on interest)'] },
    { prompt: 'In one or two sentences: how is a sinking fund different from an emergency fund?',
      modelAnswer: 'A sinking fund saves for a cost you know is coming, such as a yearly bill. An emergency fund is for unplanned costs you cannot put off.',
      rubric: ['Says a sinking fund is for a known, planned cost', 'Says an emergency fund is for unplanned costs'] },
    { prompt: 'In one or two sentences: why save a little each month for a yearly bill instead of paying it when it comes?',
      modelAnswer: 'Small monthly amounts fit the budget. When the bill arrives, the money is already there, so it does not empty the Spending bucket or the emergency fund.',
      rubric: ['Says small monthly amounts fit the budget', 'Says the money is ready when the bill comes (no raid on other money)'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

const ELI_CD = 100000;
const insuranceJournal = journal([
  ['2026-11-07', 'J2', 'Set aside for renter\'s insurance (due next October)', [['sinking', 1500, 0, true], ['saving', 0, 1500, true]]],
  ['2027-10-15', 'J30', 'Yearly renter\'s insurance, paid from the Sinking fund', [['insurance', 18000, 0, true], ['sinking', 0, 18000, true]]],
], { sheetNo: 2, name: 'Eli (example)' });

export const M14_LESSON = {
  id: 'm14',
  title: 'Planning ahead',
  coreIdea: 'Rising prices shrink what money can buy. Interest that is left to grow earns interest of its own. A sinking fund saves a set amount each month for a cost you know is coming.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['fund-sizing'],
      text: ['From Module 13: essential expenses are $820.00 a month. What is the three-month minimum for the emergency fund?'],
      answer: 246000,
      misconceptions: [{ cents: 82000, explanation: 'Multiply by three.' }],
      explanation: '3 × $820.00 = $2,460.00.',
    },
    {
      id: 'buying-power', kind: 'explain', title: 'Buying power', uses: ['buying-power', 'percentages'],
      text: [
        'Buying power is what your money can buy. When prices rise, each dollar buys a little less. Rising prices are called inflation. In the 12 months to September 2026, prices rose 3.7% (the Consumer Price Index).',
        'Groceries that cost $250.00 a year ago now cost $250.00 + 3.7% = $259.25. Cash kept in a safe is still $250.00, so it is $9.25 short of buying them.',
        'In a savings account paying the October 2026 average, 0.38% a year, the $250.00 grows to $250.95. It is still short, by $8.30. Money that earns less than inflation loses buying power, just more slowly than cash. To keep up, the rate has to be at least the rate of inflation.',
      ],
      prompt: 'Why did the savings account fall behind less than the cash?',
      promptAnswer: 'It earned interest, which made up part of the price rise. The cash earned nothing.',
      sources: [INFLATION_SOURCE, DEPOSIT_SOURCE],
    },
    {
      id: 'predict-price', kind: 'predict', title: 'Predict: a year of inflation', uses: ['buying-power'],
      text: ['A pair of work shoes cost $40.00 a year ago. Prices rose 3.7%. What do they cost now?'],
      answer: priceAfter(4000),
      misconceptions: [{ cents: percentOf(4000, INFLATION), explanation: 'That is the increase alone. Add it to $40.00.' }],
      explanation: '3.7% of $40.00 is $1.48. $40.00 + $1.48 = $41.48.',
      source: INFLATION_SOURCE,
    },
    {
      id: 'predict-cash', kind: 'predict', title: 'Predict: cash in a safe', uses: ['buying-power'],
      text: ['Eli kept $500.00 in cash for a year. Prices rose 3.7%. How much short of last year\'s buying power is the cash?'],
      answer: percentOf(50000, INFLATION),
      misconceptions: [{ cents: priceAfter(50000), explanation: 'That is the new price. The cash is short by the difference.' }],
      explanation: '3.7% of $500.00 is $18.50: the same things now cost $518.50, and the cash is still $500.00.',
      source: INFLATION_SOURCE,
    },
    {
      id: 'compound', kind: 'explain', title: 'Interest on interest', uses: ['compound-interest', 'bank-fee-interest-entries', 'percentages'],
      text: [
        'A 12-month CD (certificate of deposit) pays interest at the end of the year. In October 2026 the average rate was 1.76% a year.',
        'Eli puts $1,000.00 in a CD. After a year it pays $17.60. Record it like any interest: debit the Saving bucket, credit Interest earned. Eli renews it, interest and all.',
        'Year 2 earns 1.76% of $1,017.60, which is $17.91. That is 31 cents more than year 1, because last year\'s interest now earns interest too. This is compound interest. Over many years the extra grows. Add-on A3 follows it over decades.',
      ],
      prompt: 'Why does year 2 earn more than year 1 at the same rate?',
      promptAnswer: 'Year 1\'s interest was added to the balance, so year 2 earns interest on a larger amount.',
      ledger: cdPage('Eli (example)', ELI_CD, 2),
      highlightRow: 2,
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'predict-year-3', kind: 'predict', title: 'Predict: year 3', uses: ['compound-interest'],
      text: ['Eli renews the CD a third time. Its year 3 interest is on the page. What does the page show after it?'],
      ledger: cdPage('Eli (example)', ELI_CD, 3, { askFrom: 3 }),
      highlightRow: 3,
      answer: yearOn(yearOn(yearOn(ELI_CD))),
      misconceptions: [{ cents: yearOn(yearOn(ELI_CD)) + 1760, explanation: 'Add the year 3 interest line, not the year 1 amount.' }],
      explanation: '$1,035.51 + $18.22 = $1,053.73.',
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'sinking', kind: 'explain', title: 'Sinking funds', uses: ['sinking-funds', 'transfers', 'journal-entry', 'fund-rules'],
      text: [
        'Some costs are not emergencies, because you know they are coming. Examples are a yearly renter\'s insurance bill, school supplies, or a phone you will need to replace.',
        'A sinking fund saves for them a little each month. Divide the cost by the months until it is due. Keep it on its own page: Sinking fund, account 9, another named part of the Saving bucket. Each month, debit Sinking fund and credit Saving bucket.',
        'Eli\'s renter\'s insurance is $180.00 a year, due in 12 months. $180.00 ÷ 12 = $15.00 a month. When the bill comes, Eli pays it from the Sinking fund, so the emergency fund stays whole.',
      ],
      prompt: 'Why does a planned bill belong in a sinking fund and not the emergency fund?',
      promptAnswer: 'It is known in advance, so it can be saved for. Paying it from the emergency fund would leave less for a real emergency.',
      journalPage: insuranceJournal,
      highlightEntry: 0,
    },
    {
      id: 'predict-monthly', kind: 'predict', title: 'Predict: the monthly amount', uses: ['sinking-funds'],
      text: ['Eli will need to replace a $360.00 phone in 9 months. How much should go into the Sinking fund each month?'],
      answer: 36000 / 9,
      misconceptions: [{ cents: 36000, explanation: 'That is the whole cost. Divide it by the 9 months.' }],
      explanation: '$360.00 ÷ 9 = $40.00 a month.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['sinking-funds'],
      text: ['School supplies for the fall will cost $96.00, needed in 8 months. Step 1 is done: there are 8 monthly transfers. Finish Step 2: how much is each transfer?'],
      answer: 9600 / 8,
      misconceptions: [{ cents: 9600, explanation: 'Share the $96.00 across the 8 transfers.' }],
      explanation: '$96.00 ÷ 8 = $12.00.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['compound-interest'],
      text: ['$2,000.00 goes into a 12-month CD at 1.76% and is renewed, interest and all. How much interest does the second year earn?'],
      answer: percentOf(yearOn(200000), CD),
      misconceptions: [{ cents: percentOf(200000, CD), explanation: 'That is year 1. Year 2 earns 1.76% of the larger balance.' }],
      explanation: 'Year 1: 1.76% of $2,000.00 = $35.20, so the balance is $2,035.20. Year 2: 1.76% of $2,035.20 = $35.82.',
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['buying-power'],
      text: ['An $80.00 grocery trip a year ago would cost how much now, after prices rose 3.7%?'],
      answer: priceAfter(8000),
      misconceptions: [{ cents: percentOf(8000, INFLATION), explanation: 'Add the increase to $80.00.' }],
      explanation: '3.7% of $80.00 is $2.96. $80.00 + $2.96 = $82.96.',
      source: INFLATION_SOURCE,
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['sinking-funds'],
      text: ['A $300.00 bill is due in 6 months. How much goes into the Sinking fund each month?'],
      answer: 30000 / 6,
      misconceptions: [{ cents: 30000, explanation: 'Divide by the 6 months.' }],
      explanation: '$300.00 ÷ 6 = $50.00.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['compound-interest'],
      text: ['$500.00 is kept in a 12-month CD at 1.76% for two years, renewed with its interest. What is the balance after two years?'],
      answer: yearOn(yearOn(50000)),
      misconceptions: [{ cents: 50000 + 2 * percentOf(50000, CD), explanation: 'Year 2 earns interest on year 1\'s interest too.' }],
      explanation: 'Year 1: $8.80, so $508.80. Year 2: 1.76% of $508.80 = $8.95, so $517.75.',
      source: DEPOSIT_SOURCE,
    },
  ],
  resources: ['investor-compound-calculator', 'fdic-national-rates', 'cfpb-start-small'],
  recallTemplates: [priceRise, sinkingMonthly].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: a percentage of an amount, rounded.
const drill = [1, 2, 3].map((n) => num(`m14-drill-${n}`, 'interpreting', { a: { min: 1000, max: 200000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: what is 3.7% of ${money(p.a)}, rounded to the cent?`, answer: percentOf(p.a, INFLATION),
  explanation: `3.7% of ${money(p.a)} = ${money(percentOf(p.a, INFLATION))} (rounded by the thousandths of a dollar).`,
})));

const fundMixed = { ...M13_GATE.templates.find((t) => t.part === 'producing'), id: 'm13-record-fund-mixed-m14' };

export const M14_PRACTICE = {
  id: 'm14-practice', kind: 'practice', module: 'm14', title: 'Module 14 practice set',
  templates: [...M13_LESSON.recallTemplates, ...M12_LESSON.recallTemplates, ...M10_LESSON.recallTemplates, ...drill, priceRise, secondYear, sinkingMonthly, growthTable, recordPlan, fundMixed, { ...explainPlanning, id: 'm14-explain-practice' }],
};

export const M14_EXTRA = {
  id: 'm14-extra', kind: 'practice', module: 'm14', title: 'Module 14 extra practice',
  templates: [priceRise, cashShort, savingShort, cdBalance, sinkingLeft, growthTable, recordPlan].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M14_REMEDIAL = {
  id: 'm14-remedial', kind: 'practice', module: 'm14', title: 'Module 14: common mistakes',
  templates: [priceRise, secondYear, recordPlan].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
export const M14_GATE = {
  id: 'm14', kind: 'gate', title: 'Module 14 check',
  templates: [priceRise, cashShort, savingShort, secondYear, cdBalance, sinkingMonthly, drill[0], recordPlan, growthTable, explainPlanning],
};
