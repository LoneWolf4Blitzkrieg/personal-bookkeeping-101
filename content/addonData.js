// Real figures for the add-on modules (A1–A3), each with its source id
// (content/sources.js). Every value was checked on its primary source on
// October 25, 2026. Index values are stored in thousandths (271.696 ->
// 271696) and money in whole units of the stated size, so all arithmetic is
// on whole numbers.

// Consumer Price Index, all urban consumers, U.S. city average
// (1982–84 = 100), not seasonally adjusted. BLS historical table.
export const CPI_SOURCE = 'bls-cpi-history';
export const CPI = {
  '2019-06': 256143, '2019-09': 256759, '2019-12': 256974,
  '2020-06': 257797, '2020-09': 260280, '2020-12': 260474,
  '2021-06': 271696, '2021-09': 274310, '2021-12': 278802,
  '2022-06': 296311, '2022-09': 296808, '2022-12': 296797,
  '2023-06': 305109, '2023-09': 307789, '2023-12': 306746,
  '2024-06': 314175, '2024-09': 315301, '2024-12': 315605,
  '2025-06': 322561, '2025-09': 324800, '2025-12': 324054,
  '2026-06': 333952, '2026-09': 336940,
};
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthName = (key) => `${MONTH_NAMES[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`;
export const indexText = (thousandths) => (thousandths / 1000).toFixed(3);
// Pairs a year apart, for questions.
export const CPI_YEAR_PAIRS = Object.keys(CPI).filter((k) => CPI[`${Number(k.slice(0, 4)) + 1}${k.slice(4)}`]).map((k) => [k, `${Number(k.slice(0, 4)) + 1}${k.slice(4)}`]);

// M2 money stock, seasonally adjusted, billions of dollars, in tenths of a
// billion (15,307.1 -> 153071). Fed H.6 release of January 28, 2021.
export const M2_SOURCE = 'fed-h6-2021-01';
export const M2 = {
  '2019-10': 151499, '2019-11': 152512, '2019-12': 153071,
  '2020-10': 188120, '2020-11': 190860, '2020-12': 191883,
};

// Federal receipts and outlays by fiscal year (October to September),
// billions of dollars in tenths (3,462.2 -> 34622). Monthly Treasury
// Statement, September year to date; FY2021 as revised in the FY2022 report.
export const BUDGET_SOURCE = 'treasury-mts';
export const BUDGET = {
  2019: { receipts: 34622, outlays: 44466 },
  2020: { receipts: 34200, outlays: 65519 },
  2021: { receipts: 40460, outlays: 68216 },
  2022: { receipts: 48961, outlays: 62715 },
};

// Revenue and net income (attributable to the company) from each company's
// Form 10-K, millions of dollars. The five largest U.S. drug companies and
// the five largest U.S. health insurers by 2019 revenue (author's ruling,
// October 25, 2026: Johnson & Johnson counted as a drug company; CVS Health,
// whose largest business is its drugstores, left out). Fiscal years are
// matched by the period each report covers: J&J's years end in early January
// (2022 as first reported, before the 2023 Kenvue separation restated it).
export const COMPANIES = [
  { id: 'jnj', name: 'Johnson & Johnson', kind: 'drug', source: 'sec-10k-jnj', years: { 2019: [82059, 15119], 2021: [93775, 20878], 2022: [94943, 17941] } },
  { id: 'pfizer', name: 'Pfizer', kind: 'drug', source: 'sec-10k-pfizer', years: { 2019: [51750, 16273], 2021: [81288, 21979], 2022: [100330, 31372] } },
  { id: 'merck', name: 'Merck', kind: 'drug', source: 'sec-10k-merck', years: { 2019: [46840, 9843], 2021: [48704, 13049], 2022: [59283, 14519] } },
  { id: 'abbvie', name: 'AbbVie', kind: 'drug', source: 'sec-10k-abbvie', years: { 2019: [33266, 7882], 2021: [56197, 11542], 2022: [58054, 11836] } },
  { id: 'bms', name: 'Bristol-Myers Squibb', kind: 'drug', source: 'sec-10k-bms', years: { 2019: [26145, 3439], 2021: [46385, 6994], 2022: [46159, 6327] } },
  { id: 'unitedhealth', name: 'UnitedHealth Group', kind: 'insurer', source: 'sec-10k-unitedhealth', years: { 2019: [242155, 13839], 2021: [287597, 17285], 2022: [324162, 20120] } },
  { id: 'cigna', name: 'Cigna', kind: 'insurer', source: 'sec-10k-cigna', years: { 2019: [153566, 5104], 2021: [174078, 5365], 2022: [180516, 6668] } },
  { id: 'elevance', name: 'Elevance Health (Anthem)', kind: 'insurer', source: 'sec-10k-elevance', years: { 2019: [104213, 4807], 2021: [138639, 6104], 2022: [156595, 6025] } },
  { id: 'centene', name: 'Centene', kind: 'insurer', source: 'sec-10k-centene', years: { 2019: [74639, 1321], 2021: [125982, 1347], 2022: [144547, 1202] } },
  { id: 'humana', name: 'Humana', kind: 'insurer', source: 'sec-10k-humana', years: { 2019: [64888, 2707], 2021: [83064, 2933], 2022: [92870, 2806] } },
];
export const COMPANY_YEARS = [2019, 2021, 2022];

// IRA figures for 2026 (IRS IR-2025-111).
export const IRA_2026 = { limit: 750000, catchUp: 110000, rothPhaseOutSingle: [15300000, 16800000], source: 'irs-ira-2026' };
