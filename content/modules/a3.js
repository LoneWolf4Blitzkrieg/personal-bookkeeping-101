// Add-on A3: IRAs and saving for later. Ideas: what-an-ira-is,
// traditional-vs-roth, limits-and-growth. How IRAs work, never what to buy.
// The IRA page (10) is a named home for Investing bucket money, filled by
// transfers; it holds a 12-month CD at the real October 2026 average rate,
// 1.76% (the author's ruling: no invented growth rate). Limits are the IRS's
// 2026 figures. Tax rates in questions are stated as "suppose", for practice
// only. People and everyday amounts are fictional (illustrative).

import { percentOf } from '../../js/money.js';
import { money, NAMES, explainTemplate, accountOptions, chartPage, per100 } from '../helpers.js';
import { RATES_2026 } from '../rates2026.js';
import { IRA_2026 } from '../addonData.js';
import { M14_LESSON } from './m14.js';
import { A1_LESSON } from './a1.js';
import { A2_LESSON, A2_GATE } from './a2.js';

const num = (id, part, params, build) => ({ id, module: 'a3', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const CD = RATES_2026.cdRateBasisPoints / 10000;
const DEPOSIT_SOURCE = RATES_2026.depositRatesSource;
const LIMIT = IRA_2026.limit;
const LIMIT_50 = IRA_2026.limit + IRA_2026.catchUp;
const IRA_SOURCES = ['investor-iras', 'irs-traditional-roth'];
const yearOn = (cents) => cents + percentOf(cents, CD);

// An IRA page: each year, a contribution in January from the Investing
// bucket, then the CD's interest at the end of the year.
function iraRows(contribution, years, { opening = 0, start = 2027 } = {}) {
  const rows = opening ? [[`${start}-01-01`, 'Brought forward', '', opening, 0]] : [];
  let balance = opening;
  for (let y = 0; y < years; y++) {
    rows.push([`${start + y}-01-02`, 'From Investing bucket', `J${2 * y + 1}`, contribution, 0, true]);
    balance += contribution;
    const interest = percentOf(balance, CD);
    rows.push([`${start + y}-12-31`, 'CD interest (1.76%)', `J${2 * y + 2}`, interest, 0, true]);
    balance += interest;
  }
  return { rows, balance };
}
const iraBalance = (contribution, years, opening = 0) => iraRows(contribution, years, { opening }).balance;

// --- Question templates -----------------------------------------------------

const maxContribution = num('a3-max-contribution', 'interpreting', { earned: { min: 150000, max: 700000, step: 1 }, over: { pick: [false, true] }, name: { pick: NAMES } }, (p) => {
  const earned = p.over ? p.earned + 750000 : p.earned;
  const answer = Math.min(LIMIT, earned);
  return {
    prompt: `${p.name} is 24, single, and earned ${money(earned)} from work in 2026. What is the most ${p.name} can put into IRAs for 2026?`,
    source: IRA_2026.source,
    answer,
    misconceptions: [{ cents: answer === LIMIT ? earned : LIMIT, explanation: answer === LIMIT ? 'You cannot put in more than the 2026 limit, $7,500.00, however much you earn.' : 'You cannot put in more than you earned from work that year.' }],
    explanation: `The most is the smaller of the 2026 limit, $7,500.00, and what ${p.name} earned, ${money(earned)}: ${money(answer)}.`,
  };
});

// Age and what was already put in this year: the room left depends on the
// age limit (earnings are always above it, so they never bind).
const ageLimit = num('a3-age-limit', 'interpreting', { age: { pick: [35, 44, 50, 53, 58, 62] }, put: { min: 50000, max: 700000, step: 100 }, earned: { min: 2000000, max: 6000000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const limit = p.age >= 50 ? LIMIT_50 : LIMIT;
  const other = p.age >= 50 ? LIMIT : LIMIT_50;
  return {
    prompt: `${p.name} is ${p.age}, earned ${money(p.earned)} from work in 2026, and has already put ${money(p.put)} into an IRA for 2026. How much more can ${p.name} put in for 2026?`,
    source: IRA_2026.source,
    answer: limit - p.put,
    misconceptions: [{ cents: other - p.put, explanation: p.age >= 50 ? 'At 50 or older, $1,100.00 more is allowed. The limit is $8,600.00.' : 'The extra $1,100.00 is only for people 50 or older. The limit is $7,500.00.' }],
    explanation: `${p.age >= 50 ? `At ${p.age}, the 2026 limit is $7,500.00 + $1,100.00 = ${money(LIMIT_50)}` : `Under 50, the 2026 limit is ${money(LIMIT)}`}. ${money(limit)} − ${money(p.put)} = ${money(limit - p.put)} more.`,
  };
});

const yearOfInterest = num('a3-year-of-interest', 'interpreting', { opening: { min: 100000, max: 3000000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const interest = percentOf(p.opening, CD);
  return {
    prompt: `${p.name}'s IRA holds a 12-month CD at 1.76% a year, the October 2026 average. Its interest for the year is on the page. What does the page show after it?`,
    source: DEPOSIT_SOURCE,
    ledger: chartPage('ira', [['2027-01-01', 'Brought forward', '', p.opening, 0], ['2027-12-31', 'CD interest (1.76%)', 'J2', interest, 0, true]], { name: p.name, askFrom: 1 }),
    highlightRow: 1,
    answer: p.opening + interest,
    misconceptions: [{ cents: p.opening - interest, explanation: 'Interest is added to the IRA. It is a debit to an asset page.' }],
    explanation: `1.76% of ${money(p.opening)} is ${money(interest)}. ${money(p.opening)} + ${money(interest)} = ${money(p.opening + interest)}.`,
  };
});

const twoYears = num('a3-two-years', 'interpreting', { c: { min: 50000, max: 750000, step: 100 }, name: { pick: NAMES } }, (p) => {
  const answer = iraBalance(p.c, 2);
  return {
    prompt: `${p.name} opens an IRA holding a 12-month CD at 1.76% a year. ${p.name} puts in ${money(p.c)} each January, and the CD's interest is added each December. What does the IRA hold after two years?`,
    source: DEPOSIT_SOURCE,
    answer,
    misconceptions: [{ cents: 2 * p.c, explanation: 'Add each December\'s interest, too. It is 1.76% of what the IRA held that year.' }],
    explanation: `Year 1: ${money(p.c)} + ${money(percentOf(p.c, CD))} = ${money(yearOn(p.c))}. Year 2: ${money(yearOn(p.c))} + ${money(p.c)} = ${money(yearOn(p.c) + p.c)}, plus ${money(percentOf(yearOn(p.c) + p.c, CD))} interest = ${money(answer)}.`,
  };
});

const traditionalKept = num('a3-traditional-kept', 'interpreting', { w: { min: 100000, max: 3000000, step: 100 }, rate: { pick: [10, 12, 22] }, name: { pick: NAMES } }, (p) => {
  const tax = percentOf(p.w, p.rate / 100);
  return {
    prompt: `In retirement, ${p.name} takes ${money(p.w)} out of a traditional IRA. Suppose that withdrawal is taxed at ${p.rate}%. How much does ${p.name} keep?`,
    sources: IRA_SOURCES,
    answer: p.w - tax,
    misconceptions: [{ cents: p.w, explanation: 'Withdrawals from a traditional IRA are taxed as income. Take the tax out.' }],
    explanation: `Tax: ${p.rate}% of ${money(p.w)} = ${money(tax)}. Kept: ${money(p.w)} − ${money(tax)} = ${money(p.w - tax)}. (A qualified Roth withdrawal would not be taxed.)`,
  };
});

const earlyExtra = num('a3-early-extra', 'interpreting', { w: { min: 50000, max: 900000, step: 1 }, age: { pick: [24, 31, 38, 45] }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} is ${p.age} and takes ${money(p.w)} out of a traditional IRA early, with no exception that applies. Besides income tax, how much is the extra 10% tax?`,
  sources: IRA_SOURCES,
  answer: percentOf(p.w, 0.1),
  misconceptions: [{ cents: p.w - percentOf(p.w, 0.1), explanation: 'That is what is left after the extra tax. The question asks for the tax itself.' }],
  explanation: `10% of ${money(p.w)} = ${money(percentOf(p.w, 0.1))}, on top of the income tax on the withdrawal.`,
}));

const RECORD_ACCOUNTS = accountOptions(['ira', 'investing', 'checking', 'interest-earned', 'saving']);
const RECORD_EVENTS = {
  contribution: (p) => ({
    prompt: `${p.name} moves ${money(p.amount)} from the Investing bucket into an IRA. Record the entry.`,
    answer: [{ account: 'ira', debit: p.amount, credit: 0 }, { account: 'investing', debit: 0, credit: p.amount }],
    explanation: 'This is a transfer between your own pages. Debit the IRA, which receives. Credit the Investing bucket, which gives.',
  }),
  interest: (p) => ({
    prompt: `The CD in ${p.name}'s IRA pays ${money(p.amount)} of interest. Record the entry.`,
    answer: [{ account: 'ira', debit: p.amount, credit: 0 }, { account: 'interest-earned', debit: 0, credit: p.amount }],
    explanation: 'The IRA grows, so debit it. Interest is income, so credit Interest earned.',
  }),
  withdrawal: (p) => ({
    prompt: `In retirement, ${p.name} takes ${money(p.amount)} out of a Roth IRA (a qualified withdrawal, so no tax) into Checking. Record the entry.`,
    answer: [{ account: 'checking', debit: p.amount, credit: 0 }, { account: 'ira', debit: 0, credit: p.amount }],
    explanation: 'Checking goes up, so debit it. The IRA goes down, so credit it. It is a transfer between your own pages.',
  }),
};
const recordIra = {
  id: 'a3-record-ira', module: 'a3', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 5000, max: 750000, step: 1 }, name: { pick: NAMES }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

// Production: two years of contributions and interest, interest rounded each year.
const iraTable = {
  id: 'a3-ira-table', module: 'a3', kind: 'amounts', part: 'producing', points: 4,
  params: { c: { min: 50000, max: 750000, step: 100 }, name: { pick: NAMES } },
  build: (p) => {
    const i1 = percentOf(p.c, CD);
    const b1 = p.c + i1;
    const i2 = percentOf(b1 + p.c, CD);
    return {
      prompt: `${p.name} puts ${money(p.c)} into an IRA each January. It holds a 12-month CD at 1.76% a year (the October 2026 average), and the interest is added each December. Work out each year. Round each year's interest to the cent.`,
      source: DEPOSIT_SOURCE,
      fields: [['Interest, year 1', i1], ['IRA at the end of year 1', b1], ['Interest, year 2', i2], ['IRA at the end of year 2', b1 + p.c + i2]].map(([label, answer]) => ({ label, answer })),
      explanation: `Year 1: 1.76% of ${money(p.c)} = ${money(i1)}; ${money(b1)}. Year 2: ${money(b1)} + ${money(p.c)} = ${money(b1 + p.c)}; 1.76% of that = ${money(i2)}; ${money(b1 + p.c + i2)}.`,
    };
  },
};

const explainIra = explainTemplate({
  id: 'a3-explain', module: 'a3',
  variants: [
    { prompt: 'In one or two sentences: what is an IRA?',
      modelAnswer: 'It is an account for saving for retirement, with tax advantages. It can hold savings such as a CD, or investments such as mutual funds.',
      rubric: ['Says it is an account for saving for retirement', 'Mentions the tax advantage (or what it can hold)'] },
    { prompt: 'In one or two sentences: how is a Roth IRA taxed differently from a traditional IRA?',
      modelAnswer: 'A traditional IRA can lower your taxes now, but withdrawals are taxed later. A Roth uses money that was already taxed, and qualified withdrawals are not taxed.',
      rubric: ['Says traditional withdrawals are taxed later (contributions may be deductible)', 'Says Roth contributions are after tax and qualified withdrawals are tax-free'] },
    { prompt: 'In one or two sentences: why is the most you can put in the smaller of the yearly limit and what you earned?',
      modelAnswer: 'The limit protects the tax advantage for people saving from their work. You cannot put in more than you earned from work that year, or more than the yearly limit.',
      rubric: ['Says contributions cannot be more than you earned from work', 'Says they cannot be more than the yearly limit'] },
    { prompt: 'In one or two sentences: why does starting an IRA early make a difference, even at a low rate?',
      modelAnswer: 'Each year\'s interest is added and then earns interest too. The more years it has, the more interest on interest builds up.',
      rubric: ['Says interest is added and earns interest itself (compounding)', 'Says more years means more growth'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

const MAYA = 100000; // $1,000.00 a year (illustrative)
const mayaPage = (years, askFrom = null) => chartPage('ira', iraRows(MAYA, years).rows, { name: 'Maya (example)', askFrom });
const FORTY = iraBalance(MAYA, 40);
// Interest on the contributions alone: each $1,000.00 earns $17.60 a year for
// the years it stays (40 + 39 + ... + 1 = 820 years in all).
const SIMPLE_FORTY = percentOf(MAYA, CD) * 820;
// The 40 years on one page: years 1 and 2 and year 40 line by line, the
// years between on one summary line.
function fortyYearPage() {
  const { rows } = iraRows(MAYA, 40);
  const middle = rows.slice(4, -2).reduce((s, r) => s + r[3], 0);
  return chartPage('ira', [...rows.slice(0, 4), ['2065-12-31', 'Years 3 to 39: contributions and interest', '', middle, 0], ...rows.slice(-2)], { name: 'Maya (example)' });
}

export const A3_LESSON = {
  id: 'a3',
  title: 'IRAs and saving for later',
  coreIdea: 'An IRA is an account for saving for retirement, with tax advantages. A traditional IRA can lower your taxes now, but it is taxed later. A Roth IRA is taxed now and not later. Each year has a limit. Money left to grow for decades earns interest on its interest.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['corporate-pricing'],
      text: ['From Add-on A2: a company had sales of $3,000 million and profit of $240 million. How much profit per $100.00 of sales?'],
      answer: 800,
      misconceptions: [{ cents: 9200, explanation: 'That is the costs per $100.00. Divide profit by sales.' }],
      explanation: '$240 million ÷ $3,000 million × $100.00 = $8.00.',
    },
    {
      id: 'what', kind: 'explain', title: 'What an IRA is', uses: ['what-an-ira-is', 'transfers', 'compound-interest'],
      text: [
        'An IRA (individual retirement account) is an account for saving for retirement, with tax advantages. You open it with a bank, a credit union or an investment firm.',
        'An IRA can hold savings, such as a CD. At a bank, deposits in IRAs, CDs included, are insured by the FDIC up to $250,000 per owner. An IRA can also hold investments such as mutual funds. Those are not insured. Their value goes up and down, and they "may lose value."',
        'In your books, the IRA is a page of its own, IRA (account 10). It is a home for Investing bucket money. Moving money in is a transfer: debit IRA, credit Investing bucket. Maya puts in $1,000.00 each January. Her IRA holds a CD at 1.76% a year, the October 2026 average, and its interest is added each December.',
        'This course explains how IRAs work. It does not tell you what to buy.',
      ],
      prompt: 'Why does moving money from the Investing bucket into an IRA leave your net worth the same?',
      promptAnswer: 'It is a transfer between your own pages: the IRA goes up and the Investing bucket goes down by the same amount.',
      sources: ['investor-iras', 'fdic-at-a-glance', 'fdic-not-insured', DEPOSIT_SOURCE],
      ledger: mayaPage(1),
      highlightRow: 1,
    },
    {
      id: 'predict-year-2', kind: 'predict', title: 'Predict: the second year', uses: ['what-an-ira-is', 'compound-interest'],
      text: ['Maya puts in another $1,000.00 in January of year 2, and the CD\'s interest is added in December. What does her IRA page show at the end of year 2?'],
      ledger: mayaPage(2, 2),
      highlightRow: 3,
      answer: iraBalance(MAYA, 2),
      misconceptions: [{ cents: 2 * MAYA + 2 * percentOf(MAYA, CD), explanation: 'Year 2\'s interest is 1.76% of everything in the IRA that year ($2,017.60), not of $1,000.00.' }],
      explanation: `$1,017.60 + $1,000.00 = $2,017.60. 1.76% of $2,017.60 is ${money(percentOf(201760, CD))}, so the IRA holds ${money(iraBalance(MAYA, 2))}.`,
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'roth', kind: 'explain', title: 'Traditional or Roth', uses: ['traditional-vs-roth', 'paycheck-deductions'],
      text: [
        'The two common kinds differ in when you pay tax.',
        'Traditional IRA: you may be able to deduct what you put in, which lowers your income tax now. What you take out later, including the growth, is taxed as income. Taking money out before age 59½ usually adds an extra 10% tax unless an exception applies.',
        'Roth IRA: what you put in has already been taxed and is not deductible. A qualified withdrawal later, growth included, is not taxed.',
        'Which suits you depends on your taxes now and later. The IRS and Investor.gov pages linked at the end explain the rules in full.',
      ],
      prompt: 'In one sentence: when do you pay tax on a traditional IRA, and when on a Roth?',
      promptAnswer: 'Traditional: later, when you take money out. Roth: now, because what you put in was already taxed.',
      sources: IRA_SOURCES,
    },
    {
      id: 'predict-kept', kind: 'predict', title: 'Predict: tax on a withdrawal', uses: ['traditional-vs-roth'],
      text: ['In retirement, Maya takes $10,000.00 out of a traditional IRA. Suppose that withdrawal is taxed at 12%. How much does she keep?'],
      answer: 1000000 - percentOf(1000000, 0.12),
      misconceptions: [{ cents: 1000000, explanation: 'Traditional IRA withdrawals are taxed. That would be right for a qualified Roth withdrawal.' }],
      explanation: '12% of $10,000.00 is $1,200.00. $10,000.00 − $1,200.00 = $8,800.00. From a Roth, a qualified withdrawal would keep all $10,000.00.',
      sources: IRA_SOURCES,
    },
    {
      id: 'predict-early', kind: 'predict', title: 'Predict: taking it out early', uses: ['traditional-vs-roth', 'percentages'],
      text: ['At 30, someone takes $2,000.00 out of a traditional IRA, with no exception that applies. Besides income tax, how much is the extra 10% tax?'],
      answer: 20000,
      misconceptions: [{ cents: 180000, explanation: 'That is what is left after the extra tax. The question asks for the tax.' }],
      explanation: '10% of $2,000.00 = $200.00, on top of the income tax.',
      sources: IRA_SOURCES,
    },
    {
      id: 'limits', kind: 'explain', title: 'Limits and decades of growth', uses: ['limits-and-growth', 'compound-interest'],
      text: [
        'For 2026, the most anyone can put into all their IRAs together is $7,500.00, or $8,600.00 at age 50 or older ($1,100.00 more). For a single person, it can never be more than they earned from work that year. (A married couple filing a joint tax return can count the working spouse\'s pay; the IRS page explains this.) Roth IRAs also have an income limit. For a single person in 2026, it phases out between $153,000.00 and $168,000.00.',
        `Time does a lot of the work. If Maya keeps putting in $1,000.00 a year at 1.76% for 40 years, she puts in $40,000.00 and her IRA holds ${money(FORTY)}. The rest, ${money(FORTY - 40 * MAYA)}, is interest. About ${money(FORTY - 40 * MAYA - SIMPLE_FORTY)} of it is interest earned on earlier interest, and that part grows faster the longer the money stays.`,
        'Investments such as stock and bond funds can grow faster than a CD or lose value. Nobody can promise either. The course uses the CD rate because it is a real, published figure.',
      ],
      prompt: 'Why does the interest grow faster in the later years?',
      promptAnswer: 'Each year adds a contribution and that year\'s interest, so there is more money earning interest every year.',
      sources: [IRA_2026.source, DEPOSIT_SOURCE, 'fdic-not-insured'],
      ledger: fortyYearPage(),
      highlightRow: 6,
    },
    {
      id: 'predict-limit', kind: 'predict', title: 'Predict: the most you can put in', uses: ['limits-and-growth'],
      text: ['Kai is 20, single, earned $5,240.00 from a part-time job in 2026, and has already put $3,000.00 into a Roth IRA for 2026. How much more can Kai put in for 2026?'],
      answer: 224000,
      misconceptions: [{ cents: LIMIT - 300000, explanation: 'Kai earned less than $7,500.00, so his limit is what he earned, $5,240.00.' }],
      explanation: 'The most is the smaller of $7,500.00 and $5,240.00, which is $5,240.00. $5,240.00 − $3,000.00 = $2,240.00 more.',
      source: IRA_2026.source,
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['limits-and-growth', 'compound-interest'],
      text: [`After 40 years, Maya put in $40,000.00 and earned ${money(FORTY - 40 * MAYA)} of interest. Step 1 is done: interest ÷ what she put in = ${money(FORTY - 40 * MAYA)} ÷ $40,000.00. Finish Step 2: multiply by $100.00. How much interest did she earn for every $100.00 she put in? Round to the cent.`],
      answer: per100(FORTY - 40 * MAYA, 40 * MAYA),
      misconceptions: [{ cents: per100(FORTY, 40 * MAYA), explanation: 'That counts the whole IRA. Use the interest only.' }],
      explanation: `${money(FORTY - 40 * MAYA)} ÷ $40,000.00 × $100.00 = ${money(per100(FORTY - 40 * MAYA, 40 * MAYA))}.`,
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['limits-and-growth'],
      text: ['Rosa is 52 and earned $31,000.00 from work in 2026. What is the most she can put into IRAs for 2026?'],
      answer: LIMIT_50,
      misconceptions: [{ cents: LIMIT, explanation: 'At 50 or older, $1,100.00 more is allowed.' }],
      explanation: '$7,500.00 + $1,100.00 = $8,600.00.',
      source: IRA_2026.source,
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['compound-interest'],
      text: ['An IRA holds $3,500.00 in a CD at 1.76% a year. How much interest does it earn in a year?'],
      answer: percentOf(350000, CD),
      misconceptions: [{ cents: 350000 + percentOf(350000, CD), explanation: 'That is the balance after the interest. The question asks for the interest.' }],
      explanation: '1.76% of $3,500.00 = $61.60.',
      source: DEPOSIT_SOURCE,
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['limits-and-growth'],
      text: ['Someone aged 23 and single earned $6,300.00 from work in 2026 and has already put $1,500.00 into an IRA for 2026. How much more can they put in?'],
      answer: 480000,
      misconceptions: [{ cents: LIMIT - 150000, explanation: 'They earned less than $7,500.00, so the limit is what they earned.' }],
      explanation: 'The smaller of $7,500.00 and $6,300.00 is $6,300.00. $6,300.00 − $1,500.00 = $4,800.00 more.',
      source: IRA_2026.source,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['traditional-vs-roth'],
      text: ['$4,000.00 is taken out of a traditional IRA in retirement. Suppose it is taxed at 12%. How much is kept?'],
      answer: 400000 - percentOf(400000, 0.12),
      misconceptions: [{ cents: 400000, explanation: 'Traditional IRA withdrawals are taxed.' }],
      explanation: '12% of $4,000.00 is $480.00. $4,000.00 − $480.00 = $3,520.00.',
      sources: IRA_SOURCES,
    },
  ],
  resources: ['irs-iras', 'investor-compound-calculator'],
  recallTemplates: [maxContribution, traditionalKept].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: a year's interest at 1.76%.
const drill = [1, 2, 3].map((n) => num(`a3-drill-${n}`, 'interpreting', { a: { min: 50000, max: 2000000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: what is 1.76% of ${money(p.a)}, rounded to the cent?`, answer: percentOf(p.a, CD),
  explanation: `1.76% of ${money(p.a)} = ${money(percentOf(p.a, CD))}.`,
})));

const companyMixed = { ...A2_GATE.templates.find((t) => t.part === 'producing'), id: 'a2-company-table-mixed-a3' };

export const A3_PRACTICE = {
  id: 'a3-practice', kind: 'practice', module: 'a3', title: 'Add-on A3 practice set',
  templates: [...A2_LESSON.recallTemplates, ...A1_LESSON.recallTemplates, ...M14_LESSON.recallTemplates, ...drill, maxContribution, yearOfInterest, traditionalKept, recordIra, iraTable, companyMixed, { ...explainIra, id: 'a3-explain-practice' }],
};

export const A3_EXTRA = {
  id: 'a3-extra', kind: 'practice', module: 'a3', title: 'Add-on A3 extra practice',
  templates: [maxContribution, ageLimit, yearOfInterest, twoYears, traditionalKept, earlyExtra, recordIra].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const A3_REMEDIAL = {
  id: 'a3-remedial', kind: 'practice', module: 'a3', title: 'Add-on A3: common mistakes',
  templates: [maxContribution, twoYears, iraTable].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
export const A3_GATE = {
  id: 'a3', kind: 'gate', title: 'Add-on A3 check',
  templates: [maxContribution, ageLimit, yearOfInterest, twoYears, traditionalKept, earlyExtra, drill[0], recordIra, iraTable, explainIra],
};
