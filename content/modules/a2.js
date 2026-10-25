// Add-on A2: Inflation and its causes. Ideas: measuring-inflation,
// accepted-causes, corporate-pricing. Every figure is real and cited
// (content/addonData.js). Graded questions are only calculations from given
// figures; how much corporate pricing drove recent inflation is debated, so
// that step is tagged 'debated', shows the evidence on each side, and is never
// graded (design §5). Profit is shown as "profit per $100.00 of sales", so
// every answer is in dollars.

import { money, explainTemplate, per100 } from '../helpers.js';
import { CPI, CPI_SOURCE, CPI_YEAR_PAIRS, monthName, indexText, BUDGET, BUDGET_SOURCE, COMPANIES, COMPANY_YEARS, M2, M2_SOURCE } from '../addonData.js';
import { M13_LESSON } from './m13.js';
import { M14_LESSON } from './m14.js';
import { A1_LESSON, A1_GATE } from './a1.js';

const num = (id, part, params, build) => ({ id, module: 'a2', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const company = (id) => COMPANIES.find((c) => c.id === id);
const profit = (c, y) => per100(c.years[y][1], c.years[y][0]);
const millions = (m) => `$${m.toLocaleString('en-US')} million`;
const billions = (tenths) => `$${(tenths / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} billion`;
const deficit = (y) => BUDGET[y].outlays - BUDGET[y].receipts;
// A price moved with the index, rounded to the cent by the thousandths rule.
const priceAt = (cents, fromKey, toKey) => per100(cents * CPI[toKey], CPI[fromKey] * 10000);
// A company's year as an income statement, in millions of dollars (shown
// with two decimal places, like every other amount in the course).
const companyStatement = (c, y, extra = {}) => ({
  report: 'income-statement', name: `${c.name} (millions of dollars)`, period: String(y),
  income: [{ no: '', name: 'Revenue (sales)', amount: c.years[y][0] * 100 }],
  expenses: [{ no: '', name: 'Costs, taxes and all other expenses', amount: (c.years[y][0] - c.years[y][1]) * 100 }],
  netLabel: 'Net income (profit)', ...extra,
});
const RISERS = COMPANIES.filter((c) => profit(c, 2022) > profit(c, 2019));
// Separate pools, so no question in a check shows another's answer: the
// profit question uses three drug companies, the costs question three
// insurers, and the production table four other companies.
const picks = (ids) => ids.flatMap((id) => COMPANY_YEARS.map((y) => [id, y]));
const PROFIT_PICKS = picks(['jnj', 'abbvie', 'bms']);
const COSTS_PICKS = picks(['cigna', 'elevance', 'humana']);
const EARLY_PAIRS = CPI_YEAR_PAIRS.filter(([from]) => from < '2022');
const LATE_PAIRS = CPI_YEAR_PAIRS.filter(([from]) => from >= '2022');
const ALL_COMPANY_SOURCES = COMPANIES.map((c) => c.source);

// --- Question templates -----------------------------------------------------

const cpiPer100 = num('a2-cpi-per-100', 'interpreting', { pair: { pick: EARLY_PAIRS } }, (p) => {
  const [from, to] = p.pair;
  const answer = per100(CPI[to], CPI[from]);
  return {
    prompt: `The Consumer Price Index was ${indexText(CPI[from])} in ${monthName(from)} and ${indexText(CPI[to])} in ${monthName(to)}. Things that cost $100.00 in ${monthName(from)} cost how much a year later?`,
    source: CPI_SOURCE,
    answer,
    misconceptions: [{ cents: answer - 10000, explanation: 'That is the rise alone. Add it to the $100.00.' }],
    explanation: `${indexText(CPI[to])} ÷ ${indexText(CPI[from])} × $100.00 = ${money(answer)}: prices rose ${money(answer - 10000)} for every $100.00.`,
  };
});

const cpiRise = num('a2-cpi-rise', 'interpreting', { pair: { pick: LATE_PAIRS } }, (p) => {
  const [from, to] = p.pair;
  const answer = per100(CPI[to] - CPI[from], CPI[from]);
  return {
    prompt: `The Consumer Price Index was ${indexText(CPI[from])} in ${monthName(from)} and ${indexText(CPI[to])} in ${monthName(to)}. By how many dollars did prices rise for every $100.00 of things bought?`,
    source: CPI_SOURCE,
    answer,
    misconceptions: [{ cents: answer + 10000, explanation: 'That is what $100.00 of things cost a year later. The rise is the part above $100.00.' }],
    explanation: `(${indexText(CPI[to])} − ${indexText(CPI[from])}) ÷ ${indexText(CPI[from])} × $100.00 = ${money(answer)}.`,
  };
});

const priceNow = num('a2-price-now', 'interpreting', { pair: { pick: CPI_YEAR_PAIRS }, price: { min: 1500, max: 25000, step: 1 } }, (p) => {
  const [from, to] = p.pair;
  const answer = priceAt(p.price, from, to);
  return {
    prompt: `A week of groceries cost ${money(p.price)} in ${monthName(from)}, when the Consumer Price Index was ${indexText(CPI[from])}. If its price rose with the index, to ${indexText(CPI[to])} in ${monthName(to)}, what did it cost then?`,
    source: CPI_SOURCE,
    answer,
    misconceptions: [{ cents: answer - p.price, explanation: 'That is the increase alone. Add it to the old price.' }],
    explanation: `${money(p.price)} × ${indexText(CPI[to])} ÷ ${indexText(CPI[from])} = ${money(answer)} (rounded to the cent).`,
  };
});

const borrowedPer100 = num('a2-borrowed-per-100', 'interpreting', { year: { pick: [2019, 2020, 2021, 2022] } }, (p) => {
  const b = BUDGET[p.year];
  const answer = per100(deficit(p.year), b.outlays);
  return {
    prompt: `In fiscal year ${p.year} the federal government took in ${billions(b.receipts)} and spent ${billions(b.outlays)}. Of every $100.00 it spent, how much was borrowed?`,
    source: BUDGET_SOURCE,
    answer,
    misconceptions: [{ cents: per100(deficit(p.year), b.receipts), explanation: 'Compare the deficit with what was spent, not with what came in.' }],
    explanation: `Deficit: ${billions(b.outlays)} − ${billions(b.receipts)} = ${billions(deficit(p.year))}. Per $100.00 spent: ${billions(deficit(p.year))} ÷ ${billions(b.outlays)} × 100 = ${money(answer)}.`,
  };
});

const profitPer100 = num('a2-profit-per-100', 'interpreting', { pick: { pick: PROFIT_PICKS } }, (p) => {
  const [id, y] = p.pick;
  const c = company(id);
  const answer = profit(c, y);
  return {
    prompt: `From ${c.name}'s income statement for ${y}: how many dollars of profit did it make for every $100.00 of sales?`,
    report: companyStatement(c, y),
    source: c.source,
    answer,
    misconceptions: [{ cents: 10000 - answer, explanation: 'That is the costs per $100.00. Profit is net income divided by revenue, times 100.' }],
    explanation: `${millions(c.years[y][1])} ÷ ${millions(c.years[y][0])} × 100 = ${money(answer)} (rounded to the cent).`,
  };
});

const costsPer100 = num('a2-costs-per-100', 'interpreting', { pick: { pick: COSTS_PICKS } }, (p) => {
  const [id, y] = p.pick;
  const c = company(id);
  const answer = 10000 - profit(c, y);
  return {
    prompt: `${c.name} made ${money(profit(c, y))} of profit for every $100.00 of sales in ${y}. How much of each $100.00 went to costs, taxes and all other expenses?`,
    source: c.source,
    answer,
    misconceptions: [{ cents: profit(c, y), explanation: 'That is the profit. The rest of the $100.00 went to costs and other expenses.' }],
    explanation: `$100.00 − ${money(profit(c, y))} = ${money(answer)}.`,
  };
});

// Only companies whose profit per $100.00 rose, so the change is never below zero.
const profitRise = num('a2-profit-rise', 'interpreting', { id: { pick: RISERS.map((c) => c.id) } }, (p) => {
  const c = company(p.id);
  const answer = profit(c, 2022) - profit(c, 2019);
  return {
    prompt: `${c.name} made ${money(profit(c, 2019))} of profit per $100.00 of sales in 2019 and ${money(profit(c, 2022))} in 2022. By how much did profit per $100.00 rise?`,
    source: c.source,
    answer,
    misconceptions: [{ cents: profit(c, 2022), explanation: 'That is the 2022 figure. The rise is the difference between the two years.' }],
    explanation: `${money(profit(c, 2022))} − ${money(profit(c, 2019))} = ${money(answer)}.`,
  };
});

// Production: one company's three years. Four companies, one per version.
const companyTable = {
  id: 'a2-company-table', module: 'a2', kind: 'amounts', part: 'producing', points: 4,
  params: { id: { byVersion: ['pfizer', 'merck', 'unitedhealth', 'centene'] } },
  build: (p) => {
    const c = company(p.id);
    return {
      prompt: `${c.name}'s annual reports give its revenue and net income (millions of dollars): 2019, ${millions(c.years[2019][0])} and ${millions(c.years[2019][1])}; 2021, ${millions(c.years[2021][0])} and ${millions(c.years[2021][1])}; 2022, ${millions(c.years[2022][0])} and ${millions(c.years[2022][1])}. Work out profit per $100.00 of sales for each year, and the costs per $100.00 in 2022. Round to the cent.`,
      source: c.source,
      fields: [['Profit per $100.00 of sales, 2019', profit(c, 2019)], ['Profit per $100.00 of sales, 2021', profit(c, 2021)], ['Profit per $100.00 of sales, 2022', profit(c, 2022)], ['Costs and other expenses per $100.00 of sales, 2022', 10000 - profit(c, 2022)]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: COMPANY_YEARS.map((y) => `${y}: ${millions(c.years[y][1])} ÷ ${millions(c.years[y][0])} × 100 = ${money(profit(c, y))}`).join('. ') + `. Costs in 2022: $100.00 − ${money(profit(c, 2022))} = ${money(10000 - profit(c, 2022))}.`,
    };
  },
};

// Production: one fiscal year of the federal budget, one per version.
const budgetTable = {
  id: 'a2-budget-table', module: 'a2', kind: 'amounts', part: 'producing', points: 4,
  params: { year: { byVersion: [2019, 2020, 2021, 2022] } },
  build: (p) => {
    const b = BUDGET[p.year];
    const d = deficit(p.year);
    return {
      prompt: `In fiscal year ${p.year} the federal government took in ${billions(b.receipts)} and spent ${billions(b.outlays)}. Work out the deficit, and three figures per $100.00. Round to the cent.`,
      source: BUDGET_SOURCE,
      fields: [
        ['Deficit, in billions of dollars (type 984.40 for $984.4 billion)', d * 10],
        ['Borrowed per $100.00 spent', per100(d, b.outlays)],
        ['Paid for by receipts per $100.00 spent', per100(b.receipts, b.outlays)],
        ['Spent per $100.00 taken in', per100(b.outlays, b.receipts)],
      ].map(([label, answer]) => ({ label, answer })),
      explanation: `Deficit: ${billions(b.outlays)} − ${billions(b.receipts)} = ${billions(d)}. Borrowed: ${billions(d)} ÷ ${billions(b.outlays)} × 100 = ${money(per100(d, b.outlays))}. Receipts: ${billions(b.receipts)} ÷ ${billions(b.outlays)} × 100 = ${money(per100(b.receipts, b.outlays))}. Spent per $100.00 taken in: ${billions(b.outlays)} ÷ ${billions(b.receipts)} × 100 = ${money(per100(b.outlays, b.receipts))}.`,
    };
  },
};

const explainInflation = explainTemplate({
  id: 'a2-explain', module: 'a2',
  variants: [
    { prompt: 'In one or two sentences: how does the Consumer Price Index measure inflation?',
      modelAnswer: 'It tracks the prices of a fixed basket of things people buy. The change in the index from one date to another is the change in prices.',
      rubric: ['Says it tracks prices of a set (basket) of things people buy', 'Says the change in the index between two dates measures inflation'] },
    { prompt: 'In one or two sentences: why can fast growth in the amount of money push prices up?',
      modelAnswer: 'If money grows much faster than the goods and services there are to buy, more money is spent on about the same things, so their prices tend to rise.',
      rubric: ['Says money grows faster than the goods and services to buy', 'Says more spending on about the same things pushes prices up'] },
    { prompt: 'In one or two sentences: how can government deficit spending add to inflation?',
      modelAnswer: 'Spending more than it takes in puts extra money in people\'s hands. If they spend it faster than businesses can supply more, prices rise.',
      rubric: ['Says the government spends more than it takes in, adding spending', 'Says demand above what can be supplied pushes prices up'] },
    { prompt: 'In one or two sentences: what does "profit per $100.00 of sales" show, and what can it not show by itself?',
      modelAnswer: 'It shows how much of each $100.00 a company kept as profit. By itself it cannot show whether the company\'s prices caused inflation.',
      rubric: ['Says it shows the share of sales kept as profit', 'Says it cannot by itself show that prices caused inflation'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

const JNJ = company('jnj');
const PFIZER = company('pfizer');
const ABBVIE = company('abbvie');
const HUMANA = company('humana');
const MERCK = company('merck');
const COMPANY_DOC = {
  kind: 'list', title: 'Revenue and net income, from each company\'s annual reports (millions of dollars)',
  lines: COMPANIES.flatMap((c) => COMPANY_YEARS.map((y) => [`${c.name}, ${y}`, `sales $${c.years[y][0].toLocaleString('en-US')} · profit $${c.years[y][1].toLocaleString('en-US')}`])),
  note: 'Sales are revenue; profit is net income attributable to the company. Drug companies first, then health insurers.',
};
const BUDGET_DOC = (y) => ({
  kind: 'list', title: `Federal budget, fiscal year ${y} (October ${y - 1} to September ${y})`,
  lines: [['Receipts (taxes and other income)', billions(BUDGET[y].receipts)], ['Outlays (spending)', billions(BUDGET[y].outlays)], ['Deficit (borrowed)', billions(deficit(y))]],
  note: 'Source: Monthly Treasury Statement.',
});

export const A2_LESSON = {
  id: 'a2',
  title: 'Inflation and its causes',
  coreIdea: 'Inflation is measured by the Consumer Price Index. Economists broadly accept three causes: faster growth in money, government deficit spending, and rising costs. Whether company pricing added to it is debated, so this module shows the numbers and the evidence on each side.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['fed-money-supply'],
      text: ['From Add-on A1: banks\' reserves at the Fed are $500,000.00. The Fed buys $75,000.00 of Treasury securities from the banks. What are the reserves now?'],
      answer: 50000000 + 7500000,
      misconceptions: [{ cents: 50000000 - 7500000, explanation: 'The Fed pays by crediting the banks\' reserves: they go up.' }],
      explanation: '$500,000.00 + $75,000.00 = $575,000.00.',
    },
    {
      id: 'measure', kind: 'explain', title: 'Measuring inflation', uses: ['measuring-inflation', 'buying-power', 'percentages'],
      text: [
        'The Bureau of Labor Statistics checks the prices of a fixed basket of things people buy, such as food, rent, gas and doctor visits, every month. The Consumer Price Index (CPI) turns those prices into one number.',
        'Compare the index on two dates. In June 2021 it was 271.696; in June 2022 it was 296.311. So things that cost $100.00 in June 2021 cost 296.311 ÷ 271.696 × $100.00 = $109.06 a year later. Prices rose 9.1%, the largest 12-month rise since 1981. Energy prices rose 41.6%.',
      ],
      prompt: 'Why does the index use the same basket of things every month?',
      promptAnswer: 'So that a change in the index comes from prices changing, not from a change in what is being bought.',
      sources: [CPI_SOURCE, 'bls-cpi-2022-06'],
    },
    {
      id: 'predict-cpi', kind: 'predict', title: 'Predict: a year of prices', uses: ['measuring-inflation'],
      text: [`The CPI was ${indexText(CPI['2025-09'])} in September 2025 and ${indexText(CPI['2026-09'])} in September 2026. Things that cost $100.00 in September 2025 cost how much a year later?`],
      answer: per100(CPI['2026-09'], CPI['2025-09']),
      misconceptions: [{ cents: per100(CPI['2026-09'], CPI['2025-09']) - 10000, explanation: 'That is the rise alone. Add it to the $100.00.' }],
      explanation: `${indexText(CPI['2026-09'])} ÷ ${indexText(CPI['2025-09'])} × $100.00 = ${money(per100(CPI['2026-09'], CPI['2025-09']))}: the 3.7% you met in Module 14.`,
      source: CPI_SOURCE,
    },
    {
      id: 'predict-price', kind: 'predict', title: 'Predict: one price', uses: ['measuring-inflation'],
      text: [`A week of groceries cost $60.00 in December 2020, when the CPI was ${indexText(CPI['2020-12'])}. If its price rose with the index, to ${indexText(CPI['2021-12'])} in December 2021, what did it cost then?`],
      answer: priceAt(6000, '2020-12', '2021-12'),
      misconceptions: [{ cents: priceAt(6000, '2020-12', '2021-12') - 6000, explanation: 'That is the increase. Add it to $60.00.' }],
      explanation: `$60.00 × ${indexText(CPI['2021-12'])} ÷ ${indexText(CPI['2020-12'])} = ${money(priceAt(6000, '2020-12', '2021-12'))}.`,
      source: CPI_SOURCE,
    },
    {
      id: 'causes', kind: 'explain', title: 'Causes economists broadly accept', uses: ['accepted-causes', 'fed-money-supply'],
      text: [
        `More money. From Add-on A1: the money supply (M2) grew from ${billions(M2['2019-12'])} in December 2019 to ${billions(M2['2020-12'])} in December 2020, about a quarter in one year. When money grows much faster than the things there are to buy, prices tend to rise.`,
        `Deficit spending. In fiscal year 2020 the federal government spent ${billions(BUDGET[2020].outlays)} and took in ${billions(BUDGET[2020].receipts)}: it borrowed ${money(per100(deficit(2020), BUDGET[2020].outlays))} of every $100.00 it spent. Economists at the San Francisco Fed estimated that U.S. income support during the pandemic may have added about 3 percentage points to inflation by the end of 2021, an estimate they call uncertain.`,
        'Rising costs. When energy, shipping and materials cost more, businesses pay more to make and deliver what they sell. Energy prices rose 41.6% in the year to June 2022.',
        'Economists broadly agree that all three played a part. They disagree about how much each one mattered.',
      ],
      prompt: 'Why can spending more than it takes in push prices up?',
      promptAnswer: 'It puts extra money in people\'s hands. If they spend it faster than businesses can supply more, prices rise.',
      sourceDoc: BUDGET_DOC(2020),
      sources: [M2_SOURCE, BUDGET_SOURCE, 'sffed-2022-07', 'bls-cpi-2022-06'],
    },
    {
      id: 'predict-borrowed', kind: 'predict', title: 'Predict: borrowed per $100.00', uses: ['accepted-causes', 'percentages'],
      text: [`In fiscal year 2021 the government took in ${billions(BUDGET[2021].receipts)} and spent ${billions(BUDGET[2021].outlays)}. Of every $100.00 it spent, how much was borrowed?`],
      sourceDoc: BUDGET_DOC(2021),
      answer: per100(deficit(2021), BUDGET[2021].outlays),
      misconceptions: [{ cents: per100(deficit(2021), BUDGET[2021].receipts), explanation: 'Divide the deficit by what was spent, not by what came in.' }],
      explanation: `${billions(deficit(2021))} ÷ ${billions(BUDGET[2021].outlays)} × 100 = ${money(per100(deficit(2021), BUDGET[2021].outlays))}.`,
      source: BUDGET_SOURCE,
    },
    {
      id: 'companies', kind: 'explain', title: 'Company books: profit per $100.00 of sales', uses: ['corporate-pricing', 'income-statement'],
      text: [
        'Some people argue that companies raised prices more than their costs rose, adding to inflation. You can check part of that question with numbers anyone can read: companies\' annual reports.',
        'To avoid picking only the examples that fit one view, the course uses a fixed rule: the five largest U.S. drug companies and the five largest U.S. health insurers by 2019 revenue, comparing 2019, before the pandemic, with 2021 and 2022.',
        `Each annual report has an income statement, like yours from Module 12. Divide net income (profit) by revenue (sales) and multiply by 100: that is profit per $100.00 of sales. Johnson & Johnson: ${millions(JNJ.years[2019][1])} ÷ ${millions(JNJ.years[2019][0])} × 100 = ${money(profit(JNJ, 2019))} in 2019, and ${money(profit(JNJ, 2022))} in 2022.`,
      ],
      prompt: 'Why compare profit per $100.00 of sales, not just total profit?',
      promptAnswer: 'A company that sells more makes more profit even at the same prices. Per $100.00 of sales shows whether it kept a bigger share of each sale.',
      reports: [companyStatement(JNJ, 2019), companyStatement(JNJ, 2022)],
      sources: [JNJ.source],
    },
    {
      id: 'predict-profit', kind: 'predict', title: 'Predict: profit per $100.00', uses: ['corporate-pricing'],
      text: ['From Pfizer\'s income statement for 2019: how many dollars of profit did it make for every $100.00 of sales?'],
      report: companyStatement(PFIZER, 2019),
      answer: profit(PFIZER, 2019),
      misconceptions: [{ cents: 10000 - profit(PFIZER, 2019), explanation: 'That is the costs per $100.00. Divide net income by revenue.' }],
      explanation: `${millions(PFIZER.years[2019][1])} ÷ ${millions(PFIZER.years[2019][0])} × 100 = ${money(profit(PFIZER, 2019))}.`,
      source: PFIZER.source,
    },
    {
      id: 'ten-companies', kind: 'explain', title: 'All ten companies', uses: ['corporate-pricing'],
      text: [
        `From 2019 to 2022, profit per $100.00 of sales rose at ${RISERS.length} of the ten companies and fell at the other ${COMPANIES.length - RISERS.length}. Drug companies kept far more of each $100.00 than insurers, whose payments for their members' care take up most of what they collect.`,
        'Most of the companies sold much more in 2022 than in 2019, so their profits in dollars grew even where profit per $100.00 did not.',
        'These numbers show what the companies kept. By themselves they cannot show whether their prices caused inflation: that needs evidence about prices and costs across the whole economy.',
      ],
      prompt: 'Why can\'t these ten companies\' numbers settle whether company pricing caused inflation?',
      promptAnswer: 'They show what ten companies kept from their sales, not how prices and costs moved across the whole economy, which is what inflation measures.',
      sourceDoc: COMPANY_DOC,
      sources: ALL_COMPANY_SOURCES,
    },
    {
      id: 'debate', kind: 'explain', title: 'The evidence on each side (not graded)', tags: ['debated'], uses: ['corporate-pricing', 'accepted-causes'],
      text: [
        'How much company pricing added to recent inflation is debated among economists. This course shows the evidence and does not grade an opinion on it.',
        'Evidence that it added a lot: Kansas City Fed economists found that companies\' markups (price over cost) grew 3.4% in 2021, when inflation was 5.8%, so markups could explain more than half of that year\'s inflation, which they link to companies raising prices ahead of expected cost increases. A Federal Trade Commission staff report found grocery retailers\' revenues ran more than 6% over their total costs in 2021, above their 2015 peak of 5.6%, and 7% in the first three quarters of 2023.',
        'Evidence that it was not a main driver: San Francisco Fed economists found that markups across the whole economy "have stayed essentially flat" since the recovery began, and that rising markups "have not been a main driver" of the surge in inflation. A later Kansas City Fed study found that profits\' share of inflation fell after the first half of 2021, and over the first two years of the recovery (41%) was below the average of past recoveries (59%).',
        'What both sides agree on: profits rose fast in 2021, and costs and demand also rose. The disagreement is over how much of the price rise came from each.',
      ],
      prompt: 'What evidence would you want to see before deciding how much company pricing added to inflation?',
      promptAnswer: 'Prices and costs measured across many industries over several years, not just a few companies or one year, and studies from more than one side.',
      sources: ['kcfed-2023-markups', 'ftc-grocery-2024', 'sffed-2024-12', 'kcfed-2023-profits'],
    },
    {
      id: 'insulin', kind: 'explain', title: 'A documented case: insulin prices', uses: ['corporate-pricing', 'measuring-inflation'],
      text: [
        'Prices can also fall. In 2023 the three largest insulin makers announced cuts to U.S. list prices. Eli Lilly cut the list prices of Humalog and Humulin by 70% (effective late 2023). Sanofi cut the list price of Lantus by 78%, and Novo Nordisk cut some insulins by up to 75% (both effective January 2024).',
        'Medicare capped what people pay for each covered insulin at $35 for a month\'s supply, from January 1, 2023 under Part D and from July 1, 2023 for insulin used with a pump under Part B.',
      ],
      prompt: 'Why is a price cut announced by the maker a documented fact, while the cause of inflation is debated?',
      promptAnswer: 'A price cut is a single event the companies announced and anyone can check. The cause of inflation depends on how many forces across the whole economy are weighed.',
      sources: ['lilly-insulin-2023', 'sanofi-lantus-2023', 'novo-insulin-2024', 'cms-ira-insulin'],
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['corporate-pricing'],
      text: [`AbbVie, 2021: revenue ${millions(ABBVIE.years[2021][0])}, net income ${millions(ABBVIE.years[2021][1])}. Step 1 is done: ${millions(ABBVIE.years[2021][1])} ÷ ${millions(ABBVIE.years[2021][0])}. Finish Step 2: multiply by 100 and round to the cent. How much profit per $100.00 of sales?`],
      answer: profit(ABBVIE, 2021),
      misconceptions: [{ cents: 10000 - profit(ABBVIE, 2021), explanation: 'That is the costs per $100.00.' }],
      explanation: `${millions(ABBVIE.years[2021][1])} ÷ ${millions(ABBVIE.years[2021][0])} × 100 = ${money(profit(ABBVIE, 2021))}.`,
      source: ABBVIE.source,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['corporate-pricing'],
      text: [`Humana, 2019: revenue ${millions(HUMANA.years[2019][0])}, net income ${millions(HUMANA.years[2019][1])}. How much profit per $100.00 of sales?`],
      answer: profit(HUMANA, 2019),
      misconceptions: [{ cents: 10000 - profit(HUMANA, 2019), explanation: 'That is the costs per $100.00.' }],
      explanation: `${millions(HUMANA.years[2019][1])} ÷ ${millions(HUMANA.years[2019][0])} × 100 = ${money(profit(HUMANA, 2019))}.`,
      source: HUMANA.source,
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['measuring-inflation'],
      text: [`The CPI was ${indexText(CPI['2021-12'])} in December 2021 and ${indexText(CPI['2022-12'])} in December 2022. Things that cost $100.00 in December 2021 cost how much a year later?`],
      answer: per100(CPI['2022-12'], CPI['2021-12']),
      misconceptions: [{ cents: per100(CPI['2022-12'], CPI['2021-12']) - 10000, explanation: 'Add the rise to the $100.00.' }],
      explanation: `${indexText(CPI['2022-12'])} ÷ ${indexText(CPI['2021-12'])} × $100.00 = ${money(per100(CPI['2022-12'], CPI['2021-12']))}.`,
      source: CPI_SOURCE,
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['accepted-causes'],
      text: [`In fiscal year 2019 the government took in ${billions(BUDGET[2019].receipts)} and spent ${billions(BUDGET[2019].outlays)}. Of every $100.00 it spent, how much was borrowed?`],
      answer: per100(deficit(2019), BUDGET[2019].outlays),
      misconceptions: [{ cents: per100(deficit(2019), BUDGET[2019].receipts), explanation: 'Divide by what was spent.' }],
      explanation: `${billions(deficit(2019))} ÷ ${billions(BUDGET[2019].outlays)} × 100 = ${money(per100(deficit(2019), BUDGET[2019].outlays))}.`,
      source: BUDGET_SOURCE,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['corporate-pricing'],
      text: [`Merck, 2022: revenue ${millions(MERCK.years[2022][0])}, net income ${millions(MERCK.years[2022][1])}. How much profit per $100.00 of sales?`],
      answer: profit(MERCK, 2022),
      misconceptions: [{ cents: 10000 - profit(MERCK, 2022), explanation: 'That is the costs per $100.00.' }],
      explanation: `${millions(MERCK.years[2022][1])} ÷ ${millions(MERCK.years[2022][0])} × 100 = ${money(profit(MERCK, 2022))}.`,
      source: MERCK.source,
    },
  ],
  resources: ['bls-cpi'],
  recallTemplates: [cpiPer100, profitPer100].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: profit per $100.00 of sales.
const drill = [1, 2, 3].map((n) => num(`a2-drill-${n}`, 'interpreting', { sales: { min: 100, max: 900, step: 1 }, share: { min: 2, max: 30, step: 1 } }, (p) => {
  const sales = p.sales * 1000;
  const net = Math.round((sales * p.share) / 100) + p.sales;
  return {
    prompt: `Drill ${n} of 3: sales of ${millions(sales)} and profit of ${millions(net)}. How much profit per $100.00 of sales?`, answer: per100(net, sales),
    explanation: `${millions(net)} ÷ ${millions(sales)} × 100 = ${money(per100(net, sales))}.`,
  };
}));

const fedMixed = { ...A1_GATE.templates.find((t) => t.part === 'producing'), id: 'a1-record-fed-mixed-a2' };

export const A2_PRACTICE = {
  id: 'a2-practice', kind: 'practice', module: 'a2', title: 'Add-on A2 practice set',
  templates: [...A1_LESSON.recallTemplates, ...M14_LESSON.recallTemplates, ...M13_LESSON.recallTemplates, ...drill, cpiPer100, borrowedPer100, profitPer100, companyTable, budgetTable, fedMixed, { ...explainInflation, id: 'a2-explain-practice' }],
};

export const A2_EXTRA = {
  id: 'a2-extra', kind: 'practice', module: 'a2', title: 'Add-on A2 extra practice',
  templates: [cpiPer100, cpiRise, priceNow, borrowedPer100, profitPer100, costsPer100, profitRise].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const A2_REMEDIAL = {
  id: 'a2-remedial', kind: 'practice', module: 'a2', title: 'Add-on A2: common mistakes',
  templates: [cpiPer100, borrowedPer100, budgetTable].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). Nothing debated is graded.
export const A2_GATE = {
  id: 'a2', kind: 'gate', title: 'Add-on A2 check',
  templates: [cpiPer100, cpiRise, priceNow, borrowedPer100, profitPer100, costsPer100, drill[0], companyTable, budgetTable, explainInflation],
};
