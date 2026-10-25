// Personal Bookkeeping 101 by Raul Bautista is licensed under CC BY-NC-SA 4.0 (free for non-commercial use):
// https://creativecommons.org/licenses/by-nc-sa/4.0/
// The double-click version of the course: built from the course's own files by
// tools/build-offline.mjs. Do not edit by hand; run that tool instead.
(function () {
'use strict';
const defs = {};
defs["content/addonData.js"] = function (exports, require, define) {
define(exports, { CPI_SOURCE: () => CPI_SOURCE, CPI: () => CPI, monthName: () => monthName, indexText: () => indexText, CPI_YEAR_PAIRS: () => CPI_YEAR_PAIRS, M2_SOURCE: () => M2_SOURCE, M2: () => M2, BUDGET_SOURCE: () => BUDGET_SOURCE, BUDGET: () => BUDGET, COMPANIES: () => COMPANIES, COMPANY_YEARS: () => COMPANY_YEARS, IRA_2026: () => IRA_2026 });
// Real figures for the add-on modules (A1–A3), each with its source id
// (content/sources.js). Every value was checked on its primary source on
// October 25, 2026. Index values are stored in thousandths (271.696 ->
// 271696) and money in whole units of the stated size, so all arithmetic is
// on whole numbers.

// Consumer Price Index, all urban consumers, U.S. city average
// (1982–84 = 100), not seasonally adjusted. BLS historical table.
const CPI_SOURCE = 'bls-cpi-history';
const CPI = {
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
const monthName = (key) => `${MONTH_NAMES[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`;
const indexText = (thousandths) => (thousandths / 1000).toFixed(3);
// Pairs a year apart, for questions.
const CPI_YEAR_PAIRS = Object.keys(CPI).filter((k) => CPI[`${Number(k.slice(0, 4)) + 1}${k.slice(4)}`]).map((k) => [k, `${Number(k.slice(0, 4)) + 1}${k.slice(4)}`]);

// M2 money stock, seasonally adjusted, billions of dollars, in tenths of a
// billion (15,307.1 -> 153071). Fed H.6 release of January 28, 2021.
const M2_SOURCE = 'fed-h6-2021-01';
const M2 = {
  '2019-10': 151499, '2019-11': 152512, '2019-12': 153071,
  '2020-10': 188120, '2020-11': 190860, '2020-12': 191883,
};

// Federal receipts and outlays by fiscal year (October to September),
// billions of dollars in tenths (3,462.2 -> 34622). Monthly Treasury
// Statement, September year to date; FY2021 as revised in the FY2022 report.
const BUDGET_SOURCE = 'treasury-mts';
const BUDGET = {
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
const COMPANIES = [
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
const COMPANY_YEARS = [2019, 2021, 2022];

// IRA figures for 2026 (IRS IR-2025-111).
const IRA_2026 = { limit: 750000, catchUp: 110000, rothPhaseOutSingle: [15300000, 16800000], source: 'irs-ira-2026' };
};

defs["content/assess/ca.js"] = function (exports, require, define) {
const { M01_CHECKPOINT } = require("content/modules/m01.js");
const { M02_CHECKPOINT } = require("content/modules/m02.js");
const { M03_CHECKPOINT } = require("content/modules/m03.js");
const { M04_CHECKPOINT } = require("content/modules/m04.js");
define(exports, { CHECKPOINT_A_TEMPLATES: () => CHECKPOINT_A_TEMPLATES, CHECKPOINT_A: () => CHECKPOINT_A });
// Checkpoint A: everything from Modules 1–4. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.






const CHECKPOINT_A_TEMPLATES = [...M01_CHECKPOINT, ...M02_CHECKPOINT, ...M03_CHECKPOINT, ...M04_CHECKPOINT];

const CHECKPOINT_A = {
  id: 'ca',
  kind: 'checkpoint',
  title: 'Checkpoint A: Modules 1–4',
  templates: CHECKPOINT_A_TEMPLATES,
};
};

defs["content/assess/cb.js"] = function (exports, require, define) {
const { M05_CHECKPOINT } = require("content/modules/m05.js");
const { M06_CHECKPOINT } = require("content/modules/m06.js");
const { M07_CHECKPOINT } = require("content/modules/m07.js");
const { M08_CHECKPOINT } = require("content/modules/m08.js");
define(exports, { CHECKPOINT_B_TEMPLATES: () => CHECKPOINT_B_TEMPLATES, CHECKPOINT_B: () => CHECKPOINT_B });
// Checkpoint B: everything from Modules 5–8. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.






const CHECKPOINT_B_TEMPLATES = [...M05_CHECKPOINT, ...M06_CHECKPOINT, ...M07_CHECKPOINT, ...M08_CHECKPOINT];

const CHECKPOINT_B = {
  id: 'cb',
  kind: 'checkpoint',
  title: 'Checkpoint B: Modules 5–8',
  templates: CHECKPOINT_B_TEMPLATES,
};
};

defs["content/assess/cc.js"] = function (exports, require, define) {
const { M09_CHECKPOINT } = require("content/modules/m09.js");
const { M10_CHECKPOINT } = require("content/modules/m10.js");
const { M11_CHECKPOINT } = require("content/modules/m11.js");
const { M12_CHECKPOINT } = require("content/modules/m12.js");
define(exports, { CHECKPOINT_C_TEMPLATES: () => CHECKPOINT_C_TEMPLATES, CHECKPOINT_C: () => CHECKPOINT_C });
// Checkpoint C: everything from Modules 9–12. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.






const CHECKPOINT_C_TEMPLATES = [...M09_CHECKPOINT, ...M10_CHECKPOINT, ...M11_CHECKPOINT, ...M12_CHECKPOINT];

const CHECKPOINT_C = {
  id: 'cc',
  kind: 'checkpoint',
  title: 'Checkpoint C: Modules 9–12',
  templates: CHECKPOINT_C_TEMPLATES,
};
};

defs["content/assess/demo.js"] = function (exports, require, define) {
const { percentOf, formatCents } = require("js/money.js");
define(exports, { DEMO_GATE: () => DEMO_GATE });
// A demonstration gate used to check the assessment page before real module
// gates exist. Amounts are illustrative.



const money = (cents) => `$${formatCents(cents)}`;

const savingShare = {
  id: 'demo-saving-share', module: 'm03', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 90000, max: 130000, step: 100 }, opening: { min: 5000, max: 40000, step: 500 }, name: { pick: ['Jordan', 'Maya', 'Luis', 'Ana'] } },
  build: (p) => {
    const share = percentOf(p.pay, 0.15);
    return {
      prompt: `${p.name}'s Saving bucket already holds ${money(p.opening)}. On payday, 15% of a ${money(p.pay)} paycheck goes in. What does the Saving page balance read after the payday line?`,
      ledger: {
        sheetNo: 1, accountNo: 3, name: p.name, account: 'Saving bucket', type: 'asset',
        rows: [
          { date: '2026-06-01', items: 'Brought forward', folio: '', debit: p.opening, credit: 0, posted: [false, false] },
          { date: '2026-06-06', items: 'From paycheck, 15%', folio: '', debit: share, credit: 0, posted: [false, false], ask: ['balance', 'side'] },
        ],
      },
      answer: p.opening + share,
      misconceptions: [{ cents: share, explanation: 'That is only the new deposit; the balance also includes what was already there.' }],
      explanation: `${money(p.opening)} + ${money(share)} (15% of ${money(p.pay)}) = ${money(p.opening + share)}.`,
    };
  },
};

const blowMoney = {
  id: 'demo-blow-money', module: 'm03', kind: 'numeric', part: 'interpreting', points: 2,
  params: { pay: { min: 90000, max: 130000, step: 100 } },
  build: (p) => ({
    prompt: `A paycheck of ${money(p.pay)} is split with 10% going to blow money. How much is that?`,
    answer: percentOf(p.pay, 0.1),
    misconceptions: [{ cents: percentOf(p.pay, 0.01), explanation: 'That is 1%, not 10%.' }],
    explanation: `10% of ${money(p.pay)} is ${money(percentOf(p.pay, 0.1))}.`,
  }),
};

const recordTransfer = {
  id: 'demo-record-transfer', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 5000, max: 25000, step: 500 } },
  build: (p) => ({
    prompt: `Record moving ${money(p.amount)} from Checking into the Saving bucket.`,
    accounts: [{ id: 'checking', label: 'Checking' }, { id: 'saving', label: 'Saving bucket' }, { id: 'spending', label: 'Spending bucket' }],
    answer: [
      { account: 'saving', debit: p.amount, credit: 0 },
      { account: 'checking', debit: 0, credit: p.amount },
    ],
    explanation: 'Saving is an asset that increases, so it is debited; Checking is an asset that decreases, so it is credited.',
  }),
};

const explainDebit = {
  id: 'demo-explain-debit', module: 'm03', kind: 'explain', part: 'explaining', points: 2,
  params: { bucket: { pick: ['Saving', 'Spending', 'Charity', 'Investing'] } },
  build: (p) => ({
    prompt: `In one or two sentences: why is the ${p.bucket} bucket debited when money moves into it?`,
    modelAnswer: `The ${p.bucket} bucket is an asset, and an asset increases on the debit side, so money coming in is written as a debit.`,
    rubric: [`Says the ${p.bucket} bucket is an asset`, 'Says an asset increases with a debit'],
  }),
};

const DEMO_GATE = {
  id: 'demo',
  title: 'Practice gate (demonstration)',
  kind: 'gate',
  alwaysOpen: true,
  // The 10-question gate shape: copies under new ids get their own numbers.
  templates: [
    savingShare, blowMoney, ...[2, 3, 4].map((n) => ({ ...savingShare, id: `${savingShare.id}-${n}` })), ...[2, 3].map((n) => ({ ...blowMoney, id: `${blowMoney.id}-${n}` })),
    recordTransfer, { ...recordTransfer, id: `${recordTransfer.id}-2` },
    explainDebit,
  ],
};
};

defs["content/assess/exam.js"] = function (exports, require, define) {
const { MODULES } = require("content/course.js");
const { M01_CHECKPOINT } = require("content/modules/m01.js");
const { M02_CHECKPOINT } = require("content/modules/m02.js");
const { M03_CHECKPOINT } = require("content/modules/m03.js");
const { M04_CHECKPOINT } = require("content/modules/m04.js");
const { M05_CHECKPOINT } = require("content/modules/m05.js");
const { M06_CHECKPOINT, M06_GATE } = require("content/modules/m06.js");
const { M07_CHECKPOINT, M07_GATE } = require("content/modules/m07.js");
const { M08_CHECKPOINT } = require("content/modules/m08.js");
const { M09_CHECKPOINT, M09_GATE } = require("content/modules/m09.js");
const { M10_CHECKPOINT, M10_GATE } = require("content/modules/m10.js");
const { M11_CHECKPOINT } = require("content/modules/m11.js");
const { M12_CHECKPOINT } = require("content/modules/m12.js");
const { M13_GATE } = require("content/modules/m13.js");
const { M14_GATE } = require("content/modules/m14.js");
const { A1_GATE } = require("content/modules/a1.js");
const { A2_GATE } = require("content/modules/a2.js");
const { A3_GATE } = require("content/modules/a3.js");
define(exports, { EXAM_CORE: () => EXAM_CORE, EXAM_ADDON: () => EXAM_ADDON, FINAL_EXAM: () => FINAL_EXAM });
// The final exam (author's rules, October 24, 2026): 50 questions, pass at
// 80% of the points, untimed, taken after the add-on. At most 20% of the
// questions and of the points come from the add-on (here 8 of 50). Every
// core module is represented: each module's checkpoint questions, Modules 13
// and 14's own (with an explaining question each), and one more
// read-and-predict question for four of the modules that give a checkpoint
// only two. The author's note on honest work is shown
// before the first question (js/app/assess.js).




















const byId = (gate, id) => {
  const t = gate.templates.find((x) => x.id === id);
  if (!t) throw new Error(`No template ${id} in ${gate.id}`);
  return t;
};
// The first read-and-predict question of a gate that is not already used and
// is not a fluency drill.
const anotherInterpreting = (gate, used) => gate.templates.find((t) => t.part === 'interpreting' && !/-drill-/.test(t.id) && !used.some((u) => u.id === t.id));

const CHECKPOINT_QUESTIONS = [
  M01_CHECKPOINT, M02_CHECKPOINT, M03_CHECKPOINT, M04_CHECKPOINT, M05_CHECKPOINT, M06_CHECKPOINT,
  M07_CHECKPOINT, M08_CHECKPOINT, M09_CHECKPOINT, M10_CHECKPOINT, M11_CHECKPOINT, M12_CHECKPOINT,
];
const EXTRA = [[M06_GATE, M06_CHECKPOINT], [M07_GATE, M07_CHECKPOINT], [M09_GATE, M09_CHECKPOINT], [M10_GATE, M10_CHECKPOINT]]
  .map(([gate, used]) => anotherInterpreting(gate, used));

const EXAM_CORE = [
  ...CHECKPOINT_QUESTIONS.flat(),
  ...EXTRA,
  byId(M13_GATE, 'm13-essential-total'), byId(M13_GATE, 'm13-minimum-fund'), byId(M13_GATE, 'm13-record-fund'), byId(M13_GATE, 'm13-explain'),
  byId(M14_GATE, 'm14-price-after'), byId(M14_GATE, 'm14-sinking-monthly'), byId(M14_GATE, 'm14-record-plan'), byId(M14_GATE, 'm14-explain'),
];
const EXAM_ADDON = [
  byId(A1_GATE, 'a1-fed-buys'), byId(A1_GATE, 'a1-m2-growth'), byId(A1_GATE, 'a1-record-fed'),
  byId(A2_GATE, 'a2-cpi-per-100'), byId(A2_GATE, 'a2-borrowed-per-100'), byId(A2_GATE, 'a2-profit-per-100'),
  byId(A3_GATE, 'a3-max-contribution'), byId(A3_GATE, 'a3-traditional-kept'),
];

// Questions in course order, so the exam reads like the course.
const order = (t) => MODULES.findIndex((m) => m.id === t.module);
const FINAL_EXAM = {
  id: 'exam',
  kind: 'exam',
  title: 'Final exam',
  templates: [...EXAM_CORE, ...EXAM_ADDON].sort((a, b) => order(a) - order(b)),
};
};

defs["content/assess/index.js"] = function (exports, require, define) {
const { DEMO_GATE } = require("content/assess/demo.js");
const { PREREQ_CHECK } = require("content/assess/prereq.js");
const { M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL } = require("content/modules/m01.js");
const { M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL } = require("content/modules/m02.js");
const { M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL } = require("content/modules/m03.js");
const { M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL } = require("content/modules/m04.js");
const { M05_GATE, M05_PRACTICE, M05_EXTRA, M05_REMEDIAL } = require("content/modules/m05.js");
const { M06_GATE, M06_PRACTICE, M06_EXTRA, M06_REMEDIAL } = require("content/modules/m06.js");
const { M07_GATE, M07_PRACTICE, M07_EXTRA, M07_REMEDIAL } = require("content/modules/m07.js");
const { M08_GATE, M08_PRACTICE, M08_EXTRA, M08_REMEDIAL } = require("content/modules/m08.js");
const { M09_GATE, M09_PRACTICE, M09_EXTRA, M09_REMEDIAL } = require("content/modules/m09.js");
const { M10_GATE, M10_PRACTICE, M10_EXTRA, M10_REMEDIAL } = require("content/modules/m10.js");
const { M11_GATE, M11_PRACTICE, M11_EXTRA, M11_REMEDIAL } = require("content/modules/m11.js");
const { M12_GATE, M12_PRACTICE, M12_EXTRA, M12_REMEDIAL } = require("content/modules/m12.js");
const { M13_GATE, M13_PRACTICE, M13_EXTRA, M13_REMEDIAL } = require("content/modules/m13.js");
const { M14_GATE, M14_PRACTICE, M14_EXTRA, M14_REMEDIAL } = require("content/modules/m14.js");
const { A1_GATE, A1_PRACTICE, A1_EXTRA, A1_REMEDIAL } = require("content/modules/a1.js");
const { A2_GATE, A2_PRACTICE, A2_EXTRA, A2_REMEDIAL } = require("content/modules/a2.js");
const { A3_GATE, A3_PRACTICE, A3_EXTRA, A3_REMEDIAL } = require("content/modules/a3.js");
const { CHECKPOINT_A } = require("content/assess/ca.js");
const { CHECKPOINT_B } = require("content/assess/cb.js");
const { CHECKPOINT_C } = require("content/assess/cc.js");
const { PLACEMENT_A, PLACEMENT_B } = require("content/assess/placement.js");
const { FINAL_EXAM } = require("content/assess/exam.js");
const { RETENTION } = require("content/assess/retention.js");
define(exports, { ASSESSMENTS: () => ASSESSMENTS });
// Every check in the course, by id: module gates, checkpoints, placement
// tests, the prerequisite check, the final exam and the retention test.



























const byId = (...list) => Object.fromEntries(list.map((a) => [a.id, a]));

const ASSESSMENTS = byId(
  DEMO_GATE, PREREQ_CHECK,
  M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL,
  M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL,
  M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL,
  M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL,
  CHECKPOINT_A,
  M05_GATE, M05_PRACTICE, M05_EXTRA, M05_REMEDIAL,
  M06_GATE, M06_PRACTICE, M06_EXTRA, M06_REMEDIAL,
  M07_GATE, M07_PRACTICE, M07_EXTRA, M07_REMEDIAL,
  M08_GATE, M08_PRACTICE, M08_EXTRA, M08_REMEDIAL,
  CHECKPOINT_B, PLACEMENT_A, PLACEMENT_B,
  M09_GATE, M09_PRACTICE, M09_EXTRA, M09_REMEDIAL,
  M10_GATE, M10_PRACTICE, M10_EXTRA, M10_REMEDIAL,
  M11_GATE, M11_PRACTICE, M11_EXTRA, M11_REMEDIAL,
  M12_GATE, M12_PRACTICE, M12_EXTRA, M12_REMEDIAL,
  CHECKPOINT_C,
  M13_GATE, M13_PRACTICE, M13_EXTRA, M13_REMEDIAL,
  M14_GATE, M14_PRACTICE, M14_EXTRA, M14_REMEDIAL,
  A1_GATE, A1_PRACTICE, A1_EXTRA, A1_REMEDIAL,
  A2_GATE, A2_PRACTICE, A2_EXTRA, A2_REMEDIAL,
  A3_GATE, A3_PRACTICE, A3_EXTRA, A3_REMEDIAL,
  FINAL_EXAM, RETENTION,
);
};

defs["content/assess/placement.js"] = function (exports, require, define) {
const { CHECKPOINT_A_TEMPLATES } = require("content/assess/ca.js");
const { CHECKPOINT_B_TEMPLATES } = require("content/assess/cb.js");
define(exports, { PLACEMENT_A: () => PLACEMENT_A, PLACEMENT_B: () => PLACEMENT_B });
// Placement tests (proposal: "Placement"), 10 questions each, built from the
// checkpoint each one stands in for: placement-ca (Modules 1–4) opens Module 5;
// placement-cb (Modules 5–8, open after placement-ca) opens Module 9. Optional.




const PLACEMENT_A = {
  id: 'placement-ca',
  kind: 'placement',
  checkpointId: 'ca',
  title: 'Placement test: start at Module 5',
  templates: CHECKPOINT_A_TEMPLATES,
};

// The second stage (author's ruling): after Modules 1–4 are counted as
// passed, this covers Modules 5–8 with Checkpoint B's 10 questions, so
// skipping eight modules takes 20 questions in two tests.
const PLACEMENT_B = {
  id: 'placement-cb',
  kind: 'placement',
  checkpointId: 'cb',
  title: 'Placement test: start at Module 9 (step 2 of 2)',
  templates: CHECKPOINT_B_TEMPLATES,
};
};

defs["content/assess/prereq.js"] = function (exports, require, define) {
const { percentOf } = require("js/money.js");
const { money, exactPercent } = require("content/helpers.js");
define(exports, { PREREQ_CHECK: () => PREREQ_CHECK });
// The prerequisite check (10 questions, like every quiz): money arithmetic
// the course assumes. Learners who
// score below 80% are pointed to the remedial unit (lesson.html?m=prereq).




const t = (id, params, build) => ({ id, module: 'prereq', kind: 'numeric', part: 'interpreting', points: 1, params, build });

const PREREQ_CHECK = {
  id: 'prereq',
  kind: 'prereq',
  title: 'Before you start: a quick money check',
  alwaysOpen: true,
  templates: [
    t('pre-add', { a: { min: 1050, max: 9999, step: 1 }, b: { min: 125, max: 4999, step: 1 } }, (p) => ({
      prompt: `Add ${money(p.a)} and ${money(p.b)}.`, answer: p.a + p.b,
      explanation: `Line up the decimal points: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
    })),
    t('pre-subtract', { a: { min: 5000, max: 20000, step: 1 }, b: { min: 101, max: 4999, step: 1 } }, (p) => ({
      prompt: `You have ${money(p.a)} and spend ${money(p.b)}. How much is left?`, answer: p.a - p.b,
      misconceptions: [{ cents: p.a + p.b, explanation: 'Spending takes money away, so subtract.' }],
      explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
    })),
    t('pre-change', { cost: { min: 1101, max: 1999, step: 1 } }, (p) => ({
      prompt: `Something costs ${money(p.cost)} and you pay with a $20 bill. How much change do you get?`, answer: 2000 - p.cost,
      explanation: `$20.00 − ${money(p.cost)} = ${money(2000 - p.cost)}.`,
    })),
    t('pre-ten-percent', { a: { min: 10000, max: 99900, step: 10 } }, (p) => ({
      prompt: `What is 10% of ${money(p.a)}?`, answer: percentOf(p.a, 0.1),
      misconceptions: [{ cents: percentOf(p.a, 0.01), explanation: 'That is 1%. For 10%, move the decimal point one place left.' }],
      explanation: `10% is one tenth: ${money(percentOf(p.a, 0.1))}.`,
    })),
    t('pre-fifteen-percent', { a: { min: 2000, max: 40000, step: 100 } }, (p) => ({
      prompt: `What is 15% of ${money(p.a)}?`, answer: percentOf(p.a, 0.15),
      misconceptions: [{ cents: percentOf(p.a, 0.015), explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
      explanation: `10% is ${exactPercent(p.a, 0.1)} and 5% is ${exactPercent(p.a, 0.05)}, so 15% is ${exactPercent(p.a, 0.15)}, which rounds to ${money(percentOf(p.a, 0.15))}.`,
    })),
    t('pre-round', { a: { min: 50001, max: 150000, step: 1 } }, (p) => ({
      prompt: `What is 6.2% of ${money(p.a)}, rounded to the cent?`, answer: percentOf(p.a, 0.062),
      explanation: `6.2% is 0.062, and 0.062 × ${money(p.a)} = ${exactPercent(p.a, 0.062)}. Look at the thousandths digit: 4 and below, keep it below; 5 and above, give it a shove. The answer is ${money(percentOf(p.a, 0.062))}.`,
    })),
    t('pre-times', { a: { min: 199, max: 1999, step: 1 }, n: { pick: [2, 3, 4, 5] } }, (p) => ({
      prompt: `A bus pass costs ${money(p.a)}. How much do ${p.n} passes cost?`, answer: p.a * p.n,
      explanation: `${p.n} × ${money(p.a)} = ${money(p.a * p.n)}.`,
    })),
    t('pre-total', { a: { min: 100, max: 3000, step: 1 }, b: { min: 100, max: 3000, step: 1 }, c: { min: 100, max: 3000, step: 1 } }, (p) => ({
      prompt: `Add up three receipts: ${money(p.a)}, ${money(p.b)} and ${money(p.c)}.`, answer: p.a + p.b + p.c,
      explanation: `${money(p.a)} + ${money(p.b)} + ${money(p.c)} = ${money(p.a + p.b + p.c)}.`,
    })),
    t('pre-five-percent', { a: { min: 2000, max: 60000, step: 10 } }, (p) => ({
      prompt: `What is 5% of ${money(p.a)}?`, answer: percentOf(p.a, 0.05),
      misconceptions: [{ cents: percentOf(p.a, 0.5), explanation: 'That is 50%. 5% is half of 10%.' }],
      explanation: `10% is ${exactPercent(p.a, 0.1)}, and 5% is half of that: ${exactPercent(p.a, 0.05)}, which rounds to ${money(percentOf(p.a, 0.05))}.`,
    })),
    t('pre-hours', { hours: { min: 3, max: 9, step: 1 }, rate: { pick: [1250, 1515, 1600, 1875] } }, (p) => ({
      prompt: `You work ${p.hours} hours at ${money(p.rate)} an hour. How much do you earn?`, answer: p.hours * p.rate,
      explanation: `${p.hours} × ${money(p.rate)} = ${money(p.hours * p.rate)}.`,
    })),
  ],
};
};

defs["content/assess/retention.js"] = function (exports, require, define) {
const { M02_GATE } = require("content/modules/m02.js");
const { M03_GATE } = require("content/modules/m03.js");
const { M04_GATE } = require("content/modules/m04.js");
const { M05_GATE } = require("content/modules/m05.js");
const { M07_GATE } = require("content/modules/m07.js");
const { M08_GATE } = require("content/modules/m08.js");
const { M10_GATE } = require("content/modules/m10.js");
const { M11_GATE } = require("content/modules/m11.js");
const { M12_GATE } = require("content/modules/m12.js");
const { M13_GATE } = require("content/modules/m13.js");
define(exports, { RETENTION: () => RETENTION });
// The four-week review (retention test): 10 questions from the main course
// only, opened 28 days after the final exam is passed (js/progress.js). It
// measures what stuck, for the course's evaluation; nothing is locked by it.












// From each gate, its last read-and-predict question that is not a drill
// (the exam draws from the start of the lists).
const lastInterpreting = (gate) => gate.templates.filter((t) => t.part === 'interpreting' && !/-drill-/.test(t.id)).at(-1);

const RETENTION = {
  id: 'retention',
  kind: 'retention',
  title: 'Four-week review',
  templates: [M02_GATE, M03_GATE, M04_GATE, M05_GATE, M07_GATE, M08_GATE, M10_GATE, M11_GATE, M12_GATE, M13_GATE].map(lastInterpreting),
};
};

defs["content/celebration.js"] = function (exports, require, define) {
define(exports, { AUTHOR_WORDS: () => AUTHOR_WORDS, CELEBRATION: () => CELEBRATION });
// The celebration shown when a learner passes the final exam (author's
// request, October 25, 2026). The author's words: "Congratulations! You have
// passed! Your ancestors and God almighty are proud of your accomplishment!
// It's okay to smile now!" A Sonnet agent adapted them, as the author allowed;
// the music is the author's chosen recording (media/NOTICE.md).

const AUTHOR_WORDS = 'Congratulations! You have passed! Your ancestors and God almighty are proud of your accomplishment! It\'s okay to smile now!';

const CELEBRATION = {
  headline: 'Congratulations!',
  message: 'You have passed! You kept and proved a full month of books, and now you can follow every dollar. You earned this, and your ancestors and God almighty are proud of your accomplishment. It\'s okay to smile now!',
  button: 'Start the celebration',
  music: 'media/ode-to-joy-finale.mp3',
  musicCredit: 'Music: Ludwig van Beethoven, "Ode to Joy" (Symphony No. 9, finale; words by Friedrich Schiller). The recording is not covered by the course license.',
  musicNotice: { href: 'media/notice.html', text: 'Read the music notice' },
};
};

defs["content/course.js"] = function (exports, require, define) {
define(exports, { PHASES: () => PHASES, MODULES: () => MODULES, PREREQUISITE: () => PREREQUISITE, CHECKPOINTS: () => CHECKPOINTS });
// Course structure: modules in teaching order, the ideas each one introduces,
// and the cumulative checkpoints. Source: docs/design.md, section 4.

const PHASES = {
  foundations: 'Weeks 1–2: Foundations',
  core: 'Weeks 3–4: Core bookkeeping',
  extension: 'Weeks 5–6: Proving and planning',
  integration: 'Weeks 7–8: Saving ahead and the final project',
  addon: 'Add-on: the Fed, inflation and IRAs',
};

const MODULES = [
  { id: 'm01', title: 'What money is', phase: 'foundations',
    ideas: ['money-uses', 'five-buckets', 'page-per-bucket'] },
  { id: 'm02', title: 'The ledger page', phase: 'foundations',
    ideas: ['ledger-columns', 'running-balance', 'carry-forward'] },
  { id: 'm03', title: 'Debit and credit', phase: 'foundations',
    ideas: ['accounting-equation', 'debit-credit-rules', 'equal-sides'] },
  { id: 'm04', title: 'Your paycheck', phase: 'foundations',
    ideas: ['gross-vs-net', 'paycheck-deductions', 'recording-paycheck'] },

  { id: 'm05', title: 'Your chart of accounts', phase: 'core',
    ideas: ['personal-accounts', 'account-numbers', 'folio-reference'] },
  { id: 'm06', title: 'The journal and posting', phase: 'core',
    ideas: ['journal-entry', 'posting', 'posted-marks'] },
  { id: 'm07', title: 'Everyday spending', phase: 'core',
    ideas: ['source-documents', 'recording-purchases', 'transfers'] },
  { id: 'm08', title: 'Credit cards and debt', phase: 'core',
    ideas: ['card-as-liability', 'card-entries', 'minimum-payment-cost'] },

  { id: 'm09', title: 'Proving your books', phase: 'extension',
    ideas: ['trial-balance', 'common-errors', 'error-by-size'] },
  { id: 'm10', title: 'Matching the bank', phase: 'extension',
    ideas: ['bank-reconciliation', 'outstanding-items', 'bank-fee-interest-entries'] },
  { id: 'm11', title: 'Budgeting with logic', phase: 'extension',
    ideas: ['budget-as-ledger', 'budget-vs-actual', 'spending-rules'] },
  { id: 'm12', title: 'Month-end', phase: 'extension',
    ideas: ['closing-entries', 'income-statement', 'net-worth-statement'] },

  { id: 'm13', title: 'The emergency fund', phase: 'integration',
    ideas: ['essential-expenses', 'fund-sizing', 'fund-rules'] },
  { id: 'm14', title: 'Planning ahead', phase: 'integration',
    ideas: ['buying-power', 'compound-interest', 'sinking-funds'] },
  { id: 'm15', title: 'Final project I: plan your month', phase: 'integration', ideas: [] },
  { id: 'm16', title: 'Final project II: keep, prove and report', phase: 'integration', ideas: [] },

  { id: 'a1', title: 'The Federal Reserve', phase: 'addon',
    ideas: ['what-the-fed-is', 'money-flows', 'fed-money-supply'] },
  { id: 'a2', title: 'Inflation and its causes', phase: 'addon',
    ideas: ['measuring-inflation', 'accepted-causes', 'corporate-pricing'] },
  { id: 'a3', title: 'IRAs and saving for later', phase: 'addon',
    ideas: ['what-an-ira-is', 'traditional-vs-roth', 'limits-and-growth'] },
];

// The prerequisite check and its remedial unit teach the arithmetic the
// course assumes. These ideas sit outside the 42-idea budget and may be used
// anywhere in the course.
const PREREQUISITE = {
  id: 'prereq',
  title: 'Before you start: money arithmetic',
  ideas: ['decimals', 'percentages', 'adding-money'],
};

const CHECKPOINTS = [
  { id: 'ca', after: 'm04' },
  { id: 'cb', after: 'm08' },
  { id: 'cc', after: 'm12' },
];
};

defs["content/helpers.js"] = function (exports, require, define) {
const { percentOf, formatCents } = require("js/money.js");
const { paycheck } = require("js/paycheck.js");
const { TAX_2026 } = require("content/tax2026.js");
const { runningBalances } = require("js/ledger.js");
define(exports, { money: () => money, NAMES: () => NAMES, BUCKET_RATES: () => BUCKET_RATES, splitBuckets: () => splitBuckets, standardPaycheck: () => standardPaycheck, PAYCHECK_SOURCES: () => PAYCHECK_SOURCES, payStub: () => payStub, explainTemplate: () => explainTemplate, exactPercent: () => exactPercent, monthlyInterest: () => monthlyInterest, exactMonthlyInterest: () => exactMonthlyInterest, MINIMUM_RULE: () => MINIMUM_RULE, minimumPayment: () => minimumPayment, payoff: () => payoff, per100: () => per100, bookPage: () => bookPage, CHART: () => CHART, accountLabel: () => accountLabel, accountOptions: () => accountOptions, chartPage: () => chartPage, journal: () => journal, trialBalanceFrom: () => trialBalanceFrom });
// Shared building blocks for course content.






const money = (cents) => `$${formatCents(cents)}`;

const NAMES = ['Jordan', 'Maya', 'Luis', 'Ana', 'Devon', 'Kai', 'Rosa', 'Eli'];

// The course's suggested split of take-home pay. Spending gets whatever is
// left after the other four, so the buckets always add up to the paycheck.
const BUCKET_RATES = { saving: 0.15, investing: 0.10, charity: 0.05, blow: 0.10 };

function splitBuckets(takeHomeCents) {
  const saving = percentOf(takeHomeCents, BUCKET_RATES.saving);
  const investing = percentOf(takeHomeCents, BUCKET_RATES.investing);
  const charity = percentOf(takeHomeCents, BUCKET_RATES.charity);
  const blow = percentOf(takeHomeCents, BUCKET_RATES.blow);
  return { saving, investing, charity, blow, spending: takeHomeCents - saving - investing - charity - blow };
}

// A two-week paycheck at the 2026 Arizona minimum wage.
function standardPaycheck(hours = 80) {
  return paycheck({ rateCents: TAX_2026.azMinimumWageCents, hours, tax: TAX_2026 });
}

const PAYCHECK_SOURCES = ['azica-min-wage-2026', 'ssa-cola-2026', 'irs-p15t-2026', 'azdor-a4-2026'];

// A pay stub as a source document (amounts in cents).
function payStub(hours, { employer = 'Sunny Days Car Wash (fictional)', detail = true } = {}) {
  const p = standardPaycheck(hours);
  const lines = [
    ['Employer', employer],
    ['Hours', `${hours} at $15.15`],
    ['Gross pay', p.gross],
  ];
  if (detail) {
    lines.push(['Social Security (6.2%)', p.socialSecurity], ['Medicare (1.45%)', p.medicare], ['Federal income tax', p.federal], ['Arizona income tax (2.0%)', p.arizona], ['Take-home pay', p.net]);
  }
  return { kind: 'paystub', title: 'Pay stub: two weeks', lines, note: 'Employer is fictional; rates are the real 2026 figures.' };
}

// Builds an explanation template from a list of prompt variants, so each
// gate version asks a differently worded question.
function explainTemplate({ id, module, part = 'explaining', points = 2, variants }) {
  return {
    id, module, kind: 'explain', part, points,
    params: { variant: { pick: variants.map((_, i) => i) } },
    build: (p) => ({ ...variants[p.variant] }),
  };
}

// The exact, unrounded percentage of an amount, written as dollars (at least
// two decimal places): exactPercent(121200, 0.062) -> "$75.144". Explanations
// show this so learners round once, at the end.
function exactPercent(cents, rate) {
  const scaled = BigInt(Math.round(rate * 1e6)) * BigInt(cents); // dollars × 10^8
  const whole = scaled / 100000000n;
  let frac = (scaled % 100000000n).toString().padStart(8, '0').replace(/0+$/, '');
  if (frac.length < 2) frac = frac.padEnd(2, '0');
  return `$${whole.toLocaleString('en-US')}.${frac}`;
}

// --- Credit cards (Module 8) -------------------------------------------------
// APRs are whole basis points (22.15% = 2215). A month's interest is taught as
// balance × APR ÷ 12; the exact amount is cut after the thousandths of a
// dollar and rounded once by the thousandths rule. (Card companies work it
// out day by day; the lesson says so.)

function monthlyInterest(balanceCents, aprBasisPoints) {
  if (!Number.isSafeInteger(balanceCents) || balanceCents < 0) throw new TypeError(`Expected whole cents, got ${balanceCents}`);
  const tenthsOfCents = (BigInt(balanceCents) * BigInt(aprBasisPoints) * 10n) / 120000n;
  return Number(tenthsOfCents / 10n + (tenthsOfCents % 10n >= 5n ? 1n : 0n));
}

// The unrounded month's interest in dollars, to four decimal places, with
// "…" when more digits follow: exactMonthlyInterest(50000, 2215) -> "$9.2291…".
function exactMonthlyInterest(balanceCents, aprBasisPoints) {
  const numerator = BigInt(balanceCents) * BigInt(aprBasisPoints); // cents × 120000
  const tenThousandths = (numerator * 100n) / 120000n; // dollars × 10^4
  const more = (numerator * 100n) % 120000n !== 0n;
  const whole = tenThousandths / 10000n;
  let frac = (tenThousandths % 10000n).toString().padStart(4, '0');
  if (!more) frac = frac.replace(/0+$/, '').padEnd(2, '0');
  return `$${whole.toLocaleString('en-US')}.${frac}${more ? '…' : ''}`;
}

// The course's example minimum-payment rule: the month's interest plus 1% of
// the balance, or $25.00 if that is more, but never more than is owed.
const MINIMUM_RULE = 'the month\'s interest plus 1% of the balance, or $25.00 if that is more';

function minimumPayment(balanceCents, interestCents) {
  const rule = Math.max(2500, interestCents + percentOf(balanceCents, 0.01));
  return Math.min(rule, balanceCents + interestCents);
}

// Month-by-month payoff with no new charges: { months, interest, rows }.
// Pays the example minimum unless a fixed monthly payment is given.
function payoff(balanceCents, aprBasisPoints, { payment = null } = {}) {
  const rows = [];
  let balance = balanceCents;
  let interest = 0;
  while (balance > 0) {
    const charge = monthlyInterest(balance, aprBasisPoints);
    const paid = payment === null ? minimumPayment(balance, charge) : Math.min(payment, balance + charge);
    if (paid <= charge) throw new Error('This payment never pays the balance off: it does not cover the interest.');
    balance = balance + charge - paid;
    interest += charge;
    rows.push({ interest: charge, payment: paid, balance });
  }
  return { months: rows.length, interest, rows };
}

// --- Add-on modules: per $100 and other books -----------------------------------

// How many dollars of `whole` the part is per $100.00, in cents, rounded by
// the thousandths of a dollar: per100(1511900, 8205900) -> 1842 ($18.42).
// Inputs are whole numbers in any one unit (cents, millions, index points).
function per100(part, whole) {
  if (!Number.isSafeInteger(part) || !Number.isSafeInteger(whole) || whole <= 0 || part < 0) throw new TypeError(`per100 needs whole numbers, got ${part} and ${whole}`);
  const tenthsOfCents = (BigInt(part) * 100000n) / BigInt(whole);
  return Number(tenthsOfCents / 10n + (tenthsOfCents % 10n >= 5n ? 1n : 0n));
}

// A ledger page in books other than the learner's own (the Fed's, a bank's,
// the government's), with the same row shape as chartPage. Its account
// number is a short label such as "F1".
function bookPage({ name, account, accountNo, type, sheetNo = 1 }, rows, { askFrom = null, askKeys = ['balance', 'side'] } = {}) {
  return {
    sheetNo, accountNo, name, account, type,
    rows: rows.map(([date, items, folio, debit, credit, ticked = false], i) => ({
      date, items, folio, debit, credit, posted: [ticked && debit > 0, ticked && credit > 0],
      ...(askFrom !== null && i >= askFrom ? { ask: [...askKeys] } : {}),
    })),
  };
}

// --- The chart of accounts (Module 5 on) --------------------------------------
// Numbers are grouped by kind: 1–19 assets, 20–29 liabilities, 30 net worth,
// 40–49 income, 50–99 expenses.

const CHART = {
  checking: { no: 1, name: 'Checking', type: 'asset' },
  spending: { no: 2, name: 'Spending bucket', type: 'asset' },
  saving: { no: 3, name: 'Saving bucket', type: 'asset' },
  investing: { no: 4, name: 'Investing bucket', type: 'asset' },
  charity: { no: 5, name: 'Charity bucket', type: 'asset' },
  blow: { no: 6, name: 'Blow money', type: 'asset' },
  cash: { no: 7, name: 'Cash', type: 'asset' },
  // Named sub-pages of the Saving bucket (Modules 13 and 14).
  emergency: { no: 8, name: 'Emergency fund', type: 'asset' },
  sinking: { no: 9, name: 'Sinking fund', type: 'asset' },
  // Add-on A3: an IRA, filled from the Investing bucket.
  ira: { no: 10, name: 'IRA', type: 'asset' },
  'owed-friend': { no: 20, name: 'Owed to a friend', type: 'liability' },
  card: { no: 21, name: 'Credit card', type: 'liability' },
  'net-worth': { no: 30, name: 'Net worth', type: 'networth' },
  wages: { no: 40, name: 'Wages', type: 'income' },
  gifts: { no: 41, name: 'Gifts received', type: 'income' },
  'interest-earned': { no: 42, name: 'Interest earned', type: 'income' },
  taxes: { no: 50, name: 'Taxes withheld', type: 'expense' },
  rent: { no: 51, name: 'Rent', type: 'expense' },
  groceries: { no: 52, name: 'Groceries', type: 'expense' },
  'eating-out': { no: 53, name: 'Eating out', type: 'expense' },
  transport: { no: 54, name: 'Transportation', type: 'expense' },
  phone: { no: 55, name: 'Phone', type: 'expense' },
  fun: { no: 56, name: 'Fun', type: 'expense' },
  donations: { no: 57, name: 'Donations', type: 'expense' },
  'card-interest': { no: 58, name: 'Card interest', type: 'expense' },
  household: { no: 59, name: 'Household supplies', type: 'expense' },
  'bank-fees': { no: 60, name: 'Bank fees', type: 'expense' },
  insurance: { no: 61, name: 'Insurance', type: 'expense' },
  utilities: { no: 62, name: 'Utilities', type: 'expense' },
};

// Labels give the number and name only: from Module 5 the learner tells the
// kind of account from its number.
const accountLabel = (id) => `${CHART[id].no} ${CHART[id].name}`;
const accountOptions = (ids) => ids.map((id) => ({ id, label: accountLabel(id) }));

// A ledger page for an account in the chart. Rows are
// [date, items, folio, debit, credit, ticked?]; a ticked row has the posting
// mark on the side its amount is on. Rows from askFrom on ask for askKeys
// (the balance and side, unless the amounts are to be posted too).
function chartPage(id, rows, { name = 'Jordan (example)', sheetNo = 1, askFrom = null, askKeys = ['balance', 'side'], creditLimit } = {}) {
  const a = CHART[id];
  return {
    sheetNo, accountNo: a.no, name, account: a.name, type: a.type,
    ...(creditLimit ? { creditLimit } : {}),
    rows: rows.map(([date, items, folio, debit, credit, ticked = false], i) => ({
      date, items, folio, debit, credit, posted: [ticked && debit > 0, ticked && credit > 0],
      ...(askFrom !== null && i >= askFrom ? { ask: [...askKeys] } : {}),
    })),
  };
}

// A journal page. Entries are [date, folio, explanation, lines], with lines
// [accountId, debit, credit, posted?]; a posted line shows the ledger
// account number in the journal's Folio column.
function journal(entries, { sheetNo = 1, name = 'Jordan (example)' } = {}) {
  return {
    sheetNo, name,
    entries: entries.map(([date, folio, explanation, lines]) => ({
      date, folio, explanation,
      lines: lines.map(([account, debit, credit, posted = false]) => ({ account, label: CHART[account].name, debit, credit, folio: posted ? String(CHART[account].no) : '' })),
    })),
  };
}

// A trial balance built from ledger pages: each page's closing balance on
// its side, in account-number order. Pages with no balance are left out.
function trialBalanceFrom(pages, { name = pages[0]?.name ?? '', date, ask } = {}) {
  const accounts = pages
    .map((page) => ({ page, last: runningBalances(page).at(-1) }))
    .filter(({ last }) => last && last.balance > 0)
    .sort((a, b) => a.page.accountNo - b.page.accountNo)
    .map(({ page, last }) => ({ no: page.accountNo, name: page.account, [last.side === 'Dr' ? 'debit' : 'credit']: last.balance }));
  return { report: 'trial-balance', name, date, accounts, ...(ask ? { ask } : {}) };
}
};

defs["content/honor.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
define(exports, { HONOR_NOTE_ORIGINAL: () => HONOR_NOTE_ORIGINAL, HONOR_SIGNATURE: () => HONOR_SIGNATURE, HONOR_NOTES: () => HONOR_NOTES, honorNoteHTML: () => honorNoteHTML });
// The author's note on honest work. His own words are kept below as the
// record; a Sonnet agent adapted them, at his request, for two places: the
// home page before Module 1, and the final exam before its first question.



const HONOR_NOTE_ORIGINAL = 'Do not use AI for answers or ask other people for answers. This is a course to better yourself. There is no money reward. There is no benefit for cheating. If you cheat, then you only hurt yourself. Alexander the Great did not achieve greatness over the world because he cheated, Marcus Aurelius did not strengthen the Roman Empire by cheating, and no man was ever granted objective acknowledgement of greatness by cheating. He earned it. Be the man or woman that your ancestors imagined you to be. Earn your certificate.';

const HONOR_SIGNATURE = '— Raul Bautista, author of Personal Bookkeeping 101';

const HONOR_NOTES = {
  start: {
    title: 'A note from the author',
    paragraphs: [
      'Welcome. Before you begin Module 1, I want to ask one thing of you.',
      'Do the checks and the final exam on your own. Please do not use AI for answers, and do not ask other people for answers. This course is free. There is no money reward, and there is no benefit in cheating. If you cheat, you only hurt yourself.',
      'Alexander the Great did not conquer much of the world by cheating. Marcus Aurelius did not strengthen the Roman Empire by cheating. No one was ever granted real recognition of greatness by cheating. They earned it.',
      'Be the person your ancestors imagined you to be. Take your time, reread when you need to, and make mistakes along the way. That is how you learn. Earn your certificate.',
    ],
  },
  exam: {
    title: 'Before you begin',
    paragraphs: [
      'This exam is yours alone. No AI, and no one else giving you answers. There is no money reward and no benefit in cheating. If you cheat, you only hurt yourself.',
      'Alexander the Great and Marcus Aurelius did not achieve greatness by cheating. No one ever has. They earned it.',
      'Be the person your ancestors imagined you to be. Breathe, take your time, and do your own work. Earn your certificate.',
    ],
  },
};

function honorNoteHTML(which) {
  const note = HONOR_NOTES[which];
  const id = `author-note-${which}`;
  const paragraphs = note.paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('');
  return `<section class="author-note" aria-labelledby="${id}"><h2 id="${id}">${escapeHTML(note.title)}</h2>${paragraphs}<p class="author-note-signature">${escapeHTML(HONOR_SIGNATURE)}</p></section>`;
}
};

defs["content/modules/a1.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, bookPage, per100 } = require("content/helpers.js");
const { M2, M2_SOURCE, monthName } = require("content/addonData.js");
const { M12_LESSON } = require("content/modules/m12.js");
const { M13_LESSON } = require("content/modules/m13.js");
const { M14_LESSON, M14_GATE } = require("content/modules/m14.js");
define(exports, { A1_LESSON: () => A1_LESSON, A1_PRACTICE: () => A1_PRACTICE, A1_EXTRA: () => A1_EXTRA, A1_REMEDIAL: () => A1_REMEDIAL, A1_GATE: () => A1_GATE });
// Add-on A1: The Federal Reserve. Ideas: what-the-fed-is, money-flows,
// fed-money-supply. Money moving among people, banks, the government and the
// Fed is shown on simplified ledger pages, one set of books per institution:
// the Fed (F1 Treasury securities, F2 Banks' reserves, F3 Treasury's account),
// a bank (B1 Reserves at the Fed, B2 Customers' deposits, B3 Treasury
// securities) and the Treasury (T1 Account at the Fed). The bank, the people
// and the everyday amounts are fictional (illustrative); the history and the
// money-supply figures are cited.







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
// The lesson's guided step asks December's new money, so the check asks the
// other four ways (and December only as "became").
const M2_ASKS = [[M2_PAIRS[0], 'new'], [M2_PAIRS[0], 'became'], [M2_PAIRS[1], 'new'], [M2_PAIRS[1], 'became'], [M2_PAIRS[2], 'became']];
const m2Growth = num('a1-m2-growth', 'interpreting', { which: { pick: M2_ASKS } }, (p) => {
  const [[from, to], ask] = p.which;
  p = { ...p, ask };
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
    explanation: `${billions(M2[to])} ÷ ${billions(M2[from])} × $100.00 = ${money(became)} (rounded to the cent), so each $100.00 grew by ${money(growth)}.`,
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
    { prompt: 'In one or two sentences: what did the Federal Reserve Act of 1913 mean by an "elastic currency", and how does the Fed make the amount of money grow or shrink today?',
      modelAnswer: 'It means money whose amount can grow or shrink as the country needs. The Fed can add money by buying securities and take it out by selling them.',
      rubric: ['Says the amount of money can grow or shrink with the country\'s needs', 'Names a way the Fed does it (buying or selling securities, or lending to banks)'] },
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
  page('treasuryAccount', [['2026-07-01', 'Brought forward', '', 75000000, 0], ['2026-07-15', 'Tax received', 'T3', TAX, 0]]),
];
const PURCHASE = 200000000;
const purchasePages = () => [
  page('fedSecurities', [['2026-07-01', 'Brought forward', '', 4500000000, 0], ['2026-07-20', 'Bought from banks', 'F9', PURCHASE, 0]]),
  page('fedReserves', [['2026-07-01', 'Brought forward', '', 0, FED_RESERVES], ['2026-07-20', 'Paid for securities bought', 'F9', 0, PURCHASE]]),
];
const [M2_FROM, M2_TO] = ['2019-12', '2020-12'];

const A1_LESSON = {
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
        'The Fed: debit Banks\' reserves, because Desert Bank\'s account goes down, and credit the Treasury\'s account. The Treasury: debit its Account at the Fed and credit its tax receipts (its income).',
        'The amounts here are made small to read easily. Real reserves at the Fed are in the trillions of dollars. Every set of books balances. When the government pays someone, the same path runs the other way.',
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
        'The Fed adds money by buying Treasury securities, which are the government\'s IOUs. In an October 2025 speech, Jerome Powell, then the Fed\'s chair, said it does so "by purchasing Treasury securities in the open market and crediting the reserve accounts of the banks involved in the transaction with the seller." Those reserves are new. They do not come out of anyone else\'s account.',
        'In the Fed\'s books: debit Treasury securities (an asset) and credit Banks\' reserves (what it owes the banks). If a bank\'s customer sold the securities, the bank also credits that customer\'s deposit, so the money in people\'s and companies\' accounts grows too.',
        'Selling securities does the reverse and takes money out. The Fed also sets a target for the federal funds rate, the rate banks charge each other overnight, which affects what loans cost.',
        `The amount of money can change quickly. The money supply called M2 (cash, checking and savings deposits, and similar accounts) was ${billions(M2[M2_FROM])} in ${monthName(M2_FROM)} and ${billions(M2[M2_TO])} a year later. Both the Fed\'s purchases and government payments, like the ones earlier in this module, add money to people\'s and companies\' accounts.`,
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
      explanation: `${billions(M2[M2_TO] - M2[M2_FROM])} ÷ ${billions(M2[M2_FROM])} × $100.00 = ${money(per100(M2[M2_TO] - M2[M2_FROM], M2[M2_FROM]))}. That is about a quarter more money in one year.`,
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

const A1_PRACTICE = {
  id: 'a1-practice', kind: 'practice', module: 'a1', title: 'Add-on A1 practice set',
  templates: [...M14_LESSON.recallTemplates, ...M13_LESSON.recallTemplates, ...M12_LESSON.recallTemplates, ...drill, reservesPage, fedBuys, m2Growth, recordFed, flowTable, planMixed, { ...explainFed, id: 'a1-explain-practice' }],
};

const A1_EXTRA = {
  id: 'a1-extra', kind: 'practice', module: 'a1', title: 'Add-on A1 extra practice',
  templates: [reservesPage, taxToTreasury, paymentDeposits, fedSells, m2Growth, flowTable, recordFed].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const A1_REMEDIAL = {
  id: 'a1-remedial', kind: 'practice', module: 'a1', title: 'Add-on A1: common mistakes',
  templates: [paymentDeposits, fedSells, recordFed].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const A1_GATE = {
  id: 'a1', kind: 'gate', title: 'Add-on A1 check',
  templates: [reservesPage, taxToTreasury, paymentDeposits, fedBuys, fedSells, m2Growth, drill[0], recordFed, flowTable, explainFed],
};
};

defs["content/modules/a2.js"] = function (exports, require, define) {
const { money, explainTemplate, per100 } = require("content/helpers.js");
const { CPI, CPI_SOURCE, CPI_YEAR_PAIRS, monthName, indexText, BUDGET, BUDGET_SOURCE, COMPANIES, COMPANY_YEARS, M2, M2_SOURCE } = require("content/addonData.js");
const { M13_LESSON } = require("content/modules/m13.js");
const { M14_LESSON } = require("content/modules/m14.js");
const { A1_LESSON, A1_GATE } = require("content/modules/a1.js");
define(exports, { A2_LESSON: () => A2_LESSON, A2_PRACTICE: () => A2_PRACTICE, A2_EXTRA: () => A2_EXTRA, A2_REMEDIAL: () => A2_REMEDIAL, A2_GATE: () => A2_GATE });
// Add-on A2: Inflation and its causes. Ideas: measuring-inflation,
// accepted-causes, corporate-pricing. Every figure is real and cited
// (content/addonData.js). Graded questions are only calculations from given
// figures; how much corporate pricing drove recent inflation is debated, so
// that step is tagged 'debated', shows the evidence on each side, and is never
// graded (design §5). Profit is shown as "profit per $100.00 of sales", so
// every answer is in dollars.







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
// The lesson works J&J 2019 and 2022, Pfizer 2019, AbbVie 2021, Humana 2019
// and Merck 2022, so the checks leave those out.
const LESSON_PICKS = [['jnj', 2019], ['jnj', 2022], ['pfizer', 2019], ['abbvie', 2021], ['humana', 2019], ['merck', 2022]];
const notInLesson = (list) => list.filter(([id, y]) => !LESSON_PICKS.some(([i, yy]) => i === id && yy === y));
const PROFIT_PICKS = notInLesson(picks(['jnj', 'abbvie', 'pfizer', 'merck']));
const COSTS_PICKS = notInLesson(picks(['cigna', 'humana']));
const TABLE_COMPANIES = ['unitedhealth', 'centene', 'elevance', 'bms'];
// CPI pairs, split three ways so no two questions in a check use the same
// pair, and leaving out the pairs the lesson works through.
const LESSON_PAIRS = ['2021-06', '2025-09', '2020-12', '2021-12'];
const usable = CPI_YEAR_PAIRS.filter(([from]) => !LESSON_PAIRS.includes(from));
const EARLY_PAIRS = usable.filter(([from]) => from < '2022');
const MID_PAIRS = usable.filter(([from]) => from >= '2022' && from < '2024');
const LATE_PAIRS = usable.filter(([from]) => from >= '2024');
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

const cpiRise = num('a2-cpi-rise', 'interpreting', { pair: { pick: MID_PAIRS } }, (p) => {
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

const priceNow = num('a2-price-now', 'interpreting', { pair: { pick: LATE_PAIRS }, price: { min: 1500, max: 25000, step: 1 } }, (p) => {
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

// Each version asks a different year from the budget table's (below).
const borrowedPer100 = num('a2-borrowed-per-100', 'interpreting', { year: { byVersion: [2020, 2021, 2022, 2019] } }, (p) => {
  const b = BUDGET[p.year];
  const answer = per100(deficit(p.year), b.outlays);
  return {
    prompt: `In fiscal year ${p.year} the federal government took in ${billions(b.receipts)} and spent ${billions(b.outlays)}. Of every $100.00 it spent, how much was borrowed?`,
    source: BUDGET_SOURCE,
    answer,
    misconceptions: [{ cents: per100(deficit(p.year), b.receipts), explanation: 'Compare the deficit with what was spent, not with what came in.' }],
    explanation: `Deficit: ${billions(b.outlays)} − ${billions(b.receipts)} = ${billions(deficit(p.year))}. Per $100.00 spent: ${billions(deficit(p.year))} ÷ ${billions(b.outlays)} × $100.00 = ${money(answer)}.`,
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
    explanation: `${millions(c.years[y][1])} ÷ ${millions(c.years[y][0])} × $100.00 = ${money(answer)} (rounded to the cent).`,
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
  params: { id: { byVersion: TABLE_COMPANIES } },
  build: (p) => {
    const c = company(p.id);
    return {
      prompt: `${c.name}'s annual reports give its revenue and net income (millions of dollars): 2019, ${millions(c.years[2019][0])} and ${millions(c.years[2019][1])}; 2021, ${millions(c.years[2021][0])} and ${millions(c.years[2021][1])}; 2022, ${millions(c.years[2022][0])} and ${millions(c.years[2022][1])}. Work out profit per $100.00 of sales for each year, and the costs per $100.00 in 2022. Round to the cent.`,
      source: c.source,
      fields: [['Profit per $100.00 of sales, 2019', profit(c, 2019)], ['Profit per $100.00 of sales, 2021', profit(c, 2021)], ['Profit per $100.00 of sales, 2022', profit(c, 2022)], ['Costs and other expenses per $100.00 of sales, 2022', 10000 - profit(c, 2022)]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: COMPANY_YEARS.map((y) => `${y}: ${millions(c.years[y][1])} ÷ ${millions(c.years[y][0])} × $100.00 = ${money(profit(c, y))}`).join('. ') + `. Costs in 2022: $100.00 − ${money(profit(c, 2022))} = ${money(10000 - profit(c, 2022))}.`,
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
        ['Deficit, in billions of dollars (type 1,234.50 for $1,234.5 billion)', d * 10],
        ['Borrowed per $100.00 spent', per100(d, b.outlays)],
        ['Paid for by receipts per $100.00 spent', per100(b.receipts, b.outlays)],
        ['Spent per $100.00 taken in', per100(b.outlays, b.receipts)],
      ].map(([label, answer]) => ({ label, answer })),
      explanation: `Deficit: ${billions(b.outlays)} − ${billions(b.receipts)} = ${billions(d)}. Borrowed: ${billions(d)} ÷ ${billions(b.outlays)} × $100.00 = ${money(per100(d, b.outlays))}. Receipts: ${billions(b.receipts)} ÷ ${billions(b.outlays)} × $100.00 = ${money(per100(b.receipts, b.outlays))}. Spent per $100.00 taken in: ${billions(b.outlays)} ÷ ${billions(b.receipts)} × $100.00 = ${money(per100(b.outlays, b.receipts))}.`,
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
  note: 'Sales are revenue. Profit is net income attributable to the company. Drug companies come first, then health insurers.',
};
const BUDGET_DOC = (y) => ({
  kind: 'list', title: `Federal budget, fiscal year ${y} (October ${y - 1} to September ${y})`,
  lines: [['Receipts (taxes and other income)', billions(BUDGET[y].receipts)], ['Outlays (spending)', billions(BUDGET[y].outlays)], ['Deficit (borrowed)', billions(deficit(y))]],
  note: 'Source: Monthly Treasury Statement.',
});

const A2_LESSON = {
  id: 'a2',
  title: 'Inflation and its causes',
  coreIdea: 'Inflation is measured by the Consumer Price Index. Economists broadly accept three causes: faster growth in money, government deficit spending, and rising costs. How much company pricing added to inflation is debated, so this module shows the numbers and the evidence on each side.',
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
        'Every month, the Bureau of Labor Statistics checks the prices of a fixed basket of things people buy, such as food, rent, gas and doctor visits. The Consumer Price Index (CPI) turns those prices into one number.',
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
        `More money. In Add-on A1, the money supply (M2) grew from ${billions(M2['2019-12'])} in December 2019 to ${billions(M2['2020-12'])} in December 2020, about a quarter in one year. When money grows much faster than the things there are to buy, prices tend to rise.`,
        `Deficit spending. In fiscal year 2020 the federal government spent ${billions(BUDGET[2020].outlays)} and took in ${billions(BUDGET[2020].receipts)}: it borrowed ${money(per100(deficit(2020), BUDGET[2020].outlays))} of every $100.00 it spent. Economists at the San Francisco Fed estimated that U.S. income support during the pandemic may have added about 3 percentage points to inflation by the end of 2021 (for example, prices rising 7% in a year instead of 4%), an estimate they call uncertain.`,
        'Rising costs. When energy, shipping and materials cost more, businesses pay more to make and deliver what they sell. Energy prices rose 41.6% in the year to June 2022.',
        'Economists broadly agree that all three played a part. They disagree about how much each one mattered.',
      ],
      prompt: 'Why can government spending more than it takes in push prices up?',
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
      explanation: `${billions(deficit(2021))} ÷ ${billions(BUDGET[2021].outlays)} × $100.00 = ${money(per100(deficit(2021), BUDGET[2021].outlays))}.`,
      source: BUDGET_SOURCE,
    },
    {
      id: 'companies', kind: 'explain', title: 'Company books: profit per $100.00 of sales', uses: ['corporate-pricing', 'income-statement'],
      text: [
        'Some people argue that companies raised prices more than their costs rose, adding to inflation. You can check part of that question with numbers anyone can read, in companies\' annual reports.',
        'To avoid picking only the examples that fit one view, the course uses a fixed rule. It takes the five largest U.S. drug companies and the five largest U.S. health insurers by 2019 revenue. It compares 2019, before the pandemic, with 2021 and 2022.',
        `Each annual report has an income statement, like yours from Module 12. Divide net income (profit) by revenue (sales) and multiply by 100: that is profit per $100.00 of sales. Johnson & Johnson: ${millions(JNJ.years[2019][1])} ÷ ${millions(JNJ.years[2019][0])} × $100.00 = ${money(profit(JNJ, 2019))} in 2019, and ${money(profit(JNJ, 2022))} in 2022.`,
      ],
      prompt: 'Why compare profit per $100.00 of sales, not just total profit?',
      promptAnswer: 'A company that sells more makes more profit even at the same prices. Profit per $100.00 of sales shows whether it kept a bigger share of each sale.',
      reports: [companyStatement(JNJ, 2019), companyStatement(JNJ, 2022)],
      sources: [JNJ.source],
    },
    {
      id: 'predict-profit', kind: 'predict', title: 'Predict: profit per $100.00', uses: ['corporate-pricing'],
      text: ['From Pfizer\'s income statement for 2019: how many dollars of profit did it make for every $100.00 of sales?'],
      report: companyStatement(PFIZER, 2019),
      answer: profit(PFIZER, 2019),
      misconceptions: [{ cents: 10000 - profit(PFIZER, 2019), explanation: 'That is the costs per $100.00. Divide net income by revenue.' }],
      explanation: `${millions(PFIZER.years[2019][1])} ÷ ${millions(PFIZER.years[2019][0])} × $100.00 = ${money(profit(PFIZER, 2019))}.`,
      source: PFIZER.source,
    },
    {
      id: 'ten-companies', kind: 'explain', title: 'All ten companies', uses: ['corporate-pricing'],
      text: [
        `From 2019 to 2022, profit per $100.00 of sales rose at ${RISERS.length} of the ten companies and fell at the other ${COMPANIES.length - RISERS.length}. Drug companies kept far more of each $100.00 than insurers, whose payments for their members' care take up most of what they collect.`,
        'Most of the companies sold much more in 2022 than in 2019, so at most of them profits in dollars grew even where profit per $100.00 did not.',
        'These numbers show what the companies kept. By themselves they cannot show whether their prices caused inflation. That needs evidence about prices and costs across the whole economy.',
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
        'Evidence that it added a lot: Kansas City Fed economists found that companies\' markups (price over cost) grew 3.4% in 2021, while prices measured by another government index (the PCE price index) rose 5.8%, so markups could explain more than half of that year\'s inflation. They link it to companies raising prices ahead of expected cost increases. A Federal Trade Commission staff report found grocery retailers\' revenues ran more than 6% over their total costs in 2021, above their 2015 peak of 5.6%, and 7% over total costs in the first three quarters of 2023.',
        'Evidence that it was not a main driver: San Francisco Fed economists found that markups across the whole economy "have stayed essentially flat" since the recovery began, and that rising markups "have not been a main driver" of the recent surge and later fall in inflation, though markups did rise a lot in a few industries, such as motor vehicles and petroleum.',
        'A study that found some of each: a later Kansas City Fed study found that profits contributed a lot to inflation in the first half of 2021 and little after that, a pattern seen in past recoveries. Over the first two years of the recovery, profits\' share of inflation (41%) was below the average of past recoveries (59%).',
        'What both sides agree on: profits rose fast in 2021, and costs and demand also rose. The disagreement is over how much of the price rise came from each.',
      ],
      prompt: 'What evidence would you want to see before deciding how much company pricing added to inflation?',
      promptAnswer: 'Prices and costs measured across many industries over several years, not just a few companies or one year, and studies from more than one side.',
      sources: ['kcfed-2023-markups', 'ftc-grocery-2024', 'sffed-2024-12', 'kcfed-2023-profits'],
    },
    {
      id: 'insulin', kind: 'explain', title: 'A documented case: insulin prices', uses: ['corporate-pricing', 'measuring-inflation'],
      text: [
        'A documented case, with dates you can check. In 2023 the three largest insulin makers announced cuts to U.S. list prices. Eli Lilly cut the list prices of Humalog and Humulin by 70% (effective late 2023). Sanofi cut the list price of Lantus by 78%, and Novo Nordisk cut some insulins by up to 75% (both effective January 2024). These were cuts to list prices, the starting price before any discounts or insurance.',
        'Medicare capped what people pay at $35 for a month\'s supply of each covered insulin. The cap began January 1, 2023 under Part D, and July 1, 2023 for insulin used with a pump under Part B.',
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
      explanation: `${millions(ABBVIE.years[2021][1])} ÷ ${millions(ABBVIE.years[2021][0])} × $100.00 = ${money(profit(ABBVIE, 2021))}.`,
      source: ABBVIE.source,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['corporate-pricing'],
      text: [`Humana, 2019: revenue ${millions(HUMANA.years[2019][0])}, net income ${millions(HUMANA.years[2019][1])}. How much profit per $100.00 of sales?`],
      answer: profit(HUMANA, 2019),
      misconceptions: [{ cents: 10000 - profit(HUMANA, 2019), explanation: 'That is the costs per $100.00.' }],
      explanation: `${millions(HUMANA.years[2019][1])} ÷ ${millions(HUMANA.years[2019][0])} × $100.00 = ${money(profit(HUMANA, 2019))}.`,
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
      explanation: `${billions(deficit(2019))} ÷ ${billions(BUDGET[2019].outlays)} × $100.00 = ${money(per100(deficit(2019), BUDGET[2019].outlays))}.`,
      source: BUDGET_SOURCE,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['corporate-pricing'],
      text: [`Merck, 2022: revenue ${millions(MERCK.years[2022][0])}, net income ${millions(MERCK.years[2022][1])}. How much profit per $100.00 of sales?`],
      answer: profit(MERCK, 2022),
      misconceptions: [{ cents: 10000 - profit(MERCK, 2022), explanation: 'That is the costs per $100.00.' }],
      explanation: `${millions(MERCK.years[2022][1])} ÷ ${millions(MERCK.years[2022][0])} × $100.00 = ${money(profit(MERCK, 2022))}.`,
      source: MERCK.source,
    },
  ],
  resources: ['bls-cpi'],
  recallTemplates: [cpiPer100, profitPer100].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: profit per $100.00 of sales.
const drill = [1, 2, 3].map((n) => num(`a2-drill-${n}`, 'interpreting', { sales: { min: 10, max: 300, step: 1 }, share: { min: 2, max: 25, step: 1 } }, (p) => {
  const sales = p.sales * 1000;
  const net = Math.round((sales * p.share) / 100) + p.sales;
  return {
    prompt: `Drill ${n} of 3: sales of ${millions(sales)} and profit of ${millions(net)}. How much profit per $100.00 of sales?`, answer: per100(net, sales),
    explanation: `${millions(net)} ÷ ${millions(sales)} × $100.00 = ${money(per100(net, sales))}.`,
  };
}));

const fedMixed = { ...A1_GATE.templates.find((t) => t.part === 'producing'), id: 'a1-record-fed-mixed-a2' };

const A2_PRACTICE = {
  id: 'a2-practice', kind: 'practice', module: 'a2', title: 'Add-on A2 practice set',
  templates: [...A1_LESSON.recallTemplates, ...M14_LESSON.recallTemplates, ...M13_LESSON.recallTemplates, ...drill, cpiPer100, borrowedPer100, profitPer100, companyTable, budgetTable, fedMixed, { ...explainInflation, id: 'a2-explain-practice' }],
};

const A2_EXTRA = {
  id: 'a2-extra', kind: 'practice', module: 'a2', title: 'Add-on A2 extra practice',
  templates: [cpiPer100, cpiRise, priceNow, borrowedPer100, profitPer100, costsPer100, profitRise].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const A2_REMEDIAL = {
  id: 'a2-remedial', kind: 'practice', module: 'a2', title: 'Add-on A2: common mistakes',
  templates: [cpiPer100, borrowedPer100, budgetTable].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). Nothing debated is graded.
const A2_GATE = {
  id: 'a2', kind: 'gate', title: 'Add-on A2 check',
  templates: [cpiPer100, cpiRise, priceNow, borrowedPer100, profitPer100, costsPer100, drill[0], companyTable, budgetTable, explainInflation],
};
};

defs["content/modules/a3.js"] = function (exports, require, define) {
const { percentOf } = require("js/money.js");
const { money, NAMES, explainTemplate, accountOptions, chartPage, per100 } = require("content/helpers.js");
const { RATES_2026 } = require("content/rates2026.js");
const { IRA_2026 } = require("content/addonData.js");
const { M14_LESSON } = require("content/modules/m14.js");
const { A1_LESSON } = require("content/modules/a1.js");
const { A2_LESSON, A2_GATE } = require("content/modules/a2.js");
define(exports, { A3_LESSON: () => A3_LESSON, A3_PRACTICE: () => A3_PRACTICE, A3_EXTRA: () => A3_EXTRA, A3_REMEDIAL: () => A3_REMEDIAL, A3_GATE: () => A3_GATE });
// Add-on A3: IRAs and saving for later. Ideas: what-an-ira-is,
// traditional-vs-roth, limits-and-growth. How IRAs work, never what to buy.
// The IRA page (10) is a named home for Investing bucket money, filled by
// transfers; it holds a 12-month CD at the real October 2026 average rate,
// 1.76% (the author's ruling: no invented growth rate). Limits are the IRS's
// 2026 figures. Tax rates in questions are stated as "suppose", for practice
// only. People and everyday amounts are fictional (illustrative).









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

const A3_LESSON = {
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

const A3_PRACTICE = {
  id: 'a3-practice', kind: 'practice', module: 'a3', title: 'Add-on A3 practice set',
  templates: [...A2_LESSON.recallTemplates, ...A1_LESSON.recallTemplates, ...M14_LESSON.recallTemplates, ...drill, maxContribution, yearOfInterest, traditionalKept, recordIra, iraTable, companyMixed, { ...explainIra, id: 'a3-explain-practice' }],
};

const A3_EXTRA = {
  id: 'a3-extra', kind: 'practice', module: 'a3', title: 'Add-on A3 extra practice',
  templates: [maxContribution, ageLimit, yearOfInterest, twoYears, traditionalKept, earlyExtra, recordIra].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const A3_REMEDIAL = {
  id: 'a3-remedial', kind: 'practice', module: 'a3', title: 'Add-on A3: common mistakes',
  templates: [maxContribution, twoYears, iraTable].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const A3_GATE = {
  id: 'a3', kind: 'gate', title: 'Add-on A3 check',
  templates: [maxContribution, ageLimit, yearOfInterest, twoYears, traditionalKept, earlyExtra, drill[0], recordIra, iraTable, explainIra],
};
};

defs["content/modules/demo.js"] = function (exports, require, define) {
define(exports, { DEMO_LESSON: () => DEMO_LESSON });
// A sample lesson for checking the lesson page. Positioned at Module 6 (it
// shows a journal page, folios and posted ticks). Amounts are illustrative.

const DEMO_LESSON = {
  id: 'demo',
  position: 'm06',
  checkId: 'demo',
  title: 'Sample lesson: debits raise an asset',
  coreIdea: 'An asset, such as a bucket of money, goes up on the debit side.',
  steps: [
    {
      id: 'into-bucket', kind: 'explain', title: 'Money coming into a bucket', uses: ['debit-credit-rules', 'ledger-columns'],
      text: [
        'Your Saving bucket is an asset: money that belongs to you.',
        'When money goes into an asset, you write the amount in the Debits column. The balance goes up.',
      ],
      prompt: 'Why does the balance go up on this line?',
      promptAnswer: 'Money came into the bucket, and an asset goes up on the debit side.',
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
        rows: [{ date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] }],
      },
      highlightRow: 0,
    },
    {
      id: 'predict', kind: 'predict', title: 'Predict the next balance', uses: ['debit-credit-rules', 'running-balance'],
      text: ['Two weeks later another 15% goes in. Before you check, work out what the Balance column will read on the highlighted line.'],
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
        rows: [
          { date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] },
          { date: '2026-06-20', items: 'From paycheck, 15%', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance', 'side'] },
        ],
      },
      highlightRow: 1,
      answer: 36360,
      misconceptions: [{ cents: 18180, explanation: 'That is only the new deposit. The balance adds it to what was already there.' }],
      explanation: '$181.80 + $181.80 = $363.60. Each debit adds to the asset.',
    },
    {
      id: 'two-sides', kind: 'explain', title: 'Where the entry starts', uses: ['equal-sides', 'debit-credit-rules'],
      text: ['Every entry has two sides. Moving money into Saving debits Saving and credits Checking by the same amount, so the two sides are equal.'],
      journalPage: {
        sheetNo: 1, name: 'Jordan (example)',
        entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Saving share of paycheck', lines: [
          { account: 'saving', label: 'Saving bucket', debit: 18180, credit: 0, folio: 3 },
          { account: 'checking', label: 'Checking', debit: 0, credit: 18180, folio: 1 },
        ] }],
      },
      highlightEntry: 0,
    },
  ],
  resources: ['cfpb-budget'],
};
};

defs["content/modules/index.js"] = function (exports, require, define) {
const { PREREQ_LESSON } = require("content/modules/prereq.js");
const { M01_LESSON } = require("content/modules/m01.js");
const { M02_LESSON } = require("content/modules/m02.js");
const { M03_LESSON } = require("content/modules/m03.js");
const { M04_LESSON } = require("content/modules/m04.js");
const { M05_LESSON } = require("content/modules/m05.js");
const { M06_LESSON } = require("content/modules/m06.js");
const { M07_LESSON } = require("content/modules/m07.js");
const { M08_LESSON } = require("content/modules/m08.js");
const { M09_LESSON } = require("content/modules/m09.js");
const { M10_LESSON } = require("content/modules/m10.js");
const { M11_LESSON } = require("content/modules/m11.js");
const { M12_LESSON } = require("content/modules/m12.js");
const { M13_LESSON } = require("content/modules/m13.js");
const { M14_LESSON } = require("content/modules/m14.js");
const { M15_LESSON } = require("content/modules/m15.js");
const { M16_LESSON } = require("content/modules/m16.js");
const { A1_LESSON } = require("content/modules/a1.js");
const { A2_LESSON } = require("content/modules/a2.js");
const { A3_LESSON } = require("content/modules/a3.js");
define(exports, { MODULE_CONTENT: () => MODULE_CONTENT });
// Every module's lesson content, by module id. Modules are added in Tasks 6–10.






















const MODULE_CONTENT = {
  prereq: PREREQ_LESSON,
  m01: M01_LESSON,
  m02: M02_LESSON,
  m03: M03_LESSON,
  m04: M04_LESSON,
  m05: M05_LESSON,
  m06: M06_LESSON,
  m07: M07_LESSON,
  m08: M08_LESSON,
  m09: M09_LESSON,
  m10: M10_LESSON,
  m11: M11_LESSON,
  m12: M12_LESSON,
  m13: M13_LESSON,
  m14: M14_LESSON,
  m15: M15_LESSON,
  m16: M16_LESSON,
  a1: A1_LESSON,
  a2: A2_LESSON,
  a3: A3_LESSON,
};
};

defs["content/modules/m01.js"] = function (exports, require, define) {
const { percentOf } = require("js/money.js");
const { money, NAMES, splitBuckets, explainTemplate, exactPercent, PAYCHECK_SOURCES } = require("content/helpers.js");
define(exports, { M01_LESSON: () => M01_LESSON, M01_PRACTICE: () => M01_PRACTICE, M01_EXTRA: () => M01_EXTRA, M01_REMEDIAL: () => M01_REMEDIAL, M01_GATE: () => M01_GATE, M01_CHECKPOINT: () => M01_CHECKPOINT });
// Module 1: What money is. Ideas: money-uses, five-buckets, page-per-bucket.
// Debits and credits are not taught yet, so ledgers show Date, Items and
// Balance only, with money in and out written beside the sheet.




const EARLY = ['date', 'items', 'balance'];
const TAKE_HOME = { min: 80000, max: 130000, step: 1 };
const num = (id, part, params, build, extra = {}) => ({ id, module: 'm01', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build, ...extra });

// --- Question templates -----------------------------------------------------

const savingShare = num('m01-saving-share', 'interpreting', { take: TAKE_HOME, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s take-home pay is ${money(p.take)}. How much goes into the Saving bucket (15%)?`,
  answer: splitBuckets(p.take).saving,
  misconceptions: [{ cents: percentOf(p.take, 0.015), explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
  explanation: `10% is ${exactPercent(p.take, 0.1)}. 5% is ${exactPercent(p.take, 0.05)}. So 15% is ${exactPercent(p.take, 0.15)}, which rounds to ${money(splitBuckets(p.take).saving)}. Round only once, at the end.`,
}));

const charityShare = num('m01-charity-share', 'interpreting', { take: TAKE_HOME, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s take-home pay is ${money(p.take)}. How much goes into the Charity bucket (5%)?`,
  answer: splitBuckets(p.take).charity,
  misconceptions: [{ cents: percentOf(p.take, 0.5), explanation: 'That is 50%. 5% is half of 10%.' }],
  explanation: `10% is ${exactPercent(p.take, 0.1)}, and 5% is half of that: ${exactPercent(p.take, 0.05)}, which rounds to ${money(splitBuckets(p.take).charity)}. Round only once, at the end.`,
}));

const spendingLeft = num('m01-spending-left', 'interpreting', { take: TAKE_HOME }, (p) => {
  const b = splitBuckets(p.take);
  const others = b.saving + b.investing + b.charity + b.blow;
  return {
    prompt: `From a take-home pay of ${money(p.take)}, the other four buckets get ${money(b.saving)}, ${money(b.investing)}, ${money(b.charity)} and ${money(b.blow)}. How much is left for Spending?`,
    answer: b.spending,
    // Shown only when 60% on its own really is a cent off.
    misconceptions: percentOf(p.take, 0.6) === b.spending ? [] : [{ cents: percentOf(p.take, 0.6), explanation: 'Working out 60% on its own can be a cent off. Spending gets exactly what is left, so the buckets add up.' }],
    explanation: `${money(p.take)} − ${money(others)} = ${money(b.spending)}.`,
  };
});

const blowShare = num('m01-blow-share', 'practice', { take: TAKE_HOME }, (p) => ({
  prompt: `How much of a ${money(p.take)} take-home pay goes into Blow money (10%)?`,
  answer: splitBuckets(p.take).blow,
  explanation: `10% is one tenth: ${exactPercent(p.take, 0.1)}, which rounds to ${money(splitBuckets(p.take).blow)}.`,
}));

const investingShare = num('m01-investing-share', 'practice', { take: TAKE_HOME }, (p) => ({
  prompt: `How much of a ${money(p.take)} take-home pay goes into the Investing bucket (10%)?`,
  answer: splitBuckets(p.take).investing,
  misconceptions: [{ cents: percentOf(p.take, 0.01), explanation: 'That is 1%. For 10%, move the point one place left.' }],
  explanation: `10% is one tenth: ${exactPercent(p.take, 0.1)}, which rounds to ${money(splitBuckets(p.take).investing)}.`,
}));

const splitFour = {
  id: 'm01-split-four', module: 'm01', kind: 'amounts', part: 'producing', points: 4,
  params: { take: TAKE_HOME, name: { pick: NAMES } },
  build: (p) => {
    const b = splitBuckets(p.take);
    return {
      prompt: `${p.name}'s take-home pay is ${money(p.take)}. Charity (5%) is ${money(b.charity)}. Write the other four buckets. Spending gets what is left, so all five buckets add up to the paycheck.`,
      fields: [
        { label: 'Saving (15%)', answer: b.saving },
        { label: 'Investing (10%)', answer: b.investing },
        { label: 'Blow money (10%)', answer: b.blow },
        { label: 'Spending (what is left)', answer: b.spending },
      ],
      explanation: `Saving ${money(b.saving)}, Investing ${money(b.investing)}, Charity ${money(b.charity)}, Blow money ${money(b.blow)}. Spending is ${money(p.take)} minus those four: ${money(b.spending)}.`,
    };
  },
};

const explainSplit = explainTemplate({
  id: 'm01-explain-split', module: 'm01',
  variants: [
    { prompt: 'In one or two sentences: why does this course split each paycheck into buckets on payday, before spending anything?',
      modelAnswer: 'The split is decided before any money is spent. If you spend first and save what is left, there is usually nothing left to save.',
      rubric: ['Says the split is decided before spending', 'Says spending first usually leaves nothing for the other buckets'] },
    { prompt: 'In one or two sentences: why does Spending get "what is left" instead of exactly 60%?',
      modelAnswer: 'Rounding each percentage can leave the buckets a cent away from the paycheck. Giving Spending what is left makes all five add up exactly.',
      rubric: ['Mentions rounding can leave a cent over or under', 'Says the buckets must add up exactly to the paycheck'] },
    { prompt: 'In one or two sentences: why does each bucket get its own ledger page?',
      modelAnswer: 'Each page keeps its own balance, so you can see how much is in each bucket at any time. Money for one job is not mixed up with another.',
      rubric: ['Says you can see each bucket\'s own balance', 'Says money for different jobs stays separate'] },
    { prompt: 'In one or two sentences: name the three jobs money does and give an example of one.',
      modelAnswer: 'Money lets you trade (buy things), save value for later, and measure what things are worth. For example, you can save $15 now to spend next month.',
      rubric: ['Names trading, saving and measuring', 'Gives a correct example of one job'] },
  ],
});

const recallPercent = num('m01-recall-percent', 'practice', { a: { min: 10000, max: 90000, step: 100 } }, (p) => ({
  prompt: `Quick recall: what is 5% of ${money(p.a)}?`, answer: percentOf(p.a, 0.05), explanation: `5% is half of 10%: ${exactPercent(p.a, 0.05)}, which rounds to ${money(percentOf(p.a, 0.05))}.`,
}));

const totalCheck = num('m01-total-check', 'practice', { take: TAKE_HOME }, (p) => {
  const b = splitBuckets(p.take);
  return {
    prompt: `Check a split. Add Saving ${money(b.saving)}, Investing ${money(b.investing)}, Charity ${money(b.charity)}, Blow money ${money(b.blow)} and Spending ${money(b.spending)}. What is the total?`,
    answer: p.take,
    explanation: `They add up to the whole take-home pay: ${money(p.take)}. If a split does not add up, find the cent that went missing.`,
  };
});

const explainJobs = explainTemplate({
  id: 'm01-explain-jobs', module: 'm01', part: 'practice', points: 2,
  variants: [
    { prompt: 'Which job is money doing when you put $20 aside for next month? Explain.', modelAnswer: 'Saving value for later: the money keeps its value so you can use it next month.', rubric: ['Names saving (storing value)', 'Says it is kept to use later'] },
    { prompt: 'Which job is money doing when a price tag says $4.50? Explain.', modelAnswer: 'Measuring: the price tells you what the item is worth in dollars, so you can compare it with other things.', rubric: ['Names measuring', 'Says it shows what something is worth'] },
    { prompt: 'Which job is money doing when you buy lunch? Explain.', modelAnswer: 'Trading: you exchange money for the lunch.', rubric: ['Names trading (exchange)', 'Says money is swapped for the item'] },
    { prompt: 'Why is it easier to trade with money than to swap things directly?', modelAnswer: 'Everyone accepts money, so you do not need to find someone who wants exactly what you have.', rubric: ['Says everyone accepts money', 'Says direct swaps need someone who wants what you have'] },
  ],
});

// Production: the split again, this time starting from the Saving share.
const splitFromSaving = {
  id: 'm01-split-from-saving', module: 'm01', kind: 'amounts', part: 'producing', points: 4,
  params: { take: TAKE_HOME, name: { pick: NAMES } },
  build: (p) => {
    const b = splitBuckets(p.take);
    return {
      prompt: `${p.name}'s take-home pay is ${money(p.take)}, and the Saving bucket (15%) got ${money(b.saving)}. Write the other four buckets. Spending gets what is left.`,
      fields: [
        { label: 'Investing (10%)', answer: b.investing },
        { label: 'Charity (5%)', answer: b.charity },
        { label: 'Blow money (10%)', answer: b.blow },
        { label: 'Spending (what is left)', answer: b.spending },
      ],
      explanation: `Investing ${money(b.investing)}, Charity ${money(b.charity)}, Blow money ${money(b.blow)}. Spending: ${money(p.take)} − ${money(b.saving + b.investing + b.charity + b.blow)} = ${money(b.spending)}.`,
    };
  },
};

// Money measures what things are worth.
const priceMeasure = num('m01-price-measure', 'interpreting', { price: { min: 125, max: 1999, step: 1 }, n: { pick: [2, 3, 4, 5, 6] }, item: { pick: ['notebooks', 'bus tickets', 'pairs of socks', 'phone chargers'] } }, (p) => ({
  prompt: `Money measures what things are worth: a price tag says one of these ${p.item} is worth ${money(p.price)}. What are ${p.n} of them worth?`,
  answer: p.price * p.n,
  misconceptions: [{ cents: p.price + p.n, explanation: 'Multiply the price by how many: each one is worth the same amount.' }],
  explanation: `${p.n} × ${money(p.price)} = ${money(p.price * p.n)}.`,
}));

// One page per bucket: reading the five pages after payday.
const otherBuckets = num('m01-other-buckets', 'interpreting', { take: TAKE_HOME, name: { pick: NAMES } }, (p) => {
  const b = splitBuckets(p.take);
  const others = b.saving + b.investing + b.charity + b.blow;
  return {
    prompt: `After payday, ${p.name}'s five bucket pages each show one line: Spending ${money(b.spending)}, Saving ${money(b.saving)}, Investing ${money(b.investing)}, Charity ${money(b.charity)} and Blow money ${money(b.blow)}. How much is set aside on the four pages other than Spending?`,
    answer: others,
    misconceptions: [{ cents: p.take, explanation: 'That is all five pages. Leave out the Spending page.' }],
    explanation: `${money(b.saving)} + ${money(b.investing)} + ${money(b.charity)} + ${money(b.blow)} = ${money(others)}.`,
  };
});

// --- Lesson -------------------------------------------------------------------

const M01_LESSON = {
  id: 'm01',
  title: 'What money is',
  coreIdea: 'Split every paycheck into five buckets before you spend any of it. Each bucket has its own ledger page.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['percentages'],
      text: ['Quick warm-up from the money check. What is 10% of $500.00?'],
      answer: 5000,
      misconceptions: [{ cents: 500, explanation: 'That is 1%. For 10%, move the point one place left.' }],
      explanation: '10% is one tenth: $50.00.',
    },
    {
      id: 'three-jobs', kind: 'explain', title: 'Three jobs money does', uses: ['money-uses'],
      text: [
        'Money does three jobs. First, it lets you trade: you swap it for things you need. Second, it stores value: money you keep today can be used next month. Third, it measures: a price tells you what something is worth.',
        'Money makes trading easy because everyone accepts it. Without money, you would have to find someone who wants exactly what you have to swap.',
        'This course is about the second job. Decide where your money goes before you spend it. Then it keeps working for you instead of slipping away.',
      ],
      prompt: 'Think of the last thing you bought. Which job was money doing?',
      promptAnswer: 'Trading: you swapped money for the thing you bought. (If you put money aside instead, that would be storing value.)',
    },
    {
      id: 'five-buckets', kind: 'explain', title: 'Five buckets, decided on payday', uses: ['five-buckets', 'percentages'],
      text: [
        'If you spend first and plan to save what is left, there is usually nothing left. So the split comes first. On payday, before you spend anything, split your take-home pay into five buckets. Saving gets 15%. Investing gets 10%. Charity gets 5%. Blow money gets 10%, and it is yours to spend on anything. Spending gets what is left, which is about 60%, for everyday needs.',
        'Worked example. Step 1: start from take-home pay, $1,033.46. (Module 4 shows where this number comes from.) Step 2: work out each percentage bucket. Saving 15% is $155.019, which rounds to $155.02. Investing 10% is $103.35. Charity 5% is $51.673, which rounds to $51.67. Blow money 10% is $103.35.',
        'Step 3: Spending gets what is left. $1,033.46 − $413.39 = $620.07. Step 4: check. $155.02 + $103.35 + $51.67 + $103.35 + $620.07 = $1,033.46. The buckets add up to the paycheck exactly.',
        'Notice that each bucket was worked out from the exact amount and rounded once, at the end. Rounding pieces first can leave you a cent off.',
        'You can change these percentages later. Deciding them in advance, not in the moment, is what makes the plan work.',
      ],
      prompt: 'Why does Spending get "what is left" instead of being worked out as 60%?',
      promptAnswer: 'Rounding each bucket can leave the total a cent away from the paycheck. When Spending takes exactly what is left, the five buckets always add up to the paycheck.',
      sourceDoc: { kind: 'paystub', title: 'Take-home pay for two weeks', lines: [['Hours', '80 at $15.15'], ['Take-home pay', 103346]], note: 'Arizona minimum wage, 2026. The deductions are explained in Module 4.' },
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-saving', kind: 'predict', title: 'Your turn: the Saving bucket', uses: ['five-buckets', 'percentages'],
      text: ['Maya\'s take-home pay is $987.65. Before you check, work out her Saving bucket (15%). Round to the cent.'],
      answer: 14815,
      misconceptions: [{ cents: 1481, explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
      explanation: '10% is $98.765. 5% is $49.3825. So 15% is $148.1475. The thousandths digit is 7, so it rounds up to $148.15.',
    },
    {
      id: 'predict-spending', kind: 'predict', title: 'What is left for Spending?', uses: ['five-buckets', 'percentages'],
      text: ['Maya\'s other buckets are Saving $148.15, Investing $98.77, Charity $49.38 and Blow money $98.77. How much is left for Spending?'],
      answer: 59258,
      misconceptions: [{ cents: 59259, explanation: 'That is 60% worked out on its own. It is a cent too much, and the five buckets would add up to $987.66. Spending gets what is left.' }],
      explanation: 'The four buckets total $395.07. $987.65 − $395.07 = $592.58.',
    },
    {
      id: 'bucket-pages', kind: 'explain', title: 'One ledger page per bucket', uses: ['page-per-bucket', 'five-buckets'],
      text: [
        'Each bucket gets its own ledger page. This is the Saving bucket page. The Date says when. Items says what happened. Balance says how much is in the bucket now.',
        'The buckets do not add new money. They are labels on the money in your accounts, so all the bucket pages together add up to the money you have.',
        'Some columns are grayed out. You will learn them in Module 3. For now, money in is written beside the sheet.',
      ],
      prompt: 'Why is it useful for each bucket to keep its own balance?',
      promptAnswer: 'You can see at any time how much is left for each job, and money meant for one job does not get spent on another.',
      ledger: {
        sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset', activeColumns: EARLY,
        rows: [{ date: '2026-06-06', items: 'From paycheck, 15%', folio: '', debit: 15502, credit: 0, posted: [false, false] }],
      },
      highlightRow: 0,
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['five-buckets', 'percentages'],
      text: ['Ana\'s take-home pay is $1,012.40. Step 1 is done: 10% of it is $101.24 exactly. Finish Step 2 for the Charity bucket: 5% is half of 10%. How much is it?'],
      answer: 5062,
      misconceptions: [{ cents: 10124, explanation: 'That is 10%. Charity is 5%, which is half of 10%.' }],
      explanation: 'Half of $101.24 is $50.62.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['five-buckets', 'percentages'],
      text: ['Devon\'s take-home pay is $1,104.80. How much goes into the Charity bucket (5%)?'],
      answer: 5524,
      misconceptions: [{ cents: 55240, explanation: 'That is 50%. 5% is half of 10%.' }],
      explanation: '10% is $110.48, so 5% is $55.24.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['five-buckets', 'percentages'],
      text: ['Rosa\'s take-home pay is $1,046.20. How much goes into Blow money (10%)?'],
      answer: 10462,
      explanation: '10% is one tenth: $104.62.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['five-buckets', 'percentages'],
      text: ['From the same $1,046.20, how much goes into Saving (15%)?'],
      answer: 15693,
      misconceptions: [{ cents: 1569, explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
      explanation: '15% of $1,046.20 is exactly $156.93.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['five-buckets', 'percentages'],
      text: ['Rosa\'s other buckets are Saving $156.93, Investing $104.62, Charity $52.31 and Blow money $104.62. How much is left for Spending?'],
      answer: 62772,
      explanation: 'The four buckets total $418.48. $1,046.20 − $418.48 = $627.72.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [savingShare, spendingLeft].map((t) => ({ ...t, id: `${t.id}-recall`, part: 'interpreting', points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

const asPractice = (t) => ({ ...t, part: t.kind === 'amounts' ? 'producing' : t.kind === 'explain' ? 'explaining' : 'interpreting' });

// Fluency drill: short, quick questions on the core operation, done for
// accuracy first and then for speed.
const drill = [1, 2, 3].map((n) => num(`m01-drill-${n}`, 'interpreting', { a: { min: 1000, max: 99999, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: 10% of ${money(p.a)}?`, answer: percentOf(p.a, 0.1),
  explanation: `${exactPercent(p.a, 0.1)} rounds to ${money(percentOf(p.a, 0.1))}.`,
})));

const M01_PRACTICE = {
  id: 'm01-practice', kind: 'practice', module: 'm01', title: 'Module 1 practice set',
  templates: [...drill, recallPercent, blowShare, investingShare, spendingLeft, totalCheck, splitFour, explainJobs].map(asPractice),
};

const M01_EXTRA = {
  id: 'm01-extra', kind: 'practice', module: 'm01', title: 'Module 1 extra practice',
  templates: [savingShare, charityShare, blowShare, priceMeasure, otherBuckets, splitFour, splitFromSaving].map((t) => asPractice({ ...t, id: `${t.id}-extra` })),
};

const M01_REMEDIAL = {
  id: 'm01-remedial', kind: 'practice', module: 'm01', title: 'Module 1: common mistakes',
  templates: [savingShare, spendingLeft, totalCheck].map((t) => asPractice({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). Practice items count as 2-point interpreting items here.
const asGate = (t) => ({ ...t, part: 'interpreting', points: 2 });
const M01_GATE = {
  id: 'm01', kind: 'gate', title: 'Module 1 check',
  templates: [savingShare, charityShare, spendingLeft, asGate(blowShare), priceMeasure, otherBuckets, drill[0], splitFour, splitFromSaving, explainSplit],
};

// Questions Checkpoint A draws from this module.
const M01_CHECKPOINT = [savingShare, splitFour];
};

defs["content/modules/m02.js"] = function (exports, require, define) {
const { money, NAMES, splitBuckets, explainTemplate } = require("content/helpers.js");
const { M01_LESSON } = require("content/modules/m01.js");
define(exports, { M02_LESSON: () => M02_LESSON, M02_PRACTICE: () => M02_PRACTICE, M02_EXTRA: () => M02_EXTRA, M02_REMEDIAL: () => M02_REMEDIAL, M02_GATE: () => M02_GATE, M02_CHECKPOINT: () => M02_CHECKPOINT });
// Module 2: The ledger page. Ideas: ledger-columns, running-balance,
// carry-forward. Still Date, Items and Balance only; money in and out are
// written beside the sheet. Amounts are illustrative.




const EARLY = ['date', 'items', 'balance'];
const num = (id, part, params, build) => ({ id, module: 'm02', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });

// A bucket page from a list of [date, items, cents in, cents out].
function page(account, rows, { name = 'Jordan (example)', sheetNo = 1, accountNo = 2, askFrom = null, broughtForward = false } = {}) {
  return {
    sheetNo, accountNo, name, account, type: 'asset', activeColumns: EARLY,
    rows: rows.map(([date, items, inCents, outCents], i) => ({
      date, items, folio: '', debit: inCents, credit: outCents, posted: [false, false],
      ...(broughtForward && i === 0 ? { broughtForward: true } : {}),
      ...(askFrom !== null && i >= askFrom ? { ask: ['balance', 'side'] } : {}),
    })),
  };
}

const runningAfter = (start, moves) => moves.reduce((b, [inC, outC]) => b + inC - outC, start);

// --- Question templates -----------------------------------------------------

const afterSpending = num('m02-after-spending', 'interpreting', { start: { min: 30000, max: 70000, step: 1 }, cost: { min: 501, max: 9999, step: 1 }, item: { pick: ['Groceries', 'Bus pass', 'Phone bill', 'Gas', 'Laundry'] } }, (p) => ({
  prompt: `The Spending page balance is ${money(p.start)}. The next line is "${p.item}": money out ${money(p.cost)}. What does the Balance column read after it?`,
  answer: p.start - p.cost,
  misconceptions: [{ cents: p.start + p.cost, explanation: 'Money out makes the balance go down, so subtract.' }],
  explanation: `${money(p.start)} − ${money(p.cost)} = ${money(p.start - p.cost)}.`,
  ledger: page('Spending bucket', [['2026-06-06', 'Brought forward', p.start, 0], ['2026-06-09', p.item, 0, p.cost]], { askFrom: 1, broughtForward: true }),
  highlightRow: 1,
}));

const broughtForwardThenIn = num('m02-brought-forward', 'interpreting', { carried: { min: 50000, max: 250000, step: 1 }, take: { min: 80000, max: 130000, step: 1 } }, (p) => {
  const saving = splitBuckets(p.take).saving;
  return {
    prompt: `Sheet 1 of a Saving bucket is full. Its last balance is ${money(p.carried)}. On Sheet 2, the first line brings that balance forward. The next line adds ${money(saving)} from payday. What is the balance after the payday line?`,
    answer: p.carried + saving,
    misconceptions: [{ cents: saving, explanation: 'Sheet 2 starts with the balance brought forward, not with zero.' }],
    explanation: `Brought forward ${money(p.carried)} + ${money(saving)} = ${money(p.carried + saving)}.`,
  };
});

const fourBalances = {
  id: 'm02-four-balances', module: 'm02', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 5000, max: 30000, step: 1 }, pay: { min: 40000, max: 70000, step: 1 }, a: { min: 500, max: 6000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, c: { min: 300, max: 4000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    // The first line brings a balance forward; the learner works out the next four.
    const moves = [[p.pay, 0], [0, p.a], [0, p.b], [0, p.c]];
    const balances = moves.map((_, i) => runningAfter(p.start, moves.slice(0, i + 1)));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending page.`,
      ledger: page('Spending bucket', [
        ['2026-06-06', 'Brought forward', p.start, 0],
        ['2026-06-06', 'From paycheck', p.pay, 0],
        ['2026-06-08', 'Groceries', 0, p.a],
        ['2026-06-11', 'Phone bill', 0, p.b],
        ['2026-06-13', 'Lunch', 0, p.c],
      ], { name: p.name, askFrom: 1, broughtForward: true }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Money in adds. Money out subtracts. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

const explainLedger = explainTemplate({
  id: 'm02-explain', module: 'm02',
  variants: [
    { prompt: 'In one or two sentences: why does the balance go down on a line where money goes out?',
      modelAnswer: 'The balance is how much is left in the bucket. Money going out leaves less, so it is subtracted from the balance on the line above.',
      rubric: ['Says the balance is what is left now', 'Says money out is subtracted from the previous balance'] },
    { prompt: 'In one or two sentences: why does a new sheet start with a "Brought forward" line?',
      modelAnswer: 'So the new sheet continues from the old one. The last balance on the full sheet is carried to the first line of the new sheet.',
      rubric: ['Says the last balance of the full sheet is carried over', 'Says the new sheet continues instead of starting from zero'] },
    { prompt: 'In one or two sentences: what do the Date, Items and Balance columns each tell you?',
      modelAnswer: 'Date says when it happened, Items says what it was, and Balance says how much is in the bucket after that line.',
      rubric: ['Explains Date and Items', 'Says Balance is the amount after that line'] },
    { prompt: 'In one or two sentences: why is the balance written on every line instead of only at the end?',
      modelAnswer: 'So you always know how much is in the bucket right now. You can also find a mistake at the line where it happened.',
      rubric: ['Says you always know the current amount', 'Says mistakes can be found at the line they happened'] },
  ],
});

const recallSplit = num('m02-recall-split', 'interpreting', { take: { min: 80000, max: 130000, step: 1 } }, (p) => ({
  prompt: `Recall: how much of a ${money(p.take)} take-home pay goes into the Saving bucket (15%)?`, answer: splitBuckets(p.take).saving,
  explanation: `15% rounds to ${money(splitBuckets(p.take).saving)}.`,
}));

const afterIncome = num('m02-after-income', 'interpreting', { start: { min: 1000, max: 30000, step: 1 }, add: { min: 5000, max: 20000, step: 1 } }, (p) => ({
  prompt: `The Blow money page balance is ${money(p.start)}. Payday adds ${money(p.add)}. What is the new balance?`,
  answer: p.start + p.add, explanation: `Money in adds: ${money(p.start)} + ${money(p.add)} = ${money(p.start + p.add)}.`,
}));

const twoLines = num('m02-two-lines', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, a: { min: 300, max: 5000, step: 1 }, b: { min: 300, max: 5000, step: 1 } }, (p) => ({
  prompt: `A Spending page shows ${money(p.start)}. The next two lines are money out ${money(p.a)} and then money out ${money(p.b)}. What is the balance after both lines?`,
  answer: p.start - p.a - p.b, explanation: `${money(p.start)} − ${money(p.a)} − ${money(p.b)} = ${money(p.start - p.a - p.b)}.`,
}));

const pageEnd = num('m02-page-end', 'interpreting', { start: { min: 10000, max: 40000, step: 1 }, pay: { min: 40000, max: 70000, step: 1 }, a: { min: 500, max: 8000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const end = p.start + p.pay - p.a - p.b;
  return {
    prompt: `What does the Balance column read on the last line of ${p.name}'s Spending page?`,
    ledger: page('Spending bucket', [['2026-06-06', 'Brought forward', p.start, 0], ['2026-06-06', 'From paycheck', p.pay, 0], ['2026-06-08', 'Groceries', 0, p.a], ['2026-06-12', 'Gas', 0, p.b]], { name: p.name, askFrom: 1, broughtForward: true }),
    highlightRow: 3,
    answer: end,
    misconceptions: [{ cents: p.start + p.pay + p.a + p.b, explanation: 'Money out is subtracted, not added.' }],
    explanation: `${money(p.start)} + ${money(p.pay)} − ${money(p.a)} − ${money(p.b)} = ${money(end)}.`,
  };
});

// Working a running balance backward: the line above from the line below.
const findStart = num('m02-find-start', 'interpreting', { before: { min: 18000, max: 60000, step: 1 }, cost: { min: 500, max: 9000, step: 1 }, item: { pick: ['Groceries', 'Bus pass', 'Phone bill', 'Laundry'] } }, (p) => ({
  prompt: `On a Spending page, the line "${p.item}" has money out of ${money(p.cost)}, and its balance reads ${money(p.before - p.cost)}. What did the balance read on the line above it?`,
  answer: p.before,
  misconceptions: [{ cents: p.before - 2 * p.cost, explanation: 'That subtracts the money out a second time. Money out made the balance smaller, so the line above was larger: add it back.' }],
  explanation: `Going back up the page, add the money out back to the balance: ${money(p.before - p.cost)} + ${money(p.cost)} = ${money(p.before)}.`,
}));

// Production: carry a full sheet forward and keep the new sheet going.
const newSheet = {
  id: 'm02-new-sheet', module: 'm02', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 90000, step: 1 }, a: { min: 500, max: 9000, step: 1 }, b: { min: 500, max: 6000, step: 1 }, take: { min: 80000, max: 130000, step: 1 }, bus: { min: 2000, max: 6400, step: 100 }, name: { pick: NAMES } },
  build: (p) => {
    const last = p.start - p.a - p.b;
    const share = splitBuckets(p.take).spending;
    return {
      prompt: `${p.name}'s Spending page, Sheet 1, is full. Work out its last balance, then start Sheet 2: bring the balance forward, add ${money(share)} from payday, then take out ${money(p.bus)} for a bus pass.`,
      ledger: page('Spending bucket', [['2026-06-20', 'Brought forward', p.start, 0], ['2026-06-24', 'Groceries', 0, p.a], ['2026-06-27', 'Phone bill', 0, p.b]], { name: p.name, askFrom: 1, broughtForward: true }),
      fields: [
        { label: 'Sheet 1: last balance', answer: last },
        { label: 'Sheet 2: brought forward', answer: last },
        { label: 'Sheet 2: balance after payday', answer: last + share },
        { label: 'Sheet 2: balance after the bus pass', answer: last + share - p.bus },
      ],
      explanation: `Sheet 1 ends at ${money(last)}, and Sheet 2 starts with that same amount brought forward. Adding ${money(share)} gives ${money(last + share)}. Taking out ${money(p.bus)} leaves ${money(last + share - p.bus)}.`,
    };
  },
};

// Each bucket page's new balance after payday: a running balance on five
// pages (moved here from Module 1, which has not taught running balances).
const bucketPages = {
  id: 'm02-bucket-pages', module: 'm02', kind: 'amounts', part: 'producing', points: 4,
  params: { take: { min: 80000, max: 130000, step: 1 }, sv: { min: 5000, max: 90000, step: 1 }, inv: { min: 2000, max: 60000, step: 1 }, ch: { min: 500, max: 9000, step: 1 }, bl: { min: 0, max: 6000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const b = splitBuckets(p.take);
    const pages = [['Saving', p.sv, b.saving], ['Investing', p.inv, b.investing], ['Charity', p.ch, b.charity], ['Blow money', p.bl, b.blow]];
    return {
      prompt: `Before payday, ${p.name}'s bucket pages show Saving ${money(p.sv)}, Investing ${money(p.inv)}, Charity ${money(p.ch)} and Blow money ${money(p.bl)}. Then ${money(p.take)} of take-home pay is split into the buckets. Write each page's new balance.`,
      fields: pages.map(([label, before, share]) => ({ label: `${label} page after payday`, answer: before + share })),
      explanation: pages.map(([label, before, share]) => `${label}: ${money(before)} + ${money(share)} = ${money(before + share)}`).join('; ') + '.',
    };
  },
};

// --- Lesson -------------------------------------------------------------------

const spendingRows = [
  ['2026-06-06', 'From paycheck', 62007, 0],
  ['2026-06-07', 'Groceries', 0, 4826],
  ['2026-06-08', 'Bus pass', 0, 6400],
  ['2026-06-10', 'Phone bill', 0, 4500],
];

const M02_LESSON = {
  id: 'm02',
  title: 'The ledger page',
  coreIdea: 'Each line of a ledger page records one event. The Balance column always shows what is in the account after that line.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['five-buckets', 'percentages'],
      text: ['From Module 1: a take-home pay of $1,000.00 is split into buckets. How much goes into the Saving bucket (15%)?'],
      answer: 15000,
      misconceptions: [{ cents: 1500, explanation: 'That is 1.5%. 15% is 10% plus 5%.' }],
      explanation: '10% is $100.00 and 5% is $50.00, so 15% is $150.00.',
    },
    {
      id: 'columns', kind: 'explain', title: 'Reading the columns', uses: ['ledger-columns', 'page-per-bucket'],
      text: [
        'Here is a Spending bucket page. Read it left to right, one line at a time.',
        'Date: when it happened. Items: what it was, in a few words. Balance: how much is in the bucket after this line. Money in and money out are listed beside the sheet for now. Module 3 gives them their own columns.',
        'The header tells you whose page this is (Name), which bucket it is (Account), and which sheet of that account you are on (Sheet No.).',
      ],
      prompt: 'On the highlighted line, what happened and how much was left after it?',
      promptAnswer: 'Groceries cost $48.26 on June 7, and $571.81 was left in the Spending bucket after that line.',
      ledger: page('Spending bucket', spendingRows.slice(0, 2)),
      highlightRow: 1,
    },
    {
      id: 'running', kind: 'explain', title: 'Keeping a running balance', uses: ['running-balance', 'ledger-columns'],
      text: [
        'Worked example. Step 1: start from the balance on the line above. Step 2: money in adds to it. Money out subtracts from it. Step 3: write the new balance on this line.',
        'Groceries: $620.07 − $48.26 = $571.81. Bus pass: $571.81 − $64.00 = $507.81. Phone bill: $507.81 − $45.00 = $462.81.',
        'Because every line has its own balance, you always know what is in the bucket right now. And if a balance ever looks wrong, you can find the exact line where the mistake happened.',
      ],
      prompt: 'Why do we start from the balance on the line above, not from the first line?',
      promptAnswer: 'The line above already includes everything that happened before. Starting there means each line only adds or subtracts one new amount.',
      ledger: page('Spending bucket', spendingRows),
      highlightRow: 3,
    },
    {
      id: 'predict-out', kind: 'predict', title: 'Predict: money out', uses: ['running-balance'],
      text: ['On June 12, lunch costs $12.50 from the Spending bucket. What will the Balance column read on that line?'],
      ledger: page('Spending bucket', [...spendingRows, ['2026-06-12', 'Lunch', 0, 1250]], { askFrom: 4 }),
      highlightRow: 4,
      answer: 45031,
      misconceptions: [{ cents: 47531, explanation: 'Money out makes the balance go down, so subtract $12.50 instead of adding it.' }],
      explanation: '$462.81 − $12.50 = $450.31.',
    },
    {
      id: 'predict-in', kind: 'predict', title: 'Predict: money in again', uses: ['running-balance'],
      text: ['The Blow money page got $103.35 on payday. Then a movie cost $18.75. On the next payday, another $103.35 comes in. What is the balance after that line?'],
      ledger: page('Blow money', [['2026-06-06', 'From paycheck', 10335, 0], ['2026-06-13', 'Movie', 0, 1875], ['2026-06-20', 'From paycheck', 10335, 0]], { askFrom: 1, accountNo: 6 }),
      highlightRow: 2,
      answer: 18795,
      misconceptions: [{ cents: 20670, explanation: 'The movie took $18.75 out before the second payday, so subtract it first.' }],
      explanation: '$103.35 − $18.75 = $84.60, then $84.60 + $103.35 = $187.95.',
    },
    {
      id: 'carry', kind: 'explain', title: 'When a sheet is full', uses: ['carry-forward', 'running-balance'],
      text: [
        'A paper sheet has room for about 25 lines. When it is full, start Sheet 2 for the same account.',
        'Its first line says "Brought forward". It carries the last balance from Sheet 1, so the account continues where it left off. Here, Sheet 1 of the Saving bucket ended at $1,240.16.',
      ],
      prompt: 'What would go wrong if Sheet 2 started from zero?',
      promptAnswer: 'The money from Sheet 1 would disappear from your books, and every balance on Sheet 2 would be too low.',
      ledger: page('Saving bucket', [['2026-08-01', 'Brought forward', 124016, 0]], { sheetNo: 2, accountNo: 3, broughtForward: true }),
      highlightRow: 0,
    },
    {
      id: 'predict-carry', kind: 'predict', title: 'Predict: after carrying forward', uses: ['carry-forward', 'running-balance'],
      text: ['On Sheet 2, payday adds $155.02 to the Saving bucket. What is the balance after that line?'],
      ledger: page('Saving bucket', [['2026-08-01', 'Brought forward', 124016, 0], ['2026-08-01', 'From paycheck, 15%', 15502, 0]], { sheetNo: 2, accountNo: 3, broughtForward: true, askFrom: 1 }),
      highlightRow: 1,
      answer: 139518,
      misconceptions: [{ cents: 15502, explanation: 'Sheet 2 starts from the balance brought forward, not from zero.' }],
      explanation: '$1,240.16 + $155.02 = $1,395.18.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked lines', uses: ['running-balance'],
      text: ['Two lines are done for you. After the paycheck the Spending balance was $500.00. After groceries of $38.80 it was $461.20. Finish the next line: a phone bill of $45.00 goes out. What is the balance?'],
      answer: 41620,
      misconceptions: [{ cents: 50620, explanation: 'Money out makes the balance go down. Subtract $45.00 from $461.20.' }],
      explanation: '$461.20 − $45.00 = $416.20.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['running-balance'],
      text: ['A Charity bucket page shows $50.00 in, then $35.40 out, then $12.99 out, then $51.67 in. What is the balance after the last line?'],
      ledger: page('Charity bucket', [['2026-06-06', 'From paycheck', 5000, 0], ['2026-06-09', 'Food bank', 0, 3540], ['2026-06-14', 'Fundraiser', 0, 1299], ['2026-06-20', 'From paycheck', 5167, 0]], { askFrom: 0, accountNo: 5 }),
      highlightRow: 3,
      answer: 5328,
      explanation: '$50.00 − $35.40 = $14.60; − $12.99 = $1.61; + $51.67 = $53.28.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['running-balance'],
      text: ['A bucket shows $210.00. Then there is money out of $47.50. What is the new balance?'],
      answer: 16250,
      explanation: '$210.00 − $47.50 = $162.50.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['running-balance'],
      text: ['The same bucket then gets money in of $103.35. What is the new balance?'],
      answer: 26585,
      misconceptions: [{ cents: 31335, explanation: 'Start from the balance after the money out, not from $210.00.' }],
      explanation: '$162.50 + $103.35 = $265.85.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['carry-forward', 'running-balance'],
      text: ['That sheet is now full. Sheet 2 starts with a "Brought forward" line, then money out of $19.99. What is the balance after the money out?'],
      answer: 24586,
      explanation: 'Brought forward $265.85, then $265.85 − $19.99 = $245.86.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [afterSpending, broughtForwardThenIn].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation.
const drill = [1, 2, 3].map((n) => num(`m02-drill-${n}`, 'interpreting', { a: { min: 5000, max: 50000, step: 1 }, b: { min: 100, max: 4999, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: balance ${money(p.a)}, money out ${money(p.b)}. New balance?`, answer: p.a - p.b,
  explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const M02_PRACTICE = {
  id: 'm02-practice', kind: 'practice', module: 'm02', title: 'Module 2 practice set',
  templates: [...drill, recallSplit, ...M01_LESSON.recallTemplates, afterIncome, afterSpending, twoLines, broughtForwardThenIn, fourBalances, { ...explainLedger, id: 'm02-explain-practice' }],
};

const M02_EXTRA = {
  id: 'm02-extra', kind: 'practice', module: 'm02', title: 'Module 2 extra practice',
  templates: [afterIncome, twoLines, pageEnd, findStart, fourBalances, newSheet, bucketPages].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M02_REMEDIAL = {
  id: 'm02-remedial', kind: 'practice', module: 'm02', title: 'Module 2: common mistakes',
  templates: [afterSpending, broughtForwardThenIn, twoLines].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const M02_GATE = {
  id: 'm02', kind: 'gate', title: 'Module 2 check',
  templates: [afterSpending, broughtForwardThenIn, afterIncome, twoLines, pageEnd, findStart, drill[0], fourBalances, newSheet, explainLedger],
};

// Questions Checkpoint A draws from this module.
const M02_CHECKPOINT = [afterSpending, broughtForwardThenIn, fourBalances];
};

defs["content/modules/m03.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate } = require("content/helpers.js");
const { normalSide } = require("js/ledger.js");
const { M01_LESSON } = require("content/modules/m01.js");
const { M02_LESSON } = require("content/modules/m02.js");
define(exports, { M03_LESSON: () => M03_LESSON, M03_PRACTICE: () => M03_PRACTICE, M03_EXTRA: () => M03_EXTRA, M03_REMEDIAL: () => M03_REMEDIAL, M03_GATE: () => M03_GATE, M03_CHECKPOINT: () => M03_CHECKPOINT });
// Module 3: Debit and credit. Ideas: accounting-equation, debit-credit-rules,
// equal-sides. From here on the sheet shows every column. Amounts are
// illustrative.






const num = (id, part, params, build) => ({ id, module: 'm03', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const ACCOUNTS = [
  { id: 'checking', label: 'Checking (asset)' },
  { id: 'saving', label: 'Saving bucket (asset)' },
  { id: 'wages', label: 'Wages (income)' },
  { id: 'owed-friend', label: 'Owed to a friend (liability)' },
];

function ledger(account, type, rows, { accountNo = 1, name = 'Jordan (example)', askFrom = null } = {}) {
  return {
    sheetNo: 1, accountNo, name, account, type,
    rows: rows.map(([date, items, folio, debit, credit], i) => ({
      // Folio references and posted ticks are taught in Modules 5 and 6.
      date, items, folio: '', debit, credit, posted: [false, false],
      ...(askFrom !== null && i >= askFrom ? { ask: ['balance', 'side'] } : {}),
    })),
  };
}

// --- Question templates -----------------------------------------------------

const netWorth = num('m03-net-worth', 'interpreting', { own: { min: 80000, max: 400000, step: 1 }, owe: { min: 5000, max: 70000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} owns ${money(p.own)} (cash and the money in checking) and owes ${money(p.owe)}. Use what you own = what you owe + what you are worth. What is ${p.name}'s net worth?`,
  answer: p.own - p.owe,
  misconceptions: [{ cents: p.own + p.owe, explanation: 'What you owe is not yours. Net worth is what you own minus what you owe.' }],
  explanation: `${money(p.own)} − ${money(p.owe)} = ${money(p.own - p.owe)}.`,
}));

// Applies the debit and credit rules to an account of any type: only the
// debits and credits are given, so the rules (not everyday sense) decide.
const RULE_ACCOUNTS = [
  { label: 'Checking', type: 'asset', words: 'an asset' },
  { label: 'Owed to a friend', type: 'liability', words: 'a liability' },
  { label: 'Wages', type: 'income', words: 'income' },
  { label: 'Groceries', type: 'expense', words: 'an expense' },
];
const ruleBalance = num('m03-rule-balance', 'interpreting', { acct: { pick: [0, 1, 2, 3] }, start: { min: 20000, max: 60000, step: 1 }, cr: { min: 1000, max: 15000, step: 1 }, dr: { min: 1000, max: 15000, step: 1 } }, (p) => {
  const a = RULE_ACCOUNTS[p.acct];
  const debitNormal = normalSide(a.type) === 'Dr';
  const change = debitNormal ? p.dr - p.cr : p.cr - p.dr;
  const opposite = p.start - change;
  return {
    prompt: `The ${a.label} page (${a.words}) has a ${debitNormal ? 'debit' : 'credit'} balance of ${money(p.start)}. It is credited ${money(p.cr)}, then debited ${money(p.dr)}. What is its balance now?`,
    answer: p.start + change,
    misconceptions: change === 0 ? [] : [{ cents: opposite, explanation: `${a.label} is ${a.words}, which goes up with a ${debitNormal ? 'debit' : 'credit'} and down with a ${debitNormal ? 'credit' : 'debit'}.` }],
    explanation: `${a.label} is ${a.words}: it goes up with a ${debitNormal ? 'debit' : 'credit'}. ${money(p.start)} ${debitNormal ? '−' : '+'} ${money(p.cr)} ${debitNormal ? '+' : '−'} ${money(p.dr)} = ${money(p.start + change)}.`,
  };
});

const recordTransfer = {
  id: 'm03-record-transfer', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 5000, max: 30000, step: 1 }, kind: { pick: ['save', 'pay'] } },
  build: (p) => (p.kind === 'save'
    ? {
      prompt: `Write the debits and credits for moving ${money(p.amount)} from Checking into the Saving bucket.`,
      accounts: ACCOUNTS,
      answer: [{ account: 'saving', debit: p.amount, credit: 0 }, { account: 'checking', debit: 0, credit: p.amount }],
      explanation: 'Saving (an asset) goes up: debit. Checking (an asset) goes down: credit. Both sides are equal.',
    }
    : {
      prompt: `You earn ${money(p.amount)} and it arrives in your Checking account with nothing withheld. Write the debits and credits.`,
      accounts: ACCOUNTS,
      answer: [{ account: 'checking', debit: p.amount, credit: 0 }, { account: 'wages', debit: 0, credit: p.amount }],
      explanation: 'Checking (an asset) goes up: debit. Wages (income) goes up: credit. Both sides are equal.',
    }),
};

const explainRules = explainTemplate({
  id: 'm03-explain', module: 'm03',
  variants: [
    { prompt: 'In one or two sentences: why does a liability (money you owe) go up on the credit side?',
      modelAnswer: 'Because liabilities sit on the other side of the equation from assets. Assets increase with debits, so liabilities and net worth increase with credits.',
      rubric: ['Says liabilities are on the other side from assets', 'Says that is why they increase with a credit'] },
    { prompt: 'In one or two sentences: why must the debit side and the credit side of every entry be equal?',
      modelAnswer: 'Every event changes at least two accounts by the same amount. So the equation, what you own = what you owe + what you are worth, stays balanced.',
      rubric: ['Says every entry changes two (or more) accounts by the same amount', 'Says this keeps the equation (or the books) balanced'] },
    { prompt: 'In one or two sentences: why does paying back a debt not change your net worth?',
      modelAnswer: 'You own less (the cash leaves) and you owe less by the same amount, so what you own minus what you owe stays the same.',
      rubric: ['Says what you own and what you owe both fall', 'Says they fall by the same amount, so net worth is unchanged'] },
    { prompt: 'In one or two sentences: when wages arrive in Checking, which account is debited and which is credited, and why?',
      modelAnswer: 'Checking is debited because an asset goes up. Wages is credited because income goes up with a credit.',
      rubric: ['Debits Checking because an asset increases', 'Credits Wages because income increases with a credit'] },
  ],
});

const recallBalance = num('m03-recall-balance', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, out: { min: 500, max: 8000, step: 1 } }, (p) => ({
  prompt: `Recall: a bucket shows ${money(p.start)}. Then ${money(p.out)} goes out. What is the new balance?`, answer: p.start - p.out,
  explanation: `${money(p.start)} − ${money(p.out)} = ${money(p.start - p.out)}.`,
}));

const assetAfterDebit = num('m03-asset-debit', 'interpreting', { start: { min: 10000, max: 60000, step: 1 }, debit: { min: 1000, max: 20000, step: 1 } }, (p) => ({
  prompt: `The Saving bucket (an asset) has a debit balance of ${money(p.start)}. It is debited ${money(p.debit)}. What is its balance now?`,
  answer: p.start + p.debit,
  misconceptions: [{ cents: p.start - p.debit, explanation: 'An asset goes up with a debit.' }],
  explanation: `Assets increase with a debit: ${money(p.start)} + ${money(p.debit)} = ${money(p.start + p.debit)}.`,
}));

const otherSide = num('m03-other-side', 'interpreting', { a: { min: 5000, max: 20000, step: 1 }, b: { min: 3000, max: 15000, step: 1 } }, (p) => ({
  prompt: `An entry debits the Saving bucket ${money(p.a)} and the Investing bucket ${money(p.b)}. Checking is credited for the whole amount. How much is the credit?`,
  answer: p.a + p.b,
  explanation: `The two sides must be equal: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
}));

// The equation worked for what is owed.
const oweFromWorth = num('m03-owe-from-worth', 'interpreting', { own: { min: 80000, max: 400000, step: 1 }, owe: { min: 5000, max: 70000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} owns ${money(p.own)} and is worth ${money(p.own - p.owe)}. Use the equation: what you own = what you owe + what you are worth. How much does ${p.name} owe?`,
  answer: p.owe,
  misconceptions: [{ cents: 2 * p.own - p.owe, explanation: 'That adds. What you owe is what you own minus what you are worth, so subtract.' }],
  explanation: `${money(p.own)} − ${money(p.own - p.owe)} = ${money(p.owe)}.`,
}));

// Borrowing raises what you own and what you owe by the same amount.
const ownAfterBorrow = num('m03-own-after-borrow', 'interpreting', { own: { min: 50000, max: 300000, step: 1 }, borrow: { min: 2000, max: 30000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} owns ${money(p.own)}. ${p.name} borrows ${money(p.borrow)} from a friend, and it goes into Checking. How much does ${p.name} own now?`,
  answer: p.own + p.borrow,
  misconceptions: [{ cents: p.own - p.borrow, explanation: 'That subtracts the loan. The borrowed money is in Checking now, so what you own goes up. What you owe goes up by the same amount.' }],
  explanation: `Checking (an asset) is debited ${money(p.borrow)}: ${money(p.own)} + ${money(p.borrow)} = ${money(p.own + p.borrow)}. "Owed to a friend" is credited the same amount, so net worth does not change.`,
}));

// Production: borrowing from a friend and paying the friend back, a different
// one in each version; both are two-line entries.
const BORROW_ACCOUNTS = [...ACCOUNTS, { id: 'groceries', label: 'Groceries (expense)' }];
const recordBorrow = {
  id: 'm03-record-borrow', module: 'm03', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 2000, max: 20000, step: 1 }, event: { byVersion: ['borrow', 'repay', 'borrow', 'repay'] } },
  build: (p) => (p.event === 'borrow'
    ? {
      prompt: `Write the debits and credits: you borrow ${money(p.amount)} from a friend, and it goes into Checking.`,
      accounts: BORROW_ACCOUNTS,
      answer: [{ account: 'checking', debit: p.amount, credit: 0 }, { account: 'owed-friend', debit: 0, credit: p.amount }],
      explanation: 'Checking (an asset) goes up, so it is a debit. Owed to a friend (a liability) goes up, so it is a credit.',
    }
    : {
      prompt: `Write the debits and credits: you pay a friend back ${money(p.amount)} from Checking.`,
      accounts: BORROW_ACCOUNTS,
      answer: [{ account: 'owed-friend', debit: p.amount, credit: 0 }, { account: 'checking', debit: 0, credit: p.amount }],
      explanation: 'Owed to a friend (a liability) goes down, so it is a debit. Checking (an asset) goes down, so it is a credit.',
    }),
};

// --- Lesson -------------------------------------------------------------------

const M03_LESSON = {
  id: 'm03',
  title: 'Debit and credit',
  coreIdea: 'What you own equals what you owe plus what you are worth. Every entry has a debit side and a credit side, and the two sides are equal.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['running-balance'],
      text: ['From Module 2: a bucket shows $300.00. Then $45.25 goes out and $20.00 comes in. What is the balance?'],
      answer: 27475,
      explanation: '$300.00 − $45.25 = $254.75, then + $20.00 = $274.75.',
    },
    {
      id: 'equation', kind: 'explain', title: 'Own, owe, worth', uses: ['accounting-equation'],
      text: [
        'Everything in your books fits one sentence: what you own = what you owe + what you are worth.',
        'What you own (assets) is cash, checking and your buckets. What you owe (liabilities) is money you borrowed or a card balance. What you are worth (net worth) is what would be left if you paid back everything you owe.',
        'Example: you own $1,500.00 and owe $400.00, so you are worth $1,100.00. Check: $1,500.00 = $400.00 + $1,100.00.',
      ],
      prompt: 'If you owe nothing, how does your net worth compare with what you own?',
      promptAnswer: 'They are the same. With nothing owed, everything you own is yours, so net worth equals what you own.',
    },
    {
      id: 'predict-worth', kind: 'predict', title: 'Predict: net worth', uses: ['accounting-equation'],
      text: ['Rosa owns $2,350.00 and owes $615.40. What is her net worth?'],
      answer: 173460,
      misconceptions: [{ cents: 296540, explanation: 'What you owe is not yours. Subtract it from what you own.' }],
      explanation: '$2,350.00 − $615.40 = $1,734.60.',
    },
    {
      id: 'rules', kind: 'explain', title: 'The debit and credit rules', uses: ['debit-credit-rules', 'accounting-equation', 'ledger-columns'],
      text: [
        'Now the grayed-out columns open up. Debits is the left money column. Credits is the right money column. Every account goes up on one side and down on the other.',
        'Two more kinds of account: income is money you earn, such as wages. An expense is money used up on something, such as groceries or taxes.',
        'Assets (what you own) and expenses go up with a debit. Liabilities (what you owe), income and net worth go up with a credit. That is the whole set of rules.',
        'Why the opposite sides? Assets are on one side of the equation, and liabilities and net worth are on the other side. So they work in opposite ways: assets increase with a debit, and liabilities and net worth increase with a credit.',
        'Look at the two pages. A debit raises the Saving bucket (an asset). A credit raises "Owed to a friend" (a liability). The Dr/Cr column shows which side the balance is on.',
      ],
      prompt: 'Why do you think liabilities go up on the opposite side from assets?',
      promptAnswer: 'Liabilities sit on the other side of the equation from assets, so they work the opposite way: assets rise with debits, liabilities rise with credits.',
      ledgers: [
        ledger('Saving bucket', 'asset', [['2026-06-06', 'From paycheck, 15%', 'J1', 15502, 0]], { accountNo: 3 }),
        ledger('Owed to a friend', 'liability', [['2026-06-09', 'Borrowed for a phone repair', 'J2', 0, 6000]], { accountNo: 20 }),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-liability', kind: 'predict', title: 'Predict: a liability page', uses: ['debit-credit-rules'],
      text: ['You owe a friend $60.00. You pay back $25.00 (a debit). What is the balance now?'],
      ledger: ledger('Owed to a friend', 'liability', [['2026-06-09', 'Borrowed for a phone repair', 'J2', 0, 6000], ['2026-06-20', 'Paid back part', 'J3', 2500, 0]], { accountNo: 20, askFrom: 1 }),
      highlightRow: 1,
      answer: 3500,
      misconceptions: [{ cents: 8500, explanation: 'A debit makes a liability go down: you owe less after paying back.' }],
      explanation: 'A liability goes down with a debit: $60.00 − $25.00 = $35.00. It is still a credit balance.',
    },
    {
      id: 'equal', kind: 'explain', title: 'Two equal sides', uses: ['equal-sides', 'debit-credit-rules'],
      text: [
        'Every event changes at least two accounts. Moving $155.02 from Checking into Saving raises Saving (debit) and lowers Checking (credit). Both change by the same amount.',
        'Look at both pages: the same $155.02 is a debit on the Saving page and a credit on the Checking page. The debit total always equals the credit total, so the equation always balances. (In Module 6 you will write events like this in a journal first.)',
      ],
      prompt: 'What would happen to the equation if an entry had only a debit?',
      promptAnswer: 'One side of the equation would change and the other would not, so what you own would no longer equal what you owe plus what you are worth.',
      ledgers: [
        ledger('Saving bucket', 'asset', [['2026-06-06', 'From Checking', '', 15502, 0]], { accountNo: 3 }),
        ledger('Checking', 'asset', [['2026-06-05', 'Opening balance', '', 103346, 0], ['2026-06-06', 'To Saving bucket', '', 0, 15502]], { accountNo: 1 }),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-credit', kind: 'predict', title: 'Predict: the other side', uses: ['equal-sides'],
      text: ['An entry debits the Saving bucket $155.02 and the Investing bucket $103.35. It credits Checking for the whole amount. How much is the credit?'],
      answer: 25837,
      misconceptions: [{ cents: 15502, explanation: 'Checking pays for both buckets, so the credit is the total of both debits.' }],
      explanation: '$155.02 + $103.35 = $258.37. The credit equals the two debits added together.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['debit-credit-rules'],
      text: ['The Saving bucket (an asset) has a debit balance of $300.00. Step 1 is done: money comes in, so it is debited $45.00. Step 2 is done: assets go up with a debit. Finish Step 3: what is the new balance?'],
      answer: 34500,
      misconceptions: [{ cents: 25500, explanation: 'An asset goes up with a debit, so add.' }],
      explanation: '$300.00 + $45.00 = $345.00, a debit balance.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['accounting-equation', 'equal-sides'],
      text: ['Eli owns $1,800.00 and owes $300.00. He uses $100.00 from Checking to pay back part of the debt. What is his net worth afterward?'],
      answer: 150000,
      misconceptions: [{ cents: 140000, explanation: 'Paying a debt lowers what you own and what you owe by the same amount. So net worth does not change.' }],
      explanation: 'Before: $1,800.00 − $300.00 = $1,500.00. After: $1,700.00 − $200.00 = $1,500.00. Net worth is unchanged.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['debit-credit-rules'],
      text: ['The Checking account (an asset) has a debit balance of $412.00. It is credited $57.80. What is its balance now?'],
      answer: 35420,
      explanation: 'An asset goes down with a credit: $412.00 − $57.80 = $354.20.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['debit-credit-rules'],
      text: ['"Owed to a friend" (a liability) has a credit balance of $80.00. It is credited $20.00. What is its balance now?'],
      answer: 10000,
      misconceptions: [{ cents: 6000, explanation: 'A liability goes up with a credit.' }],
      explanation: 'A liability goes up with a credit: $80.00 + $20.00 = $100.00.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['accounting-equation'],
      text: ['You own $950.00 and owe $120.00. What is your net worth?'],
      answer: 83000,
      explanation: '$950.00 − $120.00 = $830.00.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [netWorth, assetAfterDebit].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation.
const drill = [1, 2, 3].map((n) => num(`m03-drill-${n}`, 'interpreting', { a: { min: 5000, max: 50000, step: 1 }, b: { min: 100, max: 4999, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: an asset with a debit balance of ${money(p.a)} is debited ${money(p.b)}. New balance?`, answer: p.a + p.b,
  explanation: `Assets go up with a debit: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

const M03_PRACTICE = {
  id: 'm03-practice', kind: 'practice', module: 'm03', title: 'Module 3 practice set',
  templates: [...drill, recallBalance, ...M01_LESSON.recallTemplates, ...M02_LESSON.recallTemplates, assetAfterDebit, netWorth, ruleBalance, otherSide, recordTransfer, { ...explainRules, id: 'm03-explain-practice' }],
};

const M03_EXTRA = {
  id: 'm03-extra', kind: 'practice', module: 'm03', title: 'Module 3 extra practice',
  templates: [assetAfterDebit, otherSide, oweFromWorth, ownAfterBorrow, recordTransfer, recordBorrow].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M03_REMEDIAL = {
  id: 'm03-remedial', kind: 'practice', module: 'm03', title: 'Module 3: common mistakes',
  templates: [ruleBalance, netWorth, recordTransfer].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const M03_GATE = {
  id: 'm03', kind: 'gate', title: 'Module 3 check',
  templates: [netWorth, oweFromWorth, ownAfterBorrow, ruleBalance, assetAfterDebit, otherSide, drill[0], recordTransfer, recordBorrow, explainRules],
};

// Questions Checkpoint A draws from this module.
const M03_CHECKPOINT = [netWorth, recordTransfer, explainRules];
};

defs["content/modules/m04.js"] = function (exports, require, define) {
const { percentOf } = require("js/money.js");
const { money, NAMES, standardPaycheck, payStub, explainTemplate, exactPercent, PAYCHECK_SOURCES } = require("content/helpers.js");
const { M01_LESSON } = require("content/modules/m01.js");
const { M02_LESSON } = require("content/modules/m02.js");
const { M03_LESSON } = require("content/modules/m03.js");
define(exports, { M04_LESSON: () => M04_LESSON, M04_PRACTICE: () => M04_PRACTICE, M04_EXTRA: () => M04_EXTRA, M04_REMEDIAL: () => M04_REMEDIAL, M04_GATE: () => M04_GATE, M04_CHECKPOINT: () => M04_CHECKPOINT });
// Module 4: Your paycheck. Ideas: gross-vs-net, paycheck-deductions,
// recording-paycheck. Uses the real 2026 figures (content/tax2026.js); the
// employer on every pay stub is fictional.







const num = (id, part, params, build) => ({ id, module: 'm04', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
// Two weeks of straight-time pay: at most 40 hours a week. Over 40 hours a
// week, federal law requires overtime at 1.5 times the hourly wage.
const HOURS = { min: 40, max: 80, step: 1 };
const ACCOUNTS = [
  { id: 'checking', label: 'Checking (asset)' },
  { id: 'taxes', label: 'Taxes withheld (expense)' },
  { id: 'wages', label: 'Wages (income)' },
  { id: 'saving', label: 'Saving bucket (asset)' },
];
const deductions = (p) => p.socialSecurity + p.medicare + p.federal + p.arizona;

// --- Question templates -----------------------------------------------------

const grossPay = num('m04-gross', 'interpreting', { hours: HOURS, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} works ${p.hours} hours in two weeks at Arizona's 2026 minimum wage of $15.15 an hour. What is the gross pay?`,
  answer: standardPaycheck(p.hours).gross,
  explanation: `${p.hours} × $15.15 = ${money(standardPaycheck(p.hours).gross)}.`,
  sources: ['azica-min-wage-2026'],
}));

const medicare = num('m04-medicare', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `Gross pay is ${money(pay.gross)}. Medicare takes 1.45%. How much is withheld for Medicare, rounded to the cent?`,
    answer: pay.medicare,
    misconceptions: [{ cents: percentOf(pay.gross, 0.145), explanation: 'That is 14.5%. Medicare is 1.45%.' }],
    explanation: `1.45% is 0.0145, and 0.0145 × ${money(pay.gross)} = ${exactPercent(pay.gross, 0.0145)}, which rounds to ${money(pay.medicare)} (4 and below, keep it below; 5 and above, give it a shove).`,
    sources: ['ssa-cola-2026'],
  };
});

const netFromStub = num('m04-net', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `A pay stub shows gross pay of ${money(pay.gross)}. It shows these taxes withheld: Social Security ${money(pay.socialSecurity)}, Medicare ${money(pay.medicare)}, federal income tax ${money(pay.federal)} and Arizona income tax ${money(pay.arizona)}. What is the take-home pay?`,
    answer: pay.net,
    misconceptions: [{ cents: pay.gross - pay.federal, explanation: 'Take away all four deductions, not just federal income tax.' }],
    explanation: `${money(pay.gross)} − ${money(deductions(pay))} = ${money(pay.net)}.`,
    sources: PAYCHECK_SOURCES,
  };
});

const socialSecurity = num('m04-social-security', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `Gross pay is ${money(pay.gross)}. Social Security takes 6.2%. How much is withheld, rounded to the cent?`,
    answer: pay.socialSecurity,
    misconceptions: [{ cents: percentOf(pay.gross, 0.62), explanation: 'That is 62%. Social Security is 6.2%.' }],
    explanation: `6.2% is 0.062, and 0.062 × ${money(pay.gross)} = ${exactPercent(pay.gross, 0.062)}, which rounds to ${money(pay.socialSecurity)}.`,
    sources: ['ssa-cola-2026'],
  };
});

const recordPaycheck = {
  id: 'm04-record-paycheck', module: 'm04', kind: 'entry', part: 'producing', points: 4,
  params: { hours: HOURS },
  build: (p) => {
    const pay = standardPaycheck(p.hours);
    return {
      prompt: `Record this paycheck. Gross pay: ${money(pay.gross)}. Total taxes withheld: ${money(deductions(pay))}. Take-home pay: ${money(pay.net)}, deposited in Checking.`,
      accounts: ACCOUNTS,
      answer: [
        { account: 'checking', debit: pay.net, credit: 0 },
        { account: 'taxes', debit: deductions(pay), credit: 0 },
        { account: 'wages', debit: 0, credit: pay.gross },
      ],
      explanation: 'Checking (asset) and Taxes withheld (expense) are debited. Wages (income) is credited for the full gross pay. The two sides are equal.',
      sourceDoc: payStub(p.hours),
      sources: PAYCHECK_SOURCES,
    };
  },
};

const explainPay = explainTemplate({
  id: 'm04-explain', module: 'm04',
  variants: [
    { prompt: 'In one or two sentences: why is Wages credited with the gross pay, not the take-home pay?',
      modelAnswer: 'You earned the whole gross amount. Part of it was paid to the government for you as taxes. So Wages records all of it, and the taxes are recorded as an expense.',
      rubric: ['Says the whole gross amount was earned', 'Says the withheld part is recorded separately (as a tax expense)'] },
    { prompt: 'In one or two sentences: what is the difference between gross pay and take-home pay?',
      modelAnswer: 'Gross pay is what you earned before anything is taken out. Take-home pay is what is left after taxes are withheld. It is the amount that reaches your account.',
      rubric: ['Gross is before deductions', 'Take-home is what is left after deductions (what you actually receive)'] },
    { prompt: 'In one or two sentences: why should a budget start from take-home pay rather than gross pay?',
      modelAnswer: 'Take-home pay is the money you actually get to use. The withheld taxes never reach your account.',
      rubric: ['Says take-home is the money you actually receive', 'Says withheld taxes cannot be spent or saved'] },
    { prompt: 'In one or two sentences: why does the paycheck entry debit two accounts?',
      modelAnswer: 'Part of the pay goes to Checking and part goes to taxes, so both are debited. Together they equal the gross pay credited to Wages.',
      rubric: ['Names Checking and Taxes withheld (or taxes) as the two debits', 'Says the two debits together equal the gross pay credited'] },
  ],
});

const recallEquation = num('m04-recall-equation', 'interpreting', { own: { min: 50000, max: 300000, step: 1 }, owe: { min: 1000, max: 40000, step: 1 } }, (p) => ({
  prompt: `Recall: you own ${money(p.own)} and owe ${money(p.owe)}. What is your net worth?`, answer: p.own - p.owe,
  explanation: `${money(p.own)} − ${money(p.owe)} = ${money(p.own - p.owe)}.`,
}));

const taxesTotal = num('m04-taxes-total', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `Add up the taxes withheld: Social Security ${money(pay.socialSecurity)}, Medicare ${money(pay.medicare)}, federal ${money(pay.federal)}, Arizona ${money(pay.arizona)}.`,
    answer: deductions(pay), explanation: `Together they total ${money(deductions(pay))}.`, sources: PAYCHECK_SOURCES,
  };
});

const arizona = num('m04-arizona', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `Gross pay is ${money(pay.gross)}. Arizona withholds 2.0% when no other rate was chosen on Form A-4. How much is withheld for Arizona income tax, rounded to the cent?`,
    answer: pay.arizona,
    misconceptions: [{ cents: percentOf(pay.gross, 0.2), explanation: 'That is 20%. 2.0% is 0.02 as a decimal.' }],
    explanation: `0.02 × ${money(pay.gross)} = ${exactPercent(pay.gross, 0.02)}, which rounds to ${money(pay.arizona)}.`,
    sources: ['azdor-a4-2026'],
  };
});

// Production: finish a pay stub. Gross pay and federal income tax are given.
const stubLines = {
  id: 'm04-stub-lines', module: 'm04', kind: 'amounts', part: 'producing', points: 4,
  params: { hours: HOURS },
  build: (p) => {
    const pay = standardPaycheck(p.hours);
    return {
      prompt: `Finish this pay stub. Gross pay is ${money(pay.gross)} and federal income tax is ${money(pay.federal)}. Work out the other three deductions (Social Security 6.2%, Medicare 1.45%, Arizona 2.0%) and the take-home pay. Round each deduction to the cent.`,
      sourceDoc: payStub(p.hours, { detail: false }),
      fields: [
        { label: 'Social Security (6.2%)', answer: pay.socialSecurity },
        { label: 'Medicare (1.45%)', answer: pay.medicare },
        { label: 'Arizona income tax (2.0%)', answer: pay.arizona },
        { label: 'Take-home pay', answer: pay.net },
      ],
      explanation: `Social Security ${money(pay.socialSecurity)}, Medicare ${money(pay.medicare)}, Arizona ${money(pay.arizona)}. Take-home: ${money(pay.gross)} − ${money(deductions(pay))} = ${money(pay.net)}.`,
      sources: PAYCHECK_SOURCES,
    };
  },
};

// Reading a pay stub: the one line left blank is worked out from the others.
const federalLine = num('m04-federal-line', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `A pay stub shows gross pay ${money(pay.gross)}, Social Security ${money(pay.socialSecurity)}, Medicare ${money(pay.medicare)}, Arizona income tax ${money(pay.arizona)} and take-home pay ${money(pay.net)}. The federal income tax line is smudged. How much was it?`,
    answer: pay.federal,
    misconceptions: [{ cents: pay.gross - pay.net, explanation: 'That is all four deductions together. Take away the three you can read.' }],
    explanation: `All deductions: ${money(pay.gross)} − ${money(pay.net)} = ${money(deductions(pay))}. Federal: ${money(deductions(pay))} − ${money(pay.socialSecurity)} − ${money(pay.medicare)} − ${money(pay.arizona)} = ${money(pay.federal)}.`,
    sources: PAYCHECK_SOURCES,
  };
});

// --- Lesson -------------------------------------------------------------------

const std = standardPaycheck(80);
const p72 = standardPaycheck(72);

const M04_LESSON = {
  id: 'm04',
  title: 'Your paycheck',
  coreIdea: 'Gross pay minus the taxes withheld is take-home pay. One entry records all of it: Checking and Taxes withheld are debited, and Wages is credited.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['accounting-equation'],
      text: ['From Module 3: you own $900.00 and owe $250.00. What is your net worth?'],
      answer: 65000,
      explanation: '$900.00 − $250.00 = $650.00.',
    },
    {
      id: 'gross-net', kind: 'explain', title: 'Gross pay and take-home pay', uses: ['gross-vs-net'],
      text: [
        'Gross pay is what you earn before anything is taken out. It is hours × hourly wage. Working 80 hours in two weeks at Arizona\'s 2026 minimum wage of $15.15 an hour gives 80 × $15.15 = $1,212.00.',
        'Take-home pay (also called net pay) is what reaches your account after taxes are withheld. For this paycheck it is $1,033.46. Your five buckets are split from that amount.',
        'This course uses at most 40 hours a week. Hours over 40 in one week earn overtime, which by federal law is paid at 1.5 times the hourly wage.',
      ],
      prompt: 'Why is take-home pay smaller than gross pay?',
      promptAnswer: 'Taxes are taken out (withheld) before the pay reaches your account, so you receive less than you earned.',
      sourceDoc: payStub(80, { detail: false }),
      sources: ['azica-min-wage-2026'],
    },
    {
      id: 'deductions', kind: 'explain', title: 'Where the difference goes', uses: ['paycheck-deductions', 'percentages'],
      text: [
        `Four amounts are withheld. Social Security is 6.2% of gross pay: $75.144, which rounds to ${money(std.socialSecurity)}. Medicare is 1.45% of gross pay: $17.574, which rounds to ${money(std.medicare)}.`,
        `Federal income tax is worked out from the IRS tables for 2026. For this paycheck it is ${money(std.federal)}. Arizona income tax is 2.0% unless you choose another rate on Form A-4. For this paycheck it is ${money(std.arizona)}.`,
        `Total withheld: ${money(deductions(std))}. $1,212.00 − ${money(deductions(std))} = $1,033.46. Remember the rounding rhyme. Look at the thousandths digit: 4 and below, keep it below; 5 and above, give it a shove.`,
        'The federal figure assumes a single filer who left Steps 2 to 4 of Form W-4 blank. Your own may differ. Many pay stubs also show other deductions, such as health insurance or a retirement plan; they come out before take-home pay in the same way.',
      ],
      prompt: 'Which of the four deductions is worked out from a table instead of a single percentage?',
      promptAnswer: 'Federal income tax. It comes from the IRS tables for the year; the other three are each one percentage of gross pay.',
      sourceDoc: payStub(80),
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-ss', kind: 'predict', title: 'Predict: Social Security', uses: ['paycheck-deductions', 'percentages'],
      text: ['Kai worked 72 hours, so gross pay is $1,090.80. How much Social Security (6.2%) is withheld? Round to the cent.'],
      sourceDoc: payStub(72, { detail: false, employer: 'Burger Barn (fictional)' }),
      answer: p72.socialSecurity,
      misconceptions: [{ cents: percentOf(p72.gross, 0.62), explanation: 'That is 62%. Social Security is 6.2%.' }],
      explanation: `6.2% of $1,090.80 is $67.6296. The thousandths digit is 9, so it rounds up to ${money(p72.socialSecurity)}.`,
      sources: ['ssa-cola-2026'],
    },
    {
      id: 'predict-net', kind: 'predict', title: 'Predict: take-home pay', uses: ['gross-vs-net', 'paycheck-deductions'],
      text: [`Kai's gross pay is $1,090.80. The deductions are Social Security ${money(p72.socialSecurity)}, Medicare ${money(p72.medicare)}, federal income tax ${money(p72.federal)} and Arizona income tax ${money(p72.arizona)}. What is the take-home pay?`],
      answer: p72.net,
      misconceptions: [{ cents: p72.gross - p72.federal, explanation: 'Take away all four deductions, not just federal income tax.' }],
      explanation: `The four deductions total ${money(deductions(p72))}. $1,090.80 − ${money(deductions(p72))} = ${money(p72.net)}.`,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'record', kind: 'explain', title: 'Recording the paycheck', uses: ['recording-paycheck', 'debit-credit-rules', 'equal-sides'],
      text: [
        'One paycheck changes three accounts. Checking goes up by the take-home pay: debit. Taxes withheld is an expense: debit. Wages, the income you earned, goes up by the full gross pay: credit.',
        `Debits: $1,033.46 + ${money(deductions(std))} = $1,212.00. Credit: $1,212.00. The two sides are equal. The three pages show each change.`,
      ],
      prompt: 'Why is Wages credited for $1,212.00 and not $1,033.46?',
      promptAnswer: 'You earned the whole $1,212.00. Part of it was paid as taxes for you, and that part is recorded as the Taxes withheld expense.',
      ledgers: [
        { sheetNo: 1, accountNo: 1, name: 'Jordan (example)', account: 'Checking', type: 'asset',
          rows: [{ date: '2026-06-05', items: 'Paycheck', folio: '', debit: std.net, credit: 0, posted: [false, false] }] },
        { sheetNo: 1, accountNo: 50, name: 'Jordan (example)', account: 'Taxes withheld', type: 'expense',
          rows: [{ date: '2026-06-05', items: 'Paycheck', folio: '', debit: deductions(std), credit: 0, posted: [false, false] }] },
        { sheetNo: 1, accountNo: 40, name: 'Jordan (example)', account: 'Wages', type: 'income',
          rows: [{ date: '2026-06-05', items: 'Paycheck', folio: '', debit: 0, credit: std.gross, posted: [false, false] }] },
      ],
      highlightRow: 0,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['paycheck-deductions', 'percentages'],
      text: [`Kai's pay stub is almost done: gross pay $1,090.80, Social Security ${money(p72.socialSecurity)}, Medicare ${money(p72.medicare)}, federal income tax ${money(p72.federal)}. Finish the last line: Arizona income tax at 2.0%.`],
      answer: p72.arizona,
      misconceptions: [{ cents: percentOf(p72.gross, 0.2), explanation: 'That is 20%. 2.0% is 0.02 as a decimal.' }],
      explanation: `2.0% is 0.02, and 0.02 × $1,090.80 = ${exactPercent(p72.gross, 0.02)}, which rounds to ${money(p72.arizona)}.`,
      sources: ['azdor-a4-2026'],
    },
    {
      id: 'predict-taxes', kind: 'predict', title: 'Predict: the tax line', uses: ['recording-paycheck', 'paycheck-deductions'],
      text: ['In the entry for Kai\'s paycheck, how much is debited to Taxes withheld?'],
      answer: deductions(p72),
      misconceptions: [{ cents: p72.federal, explanation: 'Taxes withheld includes all four deductions, not just federal income tax.' }],
      explanation: `All four deductions: ${money(p72.socialSecurity)} + ${money(p72.medicare)} + ${money(p72.federal)} + ${money(p72.arizona)} = ${money(deductions(p72))}.`,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['gross-vs-net', 'recording-paycheck'],
      text: ['Ana works 64 hours at $15.15 an hour. When her paycheck is recorded, how much is credited to Wages?'],
      answer: standardPaycheck(64).gross,
      misconceptions: [{ cents: standardPaycheck(64).net, explanation: 'Wages is credited with the gross pay, before any taxes are taken out.' }],
      explanation: `Wages gets the gross pay: 64 × $15.15 = ${money(standardPaycheck(64).gross)}.`,
      sources: ['azica-min-wage-2026'],
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['paycheck-deductions', 'percentages'],
      text: [`Ana's gross pay is ${money(standardPaycheck(64).gross)}. How much is withheld for Arizona income tax at 2.0%?`],
      answer: standardPaycheck(64).arizona,
      explanation: `2.0% of ${money(standardPaycheck(64).gross)} is ${money(standardPaycheck(64).arizona)}.`,
      sources: ['azdor-a4-2026'],
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['paycheck-deductions', 'percentages'],
      text: [`From the same gross pay of ${money(standardPaycheck(64).gross)}, how much is withheld for Social Security at 6.2%?`],
      answer: standardPaycheck(64).socialSecurity,
      explanation: `0.062 × ${money(standardPaycheck(64).gross)} = ${exactPercent(standardPaycheck(64).gross, 0.062)}, which rounds to ${money(standardPaycheck(64).socialSecurity)}.`,
      sources: ['ssa-cola-2026'],
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['gross-vs-net', 'paycheck-deductions'],
      text: [`Ana's four deductions add up to ${money(deductions(standardPaycheck(64)))}. What is her take-home pay from ${money(standardPaycheck(64).gross)}?`],
      answer: standardPaycheck(64).net,
      explanation: `${money(standardPaycheck(64).gross)} − ${money(deductions(standardPaycheck(64)))} = ${money(standardPaycheck(64).net)}.`,
      sources: PAYCHECK_SOURCES,
    },
  ],
  resources: ['irs-understanding-withholding', 'azica-min-wage', 'cfpb-budget'],
  recallTemplates: [grossPay, netFromStub].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation.
const drill = [1, 2, 3].map((n) => num(`m04-drill-${n}`, 'interpreting', { hours: HOURS }, (p) => ({
  prompt: `Drill ${n} of 3: ${p.hours} hours at $15.15. Gross pay?`, answer: standardPaycheck(p.hours).gross,
  explanation: `${p.hours} × $15.15 = ${money(standardPaycheck(p.hours).gross)}.`, sources: ['azica-min-wage-2026'],
})));

const M04_PRACTICE = {
  id: 'm04-practice', kind: 'practice', module: 'm04', title: 'Module 4 practice set',
  templates: [...drill, recallEquation, ...M01_LESSON.recallTemplates, ...M02_LESSON.recallTemplates, ...M03_LESSON.recallTemplates, socialSecurity, taxesTotal, netFromStub, recordPaycheck, { ...explainPay, id: 'm04-explain-practice' }],
};

const M04_EXTRA = {
  id: 'm04-extra', kind: 'practice', module: 'm04', title: 'Module 4 extra practice',
  templates: [grossPay, medicare, arizona, federalLine, recordPaycheck, stubLines].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M04_REMEDIAL = {
  id: 'm04-remedial', kind: 'practice', module: 'm04', title: 'Module 4: common mistakes',
  templates: [netFromStub, taxesTotal, recordPaycheck].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
// Every figure on a pay stub follows from the hours, so in the check each
// question gets its own hours in each version: no question can show
// another's answers.
const withHours = (t, hours) => ({ ...t, params: { ...t.params, hours: { byVersion: hours } } });
const M04_GATE = {
  id: 'm04', kind: 'gate', title: 'Module 4 check',
  templates: [
    withHours(grossPay, [41, 52, 63, 74]), withHours(medicare, [42, 53, 64, 75]), withHours(socialSecurity, [43, 54, 65, 76]), withHours(arizona, [44, 55, 66, 77]),
    withHours(taxesTotal, [45, 56, 67, 78]), withHours(netFromStub, [46, 57, 68, 79]), withHours(federalLine, [47, 58, 69, 80]),
    withHours(recordPaycheck, [48, 60, 71, 50]), withHours(stubLines, [72, 61, 40, 51]), explainPay,
  ],
};

// Questions Checkpoint A draws from this module.
// The same hours lists as the module check, so the two never share a paycheck.
const M04_CHECKPOINT = [withHours(netFromStub, [46, 57, 68, 79]), withHours(recordPaycheck, [48, 60, 71, 50])];
};

defs["content/modules/m05.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, CHART, accountOptions, chartPage } = require("content/helpers.js");
const { M01_LESSON } = require("content/modules/m01.js");
const { M03_LESSON } = require("content/modules/m03.js");
const { M04_LESSON, M04_GATE } = require("content/modules/m04.js");
define(exports, { M05_LESSON: () => M05_LESSON, M05_PRACTICE: () => M05_PRACTICE, M05_EXTRA: () => M05_EXTRA, M05_REMEDIAL: () => M05_REMEDIAL, M05_GATE: () => M05_GATE, M05_CHECKPOINT: () => M05_CHECKPOINT });
// Module 5: Your chart of accounts. Ideas: personal-accounts, account-numbers,
// folio-reference. From here the Folio column is used: until the journal
// (Module 6) it holds the number of the page with the other side of the
// entry. Amounts are illustrative.






const num = (id, part, params, build) => ({ id, module: 'm05', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const no = (id) => CHART[id].no;
const balancesList = (pairs) => pairs.map(([id, cents]) => `account ${no(id)}, ${money(cents)}`).join('; ');

// The chart of accounts, one line per group, from CHART.
const GROUPS = [['asset', 'Assets'], ['liability', 'Liabilities'], ['networth', 'Net worth'], ['income', 'Income'], ['expense', 'Expenses']];
const CHART_LINES = GROUPS.map(([type, word]) => `${word}: ${Object.values(CHART).filter((a) => a.type === type).map((a) => `${a.no} ${a.name}`).join(', ')}.`);

// --- Question templates -----------------------------------------------------

const GROUP_WORDS = {
  assets: { ids: ['spending', 'saving'], range: '1 to 19', kind: 'assets' },
  expenses: { ids: ['groceries', 'phone'], range: '50 to 99', kind: 'expenses' },
};

const groupTotal = num('m05-group-total', 'interpreting', {
  spending: { min: 10000, max: 60000, step: 1 }, saving: { min: 20000, max: 200000, step: 1 }, card: { min: 1000, max: 50000, step: 1 },
  groceries: { min: 1000, max: 20000, step: 1 }, phone: { min: 2000, max: 8000, step: 1 }, group: { pick: ['assets', 'expenses'] }, name: { pick: NAMES },
}, (p) => {
  const g = GROUP_WORDS[p.group];
  const list = [['spending', p.spending], ['saving', p.saving], ['card', p.card], ['groceries', p.groceries], ['phone', p.phone]];
  const answer = g.ids.reduce((s, id) => s + p[id], 0);
  return {
    prompt: `${p.name}'s pages show these balances: ${balancesList(list)}. Using the account numbers, what is the total of the ${g.kind}?`,
    answer,
    misconceptions: [{ cents: answer + p.card, explanation: 'Account 21 is between 20 and 29, so it is a liability.' }],
    explanation: `The ${g.kind} are numbered ${g.range}: accounts ${g.ids.map(no).join(' and ')}. ${g.ids.map((id) => money(p[id])).join(' + ')} = ${money(answer)}.`,
  };
});

// Two transfers on the same day for the same amount: only the folio tells
// which line matches the other page.
const TRANSFER_TARGETS = ['saving', 'cash', 'blow'];
const followFolio = num('m05-follow-folio', 'interpreting', {
  start: { min: 30000, max: 70000, step: 1 }, move: { min: 2000, max: 9000, step: 1 },
  first: { pick: [0, 1, 2] }, second: { pick: [1, 2] }, matchFirst: { pick: [true, false] }, name: { pick: NAMES },
}, (p) => {
  const a = TRANSFER_TARGETS[p.first];
  const b = TRANSFER_TARGETS[(p.first + p.second) % 3];
  const target = p.matchFirst ? a : b;
  const afterFirst = p.start - p.move;
  const afterSecond = p.start - 2 * p.move;
  const answer = p.matchFirst ? afterFirst : afterSecond;
  const other = p.matchFirst ? afterSecond : afterFirst;
  return {
    prompt: `Both lines dated Jun 10 on ${p.name}'s Spending bucket page say only "Transfer". The ${CHART[target].name} page (account ${no(target)}) has this line: Jun 10, folio 2, debit ${money(p.move)}. Which Spending line matches it? What is the Spending balance right after that line?`,
    ledger: chartPage('spending', [
      ['2026-06-06', 'Brought forward', '', p.start, 0],
      ['2026-06-10', 'Transfer', String(no(a)), 0, p.move],
      ['2026-06-10', 'Transfer', String(no(b)), 0, p.move],
    ], { name: p.name, askFrom: 1 }),
    highlightRow: null,
    answer,
    misconceptions: [{ cents: other, explanation: `That is the balance after the other transfer. The matching line has folio ${no(target)}, the number of the ${CHART[target].name} page.` }],
    explanation: `The matching line is the one with folio ${no(target)}. The balance after it is ${money(answer)}.`,
  };
});

const RECORD_ACCOUNTS = accountOptions(['checking', 'spending', 'saving', 'cash', 'gifts', 'phone']);
const RECORD_EVENTS = {
  atm: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you take ${money(p.amount)} out of account 2 as cash for your wallet, account 7.`,
    answer: [{ account: 'cash', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Accounts 7 and 2 are both assets (1 to 19). Account 7, Cash, goes up: debit. Account 2, the Spending bucket, goes down: credit.',
  }),
  gift: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: a relative gives you ${money(p.amount)} in cash. Use account 7 for the cash and account 41 for the gift.`,
    answer: [{ account: 'cash', debit: p.amount, credit: 0 }, { account: 'gifts', debit: 0, credit: p.amount }],
    explanation: 'Account 7, Cash, is an asset (1 to 19) and goes up: debit. Account 41, Gifts received, is income (40 to 49) and goes up: credit.',
  }),
  phone: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you pay a ${money(p.amount)} bill that belongs on account 55, from account 2.`,
    answer: [{ account: 'phone', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Account 55, Phone, is an expense (50 to 99) and goes up: debit. Account 2, the Spending bucket, is an asset (1 to 19) and goes down: credit.',
  }),
  save: (p) => ({
    prompt: `Using the chart of accounts, write the debits and credits: you move ${money(p.amount)} from account 2 to account 3.`,
    answer: [{ account: 'saving', debit: p.amount, credit: 0 }, { account: 'spending', debit: 0, credit: p.amount }],
    explanation: 'Accounts 3 and 2 are both assets (1 to 19). Account 3, the Saving bucket, goes up: debit. Account 2, the Spending bucket, goes down: credit.',
  }),
};
const recordNumbers = {
  id: 'm05-record-numbers', module: 'm05', kind: 'entry', part: 'producing', points: 4,
  // Each gate version gets a different scenario; all four are two-line entries.
  params: { amount: { min: 1000, max: 15000, step: 1 }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

const explainChart = explainTemplate({
  id: 'm05-explain', module: 'm05',
  variants: [
    { prompt: 'In one or two sentences: why are account numbers grouped by kind of account?',
      modelAnswer: 'So the number alone tells you what kind of account a page is, and so which side makes it go up. Pages of the same kind also stay together.',
      rubric: ['Says the number shows the kind of account', 'Says this tells you how the account behaves, or keeps the pages in order'] },
    { prompt: 'In one or two sentences: what does the Folio column on a ledger line tell you?',
      modelAnswer: 'It gives the number of the page that holds the other side of the entry, so you can find the matching line.',
      rubric: ['Says it holds the number of another page', 'Says that page has the other side (the matching line) of the entry'] },
    { prompt: 'In one or two sentences: why does each kind of spending get its own expense page?',
      modelAnswer: 'So you can see how much went to each thing, such as groceries compared with eating out, and plan from it.',
      rubric: ['Says each kind of spending is kept apart', 'Says this shows how much went to each one (to plan or budget)'] },
    { prompt: 'In one or two sentences: Cash and Checking are both your money. Why do they get separate pages?',
      modelAnswer: 'The money is held in different places: your wallet and the bank. Separate pages show how much is in each, and you can check each page against what is really there.',
      rubric: ['Says the money is held in different places', 'Says separate pages show (or let you check) how much is in each'] },
  ],
});

const netWorthChart = num('m05-net-worth-chart', 'interpreting', {
  spending: { min: 10000, max: 50000, step: 1 }, saving: { min: 20000, max: 150000, step: 1 }, cash: { min: 500, max: 9000, step: 1 },
  // What is owed stays below what is owned, so net worth is never below zero.
  friend: { min: 1000, max: 6000, step: 1 }, card: { min: 1000, max: 15000, step: 1 },
}, (p) => {
  const own = p.spending + p.saving + p.cash;
  const owe = p.friend + p.card;
  return {
    prompt: `These pages show balances: ${balancesList([['spending', p.spending], ['saving', p.saving], ['cash', p.cash], ['owed-friend', p.friend], ['card', p.card]])}. What is the net worth?`,
    answer: own - owe,
    misconceptions: [{ cents: own + owe, explanation: 'Accounts 20 and 21 are liabilities (20 to 29): subtract what you owe.' }],
    explanation: `Assets (accounts 2, 3 and 7): ${money(own)}. Liabilities (accounts 20 and 21): ${money(owe)}. ${money(own)} − ${money(owe)} = ${money(own - owe)}.`,
  };
});

// Completion: the learner fills in the balances on a page with folios.
const folioBalances = {
  id: 'm05-folio-balances', module: 'm05', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 50000, step: 1 }, a: { min: 1000, max: 8000, step: 1 }, b: { min: 2000, max: 6000, step: 1 }, c: { min: 20000, max: 60000, step: 1 }, d: { min: 2000, max: 7000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const moves = [[0, p.a], [0, p.b], [p.c, 0], [0, p.d]];
    let b = p.start;
    const balances = moves.map(([dr, cr]) => (b += dr - cr));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending bucket page. Use each line's folio to see where the money came from or went.`,
      ledger: chartPage('spending', [
        ['2026-06-06', 'Brought forward', '', p.start, 0],
        ['2026-06-08', 'Groceries', '52', 0, p.a],
        ['2026-06-09', 'Transfer', '7', 0, p.b],
        ['2026-06-12', 'From Checking', '1', p.c, 0],
        ['2026-06-13', 'Phone bill', '55', 0, p.d],
      ], { name: p.name, askFrom: 1 }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Credits take money out of this asset and debits put it in. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

const incomeTotal = num('m05-income-total', 'interpreting', {
  wages: { min: 90000, max: 130000, step: 1 }, gifts: { min: 1000, max: 8000, step: 1 }, spending: { min: 10000, max: 60000, step: 1 }, groceries: { min: 2000, max: 20000, step: 1 }, card: { min: 1000, max: 30000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const answer = p.wages + p.gifts;
  return {
    prompt: `${p.name}'s pages show these balances: ${balancesList([['spending', p.spending], ['card', p.card], ['wages', p.wages], ['gifts', p.gifts], ['groceries', p.groceries]])}. Using the account numbers, what is the total of the income accounts?`,
    answer,
    misconceptions: [{ cents: answer + p.spending, explanation: 'Account 2 is an asset (1 to 19). Income accounts are numbered 40 to 49.' }],
    explanation: `Income accounts are numbered 40 to 49. Here that means accounts 40 and 41. ${money(p.wages)} + ${money(p.gifts)} = ${money(answer)}.`,
  };
});

// Follow a folio to the other page and work out its balance there.
const folioOtherPage = num('m05-folio-other-page', 'interpreting', { before: { min: 9000, max: 30000, step: 1 }, amount: { min: 500, max: 9000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Spending bucket page (account 2) has this line: Jun 14, Groceries, folio 52, credit ${money(p.amount)}. Just before the matching line, the page that folio points to showed a debit balance of ${money(p.before)}. What is that page's balance after the matching line?`,
  answer: p.before + p.amount,
  misconceptions: [{ cents: p.before - p.amount, explanation: 'That subtracts. Folio 52 is Groceries, an expense (50 to 99). The matching line there is a debit, so the balance goes up.' }],
  explanation: `Folio 52 is the Groceries page. The Spending credit is matched by a Groceries debit: ${money(p.before)} + ${money(p.amount)} = ${money(p.before + p.amount)}.`,
}));

const cashAfter = num('m05-cash-after', 'interpreting', { before: { min: 500, max: 9000, step: 1 }, amount: { min: 2000, max: 8000, step: 100 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Cash page (account 7) shows ${money(p.before)}. A line on the Spending bucket page reads: To Cash, folio 7, credit ${money(p.amount)}. What does the Cash page show after the matching line?`,
  answer: p.before + p.amount,
  misconceptions: [{ cents: Math.abs(p.before - p.amount), explanation: 'Money leaving the Spending bucket arrives in Cash. The matching line on the Cash page is a debit, so add.' }],
  explanation: `The Spending credit is matched by a debit on the Cash page: ${money(p.before)} + ${money(p.amount)} = ${money(p.before + p.amount)}.`,
}));

// --- Lesson -------------------------------------------------------------------

const M05_LESSON = {
  id: 'm05',
  title: 'Your chart of accounts',
  coreIdea: 'Every account has its own page and number, and the number tells you what kind of account it is. The Folio column on each line points to the page with the other side of the entry.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['gross-vs-net', 'recording-paycheck'],
      text: ['From Module 4: a paycheck has gross pay of $1,212.00 and take-home pay of $1,033.46. How much is debited to Taxes withheld?'],
      answer: 17854,
      explanation: '$1,212.00 − $1,033.46 = $178.54, the four taxes together.',
    },
    {
      id: 'accounts', kind: 'explain', title: 'One page for each account', uses: ['personal-accounts', 'accounting-equation'],
      text: [
        'Your books have one ledger page for each account. A personal set of books uses the five kinds of account you met in Module 3.',
        'Assets (what you own): Cash, the money in your wallet. Checking, take-home pay that has reached the bank and is not yet split into buckets. Your five bucket pages are assets too.',
        'Liabilities (what you owe): a credit card (Module 8) and any money you owe a person. Net worth: one page that records what you were worth on the day you started your books.',
        'Income: Wages, and Gifts received for money people give you. Expenses: one page for each kind of spending, such as Rent, Groceries, Eating out, Transportation and Phone.',
      ],
      prompt: 'Why give each kind of spending its own expense page instead of one page for everything you spend?',
      promptAnswer: 'So you can see how much went to each thing, such as groceries compared with eating out, and plan next month from it.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'From Spending bucket', '', 4000, 0]]),
        chartPage('groceries', [['2026-06-08', 'Desert Mart (fictional)', '', 2136, 0]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-expense', kind: 'predict', title: 'Predict: an expense page', uses: ['personal-accounts', 'debit-credit-rules'],
      text: ['Kai\'s Transportation page (an expense) shows a debit balance of $28.50. He buys a $52.00 bus pass with money from the Spending bucket. What is the Transportation balance now?'],
      answer: 8050,
      misconceptions: [{ cents: 2350, explanation: 'An expense goes up with a debit, so add.' }],
      explanation: 'Transportation is an expense, so the bus pass is a debit: $28.50 + $52.00 = $80.50.',
    },
    {
      id: 'numbers', kind: 'explain', title: 'Account numbers', uses: ['account-numbers', 'personal-accounts'],
      text: [
        'Each page has an account number in its header. The numbers are grouped by kind of account, so the number alone tells you what kind of account a page is. Accounts 1 to 19 are assets, 20 to 29 are liabilities, 30 is net worth, 40 to 49 are income, and 50 to 99 are expenses.',
        'The list of every account and its number is your chart of accounts. This course uses this one:',
        ...CHART_LINES,
        'Your own chart can have different expense pages. Keep the groups, and give a new page the next free number in its group. Keep the pages in number order, so any page is easy to find.',
      ],
      prompt: 'Account 63 is not on this list. If you added it, what kind of account would it be, and how can you tell?',
      promptAnswer: 'An expense, because every number from 50 to 99 is an expense.',
      ledger: chartPage('groceries', [['2026-06-08', 'Desert Mart (fictional)', '', 2136, 0]]),
    },
    {
      id: 'predict-group', kind: 'predict', title: 'Predict: adding up a group', uses: ['account-numbers'],
      text: ['These pages show balances: account 2, $410.00; account 3, $1,250.00; account 21, $380.00; account 52, $96.40. What is the total of the assets?'],
      answer: 166000,
      misconceptions: [{ cents: 204000, explanation: 'Account 21 is between 20 and 29, so it is a liability, not an asset.' }],
      explanation: 'Assets are numbered 1 to 19: accounts 2 and 3. $410.00 + $1,250.00 = $1,660.00.',
    },
    {
      id: 'folio', kind: 'explain', title: 'The Folio column', uses: ['folio-reference', 'equal-sides'],
      text: [
        'Every entry has two sides, written on two pages. The Folio column ties them together: on each line, write the number of the page that holds the other side.',
        'Jordan moves $40.00 from the Spending bucket (account 2) into Cash (account 7). On the Cash page, the line is a debit with folio 2. On the Spending page, it is a credit with folio 7. Follow either folio to find the other half of the entry.',
        'In Module 6 you will start a journal. From then on, the Folio column points to the journal page instead.',
      ],
      prompt: 'You find a line on a page and cannot remember what it was for. How does its folio help?',
      promptAnswer: 'The folio is the number of the page with the other side of the entry, so you can turn to that page and see where the money came from or went.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'From Spending bucket', '2', 4000, 0]]),
        chartPage('spending', [['2026-06-01', 'Brought forward', '', 41200, 0], ['2026-06-03', 'To Cash', '7', 0, 4000]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-folio', kind: 'predict', title: 'Predict: follow the folio', uses: ['folio-reference', 'running-balance'],
      text: ['Both lines dated Jun 10 say only "Transfer". The Cash page (account 7) has this line: Jun 10, folio 2, debit $50.00. Which Spending line matches it? What is the Spending balance right after that line?'],
      ledger: chartPage('spending', [
        ['2026-06-06', 'Brought forward', '', 41200, 0],
        ['2026-06-10', 'Transfer', '3', 0, 5000],
        ['2026-06-10', 'Transfer', '7', 0, 5000],
      ], { askFrom: 1 }),
      answer: 31200,
      misconceptions: [{ cents: 36200, explanation: 'That is the balance after the transfer with folio 3, which went to the Saving bucket. The matching line has folio 7, the Cash page\'s number.' }],
      explanation: 'The line with folio 7 matches the Cash page. Its balance is $412.00 − $50.00 − $50.00 = $312.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['folio-reference', 'debit-credit-rules'],
      text: ['Ana moves $25.00 from her Spending bucket (account 2) to Blow money (account 6). Step 1 is done: the Blow money line is a debit with folio 2. Step 2 is done: the Spending line is a credit with folio 6. Finish Step 3: Blow money had a debit balance of $31.40. What is it now?'],
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 3140, 0], ['2026-06-12', 'From Spending bucket', '2', 2500, 0]], { name: 'Ana (example)', askFrom: 1 }),
      highlightRow: 1,
      answer: 5640,
      misconceptions: [{ cents: 640, explanation: 'Blow money is an asset that receives money, so it is a debit: add.' }],
      explanation: '$31.40 + $25.00 = $56.40, a debit balance.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['personal-accounts', 'account-numbers', 'accounting-equation'],
      text: ['Luis\'s pages show these balances: account 2, $350.00; account 3, $900.00; account 7, $45.00; account 20, $60.00; account 21, $215.50. What is his net worth?'],
      answer: 101950,
      misconceptions: [{ cents: 157050, explanation: 'Accounts 20 and 21 are liabilities: subtract what he owes.' }],
      explanation: 'Assets (2, 3 and 7): $1,295.00. Liabilities (20 and 21): $275.50. $1,295.00 − $275.50 = $1,019.50.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['account-numbers'],
      text: ['These pages show balances: account 50, $178.54; account 52, $88.20; account 3, $155.02; account 55, $45.00. What is the total of the expense accounts?'],
      answer: 31174,
      misconceptions: [{ cents: 46676, explanation: 'Account 3 is an asset (1 to 19), not an expense.' }],
      explanation: 'Expenses are numbered 50 to 99: $178.54 + $88.20 + $45.00 = $311.74.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['folio-reference', 'running-balance'],
      text: ['The Groceries page (account 52) has this line: Jun 14, folio 2, debit $37.65. Just before the matching line, the Spending bucket page (account 2) had a balance of $260.00. What is its balance after it?'],
      answer: 22235,
      misconceptions: [{ cents: 29765, explanation: 'The Spending bucket paid for the groceries, so its matching line is a credit: subtract.' }],
      explanation: 'Folio 2 points to the Spending bucket, where the matching line is a credit: $260.00 − $37.65 = $222.35.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['personal-accounts', 'debit-credit-rules'],
      text: ['A relative gives you $40.00 in cash. Cash (account 7) is debited and Gifts received (account 41, income) is credited. Gifts received had a credit balance of $25.00. What is it now?'],
      answer: 6500,
      misconceptions: [{ cents: 1500, explanation: 'Income goes up with a credit, so add.' }],
      explanation: 'Income goes up with a credit: $25.00 + $40.00 = $65.00.',
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
  recallTemplates: [groupTotal, followFolio].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: adding up one group of accounts.
const drill = [1, 2, 3].map((n) => num(`m05-drill-${n}`, 'interpreting', { a: { min: 5000, max: 50000, step: 1 }, b: { min: 5000, max: 90000, step: 1 }, c: { min: 500, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: account 2, ${money(p.a)}; account 3, ${money(p.b)}; account 52, ${money(p.c)}. Total of the assets?`, answer: p.a + p.b,
  misconceptions: [{ cents: p.a + p.b + p.c, explanation: 'Account 52 is an expense (50 to 99).' }],
  explanation: `Accounts 2 and 3 are assets: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

// Interleaving starts here: one production task comes from an earlier module.
const paycheckMixed = { ...M04_GATE.templates.find((t) => t.part === 'producing'), id: 'm04-record-paycheck-mixed-m05' };

const M05_PRACTICE = {
  id: 'm05-practice', kind: 'practice', module: 'm05', title: 'Module 5 practice set',
  templates: [...M04_LESSON.recallTemplates, ...M03_LESSON.recallTemplates, ...M01_LESSON.recallTemplates, ...drill, groupTotal, followFolio, netWorthChart, folioBalances, recordNumbers, paycheckMixed, { ...explainChart, id: 'm05-explain-practice' }],
};

const M05_EXTRA = {
  id: 'm05-extra', kind: 'practice', module: 'm05', title: 'Module 5 extra practice',
  templates: [groupTotal, followFolio, incomeTotal, folioOtherPage, cashAfter, recordNumbers].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M05_REMEDIAL = {
  id: 'm05-remedial', kind: 'practice', module: 'm05', title: 'Module 5: common mistakes',
  templates: [netWorthChart, followFolio, recordNumbers].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordNumbers comes first: later modules mix it in.
const M05_GATE = {
  id: 'm05', kind: 'gate', title: 'Module 5 check',
  templates: [groupTotal, followFolio, netWorthChart, incomeTotal, folioOtherPage, cashAfter, drill[0], recordNumbers, folioBalances, explainChart],
};

// Questions Checkpoint B draws from this module.
const M05_CHECKPOINT = [groupTotal, followFolio, recordNumbers];
};

defs["content/modules/m06.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, splitBuckets, accountOptions, chartPage, journal, CHART } = require("content/helpers.js");
const { M02_LESSON } = require("content/modules/m02.js");
const { M04_LESSON } = require("content/modules/m04.js");
const { M05_LESSON, M05_GATE } = require("content/modules/m05.js");
define(exports, { M06_LESSON: () => M06_LESSON, M06_PRACTICE: () => M06_PRACTICE, M06_EXTRA: () => M06_EXTRA, M06_REMEDIAL: () => M06_REMEDIAL, M06_GATE: () => M06_GATE, M06_CHECKPOINT: () => M06_CHECKPOINT });
// Module 6: The journal and posting. Ideas: journal-entry, posting,
// posted-marks. From here every event is written in the journal first; the
// ledger Folio holds the journal page (J1) and the journal Folio holds the
// ledger account number. Amounts are illustrative.






const num = (id, part, params, build) => ({ id, module: 'm06', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });

// --- Question templates -----------------------------------------------------

// One journal entry and the ledger page it goes to. The line is dated with
// its folio, but its amount is left for the learner to post from the journal;
// in the journal that line's folio is still empty (not yet posted).
const TO_POST = ['debit', 'credit', 'balance', 'side'];
const POST_EVENTS = {
  groceries: { page: 'spending', explanation: 'Groceries', lines: (a) => [['groceries', a, 0, true], ['spending', 0, a, false]], debitPage: false },
  share: { page: 'saving', explanation: 'Saving share of paycheck', lines: (a) => [['saving', a, 0, false], ['checking', 0, a, true]], debitPage: true },
  lunch: { page: 'cash', explanation: 'Lunch', lines: (a) => [['eating-out', a, 0, true], ['cash', 0, a, false]], debitPage: false },
};
const postBalance = num('m06-post-balance', 'interpreting', { start: { min: 9000, max: 60000, step: 1 }, amount: { min: 500, max: 8000, step: 1 }, event: { pick: Object.keys(POST_EVENTS) }, name: { pick: NAMES } }, (p) => {
  const e = POST_EVENTS[p.event];
  const answer = e.debitPage ? p.start + p.amount : p.start - p.amount;
  const wrong = e.debitPage ? p.start - p.amount : p.start + p.amount;
  const pageName = CHART[e.page].name;
  return {
    prompt: `Post this journal entry to the ${pageName} page. The line already has its date and folio. What will the ${pageName} balance be after it?`,
    journalPage: journal([['2026-06-10', 'J2', e.explanation, e.lines(p.amount)]], { sheetNo: 2, name: p.name }),
    ledger: chartPage(e.page, [['2026-06-06', 'Brought forward', '', p.start, 0], ['2026-06-10', e.explanation, 'J2', e.debitPage ? p.amount : 0, e.debitPage ? 0 : p.amount]], { name: p.name, askFrom: 1, askKeys: TO_POST }),
    highlightRow: 1,
    answer,
    misconceptions: [{ cents: wrong, explanation: `In the journal, ${pageName} is ${e.debitPage ? 'debited' : 'credited'}, so it is posted as a ${e.debitPage ? 'debit: add' : 'credit: subtract'}.` }],
    explanation: `${money(p.start)} ${e.debitPage ? '+' : '−'} ${money(p.amount)} = ${money(answer)}.`,
  };
});

// A journal page where one line has not been posted (empty Folio).
const unposted = num('m06-unposted', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, a: { min: 1000, max: 8000, step: 1 }, b: { min: 1500, max: 9000, step: 1 }, second: { pick: ['phone', 'household', 'transport'] }, name: { pick: NAMES } }, (p) => {
  const answer = p.start - p.a - p.b;
  return {
    prompt: `One line on ${p.name}'s journal page has not been posted: its Folio column is empty. When it is posted, what will the Spending bucket balance be?`,
    journalPage: journal([
      ['2026-06-12', 'J2', 'Groceries', [['groceries', p.a, 0, true], ['spending', 0, p.a, true]]],
      ['2026-06-13', 'J2', CHART[p.second].name, [[p.second, p.b, 0, true], ['spending', 0, p.b, false]]],
    ], { sheetNo: 2, name: p.name }),
    ledger: chartPage('spending', [['2026-06-06', 'Brought forward', '', p.start, 0], ['2026-06-12', 'Groceries', 'J2', 0, p.a, true]], { name: p.name }),
    highlightRow: 1,
    answer,
    misconceptions: [{ cents: p.start - p.a, explanation: `That is the balance before the missing line. The Spending line of the ${CHART[p.second].name} entry still has to be posted.` }],
    explanation: `The ${CHART[p.second].name} entry's credit to the Spending bucket has no folio yet. Posting it: ${money(p.start - p.a)} − ${money(p.b)} = ${money(answer)}.`,
  };
});

const JOURNAL_ACCOUNTS = accountOptions(['checking', 'spending', 'saving', 'investing', 'charity', 'blow', 'rent', 'phone', 'groceries', 'household']);
// Every scenario is a three-line entry: two debits and one credit.
const JOURNAL_EVENTS = {
  split: (p) => ({
    prompt: `Write the journal entry: one shopping trip, paid from the Spending bucket, was ${money(p.a)} of groceries and ${money(p.b)} of household supplies.`,
    answer: [{ account: 'groceries', debit: p.a, credit: 0 }, { account: 'household', debit: p.b, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b }],
    explanation: `Groceries and Household supplies (expenses) are debited. The Spending bucket is credited for both: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
  }),
  shares: (p) => {
    const s = splitBuckets(p.take);
    return {
      prompt: `Write the journal entry for moving two shares of a ${money(p.take)} paycheck out of Checking: Saving ${money(s.saving)} and Investing ${money(s.investing)}.`,
      answer: [{ account: 'saving', debit: s.saving, credit: 0 }, { account: 'investing', debit: s.investing, credit: 0 }, { account: 'checking', debit: 0, credit: s.saving + s.investing }],
      explanation: `Both buckets (assets) are debited. Checking is credited for both: ${money(s.saving + s.investing)}.`,
    };
  },
  bills: (p) => ({
    prompt: `Write the journal entry: from the Spending bucket you pay ${money(p.rent)} rent and a ${money(p.b)} phone bill.`,
    answer: [{ account: 'rent', debit: p.rent, credit: 0 }, { account: 'phone', debit: p.b, credit: 0 }, { account: 'spending', debit: 0, credit: p.rent + p.b }],
    explanation: `Rent and Phone (expenses) are debited. The Spending bucket is credited for both: ${money(p.rent + p.b)}.`,
  }),
  smallShares: (p) => {
    const s = splitBuckets(p.take);
    return {
      prompt: `Write the journal entry for moving two shares of a ${money(p.take)} paycheck out of Checking: Charity ${money(s.charity)} and Blow money ${money(s.blow)}.`,
      answer: [{ account: 'charity', debit: s.charity, credit: 0 }, { account: 'blow', debit: s.blow, credit: 0 }, { account: 'checking', debit: 0, credit: s.charity + s.blow }],
      explanation: `Both buckets (assets) are debited. Checking is credited for both: ${money(s.charity + s.blow)}.`,
    };
  },
};
const recordJournal = {
  id: 'm06-record-journal', module: 'm06', kind: 'entry', part: 'producing', points: 4,
  params: { a: { min: 1000, max: 9000, step: 1 }, b: { min: 300, max: 6000, step: 1 }, rent: { min: 30000, max: 60000, step: 500 }, take: { min: 80000, max: 120000, step: 1 }, event: { byVersion: Object.keys(JOURNAL_EVENTS) } },
  build: (p) => ({ accounts: JOURNAL_ACCOUNTS, ...JOURNAL_EVENTS[p.event](p) }),
};

const explainJournal = explainTemplate({
  id: 'm06-explain', module: 'm06',
  variants: [
    { prompt: 'In one or two sentences: why is every event written in the journal before it reaches the ledger pages?',
      modelAnswer: 'The journal keeps the whole event in one place, in date order. You can check that the debits equal the credits before posting, and find any event later by its date.',
      rubric: ['Says the whole event (both sides) is in one place, in date order', 'Says this lets you check debits equal credits (or find the event later)'] },
    { prompt: 'In one or two sentences: what does the Folio column hold in the journal, and what does it hold on a ledger page?',
      modelAnswer: 'In the journal it holds the ledger account number the line was posted to. On a ledger page it holds the journal page the entry came from, so each points to the other.',
      rubric: ['Journal folio = the ledger account number', 'Ledger folio = the journal page (so they point to each other)'] },
    { prompt: 'In one or two sentences: what does a ✓ beside an amount on a ledger page tell you?',
      modelAnswer: 'It means the amount has been posted from the journal and checked against it: same date, same amount, same side.',
      rubric: ['Says the amount was posted from the journal', 'Says it was checked against the journal entry'] },
    { prompt: 'In one or two sentences: you were interrupted while posting. How do you find where to start again?',
      modelAnswer: 'Look for the first journal line with an empty Folio column. Lines above it have been posted, so start posting from there.',
      rubric: ['Looks for journal lines with no folio (or ledger amounts with no ✓)', 'Says posting starts again from the first such line'] },
  ],
});

const journalCredit = num('m06-journal-credit', 'interpreting', { a: { min: 2000, max: 60000, step: 1 }, b: { min: 1000, max: 9000, step: 1 }, pair: { pick: [0, 1, 2] } }, (p) => {
  const [x, y] = [['rent', 'phone'], ['groceries', 'household'], ['saving', 'investing']][p.pair];
  return {
    prompt: `A journal entry debits ${CHART[x].name} ${money(p.a)} and ${CHART[y].name} ${money(p.b)}, and credits one account for the whole amount. How much is the credit?`,
    answer: p.a + p.b,
    misconceptions: [{ cents: p.a, explanation: 'One credit pays for both debits, so it equals both added together.' }],
    explanation: `Debits equal credits: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
  };
});

// Completion: post a journal page to the Spending bucket and fill in its balances.
const postPage = {
  id: 'm06-post-page', module: 'm06', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 20000, max: 50000, step: 1 }, a: { min: 1000, max: 7000, step: 1 }, b: { min: 2000, max: 5000, step: 1 }, c: { min: 30000, max: 60000, step: 1 }, d: { min: 500, max: 3000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const moves = [[0, p.a], [0, p.b], [p.c, 0], [0, p.d]];
    let b = p.start;
    const balances = moves.map(([dr, cr]) => (b += dr - cr));
    return {
      prompt: `Post ${p.name}'s journal page J3 to the Spending bucket page. Each line already has its date and folio. Fill in the Balance column for lines 2 to 5.`,
      journalPage: journal([
        ['2026-06-15', 'J3', 'Groceries', [['groceries', p.a, 0, true], ['spending', 0, p.a]]],
        ['2026-06-16', 'J3', 'Phone bill', [['phone', p.b, 0, true], ['spending', 0, p.b]]],
        ['2026-06-19', 'J3', 'Spending share of paycheck', [['spending', p.c, 0], ['checking', 0, p.c, true]]],
        ['2026-06-20', 'J3', 'Bus fare', [['transport', p.d, 0, true], ['spending', 0, p.d]]],
      ], { sheetNo: 3, name: p.name }),
      ledger: chartPage('spending', [
        ['2026-06-13', 'Brought forward', '', p.start, 0],
        ['2026-06-15', 'Groceries', 'J3', 0, p.a],
        ['2026-06-16', 'Phone bill', 'J3', 0, p.b],
        ['2026-06-19', 'From Checking', 'J3', p.c, 0],
        ['2026-06-20', 'Bus fare', 'J3', 0, p.d],
      ], { name: p.name, askFrom: 1, askKeys: TO_POST }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Credits to the Spending bucket subtract and debits add. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

// Posting a two-debit entry: the Spending bucket's one credit covers both.
const postSplit = num('m06-post-split', 'interpreting', { start: { min: 20000, max: 60000, step: 1 }, a: { min: 1000, max: 6000, step: 1 }, b: { min: 300, max: 2500, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `Post this journal entry to the Spending bucket page. The line already has its date and folio. What will the balance be after posting it?`,
  journalPage: journal([['2026-06-11', 'J2', 'Desert Mart receipt', [['groceries', p.a, 0, true], ['household', p.b, 0, true], ['spending', 0, p.a + p.b]]]], { sheetNo: 2, name: p.name }),
  ledger: chartPage('spending', [['2026-06-06', 'Brought forward', '', p.start, 0], ['2026-06-11', 'Desert Mart receipt', 'J2', 0, p.a + p.b]], { name: p.name, askFrom: 1, askKeys: TO_POST }),
  highlightRow: 1,
  answer: p.start - p.a - p.b,
  misconceptions: [{ cents: p.start - p.a, explanation: 'That posts only one of the two debits. The Spending bucket is credited once, for both debits together.' }],
  explanation: `The Spending credit is ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}. ${money(p.start)} − ${money(p.a + p.b)} = ${money(p.start - p.a - p.b)}.`,
}));

const journalDebits = num('m06-journal-debits', 'interpreting', { a: { min: 1000, max: 9000, step: 1 }, b: { min: 2000, max: 6000, step: 1 }, c: { min: 30000, max: 60000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `What does the Debits column of ${p.name}'s journal page J3 add up to?`,
  journalPage: journal([
    ['2026-06-15', 'J3', 'Groceries', [['groceries', p.a, 0, true], ['spending', 0, p.a, true]]],
    ['2026-06-16', 'J3', 'Phone bill', [['phone', p.b, 0, true], ['spending', 0, p.b, true]]],
    ['2026-06-19', 'J3', 'Spending share of paycheck', [['spending', p.c, 0, true], ['checking', 0, p.c, true]]],
  ], { sheetNo: 3, name: p.name }),
  answer: p.a + p.b + p.c,
  misconceptions: [{ cents: 2 * (p.a + p.b + p.c), explanation: 'That adds both columns. Add the Debits column only. The Credits column gives the same total, because every entry balances.' }],
  explanation: `${money(p.a)} + ${money(p.b)} + ${money(p.c)} = ${money(p.a + p.b + p.c)}. The Credits column adds to the same.`,
}));

// Post only one line of a three-line entry.
const postOneLine = num('m06-post-one-line', 'interpreting', { before: { min: 20000, max: 150000, step: 1 }, take: { min: 80000, max: 120000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const sh = splitBuckets(p.take);
  return {
    prompt: `This journal entry moves two paycheck shares out of Checking. Post its Saving bucket line. The Saving page showed ${money(p.before)} before posting. What does it show after?`,
    journalPage: journal([['2026-06-19', 'J3', 'Saving and Investing shares of paycheck', [['saving', sh.saving, 0], ['investing', sh.investing, 0], ['checking', 0, sh.saving + sh.investing]]]], { sheetNo: 3, name: p.name }),
    answer: p.before + sh.saving,
    misconceptions: [{ cents: p.before + sh.saving + sh.investing, explanation: 'Only the Saving line goes on the Saving page. The Investing line is posted to its own page.' }],
    explanation: `The Saving line is a debit of ${money(sh.saving)}: ${money(p.before)} + ${money(sh.saving)} = ${money(p.before + sh.saving)}.`,
  };
});

// --- Lesson -------------------------------------------------------------------

const paycheckJ1 = ['2026-06-05', 'J1', 'Paycheck', [['checking', 103346, 0, true], ['taxes', 17854, 0, true], ['wages', 0, 121200, true]]];
const sharesJ1 = (posted) => ['2026-06-06', 'J1', 'Saving and Investing shares of paycheck', [['saving', 15502, 0, posted], ['investing', 10335, 0, posted], ['checking', 0, 25837, posted]]];

const M06_LESSON = {
  id: 'm06',
  title: 'The journal and posting',
  coreIdea: 'Every event is written first as a journal entry, with equal debits and credits. Posting copies each line to its ledger page, and the folios and ✓ marks show what has been posted.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['account-numbers'],
      text: ['From Module 5: account 2, $300.00; account 3, $450.00; account 21, $120.00; account 55, $45.00. What is the total of the assets?'],
      answer: 75000,
      misconceptions: [{ cents: 87000, explanation: 'Account 21 is a liability (20 to 29).' }],
      explanation: 'Assets are accounts 1 to 19: $300.00 + $450.00 = $750.00.',
    },
    {
      id: 'journal', kind: 'explain', title: 'The journal', uses: ['journal-entry', 'equal-sides'],
      text: [
        'Until now, each event went straight onto two ledger pages. Bookkeepers first write every event in a journal, the book of original entry. It is one book where events are written in date order, as they happen.',
        'A journal entry has the date, the accounts debited (written first), the accounts credited (written below and indented to the right), the amounts, and a short explanation of what happened. Journal pages are numbered J1, J2 and so on.',
        'Because the whole event sits in one place, you can check that the debits equal the credits before anything reaches the ledger. In this entry, $155.02 + $103.35 = $258.37.',
      ],
      prompt: 'Why write the whole event in the journal before you touch the ledger pages?',
      promptAnswer: 'The journal keeps each event in one place, in date order. You can check that debits equal credits before posting, and find any event later by its date.',
      journalPage: journal([sharesJ1(false)]),
      highlightEntry: 0,
    },
    {
      id: 'predict-entry', kind: 'predict', title: 'Predict: the credit side', uses: ['journal-entry', 'equal-sides'],
      text: ['Maya buys groceries for $48.30 and household supplies for $12.95 in one trip, paid from her Spending bucket. In the journal entry, how much is credited to the Spending bucket?'],
      answer: 6125,
      misconceptions: [{ cents: 4830, explanation: 'The Spending bucket paid for both, so the credit is both debits added together.' }],
      explanation: 'Groceries $48.30 and Household supplies $12.95 are debited. The credit equals both: $61.25.',
    },
    {
      id: 'posting', kind: 'explain', title: 'Posting', uses: ['posting', 'folio-reference'],
      text: [
        'Posting means copying each journal line to its ledger page: the same date, the same amount on the same side, and a short item.',
        'In the ledger Folio column, write the journal page the entry came from: J1. Then go back to the journal and write the ledger account number in the journal\'s Folio column. The two folios point at each other, so you can always go from a ledger line to its journal entry and back.',
        'Both entries on journal page J1 have been posted. Look at the Checking page: the paycheck came in, then the two shares went out.',
      ],
      prompt: 'Looking only at the journal, how can you tell that a line has been posted?',
      promptAnswer: 'Its Folio column holds the ledger account number. A line with an empty Folio column has not been posted yet.',
      journalPage: journal([paycheckJ1, sharesJ1(true)]),
      highlightEntry: 1,
      ledgers: [
        chartPage('checking', [['2026-06-05', 'Paycheck', 'J1', 103346, 0], ['2026-06-06', 'To Saving and Investing', 'J1', 0, 25837]]),
        chartPage('saving', [['2026-06-06', 'Paycheck share', 'J1', 15502, 0]]),
        chartPage('investing', [['2026-06-06', 'Paycheck share', 'J1', 10335, 0]]),
      ],
      highlightRow: 1,
    },
    {
      id: 'predict-post', kind: 'predict', title: 'Predict: after posting', uses: ['posting', 'running-balance'],
      text: ['The entry for a $14.75 movie ticket, paid from Blow money, has been posted. What does the Blow money balance read on the highlighted line?'],
      journalPage: journal([['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]]], { sheetNo: 2 }),
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 10335, 0], ['2026-06-09', 'Movie ticket', 'J2', 0, 1475]], { askFrom: 1 }),
      highlightRow: 1,
      answer: 8860,
      misconceptions: [{ cents: 11810, explanation: 'Blow money paid for the ticket: the posted line is a credit, so subtract.' }],
      explanation: 'Blow money is credited: $103.35 − $14.75 = $88.60.',
    },
    {
      id: 'ticks', kind: 'explain', title: 'The ✓ columns', uses: ['posted-marks', 'posting'],
      text: [
        'Each money column on the ledger page has a ✓ column beside it. After you post an amount, check it against the journal (same date, same amount, same side), then tick ✓ beside it.',
        'Together, the journal folios and the ticks show how far posting has gone. A journal line with an empty Folio column has not been posted. A ledger amount with no ✓ has been written but not yet checked.',
        'If you are interrupted, look for the first journal line with no folio. That is where to start again.',
      ],
      prompt: 'You were interrupted halfway through posting a journal page. How do you find where you stopped?',
      promptAnswer: 'Look for the first journal line with an empty Folio column. Everything above it has been posted, so start again there.',
      journalPage: journal([['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]]], { sheetNo: 2 }),
      ledger: chartPage('blow', [['2026-06-06', 'Brought forward', '', 10335, 0], ['2026-06-09', 'Movie ticket', 'J2', 0, 1475, true]]),
      highlightRow: 1,
    },
    {
      id: 'predict-unposted', kind: 'predict', title: 'Predict: the missing line', uses: ['posted-marks', 'posting'],
      text: ['One line on this journal page has not been posted: its Folio column is empty. When it is posted, what will the Spending bucket balance be?'],
      journalPage: journal([
        ['2026-06-09', 'J2', 'Movie ticket', [['fun', 1475, 0, true], ['blow', 0, 1475, true]]],
        ['2026-06-12', 'J2', 'Groceries', [['groceries', 3610, 0, true], ['spending', 0, 3610, true]]],
        ['2026-06-13', 'J2', 'Phone bill', [['phone', 4500, 0, true], ['spending', 0, 4500, false]]],
      ], { sheetNo: 2 }),
      ledger: chartPage('spending', [['2026-06-06', 'Brought forward', '', 40000, 0], ['2026-06-12', 'Groceries', 'J2', 0, 3610, true]]),
      highlightRow: 1,
      answer: 31890,
      misconceptions: [{ cents: 36390, explanation: 'That is the balance before the missing line. The phone bill\'s credit to the Spending bucket still has to be posted.' }],
      explanation: 'The phone bill\'s Spending line has no folio. Posting it: $363.90 − $45.00 = $318.90.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['posting', 'posted-marks'],
      text: ['You are posting the entry for moving $50.00 from the Spending bucket into Saving. Step 1 is done: the Saving line is written with folio J3 and ticked, and 3 is written in the journal. Step 2 is done: the Spending line is written with folio J3. Finish Step 3: what is the Spending balance on that line?'],
      journalPage: journal([['2026-06-15', 'J3', 'To Saving bucket', [['saving', 5000, 0, true], ['spending', 0, 5000, false]]]], { sheetNo: 3 }),
      ledger: chartPage('spending', [['2026-06-14', 'Brought forward', '', 31890, 0], ['2026-06-15', 'To Saving bucket', 'J3', 0, 5000]], { askFrom: 1 }),
      highlightRow: 1,
      answer: 26890,
      misconceptions: [{ cents: 36890, explanation: 'The Spending bucket gives the money: a credit, so subtract.' }],
      explanation: '$318.90 − $50.00 = $268.90. Then tick ✓ and write 2 in the journal\'s Folio column.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['journal-entry', 'posting'],
      text: ['You pay back $60.00 you owe a friend, from the Spending bucket. Write the journal entry in your head, then post it. "Owed to a friend" (account 20, a liability) had a credit balance of $85.00. What is it after posting?'],
      answer: 2500,
      misconceptions: [{ cents: 14500, explanation: 'Paying back debits the liability: you owe less.' }],
      explanation: 'The entry debits Owed to a friend $60.00 and credits the Spending bucket $60.00. $85.00 − $60.00 = $25.00, still a credit balance.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['journal-entry', 'equal-sides'],
      text: ['A journal entry debits Rent $450.00 and Phone $45.00, and credits the Spending bucket. How much is the credit?'],
      answer: 49500,
      misconceptions: [{ cents: 45000, explanation: 'The credit pays for both debits.' }],
      explanation: '$450.00 + $45.00 = $495.00.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['posting'],
      text: ['A journal entry debits Groceries $27.40 and credits Cash $27.40. The Cash page had a debit balance of $61.00. What is it after posting?'],
      answer: 3360,
      misconceptions: [{ cents: 8840, explanation: 'Cash is credited: subtract.' }],
      explanation: '$61.00 − $27.40 = $33.60.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['journal-entry', 'equal-sides'],
      text: ['A journal page has three entries. Their debits are $155.02, $103.35 and $51.67. What must the Credits column of the page add up to?'],
      answer: 31004,
      explanation: 'Every entry balances, so the credits add up to the same as the debits: $155.02 + $103.35 + $51.67 = $310.04.',
    },
  ],
  resources: ['cfpb-budget', 'cfpb-bank-accounts'],
  recallTemplates: [postBalance, journalCredit].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: posting one line.
const drill = [1, 2, 3].map((n) => num(`m06-drill-${n}`, 'interpreting', { a: { min: 10000, max: 60000, step: 1 }, b: { min: 100, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the Spending bucket shows ${money(p.a)}. A journal line crediting it ${money(p.b)} is posted. New balance?`, answer: p.a - p.b,
  explanation: `A credit lowers an asset: ${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const recordNumbersMixed = { ...M05_GATE.templates.find((t) => t.part === 'producing'), id: 'm05-record-numbers-mixed-m06' };

const M06_PRACTICE = {
  id: 'm06-practice', kind: 'practice', module: 'm06', title: 'Module 6 practice set',
  templates: [...M05_LESSON.recallTemplates, ...M04_LESSON.recallTemplates, ...M02_LESSON.recallTemplates, ...drill, postBalance, unposted, journalCredit, postPage, recordJournal, recordNumbersMixed, { ...explainJournal, id: 'm06-explain-practice' }],
};

const M06_EXTRA = {
  id: 'm06-extra', kind: 'practice', module: 'm06', title: 'Module 6 extra practice',
  templates: [postBalance, journalCredit, postSplit, journalDebits, postOneLine, recordJournal].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M06_REMEDIAL = {
  id: 'm06-remedial', kind: 'practice', module: 'm06', title: 'Module 6: common mistakes',
  templates: [unposted, postPage, recordJournal].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordJournal comes first: later modules mix it in.
const M06_GATE = {
  id: 'm06', kind: 'gate', title: 'Module 6 check',
  templates: [postBalance, unposted, journalCredit, postSplit, journalDebits, postOneLine, drill[0], recordJournal, postPage, explainJournal],
};

// Questions Checkpoint B draws from this module.
const M06_CHECKPOINT = [postBalance, recordJournal];
};

defs["content/modules/m07.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal } = require("content/helpers.js");
const { M03_LESSON } = require("content/modules/m03.js");
const { M05_LESSON } = require("content/modules/m05.js");
const { M06_LESSON, M06_GATE } = require("content/modules/m06.js");
define(exports, { M07_LESSON: () => M07_LESSON, M07_PRACTICE: () => M07_PRACTICE, M07_EXTRA: () => M07_EXTRA, M07_REMEDIAL: () => M07_REMEDIAL, M07_GATE: () => M07_GATE, M07_CHECKPOINT: () => M07_CHECKPOINT });
// Module 7: Everyday spending. Ideas: source-documents, recording-purchases,
// transfers. Receipts appear beside the journal as the thing being recorded.
// Stores and prices are fictional (illustrative).






const num = (id, part, params, build) => ({ id, module: 'm07', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const sum = (list) => list.reduce((s, x) => s + x, 0);

// A receipt as a source document. Items are [label, cents].
function receipt(store, items, paidBy = 'Debit card', note = 'Store and prices are fictional (illustrative). Prices include sales tax.') {
  return {
    kind: 'receipt',
    title: `Receipt: ${store}`,
    lines: [...items, ['Total', sum(items.map(([, c]) => c))], ['Paid by', paidBy]],
    note,
  };
}

const STORES = ['Desert Mart (fictional)', 'Saguaro Grocery (fictional)', 'Corner Market (fictional)'];
const GROCERY_ITEMS = [['Bread', 'Milk', 'Apples'], ['Rice', 'Beans', 'Eggs'], ['Pasta', 'Tomato sauce', 'Cheese']];
const HOUSEHOLD_ITEMS = [['Dish soap', 'Paper towels'], ['Laundry soap', 'Trash bags'], ['Sponges', 'Toilet paper']];

// --- Question templates -----------------------------------------------------

const receiptSplit = num('m07-receipt-split', 'interpreting', {
  g1: { min: 150, max: 900, step: 1 }, g2: { min: 150, max: 900, step: 1 }, g3: { min: 150, max: 1200, step: 1 },
  h1: { min: 199, max: 1200, step: 1 }, h2: { min: 199, max: 900, step: 1 }, set: { pick: [0, 1, 2] }, store: { pick: [0, 1, 2] }, ask: { pick: ['groceries', 'household'] },
}, (p) => {
  const g = [p.g1, p.g2, p.g3];
  const h = [p.h1, p.h2];
  const items = [...GROCERY_ITEMS[p.set].map((l, i) => [l, g[i]]), ...HOUSEHOLD_ITEMS[p.set].map((l, i) => [l, h[i]])];
  const want = p.ask === 'groceries' ? sum(g) : sum(h);
  const page = p.ask === 'groceries' ? 'Groceries' : 'Household supplies';
  return {
    prompt: `This receipt has groceries and household supplies on it, so it is recorded on two expense pages. How much is debited to ${page}?`,
    sourceDoc: receipt(STORES[p.store], items),
    answer: want,
    misconceptions: [{ cents: sum(g) + sum(h), explanation: `That is the whole receipt. Only the ${p.ask === 'groceries' ? 'food' : 'household'} items go to ${page}.` }],
    explanation: `${page}: ${(p.ask === 'groceries' ? g : h).map(money).join(' + ')} = ${money(want)}.`,
  };
});

const WEEK = {
  atm: { min: 2000, max: 8000, step: 100 }, groc: { min: 1500, max: 9000, step: 1 }, save: { min: 1000, max: 6000, step: 100 }, lunch: { min: 500, max: 1500, step: 1 }, name: { pick: NAMES },
};
const week = (p) => `${p.name} takes ${money(p.atm)} from the Spending bucket at an ATM, pays ${money(p.groc)} for groceries by debit card, moves ${money(p.save)} from the Spending bucket into Saving, and pays ${money(p.lunch)} cash for lunch.`;

const spent = num('m07-spent', 'interpreting', WEEK, (p) => ({
  prompt: `In one week, ${week(p)} How much did ${p.name} spend? That is, how much was debited to expense pages?`,
  answer: p.groc + p.lunch,
  misconceptions: [{ cents: p.atm + p.groc + p.save + p.lunch, explanation: 'The ATM withdrawal and the move to Saving are transfers: no expense page changes.' }],
  explanation: `Only the groceries and the lunch are expenses: ${money(p.groc)} + ${money(p.lunch)} = ${money(p.groc + p.lunch)}.`,
}));

const bucketDrop = num('m07-bucket-drop', 'interpreting', WEEK, (p) => ({
  prompt: `In one week, ${week(p)} By how much did the Spending bucket go down?`,
  answer: p.atm + p.groc + p.save,
  misconceptions: [{ cents: p.groc + p.lunch, explanation: 'Transfers out of the Spending bucket lower it too, and the lunch was paid from Cash, not from the Spending bucket.' }],
  explanation: `The Spending bucket is credited for the ATM withdrawal, the groceries and the move to Saving: ${money(p.atm)} + ${money(p.groc)} + ${money(p.save)} = ${money(p.atm + p.groc + p.save)}. The lunch came out of Cash.`,
}));

// The gate's producing question: one two-line entry from a source document,
// a different scenario in each version.
const DOC_ACCOUNTS = accountOptions(['spending', 'charity', 'cash', 'groceries', 'eating-out', 'donations']);
const DOC_EVENTS = {
  groceries: (p) => ({
    prompt: 'Write the journal entry for this receipt. It was paid by debit card from the Spending bucket.',
    sourceDoc: receipt(STORES[p.store], [['Bread', p.a], ['Eggs', p.b]]),
    answer: [{ account: 'groceries', debit: p.a + p.b, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b }],
    explanation: 'Groceries (an expense) is debited. The debit card took the money from the Spending bucket, so it is credited.',
  }),
  meal: (p) => ({
    prompt: 'Write the journal entry for this receipt.',
    sourceDoc: receipt('Taco Stand (fictional)', [['Burrito', p.a], ['Drink', p.b]], 'Cash'),
    answer: [{ account: 'eating-out', debit: p.a + p.b, credit: 0 }, { account: 'cash', debit: 0, credit: p.a + p.b }],
    explanation: 'Eating out (an expense) is debited. It was paid in cash, so Cash is credited.',
  }),
  donation: (p) => ({
    prompt: 'Write the journal entry for this receipt. The money came from your Charity bucket.',
    sourceDoc: receipt('Valley Food Bank (fictional)', [['Donation', p.a + p.b]], 'Debit card', 'Charity and amount are fictional (illustrative).'),
    answer: [{ account: 'donations', debit: p.a + p.b, credit: 0 }, { account: 'charity', debit: 0, credit: p.a + p.b }],
    explanation: 'Donations (an expense) is debited. The money came from the Charity bucket, so it is credited.',
  }),
  atm: (p) => ({
    prompt: 'Write the journal entry for this ATM slip. The cash came out of the money in your Spending bucket.',
    sourceDoc: { kind: 'atm', title: 'ATM slip: Desert Bank (fictional)', lines: [['Withdrawal', p.twenties * 2000], ['Fee', 'None']], note: 'Bank and amount are fictional (illustrative).' },
    answer: [{ account: 'cash', debit: p.twenties * 2000, credit: 0 }, { account: 'spending', debit: 0, credit: p.twenties * 2000 }],
    explanation: 'A transfer: Cash (an asset) goes up, so it is debited. The Spending bucket goes down, so it is credited. No expense page changes.',
  }),
};
const recordFromDoc = {
  id: 'm07-record-from-doc', module: 'm07', kind: 'entry', part: 'producing', points: 4,
  // ATMs give $20 bills, so a withdrawal is a whole number of twenties.
  params: { a: { min: 200, max: 1500, step: 1 }, b: { min: 150, max: 900, step: 1 }, twenties: { min: 2, max: 10, step: 1 }, store: { pick: [0, 1, 2] }, event: { byVersion: Object.keys(DOC_EVENTS) } },
  build: (p) => ({ accounts: DOC_ACCOUNTS, ...DOC_EVENTS[p.event](p) }),
};

const PURCHASE_ACCOUNTS = accountOptions(['spending', 'charity', 'blow', 'cash', 'groceries', 'eating-out', 'donations', 'household']);
const PURCHASE_EVENTS = {
  split: (p) => ({
    prompt: 'Write the journal entry for this receipt.',
    sourceDoc: receipt(STORES[p.store], [['Bread', p.a], ['Eggs', p.b], ['Dish soap', p.c]]),
    answer: [{ account: 'groceries', debit: p.a + p.b, credit: 0 }, { account: 'household', debit: p.c, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b + p.c }],
    explanation: `Groceries (bread and eggs, ${money(p.a + p.b)}) and Household supplies (dish soap, ${money(p.c)}) are debited. It was paid by debit card, so the Spending bucket is credited for the total.`,
  }),
  cash: (p) => ({
    prompt: `Write the journal entry: you pay ${money(p.a + p.b)} in cash for a meal out.`,
    answer: [{ account: 'eating-out', debit: p.a + p.b, credit: 0 }, { account: 'cash', debit: 0, credit: p.a + p.b }],
    explanation: 'Eating out (an expense) is debited. The money came from your wallet, so Cash is credited.',
  }),
  atm: (p) => ({
    prompt: `Write the journal entry: you take ${money(p.a + p.b + p.c)} out of an ATM, from the money in your Spending bucket.`,
    answer: [{ account: 'cash', debit: p.a + p.b + p.c, credit: 0 }, { account: 'spending', debit: 0, credit: p.a + p.b + p.c }],
    explanation: 'A transfer: Cash goes up (debit) and the Spending bucket goes down (credit). No expense page changes.',
  }),
  donation: (p) => ({
    prompt: `Write the journal entry: you give ${money(p.a + p.b)} to a food bank by debit card, from your Charity bucket.`,
    answer: [{ account: 'donations', debit: p.a + p.b, credit: 0 }, { account: 'charity', debit: 0, credit: p.a + p.b }],
    explanation: 'Donations (an expense) is debited. The money came from the Charity bucket, so it is credited.',
  }),
};
const recordPurchase = {
  id: 'm07-record-purchase', module: 'm07', kind: 'entry', part: 'producing', points: 4,
  params: { a: { min: 200, max: 1500, step: 1 }, b: { min: 200, max: 1500, step: 1 }, c: { min: 199, max: 900, step: 1 }, store: { pick: [0, 1, 2] }, event: { pick: Object.keys(PURCHASE_EVENTS) } },
  build: (p) => ({ accounts: PURCHASE_ACCOUNTS, ...PURCHASE_EVENTS[p.event](p) }),
};

const explainSpending = explainTemplate({
  id: 'm07-explain', module: 'm07',
  variants: [
    { prompt: 'In one or two sentences: why is moving money from the Spending bucket into Cash not an expense?',
      modelAnswer: 'Nothing is used up. One asset goes down and another goes up by the same amount, so no expense page changes and net worth stays the same.',
      rubric: ['Says one of your own pages goes down and another goes up (a transfer)', 'Says no expense is recorded, or net worth does not change'] },
    { prompt: 'In one or two sentences: why keep a receipt after you have recorded it?',
      modelAnswer: 'It is the proof of the amount. If a balance looks wrong, or you return something, you can check the entry against it.',
      rubric: ['Says it proves the amount (it is the source document)', 'Says you can check the entry against it later (errors, returns)'] },
    { prompt: 'In one or two sentences: a purchase paid by debit card credits the Spending bucket, but one paid in cash credits Cash. Why?',
      modelAnswer: 'The credit goes to the page the money came from. A debit card takes bank money held in the Spending bucket. Cash comes out of your wallet.',
      rubric: ['Says the credit goes where the money came from', 'Names the bank money (Spending bucket) for a debit card and the wallet (Cash) for cash'] },
    { prompt: 'In one or two sentences: why is one receipt sometimes recorded on two expense pages?',
      modelAnswer: 'Because it can hold two kinds of spending, such as groceries and household supplies. Each kind has its own page, so the amounts are split between them.',
      rubric: ['Says the receipt has more than one kind of spending', 'Says each kind goes to its own expense page'] },
  ],
});

// The ATM amount is always more than the lunch and fare together, so Cash stays above zero.
const cashPage = num('m07-cash-page', 'interpreting', { atm: { min: 2500, max: 8000, step: 100 }, a: { min: 300, max: 1500, step: 1 }, b: { min: 150, max: 800, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} takes cash out of an ATM, then pays cash for lunch and a bus fare. What does the Cash page read after the bus fare?`,
  ledger: chartPage('cash', [
    ['2026-06-03', 'ATM withdrawal', 'J4', p.atm, 0, true],
    ['2026-06-05', 'Lunch', 'J4', 0, p.a, true],
    ['2026-06-06', 'Bus fare', 'J4', 0, p.b, true],
  ], { name: p.name, askFrom: 1 }),
  highlightRow: 2,
  answer: p.atm - p.a - p.b,
  misconceptions: [{ cents: p.atm - p.a + p.b, explanation: 'Cash pays for the bus fare too: subtract.' }],
  explanation: `${money(p.atm)} − ${money(p.a)} − ${money(p.b)} = ${money(p.atm - p.a - p.b)}.`,
}));

// Completion: a week on the Spending bucket page, with purchases and transfers.
const weekBalances = {
  id: 'm07-week-balances', module: 'm07', kind: 'amounts', part: 'producing', points: 4,
  params: { start: { min: 30000, max: 60000, step: 1 }, a: { min: 1500, max: 7000, step: 1 }, atm: { min: 2000, max: 6000, step: 100 }, save: { min: 2000, max: 5000, step: 100 }, d: { min: 500, max: 2500, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const credits = [p.a, p.atm, p.save, p.d];
    let b = p.start;
    const balances = credits.map((c) => (b -= c));
    return {
      prompt: `Fill in the Balance column for lines 2 to 5 of ${p.name}'s Spending bucket page. Two lines are purchases and two are transfers.`,
      ledger: chartPage('spending', [
        ['2026-06-13', 'Brought forward', '', p.start, 0],
        ['2026-06-14', 'Groceries (receipt)', 'J5', 0, p.a, true],
        ['2026-06-15', 'ATM withdrawal', 'J5', 0, p.atm, true],
        ['2026-06-16', 'To Saving bucket', 'J5', 0, p.save, true],
        ['2026-06-18', 'Bus pass (receipt)', 'J5', 0, p.d, true],
      ], { name: p.name, askFrom: 1 }),
      fields: balances.map((answer, i) => ({ label: `Balance after line ${i + 2}`, answer })),
      explanation: `Purchases and transfers out are both credits to the Spending bucket. The four balances are ${balances.map(money).join(', ')}.`,
    };
  },
};

// Only purchases lower net worth; transfers between your own pages do not.
const worthAfterWeek = num('m07-worth-after-week', 'interpreting', { ...WEEK, worth: { min: 50000, max: 200000, step: 1 } }, (p) => ({
  prompt: `${p.name}'s net worth is ${money(p.worth)}. In one week, ${week(p)} What is ${p.name}'s net worth now?`,
  answer: p.worth - p.groc - p.lunch,
  misconceptions: [{ cents: p.worth - p.atm - p.groc - p.save - p.lunch, explanation: 'That also subtracts the ATM withdrawal and the move to Saving. Those are transfers between your own pages, so they do not change net worth.' }],
  explanation: `Only the purchases are expenses: ${money(p.worth)} − ${money(p.groc)} − ${money(p.lunch)} = ${money(p.worth - p.groc - p.lunch)}.`,
}));

const donation = num('m07-donation', 'interpreting', { charity: { min: 3000, max: 20000, step: 1 }, gift: { min: 500, max: 2900, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Charity bucket shows ${money(p.charity)}. ${p.name} gives ${money(p.gift)} to a food bank by debit card, from the Charity bucket, and keeps the receipt. What does the Charity bucket show after the entry is posted?`,
  answer: p.charity - p.gift,
  misconceptions: [{ cents: p.charity + p.gift, explanation: 'Donations (the expense) is debited. The Charity bucket gave the money, so it is credited: subtract.' }],
  explanation: `Debit Donations, credit the Charity bucket: ${money(p.charity)} − ${money(p.gift)} = ${money(p.charity - p.gift)}.`,
}));

// Reading a source document: a receipt paid in cash, and the Cash page after it.
const receiptCash = num('m07-receipt-cash', 'interpreting', { cash: { min: 3000, max: 9000, step: 100 }, a: { min: 300, max: 1200, step: 1 }, b: { min: 150, max: 800, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s Cash page shows ${money(p.cash)}. ${p.name} pays for this receipt with cash. What does the Cash page show after it is recorded?`,
  sourceDoc: receipt('Taco Stand (fictional)', [['Burrito', p.a], ['Drink', p.b]], 'Cash'),
  answer: p.cash - p.a - p.b,
  misconceptions: [{ cents: p.cash - p.a, explanation: 'Use the receipt total, not one item.' }],
  explanation: `The receipt total is ${money(p.a + p.b)}. Cash is credited: ${money(p.cash)} − ${money(p.a + p.b)} = ${money(p.cash - p.a - p.b)}.`,
}));

// --- Lesson -------------------------------------------------------------------

const M07_LESSON = {
  id: 'm07',
  title: 'Everyday spending',
  coreIdea: 'Every purchase is recorded from its source document: the expense is debited and the page the money came from is credited. A transfer between your own pages is not spending.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['posting'],
      text: ['From Module 6: the Spending bucket shows $275.40. A journal line crediting it $38.15 is posted. What is the new balance?'],
      answer: 23725,
      misconceptions: [{ cents: 31355, explanation: 'A credit lowers an asset: subtract.' }],
      explanation: '$275.40 − $38.15 = $237.25.',
    },
    {
      id: 'source-docs', kind: 'explain', title: 'Source documents', uses: ['source-documents', 'journal-entry'],
      text: [
        'Every entry starts from a source document: the paper or screen that proves the event happened and shows the amount. Receipts, pay stubs, checks, and bank and card statements are all source documents.',
        'Write the journal entry from the source document, and name it in the explanation, such as "Desert Mart receipt". Then keep it. One envelope or folder per month is enough.',
      ],
      prompt: 'Why keep the receipt after you have written the entry?',
      promptAnswer: 'It proves the amount. If a balance looks wrong, or you return something, you can check the entry against it.',
      sourceDoc: receipt(STORES[0], [['Bread', 349], ['Eggs', 412], ['Apples', 580]]),
      journalPage: journal([['2026-06-08', 'J4', 'Desert Mart receipt', [['groceries', 1341, 0], ['spending', 0, 1341]]]], { sheetNo: 4 }),
      highlightEntry: 0,
    },
    {
      id: 'predict-split', kind: 'predict', title: 'Predict: one receipt, two pages', uses: ['source-documents', 'personal-accounts'],
      text: ['This receipt has groceries and household supplies on it. Each goes to its own expense page. How much is debited to Groceries?'],
      sourceDoc: receipt(STORES[0], [['Bread', 349], ['Milk', 389], ['Bananas', 215], ['Paper towels', 699], ['Dish soap', 375]]),
      answer: 953,
      misconceptions: [{ cents: 2027, explanation: 'The paper towels and dish soap are household supplies, which have their own page.' }],
      explanation: 'Groceries: $3.49 + $3.89 + $2.15 = $9.53. The other $10.74 goes to Household supplies.',
    },
    {
      id: 'purchases', kind: 'explain', title: 'Recording purchases', uses: ['recording-purchases', 'debit-credit-rules'],
      text: [
        'A purchase uses money up, so its expense page is debited. The credit goes to the page the money came from.',
        'Paid by debit card: the money leaves the bank at once, so credit the bucket it came from, usually the Spending bucket (2). Paid with cash: credit Cash (7). A treat from blow money: credit Blow money (6). A donation: debit Donations (57) and credit the Charity bucket (5).',
        'The journal page shows a debit-card purchase, a cash purchase and a donation.',
      ],
      prompt: 'Why is the Spending bucket credited for a debit-card purchase, but Cash for a cash purchase?',
      promptAnswer: 'The credit goes to wherever the money came from. A debit card takes bank money held in the Spending bucket. Cash comes from your wallet.',
      journalPage: journal([
        ['2026-06-08', 'J4', 'Desert Mart receipt (debit card)', [['groceries', 1341, 0, true], ['spending', 0, 1341, true]]],
        ['2026-06-09', 'J4', 'Lunch, paid in cash', [['eating-out', 975, 0, true], ['cash', 0, 975, true]]],
        ['2026-06-11', 'J4', 'Food bank donation', [['donations', 2000, 0, true], ['charity', 0, 2000, true]]],
      ], { sheetNo: 4 }),
      ledger: chartPage('cash', [['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true], ['2026-06-09', 'Lunch', 'J4', 0, 975, true]]),
      highlightRow: 1,
    },
    {
      id: 'predict-cash', kind: 'predict', title: 'Predict: the Cash page', uses: ['recording-purchases', 'posting'],
      text: ['Devon pays cash for lunch and for a $2.00 bus fare. What does the Cash page read after the bus fare?'],
      ledger: chartPage('cash', [
        ['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true],
        ['2026-06-09', 'Lunch', 'J4', 0, 975, true],
        ['2026-06-10', 'Bus fare', 'J4', 0, 200, true],
      ], { name: 'Devon (example)', askFrom: 1 }),
      highlightRow: 2,
      answer: 4825,
      misconceptions: [{ cents: 5225, explanation: 'Cash pays for the bus fare too: subtract.' }],
      explanation: '$60.00 − $9.75 − $2.00 = $48.25.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['recording-purchases', 'source-documents'],
      text: ['Rosa paid for this receipt by debit card. Step 1 is done: the groceries add up to $21.85, debited to Groceries. Step 2 is done: the Spending bucket is credited the whole $34.60. Finish Step 3: how much is debited to Household supplies?'],
      sourceDoc: receipt(STORES[1], [['Rice', 840], ['Beans', 315], ['Chicken', 1030], ['Paper towels', 699], ['Sponges', 576]]),
      answer: 1275,
      misconceptions: [{ cents: 5645, explanation: 'The two debits together must equal the $34.60 credit: subtract the groceries from the total.' }],
      explanation: '$34.60 − $21.85 = $12.75, which is $6.99 + $5.76. The debits are $21.85 + $12.75 = $34.60, equal to the credit.',
    },
    {
      id: 'transfers', kind: 'explain', title: 'Transfers are not spending', uses: ['transfers', 'accounting-equation'],
      text: [
        'Moving money between your own pages is a transfer. Examples are an ATM withdrawal (debit Cash, credit the Spending bucket), moving money into the Saving bucket, or splitting a paycheck into buckets.',
        'A transfer is not spending. Nothing is used up and no expense page changes, so your net worth stays the same. Only the place the money is kept changes.',
        'A purchase is different. It debits an expense, and your net worth goes down by the amount spent.',
      ],
      prompt: 'You take $60.00 out of an ATM. Have you spent $60.00? Explain using the two pages.',
      promptAnswer: 'No. Cash went up by $60.00 and the Spending bucket went down by $60.00. You still have the money, now in your wallet, and no expense page changed.',
      ledgers: [
        chartPage('cash', [['2026-06-03', 'ATM withdrawal', 'J4', 6000, 0, true]]),
        chartPage('spending', [['2026-06-01', 'Brought forward', '', 41200, 0], ['2026-06-03', 'ATM withdrawal', 'J4', 0, 6000, true]]),
      ],
      highlightRow: 0,
    },
    {
      id: 'predict-networth', kind: 'predict', title: 'Predict: net worth', uses: ['transfers', 'accounting-equation'],
      text: ['Devon\'s net worth is $1,240.00. He takes $60.00 cash out of his Spending bucket at an ATM, then spends $9.50 of it on lunch. What is his net worth now?'],
      answer: 123050,
      misconceptions: [{ cents: 117050, explanation: 'The ATM withdrawal is a transfer: it does not change net worth. Only the lunch does.' }],
      explanation: 'Only the lunch is an expense: $1,240.00 − $9.50 = $1,230.50.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['recording-purchases', 'transfers'],
      text: ['Rosa\'s Spending bucket shows $380.00. She moves $50.00 to Blow money, then pays $42.18 for groceries by debit card. What does the Spending bucket show now?'],
      answer: 28782,
      misconceptions: [{ cents: 33782, explanation: 'Moving money to Blow money is a transfer, but the money still leaves the Spending bucket, so credit it.' }],
      explanation: '$380.00 − $50.00 − $42.18 = $287.82.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['source-documents'],
      text: ['How much of this receipt is debited to Household supplies?'],
      sourceDoc: receipt(STORES[2], [['Pasta', 189], ['Tomato sauce', 249], ['Laundry soap', 1199], ['Trash bags', 725]]),
      answer: 1924,
      misconceptions: [{ cents: 2362, explanation: 'That is the whole receipt. The pasta and sauce are groceries.' }],
      explanation: 'Laundry soap and trash bags: $11.99 + $7.25 = $19.24.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['transfers', 'recording-purchases'],
      text: ['In one week Kai takes $40.00 out of an ATM, pays $63.10 for groceries by debit card, moves $25.00 into Saving, and pays $8.75 cash for lunch. How much did he spend? That is, how much was debited to expense pages?'],
      answer: 7185,
      misconceptions: [{ cents: 13685, explanation: 'The ATM withdrawal and the move to Saving are transfers, not spending.' }],
      explanation: 'Groceries and lunch: $63.10 + $8.75 = $71.85.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['recording-purchases'],
      text: ['The Cash page shows $33.60. You buy a $4.25 drink with cash. What does the Cash page show now?'],
      answer: 2935,
      misconceptions: [{ cents: 3785, explanation: 'Cash paid, so it is credited: subtract.' }],
      explanation: '$33.60 − $4.25 = $29.35.',
    },
  ],
  resources: ['cfpb-bank-accounts', 'cfpb-budget'],
  recallTemplates: [receiptSplit, spent].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: a debit-card purchase.
const drill = [1, 2, 3].map((n) => num(`m07-drill-${n}`, 'interpreting', { a: { min: 10000, max: 50000, step: 1 }, b: { min: 150, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the Spending bucket shows ${money(p.a)}. You pay ${money(p.b)} by debit card. New balance?`, answer: p.a - p.b,
  explanation: `${money(p.a)} − ${money(p.b)} = ${money(p.a - p.b)}.`,
})));

const recordJournalMixed = { ...M06_GATE.templates.find((t) => t.part === 'producing'), id: 'm06-record-journal-mixed-m07' };

const M07_PRACTICE = {
  id: 'm07-practice', kind: 'practice', module: 'm07', title: 'Module 7 practice set',
  templates: [...M06_LESSON.recallTemplates, ...M05_LESSON.recallTemplates, ...M03_LESSON.recallTemplates, ...drill, receiptSplit, spent, bucketDrop, cashPage, weekBalances, recordPurchase, recordJournalMixed, { ...explainSpending, id: 'm07-explain-practice' }],
};

const M07_EXTRA = {
  id: 'm07-extra', kind: 'practice', module: 'm07', title: 'Module 7 extra practice',
  templates: [receiptSplit, cashPage, receiptCash, worthAfterWeek, donation, recordFromDoc].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M07_REMEDIAL = {
  id: 'm07-remedial', kind: 'practice', module: 'm07', title: 'Module 7: common mistakes',
  templates: [bucketDrop, weekBalances, recordPurchase].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordFromDoc comes first: later modules mix it in.
const M07_GATE = {
  id: 'm07', kind: 'gate', title: 'Module 7 check',
  templates: [receiptSplit, spent, receiptCash, cashPage, worthAfterWeek, donation, drill[0], recordFromDoc, weekBalances, explainSpending],
};

// Questions Checkpoint B draws from this module.
const M07_CHECKPOINT = [spent, recordFromDoc];
};

defs["content/modules/m08.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal, monthlyInterest, exactMonthlyInterest, exactPercent, minimumPayment, payoff, MINIMUM_RULE } = require("content/helpers.js");
const { percentOf } = require("js/money.js");
const { RATES_2026 } = require("content/rates2026.js");
const { M04_LESSON } = require("content/modules/m04.js");
const { M06_LESSON } = require("content/modules/m06.js");
const { M07_LESSON, M07_GATE } = require("content/modules/m07.js");
define(exports, { M08_LESSON: () => M08_LESSON, M08_PRACTICE: () => M08_PRACTICE, M08_EXTRA: () => M08_EXTRA, M08_REMEDIAL: () => M08_REMEDIAL, M08_GATE: () => M08_GATE, M08_CHECKPOINT: () => M08_CHECKPOINT });
// Module 8: Credit cards and debt. Ideas: card-as-liability, card-entries,
// minimum-payment-cost. The APR is the 2026 national average from the
// Federal Reserve (content/rates2026.js); the minimum-payment rule is an
// example, since every card agreement sets its own. Other amounts are
// illustrative.








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

// Interest is a credit that raises what is owed.
const afterInterest = num('m08-after-interest', 'interpreting', { balance: { min: 10000, max: 150000, step: 1 }, name: { pick: NAMES } }, (p) => {
  const i = monthlyInterest(p.balance, APR);
  return {
    prompt: `${p.name}'s card page shows a credit balance of ${money(p.balance)}. This month's interest at ${APR_TEXT} APR (balance × APR ÷ 12, rounded to the cent) is posted. What does the card page show now?`,
    answer: p.balance + i,
    misconceptions: [{ cents: p.balance - i, explanation: 'Interest adds to what you owe. Card interest is debited and the card is credited, so add.' }],
    explanation: `Interest: ${exactMonthlyInterest(p.balance, APR)}, which rounds to ${money(i)}. ${money(p.balance)} + ${money(i)} = ${money(p.balance + i)}.`,
    sources: APR_SOURCES,
  };
});

// --- Lesson -------------------------------------------------------------------

const minOnly = payoff(100000, APR);
const hundred = payoff(100000, APR, { payment: 10000 });
const [m1, m2] = minOnly.rows;
const i1500 = monthlyInterest(150000, APR);
const min1500 = minimumPayment(150000, i1500);
const after1500 = 150000 + i1500 - min1500;

const M08_LESSON = {
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


// Fluency drill on the core operation: a charge raises what is owed.
const drill = [1, 2, 3].map((n) => num(`m08-drill-${n}`, 'interpreting', { a: { min: 2000, max: 60000, step: 1 }, b: { min: 300, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the card page shows a credit balance of ${money(p.a)}. A ${money(p.b)} charge is posted. New balance?`, answer: p.a + p.b,
  misconceptions: [{ cents: p.a - p.b, explanation: 'A charge is a credit to the card, because you owe more.' }],
  explanation: `A charge adds to what you owe: ${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

const recordPurchaseMixed = { ...M07_GATE.templates.find((t) => t.part === 'producing'), id: 'm07-record-purchase-mixed-m08' };

const M08_PRACTICE = {
  id: 'm08-practice', kind: 'practice', module: 'm08', title: 'Module 8 practice set',
  templates: [...M07_LESSON.recallTemplates, ...M06_LESSON.recallTemplates, ...M04_LESSON.recallTemplates, ...drill, cardBalance, interest, afterMinimum, available, minimum, cardMonth, recordCard, recordPurchaseMixed, { ...explainCard, id: 'm08-explain-practice' }],
};

const M08_EXTRA = {
  id: 'm08-extra', kind: 'practice', module: 'm08', title: 'Module 8 extra practice',
  templates: [cardBalance, interest, afterInterest, recordCard].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M08_REMEDIAL = {
  id: 'm08-remedial', kind: 'practice', module: 'm08', title: 'Module 8: common mistakes',
  templates: [available, minimum, recordCard].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordCard comes first: later modules mix it in.
const M08_GATE = {
  id: 'm08', kind: 'gate', title: 'Module 8 check',
  templates: [cardBalance, afterMinimum, interest, available, minimum, afterInterest, drill[0], recordCard, cardMonth, explainCard],
};

// Questions Checkpoint B draws from this module.
const M08_CHECKPOINT = [cardBalance, recordCard, explainCard];
};

defs["content/modules/m09.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, chartPage, CHART } = require("content/helpers.js");
const { M05_LESSON } = require("content/modules/m05.js");
const { M07_LESSON } = require("content/modules/m07.js");
const { M08_LESSON, M08_GATE } = require("content/modules/m08.js");
define(exports, { M09_LESSON: () => M09_LESSON, M09_PRACTICE: () => M09_PRACTICE, M09_EXTRA: () => M09_EXTRA, M09_REMEDIAL: () => M09_REMEDIAL, M09_GATE: () => M09_GATE, M09_CHECKPOINT: () => M09_CHECKPOINT });
// Module 9: Proving your books. Ideas: trial-balance, common-errors,
// error-by-size. Trial balances are drawn as reports (js/reports.js), which
// work out their own totals. Amounts are illustrative.






const num = (id, part, params, build) => ({ id, module: 'm09', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const acct = (id, side, amount) => ({ no: CHART[id].no, name: CHART[id].name, [side]: amount });
const tb = (name, accounts, extra = {}) => ({ report: 'trial-balance', name, date: '2026-06-30', accounts, ...extra });
const total = (accounts, side) => accounts.reduce((s, a) => s + (a[side] ?? 0), 0);

// A balanced set of month-end balances: Net worth takes whatever balances it.
function monthBalances(p) {
  const debits = [acct('spending', 'debit', p.spending), acct('saving', 'debit', p.saving), acct('groceries', 'debit', p.groceries), acct('eating-out', 'debit', p.eating)];
  const credits = [acct('card', 'credit', p.card)];
  const worth = total(debits, 'debit') - p.card;
  return [...debits.slice(0, 2), credits[0], acct('net-worth', 'credit', worth), ...debits.slice(2)];
}
const MONTH = {
  spending: { min: 20000, max: 70000, step: 1 }, saving: { min: 30000, max: 150000, step: 1 }, groceries: { min: 8000, max: 30000, step: 1 },
  eating: { min: 2000, max: 9000, step: 1 }, card: { min: 2000, max: 15000, step: 1 }, name: { pick: NAMES },
};

// --- Question templates -----------------------------------------------------

const tbTotal = num('m09-tb-total', 'interpreting', MONTH, (p) => {
  const accounts = monthBalances(p);
  const debits = total(accounts, 'debit');
  return {
    prompt: `${p.name}'s trial balance has its totals left blank. Add up the Debits column. What do both columns total?`,
    report: tb(p.name, accounts, { ask: ['total'] }),
    answer: debits,
    misconceptions: [{ cents: debits * 2, explanation: 'Add only one column. When the books balance, the Debits and Credits columns have the same total.' }],
    explanation: `Debits: ${accounts.filter((a) => a.debit).map((a) => money(a.debit)).join(' + ')} = ${money(debits)}. The Credits column gives the same total.`,
  };
});

// One grocery amount was posted on the wrong side, so the Groceries balance
// is short by twice that amount. The difference never divides evenly by 9.
const wrongSide = num('m09-wrong-side', 'interpreting', { ...MONTH, groceries: { min: 15000, max: 30000, step: 1 }, slip: { min: 1000, max: 6000, step: 1 } }, (p) => {
  const slip = (2 * p.slip) % 9 === 0 ? p.slip + 1 : p.slip;
  const accounts = monthBalances(p).map((a) => (a.no === CHART.groceries.no ? { ...a, debit: a.debit - 2 * slip } : a));
  return {
    prompt: `${p.name}'s trial balance does not balance, and its totals are left for you to work out. Nothing was left out, and the difference does not divide evenly by 9. So one amount was probably posted on the wrong side. What amount should ${p.name} look for?`,
    report: tb(p.name, accounts, { ask: ['total'], errorShown: true }),
    answer: slip,
    misconceptions: [{ cents: 2 * slip, explanation: 'That is the whole difference. An amount posted on the wrong side throws the books off by twice that amount, so halve the difference.' }],
    explanation: `Credits ${money(total(accounts, 'credit'))} − debits ${money(total(accounts, 'debit'))} = ${money(2 * slip)}. Half of that is ${money(slip)}.`,
  };
});

// Production: the learner writes the trial balance from four pages. Every
// entry on the pages moves money between pages that are shown, and Net worth
// is the opening balance brought forward, so the trial balance balances by
// itself. The card payment is never more than the card balance brought forward.
const tbFromPages = {
  id: 'm09-tb-from-pages', module: 'm09', kind: 'amounts', part: 'producing', points: 4,
  params: {
    s0: { min: 40000, max: 70000, step: 1 }, v0: { min: 20000, max: 90000, step: 1 }, k0: { min: 3000, max: 9000, step: 1 },
    a: { min: 1000, max: 6000, step: 1 }, g: { min: 1000, max: 8000, step: 1 }, m: { min: 2000, max: 10000, step: 100 }, f: { min: 1000, max: 3000, step: 100 }, name: { pick: NAMES },
  },
  build: (p) => {
    const opts = { name: p.name, askFrom: 1 };
    const pages = [
      chartPage('spending', [['2026-06-01', 'Brought forward', '', p.s0, 0], ['2026-06-08', 'Groceries (debit card)', 'J1', 0, p.g, true], ['2026-06-19', 'To Saving bucket', 'J2', 0, p.m, true], ['2026-06-25', 'Card payment', 'J2', 0, p.f, true]], opts),
      chartPage('saving', [['2026-06-01', 'Brought forward', '', p.v0, 0], ['2026-06-19', 'From Spending bucket', 'J2', p.m, 0, true]], opts),
      chartPage('card', [['2026-06-01', 'Brought forward', '', 0, p.k0], ['2026-06-12', 'Groceries', 'J1', 0, p.a, true], ['2026-06-25', 'Payment', 'J2', p.f, 0, true]], opts),
      chartPage('groceries', [['2026-06-08', 'Saguaro Grocery (debit card)', 'J1', p.g, 0, true], ['2026-06-12', 'Desert Mart (card)', 'J1', p.a, 0, true]], opts),
    ];
    const spending = p.s0 - p.g - p.m - p.f;
    const saving = p.v0 + p.m;
    const card = p.k0 + p.a - p.f;
    const groceries = p.g + p.a;
    const worth = p.s0 + p.v0 - p.k0;
    const accounts = [acct('spending', 'debit', spending), acct('saving', 'debit', saving), acct('card', 'credit', card), acct('net-worth', 'credit', worth), acct('groceries', 'debit', groceries)];
    const debits = spending + saving + groceries;
    return {
      prompt: `Write ${p.name}'s trial balance from these pages: put each page's closing balance on its line, in the right column, then total the columns. The Net worth line, brought forward from last month, is given.`,
      ledgers: pages,
      report: tb(p.name, accounts, { ask: ['line-0', 'line-1', 'line-2', 'line-4', 'total'] }),
      fields: [['Spending bucket (closing balance)', spending], ['Credit card (closing balance)', card], ['Groceries (closing balance)', groceries], ['Total of each column', debits]].map(([label, answer]) => ({ label, answer })),
      explanation: `Debits: Spending bucket ${money(spending)} + Saving bucket ${money(saving)} + Groceries ${money(groceries)} = ${money(debits)}. Credits: Credit card ${money(card)} + Net worth ${money(worth)} = ${money(card + worth)}.`,
    };
  },
};

// Diagnosis: the difference is given and three amounts are suspects. The
// learner tries the size tests (÷ 9, equal to an amount, half) to find the one
// that explains it. Each version has a different kind of error, and no other
// suspect passes any test.
// The amount with the last two digits of its dollars swapped ($47.15 →
// $74.15), or null when there are no two different digits to swap, or when
// the swap would start with a 0 ($70.12 → $07.12 reads as a dropped digit).
function swapped(c) {
  const d = Math.floor(c / 100);
  const tens = Math.floor(d / 10) % 10;
  const ones = d % 10;
  if (d < 10 || tens === ones || (ones === 0 && d < 100)) return null;
  return c + (ones - tens) * 900;
}
const swapDiff = (c) => (swapped(c) === null ? null : Math.abs(swapped(c) - c));
const explainsBy = (c, d) => c === d || 2 * c === d || 9 * c === d || swapDiff(c) === d;
const ERRORS = {
  transposition: (w) => ({ d: swapDiff(w), why: `${money(swapDiff(w))} ÷ 9 = ${money(swapDiff(w) / 9)}, so look for swapped digits: ${money(w)} was written for ${money(swapped(w))}, which is off by exactly ${money(swapDiff(w))}.` }),
  slide: (w) => ({ d: 9 * w, why: `${money(9 * w)} ÷ 9 = ${money(w)}, an amount on the list: the decimal point slid, and ${money(w)} was written for ${money(10 * w)}.` }),
  'one-sided': (w) => ({ d: w, why: `The difference does not divide evenly by 9, but ${money(w)} equals it: that entry had only one side posted.` }),
  'wrong-side': (w) => ({ d: 2 * w, why: `The difference does not divide evenly by 9, and no amount equals it, but half of it is ${money(w)}: that amount was posted on the wrong side.` }),
};
const diagnose = num('m09-diagnose', 'interpreting', {
  c0: { min: 1200, max: 9800, step: 1 }, c1: { min: 1200, max: 9800, step: 1 }, c2: { min: 1200, max: 9800, step: 1 }, which: { pick: [0, 1, 2] },
  error: { byVersion: ['transposition', 'one-sided', 'wrong-side', 'slide'] }, name: { pick: NAMES },
}, (p) => {
  const c = [p.c0, p.c1, p.c2];
  let w = c[p.which];
  // A transposition needs two different digits to swap; a one-sided or
  // wrong-side difference must not divide evenly by 9 (a slide always does).
  // Each loop moves at most a few steps; the caps only guard against a hang.
  for (let n = 0; n < 20 && p.error === 'transposition' && !swapDiff(w); n++) w += 100;
  for (let n = 0; n < 20 && (p.error === 'one-sided' || p.error === 'wrong-side') && ERRORS[p.error](w).d % 9 === 0; n++) w += 1;
  c[p.which] = w;
  const { d, why } = ERRORS[p.error](w);
  c.forEach((x, i) => {
    if (i === p.which) return;
    let y = x;
    for (let n = 0; n < 200 && (explainsBy(y, d) || c.some((z, k) => k !== i && z === y)); n++) y += 7;
    c[i] = y;
  });
  return {
    prompt: `${p.name}'s trial balance totals are ${money(d)} apart. Three amounts on the pages are worth a second look: ${c.map(money).join(', ')}. Use the size of the difference to decide which one explains it. Which amount is it?`,
    answer: w,
    misconceptions: d === w ? [] : [{ cents: d, explanation: 'That is the difference itself. Use it to test each amount: does it divide by 9, equal an amount, or equal twice an amount?' }],
    explanation: why,
  };
});

const explainProof = explainTemplate({
  id: 'm09-explain', module: 'm09',
  variants: [
    { prompt: 'In one or two sentences: why must the two columns of a trial balance add up to the same total?',
      modelAnswer: 'Every entry posted equal debits and credits, so all the debit balances together must equal all the credit balances together.',
      rubric: ['Says every entry has equal debits and credits', 'Says so the debit balances together equal the credit balances together'] },
    { prompt: 'In one or two sentences: name one error a trial balance cannot catch, and say why.',
      modelAnswer: 'An entry left out completely, or posted to the wrong account on the right side. Debits still equal credits, so the totals still agree.',
      rubric: ['Names an error that keeps debits equal to credits (an entry left out, or posted to the wrong account)', 'Says the totals still agree, so the trial balance cannot show it'] },
    { prompt: 'In one or two sentences: the trial balance is off by $45.00. Why check for swapped digits or a moved decimal point?',
      modelAnswer: '$45.00 divides evenly by 9, and a transposition or a slide always makes a difference that divides evenly by 9.',
      rubric: ['Says the difference divides evenly by 9', 'Says transpositions and slides always give differences that divide by 9'] },
    { prompt: 'In one or two sentences: why do you halve the difference when you suspect an amount was posted on the wrong side?',
      modelAnswer: 'The amount was taken off one side instead of added to it, so that side is short by twice the amount. Half the difference is the amount to look for.',
      rubric: ['Says a wrong-side posting moves the totals by twice the amount', 'Says half the difference is the amount to look for'] },
  ],
});

const oneSided = num('m09-one-sided', 'interpreting', { a: { min: 50000, max: 200000, step: 1 }, gap: { min: 500, max: 9000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s trial balance shows debits of ${money(p.a + p.gap)} and credits of ${money(p.a)}. One entry's credit side was never posted. How much was that entry?`,
  answer: p.gap,
  misconceptions: [{ cents: Math.round(p.gap / 2), explanation: 'Halve the difference only for an amount posted on the wrong side. A one-sided entry leaves the books off by the whole amount.' }],
  explanation: `A missing side leaves the totals apart by exactly its amount: ${money(p.a + p.gap)} − ${money(p.a)} = ${money(p.gap)}.`,
}));

const slide = num('m09-slide', 'interpreting', { whole: { min: 1000, max: 9999, step: 1 } }, (p) => {
  const right = p.whole * 10; // whole dimes, so the slid amount is still whole cents
  const wrong = right / 10;
  return {
    prompt: `A ${money(right)} amount was written as ${money(wrong)}. The decimal point slid one place. By how much is the trial balance off?`,
    answer: right - wrong,
    explanation: `${money(right)} − ${money(wrong)} = ${money(right - wrong)}, which divides evenly by 9.`,
  };
});

// Completion: a trial balance with only its totals left to write.
const tbBlanks = {
  id: 'm09-tb-blanks', module: 'm09', kind: 'amounts', part: 'producing', points: 2,
  params: MONTH,
  build: (p) => {
    const accounts = monthBalances(p);
    const debits = total(accounts, 'debit');
    return {
      prompt: `Finish ${p.name}'s trial balance: write the total of each column.`,
      report: tb(p.name, accounts, { ask: ['total'] }),
      fields: [{ label: 'Debits total', answer: debits }, { label: 'Credits total', answer: total(accounts, 'credit') }],
      explanation: `Both columns total ${money(debits)}, so the trial balance balances.`,
    };
  },
};

const swapDifference = num('m09-swap-difference', 'interpreting', { c: { min: 1200, max: 9800, step: 1 } }, (p) => {
  let c = p.c;
  for (let n = 0; n < 20 && !swapDiff(c); n++) c += 100;
  return {
    prompt: `A ${money(c)} amount was copied onto a page as ${money(swapped(c))}: two digits were swapped. By how much is the trial balance off?`,
    answer: swapDiff(c),
    explanation: `${money(Math.max(c, swapped(c)))} − ${money(Math.min(c, swapped(c)))} = ${money(swapDiff(c))}, which divides evenly by 9 (${money(swapDiff(c) / 9)}).`,
  };
});

// Production: correct a trial balance that has a transposition in it. The
// totals are left blank, so the learner adds both columns before finding
// the error.
const tbCorrect = {
  id: 'm09-tb-correct', module: 'm09', kind: 'amounts', part: 'producing', points: 4,
  params: { ...MONTH, groceries: { min: 1200, max: 9800, step: 1 } },
  build: (p) => {
    let g = p.groceries;
    for (let n = 0; n < 20 && !swapDiff(g); n++) g += 100;
    const right = monthBalances({ ...p, groceries: g });
    const shown = right.map((a) => (a.no === CHART.groceries.no ? { ...a, debit: swapped(g) } : a));
    const shownDebits = total(shown, 'debit');
    const credits = total(shown, 'credit');
    return {
      prompt: `${p.name}'s trial balance does not balance, and its totals are left blank. One amount was copied with two digits swapped. Add up both columns, then find the amount that was copied wrong.`,
      report: tb(p.name, shown, { errorShown: true, ask: ['total'] }),
      fields: [
        { label: 'Debits total, as copied', answer: shownDebits },
        { label: 'Credits total', answer: credits },
        { label: 'Difference between the two totals', answer: swapDiff(g) },
        { label: 'The swapped amount, as it should be', answer: g },
      ],
      explanation: `Debits ${money(shownDebits)}, credits ${money(credits)}: ${money(swapDiff(g))} apart, and ${money(swapDiff(g))} ÷ 9 = ${money(swapDiff(g) / 9)}, a transposition. Groceries shows ${money(swapped(g))} but should be ${money(g)}.`,
    };
  },
};

// Correcting a total once the error is found.
const correctedTotal = num('m09-corrected-total', 'interpreting', { total: { min: 80000, max: 250000, step: 1 }, c: { min: 1200, max: 9800, step: 1 }, name: { pick: NAMES } }, (p) => {
  let c = p.c;
  for (let n = 0; n < 20 && !swapDiff(c); n++) c += 100;
  const shownTotal = p.total - c + swapped(c);
  return {
    prompt: `${p.name}'s Debits column totals ${money(shownTotal)}, but one amount on it was copied as ${money(swapped(c))} instead of ${money(c)}. What should the Debits total be?`,
    answer: p.total,
    misconceptions: [{ cents: shownTotal + Math.abs(swapped(c) - c) * (swapped(c) > c ? 1 : -1), explanation: 'Take the wrong amount out and put the right one in; the total moves the other way.' }],
    explanation: `${money(shownTotal)} − ${money(swapped(c))} + ${money(c)} = ${money(p.total)}.`,
  };
});

// --- Lesson -------------------------------------------------------------------

// Sam's June: the same books are closed and reported in Module 12.
const JUNE = [
  acct('spending', 'debit', 62694), acct('saving', 'debit', 15502), acct('cash', 'debit', 2240), acct('card', 'credit', 4905), acct('net-worth', 'credit', 30000),
  acct('wages', 'credit', 121200), acct('taxes', 'debit', 17854), acct('rent', 'debit', 45000), acct('groceries', 'debit', 9640), acct('eating-out', 'debit', 3175),
];
const SMALL = [acct('spending', 'debit', 41200), acct('saving', 'debit', 31000), acct('card', 'credit', 8025), acct('net-worth', 'credit', 70000), acct('groceries', 'debit', 5825)];
const SWAPPED = SMALL.map((a) => (a.no === CHART.groceries.no ? { ...a, debit: 8525 } : a));

const M09_LESSON = {
  id: 'm09',
  title: 'Proving your books',
  coreIdea: 'A trial balance lists every page\'s balance. The debit and credit columns must have equal totals. When they do not, the size of the difference points to the error.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['card-entries'],
      text: ['From Module 8: a card page shows a credit balance of $300.00. You charge $45.60, then pay $120.00. What does it show now?'],
      answer: 22560,
      misconceptions: [{ cents: 46560, explanation: 'A payment is a debit that lowers what you owe.' }],
      explanation: '$300.00 + $45.60 − $120.00 = $225.60.',
    },
    {
      id: 'trial-balance', kind: 'explain', title: 'The trial balance', uses: ['trial-balance', 'equal-sides', 'account-numbers'],
      text: [
        'At the end of the month, list every page\'s balance in account-number order: debit balances in one column, credit balances in the other. This list is a trial balance.',
        'Every entry you posted had equal debits and credits, so the two columns must add up to the same total. When they do, your posting is very likely right. When they do not, there is an error to find.',
        'Here is Sam\'s trial balance for June. Both columns total the same.',
        'From this module on, you may use a calculator or a spreadsheet in practice sets. In the checks, you still work on your own.',
      ],
      prompt: 'Why must the two columns add up to the same total?',
      promptAnswer: 'Every entry posted equal debits and credits, so all the debit balances together equal all the credit balances together.',
      report: tb('Sam (example)', JUNE),
    },
    {
      id: 'predict-total', kind: 'predict', title: 'Predict: the totals', uses: ['trial-balance'],
      text: ['This trial balance has its totals left blank. Add up the Debits column. What is its total?'],
      report: tb('Maya (example)', SMALL, { ask: ['total'] }),
      answer: total(SMALL, 'debit'),
      misconceptions: [{ cents: total(SMALL, 'debit') + total(SMALL, 'credit'), explanation: 'Add only the debit balances. The credit balances have their own column.' }],
      explanation: '$412.00 + $310.00 + $58.25 = $780.25. The Credits column gives the same total: $80.25 + $700.00.',
    },
    {
      id: 'errors', kind: 'explain', title: 'Common errors', uses: ['common-errors', 'trial-balance'],
      text: [
        'Three errors cause most trial balances to be off.',
        'A transposition: two digits swapped. $58.25 written as $85.25.',
        'A slide: the decimal point moved. $450.00 written as $45.00.',
        'A one-sided entry: only one side posted. A $27.40 grocery debit was posted, but the Cash credit was forgotten.',
        'Some errors do not show up at all: an entry left out completely, or posted to the wrong account on the right side. Debits still equal credits. The trial balance proves the two sides are equal, not that every entry is right.',
        'This trial balance has a transposition: Groceries was copied as $85.25 instead of $58.25.',
      ],
      prompt: 'Which kind of error would a trial balance not catch?',
      promptAnswer: 'An entry left out completely, or one posted to the wrong account on the correct side, because debits still equal credits.',
      report: tb('Maya (example)', SWAPPED, { errorShown: true }),
    },
    {
      id: 'by-size', kind: 'explain', title: 'Finding an error by its size', uses: ['error-by-size', 'common-errors'],
      text: [
        'The size of the difference between the two totals is a clue.',
        'Divide it by 9. If it divides evenly, look for a transposition or a slide. Both always make a difference that divides evenly by 9. Here, $807.25 − $780.25 = $27.00, and $27.00 ÷ 9 = $3.00.',
        'Look for an amount equal to the difference. A one-sided entry leaves the totals apart by exactly its amount.',
        'Halve the difference. An amount posted on the wrong side is taken off one side instead of added, so the totals end up apart by twice the amount. Look for an amount equal to half the difference.',
      ],
      prompt: 'The trial balance is off by $63.00. Why might you check for swapped digits?',
      promptAnswer: '$63.00 ÷ 9 = $7.00 with nothing left over, and swapped digits always make a difference that divides evenly by 9.',
      report: tb('Maya (example)', SWAPPED, { errorShown: true }),
    },
    {
      id: 'predict-half', kind: 'predict', title: 'Predict: the wrong side', uses: ['error-by-size'],
      text: ['A trial balance\'s credits are $91.50 more than its debits. The difference does not divide evenly by 9, and nothing was left out. So an amount was probably posted on the wrong side. What amount should you look for?'],
      answer: 4575,
      misconceptions: [{ cents: 9150, explanation: 'An amount on the wrong side throws the books off by twice the amount. So halve the difference.' }],
      explanation: 'Half of $91.50 is $45.75.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['error-by-size', 'common-errors'],
      text: ['Step 1 is done: the trial balance is off by $36.00. Step 2 is done: $36.00 ÷ 9 = $4.00, so a transposition is likely. Step 3 is done: the Groceries page shows $51.80, but the receipt shows its first two digits the other way around. Finish Step 4: what is the right Groceries amount?'],
      answer: 1580,
      misconceptions: [{ cents: 8780, explanation: 'Swap the two digits. Do not add the difference.' }],
      explanation: 'Swap the 5 and the 1: $15.80. Check: $51.80 − $15.80 = $36.00, the difference.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['trial-balance', 'error-by-size'],
      text: ['Ana\'s trial balance shows debits of $1,250.40 and credits of $1,193.10. The difference does not divide evenly by 9. She finds that one entry had only its debit side posted. How much was that entry?'],
      answer: 5730,
      misconceptions: [{ cents: 2865, explanation: 'Halve the difference only for an amount posted on the wrong side. A one-sided entry leaves the totals apart by its whole amount.' }],
      explanation: '$1,250.40 − $1,193.10 = $57.30, the amount of the entry whose credit is missing.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['trial-balance'],
      text: ['A trial balance has credit balances of $62.40, $450.00 and $980.00. What is the Credits total?'],
      answer: 149240,
      explanation: '$62.40 + $450.00 + $980.00 = $1,492.40.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['common-errors', 'error-by-size'],
      text: ['A $360.00 amount was written as $36.00. By how much is the trial balance off?'],
      answer: 32400,
      explanation: '$360.00 − $36.00 = $324.00, and $324.00 ÷ 9 = $36.00. That is a slide.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['error-by-size'],
      text: ['Credits are $18.40 more than debits, and an amount was posted on the wrong side. What amount should you look for?'],
      answer: 920,
      misconceptions: [{ cents: 1840, explanation: 'Halve the difference for a wrong-side posting.' }],
      explanation: 'Half of $18.40 is $9.20.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [tbTotal, oneSided].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: halving a wrong-side difference.
const drill = [1, 2, 3].map((n) => num(`m09-drill-${n}`, 'interpreting', { half: { min: 100, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the totals are ${money(2 * p.half)} apart because one amount was posted on the wrong side. What amount do you look for?`, answer: p.half,
  explanation: `Half of ${money(2 * p.half)} is ${money(p.half)}.`,
})));

const cardMixed = { ...M08_GATE.templates.find((t) => t.part === 'producing'), id: 'm08-record-card-mixed-m09' };

const M09_PRACTICE = {
  id: 'm09-practice', kind: 'practice', module: 'm09', title: 'Module 9 practice set',
  templates: [...M08_LESSON.recallTemplates, ...M07_LESSON.recallTemplates, ...M05_LESSON.recallTemplates, ...drill, tbTotal, diagnose, wrongSide, oneSided, slide, tbBlanks, tbFromPages, cardMixed, { ...explainProof, id: 'm09-explain-practice' }],
};

const M09_EXTRA = {
  id: 'm09-extra', kind: 'practice', module: 'm09', title: 'Module 9 extra practice',
  templates: [tbTotal, oneSided, swapDifference, correctedTotal, tbFromPages, tbCorrect].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M09_REMEDIAL = {
  id: 'm09-remedial', kind: 'practice', module: 'm09', title: 'Module 9: common mistakes',
  templates: [diagnose, wrongSide, slide].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). tbFromPages comes first: later modules mix it in.
const M09_GATE = {
  id: 'm09', kind: 'gate', title: 'Module 9 check',
  templates: [tbTotal, diagnose, wrongSide, oneSided, slide, swapDifference, correctedTotal, tbFromPages, tbCorrect, explainProof],
};

// Questions Checkpoint C draws from this module.
const M09_CHECKPOINT = [diagnose, tbFromPages];
};

defs["content/modules/m10.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } = require("content/helpers.js");
const { M06_LESSON } = require("content/modules/m06.js");
const { M08_LESSON } = require("content/modules/m08.js");
const { M09_LESSON, M09_GATE } = require("content/modules/m09.js");
define(exports, { M10_LESSON: () => M10_LESSON, M10_PRACTICE: () => M10_PRACTICE, M10_EXTRA: () => M10_EXTRA, M10_REMEDIAL: () => M10_REMEDIAL, M10_GATE: () => M10_GATE, M10_CHECKPOINT: () => M10_CHECKPOINT });
// Module 10: Matching the bank. Ideas: bank-reconciliation, outstanding-items,
// bank-fee-interest-entries. Bank statements appear as source documents
// whose lines are marked in or out; reconciliations are reports. The book
// side is the pages held at the bank (Checking and the buckets), never Cash.
// The bank and every amount are fictional (illustrative).






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

const M10_LESSON = {
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

const M10_PRACTICE = {
  id: 'm10-practice', kind: 'practice', module: 'm10', title: 'Module 10 practice set',
  templates: [...M09_LESSON.recallTemplates, ...M08_LESSON.recallTemplates, ...M06_LESSON.recallTemplates, ...drill, adjustedBank, adjustedBook, statementClosing, recBlanks, recordBank, tbMixed, { ...explainBank, id: 'm10-explain-practice' }],
};

const M10_EXTRA = {
  id: 'm10-extra', kind: 'practice', module: 'm10', title: 'Module 10 extra practice',
  templates: [adjustedBank, statementClosing, bookBalance, statementFromBooks, recordBank].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M10_REMEDIAL = {
  id: 'm10-remedial', kind: 'practice', module: 'm10', title: 'Module 10: common mistakes',
  templates: [adjustedBook, recBlanks, recordBank].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). recordBank comes first: later modules mix it in.
const M10_GATE = {
  id: 'm10', kind: 'gate', title: 'Module 10 check',
  templates: [adjustedBank, adjustedBook, statementClosing, bookBalance, savingAfterInterest, statementFromBooks, drill[0], recordBank, recBlanks, explainBank],
};

// Questions Checkpoint C draws from this module.
const M10_CHECKPOINT = [adjustedBank, recordBank];
};

defs["content/modules/m11.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, chartPage, splitBuckets, standardPaycheck, CHART, PAYCHECK_SOURCES } = require("content/helpers.js");
const { M07_LESSON } = require("content/modules/m07.js");
const { M09_LESSON } = require("content/modules/m09.js");
const { M10_LESSON, M10_GATE } = require("content/modules/m10.js");
define(exports, { M11_LESSON: () => M11_LESSON, M11_PRACTICE: () => M11_PRACTICE, M11_EXTRA: () => M11_EXTRA, M11_REMEDIAL: () => M11_REMEDIAL, M11_GATE: () => M11_GATE, M11_CHECKPOINT: () => M11_CHECKPOINT });
// Module 11: Budgeting with logic. Ideas: budget-as-ledger, budget-vs-actual,
// spending-rules. Budgets are reports (Budget, Actual, Under, Over). Spending
// rules are taught as rules the learner chooses in advance; graded items
// only apply a stated rule or sort clear-cut needs from wants. Amounts are
// illustrative.






const num = (id, part, params, build) => ({ id, module: 'm11', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const bline = (id, budget, actual) => ({ no: CHART[id].no, name: CHART[id].name, budget, ...(actual == null ? {} : { actual }) });
const budget = (name, lines, extra = {}) => ({ report: 'budget', name, period: 'June 2026', lines, ...extra });
const sum = (list, key) => list.reduce((s, x) => s + x[key], 0);

// The Spending bucket's share of two standard paychecks.
const SPENDING_SHARE = 2 * splitBuckets(standardPaycheck().net).spending;

// --- Question templates -----------------------------------------------------

// Lines over and under; taken as a whole the month comes in under, because
// groceries come in at least $1.00 further under than eating out goes over.
const netUnder = num('m11-net-under', 'interpreting', {
  groc: { min: 25000, max: 35000, step: 500 }, gUnder: { min: 500, max: 4000, step: 1 }, eat: { min: 5000, max: 9000, step: 500 }, eOver: { min: 200, max: 2500, step: 1 },
  house: { min: 3000, max: 5000, step: 500 }, hUnder: { min: 300, max: 1500, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const gUnder = Math.max(p.gUnder, p.eOver + 100);
  const lines = [bline('rent', 55000, 55000), bline('groceries', p.groc, p.groc - gUnder), bline('eating-out', p.eat, p.eat + p.eOver), bline('household', p.house, p.house - p.hUnder)];
  const under = gUnder + p.hUnder;
  const net = under - p.eOver;
  return {
    prompt: `${p.name}'s budget report has its totals left blank. Taken as a whole, by how much did the month come in under budget?`,
    report: budget(p.name, lines, { ask: ['total'] }),
    answer: net,
    misconceptions: [{ cents: under, explanation: 'That is the Under column alone. The month as a whole also has to cover the line that went over.' }],
    explanation: `Total budget ${money(sum(lines, 'budget'))} − total actual ${money(sum(lines, 'actual'))} = ${money(net)}. (Under ${money(under)}, over ${money(p.eOver)}.)`,
  };
});

const leftToPlan = num('m11-left-to-plan', 'interpreting', {
  take: { min: 90000, max: 110000, step: 1 }, rent: { min: 40000, max: 55000, step: 500 }, groc: { min: 20000, max: 32000, step: 500 },
  phone: { min: 3500, max: 6000, step: 500 }, bus: { min: 4000, max: 6400, step: 100 }, name: { pick: NAMES },
}, (p) => {
  const share = 2 * splitBuckets(p.take).spending;
  const planned = p.rent + p.groc + p.phone + p.bus;
  return {
    prompt: `${p.name}'s two paychecks put ${money(share)} into the Spending bucket this month. The budget plans rent ${money(p.rent)}, groceries ${money(p.groc)}, phone ${money(p.phone)} and a bus pass ${money(p.bus)}. How much is not planned yet?`,
    answer: share - planned,
    misconceptions: [{ cents: planned, explanation: 'That is the planned total. Subtract it from the Spending bucket\'s share.' }],
    explanation: `${money(p.rent)} + ${money(p.groc)} + ${money(p.phone)} + ${money(p.bus)} = ${money(planned)}. ${money(share)} − ${money(planned)} = ${money(share - planned)}.`,
  };
});

// Production: the budget is given as a plan and the month's spending is on
// the expense pages. The learner works out the Actual column and the Under
// and Over totals, which only come out right if each line's direction is.
// Groceries always come in under and transportation always goes over; the
// other two lines can go either way.
const bvaFromPages = {
  id: 'm11-bva-from-pages', module: 'm11', kind: 'amounts', part: 'producing', points: 4,
  params: {
    g1: { min: 5000, max: 9500, step: 1 }, g2: { min: 5000, max: 9500, step: 1 }, g3: { min: 5000, max: 9500, step: 1 }, e1: { min: 1000, max: 4000, step: 1 }, e2: { min: 1000, max: 4000, step: 1 },
    fares: { min: 150, max: 900, step: 25 }, h1: { min: 800, max: 2500, step: 1 }, h2: { min: 800, max: 2500, step: 1 }, name: { pick: NAMES },
  },
  build: (p) => {
    const plan = [bline('groceries', 30000), bline('eating-out', 6000), bline('transport', 6400), bline('household', 4000)];
    const actual = [p.g1 + p.g2 + p.g3, p.e1 + p.e2, 6400 + p.fares, p.h1 + p.h2];
    const under = plan.reduce((s, l, i) => s + Math.max(0, l.budget - actual[i]), 0);
    const over = plan.reduce((s, l, i) => s + Math.max(0, actual[i] - l.budget), 0);
    const actualTotal = actual.reduce((s, x) => s + x, 0);
    const word = (l, i) => (actual[i] > l.budget ? `over by ${money(actual[i] - l.budget)}` : actual[i] < l.budget ? `under by ${money(l.budget - actual[i])}` : 'exactly on budget');
    return {
      prompt: `${p.name}'s budget for June is on the report, and the month's spending is on the expense pages. Work out each line's actual amount and whether it is under or over, then give the totals.`,
      report: budget(p.name, plan),
      ledgers: [
        chartPage('groceries', [['2026-06-06', 'Desert Mart', 'J1', p.g1, 0, true], ['2026-06-14', 'Saguaro Grocery', 'J2', p.g2, 0, true], ['2026-06-24', 'Desert Mart', 'J3', p.g3, 0, true]], { name: p.name }),
        chartPage('eating-out', [['2026-06-10', 'Taco Stand', 'J1', p.e1, 0, true], ['2026-06-21', 'Pizza', 'J3', p.e2, 0, true]], { name: p.name }),
        chartPage('transport', [['2026-06-01', 'Bus pass', 'J1', 6400, 0, true], ['2026-06-27', 'Extra bus fares', 'J3', p.fares, 0, true]], { name: p.name }),
        chartPage('household', [['2026-06-06', 'Desert Mart', 'J1', p.h1, 0, true], ['2026-06-24', 'Desert Mart', 'J3', p.h2, 0, true]], { name: p.name }),
      ],
      fields: [['Total of the Actual column', actualTotal], ['Total of the Under column', under], ['Total of the Over column', over], ['Groceries: amount under budget', 30000 - actual[0]]].map(([label, answer]) => ({ label, answer })),
      explanation: `${plan.map((l, i) => `${l.name} ${money(actual[i])}, ${word(l, i)}`).join('; ')}. Actual total ${money(actualTotal)}; Under ${money(under)}; Over ${money(over)}.`,
    };
  },
};

// Needs first: plan the needs, then see what is left for wants.
const needsFirst = num('m11-needs-first', 'interpreting', {
  take: { min: 90000, max: 110000, step: 1 }, rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 35000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 },
  concert: { min: 3500, max: 9000, step: 1 }, takeout: { min: 1500, max: 4000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const share = 2 * splitBuckets(p.take).spending;
  const needs = p.rent + p.groceries + p.bus;
  return {
    prompt: `${p.name}'s rule is "needs first". This month the Spending bucket holds ${money(share)}. The list: rent ${money(p.rent)}; a concert ticket ${money(p.concert)}; groceries ${money(p.groceries)}; takeout ${money(p.takeout)}; a bus pass to get to work ${money(p.bus)}. After the needs are planned, how much is left for wants?`,
    answer: share - needs,
    misconceptions: [{ cents: share - needs - p.concert - p.takeout, explanation: 'The concert and the takeout are wants. Plan only the needs first; the wants come out of what is left.' }],
    explanation: `Needs: rent ${money(p.rent)} + groceries ${money(p.groceries)} + bus pass ${money(p.bus)} = ${money(needs)}. ${money(share)} − ${money(needs)} = ${money(share - needs)} left for wants.`,
  };
});

const explainBudget = explainTemplate({
  id: 'm11-explain', module: 'm11',
  variants: [
    { prompt: 'In one or two sentences: why is a budget written before the month starts?',
      modelAnswer: 'So the decisions are made calmly, in advance. During the month you follow the plan instead of deciding on impulse.',
      rubric: ['Says decisions are made in advance (before the spending)', 'Says this replaces deciding on impulse or mood'] },
    { prompt: 'In one or two sentences: the month came in under budget overall. Why still look at each line?',
      modelAnswer: 'The total can hide a problem: a line that went over is covered by another that came in under. Each line shows where the plan and the spending differ.',
      rubric: ['Says one line over can be hidden by another under', 'Says each line shows where to change the plan or the spending'] },
    { prompt: 'In one or two sentences: why pay the needs in the budget before the wants?',
      modelAnswer: 'Needs, such as rent and groceries, must be paid to live and work. If wants come first, there may be nothing left for them.',
      rubric: ['Says needs are what you must pay to live or work', 'Says paying wants first can leave too little for needs'] },
    { prompt: 'In one or two sentences: what is a waiting-period rule for?',
      modelAnswer: 'It puts time between wanting something and buying it, so you decide with the budget in front of you whether you still want it and whether the money is there.',
      rubric: ['Says it puts time between wanting something and buying it', 'Says you then decide with the budget (whether you still want it and the money is there)'] },
  ],
});

const NEEDS = [['rent', 'Rent'], ['groceries', 'Groceries'], ['bus', 'A bus pass to get to work']];
const WANTS = [['concert', 'A concert ticket'], ['takeout', 'Takeout dinner'], ['game', 'A new video game']];
const needsTotal = num('m11-needs-total', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 35000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 },
  concert: { min: 3500, max: 9000, step: 1 }, takeout: { min: 1500, max: 4000, step: 1 }, game: { min: 2999, max: 6999, step: 100 }, name: { pick: NAMES },
}, (p) => {
  const needs = NEEDS.reduce((s, [k]) => s + p[k], 0);
  const wants = WANTS.reduce((s, [k]) => s + p[k], 0);
  const list = [NEEDS[0], WANTS[0], NEEDS[1], WANTS[1], NEEDS[2], WANTS[2]].map(([k, words]) => `${words.toLowerCase()} ${money(p[k])}`).join('; ');
  return {
    prompt: `${p.name}'s list for the month: ${list}. What is the total of the needs?`,
    answer: needs,
    misconceptions: [{ cents: needs + wants, explanation: 'That is everything. The concert, the takeout and the game are wants.' }],
    explanation: `Needs are rent, groceries and the bus pass to work: ${money(p.rent)} + ${money(p.groceries)} + ${money(p.bus)} = ${money(needs)}.`,
  };
});

const lineOver = num('m11-line-over', 'interpreting', { budget: { min: 4000, max: 35000, step: 500 }, over: { min: 100, max: 4000, step: 1 }, line: { pick: ['groceries', 'eating-out', 'household', 'phone'] }, name: { pick: NAMES } }, (p) => {
  return {
    prompt: `${p.name}'s ${CHART[p.line].name} line had a budget of ${money(p.budget)}, and the page shows ${money(p.budget + p.over)} spent. By how much did it go over?`,
    answer: p.over,
    misconceptions: [{ cents: p.budget + p.over, explanation: 'That is the actual amount. The amount over is actual minus budget.' }],
    explanation: `Actual ${money(p.budget + p.over)} − budget ${money(p.budget)} = ${money(p.over)} over.`,
  };
});

// Completion: a budget report with each line worked out; the learner writes
// the four totals.
const underOverTotals = {
  id: 'm11-under-over-totals', module: 'm11', kind: 'amounts', part: 'producing', points: 4,
  // Its own budget amounts, so its totals differ from the plan shown in the
  // other budget question of the check.
  params: {
    gb: { min: 22000, max: 36000, step: 500 }, eb: { min: 4000, max: 9000, step: 500 }, tb: { min: 5000, max: 8000, step: 100 }, hb: { min: 2500, max: 6000, step: 500 },
    gUnder: { min: 500, max: 4000, step: 1 }, eOver: { min: 200, max: 2500, step: 1 }, hUnder: { min: 300, max: 1500, step: 1 }, fares: { min: 150, max: 900, step: 25 }, name: { pick: NAMES },
  },
  build: (p) => {
    const lines = [bline('groceries', p.gb, p.gb - p.gUnder), bline('eating-out', p.eb, p.eb + p.eOver), bline('transport', p.tb, p.tb + p.fares), bline('household', p.hb, p.hb - p.hUnder)];
    return {
      prompt: `Finish ${p.name}'s budget report: write the total of each column.`,
      report: budget(p.name, lines, { ask: ['total'] }),
      fields: [
        { label: 'Total of the Budget column', answer: sum(lines, 'budget') },
        { label: 'Total of the Actual column', answer: sum(lines, 'actual') },
        { label: 'Total of the Under column', answer: p.gUnder + p.hUnder },
        { label: 'Total of the Over column', answer: p.eOver + p.fares },
      ],
      explanation: `Budget ${money(sum(lines, 'budget'))}; Actual ${money(sum(lines, 'actual'))}; Under ${money(p.gUnder)} + ${money(p.hUnder)} = ${money(p.gUnder + p.hUnder)}; Over ${money(p.eOver)} + ${money(p.fares)} = ${money(p.eOver + p.fares)}.`,
    };
  },
};

// Applying a stated waiting-period rule (the rule is given; only its use is graded).
const waitRule = num('m11-wait-rule', 'interpreting', { blow: { min: 17000, max: 25000, step: 1 }, small: { min: 800, max: 4900, step: 1 }, big: { min: 5100, max: 12000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name}'s rule: anything not in the budget comes out of Blow money. Under $50.00, it can be bought right away. $50.00 or more waits a week. Blow money holds ${money(p.blow)}. This week ${p.name} buys a ${money(p.small)} item and also wants a ${money(p.big)} item. What does Blow money hold at the end of the week?`,
  answer: p.blow - p.small,
  misconceptions: [{ cents: p.blow - p.small - p.big, explanation: 'The second item is $50.00 or more, so under the rule it waits a week. It is not bought yet.' }],
  explanation: `Only the item under $50.00 is bought this week: ${money(p.blow)} − ${money(p.small)} = ${money(p.blow - p.small)}.`,
}));

// --- Lesson -------------------------------------------------------------------

const PLAN = [bline('rent', 55000), bline('groceries', 32000), bline('phone', 4500), bline('transport', 6400), bline('eating-out', 8000), bline('household', 4000)];
const ACTUAL = [bline('rent', 55000, 55000), bline('groceries', 32000, 29765), bline('phone', 4500, 4500), bline('transport', 6400, 6400), bline('eating-out', 8000, 10450), bline('household', 4000, 3120)];
const planned = sum(PLAN, 'budget');

const M11_LESSON = {
  id: 'm11',
  title: 'Budgeting with logic',
  coreIdea: 'A budget is your ledger written in advance: the Spending bucket\'s money is given its jobs before the month starts. At month-end, compare each line with what you actually spent.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['outstanding-items'],
      text: ['From Module 10: a statement closes at $500.00, and a $42.00 check you wrote has not been cashed. What is the adjusted bank balance?'],
      answer: 45800,
      misconceptions: [{ cents: 54200, explanation: 'A payment not yet on the statement is subtracted.' }],
      explanation: '$500.00 − $42.00 = $458.00.',
    },
    {
      id: 'budget', kind: 'explain', title: 'A ledger written in advance', uses: ['budget-as-ledger', 'five-buckets'],
      text: [
        `A budget is a plan written before the month starts. The five buckets come first. From each paycheck, the Spending bucket gets ${money(SPENDING_SHARE / 2)}, so Rosa's two June paychecks put ${money(SPENDING_SHARE)} in it.`,
        'The budget gives that money its jobs: one line for each expense page, with the amount you plan to spend. Anything not planned stays in the Spending bucket for surprises.',
        'This is Rosa\'s plan for June. The Actual column stays empty until the month is over.',
      ],
      prompt: 'Why plan the spending before the month starts, instead of looking back at the end?',
      promptAnswer: 'Deciding in advance lets logic set the plan. During the month you follow it instead of deciding on impulse.',
      report: budget('Rosa (example)', PLAN),
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-left', kind: 'predict', title: 'Predict: what is not planned', uses: ['budget-as-ledger'],
      text: [`Rosa's Spending bucket holds ${money(SPENDING_SHARE)} for June. How much of it does this plan leave unplanned?`],
      report: budget('Rosa (example)', PLAN),
      answer: SPENDING_SHARE - planned,
      misconceptions: [{ cents: planned, explanation: 'That is the planned total. Subtract it from what the bucket holds.' }],
      explanation: `${money(SPENDING_SHARE)} − ${money(planned)} = ${money(SPENDING_SHARE - planned)}, kept for surprises.`,
    },
    {
      id: 'actual', kind: 'explain', title: 'Budget and actual', uses: ['budget-vs-actual', 'personal-accounts'],
      text: [
        'At month-end, write the actual amount from each expense page beside its budget. Under means you spent less than planned. Over means you spent more.',
        'Look at each line, then at the totals. Rosa came in under on groceries and household supplies, but over on eating out.',
        'A line that is often over tells you something: either the plan did not fit real life, or the spending needs a rule. That is how next month\'s plan gets better.',
      ],
      prompt: 'Eating out went over, but the month as a whole came in under. Why still look at the line?',
      promptAnswer: 'The total can hide a problem: one line over is covered by another under. The line shows where the plan and the spending differ.',
      report: budget('Rosa (example)', ACTUAL),
    },
    {
      id: 'predict-over', kind: 'predict', title: 'Predict: one line', uses: ['budget-vs-actual'],
      text: ['Groceries: budget $320.00, actual $341.85. By how much is the line over?'],
      answer: 2185,
      misconceptions: [{ cents: 66185, explanation: 'Find the difference between the two amounts.' }],
      explanation: '$341.85 − $320.00 = $21.85 over.',
    },
    {
      id: 'rules', kind: 'explain', title: 'Rules decided in advance', uses: ['spending-rules', 'five-buckets'],
      text: [
        'A rule set before the moment you want something lets you decide calmly. Two rules many people use:',
        'Needs come first. A need is something you must pay to live and work, such as rent, groceries or a bus pass to get to work. A want is something nice to have, such as takeout or a concert. The budget pays the needs before the wants.',
        'A waiting period for anything not in the budget. For example, wait a day for a small purchase and a week for a large one. If you still want it after the wait, and the money is there, buy it with Blow money.',
        'You choose your own rules. Write them down at the start of the month, next to the budget.',
      ],
      prompt: 'Why decide the rule before you see the thing you want?',
      promptAnswer: 'In the moment, wanting it makes the decision for you. A rule made calmly in advance lets logic decide.',
      ledger: chartPage('blow', [['2026-06-06', 'From paycheck', 'J1', 10335, 0, true], ['2026-06-17', 'Jacket (waited two days)', 'J3', 0, 5999, true]], { name: 'Rosa (example)' }),
      highlightRow: 1,
    },
    {
      id: 'predict-needs', kind: 'predict', title: 'Predict: needs first', uses: ['spending-rules'],
      text: ['This month\'s list: rent $550.00; groceries $320.00; a concert ticket $65.00; a bus pass to get to work $64.00; takeout $38.50. What is the total of the needs?'],
      answer: 93400,
      misconceptions: [{ cents: 103750, explanation: 'The concert ticket and the takeout are wants.' }],
      explanation: 'Rent, groceries and the bus pass: $550.00 + $320.00 + $64.00 = $934.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['budget-vs-actual'],
      text: ['Step 1 is done: the budget lines add up to $1,099.00. Step 2 is done: the expense pages add up to $1,082.40. Finish Step 3: taken as a whole, by how much did the month come in under budget?'],
      answer: 1660,
      explanation: '$1,099.00 − $1,082.40 = $16.60 under.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['spending-rules', 'five-buckets'],
      text: ['Your rule: anything not in the budget waits two days, and if you still want it, it comes out of Blow money. Blow money holds $86.20. After two days you still want a $47.95 pair of shoes. What does Blow money hold after you buy it?'],
      answer: 3825,
      misconceptions: [{ cents: 13415, explanation: 'Buying the shoes takes money out of Blow money: subtract.' }],
      explanation: '$86.20 − $47.95 = $38.25.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['budget-vs-actual'],
      text: ['Phone: budget $45.00, actual $45.00. Eating out: budget $80.00, actual $62.10. How much under budget are these two lines together?'],
      answer: 1790,
      explanation: 'Phone is on budget. Eating out: $80.00 − $62.10 = $17.90 under.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['budget-as-ledger'],
      text: [`The Spending bucket holds ${money(SPENDING_SHARE)}. The budget lines add up to $1,155.00. How much is not planned?`],
      answer: SPENDING_SHARE - 115500,
      explanation: `${money(SPENDING_SHARE)} − $1,155.00 = ${money(SPENDING_SHARE - 115500)}.`,
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['spending-rules'],
      text: ['The list: rent $480.00; a movie $14.75; groceries $260.00; a new video game $59.99; a bus pass to get to work $64.00. What is the total of the needs?'],
      answer: 80400,
      misconceptions: [{ cents: 87874, explanation: 'The movie and the video game are wants.' }],
      explanation: '$480.00 + $260.00 + $64.00 = $804.00.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [netUnder, leftToPlan].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: one budget line against its actual.
const drill = [1, 2, 3].map((n) => num(`m11-drill-${n}`, 'interpreting', { budget: { min: 3000, max: 40000, step: 500 }, gap: { min: 100, max: 2900, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: budget ${money(p.budget)}, actual ${money(p.budget - p.gap)}. How much under?`, answer: p.gap,
  explanation: `${money(p.budget)} − ${money(p.budget - p.gap)} = ${money(p.gap)}.`,
})));

const bankMixed = { ...M10_GATE.templates.find((t) => t.part === 'producing'), id: 'm10-record-bank-mixed-m11' };

const M11_PRACTICE = {
  id: 'm11-practice', kind: 'practice', module: 'm11', title: 'Module 11 practice set',
  templates: [...M10_LESSON.recallTemplates, ...M09_LESSON.recallTemplates, ...M07_LESSON.recallTemplates, ...drill, netUnder, needsFirst, leftToPlan, needsTotal, lineOver, waitRule, underOverTotals, bvaFromPages, bankMixed, { ...explainBudget, id: 'm11-explain-practice' }],
};

const M11_EXTRA = {
  id: 'm11-extra', kind: 'practice', module: 'm11', title: 'Module 11 extra practice',
  templates: [leftToPlan, needsTotal, bvaFromPages].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M11_REMEDIAL = {
  id: 'm11-remedial', kind: 'practice', module: 'm11', title: 'Module 11: common mistakes',
  templates: [netUnder, needsTotal, bvaFromPages].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). bvaFromPages comes first: later modules mix it in.
const M11_GATE = {
  id: 'm11', kind: 'gate', title: 'Module 11 check',
  templates: [netUnder, needsFirst, leftToPlan, needsTotal, lineOver, waitRule, drill[0], bvaFromPages, underOverTotals, explainBudget],
};

// Questions Checkpoint C draws from this module.
const M11_CHECKPOINT = [netUnder, needsFirst, bvaFromPages];
};

defs["content/modules/m12.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } = require("content/helpers.js");
const { M08_LESSON } = require("content/modules/m08.js");
const { M10_LESSON } = require("content/modules/m10.js");
const { M11_LESSON, M11_GATE } = require("content/modules/m11.js");
define(exports, { M12_LESSON: () => M12_LESSON, M12_PRACTICE: () => M12_PRACTICE, M12_EXTRA: () => M12_EXTRA, M12_REMEDIAL: () => M12_REMEDIAL, M12_GATE: () => M12_GATE, M12_CHECKPOINT: () => M12_CHECKPOINT });
// Module 12: Month-end. Ideas: closing-entries, income-statement,
// net-worth-statement. Income and expense pages are closed straight into Net
// worth (30). The worked example finishes Sam's June books from Module 9.
// Amounts are illustrative.






const num = (id, part, params, build) => ({ id, module: 'm12', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const item = (id, amount) => ({ no: CHART[id].no, name: CHART[id].name, amount });
const incomeStatement = (name, income, expenses, extra = {}) => ({ report: 'income-statement', name, period: 'June 2026', income, expenses, ...extra });
const netWorthStatement = (name, assets, liabilities, extra = {}) => ({ report: 'net-worth', name, date: '2026-06-30', assets, liabilities, ...extra });
const sum = (list) => list.reduce((s, x) => s + x.amount, 0);

// --- Question templates -----------------------------------------------------

const added = num('m12-added', 'interpreting', {
  wages: { min: 100000, max: 130000, step: 1 }, gifts: { min: 0, max: 6000, step: 500 }, rent: { min: 40000, max: 55000, step: 500 },
  groceries: { min: 15000, max: 30000, step: 1 }, phone: { min: 3500, max: 6000, step: 500 }, name: { pick: NAMES },
}, (p) => {
  const income = [item('wages', p.wages), ...(p.gifts ? [item('gifts', p.gifts)] : [])];
  const expenses = [item('rent', p.rent), item('groceries', p.groceries), item('phone', p.phone)];
  const answer = sum(income) - sum(expenses);
  return {
    prompt: `${p.name}'s income statement has its totals left blank. How much did the month add to ${p.name}'s net worth?`,
    report: incomeStatement(p.name, income, expenses, { ask: ['total-income', 'total-expenses', 'net'] }),
    answer,
    misconceptions: [{ cents: sum(income) + sum(expenses), explanation: 'Expenses are subtracted from income, not added to it.' }],
    explanation: `Income ${money(sum(income))} − expenses ${money(sum(expenses))} = ${money(answer)}.`,
  };
});

const nwStatement = num('m12-nw-statement', 'interpreting', {
  spending: { min: 20000, max: 70000, step: 1 }, saving: { min: 30000, max: 200000, step: 1 }, investing: { min: 5000, max: 60000, step: 1 },
  cash: { min: 500, max: 6000, step: 1 }, card: { min: 1000, max: 30000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const assets = [item('spending', p.spending), item('saving', p.saving), item('investing', p.investing), item('cash', p.cash)];
  const liabilities = [item('card', p.card)];
  const answer = sum(assets) - p.card;
  return {
    prompt: `${p.name}'s net-worth statement has its totals left blank. What is ${p.name}'s net worth?`,
    report: netWorthStatement(p.name, assets, liabilities, { ask: ['total-assets', 'total-liabilities', 'net'] }),
    answer,
    misconceptions: [{ cents: sum(assets) + p.card, explanation: 'What you owe is subtracted from what you own.' }],
    explanation: `Assets ${money(sum(assets))} − liabilities ${money(p.card)} = ${money(answer)}.`,
  };
});

// Every scenario closes two pages in one entry: three lines.
const CLOSE_ACCOUNTS = accountOptions(['net-worth', 'wages', 'gifts', 'interest-earned', 'rent', 'groceries', 'phone', 'eating-out']);
const CLOSE_EVENTS = {
  income: (p) => ({
    prompt: `Write the closing entry for the income pages: Wages has a credit balance of ${money(p.a)} and Gifts received ${money(p.b)}.`,
    answer: [{ account: 'wages', debit: p.a, credit: 0 }, { account: 'gifts', debit: p.b, credit: 0 }, { account: 'net-worth', debit: 0, credit: p.a + p.b }],
    explanation: `Each income page is debited to bring it to zero. Net worth is credited for both: ${money(p.a + p.b)}.`,
  }),
  expenses: (p) => ({
    prompt: `Write the closing entry for these expense pages: Rent has a debit balance of ${money(p.c)} and Groceries ${money(p.d)}.`,
    answer: [{ account: 'net-worth', debit: p.c + p.d, credit: 0 }, { account: 'rent', debit: 0, credit: p.c }, { account: 'groceries', debit: 0, credit: p.d }],
    explanation: `Each expense page is credited to bring it to zero. Net worth is debited for both: ${money(p.c + p.d)}.`,
  }),
  interest: (p) => ({
    prompt: `Write the closing entry for the income pages: Wages has a credit balance of ${money(p.a)} and Interest earned ${money(p.e)}.`,
    answer: [{ account: 'wages', debit: p.a, credit: 0 }, { account: 'interest-earned', debit: p.e, credit: 0 }, { account: 'net-worth', debit: 0, credit: p.a + p.e }],
    explanation: `Each income page is debited to bring it to zero. Net worth is credited for both: ${money(p.a + p.e)}.`,
  }),
  bills: (p) => ({
    prompt: `Write the closing entry for these expense pages: Phone has a debit balance of ${money(p.f)} and Eating out ${money(p.g)}.`,
    answer: [{ account: 'net-worth', debit: p.f + p.g, credit: 0 }, { account: 'phone', debit: 0, credit: p.f }, { account: 'eating-out', debit: 0, credit: p.g }],
    explanation: `Each expense page is credited to bring it to zero. Net worth is debited for both: ${money(p.f + p.g)}.`,
  }),
};
const recordClosing = {
  id: 'm12-record-closing', module: 'm12', kind: 'entry', part: 'producing', points: 4,
  params: {
    a: { min: 100000, max: 130000, step: 1 }, b: { min: 1000, max: 6000, step: 500 }, c: { min: 40000, max: 55000, step: 500 }, d: { min: 15000, max: 30000, step: 1 },
    e: { min: 20, max: 300, step: 1 }, f: { min: 3500, max: 6000, step: 500 }, g: { min: 2000, max: 9000, step: 1 }, event: { byVersion: Object.keys(CLOSE_EVENTS) },
  },
  build: (p) => ({ accounts: CLOSE_ACCOUNTS, ...CLOSE_EVENTS[p.event](p) }),
};

const explainMonthEnd = explainTemplate({
  id: 'm12-explain', module: 'm12',
  variants: [
    { prompt: 'In one or two sentences: why are income and expense pages closed at the end of each month?',
      modelAnswer: 'They measure one month. Closing moves their balances into Net worth, so each starts the next month at zero.',
      rubric: ['Says they measure one month (one period)', 'Says closing moves the balances into Net worth and starts them at zero'] },
    { prompt: 'In one or two sentences: what does the income statement show?',
      modelAnswer: 'The month\'s income and expenses, and the difference: what the month added to, or took from, your net worth.',
      rubric: ['Says it lists the month\'s income and expenses', 'Says the difference is what the month added to (or took from) net worth'] },
    { prompt: 'In one or two sentences: why must the net-worth statement agree with the Net worth page after closing?',
      modelAnswer: 'Both show what you own minus what you owe. Closing brought the month\'s income and expenses into the Net worth page, so the two must match.',
      rubric: ['Says both measure what you own minus what you owe', 'Says closing brings the month into the Net worth page, so the two must match'] },
    { prompt: 'In one or two sentences: why is an expense page credited when it is closed?',
      modelAnswer: 'An expense page has a debit balance. A credit of the same amount brings it to zero, and the matching debit goes to Net worth.',
      rubric: ['Says the expense page has a debit balance', 'Says a credit of the same amount brings it to zero (and Net worth is debited)'] },
  ],
});

const nwAfterClose = num('m12-nw-after-close', 'interpreting', { opening: { min: 20000, max: 150000, step: 1 }, income: { min: 100000, max: 130000, step: 1 }, expenses: { min: 60000, max: 99000, step: 1 } }, (p) => ({
  prompt: `Net worth started the month at ${money(p.opening)}. The month's income was ${money(p.income)} and its expenses ${money(p.expenses)}. After closing, what does the Net worth page show?`,
  answer: p.opening + p.income - p.expenses,
  misconceptions: [{ cents: p.opening + p.income + p.expenses, explanation: 'Closing the expenses debits Net worth: subtract them.' }],
  explanation: `${money(p.opening)} + ${money(p.income)} − ${money(p.expenses)} = ${money(p.opening + p.income - p.expenses)}.`,
}));

// Completion: the month-end figures from a trial balance. Wages is whatever
// makes the trial balance balance; the ranges keep it above the expenses.
const monthEndFigures = {
  id: 'm12-month-end-figures', module: 'm12', kind: 'amounts', part: 'producing', points: 4,
  params: { spending: { min: 40000, max: 70000, step: 1 }, saving: { min: 10000, max: 40000, step: 1 }, card: { min: 1000, max: 8000, step: 1 }, opening: { min: 5000, max: 20000, step: 1 }, rent: { min: 40000, max: 50000, step: 500 }, groceries: { min: 8000, max: 20000, step: 1 }, name: { pick: NAMES } },
  build: (p) => {
    const expenses = p.rent + p.groceries;
    const wages = p.spending + p.saving - p.card - p.opening + expenses;
    const net = wages - expenses;
    const accounts = [
      { no: 2, name: 'Spending bucket', debit: p.spending }, { no: 3, name: 'Saving bucket', debit: p.saving }, { no: 21, name: 'Credit card', credit: p.card },
      { no: 30, name: 'Net worth', credit: p.opening }, { no: 40, name: 'Wages', credit: wages }, { no: 51, name: 'Rent', debit: p.rent }, { no: 52, name: 'Groceries', debit: p.groceries },
    ];
    return {
      prompt: `From ${p.name}'s trial balance before closing, work out the month-end figures.`,
      report: { report: 'trial-balance', name: p.name, date: '2026-06-30', accounts },
      fields: [['Total expenses', expenses], ['Added to net worth this month', net], ['Net worth after closing', p.opening + net], ['Total assets on the net-worth statement', p.spending + p.saving]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: `Expenses ${money(p.rent)} + ${money(p.groceries)} = ${money(expenses)}. Added: ${money(wages)} − ${money(expenses)} = ${money(net)}. Net worth: ${money(p.opening)} + ${money(net)} = ${money(p.opening + net)}. Assets: ${money(p.spending)} + ${money(p.saving)} = ${money(p.spending + p.saving)}; minus ${money(p.card)} owed gives the same net worth.`,
    };
  },
};

// A month where spending was more than income: wages stay below the smallest
// possible expenses ($500.00 + $150.00 + $35.00).
const takenFrom = num('m12-taken-from', 'interpreting', { wages: { min: 45000, max: 68000, step: 1 }, rent: { min: 50000, max: 60000, step: 500 }, groceries: { min: 15000, max: 30000, step: 1 }, phone: { min: 3500, max: 6000, step: 500 }, name: { pick: NAMES } }, (p) => {
  const expenses = p.rent + p.groceries + p.phone;
  return {
    prompt: `${p.name} worked fewer hours this month. The income statement has its totals left blank. How much did the month take from ${p.name}'s net worth?`,
    report: incomeStatement(p.name, [item('wages', p.wages)], [item('rent', p.rent), item('groceries', p.groceries), item('phone', p.phone)], { ask: ['total-income', 'total-expenses', 'net'] }),
    answer: expenses - p.wages,
    misconceptions: [{ cents: expenses + p.wages, explanation: 'That adds the two totals. Compare them instead: expenses minus income is what the month took from net worth.' }],
    explanation: `Expenses ${money(expenses)} were more than income ${money(p.wages)}: ${money(expenses)} − ${money(p.wages)} = ${money(expenses - p.wages)} taken from net worth.`,
  };
});

const closeIncomeCredit = num('m12-close-income-credit', 'interpreting', { wages: { min: 90000, max: 130000, step: 1 }, interest: { min: 20, max: 400, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} closes Wages (${money(p.wages)}) and Interest earned (${money(p.interest)}) in one entry. How much is credited to Net worth?`,
  answer: p.wages + p.interest,
  misconceptions: [{ cents: p.wages, explanation: 'That counts Wages only. One credit to Net worth covers both income pages.' }],
  explanation: `${money(p.wages)} + ${money(p.interest)} = ${money(p.wages + p.interest)}.`,
}));

const nwPageAfterClose = num('m12-nw-page-after-close', 'interpreting', { opening: { min: 10000, max: 120000, step: 1 }, income: { min: 90000, max: 130000, step: 1 }, expenses: { min: 50000, max: 89000, step: 1 }, name: { pick: NAMES } }, (p) => ({
  prompt: `Both closing entries have been posted to ${p.name}'s Net worth page. What does it show after the last line?`,
  ledger: chartPage('net-worth', [['2026-06-01', 'Opening net worth', '', 0, p.opening], ['2026-06-30', 'Closing: income', 'J6', 0, p.income, true], ['2026-06-30', 'Closing: expenses', 'J6', p.expenses, 0, true]], { name: p.name, askFrom: 2 }),
  highlightRow: 2,
  answer: p.opening + p.income - p.expenses,
  misconceptions: [{ cents: p.opening + p.income + p.expenses, explanation: 'Closing the expenses is a debit to Net worth, so subtract.' }],
  explanation: `${money(p.opening)} + ${money(p.income)} − ${money(p.expenses)} = ${money(p.opening + p.income - p.expenses)}.`,
}));

// Reading the expense lines off a trial balance (the income statement's figures).
const expensesFromTb = num('m12-expenses-from-tb', 'interpreting', { spending: { min: 30000, max: 70000, step: 1 }, opening: { min: 10000, max: 30000, step: 1 }, rent: { min: 40000, max: 50000, step: 500 }, groceries: { min: 8000, max: 25000, step: 1 }, phone: { min: 3500, max: 6000, step: 500 }, name: { pick: NAMES } }, (p) => {
  const expenses = p.rent + p.groceries + p.phone;
  const wages = p.spending - p.opening + expenses;
  return {
    prompt: `From ${p.name}'s trial balance before closing, what is the total of the expenses that go on the income statement?`,
    report: { report: 'trial-balance', name: p.name, date: '2026-06-30', accounts: [
      { no: 2, name: 'Spending bucket', debit: p.spending }, { no: 30, name: 'Net worth', credit: p.opening }, { no: 40, name: 'Wages', credit: wages },
      { no: 51, name: 'Rent', debit: p.rent }, { no: 52, name: 'Groceries', debit: p.groceries }, { no: 55, name: 'Phone', debit: p.phone },
    ] },
    answer: expenses,
    misconceptions: [{ cents: expenses + p.spending, explanation: 'Account 2 is an asset. Expenses are numbered 50 to 99.' }],
    explanation: `Expenses (50 to 99): ${money(p.rent)} + ${money(p.groceries)} + ${money(p.phone)} = ${money(expenses)}.`,
  };
});

// --- Lesson -------------------------------------------------------------------

// Sam's June (trial balance in Module 9).
const EXPENSES = [item('taxes', 17854), item('rent', 45000), item('groceries', 9640), item('eating-out', 3175)];
const INCOME = [item('wages', 121200)];
const closingJournal = journal([
  ['2026-06-30', 'J6', 'Close income to net worth', [['wages', 121200, 0, true], ['net-worth', 0, 121200, true]]],
  ['2026-06-30', 'J6', 'Close expenses to net worth', [['net-worth', 75669, 0, true], ['taxes', 0, 17854, true], ['rent', 0, 45000, true], ['groceries', 0, 9640, true], ['eating-out', 0, 3175, true]]],
], { sheetNo: 6, name: 'Sam (example)' });
const netWorthPage = (askFrom = null) => chartPage('net-worth', [
  ['2026-06-01', 'Opening net worth', '', 0, 30000],
  ['2026-06-30', 'Closing: income', 'J6', 0, 121200, true],
  ['2026-06-30', 'Closing: expenses', 'J6', 75669, 0, true],
], { name: 'Sam (example)', askFrom });
const JUNE_ASSETS = [item('spending', 62694), item('saving', 15502), item('cash', 2240)];
const JUNE_LIABILITIES = [item('card', 4905)];
const OTHER_INCOME = [item('wages', 98000), item('gifts', 4000)];
const OTHER_EXPENSES = [item('rent', 45000), item('groceries', 21035), item('phone', 4500)];
const OTHER_ASSETS = [item('spending', 51240), item('saving', 98000), item('investing', 20670), item('cash', 3125)];

const M12_LESSON = {
  id: 'm12',
  title: 'Month-end',
  coreIdea: 'At month-end, close the income and expense pages into Net worth. The income statement shows what the month added. The net-worth statement shows what you own minus what you owe. It must equal the Net worth page.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['budget-vs-actual'],
      text: ['From Module 11: eating out had a budget of $80.00 and actual spending of $104.50. By how much is it over?'],
      answer: 2450,
      explanation: '$104.50 − $80.00 = $24.50 over.',
    },
    {
      id: 'closing', kind: 'explain', title: 'Closing the month', uses: ['closing-entries', 'debit-credit-rules', 'journal-entry'],
      text: [
        'Income and expense pages measure one month. At month-end, close them: move each balance into Net worth (30), so each page starts the next month at zero.',
        'An income page has a credit balance, so it is closed with a debit: debit Wages and credit Net worth. An expense page has a debit balance, so it is closed with a credit: credit each expense and debit Net worth for the total.',
        'These are Sam\'s closing entries for June, from the trial balance in Module 9. Afterward, Net worth has grown by the month\'s income minus its expenses.',
      ],
      prompt: 'Why is Wages debited to close it?',
      promptAnswer: 'Wages has a credit balance. A debit of the same amount brings it to zero and moves the amount into Net worth.',
      journalPage: closingJournal,
      highlightEntry: 0,
      ledger: chartPage('wages', [['2026-06-19', 'Paycheck', 'J3', 0, 121200, true], ['2026-06-30', 'Closing to net worth', 'J6', 121200, 0, true]], { name: 'Sam (example)' }),
      highlightRow: 1,
    },
    {
      id: 'predict-close', kind: 'predict', title: 'Predict: Net worth after closing', uses: ['closing-entries'],
      text: ['Sam\'s two closing entries are posted to the Net worth page. What does it show after the last line?'],
      journalPage: closingJournal,
      ledger: netWorthPage(2),
      highlightRow: 2,
      answer: 75531,
      misconceptions: [{ cents: 226869, explanation: 'Closing the expenses debits Net worth: subtract.' }],
      explanation: '$300.00 + $1,212.00 − $756.69 = $755.31.',
    },
    {
      id: 'income-statement', kind: 'explain', title: 'The income statement', uses: ['income-statement', 'trial-balance'],
      text: [
        'Before closing, the income and expense balances tell the story of the month. The income statement lists them: total income, total expenses, and the difference.',
        'The difference is what the month added to your net worth. If expenses were more than income, it is what the month took from it.',
        'Take the figures from the trial balance, before the closing entries.',
      ],
      prompt: 'Where do the figures on the income statement come from?',
      promptAnswer: 'From the income and expense balances at month-end, before closing: the trial balance lists them.',
      report: incomeStatement('Sam (example)', INCOME, EXPENSES),
    },
    {
      id: 'predict-added', kind: 'predict', title: 'Predict: what the month added', uses: ['income-statement'],
      text: ['This income statement has its totals left blank. How much did the month add to net worth?'],
      report: incomeStatement('Maya (example)', OTHER_INCOME, OTHER_EXPENSES, { ask: ['total-income', 'total-expenses', 'net'] }),
      answer: sum(OTHER_INCOME) - sum(OTHER_EXPENSES),
      misconceptions: [{ cents: sum(OTHER_INCOME) + sum(OTHER_EXPENSES), explanation: 'Expenses are subtracted from income.' }],
      explanation: '$980.00 + $40.00 = $1,020.00 income. $450.00 + $210.35 + $45.00 = $705.35 expenses. $1,020.00 − $705.35 = $314.65.',
    },
    {
      id: 'net-worth-statement', kind: 'explain', title: 'The net-worth statement', uses: ['net-worth-statement', 'accounting-equation', 'closing-entries'],
      text: [
        'The net-worth statement lists, on one date, everything you own and everything you owe. What you own minus what you owe is your net worth.',
        'It must equal the Net worth page after closing. A match is the last check that the month\'s books add up. Like the trial balance, it cannot catch an amount posted to the wrong page.',
        'Sam: $804.36 owned − $49.05 owed = $755.31, the same as the Net worth page.',
      ],
      prompt: 'Why should the net-worth statement agree with the Net worth page after closing?',
      promptAnswer: 'Both show what you own minus what you owe. Closing brought the month\'s income and expenses into the Net worth page, so the two must match.',
      report: netWorthStatement('Sam (example)', JUNE_ASSETS, JUNE_LIABILITIES),
      ledger: netWorthPage(),
      highlightRow: 2,
    },
    {
      id: 'predict-net-worth', kind: 'predict', title: 'Predict: net worth', uses: ['net-worth-statement'],
      text: ['This net-worth statement has its totals left blank. What is the net worth?'],
      report: netWorthStatement('Maya (example)', OTHER_ASSETS, [item('card', 12835)], { ask: ['total-assets', 'total-liabilities', 'net'] }),
      answer: sum(OTHER_ASSETS) - 12835,
      misconceptions: [{ cents: sum(OTHER_ASSETS) + 12835, explanation: 'What you owe is subtracted from what you own.' }],
      explanation: '$512.40 + $980.00 + $206.70 + $31.25 = $1,730.35 owned. $1,730.35 − $128.35 = $1,602.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['closing-entries'],
      text: ['Closing Maya\'s expense pages. Step 1 is done: Rent ($450.00), Groceries ($210.35) and Phone ($45.00) are each credited. Finish Step 2: how much is debited to Net worth?'],
      answer: 70535,
      misconceptions: [{ cents: 45000, explanation: 'One debit to Net worth covers all three expense pages.' }],
      explanation: '$450.00 + $210.35 + $45.00 = $705.35.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['closing-entries', 'income-statement'],
      text: ['Net worth started the month at $600.00. The month\'s income was $1,212.00 and its expenses $940.18. After closing, what does the Net worth page show?'],
      answer: 87182,
      misconceptions: [{ cents: 275218, explanation: 'Closing the expenses debits Net worth: subtract them.' }],
      explanation: '$600.00 + $1,212.00 − $940.18 = $871.82.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['income-statement'],
      text: ['Income: Wages $1,212.00. Expenses: $1,046.75 in all. How much did the month add to net worth?'],
      answer: 16525,
      explanation: '$1,212.00 − $1,046.75 = $165.25.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['net-worth-statement'],
      text: ['A net-worth statement shows assets of $1,450.00 and liabilities of $230.40. What is the net worth?'],
      answer: 121960,
      misconceptions: [{ cents: 168040, explanation: 'Subtract what you owe.' }],
      explanation: '$1,450.00 − $230.40 = $1,219.60.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['closing-entries'],
      text: ['Wages ($1,212.00) and Interest earned ($0.85) are closed in one entry. How much is credited to Net worth?'],
      answer: 121285,
      explanation: '$1,212.00 + $0.85 = $1,212.85.',
    },
  ],
  resources: ['cfpb-budget'],
  recallTemplates: [added, nwStatement].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------


// Fluency drill on the core operation: one debit to Net worth closes the expenses.
const drill = [1, 2, 3].map((n) => num(`m12-drill-${n}`, 'interpreting', { a: { min: 1000, max: 60000, step: 1 }, b: { min: 500, max: 30000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: two expense pages show ${money(p.a)} and ${money(p.b)}. Closing them debits Net worth by how much?`, answer: p.a + p.b,
  explanation: `${money(p.a)} + ${money(p.b)} = ${money(p.a + p.b)}.`,
})));

const bvaMixed = { ...M11_GATE.templates.find((t) => t.part === 'producing'), id: 'm11-bva-from-pages-mixed-m12' };

const M12_PRACTICE = {
  id: 'm12-practice', kind: 'practice', module: 'm12', title: 'Module 12 practice set',
  templates: [...M11_LESSON.recallTemplates, ...M10_LESSON.recallTemplates, ...M08_LESSON.recallTemplates, ...drill, added, nwStatement, nwAfterClose, monthEndFigures, recordClosing, bvaMixed, { ...explainMonthEnd, id: 'm12-explain-practice' }],
};

const M12_EXTRA = {
  id: 'm12-extra', kind: 'practice', module: 'm12', title: 'Module 12 extra practice',
  templates: [added, nwAfterClose, takenFrom, closeIncomeCredit, nwPageAfterClose, expensesFromTb, recordClosing].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M12_REMEDIAL = {
  id: 'm12-remedial', kind: 'practice', module: 'm12', title: 'Module 12: common mistakes',
  templates: [nwStatement, monthEndFigures, recordClosing].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const M12_GATE = {
  id: 'm12', kind: 'gate', title: 'Module 12 check',
  templates: [added, nwStatement, nwAfterClose, takenFrom, closeIncomeCredit, expensesFromTb, drill[0], recordClosing, monthEndFigures, explainMonthEnd],
};

// Questions Checkpoint C draws from this module.
const M12_CHECKPOINT = [added, recordClosing, explainMonthEnd];
};

defs["content/modules/m13.js"] = function (exports, require, define) {
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal, CHART } = require("content/helpers.js");
const { M09_LESSON } = require("content/modules/m09.js");
const { M11_LESSON } = require("content/modules/m11.js");
const { M12_LESSON, M12_GATE } = require("content/modules/m12.js");
define(exports, { M13_LESSON: () => M13_LESSON, M13_PRACTICE: () => M13_PRACTICE, M13_EXTRA: () => M13_EXTRA, M13_REMEDIAL: () => M13_REMEDIAL, M13_GATE: () => M13_GATE });
// Module 13: The emergency fund. Ideas: essential-expenses, fund-sizing,
// fund-rules. The Emergency fund (8) is a named sub-page of the Saving bucket,
// filled by transfers from it. The rule of thumb (the author's, October 25,
// 2026) is at least three months of essential expenses: three months is the
// minimum. Graded items always state the number of months. Amounts are
// illustrative; the guidance figures are cited.






const num = (id, part, params, build) => ({ id, module: 'm13', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const bline = (id, budget) => ({ no: CHART[id].no, name: CHART[id].name, budget });
const sum = (list) => list.reduce((s, x) => s + x, 0);
const MONTHS = 3;
const FUND_SOURCES = ['cfpb-emergency-fund', 'fed-shed-2025-emergency'];

// An Emergency fund page: brought forward, then two transfers in from the
// Saving bucket.
const fundPage = (name, opening, a, b, extra = [], opts = {}) => chartPage('emergency', [
  ['2026-07-01', 'Brought forward', '', opening, 0],
  ['2026-07-10', 'From Saving bucket', 'J7', a, 0, true],
  ['2026-07-24', 'From Saving bucket', 'J8', b, 0, true],
  ...extra,
], { name, ...opts });

// --- Question templates -----------------------------------------------------

// Four needs and two wants, listed in a mixed order.
const essentialTotal = num('m13-essential-total', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 32000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, phone: { min: 3500, max: 6000, step: 500 },
  concert: { min: 3000, max: 9000, step: 500 }, takeout: { min: 1500, max: 6000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const needs = p.rent + p.groceries + p.bus + p.phone;
  return {
    prompt: `${p.name}'s monthly spending: rent ${money(p.rent)}; concert tickets ${money(p.concert)}; groceries ${money(p.groceries)}; a bus pass to get to work ${money(p.bus)}; takeout ${money(p.takeout)}; phone ${money(p.phone)}. What are ${p.name}'s essential expenses for one month?`,
    answer: needs,
    misconceptions: [{ cents: needs + p.concert + p.takeout, explanation: 'Concert tickets and takeout are wants. They could stop for a while if pay stopped, so they are not essential.' }],
    explanation: `Essential: rent ${money(p.rent)} + groceries ${money(p.groceries)} + bus pass ${money(p.bus)} + phone ${money(p.phone)} = ${money(needs)}.`,
  };
});

const minimumFund = num('m13-minimum-fund', 'interpreting', {
  rent: { min: 40000, max: 60000, step: 500 }, groceries: { min: 15000, max: 32000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, utilities: { min: 2500, max: 6000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const month = p.rent + p.groceries + p.bus + p.utilities;
  return {
    prompt: `${p.name}'s essential expenses each month are rent ${money(p.rent)}, groceries ${money(p.groceries)}, a bus pass ${money(p.bus)} and utilities ${money(p.utilities)}. Using the rule of thumb of three months of essential expenses, what is the smallest emergency fund ${p.name} should aim for?`,
    answer: MONTHS * month,
    misconceptions: [{ cents: month, explanation: 'That covers one month. The rule of thumb is at least three months of essential expenses.' }],
    explanation: `One month: ${money(month)}. Three months: 3 × ${money(month)} = ${money(MONTHS * month)}.`,
  };
});

// The page's balance is shown; the essentials are large enough that the
// three-month minimum is always above it.
const stillNeeded = num('m13-still-needed', 'interpreting', {
  opening: { min: 20000, max: 90000, step: 1 }, a: { min: 2500, max: 15000, step: 500 }, b: { min: 2500, max: 15000, step: 500 }, essentials: { min: 70000, max: 98000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const balance = p.opening + p.a + p.b;
  const target = MONTHS * p.essentials;
  return {
    prompt: `${p.name}'s essential expenses are ${money(p.essentials)} a month. How much more does the Emergency fund need to reach the three-month minimum?`,
    ledger: fundPage(p.name, p.opening, p.a, p.b),
    highlightRow: 2,
    answer: target - balance,
    misconceptions: [{ cents: target, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
    explanation: `Minimum: 3 × ${money(p.essentials)} = ${money(target)}. The page shows ${money(balance)}. ${money(target)} − ${money(balance)} = ${money(target - balance)}.`,
  };
});

// Using the fund for an urgent repair: the new balance is asked.
const afterUse = num('m13-after-use', 'interpreting', {
  opening: { min: 60000, max: 150000, step: 1 }, a: { min: 2500, max: 15000, step: 500 }, b: { min: 2500, max: 15000, step: 500 }, repair: { min: 4000, max: 40000, step: 1 }, name: { pick: NAMES },
}, (p) => {
  const before = p.opening + p.a + p.b;
  return {
    prompt: `${p.name}'s bike, which ${p.name} rides to work, needed an urgent repair, paid from the Emergency fund. What does the page show after the last line?`,
    ledger: fundPage(p.name, p.opening, p.a, p.b, [['2026-07-28', 'Bike repair (urgent)', 'J9', 0, p.repair, true]], { askFrom: 3 }),
    highlightRow: 3,
    answer: before - p.repair,
    misconceptions: [{ cents: before + p.repair, explanation: 'Paying from the fund is a credit to its page, so the balance goes down.' }],
    explanation: `${money(before)} − ${money(p.repair)} = ${money(before - p.repair)}.`,
  };
});

// Equal amounts from each paycheck: the amount still needed is built from a
// whole number of cents per paycheck, so it divides exactly.
const perPaycheck = num('m13-per-paycheck', 'interpreting', { per: { min: 3000, max: 12000, step: 1 }, paychecks: { pick: [4, 6, 8, 10] }, name: { pick: NAMES } }, (p) => {
  const needed = p.per * p.paychecks;
  return {
    prompt: `${p.name}'s Emergency fund is ${money(needed)} short of its three-month minimum. ${p.name} will move the same amount from the Saving bucket after each of the next ${p.paychecks} paychecks to close the gap. How much is each transfer?`,
    answer: p.per,
    misconceptions: [{ cents: needed, explanation: 'That is the whole gap. Share it equally across the paychecks.' }],
    explanation: `${money(needed)} ÷ ${p.paychecks} = ${money(p.per)} from each paycheck.`,
  };
});

// Refilling after the fund was used.
const refillAfter = num('m13-refill-after', 'interpreting', { left: { min: 20000, max: 120000, step: 1 }, refill: { min: 2500, max: 12000, step: 500 }, months: { pick: [2, 3, 4, 5] }, name: { pick: NAMES } }, (p) => ({
  prompt: `${p.name} used the Emergency fund in an emergency, and it now holds ${money(p.left)}. Following the rule "refill it first," ${p.name} moves ${money(p.refill)} into it from the Saving bucket each month. What will the page show after ${p.months} months?`,
  answer: p.left + p.refill * p.months,
  misconceptions: [{ cents: p.left + p.refill, explanation: `That is one month's refill. Add ${money(p.refill)} for each of the ${p.months} months.` }],
  explanation: `${money(p.left)} + ${p.months} × ${money(p.refill)} = ${money(p.left + p.refill * p.months)}.`,
}));

const RECORD_ACCOUNTS = accountOptions(['emergency', 'saving', 'spending', 'cash', 'transport', 'phone', 'eating-out']);
const RECORD_EVENTS = {
  refill: (p) => ({
    prompt: `${p.name} moves ${money(p.amount)} from the Saving bucket into the Emergency fund. Record the entry.`,
    answer: [{ account: 'emergency', debit: p.amount, credit: 0 }, { account: 'saving', debit: 0, credit: p.amount }],
    explanation: 'A transfer between your own pages: debit the page that receives (Emergency fund), credit the page that gives (Saving bucket).',
  }),
  repair: (p) => ({
    prompt: `${p.name}'s bike, needed to get to work, breaks down. The urgent repair costs ${money(p.amount)}, paid from the Emergency fund. Record the entry.`,
    answer: [{ account: 'transport', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'The repair is a transportation expense, so debit it. The money came from the Emergency fund, so credit it.',
  }),
  'income-gap': (p) => ({
    prompt: `${p.name}'s hours were cut this month, so the paychecks fell short of the rent. ${p.name} moves ${money(p.amount)} from the Emergency fund to the Spending bucket. Record the entry.`,
    answer: [{ account: 'spending', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'Covering lost income is a transfer: debit the Spending bucket, which receives it, and credit the Emergency fund, which gives it.',
  }),
  phone: (p) => ({
    prompt: `${p.name}'s phone, needed for work shifts, stops working. A replacement costs ${money(p.amount)}, paid from the Emergency fund. Record the entry.`,
    answer: [{ account: 'phone', debit: p.amount, credit: 0 }, { account: 'emergency', debit: 0, credit: p.amount }],
    explanation: 'The replacement is a phone expense, so debit it. Credit the Emergency fund, which paid for it.',
  }),
};
const recordFund = {
  id: 'm13-record-fund', module: 'm13', kind: 'entry', part: 'producing', points: 4,
  params: { amount: { min: 4000, max: 40000, step: 1 }, name: { pick: NAMES }, event: { byVersion: Object.keys(RECORD_EVENTS) } },
  build: (p) => ({ accounts: RECORD_ACCOUNTS, ...RECORD_EVENTS[p.event](p) }),
};

// Production: a fund plan from a month's spending. The fund's balance is
// chosen so the gap divides exactly into the months given.
const fundPlan = {
  id: 'm13-fund-plan', module: 'm13', kind: 'amounts', part: 'producing', points: 4,
  params: {
    rent: { min: 40000, max: 55000, step: 500 }, groceries: { min: 18000, max: 30000, step: 1 }, bus: { min: 4000, max: 6400, step: 100 }, phone: { min: 3500, max: 6000, step: 500 },
    fun: { min: 2000, max: 6000, step: 500 }, per: { min: 5000, max: 15000, step: 1 }, months: { pick: [6, 8, 10, 12] }, name: { pick: NAMES },
  },
  build: (p) => {
    const month = p.rent + p.groceries + p.bus + p.phone;
    const target = MONTHS * month;
    const balance = target - p.per * p.months;
    return {
      prompt: `${p.name}'s month: rent ${money(p.rent)}, groceries ${money(p.groceries)}, a bus pass to work ${money(p.bus)}, phone ${money(p.phone)} and fun ${money(p.fun)}. The Emergency fund holds ${money(balance)}. ${p.name} wants to reach the three-month minimum in ${p.months} months, moving the same amount each month. Work out the plan.`,
      fields: [['Essential expenses for one month', month], ['The three-month minimum', target], ['Still needed', target - balance], ['To move into the fund each month', p.per]]
        .map(([label, answer]) => ({ label, answer })),
      explanation: `Essentials (fun is a want): ${money(p.rent)} + ${money(p.groceries)} + ${money(p.bus)} + ${money(p.phone)} = ${money(month)}. Minimum: 3 × ${money(month)} = ${money(target)}. Still needed: ${money(target)} − ${money(balance)} = ${money(target - balance)}. Each month: ${money(target - balance)} ÷ ${p.months} = ${money(p.per)}.`,
    };
  },
};

const explainFund = explainTemplate({
  id: 'm13-explain', module: 'm13',
  variants: [
    { prompt: 'In one or two sentences: why is an emergency fund sized from essential expenses, not from all your spending?',
      modelAnswer: 'In an emergency, such as losing your pay, you can stop the wants for a while. The fund only has to keep paying for what you cannot stop: a place to live, food and a way to get to work.',
      rubric: ['Says wants can stop for a while in an emergency', 'Says the fund must cover what cannot stop (the essentials)'] },
    { prompt: 'In one or two sentences: why is three months of essential expenses called a minimum?',
      modelAnswer: 'Three months gives time to find new work or recover from a big bill. A longer emergency needs more, so more is safer.',
      rubric: ['Says three months gives time to recover (find work, pay a big bill)', 'Says more is safer, because an emergency can last longer'] },
    { prompt: 'In one or two sentences: why should the emergency fund not pay for a planned cost, such as a yearly insurance bill?',
      modelAnswer: 'A planned cost is known in advance, so it can be saved for separately. Using the fund for it leaves less for a real emergency.',
      rubric: ['Says a planned cost is known in advance (save for it separately)', 'Says using the fund for it leaves less for a real emergency'] },
    { prompt: 'In one or two sentences: why refill the emergency fund first after using it?',
      modelAnswer: 'Until it is refilled, the next emergency finds less money waiting. Refilling first puts the safety back before other goals.',
      rubric: ['Says a used fund leaves less for the next emergency', 'Says refilling first restores the safety before other goals'] },
  ],
});

// --- Lesson -------------------------------------------------------------------

// Luis's July: five needs and two wants; the fund grows by transfers.
const LUIS_PLAN = [bline('rent', 45000), bline('groceries', 26000), bline('transport', 6400), bline('phone', 4500), bline('utilities', 4000), bline('eating-out', 6000), bline('fun', 4000)];
const LUIS_ESSENTIALS = 45000 + 26000 + 6400 + 4500 + 4000; // $859.00
const luisFund = (extra = [], opts = {}) => fundPage('Luis (example)', 90000, 7500, 7500, extra, opts);
const LUIS_FUND = 90000 + 7500 + 7500; // $1,050.00
const fundJournal = journal([
  ['2026-08-03', 'J9', 'Urgent bike repair, paid from the Emergency fund', [['transport', 8500, 0, true], ['emergency', 0, 8500, true]]],
  ['2026-08-07', 'J10', 'Refill the Emergency fund first', [['emergency', 8500, 0, true], ['saving', 0, 8500, true]]],
], { sheetNo: 9, name: 'Luis (example)' });
const LUIS_AFTER = [['2026-08-03', 'Bike repair (urgent)', 'J9', 0, 8500, true], ['2026-08-07', 'Refill from Saving bucket', 'J10', 8500, 0, true]];

const M13_LESSON = {
  id: 'm13',
  title: 'The emergency fund',
  coreIdea: 'An emergency fund pays for the unplanned things you cannot put off. Size it from your essential expenses: at least three months of them. Use it only for emergencies, and refill it first.',
  steps: [
    {
      id: 'warm-up', kind: 'predict', title: 'Warm-up', uses: ['net-worth-statement'],
      text: ['From Module 12: a net-worth statement shows assets of $1,620.00 and liabilities of $95.40. What is the net worth?'],
      answer: 152460,
      misconceptions: [{ cents: 171540, explanation: 'What you owe is subtracted from what you own.' }],
      explanation: '$1,620.00 − $95.40 = $1,524.60.',
    },
    {
      id: 'essentials', kind: 'explain', title: 'Essential expenses', uses: ['essential-expenses', 'budget-as-ledger'],
      text: [
        'An emergency is something unplanned that you cannot put off: losing your job or hours, a medical bill, an urgent repair to the car or bike you need for work.',
        'Essential expenses are the ones you would still have to pay if your pay stopped: a place to live, food, getting to work, the phone you need to find shifts, utilities. Wants such as eating out and fun could stop for a while.',
        'Taxes withheld are not on the list. With no pay, nothing is withheld.',
        'Here is Luis\'s budget for July. Five of its lines are essential.',
      ],
      prompt: 'Why are eating out and fun left off the list of essential expenses?',
      promptAnswer: 'They are wants. If Luis\'s pay stopped, he could stop them for a while; the essentials he would still have to pay.',
      report: { report: 'budget', name: 'Luis (example)', period: 'July 2026', lines: LUIS_PLAN },
    },
    {
      id: 'predict-essentials', kind: 'predict', title: 'Predict: one month of essentials', uses: ['essential-expenses'],
      text: ['From Luis\'s budget (its total is left blank): what are his essential expenses for one month?'],
      report: { report: 'budget', name: 'Luis (example)', period: 'July 2026', lines: LUIS_PLAN, ask: ['total'] },
      answer: LUIS_ESSENTIALS,
      misconceptions: [{ cents: LUIS_ESSENTIALS + 10000, explanation: 'Eating out and fun are wants. Add the five essential lines only.' }],
      explanation: '$450.00 + $260.00 + $64.00 + $45.00 + $40.00 = $859.00.',
    },
    {
      id: 'sizing', kind: 'explain', title: 'How big a fund?', uses: ['fund-sizing', 'essential-expenses'],
      text: [
        'This course uses a rule of thumb: an emergency fund should hold at least three months of essential expenses. Three months is the minimum; more is safer, because an emergency can last longer than you expect.',
        'There is no official figure. The Consumer Financial Protection Bureau says the right amount depends on your situation. It also says that even a small amount gives some security, so start with a first goal and build from there. In a 2025 Federal Reserve survey, 55% of adults said they had three months of emergency savings.',
        'Luis: 3 × $859.00 = $2,577.00. That is his minimum.',
      ],
      prompt: 'Why is the fund sized from essential expenses rather than from everything you spend?',
      promptAnswer: 'In an emergency you can stop the wants for a while. The fund only has to keep paying what cannot stop.',
      sources: FUND_SOURCES,
    },
    {
      id: 'predict-minimum', kind: 'predict', title: 'Predict: the minimum', uses: ['fund-sizing'],
      text: ['Maya\'s essential expenses come to $912.40 a month. What is her three-month minimum?'],
      answer: 273720,
      misconceptions: [{ cents: 91240, explanation: 'That is one month. Multiply by three.' }],
      explanation: '3 × $912.40 = $2,737.20.',
    },
    {
      id: 'fund-page', kind: 'explain', title: 'The Emergency fund page', uses: ['fund-sizing', 'transfers', 'account-numbers'],
      text: [
        'Keep the fund on its own page: Emergency fund, account 8, an asset. It is a named part of your Saving bucket, so money reaches it by a transfer: debit Emergency fund, credit Saving bucket.',
        'Luis moves $75.00 into it after each paycheck. On its own page, the fund never gets mixed up with money saved for other things.',
      ],
      prompt: 'Why does moving money into the Emergency fund leave Luis\'s net worth unchanged?',
      promptAnswer: 'It is a transfer between his own pages: the Emergency fund goes up and the Saving bucket goes down by the same amount. Nothing is spent.',
      ledger: luisFund(),
      highlightRow: 1,
    },
    {
      id: 'predict-needed', kind: 'predict', title: 'Predict: still needed', uses: ['fund-sizing'],
      text: ['Luis\'s minimum is $2,577.00. How much more does his Emergency fund need?'],
      ledger: luisFund(),
      highlightRow: 2,
      answer: MONTHS * LUIS_ESSENTIALS - LUIS_FUND,
      misconceptions: [{ cents: MONTHS * LUIS_ESSENTIALS, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
      explanation: '$2,577.00 − $1,050.00 = $1,527.00.',
    },
    {
      id: 'rules', kind: 'explain', title: 'Rules for using and refilling it', uses: ['fund-rules', 'recording-purchases', 'transfers', 'journal-entry'],
      text: [
        'Write your rules down before you need them. This course suggests three:',
        '1. Use it only for an emergency: something unplanned that cannot wait, such as lost pay, a medical bill or an urgent repair.',
        '2. Not for planned costs or wants: a yearly bill you know is coming gets its own savings (Module 14). A sale or a concert is never an emergency.',
        '3. Refill it first. After you use it, money from the Saving bucket goes back into the fund until it reaches its target again.',
        'Paying from the fund works like any purchase: debit the expense, credit the Emergency fund. Refilling is a transfer.',
      ],
      prompt: 'Why refill the fund before saving for anything else?',
      promptAnswer: 'Until it is refilled, the next emergency finds less money waiting. Refilling first puts the safety back.',
      journalPage: fundJournal,
      highlightEntry: 0,
      ledger: luisFund(LUIS_AFTER),
      highlightRow: 3,
      source: 'cfpb-emergency-fund',
    },
    {
      id: 'predict-use', kind: 'predict', title: 'Predict: covering lost pay', uses: ['fund-rules', 'transfers'],
      text: ['In August, Luis\'s hours are cut, so he moves $230.00 from the Emergency fund to the Spending bucket to pay the rent. What does the fund page show after the last line?'],
      ledger: luisFund([...LUIS_AFTER, ['2026-08-21', 'To Spending bucket (hours cut)', 'J11', 0, 23000, true]], { askFrom: 5 }),
      highlightRow: 5,
      answer: LUIS_FUND - 23000,
      misconceptions: [{ cents: LUIS_FUND + 23000, explanation: 'Money leaving the fund is a credit to its page, so the balance goes down.' }],
      explanation: '$1,050.00 − $230.00 = $820.00.',
    },
    {
      id: 'guided', kind: 'predict', title: 'Finish the worked steps', uses: ['fund-rules'],
      text: ['Luis refills his fund first: $75.00 from each of his two paychecks a month. The fund holds $820.00. Step 1 is done: that is $150.00 a month. Finish Step 2: what will the page show after two months?'],
      answer: 82000 + 2 * 15000,
      misconceptions: [{ cents: 82000 + 15000, explanation: 'That is one month. Add $150.00 for each of the two months.' }],
      explanation: '$820.00 + 2 × $150.00 = $1,120.00.',
    },
    {
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['fund-sizing'],
      text: ['Ana\'s essential expenses are $780.00 a month, and her Emergency fund holds $1,150.00. How much more does she need for the three-month minimum?'],
      answer: 3 * 78000 - 115000,
      misconceptions: [{ cents: 3 * 78000, explanation: 'That is the whole minimum. Subtract what the fund already holds.' }],
      explanation: '3 × $780.00 = $2,340.00. $2,340.00 − $1,150.00 = $1,190.00.',
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check 1 of 3', uses: ['essential-expenses'],
      text: ['A month\'s spending: rent $500.00; groceries $240.00; concert tickets $75.00; a bus pass to work $64.00; takeout $30.00; phone $50.00. What are the essential expenses?'],
      answer: 50000 + 24000 + 6400 + 5000,
      misconceptions: [{ cents: 50000 + 24000 + 6400 + 5000 + 7500 + 3000, explanation: 'Concert tickets and takeout are wants.' }],
      explanation: '$500.00 + $240.00 + $64.00 + $50.00 = $854.00.',
    },
    {
      id: 'exit-check-2', kind: 'predict', title: 'Exit check 2 of 3', uses: ['fund-sizing'],
      text: ['Essential expenses are $905.25 a month. What is the three-month minimum for the emergency fund?'],
      answer: 3 * 90525,
      misconceptions: [{ cents: 90525, explanation: 'Multiply by three.' }],
      explanation: '3 × $905.25 = $2,715.75.',
    },
    {
      id: 'exit-check-3', kind: 'predict', title: 'Exit check 3 of 3', uses: ['fund-rules'],
      text: ['The Emergency fund holds $1,400.00. An urgent $260.00 repair is paid from it. What does the page show now?'],
      answer: 140000 - 26000,
      misconceptions: [{ cents: 140000 + 26000, explanation: 'Paying from the fund lowers its balance.' }],
      explanation: '$1,400.00 − $260.00 = $1,140.00.',
    },
  ],
  resources: ['cfpb-emergency-fund', 'cfpb-start-small'],
  recallTemplates: [essentialTotal, minimumFund].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

// Fluency drill on the core operation: three months of essential expenses.
const drill = [1, 2, 3].map((n) => num(`m13-drill-${n}`, 'interpreting', { month: { min: 50000, max: 120000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: essential expenses are ${money(p.month)} a month. What is the three-month minimum?`, answer: MONTHS * p.month,
  explanation: `3 × ${money(p.month)} = ${money(MONTHS * p.month)}.`,
})));

const closingMixed = { ...M12_GATE.templates.find((t) => t.part === 'producing'), id: 'm12-record-closing-mixed-m13' };

const M13_PRACTICE = {
  id: 'm13-practice', kind: 'practice', module: 'm13', title: 'Module 13 practice set',
  templates: [...M12_LESSON.recallTemplates, ...M11_LESSON.recallTemplates, ...M09_LESSON.recallTemplates, ...drill, essentialTotal, minimumFund, stillNeeded, fundPlan, recordFund, closingMixed, { ...explainFund, id: 'm13-explain-practice' }],
};

const M13_EXTRA = {
  id: 'm13-extra', kind: 'practice', module: 'm13', title: 'Module 13 extra practice',
  templates: [essentialTotal, stillNeeded, afterUse, perPaycheck, refillAfter, fundPlan, recordFund].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M13_REMEDIAL = {
  id: 'm13-remedial', kind: 'practice', module: 'm13', title: 'Module 13: common mistakes',
  templates: [essentialTotal, minimumFund, recordFund].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const M13_GATE = {
  id: 'm13', kind: 'gate', title: 'Module 13 check',
  templates: [essentialTotal, minimumFund, stillNeeded, afterUse, perPaycheck, refillAfter, drill[0], recordFund, fundPlan, explainFund],
};
};

defs["content/modules/m14.js"] = function (exports, require, define) {
const { percentOf } = require("js/money.js");
const { money, NAMES, explainTemplate, accountOptions, chartPage, journal } = require("content/helpers.js");
const { RATES_2026 } = require("content/rates2026.js");
const { M10_LESSON } = require("content/modules/m10.js");
const { M12_LESSON } = require("content/modules/m12.js");
const { M13_LESSON, M13_GATE } = require("content/modules/m13.js");
define(exports, { M14_LESSON: () => M14_LESSON, M14_PRACTICE: () => M14_PRACTICE, M14_EXTRA: () => M14_EXTRA, M14_REMEDIAL: () => M14_REMEDIAL, M14_GATE: () => M14_GATE });
// Module 14: Planning ahead. Ideas: buying-power, compound-interest,
// sinking-funds. Rates are the real 2026 figures (content/rates2026.js):
// inflation 3.7% (BLS, 12 months to September 2026), average savings 0.38% and
// 12-month CD 1.76% (FDIC, October 2026). Interest is worked out once a year
// on a 12-month CD that is renewed, and rounded by the thousandths rule. The
// Sinking fund (9) is a named sub-page of the Saving bucket. Everyday amounts
// are illustrative.








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

const M14_LESSON = {
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

const M14_PRACTICE = {
  id: 'm14-practice', kind: 'practice', module: 'm14', title: 'Module 14 practice set',
  templates: [...M13_LESSON.recallTemplates, ...M12_LESSON.recallTemplates, ...M10_LESSON.recallTemplates, ...drill, priceRise, secondYear, sinkingMonthly, growthTable, recordPlan, fundMixed, { ...explainPlanning, id: 'm14-explain-practice' }],
};

const M14_EXTRA = {
  id: 'm14-extra', kind: 'practice', module: 'm14', title: 'Module 14 extra practice',
  templates: [priceRise, cashShort, savingShort, cdBalance, sinkingLeft, growthTable, recordPlan].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

const M14_REMEDIAL = {
  id: 'm14-remedial', kind: 'practice', module: 'm14', title: 'Module 14: common mistakes',
  templates: [priceRise, secondYear, recordPlan].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why).
const M14_GATE = {
  id: 'm14', kind: 'gate', title: 'Module 14 check',
  templates: [priceRise, cashShort, savingShort, secondYear, cdBalance, sinkingMonthly, drill[0], recordPlan, growthTable, explainPlanning],
};
};

defs["content/modules/m15.js"] = function (exports, require, define) {
const { money, chartPage, PAYCHECK_SOURCES } = require("content/helpers.js");
const S = require("content/sampleMonth.js");
define(exports, { M15_FIGURES: () => M15_FIGURES, M15_LESSON: () => M15_LESSON });
// Module 15: Final project I: plan your month. No new ideas: the learner
// opens a month's books and plans it, using their own month or the sample
// month (content/sampleMonth.js), where every figure below comes from. There
// is no module check: the last step is the project checklist and rubric.




const [PAY1, PAY2] = S.PAYCHECKS;
const SPENDING_IN = PAY1.split.spending + PAY2.split.spending;
const OPENING_SPENDING = S.OPENING.find(([id]) => id === 'spending')[1];
const OPENING_FUND = S.OPENING.find(([id]) => id === 'emergency')[1];
const CARD_DUE = S.OPENING.find(([id]) => id === 'card')[1];
const UNPLANNED = OPENING_SPENDING + SPENDING_IN - S.BUDGET_TOTAL - CARD_DUE;
const FUND_GAP = S.FUND_MINIMUM - (OPENING_FUND + 2 * S.TO_EMERGENCY);
const deductions = (p) => p.gross - p.net;

// The project's figures come from the learner's own plan and are printed
// nowhere in the course, so they can only be got by doing the work.
const opening = (id) => S.OPENING.find(([x]) => x === id)[1];
const share = (bucket) => PAY1.split[bucket] + PAY2.split[bucket];
const M15_FIGURES = [
  ['Total take-home pay for the month (both paychecks)', PAY1.pay.net + PAY2.pay.net],
  ['Investing bucket at month-end', opening('investing') + share('investing')],
  ['Saving bucket after both paychecks and the planned transfers out of it', opening('saving') + share('saving') - 2 * S.TO_EMERGENCY - S.TO_SINKING],
  ['Charity bucket after both paychecks, before any donation', opening('charity') + share('charity')],
].map(([label, answer]) => ({ label, answer }));

const M15_LESSON = {
  id: 'm15',
  title: 'Final project I: plan your month',
  project: true,
  next: { id: 'm16', title: 'Final project II' },
  coreIdea: 'The final project is one full month of books. In this part, you open the books and plan the month: what you own and what you owe at the start, the pay you expect, the budget, and what goes to your emergency and sinking funds.',
  steps: [
    {
      id: 'project', kind: 'explain', title: 'The final project', uses: ['ledger-columns', 'personal-accounts'],
      text: [
        'You will keep one full month of books from start to finish. In this module you open the books and plan the month. In Module 16 you record it, prove it, match it to the bank and report it.',
        'Choose your month. You can use a real month of your own or the sample month. The sample month belongs to Riley, 19, who works part-time at a restaurant in Arizona. Riley is fictional. Choose the sample month if you would rather keep your own money private, or if you have no income yet.',
        'Work on paper (print blank sheets below) or in a spreadsheet. You may use a calculator. There is no module check. At the end, a checklist and a rubric show what a finished plan includes. If you use the sample month, you also enter a few of its figures, and they must be right.',
        'Riley\'s sample month is the worked example in every step. Work each step yourself first, then compare.',
      ],
      prompt: 'Why keep a whole month, from opening balances to the final reports?',
      promptAnswer: 'Each part checks the others. A whole month lets you follow every dollar from where it started to where it ended up.',
      printLinks: ['blank', 'journal', 'sample-month'],
    },
    {
      id: 'open', kind: 'explain', title: 'Open the books', uses: ['personal-accounts', 'account-numbers', 'carry-forward'],
      text: [
        'Open a ledger page for every account you will use this month, numbered from the chart of accounts. Each page starts with its balance brought forward from the end of last month. Income and expense pages start at zero, because last month was closed.',
        'Riley\'s pages at the bank: Checking (1), the Spending (2), Saving (3), Investing (4) and Charity (5) buckets, Blow money (6), and the Emergency fund (8) and Sinking fund (9). Riley also has Cash (7) and owes on a Credit card (21).',
        'Then write a net-worth statement for the start of the month. The Net worth page (30) opens with that result.',
      ],
      prompt: 'Why do income and expense pages start the month at zero?',
      promptAnswer: 'Last month was closed. Their balances moved into Net worth, so each page starts the new month empty.',
      ledger: chartPage('spending', [['2026-07-01', 'Brought forward', '', OPENING_SPENDING, 0]], { name: S.PERSON }),
      highlightRow: 0,
    },
    {
      id: 'predict-opening', kind: 'predict', title: 'Check: net worth at the start', uses: ['net-worth-statement'],
      text: ['Riley\'s net-worth statement for June 30 has its totals left blank. What is Riley\'s net worth at the start of July?'],
      report: S.openingNetWorthStatement({ ask: ['total-assets', 'total-liabilities', 'net'] }),
      answer: S.OPENING_NET_WORTH,
      misconceptions: [{ cents: S.OPENING_NET_WORTH + 2 * CARD_DUE, explanation: 'Riley owes the credit card balance. Subtract it.' }],
      explanation: `Assets ${money(S.OPENING_NET_WORTH + CARD_DUE)} − the card ${money(CARD_DUE)} = ${money(S.OPENING_NET_WORTH)}.`,
    },
    {
      id: 'paychecks', kind: 'explain', title: 'The pay you expect', uses: ['gross-vs-net', 'recording-paycheck', 'five-buckets', 'transfers'],
      text: [
        `Riley is paid every two weeks at the Arizona minimum wage of $15.15 an hour. July has two paydays: July 10 for ${PAY1.hours} hours and July 24 for ${PAY2.hours} hours.`,
        'Each paycheck takes two entries. First, record the pay: debit Checking for the take-home pay, debit Taxes withheld, and credit Wages for the gross pay. Then record the split: debit each bucket its share and credit Checking.',
        'Riley uses the course\'s split: Saving 15%, Investing 10%, Charity 5%, Blow money 10%, and the Spending bucket gets what is left.',
      ],
      prompt: 'Why is Wages credited with the gross pay, not the take-home pay?',
      promptAnswer: 'Riley earned the gross pay. The taxes came out of it, so they are recorded as an expense, and the take-home pay goes to Checking.',
      sourceDoc: S.payStubs()[0],
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-pay', kind: 'predict', title: 'Check: the second paycheck', uses: ['gross-vs-net', 'paycheck-deductions'],
      text: [`Riley's July 24 pay stub is beside this step, with its last line left blank. What is the take-home pay?`],
      sourceDoc: { ...S.payStubs()[1], lines: S.payStubs()[1].lines.filter(([label]) => label !== 'Take-home pay') },
      answer: PAY2.pay.net,
      misconceptions: [{ cents: PAY2.pay.gross, explanation: 'That is the gross pay. Take out Social Security, Medicare and both income taxes.' }],
      explanation: `Gross pay is ${money(PAY2.pay.gross)}. Social Security takes ${money(PAY2.pay.socialSecurity)}, Medicare ${money(PAY2.pay.medicare)}, federal tax ${money(PAY2.pay.federal)} and Arizona tax ${money(PAY2.pay.arizona)}: ${money(deductions(PAY2.pay))} in all. Take-home pay is ${money(PAY2.pay.net)}.`,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'predict-split', kind: 'predict', title: 'Check: the Spending bucket\'s share', uses: ['five-buckets', 'percentages'],
      text: [`The July 10 paycheck brings home ${money(PAY1.pay.net)}. How much of it goes to the Spending bucket?`],
      answer: PAY1.split.spending,
      misconceptions: [{ cents: PAY1.pay.net - PAY1.split.saving, explanation: 'Take out all four shares, not just Saving. The four are Saving, Investing, Charity and Blow money.' }],
      explanation: `Saving ${money(PAY1.split.saving)} + Investing ${money(PAY1.split.investing)} + Charity ${money(PAY1.split.charity)} + Blow money ${money(PAY1.split.blow)} = ${money(PAY1.pay.net - PAY1.split.spending)}. ${money(PAY1.pay.net)} − ${money(PAY1.pay.net - PAY1.split.spending)} = ${money(PAY1.split.spending)}.`,
    },
    {
      id: 'budget', kind: 'explain', title: 'The budget', uses: ['budget-as-ledger', 'spending-rules', 'essential-expenses'],
      text: [
        'Plan the month\'s spending before it happens, needs first. Riley\'s budget covers rent, groceries, the bus pass, the phone, utilities and household supplies, then a little for eating out. Movies and other fun come from Blow money, and donations from the Charity bucket.',
        `Riley also owes ${money(CARD_DUE)} on the credit card from June. Paying it is planned too, but it is not an expense this month, because that spending was recorded in June.`,
        `The budget must fit what the Spending bucket will hold: ${money(OPENING_SPENDING)} brought forward, plus its share of both paychecks.`,
      ],
      prompt: 'Why plan the needs first?',
      promptAnswer: 'Needs must be paid so you can live and work. Planning them first makes sure the money is there before any wants.',
      report: S.budgetPlan(),
    },
    {
      id: 'predict-left', kind: 'predict', title: 'Check: what is not planned yet', uses: ['budget-as-ledger'],
      text: [`The Spending bucket starts July with ${money(OPENING_SPENDING)} and gets ${money(PAY1.split.spending)} and ${money(PAY2.split.spending)} from the two paychecks. After the budget and the ${money(CARD_DUE)} card payment, how much is not planned yet?`],
      report: S.budgetPlan(),
      answer: UNPLANNED,
      misconceptions: [{ cents: UNPLANNED + CARD_DUE, explanation: 'The card payment comes out of the Spending bucket too.' }],
      explanation: `${money(OPENING_SPENDING)} + ${money(PAY1.split.spending)} + ${money(PAY2.split.spending)} = ${money(OPENING_SPENDING + SPENDING_IN)}. Subtracting the budget ${money(S.BUDGET_TOTAL)} and the card ${money(CARD_DUE)} leaves ${money(UNPLANNED)}.`,
    },
    {
      id: 'funds', kind: 'explain', title: 'The emergency and sinking funds', uses: ['fund-sizing', 'fund-rules', 'sinking-funds'],
      text: [
        `Riley's essential expenses are the needs in the budget: ${money(S.ESSENTIAL_MONTH)} a month. The three-month minimum is 3 × ${money(S.ESSENTIAL_MONTH)} = ${money(S.FUND_MINIMUM)}, and the Emergency fund holds ${money(OPENING_FUND)}.`,
        `Riley's plan is to move ${money(S.TO_EMERGENCY)} from the Saving bucket into the Emergency fund after each paycheck, until the fund reaches the minimum.`,
        `The Sinking fund already holds ${money(opening('sinking'))}, saved toward a new phone. Riley adds a second goal: renter's insurance costs $180.00 a year and is due in 12 months, so ${money(S.TO_SINKING)} a month goes into the Sinking fund.`,
      ],
      prompt: 'Why does the plan move money into the Emergency fund every paycheck, even though the fund is far from the minimum?',
      promptAnswer: 'Small regular transfers build the fund steadily, and even part of the minimum gives some security.',
    },
    {
      id: 'predict-gap', kind: 'predict', title: 'Check: the fund at month-end', uses: ['fund-sizing'],
      text: [`After this month's two transfers of ${money(S.TO_EMERGENCY)}, how far below its three-month minimum will Riley's Emergency fund still be?`],
      answer: FUND_GAP,
      misconceptions: [{ cents: S.FUND_MINIMUM - OPENING_FUND, explanation: 'First add both of this month\'s transfers to the fund.' }],
      explanation: `${money(OPENING_FUND)} + 2 × ${money(S.TO_EMERGENCY)} = ${money(OPENING_FUND + 2 * S.TO_EMERGENCY)}. ${money(S.FUND_MINIMUM)} − ${money(OPENING_FUND + 2 * S.TO_EMERGENCY)} = ${money(FUND_GAP)}.`,
    },
    {
      id: 'project-check', kind: 'project', title: 'Finish Final project I', uses: [],
      text: ['Check your plan against the list below. When every item is ticked, mark this part complete. Then Module 16 opens, and you will keep the month you planned.'],
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
};

defs["content/modules/m16.js"] = function (exports, require, define) {
const { money } = require("content/helpers.js");
const { reportRows } = require("js/reports.js");
const S = require("content/sampleMonth.js");
define(exports, { M16_FIGURES: () => M16_FIGURES, M16_LESSON: () => M16_LESSON });
// Module 16: Final project II: keep, prove, reconcile and report. No new
// ideas: the learner records the month planned in Module 15, proves it with a
// trial balance, matches it to the bank, compares it with the budget, closes
// it and writes the two statements. Every figure comes from the sample month
// (content/sampleMonth.js). There is no module check: the last step is the
// project checklist and rubric.





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
const M16_FIGURES = [
  ['Spending bucket just after the rent check (July 15)', S.balanceAfter('spending', '2026-07-15', 'Rent share, check 215')],
  ['Credit card balance just after the household supplies (July 14)', S.balanceAfter('card', '2026-07-14', 'Household supplies, credit card')],
  ['Total of the Spending bucket\'s Credits column for the month, before the bank items', spendingCredits],
  ['Blow money just after the movie (July 22)', S.balanceAfter('blow', '2026-07-22', 'Movie, debit card, from Blow money')],
].map(([label, answer]) => ({ label, answer }));

const M16_LESSON = {
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
};

defs["content/modules/prereq.js"] = function (exports, require, define) {
define(exports, { PREREQ_LESSON: () => PREREQ_LESSON });
// The remedial unit for the prerequisite check: the money arithmetic the
// course uses everywhere. Amounts are illustrative.

const PREREQ_LESSON = {
  id: 'prereq',
  position: 'prereq',
  checkId: 'prereq',
  practiceId: null,
  title: 'Before you start: money arithmetic',
  coreIdea: 'Money is written in dollars and cents. Every amount in this course is worked out to the cent.',
  steps: [
    {
      id: 'cents', kind: 'explain', title: 'Dollars and cents', uses: ['decimals'],
      text: [
        'An amount like $12.07 means 12 dollars and 7 cents. The two digits after the point are cents. A cent is one hundredth of a dollar.',
        'Always write two digits after the point. Seven cents is .07, not .7. Also, $5 is the same as $5.00.',
      ],
    },
    {
      id: 'predict-cents', kind: 'predict', title: 'Try it', uses: ['decimals'],
      text: ['You have $3.50. Then you find 25 cents. Write how much you have now.'],
      answer: 375,
      misconceptions: [{ cents: 2850, explanation: '25 cents is $0.25, not $25.00. Add it to the cents: 50 + 25 = 75 cents.' }],
      explanation: '$3.50 + $0.25 = $3.75.',
    },
    {
      id: 'adding', kind: 'explain', title: 'Adding and taking away money', uses: ['adding-money', 'decimals'],
      text: [
        'To add or subtract money, line the amounts up by the point. Dollars sit over dollars, and cents sit over cents.',
        'Example: $48.26 + $12.99. Cents: 26 + 99 = 125 cents, which is $1.25. Dollars: 48 + 12 = 60. Total: $61.25.',
        'Taking away works the same way: $20.00 − $13.47 = $6.53. That is your change when you pay $13.47 with a twenty-dollar bill.',
      ],
      prompt: 'Why do the points need to line up?',
      promptAnswer: 'So that dollars are added to dollars and cents to cents. If the points do not line up, a cent can be added as if it were a dollar.',
    },
    {
      id: 'predict-change', kind: 'predict', title: 'Your change', uses: ['adding-money', 'decimals'],
      text: ['A meal costs $8.65. You pay with a $10 bill. How much change do you get?'],
      answer: 135,
      misconceptions: [{ cents: 235, explanation: 'You need to borrow a dollar for the cents. Line up the points: $10.00 − $8.65. Take 65 cents from 100 cents to get 35 cents. Then take 8 dollars from the 9 dollars left to get 1 dollar.' }],
      explanation: '$10.00 − $8.65 = $1.35.',
    },
    {
      id: 'percent', kind: 'explain', title: 'Percentages', uses: ['percentages', 'decimals'],
      text: [
        'Percent means "out of 100". 10% of an amount is one tenth of it. To find it, move the point one place left. 10% of $250.00 is $25.00.',
        '1% is one hundredth. To find it, move the point two places left. 1% of $250.00 is $2.50. 5% is half of 10%. 15% is 10% plus 5%.',
        'To find 15% of $250.00, work in steps. 10% is $25.00. 5% is $12.50. So 15% is $37.50.',
      ],
      prompt: 'How would you find 5% of an amount using 10%?',
      promptAnswer: 'Find 10% by moving the point one place left, then take half of it. 5% is half of 10%.',
    },
    {
      id: 'predict-percent', kind: 'predict', title: 'Find 15%', uses: ['percentages', 'decimals'],
      text: ['What is 15% of $80.00?'],
      answer: 1200,
      misconceptions: [{ cents: 120, explanation: 'That is 1.5%. 10% of $80.00 is $8.00. 5% is $4.00. So 15% is $12.00.' }],
      explanation: '10% is $8.00. 5% is $4.00. So 15% is $12.00.',
    },
    {
      id: 'decimal-percent', kind: 'explain', title: 'Any percentage', uses: ['percentages', 'decimals'],
      text: [
        'Some percentages are not tens and fives, like 6.2% or 1.45%. For these, write the percent as a decimal by moving the point two places left: 6.2% is 0.062 and 1.45% is 0.0145.',
        'Then multiply: 0.062 × $1,212.00 = $75.144. A calculator is fine for this. Next you will see how to round an answer like $75.144 to the cent.',
      ],
      prompt: 'How would you write 7.5% as a decimal?',
      promptAnswer: 'Move the point two places left: 7.5% is 0.075.',
    },
    {
      id: 'predict-decimal-percent', kind: 'predict', title: 'Try it', uses: ['percentages', 'decimals'],
      text: ['What is 1.45% of $1,000.00?'],
      answer: 1450,
      misconceptions: [{ cents: 14500, explanation: 'That is 14.5%. 1.45% is 0.0145 as a decimal.' }],
      explanation: '1.45% is 0.0145, and 0.0145 × $1,000.00 = $14.50.',
    },
    {
      id: 'rounding', kind: 'explain', title: 'Rounding to the cent', uses: ['percentages', 'decimals'],
      text: [
        'Sometimes a percentage gives more than two digits after the point. For example, 6.2% of $1,212.00 is $75.144. Money stops at the cent, so we round.',
        'Look at the third digit after the point. This is the thousandths digit. Remember the rhyme: "4 and below, keep it below; 5 and above, give it a shove."',
        'First, $75.144. The third digit is 4, so keep it below: $75.14. Next, $1.005. The third digit is 5, so give it a shove: $1.01. Digits after the third digit never matter.',
        'Round only once, at the end. Work with the exact amounts, such as $125.366 and $62.683, and round the final answer. If you round the pieces first and then add them, you can end up a cent off.',
      ],
      prompt: 'Say the rhyme in your own words. Which digit does it look at?',
      promptAnswer: 'It looks at the third digit after the point. If that digit is 4 or less, the cents stay the same. If it is 5 or more, the cents go up by one.',
    },
    {
      id: 'predict-round', kind: 'predict', title: 'Round it', uses: ['percentages', 'decimals'],
      text: ['A tax works out to $23.486. Round it to the cent.'],
      answer: 2349,
      misconceptions: [{ cents: 2348, explanation: 'The third digit is 6. 5 and above, give it a shove, so the cents go up by one.' }],
      explanation: 'The thousandths digit is 6, so the cents go up by one: $23.49.',
    },
  ],
  resources: ['cfpb-budget'],
};
};

defs["content/rates2026.js"] = function (exports, require, define) {
define(exports, { RATES_2026: () => RATES_2026 });
// 2026 borrowing, saving and inflation rates used in examples. Each figure names its source
// (content/sources.js).

const RATES_2026 = {
  // Commercial-bank interest rate on credit card plans, accounts assessed
  // interest, second quarter of 2026 (revised), in basis points: 22.15%.
  cardAprBasisPoints: 2215,
  cardAprSource: 'fed-g19-2026q2',

  // Average deposit rates, October 2026, in basis points: savings 0.38%,
  // 12-month CD 1.76%.
  savingsRateBasisPoints: 38,
  cdRateBasisPoints: 176,
  depositRatesSource: 'fdic-rates-2026-10',

  // Inflation: the Consumer Price Index rose 3.7% in the 12 months to
  // September 2026, in basis points.
  inflationBasisPoints: 370,
  inflationSource: 'bls-cpi-2026-09',
};
};

defs["content/resources.js"] = function (exports, require, define) {
define(exports, { OFFICIAL_DOMAINS: () => OFFICIAL_DOMAINS, RESOURCES: () => RESOURCES, isOfficialUrl: () => isOfficialUrl });
// Free articles on official sites, linked at the end of modules (the
// course's "getting stuck" help). Modules list the ids they use.

const OFFICIAL_DOMAINS = [
  'consumerfinance.gov', 'irs.gov', 'ssa.gov', 'azdor.gov', 'azica.gov',
  'federalreserve.gov', 'bls.gov', 'investor.gov', 'fdic.gov', 'usa.gov', 'ftc.gov', 'mymoney.gov',
];

const RESOURCES = {
  'cfpb-budget': {
    title: 'Monthly budget worksheet (Your Money, Your Goals)',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://files.consumerfinance.gov/f/documents/cfpb_well-being_monthly-budget.pdf',
  },
  'irs-understanding-withholding': {
    title: 'Tax withholding: how to get it right',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/payments/tax-withholding',
  },
  'azica-min-wage': {
    title: 'Arizona minimum wage',
    publisher: 'Industrial Commission of Arizona',
    url: 'https://www.azica.gov/labor-minimum-wage-main-page',
  },
  'cfpb-credit-cards': {
    title: 'Credit cards',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/',
  },
  'cfpb-minimum-payments': {
    title: 'Understanding minimum payments (activity guide)',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/documents/8331/cfpb_building_block_activities_understanding-minimum-payments_guide.pdf',
  },
  'cfpb-card-statement': {
    title: 'Sample credit card statement (poster)',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://files.consumerfinance.gov/f/documents/cfpb_building_blocks_activities_understanding-credit-card-statement_poster.pdf',
  },
  'cfpb-bank-accounts': {
    title: 'Bank accounts and services',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/consumer-tools/bank-accounts/',
  },
  'cfpb-emergency-fund': {
    title: 'An essential guide to building an emergency fund',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
  },
  'cfpb-start-small': {
    title: 'Start small, save up',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/start-small-save-up/',
  },
  'investor-compound-calculator': {
    title: 'Compound interest calculator',
    publisher: 'Investor.gov (U.S. Securities and Exchange Commission)',
    url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
  },
  'fdic-national-rates': {
    title: 'National rates and rate caps (average deposit rates)',
    publisher: 'Federal Deposit Insurance Corporation',
    url: 'https://www.fdic.gov/national-rates-and-rate-caps',
  },
  'fed-explained': {
    title: 'The Fed Explained: Who We Are',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/aboutthefed/structure-federal-reserve-system.htm',
  },
  'bls-cpi': {
    title: 'Consumer Price Index (CPI) home page',
    publisher: 'U.S. Bureau of Labor Statistics',
    url: 'https://www.bls.gov/cpi/',
  },
  'irs-iras': {
    title: 'Traditional and Roth IRAs',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/retirement-plans/traditional-and-roth-iras',
  },
};

// True when a URL is https and on an official domain (or a subdomain of one).
function isOfficialUrl(url) {
  let host;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    host = u.hostname;
  } catch {
    return false;
  }
  return OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
}
};

defs["content/sampleMonth.js"] = function (exports, require, define) {
const { money, standardPaycheck, splitBuckets, monthlyInterest, chartPage, journal, payStub, CHART } = require("content/helpers.js");
const { runningBalances } = require("js/ledger.js");
const { RATES_2026 } = require("content/rates2026.js");
define(exports, { PERSON: () => PERSON, MONTH: () => MONTH, OPENING: () => OPENING, BANK_PAGES: () => BANK_PAGES, OPENING_NET_WORTH: () => OPENING_NET_WORTH, PAYCHECKS: () => PAYCHECKS, BUDGET_PLAN: () => BUDGET_PLAN, ESSENTIAL: () => ESSENTIAL, ESSENTIAL_MONTH: () => ESSENTIAL_MONTH, FUND_MINIMUM: () => FUND_MINIMUM, TO_EMERGENCY: () => TO_EMERGENCY, TO_SINKING: () => TO_SINKING, INTEREST: () => INTEREST, ATM_FEE: () => ATM_FEE, OUTSTANDING: () => OUTSTANDING, ENTRIES: () => ENTRIES, BANK_ENTRIES: () => BANK_ENTRIES, ledgerPages: () => ledgerPages, pageFor: () => pageFor, balance: () => balance, TOTAL_INCOME: () => TOTAL_INCOME, TOTAL_EXPENSES: () => TOTAL_EXPENSES, CLOSING_ENTRIES: () => CLOSING_ENTRIES, STATEMENT_OPENING: () => STATEMENT_OPENING, STATEMENT_CLOSING: () => STATEMENT_CLOSING, STATEMENT: () => STATEMENT, payStubs: () => payStubs, JOURNAL: () => JOURNAL, BOOK_BALANCE: () => BOOK_BALANCE, ADJUSTED_BANK: () => ADJUSTED_BANK, reconciliation: () => reconciliation, trialBalance: () => trialBalance, TRIAL_BALANCE_TOTAL: () => TRIAL_BALANCE_TOTAL, budgetPlan: () => budgetPlan, budgetActual: () => budgetActual, BUDGET_TOTAL: () => BUDGET_TOTAL, ACTUAL_TOTAL: () => ACTUAL_TOTAL, incomeStatement: () => incomeStatement, NET_WORTH_END: () => NET_WORTH_END, netWorthStatement: () => netWorthStatement, openingNetWorthStatement: () => openingNetWorthStatement, PLAN_NOTE: () => PLAN_NOTE, EVENT_DOC: () => EVENT_DOC, balanceAfter: () => balanceAfter });
// The sample month for the final project (Modules 15 and 16): one fictional
// young adult with a part-time job, July 2026. Everything below is worked out
// from the opening balances, the two paychecks and the list of the month's
// events, so the journal, the ledger pages, the bank statement, the
// reconciliation, the budget and both statements always agree.
// Pay uses the real 2026 Arizona minimum wage and tax rates; the bank pays
// the October 2026 average savings rate on the saving pages. Names, places
// and everyday amounts are fictional (illustrative).





const PERSON = 'Riley (sample month)';
const MONTH = 'July 2026';
const EMPLOYER = 'Saguaro Burger (fictional)';
const BANK = 'Desert Bank (fictional)';
const NOTE = 'Bank, shops and amounts are fictional (illustrative).';
const RENT_CHECK = 215;
const UTILITIES_CHECK = 216;

// Balances brought forward on July 1 (June was closed, so income and expense
// pages start at zero). Pages held at the bank are marked.
const OPENING = [
  ['checking', 0], ['spending', 31000], ['saving', 12000], ['emergency', 90000], ['sinking', 6000],
  ['investing', 15000], ['charity', 2000], ['blow', 3500], ['cash', 4000], ['card', 8540],
];
// In account-number order, as every report lists them.
const BANK_PAGES = ['checking', 'spending', 'saving', 'investing', 'charity', 'blow', 'emergency', 'sinking'];
const SAVING_PAGES = ['saving', 'emergency', 'sinking'];
const openingOf = (id) => OPENING.find(([a]) => a === id)?.[1] ?? 0;
const isDebitSide = (id) => ['asset', 'expense'].includes(CHART[id].type);
const OPENING_NET_WORTH = OPENING.reduce((s, [id, v]) => s + (isDebitSide(id) ? v : -v), 0);

const PAYCHECKS = [{ date: '2026-07-10', hours: 56 }, { date: '2026-07-24', hours: 60 }]
  .map((p) => ({ ...p, pay: standardPaycheck(p.hours), split: splitBuckets(standardPaycheck(p.hours).net) }));

// Riley's plan (Module 15): the needs in the Spending bucket's budget, the
// emergency fund's three-month minimum, and two transfers from the Saving
// bucket after each paycheck.
const BUDGET_PLAN = [['rent', 42500], ['groceries', 18000], ['transport', 6400], ['phone', 4500], ['utilities', 4000], ['household', 2500], ['eating-out', 2000]];
const ESSENTIAL = ['rent', 'groceries', 'transport', 'phone', 'utilities', 'household'];
const ESSENTIAL_MONTH = BUDGET_PLAN.filter(([id]) => ESSENTIAL.includes(id)).reduce((s, [, v]) => s + v, 0);
const FUND_MINIMUM = 3 * ESSENTIAL_MONTH;
const TO_EMERGENCY = 4000; // after each paycheck
// The Sinking fund's $60.00 on July 1 is already saved toward a new phone; July
// adds a second goal: $180.00 renter's insurance, due in 12 months.
const TO_SINKING = 1500; // once a month

const split = (p) => [['spending', p.split.spending, 0], ['saving', p.split.saving, 0], ['investing', p.split.investing, 0], ['charity', p.split.charity, 0], ['blow', p.split.blow, 0], ['checking', 0, p.pay.net]];
const paycheckLines = (p) => [['checking', p.pay.net, 0], ['taxes', p.pay.gross - p.pay.net, 0], ['wages', 0, p.pay.gross]];
const [PAY1, PAY2] = PAYCHECKS;

// The month's events in date order: [date, what happened, lines, bank line?].
// Lines are [account, debit, credit]. A bank line is how the event shows on
// the statement: [label, 'in'|'out'], or null when it never reaches the bank.
// The last two events are on the bank's books only until the statement
// arrives; the reconciliation finds them.
const EVENTS = [
  ['2026-07-03', 'Groceries, debit card (Desert Mart)', [['groceries', 4618, 0], ['spending', 0, 4618]], ['Debit card: Desert Mart', 'out']],
  ['2026-07-06', 'Monthly bus pass, debit card', [['transport', 6400, 0], ['spending', 0, 6400]], ['Debit card: City bus pass', 'out']],
  ['2026-07-08', 'Phone bill, automatic payment', [['phone', 4500, 0], ['spending', 0, 4500]], ['Autopay: phone bill', 'out']],
  [PAY1.date, `Paycheck, ${PAY1.hours} hours`, paycheckLines(PAY1), [`Payroll deposit: ${EMPLOYER}`, 'in']],
  [PAY1.date, 'Split the paycheck into buckets', split(PAY1), null],
  ['2026-07-11', 'To the Emergency fund', [['emergency', TO_EMERGENCY, 0], ['saving', 0, TO_EMERGENCY]], null],
  ['2026-07-12', 'Eating out, cash (Taco Stand)', [['eating-out', 1285, 0], ['cash', 0, 1285]], null],
  ['2026-07-14', 'Household supplies, credit card', [['household', 2347, 0], ['card', 0, 2347]], null],
  ['2026-07-15', `Rent share, check ${RENT_CHECK}`, [['rent', 42500, 0], ['spending', 0, 42500]], [`Check ${RENT_CHECK}`, 'out', '2026-07-16']],
  ['2026-07-18', 'Groceries, debit card (Saguaro Grocery)', [['groceries', 5890, 0], ['spending', 0, 5890]], ['Debit card: Saguaro Grocery', 'out']],
  ['2026-07-20', 'Credit card payment (June balance)', [['card', 8540, 0], ['spending', 0, 8540]], ['Online payment: credit card', 'out']],
  ['2026-07-22', 'Movie, debit card, from Blow money', [['fun', 1400, 0], ['blow', 0, 1400]], ['Debit card: Starlight Cinema', 'out']],
  [PAY2.date, `Paycheck, ${PAY2.hours} hours`, paycheckLines(PAY2), [`Payroll deposit: ${EMPLOYER}`, 'in']],
  [PAY2.date, 'Split the paycheck into buckets', split(PAY2), null],
  ['2026-07-25', 'To the Emergency fund and the Sinking fund', [['emergency', TO_EMERGENCY, 0], ['sinking', TO_SINKING, 0], ['saving', 0, TO_EMERGENCY + TO_SINKING]], null],
  ['2026-07-25', 'Donation to the food bank, from the Charity bucket', [['donations', 2000, 0], ['charity', 0, 2000]], ['Online payment: Valley Food Bank', 'out']],
  ['2026-07-26', 'ATM withdrawal', [['cash', 4000, 0], ['spending', 0, 4000]], ['ATM withdrawal', 'out']],
  ['2026-07-28', 'Groceries, debit card (Desert Mart)', [['groceries', 6137, 0], ['spending', 0, 6137]], ['Debit card: Desert Mart', 'out']],
  ['2026-07-29', `Utilities share to roommate, check ${UTILITIES_CHECK}`, [['utilities', 3800, 0], ['spending', 0, 3800]], null],
  ['2026-07-31', 'Birthday gift from Grandma, deposited', [['saving', 5000, 0], ['gifts', 0, 5000]], null],
];

// Found on the statement: interest on the saving pages (the October 2026
// average rate, one month) and a fee for using another bank's ATM.
const INTEREST = monthlyInterest(SAVING_PAGES.reduce((s, id) => s + openingOf(id), 0), RATES_2026.savingsRateBasisPoints);
const ATM_FEE = 300;
const BANK_ITEMS = [
  ['2026-07-31', 'Interest paid (statement)', [['saving', INTEREST, 0], ['interest-earned', 0, INTEREST]], null],
  ['2026-07-31', 'Fee for another bank\'s ATM (statement)', [['bank-fees', ATM_FEE, 0], ['spending', 0, ATM_FEE]], null],
];
const STATEMENT_ONLY = [['2026-07-26', 'ATM fee: another bank', ATM_FEE, 'out'], ['2026-07-31', 'Interest paid', INTEREST, 'in']];
const OUTSTANDING = { deposits: [{ label: 'Jul 31 Deposit: birthday gift', amount: 5000 }], payments: [{ label: `Check ${UTILITIES_CHECK}: utilities share`, amount: 3800 }] };

// Journal pages hold six entries each, so an entry's folio is its page.
const PER_PAGE = 6;
const toEntries = (events, start) => events.map(([date, explanation, lines], i) => ({ date, explanation, lines, folio: `J${Math.floor((start + i) / PER_PAGE) + 1}` }));
const ENTRIES = toEntries(EVENTS, 0);
const BANK_ENTRIES = toEntries(BANK_ITEMS, EVENTS.length);

// --- Ledger pages -------------------------------------------------------------

const ACCOUNT_ORDER = Object.keys(CHART);
function postAll(entries) {
  const rows = {};
  for (const [id, v] of OPENING) rows[id] = [['2026-07-01', 'Brought forward', '', isDebitSide(id) ? v : 0, isDebitSide(id) ? 0 : v]];
  rows['net-worth'] = [['2026-07-01', 'Brought forward', '', 0, OPENING_NET_WORTH]];
  for (const e of entries) {
    for (const [id, dr, cr] of e.lines) (rows[id] ??= []).push([e.date, e.explanation, e.folio, dr, cr, true]);
  }
  return rows;
}
const pagesFrom = (rows) => ACCOUNT_ORDER.filter((id) => rows[id]).map((id, i) => ({ id, page: chartPage(id, rows[id], { name: PERSON, sheetNo: i + 1 }) }));
const balanceOf = (page) => runningBalances(page).at(-1) ?? { balance: 0, side: 'Dr' };
const signed = (id, page) => { const b = balanceOf(page); return (b.side === 'Dr') === isDebitSide(id) ? b.balance : -b.balance; };

// stage: 'month' = the month's events; 'bank' = after recording what the
// statement showed; 'closed' = after the closing entries.
function ledgerPages(stage = 'bank') {
  const entries = stage === 'month' ? ENTRIES : [...ENTRIES, ...BANK_ENTRIES, ...(stage === 'closed' ? CLOSING_ENTRIES : [])];
  return pagesFrom(postAll(entries));
}
const pageFor = (id, stage) => ledgerPages(stage).find((p) => p.id === id)?.page;
const balance = (id, stage = 'bank') => { const p = pageFor(id, stage); return p ? signed(id, p) : 0; };

// The closing entries: income pages into Net worth, then expense pages.
const kindIds = (type) => ACCOUNT_ORDER.filter((id) => CHART[id].type === type);
const closingAt = pagesFrom(postAll([...ENTRIES, ...BANK_ENTRIES]));
const closingBalance = (id) => { const p = closingAt.find((x) => x.id === id); return p ? signed(id, p.page) : 0; };
const INCOME_IDS = kindIds('income').filter((id) => closingBalance(id) > 0);
const EXPENSE_IDS = kindIds('expense').filter((id) => closingBalance(id) > 0);
const TOTAL_INCOME = INCOME_IDS.reduce((s, id) => s + closingBalance(id), 0);
const TOTAL_EXPENSES = EXPENSE_IDS.reduce((s, id) => s + closingBalance(id), 0);
const CLOSING_EVENTS = [
  ['2026-07-31', 'Close income to net worth', [...INCOME_IDS.map((id) => [id, closingBalance(id), 0]), ['net-worth', 0, TOTAL_INCOME]]],
  ['2026-07-31', 'Close expenses to net worth', [['net-worth', TOTAL_EXPENSES, 0], ...EXPENSE_IDS.map((id) => [id, 0, closingBalance(id)])]],
];
const CLOSING_ENTRIES = toEntries(CLOSING_EVENTS, EVENTS.length + BANK_ITEMS.length);

// --- Documents and reports -----------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (d) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}`;

// The bank statement: every event that reached the bank, plus the bank's
// own items, in date order.
const statementLines = () => {
  const moves = [];
  for (const [date, , lines, bank] of EVENTS) {
    if (!bank) continue;
    const [label, dir, cleared = date] = bank;
    const amount = lines.reduce((s, [id, dr, cr]) => s + (BANK_PAGES.includes(id) ? (dir === 'in' ? dr - cr : cr - dr) : 0), 0);
    moves.push([cleared, label, amount, dir]);
  }
  moves.push(...STATEMENT_ONLY);
  return moves.sort((a, b) => a[0].localeCompare(b[0]));
};
const STATEMENT_OPENING = BANK_PAGES.reduce((s, id) => s + openingOf(id), 0);
const STATEMENT_CLOSING = statementLines().reduce((b, [, , v, d]) => b + (d === 'in' ? v : -v), STATEMENT_OPENING);
const STATEMENT = {
  kind: 'statement', title: `Bank statement: ${BANK}, ${MONTH}`,
  lines: [['Opening balance', STATEMENT_OPENING], ...statementLines().map(([date, label, v, d]) => [`${shortDate(date)} ${label}`, v, d]), ['Closing balance', STATEMENT_CLOSING]],
  note: NOTE,
};

const payStubs = () => PAYCHECKS.map((p) => ({ ...payStub(p.hours, { employer: EMPLOYER }), title: `Pay stub: two weeks to ${shortDate(p.date)}` }));

const JOURNAL = (entries = ENTRIES, sheetNo = 1) => journal(entries.map((e) => [e.date, e.folio, e.explanation, e.lines.map(([id, dr, cr]) => [id, dr, cr, true])]), { sheetNo, name: PERSON });

const item = (id, amount) => ({ no: CHART[id].no, name: CHART[id].name, amount });
const bookPages = (stage) => BANK_PAGES.map((id) => item(id, balance(id, stage))).filter((x) => x.amount > 0);
const BOOK_BALANCE = BANK_PAGES.reduce((s, id) => s + balance(id, 'month'), 0);
const ADJUSTED_BANK = STATEMENT_CLOSING + OUTSTANDING.deposits.reduce((s, x) => s + x.amount, 0) - OUTSTANDING.payments.reduce((s, x) => s + x.amount, 0);

const reconciliation = (extra = {}) => ({
  report: 'reconciliation', name: PERSON, date: '2026-07-31', statement: STATEMENT_CLOSING, ...OUTSTANDING,
  pages: bookPages('month'), interest: [{ label: 'Interest paid', amount: INTEREST }], fees: [{ label: 'Fee for another bank\'s ATM', amount: ATM_FEE }], ...extra,
});

const trialBalance = (stage = 'bank', extra = {}) => ({
  report: 'trial-balance', name: PERSON, date: '2026-07-31',
  accounts: ledgerPages(stage).map(({ id, page }) => ({ id, page, last: balanceOf(page) })).filter(({ last }) => last.balance > 0)
    .map(({ page, last }) => ({ no: page.accountNo, name: page.account, [last.side === 'Dr' ? 'debit' : 'credit']: last.balance })),
  ...extra,
});
const TRIAL_BALANCE_TOTAL = trialBalance().accounts.reduce((s, a) => s + (a.debit ?? 0), 0);

const budgetPlan = (extra = {}) => ({ report: 'budget', name: PERSON, period: MONTH, lines: BUDGET_PLAN.map(([id, b]) => ({ no: CHART[id].no, name: CHART[id].name, budget: b })), ...extra });
const budgetActual = (extra = {}) => ({ report: 'budget', name: PERSON, period: MONTH, lines: BUDGET_PLAN.map(([id, b]) => ({ no: CHART[id].no, name: CHART[id].name, budget: b, actual: balance(id, 'bank') })), ...extra });
const BUDGET_TOTAL = BUDGET_PLAN.reduce((s, [, v]) => s + v, 0);
const ACTUAL_TOTAL = BUDGET_PLAN.reduce((s, [id]) => s + balance(id, 'bank'), 0);

const incomeStatement = (extra = {}) => ({
  report: 'income-statement', name: PERSON, period: MONTH,
  income: INCOME_IDS.map((id) => item(id, closingBalance(id))), expenses: EXPENSE_IDS.map((id) => item(id, closingBalance(id))), ...extra,
});
const NET_WORTH_END = balance('net-worth', 'closed');
const netWorthStatement = (extra = {}) => ({
  report: 'net-worth', name: PERSON, date: '2026-07-31',
  assets: kindIds('asset').map((id) => item(id, balance(id, 'closed'))).filter((x) => x.amount > 0),
  liabilities: kindIds('liability').map((id) => item(id, balance(id, 'closed'))).filter((x) => x.amount > 0), ...extra,
});
const openingNetWorthStatement = (extra = {}) => ({
  report: 'net-worth', name: PERSON, date: '2026-06-30',
  assets: OPENING.filter(([id]) => isDebitSide(id) && openingOf(id) > 0).map(([id, v]) => item(id, v)),
  liabilities: OPENING.filter(([id]) => !isDebitSide(id)).map(([id, v]) => item(id, v)), ...extra,
});

// The month's events as a dated list, for learners working on paper. A
// paycheck points to its pay stub; a split points to the bucket rule.
const eventValue = ([, what, lines]) => {
  if (what.startsWith('Paycheck')) return 'see the pay stub';
  if (what.startsWith('Split')) return 'by the five-bucket split';
  return lines.reduce((s, [, dr]) => s + dr, 0);
};
const PLAN_NOTE = `The plan from Module 15: ${money(TO_EMERGENCY)} into the Emergency fund after each paycheck, and ${money(TO_SINKING)} into the Sinking fund once a month (the Jul 25 line is ${money(TO_EMERGENCY)} + ${money(TO_SINKING)}).`;
const EVENT_DOC = {
  kind: 'list', title: `What happened in ${MONTH}: ${PERSON}`,
  lines: EVENTS.map((e) => [`${shortDate(e[0])} ${e[1]}`, eventValue(e)]),
  note: `${PLAN_NOTE} ${NOTE} Record each line in your journal in this order.`,
};

// A page's balance just after its first line with this date and wording
// (for project figures that no report shows).
function balanceAfter(id, date, what, stage = 'month') {
  const page = pageFor(id, stage);
  const row = page.rows.findIndex((r) => r.date === date && r.items === what);
  if (row === -1) throw new Error(`No line "${what}" on ${date} on the ${id} page.`);
  return runningBalances(page)[row].balance;
}
};

defs["content/sources.js"] = function (exports, require, define) {
define(exports, { SOURCES: () => SOURCES });
// Every real-world figure in the course cites one of these sources by id.
// "accessed" is the date the figure was checked against the source.

const SOURCES = {
  'azica-min-wage-2026': {
    title: 'New 2026 Minimum Wage, effective January 1, 2026',
    publisher: 'Industrial Commission of Arizona',
    url: 'https://www.azica.gov/sites/default/files/2025-10/2026%20Minimum%20Wage.pdf',
    accessed: '2026-10-24',
  },
  'ssa-cbb-2026': {
    title: 'Contribution and Benefit Base (2026: $184,500)',
    publisher: 'Social Security Administration',
    url: 'https://www.ssa.gov/oact/cola/cbb.html',
    accessed: '2026-10-24',
  },
  'ssa-cola-2026': {
    title: '2026 Cost-of-Living Adjustment Fact Sheet (tax rates: 6.2% Social Security, 1.45% Medicare)',
    publisher: 'Social Security Administration',
    url: 'https://www.ssa.gov/news/en/cola/factsheets/2026.html',
    accessed: '2026-10-24',
  },
  'irs-p15t-2026': {
    title: 'Publication 15-T (2026), Federal Income Tax Withholding Methods: Worksheet 1A and the Annual Percentage Method tables',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/publications/p15t',
    accessed: '2026-10-24',
  },
  'azdor-a4-2026': {
    title: 'Employer\'s Instructions for Arizona Form A-4 (2026): default withholding rate 2.0%',
    publisher: 'Arizona Department of Revenue',
    url: 'https://azdor.gov/sites/default/files/document/FORMS_WITHHOLDING_2026_A-4i.pdf',
    accessed: '2026-10-24',
  },
  'fed-g19-2026q2': {
    title: 'Consumer Credit (G.19), released October 7, 2026: interest rate on credit card plans, accounts assessed interest, 2026 Q2 (revised): 22.15%',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/releases/g19/20261007/',
    accessed: '2026-10-24',
  },
  'cfpb-apr': {
    title: 'What is a credit card interest rate? What does APR mean?',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-interest-rate-what-does-apr-mean-en-44/',
    accessed: '2026-10-24',
  },
  'cfpb-minimum-warning': {
    title: 'A box on my credit card bill says that I will pay off the balance in three years if I pay a certain amount. What does that mean?',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/',
    accessed: '2026-10-24',
  },
  'cfpb-daily-rate': {
    title: 'What is a "daily periodic rate" on a credit card?',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-daily-periodic-rate-on-a-credit-card-en-46/',
    accessed: '2026-10-24',
  },
  'cfpb-grace-period': {
    title: 'What is a grace period for a credit card?',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/',
    accessed: '2026-10-24',
  },
  'cfpb-emergency-fund': {
    title: 'An essential guide to building an emergency fund (the amount "depends on your situation")',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
    accessed: '2026-10-25',
  },
  'fed-shed-2025-emergency': {
    title: 'Economic Well-Being of U.S. Households in 2025 (May 2026): adults who have 3 months of emergency savings, 55%',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/consumerscommunities/sheddataviz/emergency-savings-table.html',
    accessed: '2026-10-25',
  },
  'bls-cpi-2026-09': {
    title: 'Consumer Price Index News Release, October 14, 2026: all items up 3.7% over the 12 months to September 2026',
    publisher: 'U.S. Bureau of Labor Statistics',
    url: 'https://www.bls.gov/news.release/archives/cpi_10142026.htm',
    accessed: '2026-10-25',
  },
  'fdic-rates-2026-10': {
    title: 'National Rates and Rate Caps, October 2026: savings 0.38%, 12-month CD 1.76%',
    publisher: 'Federal Deposit Insurance Corporation',
    url: 'https://www.fdic.gov/national-rates-and-rate-caps',
    accessed: '2026-10-25',
  },
  'fed-act-signed': {
    title: 'Federal Reserve Act Signed into Law (signed by President Wilson on December 23, 1913)',
    publisher: 'Federal Reserve History (Federal Reserve System)',
    url: 'https://www.federalreservehistory.org/essays/federal-reserve-act-signed',
    accessed: '2026-10-25',
  },
  'fed-act-title': {
    title: 'Federal Reserve Act: official title ("to furnish an elastic currency")',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/aboutthefed/officialtitle-preamble.htm',
    accessed: '2026-10-25',
  },
  'fed-who-we-are': {
    title: 'The Fed Explained: Who We Are (Board of Governors in Washington, D.C., and 12 Federal Reserve Banks)',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/aboutthefed/structure-federal-reserve-system.htm',
    accessed: '2026-10-25',
  },
  'powell-balance-sheet-2025': {
    title: "Jerome H. Powell, Understanding the Fed's Balance Sheet (speech, October 14, 2025)",
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/newsevents/speech/powell20251014a.htm',
    accessed: '2026-10-25',
  },
  'bls-cpi-history': {
    title: 'Consumer Price Index Historical Tables for U.S. City Average (CPI-U, 1982-84=100)',
    publisher: 'U.S. Bureau of Labor Statistics',
    url: 'https://www.bls.gov/regions/mid-atlantic/data/consumerpriceindexhistorical_us_table.htm',
    accessed: '2026-10-25',
  },
  'bls-cpi-2022-06': {
    title: 'Consumer Price Index News Release, July 13, 2022: all items up 9.1% and energy up 41.6% over the 12 months to June 2022',
    publisher: 'U.S. Bureau of Labor Statistics',
    url: 'https://www.bls.gov/news.release/archives/cpi_07132022.htm',
    accessed: '2026-10-25',
  },
  'fed-h6-2021-01': {
    title: 'Money Stock Measures (H.6), January 28, 2021: M2, seasonally adjusted',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/releases/h6/20210128/',
    accessed: '2026-10-25',
  },
  'treasury-mts': {
    title: 'Monthly Treasury Statement: Summary of Receipts, Outlays, and the Deficit/Surplus (fiscal years 2019–2022, September year to date)',
    publisher: 'U.S. Department of the Treasury, Fiscal Data',
    url: 'https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government',
    accessed: '2026-10-25',
  },
  'sffed-2022-07': {
    title: 'Jordà, Liu, Nechio and Rivera-Reyes, Why Is U.S. Inflation Higher than in Other Countries? (Economic Letter 2022-07, March 28, 2022)',
    publisher: 'Federal Reserve Bank of San Francisco',
    url: 'https://www.frbsf.org/research-and-insights/publications/economic-letter/2022/03/why-is-us-inflation-higher-than-in-other-countries/',
    accessed: '2026-10-25',
  },
  'kcfed-2023-markups': {
    title: 'Glover, Mustre-del-Río and von Ende-Becker, How Much Have Record Corporate Profits Contributed to Recent Inflation? (Economic Review, January 12, 2023)',
    publisher: 'Federal Reserve Bank of Kansas City',
    url: 'https://www.kansascityfed.org/research/economic-review/how-much-have-record-corporate-profits-contributed-to-recent-inflation',
    accessed: '2026-10-25',
  },
  'kcfed-2023-profits': {
    title: 'Glover, Mustre-del-Río and Nichols, Corporate Profits Contributed a Lot to Inflation in 2021 but Little in 2022 (Economic Bulletin, May 12, 2023)',
    publisher: 'Federal Reserve Bank of Kansas City',
    url: 'https://kansascityfed.org/research/economic-bulletin/corporate-profits-contributed-a-lot-to-inflation-in-2021-but-little-in-2022',
    accessed: '2026-10-25',
  },
  'sffed-2024-12': {
    title: 'Leduc, Li and Liu, Are Markups Driving the Ups and Downs of Inflation? (Economic Letter 2024-12, May 13, 2024)',
    publisher: 'Federal Reserve Bank of San Francisco',
    url: 'https://www.frbsf.org/research-and-insights/publications/economic-letter/2024/05/are-markups-driving-ups-and-downs-of-inflation/',
    accessed: '2026-10-25',
  },
  'ftc-grocery-2024': {
    title: 'Feeding America in a Time of Crisis: FTC Staff Report on the United States Grocery Supply Chain and the COVID-19 Pandemic (March 21, 2024)',
    publisher: 'Federal Trade Commission',
    url: 'https://www.ftc.gov/node/84998',
    accessed: '2026-10-25',
  },
  'sec-10k-jnj': {
    title: 'Johnson & Johnson, Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000200406&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-pfizer': {
    title: 'Pfizer Inc., Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000078003&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-merck': {
    title: 'Merck & Co., Inc., Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000310158&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-abbvie': {
    title: 'AbbVie Inc., Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001551152&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-bms': {
    title: 'Bristol-Myers Squibb Company, Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000014272&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-unitedhealth': {
    title: 'UnitedHealth Group Incorporated, Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000731766&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-cigna': {
    title: 'The Cigna Group (Cigna Corporation), Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001739940&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-elevance': {
    title: 'Elevance Health, Inc. (Anthem, Inc. until 2022), Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001156039&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-centene': {
    title: 'Centene Corporation, Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001071739&type=10-K',
    accessed: '2026-10-25',
  },
  'sec-10k-humana': {
    title: 'Humana Inc., Form 10-K annual reports for 2019, 2021 and 2022',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000049071&type=10-K',
    accessed: '2026-10-25',
  },
  'lilly-insulin-2023': {
    title: 'Lilly Cuts Insulin Prices by 70% and Caps Patient Insulin Out-of-Pocket Costs at $35 Per Month (March 1, 2023)',
    publisher: 'Eli Lilly and Company',
    url: 'https://investor.lilly.com/news-releases/news-release-details/lilly-cuts-insulin-prices-70-and-caps-patient-insulin-out-pocket',
    accessed: '2026-10-25',
  },
  'sanofi-lantus-2023': {
    title: 'Sanofi cuts U.S. list price of Lantus, its most-prescribed insulin, by 78% (March 16, 2023)',
    publisher: 'Sanofi',
    url: 'https://www.sanofi.com/en/media-room/press-releases/2023/2023-03-16-20-06-43-2629188',
    accessed: '2026-10-25',
  },
  'novo-insulin-2024': {
    title: 'Access and affordability commitment (2024: lowered U.S. prices of selected insulin brands by up to 75%)',
    publisher: 'Novo Nordisk Inc.',
    url: 'https://www.novonordisk-us.com/patient-help/access-and-affordability-commitment1.html',
    accessed: '2026-10-25',
  },
  'cms-ira-insulin': {
    title: 'Reduced Drug Prices, Enhanced Medicare Benefits Under the Inflation Reduction Act: FAQs (October 5, 2022): insulin capped at $35 a month',
    publisher: 'Centers for Medicare & Medicaid Services',
    url: 'https://www.cms.gov/files/document/10522-external-faqs-about-inflation-reduction-act.pdf',
    accessed: '2026-10-25',
  },
  'irs-ira-2026': {
    title: '401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500 (IR-2025-111, November 13, 2025)',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500',
    accessed: '2026-10-25',
  },
  'irs-traditional-roth': {
    title: 'Traditional and Roth IRAs',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/retirement-plans/traditional-and-roth-iras',
    accessed: '2026-10-25',
  },
  'fed-open-market': {
    title: 'Open Market Operations (the purchase and sale of securities; the federal funds rate target)',
    publisher: 'Board of Governors of the Federal Reserve System',
    url: 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm',
    accessed: '2026-10-25',
  },
  'investor-iras': {
    title: 'Individual Retirement Accounts (IRAs): traditional and Roth',
    publisher: 'Investor.gov (U.S. Securities and Exchange Commission)',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-accounts/tax-advantaged-accounts/retirement-savings/individual-retirement-accounts-iras',
    accessed: '2026-10-25',
  },
  'fdic-at-a-glance': {
    title: 'Deposit Insurance At A Glance (certain retirement accounts, including IRAs: $250,000 per owner; CDs are insured deposits)',
    publisher: 'Federal Deposit Insurance Corporation',
    url: 'https://www.fdic.gov/resources/deposit-insurance/brochures/deposits-at-a-glance',
    accessed: '2026-10-25',
  },
  'fdic-not-insured': {
    title: 'Financial Products That Are Not Insured by the FDIC (stocks, bonds and mutual funds "may lose value")',
    publisher: 'Federal Deposit Insurance Corporation',
    url: 'https://www.fdic.gov/resources/deposit-insurance/financial-products-not-insured',
    accessed: '2026-10-25',
  },
};
};

defs["content/tax2026.js"] = function (exports, require, define) {
define(exports, { TAX_2026: () => TAX_2026 });
// 2026 wage and payroll-tax figures for the course's standard paycheck.
// Each figure names its source (content/sources.js). Amounts are in cents.

const TAX_2026 = {
  year: 2026,

  // Arizona minimum wage from January 1, 2026.
  azMinimumWageCents: 1515,
  azMinimumWageSource: 'azica-min-wage-2026',

  // Employee share of FICA. Social Security applies up to the wage base.
  socialSecurityRate: 0.062,
  socialSecurityWageBaseCents: 18450000,
  medicareRate: 0.0145,
  ficaSources: ['ssa-cola-2026', 'ssa-cbb-2026'],

  // Federal income tax withholding: IRS Pub. 15-T (2026), Worksheet 1A with
  // the STANDARD Withholding Rate Schedule for Single or Married Filing
  // Separately (Form W-4 from 2020 or later, nothing in Steps 2–4).
  federal: {
    payPeriodsPerYear: { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 },
    line1gCents: 860000, // "$8,600 otherwise" (not married filing jointly)
    singleSchedule: [
      // [at least, tentative amount, rate] — annual figures in cents
      [0, 0, 0],
      [750000, 0, 0.10],
      [1990000, 124000, 0.12],
      [5790000, 580000, 0.22],
      [11320000, 1796600, 0.24],
      [20927500, 4102400, 0.32],
      [26372500, 5844800, 0.35],
      [64810000, 19297925, 0.37],
    ],
    source: 'irs-p15t-2026',
  },

  // Arizona withholding when the employee has not filed Form A-4.
  arizonaDefaultRate: 0.02,
  arizonaSource: 'azdor-a4-2026',
};
};

defs["js/app/assess.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { ledgerPanelHTML, citationHTML } = require("js/lessonView.js");
const { MODULE_CONTENT } = require("content/modules/index.js");
const { parseAmount } = require("js/money.js");
const { assessmentVersions, withRecall } = require("js/items.js");
const { createSession, resumeSession, submit, currentItem, isComplete, summary } = require("js/session.js");
const { isUnlocked, nextVersion, attemptsFor, openSession, saveSession, sessionMatches, recordGate, recordCheckpoint, recordExam, recordPlacement, recordOther, recordPractice, recallDue, failureStep, addErrorEntry } = require("js/progress.js");
const { store, update, mountChrome, trackTime } = require("js/app/chrome.js");
const { ASSESSMENTS } = require("content/assess/index.js");
const { examIntroHTML } = require("js/examView.js");
const { celebrationHTML, wireCelebration } = require("js/celebration.js");
const { longDate } = require("js/dates.js");
const { moduleName } = require("js/names.js");
define(exports, { startAssessment: () => startAssessment });
// The assessment page: one item at a time, the learner commits an answer
// before seeing feedback, then sees results with explanations.
















const PART_LABELS = { interpreting: 'Read and predict', producing: 'Record it yourself', explaining: 'Explain why' };

function entryRowHTML(item, i) {
  const options = ['<option value="">Choose an account</option>', ...item.accounts.map((a) => `<option value="${escapeHTML(a.id)}">${escapeHTML(a.label)}</option>`)].join('');
  return `<tr>
    <td><select name="account" aria-label="Line ${i + 1} account"${i === 0 ? ' aria-describedby="prompt"' : ''}>${options}</select></td>
    <td><input name="debit" inputmode="decimal" aria-label="Line ${i + 1} debit"></td>
    <td><input name="credit" inputmode="decimal" aria-label="Line ${i + 1} credit"></td>
  </tr>`;
}

function itemHTML(item, index, total) {
  const head = `<p class="crumb">Question ${index + 1} of ${total} · ${PART_LABELS[item.part]} · ${item.points} ${item.points === 1 ? 'point' : 'points'}</p>
    <p class="item-prompt" id="prompt">${escapeHTML(item.prompt)}</p>
    ${ledgerPanelHTML({ ...item, highlightRow: item.highlightRow ?? 0 })}${citationHTML(item)}`;
  if (item.kind === 'numeric') {
    return `${head}
      <form class="answer-form" data-kind="numeric">
        <label for="answer">Your answer (in dollars)</label>
        <div class="answer-row"><span aria-hidden="true">$</span><input id="answer" name="answer" inputmode="decimal" autocomplete="off" aria-describedby="prompt" required></div>
        <button class="button" type="submit">Check my answer</button>
      </form>`;
  }
  if (item.kind === 'amounts') {
    const fields = item.fields.map((f, i) => `<div class="amount-field"><label for="amount-${i}">${escapeHTML(f.label)}</label><div class="answer-row"><span aria-hidden="true">$</span><input id="amount-${i}" name="amount" inputmode="decimal" autocomplete="off" aria-describedby="prompt" required></div></div>`).join('');
    return `${head}
      <form class="answer-form" data-kind="amounts" aria-describedby="prompt">
        ${fields}
        <button class="button" type="submit">Check my amounts</button>
      </form>`;
  }
  if (item.kind === 'entry') {
    return `${head}
      <form class="answer-form" data-kind="entry">
        <table class="entry-table" aria-describedby="prompt"><thead><tr><th scope="col">Account</th><th scope="col">Debit</th><th scope="col">Credit</th></tr></thead>
        <tbody>${[0, 1, 2].map((i) => entryRowHTML(item, i)).join('')}</tbody></table>
        <p><button class="link-button" type="button" data-action="add-line">Add a line</button></p>
        <button class="button" type="submit">Check my entry</button>
      </form>`;
  }
  return `${head}
    <form class="answer-form" data-kind="explain">
      <label for="explanation">Your explanation</label>
      <textarea id="explanation" name="text" rows="4" aria-describedby="prompt" required></textarea>
      <button class="button" type="submit">Show the model answer</button>
    </form>`;
}

function selfMarkHTML(result, text) {
  const ticks = result.rubric.map((c, i) =>
    `<li><label><input type="checkbox" name="tick" value="${i}"> ${escapeHTML(c)}</label></li>`).join('');
  return `<div class="feedback">
    <p><strong>Your answer:</strong> ${escapeHTML(text)}</p>
    <p><strong>Model answer:</strong> ${escapeHTML(result.modelAnswer)}</p>
    <form class="answer-form" data-kind="ticks">
      <fieldset><legend>Tick each point your answer made</legend><ul class="ticks">${ticks}</ul></fieldset>
      <button class="button" type="submit">Mark my answer</button>
    </form>
  </div>`;
}

function feedbackHTML(result) {
  const rubric = result.rubric && !result.selfMarked
    ? `<ul class="rubric">${result.rubric.map((r) => `<li class="${r.met ? 'met' : 'missed'}">${r.met ? '✓' : '✗'} ${escapeHTML(r.criterion)}</li>`).join('')}</ul>`
    : '';
  const tone = result.correct === false || (result.selfMarked && result.points < result.max) ? 'feedback-wrong' : 'feedback-right';
  return `<div class="feedback ${tone}">
    <p id="result-text"><strong>${result.points} of ${result.max} ${result.max === 1 ? 'point' : 'points'}.</strong> ${escapeHTML(result.feedback ?? '')}</p>${rubric}
    <button class="button" type="button" data-action="next" aria-describedby="result-text">Next</button>
  </div>`;
}

const VERDICTS = {
  gate: {
    pass: 'Passed. You have shown you understand this module.',
    retry: 'Not yet. You need 80% of the points (20 of 24). The "Record it yourself" questions are worth the most, so look at those first.',
  },
  checkpoint: {
    pass: 'Passed. Everything so far has stuck.',
    retry: 'Not yet. You need 80%. Go back to the earliest module listed below, redo its practice set and gate, then try this checkpoint again.',
  },
  exam: { pass: 'Passed. You have completed the course.', retry: 'Not yet. You need 80%. Review the modules listed below, earliest first, then try again. You will get a different version.' },
  retention: { pass: 'Well remembered. Four weeks on, the course has stuck.', retry: 'Some of it has faded, which is normal after four weeks. Reread the modules listed below; nothing in the course is locked by this review.' },
  prereq: {
    pass: 'Passed. You have the money arithmetic this course uses. Start Module 1 whenever you are ready.',
    retry: 'Not yet. Work through the <a href="lesson.html?m=prereq">money arithmetic refresher</a>, then take this check again. It only takes a few minutes.',
  },
  practice: { pass: 'Practice set done. When you are ready, take the module check.', retry: 'Practice set done. Look over the explanations for the questions you missed, then take the module check when you are ready.' },
};

// Placement results name the module the learner may start at. The Module 9
// test is taken after Modules 1–4 are counted as passed, so a learner who
// does not pass it starts at Module 5.
const PLACEMENT_START = { ca: 'm05', cb: 'm09' };
const PLACEMENT_RETRY = {
  ca: 'Not yet. You need 80%. Start at Module 1 and work through the modules listed below; nothing is lost by starting at the beginning. You can try the placement test again later.',
  cb: 'Not yet. You need 80%. Modules 1 to 4 still count as passed, so <a href="lesson.html?m=m05">start at Module 5</a> and work through the modules listed below. You can try this placement test again later.',
};
function placementWords(checkpointId) {
  const start = PLACEMENT_START[checkpointId];
  return {
    pass: `Passed. You can start at <a href="lesson.html?m=${start}">Module ${Number(start.slice(1))}</a>. The earlier modules stay open if you want to review them.`,
    retry: PLACEMENT_RETRY[checkpointId],
  };
}

function resultsHTML(session) {
  const s = summary(session);
  const kind = session.meta?.kind ?? 'gate';
  const words = kind === 'placement' ? placementWords(session.meta.checkpointId) : VERDICTS[kind] ?? VERDICTS.gate;
  // Numbers only: saved results can come from a loaded progress file.
  const score = s.max !== undefined ? `${Number(s.points)} of ${Number(s.max)}` : `${Number(s.percent)}%`;
  const missedList = s.missedModules ?? (['exam', 'retention'].includes(kind) && !s.passed ? [...new Set(session.results.filter((r) => r.points < r.max).map((r) => r.module))] : []);
  const missed = missedList.length ? `<p>Review these first: ${missedList.map((id) => `<a href="lesson.html?m=${escapeHTML(id)}">${escapeHTML(moduleName(id))}</a>`).join(', ')}</p>` : '';
  const rows = session.results.map((r, i) => {
    const item = session.items[i];
    const why = item.kind === 'explain' ? `Model answer: ${item.modelAnswer}` : (item.explanation ?? '');
    return `<tr><td>${i + 1}</td><td>${PART_LABELS[r.part]}</td><td>${Number(r.points)} / ${Number(r.max)}</td><td>${escapeHTML(why)}</td></tr>`;
  }).join('');
  return `<h2 id="results-heading" tabindex="-1">Your result: ${score}</h2>
    <p class="verdict ${s.passed ? 'pass' : 'retry'}">${s.passed ? words.pass : words.retry}</p>${missed}
    <table class="results"><thead><tr><th scope="col">Question</th><th scope="col">Part</th><th scope="col">Points</th><th scope="col">Why</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function readEntry(form) {
  const lines = [];
  const errors = [];
  form.querySelectorAll('tbody tr').forEach((tr, i) => {
    const account = tr.querySelector('[name=account]').value;
    const amounts = {};
    for (const side of ['debit', 'credit']) {
      const field = tr.querySelector(`[name=${side}]`);
      const raw = field.value.trim();
      field.removeAttribute('aria-invalid');
      if (raw === '') { amounts[side] = 0; continue; }
      const parsed = parseAmount(raw);
      if (parsed.ok) amounts[side] = parsed.cents;
      else { errors.push({ label: `Line ${i + 1} ${side}`, field }); field.setAttribute('aria-invalid', 'true'); }
    }
    lines.push({ account, debit: amounts.debit ?? 0, credit: amounts.credit ?? 0 });
  });
  return { lines, errors };
}

const safeAttempt = (n) => (Number.isInteger(n) && n >= 1 ? Math.min(n, 4) : 1);

const NEXT_STEPS = {
  retake: 'Do the module\'s practice set again with fresh problems, then take this check again. You will get a different version.',
  'rework-example': 'Go back to the module\'s worked example and rework it by hand. Write in your error log below what went wrong and why, then take the check again.',
  remediation: 'Work through the module\'s extra practice on common mistakes, and read the free articles linked at the end of the module. Then take the check again. Needing more tries is normal; it is how the course makes sure nothing is skipped.',
};

function errorLogFormHTML() {
  return `<form class="answer-form error-log-form" data-kind="errorlog">
    <h3>Add to your error log</h3>
    <p>Writing down a mistake turns it into practice. Fill this in for any question you missed.</p>
    <label for="log-error">What went wrong</label><input id="log-error" name="error" required>
    <label for="log-cause">Why it happened</label><input id="log-cause" name="cause" required>
    <label for="log-fix">The correct way</label><input id="log-fix" name="correction" required>
    <button class="button" type="submit">Save to my error log</button>
  </form>`;
}

// Records a finished sitting in the learner's progress, with per-question
// results for the evaluation plan.
function recordResult(progress, session, at) {
  const { assessmentId, kind, version } = session.meta;
  const score = summary(session);
  const items = session.results.map((r) => ({ templateId: r.templateId, module: r.module, part: r.part, points: r.points, max: r.max, selfMarked: Boolean(r.selfMarked) }));
  if (kind === 'gate') return recordGate(progress, assessmentId, score, at, version, items);
  if (kind === 'checkpoint') return recordCheckpoint(progress, assessmentId, score, at, version, items);
  if (kind === 'placement') return recordPlacement(progress, session.meta.checkpointId, score, at, version, items);
  if (kind === 'exam') return recordExam(progress, score, at, version, items);
  if (kind === 'practice') return recordPractice(progress, session.meta.module, score, at, session.meta.recalled ?? null);
  return recordOther(progress, assessmentId, score, at, version, items);
}

// Items for a given attempt. Every attempt gets fresh numbers; if a check's
// templates cannot make that many different versions, versions repeat.
function itemsFor(assessment, version) {
  const shape = assessment.kind === 'gate' ? 'gate' : null;
  const base = assessment.kind === 'gate' ? 4 : 2;
  try {
    return assessmentVersions(assessment.templates, assessment.id, { count: Math.max(base, version), shape })[version - 1];
  } catch {
    return assessmentVersions(assessment.templates, assessment.id, { count: base, shape })[(version - 1) % base];
  }
}

function startAssessment(root, id, requestedVersion) {
  mountChrome();
  let progress = store.load();
  // Own keys only: an address like ?id=constructor must not find Object's.
  const assessment = Object.hasOwn(ASSESSMENTS, id) ? ASSESSMENTS[id] : undefined;
  if (!assessment) {
    root.innerHTML = '<h1>Check not found</h1><p>There is no check with that name. Return to the course map to find your next step.</p>';
    return;
  }
  // Practice sets open with their module.
  const access = assessment.alwaysOpen ? { unlocked: true } : isUnlocked(assessment.kind === 'practice' ? assessment.module : assessment.id, progress);
  if (!access.unlocked) {
    root.innerHTML = `<h1>${escapeHTML(assessment.title)}</h1><div class="lock-notice"><p><strong>Not open yet.</strong> ${escapeHTML(access.reason)}</p></div>`;
    return;
  }
  // The demonstration gate lets ?v= choose a version; real checks use the learner's attempt count.
  const version = assessment.alwaysOpen && requestedVersion ? safeAttempt(requestedVersion) : nextVersion(progress, assessment.id);
  // A module's practice set also carries recall questions from any module
  // whose gate was failed recently (proposal: "Passing and retaking").
  const recalled = assessment.kind === 'practice' ? recallDue(progress).filter((m) => m !== assessment.module && MODULE_CONTENT[m]?.recallTemplates) : [];
  const recall = recalled.flatMap((m) => MODULE_CONTENT[m].recallTemplates);
  const items = itemsFor(recall.length ? { ...assessment, templates: withRecall(assessment.templates, recall) } : assessment, version);
  const meta = { assessmentId: assessment.id, kind: assessment.kind, version, ...(assessment.checkpointId ? { checkpointId: assessment.checkpointId } : {}), ...(assessment.module ? { module: assessment.module, recalled } : {}) };
  const saved = openSession(progress, assessment.id);
  let session = saved && saved.meta.version === version ? resumeSession(items, meta, saved.results) : createSession(items, meta);
  const attemptsAtStart = attemptsFor(progress, assessment.id);
  let pendingText = '';
  let examBegun = false;
  let practiceChosen = false;
  let stale = false;
  // A sitting that was already complete when saved (for example after a
  // template changed) is recorded now rather than left hanging.
  if (saved && isComplete(session)) progress = update((p) => recordResult(p, session, new Date().toISOString()));
  if (assessment.kind === 'gate') trackTime(assessment.id);

  document.title = `${assessment.title} · Personal Bookkeeping 101`;
  const about = assessment.kind === 'retention'
    ? '<p class="lede-small">Four weeks after the final exam, this short review shows what you still remember. It is optional and does not change your pass or your certificate.</p>'
    : '';
  root.innerHTML = `<h1>${escapeHTML(assessment.title)}</h1>${about}
    <p class="lede-small">Answer each question before you check it. Take as long as you need; nothing is timed.</p>
    <div id="item"></div><div id="response" aria-live="polite"></div>`;
  const itemBox = root.querySelector('#item');
  const responseBox = root.querySelector('#response');

  function show() {
    responseBox.innerHTML = '';
    if (isComplete(session)) {
      itemBox.innerHTML = resultsHTML(session);
      const s = summary(session);
      if (session.meta.kind === 'gate' && !s.passed) {
        const failed = (store.load().modules[session.meta.assessmentId]?.gateAttempts ?? []).filter((a) => !a.passed).length;
        itemBox.insertAdjacentHTML('beforeend', `<div class="next-step"><h3>What to do next</h3><p>${NEXT_STEPS[failureStep(failed)]}</p></div>`);
      }
      if (!s.passed) itemBox.insertAdjacentHTML('beforeend', errorLogFormHTML());
      if (session.meta.kind === 'exam' && s.passed) {
        itemBox.querySelector('#results-heading').insertAdjacentHTML('beforebegin', celebrationHTML());
        wireCelebration(itemBox.querySelector('.celebration'));
        itemBox.querySelector('#celebration-title').focus();
        return;
      }
      // Passing the last add-on check opens the final exam.
      if (session.meta.kind === 'gate' && session.meta.assessmentId === 'a3' && s.passed) {
        itemBox.querySelector('.verdict').insertAdjacentHTML('afterend', '<p><a class="button" href="assess.html?id=exam">Go to the final exam</a></p>');
      }
      itemBox.querySelector('#results-heading').focus();
      return;
    }
    // Already passed, with no sitting open: say so first; another sitting is
    // practice and never removes the pass.
    const passedOn = store.load().examPassedAt;
    if (session.meta.kind === 'exam' && session.results.length === 0 && !examBegun && passedOn && !practiceChosen) {
      itemBox.innerHTML = `<div class="feedback feedback-right"><p><strong>You passed the final exam on ${escapeHTML(longDate(passedOn))}.</strong></p>
        <p><button class="button button-secondary" type="button" data-action="practice-exam">Take the exam again for practice (your pass stays)</button></p></div>`;
      itemBox.insertAdjacentHTML('beforeend', celebrationHTML());
      wireCelebration(itemBox.querySelector('.celebration'));
      itemBox.querySelector('.celebration a.button')?.focus();
      return;
    }
    // Before the exam's first question: the author's note on honest work.
    if (session.meta.kind === 'exam' && session.results.length === 0 && !examBegun) {
      itemBox.innerHTML = examIntroHTML();
      return;
    }
    itemBox.innerHTML = itemHTML(currentItem(session), session.results.length, session.items.length);
    itemBox.querySelector('input, textarea, select')?.focus();
  }

  root.addEventListener('click', (e) => {
    const action = e.target.dataset?.action;
    if (action === 'next') show();
    if (action === 'begin-exam') { examBegun = true; show(); }
    if (action === 'practice-exam') { practiceChosen = true; show(); }
    if (action === 'add-line') {
      const tbody = itemBox.querySelector('.entry-table tbody');
      tbody.insertAdjacentHTML('beforeend', entryRowHTML(currentItem(session), tbody.rows.length));
      tbody.rows[tbody.rows.length - 1].querySelector('select').focus();
    }
  });

  // Enter inside the entry table moves to the next box instead of submitting.
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.closest?.('.entry-table')) return;
    e.preventDefault();
    const fields = [...itemBox.querySelectorAll('.entry-table select, .entry-table input')];
    const next = fields[fields.indexOf(e.target) + 1];
    (next ?? itemBox.querySelector('.answer-form button[type=submit]'))?.focus();
  });

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const kind = form.dataset.kind;
    if (kind === 'errorlog') {
      progress = update((p) => addErrorEntry(p, { moduleId: session.meta.assessmentId, error: form.error.value.trim(), cause: form.cause.value.trim(), correction: form.correction.value.trim() }, new Date().toISOString()));
      form.outerHTML = '<p class="feedback feedback-right" id="log-saved" tabindex="-1">Saved to your error log. Review it before your next try.</p>';
      root.querySelector('#log-saved').focus();
      return;
    }
    if (stale) return;
    let response;
    if (kind === 'numeric') response = form.answer.value;
    if (kind === 'amounts') response = [...form.querySelectorAll('[name=amount]')].map((el) => el.value);
    if (kind === 'entry') {
      const { lines, errors } = readEntry(form);
      if (errors.length) {
        responseBox.innerHTML = `<p class="feedback feedback-note">Check these amounts: ${escapeHTML(errors.map((x) => x.label).join(', '))}. Use digits, for example 75.14.</p>`;
        errors[0].field.focus();
        return;
      }
      response = lines;
    }
    if (kind === 'explain') { pendingText = form.text.value; response = { text: pendingText }; }
    if (kind === 'ticks') {
      const ticks = currentItem(session).rubric.map((_, i) => form.querySelector(`[name=tick][value="${i}"]`).checked);
      response = { text: pendingText, ticks };
    }

    const before = session.results.length;
    const previous = session;
    session = submit(session, response);
    const result = session.last;
    if (result.invalid) {
      responseBox.innerHTML = `<p class="feedback feedback-note">${escapeHTML(result.feedback)}</p>`;
      return;
    }
    if (result.selfMarked && session.results.length === before) {
      responseBox.innerHTML = selfMarkHTML(result, pendingText);
      itemBox.querySelector('form')?.querySelectorAll('textarea, button').forEach((el) => { el.disabled = true; });
      responseBox.querySelector('[name=tick]')?.focus();
      return;
    }
    // Another tab or window may have moved this sitting on. If so, keep its
    // version of events and ask the learner to reload.
    if (!sessionMatches(store.load(), session.meta, previous.results.length, attemptsAtStart)) {
      stale = true;
      session = previous;
      responseBox.innerHTML = '<p class="feedback feedback-wrong">This check was changed in another tab or window. Reload this page to continue from where it is now.</p>';
      itemBox.querySelectorAll('form input, form select, form textarea, form button').forEach((el) => { el.disabled = true; });
      return;
    }
    // Keep the sitting safe: save after every answer, record the result at the end.
    progress = update((p) => (isComplete(session)
      ? recordResult(p, session, new Date().toISOString())
      : saveSession(p, session.meta, session.results)));
    itemBox.querySelectorAll('form input, form select, form textarea, form button').forEach((el) => { el.disabled = true; });
    responseBox.innerHTML = feedbackHTML(result);
    responseBox.querySelector('[data-action=next]')?.focus();
  });

  show();
}
};

defs["js/app/certificate.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { certificateStatus, certificateHTML, certificateDocument, certificateFileName, cleanName, CERTIFICATE_CSS } = require("js/certificate.js");
const { saveCertificateName } = require("js/progress.js");
const { store, update, mountChrome } = require("js/app/chrome.js");
define(exports, { startCertificatePage: () => startCertificatePage });
// The certificate page: locked until the final project and the final exam
// are done; then the learner types their name as it should appear, and can
// print the certificate on one page or download it as a file.






function startCertificatePage(root) {
  mountChrome();
  const style = document.createElement('style');
  style.textContent = CERTIFICATE_CSS;
  document.head.appendChild(style);

  const progress = store.load();
  const status = certificateStatus(progress);
  if (!status.ready) {
    root.innerHTML = `<div class="lock-notice"><p><strong>Not yet.</strong> ${escapeHTML(status.reason)}</p>
      <p>Your certificate is waiting for you at the end of the course. <a href="index.html#course-map">Go to the course map</a>.</p></div>`;
    return;
  }

  root.innerHTML = `<form class="answer-form no-print" id="name-form">
      <label for="certificate-name">Your name, as it should appear on the certificate</label>
      <input id="certificate-name" name="name" autocomplete="name" maxlength="80" required value="${escapeHTML(progress.certificateName ?? '')}">
      <button class="button" type="submit">Show my certificate</button>
    </form>
    <div id="certificate-view"></div>`;
  const form = root.querySelector('#name-form');
  const view = root.querySelector('#certificate-view');

  function draw(name) {
    if (!cleanName(name)) { view.innerHTML = ''; return; }
    view.innerHTML = `${certificateHTML({ name, date: status.date })}
      <p class="certificate-actions no-print"><button class="button" type="button" id="print-certificate">Print</button>
      <button class="button button-secondary" type="button" id="download-certificate">Download as a file</button></p>
      <p class="no-print">To save a PDF, choose Print, then pick "Save as PDF" as the printer.</p>`;
    view.querySelector('#print-certificate').addEventListener('click', () => window.print());
    view.querySelector('#download-certificate').addEventListener('click', () => {
      const blob = new Blob([certificateDocument({ name, date: status.date })], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = certificateFileName(name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = cleanName(form.name.value);
    form.querySelector('.feedback-note')?.remove();
    form.name.removeAttribute('aria-invalid');
    if (!name) {
      form.name.setAttribute('aria-invalid', 'true');
      form.name.insertAdjacentHTML('afterend', '<p class="feedback feedback-note" id="name-note">Type your name as it should appear.</p>');
      form.name.setAttribute('aria-describedby', 'name-note');
      form.name.focus();
      return;
    }
    update((p) => saveCertificateName(p, name));
    draw(name);
    // Focus brings the certificate into view and tells screen readers it is there.
    const certificate = view.querySelector('.certificate');
    certificate?.setAttribute('tabindex', '-1');
    certificate?.focus();
  });
  if (progress.certificateName) draw(progress.certificateName);
}
};

defs["js/app/chrome.js"] = function (exports, require, define) {
const { createStorage, browserBackend, sessionBackend, windowNameBackend } = require("js/storage.js");
const { createFallingStore } = require("js/progressStore.js");
const { addTime } = require("js/progress.js");
const { readLargeText, writeLargeText, textSizeButtonHTML, LARGE_CLASS } = require("js/textSize.js");
define(exports, { store: () => store, mountChrome: () => mountChrome, update: () => update, replace: () => replace, onExternalChange: () => onExternalChange, trackTime: () => trackTime });
// Shared page furniture for saving: the progress store (localStorage, or a
// same-tab fallback when storage is blocked or full), the "Saved" indicator, the
// banners, time tracking, and refreshing when progress changes elsewhere.






let mounted = false; // set before the store, which may fall back at once
const primary = createStorage(browserBackend());
// When localStorage is blocked or full, progress still follows the learner from
// page to page in the same tab (sessionStorage, or window.name when that is
// blocked too), but is lost when the tab closes.
const store = createFallingStore(primary, [sessionBackend(), windowNameBackend()], {
  onFallBack: () => { if (mounted) storageBanner(); },
});

let indicator = null;
let hideTimer = null;
let flip = false;

function banner(className, text) {
  if (document.querySelector(`.${className}`)) return;
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  const topbar = document.querySelector('.topbar');
  (topbar ?? document.body.firstElementChild)?.insertAdjacentElement('afterend', p);
}

function storageBanner() {
  banner('storage-banner', 'Your browser is not letting this course save progress (storage is blocked or full). Your progress is kept while this tab stays open, but it will be lost when you close the tab. To keep it, use "Save a progress file" on the home page before closing, or open the course in a normal browser window.');
}

function safeLocalStorage() {
  try { return window.localStorage; } catch { return null; }
}

// The "Larger text" button, at the end of the top bar.
function mountTextSize(topbar) {
  if (!topbar || topbar.querySelector('.text-size-toggle')) return;
  const storage = safeLocalStorage();
  let on = readLargeText(storage);
  document.documentElement.classList.toggle(LARGE_CLASS, on);
  topbar.insertAdjacentHTML('beforeend', textSizeButtonHTML(on));
  const button = topbar.querySelector('.text-size-toggle');
  button.addEventListener('click', () => {
    on = !on;
    document.documentElement.classList.toggle(LARGE_CLASS, on);
    button.setAttribute('aria-pressed', String(on));
    writeLargeText(storage, on);
  });
}

function mountChrome() {
  const topbar = document.querySelector('.topbar');
  mountTextSize(topbar);
  if (topbar && !indicator) {
    indicator = document.createElement('span');
    indicator.className = 'saved-indicator';
    indicator.setAttribute('role', 'status');
    topbar.insertBefore(indicator, topbar.querySelector('.map-toggle'));
  }
  mounted = true;
  if (!store.available) storageBanner();
  store.load();
  if (store.recovered) {
    banner('storage-banner recovered-banner', 'Your saved progress could not be read, so the course started fresh. A copy of the damaged data was kept in this browser. If you saved a progress file, you can load it on the home page.');
  }
}

function flash(ok) {
  if (!indicator) return;
  flip = !flip;
  // Alternate the text so screen readers announce every save.
  indicator.textContent = ok ? (flip ? 'Saved' : 'Saved.') : 'Not saved';
  indicator.classList.toggle('not-saved', !ok);
  indicator.classList.add('visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => indicator.classList.remove('visible'), 2500);
}

// Applies a change to the latest saved progress and saves it.
function update(change) {
  const before = store.load();
  const next = change(before);
  const ok = store.save(next);
  flash(ok);
  return next;
}

// Replaces progress outright (loading a progress file).
function replace(progress) {
  const ok = store.save(progress);
  flash(ok);
  return ok;
}

// Calls back when progress may have changed elsewhere: another tab saved,
// or this page was restored from the browser's back/forward cache.
function onExternalChange(callback) {
  window.addEventListener('storage', (e) => { if (e.key === null || e.key?.startsWith('pb101-progress')) callback(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) callback(); });
}

// Adds the time this page is visible to a module's total.
function trackTime(moduleId) {
  let shownAt = document.visibilityState === 'visible' ? Date.now() : null;
  const flushTime = () => {
    if (shownAt === null) return;
    const ms = Date.now() - shownAt;
    shownAt = null;
    store.update((p) => addTime(p, moduleId, ms));
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushTime();
    else shownAt = Date.now();
  });
  window.addEventListener('pagehide', flushTime);
}
};

defs["js/app/home.js"] = function (exports, require, define) {
const { renderCourseMap } = require("js/app/nav.js");
const { exportProgress, importProgress } = require("js/progress.js");
const { escapeHTML } = require("js/html.js");
const { moduleName } = require("js/names.js");
const { store, replace, mountChrome, onExternalChange } = require("js/app/chrome.js");
define(exports, { startHomePage: () => startHomePage });
// Home page: course map with progress, the error log, and saving or loading
// a progress file (a backup, or a way to move to another device).







function errorLogHTML(log) {
  if (log.length === 0) return '<p>Nothing yet. When you miss a question in a check, you can note what went wrong here.</p>';
  const rows = [...log].reverse().map((e) => `<tr><td>${escapeHTML(new Date(e.at).toLocaleDateString())}</td><td>${escapeHTML(moduleName(e.moduleId))}</td><td>${escapeHTML(e.error)}</td><td>${escapeHTML(e.cause)}</td><td>${escapeHTML(e.correction)}</td></tr>`).join('');
  return `<div class="table-scroll" role="region" aria-label="Your error log" tabindex="0"><table class="results error-log"><thead><tr><th scope="col">Date</th><th scope="col">Where</th><th scope="col">What went wrong</th><th scope="col">Why</th><th scope="col">The correct way</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function startHomePage() {
  mountChrome();
  const draw = () => {
    const progress = store.load();
    renderCourseMap(document.getElementById('course-map'), progress, null, { headingLevel: 3 });
    document.getElementById('error-log').innerHTML = errorLogHTML(progress.errorLog);
  };
  draw();
  onExternalChange(draw);

  document.getElementById('export-progress').addEventListener('click', () => {
    const blob = new Blob([exportProgress(store.load())], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookkeeping-101-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  const status = document.getElementById('import-status');
  document.getElementById('import-progress').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = importProgress(await file.text());
    e.target.value = '';
    if (!result.ok) {
      status.textContent = `${result.reason} Your current progress has not changed.`;
      return;
    }
    if (!window.confirm('Replace your current progress with the progress in this file? Anything you did after the file was saved will be replaced.')) {
      status.textContent = 'Nothing changed.';
      return;
    }
    status.textContent = replace(result.progress) ? 'Progress loaded from the file.' : 'This browser could not store the progress. Try again in a normal browser window.';
    draw();
  });
}
};

defs["js/app/lesson.js"] = function (exports, require, define) {
const { MODULES, PHASES, PREREQUISITE } = require("content/course.js");
const { renderCourseMap, moduleIdFromParam, nextLinkHTML: nextLink } = require("js/app/nav.js");
const { isUnlocked, markStep, saveProject, completeModule } = require("js/progress.js");
const { parseAmount } = require("js/money.js");
const { escapeHTML } = require("js/html.js");
const { MODULE_CONTENT } = require("content/modules/index.js");
const { DEMO_LESSON } = require("content/modules/demo.js");
const { stepHTML, ledgerPanelHTML, gradePrediction, projectReady } = require("js/lessonView.js");
const { store, update, mountChrome, onExternalChange, trackTime } = require("js/app/chrome.js");
define(exports, { startLessonPage: () => startLessonPage, wireLayoutButtons: () => wireLayoutButtons });
// The lesson page controller: course map, lock notice, the lesson's steps
// with the ledger pinned beside them, step progress and time on the module.













function startLessonPage(search) {
  mountChrome();

  const param = new URLSearchParams(search).get('m');
  const isDemo = param === 'demo';
  const isPrereq = param === 'prereq';
  const id = param === null ? 'm01' : isDemo || isPrereq ? param : moduleIdFromParam(param);
  const module = isDemo ? { id: 'demo', title: DEMO_LESSON.title, phase: null }
    : isPrereq ? { id: 'prereq', title: PREREQUISITE.title, phase: null }
      : MODULES.find((m) => m.id === id);
  const content = isDemo ? DEMO_LESSON : MODULE_CONTENT[id];
  const mapBox = document.getElementById('course-map');
  const title = document.getElementById('module-title');
  const body = document.getElementById('lesson-body');

  if (!module) {
    renderCourseMap(mapBox, store.load(), null, { headingLevel: 3 });
    title.textContent = 'Module not found';
    body.innerHTML = '<p>There is no module with that name. Choose one from the course map.</p>';
    return;
  }
  title.textContent = module.title;
  document.getElementById('crumb').textContent = isDemo ? 'Sample lesson' : isPrereq ? 'Before you start' : PHASES[module.phase];
  document.title = `${module.title} · Personal Bookkeeping 101`;

  const ledgerBox = document.getElementById('ledger');
  let index = null;
  const revealed = new Set();
  const feedback = {};
  let figureResults = null;

  // The saved final-project record, with whether the module is complete.
  const projectState = () => {
    const record = store.load().modules[module.id];
    return { ...(record?.project ?? {}), completed: Boolean(record?.passed), figureResults };
  };

  function drawStep(focus) {
    const step = content.steps[index];
    body.innerHTML = stepHTML(content, index, { revealed: revealed.has(index), feedback: feedback[index], project: step.kind === 'project' ? projectState() : null });
    const panel = ledgerPanelHTML(step, { revealed: revealed.has(index) });
    ledgerBox.className = panel ? 'ledger-content' : 'ledger-placeholder';
    ledgerBox.closest('.ledger-panel')?.classList.toggle('empty', !panel);
    ledgerBox.innerHTML = panel
      ? `${panel}<p class="print-link"><a href="print.html?lesson=${encodeURIComponent(content.id)}&amp;step=${encodeURIComponent(step.id)}">Print this page</a></p>`
      : 'No ledger page for this step.';
    // After Next or Back: the step's heading, so the step is read from the top.
    // After a prediction: its feedback.
    if (focus === 'answered') (body.querySelector('#prediction-feedback') ?? body.querySelector('#step-title'))?.focus();
    else if (focus) body.querySelector('#step-title')?.focus();
    // Reaching the end of the lesson counts the last step as done.
    const last = index === content.steps.length - 1;
    const waiting = step.kind === 'predict' && !revealed.has(index);
    if (!isDemo && last && !waiting && !store.load().modules[module.id]?.steps.includes(step.id)) update((p) => markStep(p, module.id, step.id));
  }

  body.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action || index === null) return;
    if (action === 'next' || action === 'back') figureResults = null;
    if (action === 'next') {
      if (!isDemo) update((p) => markStep(p, module.id, content.steps[index].id));
      index += 1;
      drawStep(true);
    }
    if (action === 'back') { index -= 1; drawStep(true); }
    if (action === 'complete-project') {
      const step = content.steps[index];
      const state = projectState();
      const ready = projectReady(step, state);
      if (ready && !state.completed) update((p) => completeModule(p, module.id, new Date().toISOString()));
      renderCourseMap(mapBox, store.load(), module.id, { headingLevel: 3 });
      drawStep(false);
      body.querySelector('.project-check [role="status"]')?.focus();
    }
    if (action === 'reread') {
      body.querySelector('#step-title')?.focus();
    }
  });

  // Final project: the month chosen and each tick are saved as they change.
  body.addEventListener('change', (e) => {
    if (index === null || isDemo || content.steps[index].kind !== 'project') return;
    const input = e.target;
    if (input.name === 'project-path') {
      figureResults = null;
      update((p) => saveProject(p, module.id, { path: input.value }));
    } else if (input.dataset.list) {
      const list = input.dataset.list;
      const ticked = new Set(projectState()[list] ?? []);
      if (input.checked) ticked.add(Number(input.value)); else ticked.delete(Number(input.value));
      update((p) => saveProject(p, module.id, { [list]: [...ticked] }));
    } else return;
    drawStep(false);
    // Redrawing replaced the control, so put the focus back on its copy.
    body.querySelector(input.dataset.list ? `[data-list="${input.dataset.list}"][value="${input.value}"]` : `[name="${input.name}"][value="${input.value}"]`)?.focus();
  });

  body.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.dataset.kind === 'project-figures') {
      const step = content.steps[index];
      const typed = [...e.target.querySelectorAll('[name="figure"]')].map((x) => parseAmount(x.value));
      figureResults = step.figures.map((f, i) => typed[i].ok && typed[i].cents === f.answer);
      if (figureResults.every(Boolean)) update((p) => saveProject(p, module.id, { figuresOk: true }));
      const values = typed.map((t, i) => e.target.querySelectorAll('[name="figure"]')[i].value);
      drawStep(false);
      body.querySelectorAll('[name="figure"]').forEach((x, i) => { x.value = values[i]; });
      (body.querySelector('[aria-invalid="true"]') ?? body.querySelector('.project-check .feedback-right'))?.focus();
      return;
    }
    if (e.target.dataset.kind !== 'predict') return;
    const result = gradePrediction(content.steps[index], e.target.prediction.value);
    feedback[index] = result;
    if (!result.invalid) revealed.add(index);
    drawStep(result.invalid ? false : 'answered');
    if (result.invalid) body.querySelector('#prediction')?.focus();
  });

  function draw() {
    const progress = store.load();
    renderCourseMap(mapBox, progress, isDemo || isPrereq ? null : module.id, { headingLevel: 3 });
    const access = isDemo ? { unlocked: true } : isUnlocked(module.id, progress);
    if (!access.unlocked) {
      body.innerHTML = `<div class="lock-notice"><p><strong>This module is locked.</strong> ${escapeHTML(access.reason)}</p>
        <p>Each module opens when you pass the check at the end of the one before it, so you never build on a gap.</p>${nextLink(access.next)}</div>`;
      document.getElementById('ledger').textContent = 'The ledger page appears when the module opens.';
      return false;
    }
    if (!content) {
      body.innerHTML = '<p>This module\'s lessons are being written.</p>';
      return true;
    }
    if (index === null) {
      // Pick up at the first step not yet done (steps are saved by id, so
      // a step added later is not skipped).
      const done = new Set(progress.modules[module.id]?.steps ?? []);
      index = content.steps.findIndex((s) => !done.has(s.id));
      if (content.project) {
        // A learner comes back to the final project after days of work on
        // paper: checks answered before stay answered, and a project not yet
        // complete opens at its checklist.
        content.steps.forEach((s, i) => { if (s.kind === 'predict' && done.has(s.id)) revealed.add(i); });
        if (index === -1 && !progress.modules[module.id]?.passed) index = content.steps.length - 1;
      }
      if (index === -1) index = 0;
    }
    drawStep(false);
    return true;
  }

  const opened = draw();
  onExternalChange(() => {
    if (index === null || !content) { draw(); return; }
    renderCourseMap(mapBox, store.load(), isDemo ? null : module.id, { headingLevel: 3 });
    // A tick or a completion made in another tab shows here too.
    if (content.steps[index].kind === 'project') drawStep(false);
  });
  if (opened && !isDemo) trackTime(module.id);
}

function wireLayoutButtons() {
  const layout = document.getElementById('layout');
  const menu = document.querySelector('.menu-button');
  menu.addEventListener('click', () => {
    const open = layout.classList.toggle('map-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  const toggle = document.querySelector('.map-toggle');
  toggle.addEventListener('click', () => {
    const hidden = layout.classList.toggle('map-hidden');
    toggle.setAttribute('aria-expanded', String(!hidden));
    toggle.textContent = hidden ? 'Show course map' : 'Hide course map';
  });
}
};

defs["js/app/nav.js"] = function (exports, require, define) {
const { MODULES, PHASES, CHECKPOINTS } = require("content/course.js");
const { escapeHTML } = require("js/html.js");
const { isUnlocked, emptyProgress } = require("js/progress.js");
define(exports, { nextLinkHTML: () => nextLinkHTML, moduleIdFromParam: () => moduleIdFromParam, courseMapHTML: () => courseMapHTML, renderCourseMap: () => renderCourseMap });
// The course map: every module grouped by phase, with the checkpoints in
// place and the current module marked. courseMapHTML is pure so it can be
// tested in Node; renderCourseMap puts it on the page.





const CHECKPOINT_LABELS = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C' };
// Placement tests exist for Checkpoints A and B only.
const PLACEMENT_FOR = new Set(['ca', 'cb']);

// The way on from a lock notice: the checkpoint (with its placement test,
// where there is one) or the module to finish first.
function nextLinkHTML(next, modules = MODULES) {
  if (!next) return '';
  if (CHECKPOINT_LABELS[next]) {
    const placement = PLACEMENT_FOR.has(next) ? ` or <a href="assess.html?id=placement-${next}">take the placement test</a> if you already know this material` : '';
    return `<p><a class="button" href="assess.html?id=${next}">Go to ${CHECKPOINT_LABELS[next]}</a>${placement}.</p>`;
  }
  const m = modules.find((x) => x.id === next);
  return m ? `<p><a class="button" href="lesson.html?m=${m.id}">Go to ${escapeHTML(m.title)}</a></p>` : '';
}

function moduleLabel(m) {
  return m.id.startsWith('m') ? `${Number(m.id.slice(1))}. ${m.title}` : `${m.id.toUpperCase()}. ${m.title}`;
}

// Accepts the forms a learner or link might use: "9", "09", "m09", "A1".
// Canonical ids are the MODULES ids ("m09", "a1").
function moduleIdFromParam(text, modules = MODULES) {
  if (text == null) return null;
  const raw = String(text).trim().toLowerCase();
  const id = /^\d{1,2}$/.test(raw) ? `m${raw.padStart(2, '0')}` : raw;
  return modules.some((m) => m.id === id) ? id : null;
}

function state(progress, id, done) {
  if (done) return { cls: ' done', note: ' (done)' };
  if (!isUnlocked(id, progress).unlocked) return { cls: ' locked', note: ' (locked)' };
  return { cls: '', note: '' };
}

function courseMapHTML(progress, currentId, modules = MODULES, { headingLevel = 2 } = {}) {
  progress = { ...emptyProgress(''), ...(progress ?? {}) };
  const h = `h${headingLevel}`;
  const parts = [];
  let phase = null;
  for (const m of modules) {
    if (m.phase !== phase) {
      if (phase !== null) parts.push('</ol>');
      phase = m.phase;
      parts.push(`<${h} class="map-phase">${escapeHTML(PHASES[phase] ?? phase)}</${h}><ol class="map-list">`);
    }
    const current = m.id === currentId ? ' aria-current="page"' : '';
    const s = state(progress, m.id, progress.modules[m.id]?.passed);
    const note = s.note ? `<span class="visually-hidden">${s.note}</span>` : '';
    parts.push(`<li><a class="map-module${s.cls}" href="lesson.html?m=${escapeHTML(m.id)}"${current}>${escapeHTML(moduleLabel(m))}${note}</a></li>`);
    const cp = CHECKPOINTS.find((c) => c.after === m.id);
    if (cp) {
      const c = state(progress, cp.id, progress.checkpoints[cp.id]?.passed || progress.placement[cp.id]?.passed);
      const cnote = c.note ? `<span class="visually-hidden">${c.note}</span>` : '';
      parts.push(`<li><a class="map-checkpoint${c.cls}" href="assess.html?id=${cp.id}">${CHECKPOINT_LABELS[cp.id]}${cnote}</a></li>`);
    }
  }
  if (phase !== null) parts.push('</ol>');
  // After the add-on: the final exam, the certificate and the four-week review.
  if (modules === MODULES) {
    const exam = state(progress, 'exam', Boolean(progress.examPassedAt));
    const certificate = progress.examPassedAt && progress.modules.m15?.passed && progress.modules.m16?.passed ? { cls: '', note: '' } : { cls: ' locked', note: ' (locked)' };
    const review = state(progress, 'retention', progress.other.retention?.attempts?.length > 0);
    const item = (href, label, s) => `<li><a class="map-checkpoint${s.cls}" href="${href}">${label}${s.note ? `<span class="visually-hidden">${s.note}</span>` : ''}</a></li>`;
    parts.push(`<${h} class="map-phase">The finish</${h}><ol class="map-list">${item('assess.html?id=exam', 'Final exam', exam)}${item('certificate.html', 'Your certificate', certificate)}${item('assess.html?id=retention', 'Four-week review', review)}</ol>`);
  }
  return parts.join('');
}

function renderCourseMap(container, progress, currentId, options) {
  container.innerHTML = courseMapHTML(progress, currentId, MODULES, options);
}
};

defs["js/app/print.js"] = function (exports, require, define) {
const { ledgerHTML, blankPage, journalHTML, blankJournal } = require("js/ledgerView.js");
const { ledgerPanelHTML, sourceDocHTML } = require("js/lessonView.js");
const { reportHTML } = require("js/reports.js");
const { EVENT_DOC, payStubs, STATEMENT, openingNetWorthStatement, budgetPlan } = require("content/sampleMonth.js");
const { MODULE_CONTENT } = require("content/modules/index.js");
const { DEMO_LESSON } = require("content/modules/demo.js");
define(exports, { sheetFor: () => sheetFor, lessonSheet: () => lessonSheet, renderPrintPage: () => renderPrintPage });
// print.html?sheet=blank — a blank ledger sheet to print and fill in by hand.
// print.html?sheet=demo  — a filled example (answers hidden) for checking print layout.
// print.html?sheet=journal — a blank journal page.
// print.html?sheet=sample-month — the final project's sample month: the opening balances, the budget, what happened (with the plan), the pay stubs and the bank statement.
// Lesson sheets are added by id in later tasks.








const DEMO = {
  sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
  rows: [
    { date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] },
    { date: '2026-06-20', items: 'From paycheck, 15%', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance', 'side'] },
  ],
  minRows: 20,
};

function sheetFor(name) {
  if (name === 'blank') return { title: 'Blank ledger sheet', page: blankPage(25) };
  if (name === 'demo') return { title: 'Example ledger sheet', page: DEMO };
  if (name === 'journal') return { title: 'Blank journal page', html: journalHTML(blankJournal(25)) };
  if (name === 'sample-month') return { title: 'Final project: the sample month (Riley, July 2026)', html: [reportHTML(openingNetWorthStatement()), reportHTML(budgetPlan()), ...[EVENT_DOC, ...payStubs(), STATEMENT].map(sourceDocHTML)].join(''), note: 'Use your browser\'s print command, or the button below. This pack prints on more than one page: keep it beside you while you record the month.' };
  return null;
}

// The ledger pages of one lesson step, ready to print with answers hidden.
function lessonSheet(moduleId, stepId) {
  // Own keys only: an address like ?lesson=constructor must not find Object's.
  const lesson = moduleId === 'demo' ? DEMO_LESSON : Object.hasOwn(MODULE_CONTENT, moduleId) ? MODULE_CONTENT[moduleId] : undefined;
  const step = lesson?.steps.find((s) => s.id === stepId);
  if (!step) return null;
  const html = ledgerPanelHTML(step, { revealed: false });
  return html ? { title: `${lesson.title}: ${step.title ?? 'ledger page'}`, html } : null;
}

function renderPrintPage(container, name) {
  const sheet = sheetFor(name);
  if (!sheet) {
    container.innerHTML = '<p>There is no sheet with that name. <a href="print.html?sheet=blank">Print a blank ledger sheet</a> instead.</p>';
    return null;
  }
  container.innerHTML = sheet.html ?? ledgerHTML(sheet.page);
  return sheet.title;
}
};

defs["js/celebration.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { CELEBRATION } = require("content/celebration.js");
define(exports, { celebrationHTML: () => celebrationHTML, startCelebration: () => startCelebration, wireCelebration: () => wireCelebration });
// The celebration after the final exam is passed: the author's message,
// fireworks on a canvas and the Ode to Joy. Browsers do not let a page start
// sound by itself, so the music starts from the learner's click. A Stop
// button (or Escape) ends both. Learners who ask for less motion get slow,
// gentle sparkles instead of fireworks.




function celebrationHTML(text = CELEBRATION) {
  return `<section class="celebration" aria-labelledby="celebration-title">
  <h2 id="celebration-title" tabindex="-1">${escapeHTML(text.headline)}</h2>
  <p class="celebration-message">${escapeHTML(text.message)}</p>
  <p class="celebration-controls"><button class="button" type="button" data-action="celebrate">${escapeHTML(text.button)}</button>
  <button class="button button-secondary" type="button" data-action="stop-celebration" hidden>Stop the music and fireworks</button></p>
  <p><a class="button" href="certificate.html">Get your certificate</a></p>
  <p class="celebration-credit">${escapeHTML(text.musicCredit)} <a href="${escapeHTML(text.musicNotice.href)}">${escapeHTML(text.musicNotice.text)}</a>.</p>
</section>`;
}

// Saturated colours that show up on the course's light paper.
const COLORS = ['#d1495b', '#edae49', '#00798c', '#30638e', '#8e44ad', '#2a9d8f', '#e76f51'];

// Runs in the browser only. Returns a function that stops everything.
function startCelebration({ reducedMotion = false, music = CELEBRATION.music, onStop = () => {} } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'celebration-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const fit = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  fit();
  window.addEventListener('resize', fit);

  const audio = new Audio(music);
  audio.play().catch(() => {}); // a blocked or missing file leaves the fireworks running quietly

  let particles = [];
  let frame = null;
  let last = 0;
  let stopped = false;
  const rand = (a, b) => a + Math.random() * (b - a);

  function burst() {
    const x = rand(0.15, 0.85) * canvas.width;
    const y = rand(0.15, 0.5) * canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 * i) / 70;
      const speed = rand(1.5, 4.5);
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: rand(60, 100), color });
    }
  }

  function fireworks(t) {
    if (stopped) return;
    if (t - last > 650) { burst(); last = t; }
    // Fade the last frame out (trails) while keeping the page readable underneath.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.99; p.life -= 1;
      ctx.globalAlpha = Math.max(0, p.life / 100);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(fireworks);
  }

  // Reduced motion: a few still sparkles that slowly brighten and fade.
  let sparkleTimer = null;
  function sparkles() {
    const dots = Array.from({ length: 40 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.6, phase: Math.random() * Math.PI * 2, color: COLORS[Math.floor(Math.random() * COLORS.length)] }));
    let t = 0;
    sparkleTimer = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.15;
      for (const d of dots) {
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t + d.phase);
        ctx.fillStyle = d.color;
        ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }, 200);
  }

  if (reducedMotion) sparkles(); else frame = requestAnimationFrame(fireworks);

  function stop() {
    if (stopped) return;
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    if (sparkleTimer) clearInterval(sparkleTimer);
    audio.pause();
    audio.removeAttribute('src'); // let the browser stop fetching the file
    audio.load();
    window.removeEventListener('resize', fit);
    window.removeEventListener('keydown', onKey);
    canvas.remove();
    onStop();
  }
  function onKey(e) { if (e.key === 'Escape') stop(); }
  window.addEventListener('keydown', onKey);
  // The fireworks end with the music (about 50 seconds), or after a minute if it does not play.
  audio.addEventListener('ended', () => setTimeout(stop, 2500));
  setTimeout(() => { if (audio.paused) stop(); }, 60000);
  return stop;
}

// Wires a celebration section's buttons. Browser only.
function wireCelebration(section) {
  const start = section.querySelector('[data-action="celebrate"]');
  const stopButton = section.querySelector('[data-action="stop-celebration"]');
  let stop = null;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  start.addEventListener('click', () => {
    if (stop) return;
    start.hidden = true;
    stopButton.hidden = false;
    stopButton.focus();
    stop = startCelebration({ reducedMotion, onStop: () => {
      // Move focus only if it was on Stop, the control that is going away.
      const hadFocus = document.activeElement === stopButton;
      stop = null; start.hidden = false; stopButton.hidden = true;
      if (hadFocus) start.focus();
    } });
  });
  stopButton.addEventListener('click', () => stop?.());
}
};

defs["js/certificate.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { longDate } = require("js/dates.js");
define(exports, { COURSE_TITLE: () => COURSE_TITLE, CERTIFICATE_BODY: () => CERTIFICATE_BODY, UNOFFICIAL: () => UNOFFICIAL, cleanName: () => cleanName, certificateStatus: () => certificateStatus, certificateHTML: () => certificateHTML, CERTIFICATE_CSS: () => CERTIFICATE_CSS, certificateDocument: () => certificateDocument, certificateFileName: () => certificateFileName, longDate: () => longDate });
// The certificate of completion (author's request, October 24, 2026):
// unofficial and unaccredited, and it says so on its face. It opens once the
// final exam is passed and both parts of the final project are marked
// complete. Pure functions: the page (js/app/certificate.js) puts them on
// screen, prints them and offers the download.




const COURSE_TITLE = 'Personal Bookkeeping 101';
// True on every path through the course: the final project has no module
// check, and placement tests can skip the early checks.
const CERTIFICATE_BODY = 'worked through all 16 modules and the three add-on modules, kept, proved and reported a full month of books in the final project, and passed the 50-question final exam with at least 80% of the points.';
const UNOFFICIAL = 'This certificate is unofficial and unaccredited. It is not a degree, diploma, license or credential from any school, employer or government agency.';
const LICENCE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
const MAX_NAME = 80;
const LONG_NAME = 40;


// The name as the learner types it, trimmed, with runs of spaces closed up.
function cleanName(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

// Whether the certificate is open, and if not, what is still to do.
function certificateStatus(progress) {
  const missing = [];
  if (!progress?.modules?.m15?.passed || !progress?.modules?.m16?.passed) missing.push('mark both parts of the final project complete (Modules 15 and 16)');
  if (!progress?.examPassedAt) missing.push('pass the final exam');
  return missing.length
    ? { ready: false, reason: `To get your certificate, ${missing.join(' and ')}.` }
    : { ready: true, date: progress.examPassedAt };
}

// The certificate itself. Every text the learner typed is escaped.
function certificateHTML({ name, date }) {
  return `<article class="certificate" aria-label="Certificate of completion">
  <p class="certificate-kicker">Certificate of completion</p>
  <h2 class="certificate-course">${escapeHTML(COURSE_TITLE)}</h2>
  <p class="certificate-presented">This is to say that</p>
  <p class="certificate-name${cleanName(name).length > LONG_NAME ? ' certificate-name-long' : ''}">${escapeHTML(cleanName(name))}</p>
  <p class="certificate-body">${CERTIFICATE_BODY}</p>
  <p class="certificate-date">Completed on ${escapeHTML(longDate(date))}</p>
  <p class="certificate-unofficial">${escapeHTML(UNOFFICIAL)}</p>
  <p class="certificate-credit"><i>${escapeHTML(COURSE_TITLE)}</i> by Raul Bautista is licensed under <a href="${LICENCE_URL}" rel="license">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>
</article>`;
}

// Styles shared by the course page and the downloaded file. Plain, printable
// on one landscape page, no images and nothing loaded from elsewhere.
const CERTIFICATE_CSS = `
.certificate { box-sizing: border-box; max-width: 9.5in; margin: 0 auto; padding: .6in .7in; border: 6px double #2f5d46; background: #f7fbf6; color: #1d2a22; font-family: Georgia, 'Times New Roman', serif; font-size: 1rem; text-align: center; }
.certificate p { margin-top: .5em; margin-bottom: .5em; }
.certificate .certificate-kicker { font-variant: small-caps; letter-spacing: .12em; font-size: 1.1em; color: #2f5d46; }
.certificate .certificate-course { font-size: 2.1em; margin: .2em 0 .4em; }
.certificate .certificate-presented { font-style: italic; }
.certificate .certificate-name { font-size: 2em; border-bottom: 1px solid #2f5d46; display: inline-block; min-width: 60%; padding: 0 .5em .1em; margin: .3em 0 .6em; overflow-wrap: anywhere; }
.certificate .certificate-name-long { font-size: 1.45em; }
.certificate .certificate-body { max-width: 34em; margin-left: auto; margin-right: auto; line-height: 1.5; }
.certificate .certificate-date { font-weight: bold; margin-top: 1em; }
.certificate .certificate-unofficial { font-size: .85em; max-width: 40em; margin: 1.4em auto .4em; }
.certificate .certificate-credit { font-size: .8em; }
.certificate-credit a { color: inherit; }
@media screen and (max-width: 759px) {
  .certificate { padding: 1.2rem .9rem; }
  .certificate .certificate-course { font-size: 1.6em; overflow-wrap: anywhere; }
}
@media print {
  @page { size: landscape; margin: .4in; }
  .certificate { font-size: 12pt; padding: .4in .55in; margin-top: 0; page-break-inside: avoid; }
}
`;

// A complete, self-contained HTML file for download: it opens on its own,
// without the course.
function certificateDocument({ name, date }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(`Certificate: ${COURSE_TITLE} (${cleanName(name)})`)}</title>
<style>body { margin: 0; padding: .5in .3in; background: #fff; }${CERTIFICATE_CSS}</style>
</head>
<body>
${certificateHTML({ name, date })}
</body>
</html>
`;
}

// Accents are dropped for the file name: "Ana María López" -> ...-ana-maria-lopez.html.
const certificateFileName = (name) => `certificate-personal-bookkeeping-101-${cleanName(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'learner'}.html`;
};

defs["js/dates.js"] = function (exports, require, define) {
define(exports, { longDate: () => longDate });
// Dates written out in words, the way the course writes them everywhere:
// "2026-10-25T08:00:00.000Z" -> "October 25, 2026", in the learner's own
// time zone.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function longDate(when) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
};

defs["js/examView.js"] = function (exports, require, define) {
const { honorNoteHTML } = require("content/honor.js");
define(exports, { examIntroHTML: () => examIntroHTML });
// The screen before the final exam's first question: the author's note on
// honest work (content/honor.js), then a button to begin. Pure.



function examIntroHTML() {
  return `<div class="exam-intro">${honorNoteHTML('exam')}
  <p>The exam has 50 questions, and your answers are saved as you go. You need 80% of the points to pass.</p>
  <p><button class="button" type="button" data-action="begin-exam">I am ready. Begin the exam</button></p>
</div>`;
}
};

defs["js/grade.js"] = function (exports, require, define) {
const { parseAmount, formatCents } = require("js/money.js");
const { entryBalances } = require("js/ledger.js");
const { MODULES } = require("content/course.js");
define(exports, { gradeItem: () => gradeItem, scoreGate: () => scoreGate, scoreCheckpoint: () => scoreCheckpoint, scoreExam: () => scoreExam });
// Marking items and scoring gates, checkpoints and the final exam.
//
// Item fields by kind (from a template's build()):
//   numeric: { prompt, answer: cents, misconceptions?: [{ cents, explanation }], explanation }
//   entry:   { prompt, accounts: [{ id, label }], answer: [{ account, debit, credit }], explanation }
//   explain: { prompt, modelAnswer, rubric: [criterion, ...] }
//   amounts: { prompt, fields: [{ label, answer: cents }], explanation } — one point per field
// Responses: numeric -> typed text; entry -> [{ account, debit, credit }] in cents;
// explain -> { text, ticks?: [bool, ...] } (ticks are the learner's self-marking);
// amounts -> [typed text, ...] in field order.





const INVALID_MESSAGES = {
  empty: 'Type an amount first, for example 75.14.',
  'not-an-amount': 'That doesn\'t look like an amount. Use digits, for example 75.14 or $1,212.00.',
  'too-many-decimals': 'Money only goes to the cent: use at most two digits after the point.',
  'too-large': 'That amount is far too large. Check the number of digits.',
};

function gradeNumeric(item, typed) {
  const parsed = parseAmount(typed);
  if (!parsed.ok) return { invalid: true, feedback: INVALID_MESSAGES[parsed.reason] ?? INVALID_MESSAGES['not-an-amount'] };
  const max = item.points;
  if (parsed.cents === item.answer) {
    return { points: max, max, correct: true, feedback: `Correct. ${item.explanation ?? ''}`.trim() };
  }
  const known = (item.misconceptions ?? []).find((m) => m.cents === parsed.cents);
  return {
    points: 0,
    max,
    correct: false,
    misconception: known?.explanation,
    feedback: `The answer is $${formatCents(item.answer)}. ${known ? `${known.explanation} ` : ''}${item.explanation ?? ''}`.trim(),
  };
}

function totalsByAccount(lines) {
  const totals = new Map();
  for (const l of lines) {
    const t = totals.get(l.account) ?? { debit: 0, credit: 0 };
    t.debit += l.debit || 0;
    t.credit += l.credit || 0;
    totals.set(l.account, t);
  }
  return totals;
}

const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const accountsOn = (totals, side) => new Set([...totals].filter(([, t]) => t[side] > 0).map(([a]) => a));
// The amounts written on one side, per account, ignoring which account.
const amountsOn = (totals, side) => [...totals.values()].map((t) => t[side]).filter((n) => n > 0).sort((a, b) => a - b);
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// Four rubric lines, one point each (entry items are worth 4 points).
function gradeEntry(item, lines) {
  const given = lines.filter((l) => l.debit || l.credit);
  if (given.length === 0) return { invalid: true, feedback: 'Write at least one line with an account and an amount.' };
  if (given.some((l) => !l.account)) return { invalid: true, feedback: 'Every line with an amount needs an account. Choose one for each line.' };
  const want = totalsByAccount(item.answer);
  const got = totalsByAccount(given);
  const rubric = [
    { criterion: 'Debits the right accounts', met: sameSet(accountsOn(want, 'debit'), accountsOn(got, 'debit')) },
    { criterion: 'Credits the right accounts', met: sameSet(accountsOn(want, 'credit'), accountsOn(got, 'credit')) },
    { criterion: 'Uses the right amounts', met: sameList(amountsOn(want, 'debit'), amountsOn(got, 'debit')) && sameList(amountsOn(want, 'credit'), amountsOn(got, 'credit')) },
    { criterion: 'Debits equal credits', met: entryBalances({ lines: given }) },
  ];
  // Wrong accounts on both sides (most often debits and credits reversed)
  // earn nothing, so reversing the entries cannot add up to a pass.
  const bothSidesWrong = !rubric[0].met && !rubric[1].met;
  const reversed = sameSet(accountsOn(want, 'debit'), accountsOn(got, 'credit')) && sameSet(accountsOn(want, 'credit'), accountsOn(got, 'debit'));
  const points = bothSidesWrong ? 0 : rubric.filter((r) => r.met).length * (item.points / rubric.length);
  const correct = rubric.every((r) => r.met);
  const missed = rubric.filter((r) => !r.met).map((r) => r.criterion.toLowerCase());
  const check = !bothSidesWrong ? `Check: ${missed.join('; ')}.`
    : reversed ? 'The debits and credits are reversed: each account is on the wrong side. An entry like this earns no points.'
      : 'The accounts are wrong on both sides, so this entry earns no points. Check which pages go up and which go down.';
  return {
    points,
    max: item.points,
    correct,
    rubric,
    feedback: correct ? `Correct. ${item.explanation ?? ''}`.trim() : `${check} ${item.explanation ?? ''}`.trim(),
  };
}

function gradeExplain(item, response) {
  if (!String(response?.text ?? '').trim()) return { invalid: true, feedback: 'Write your explanation first, then compare it with the model answer.' };
  const shown = { selfMarked: true, max: item.points, modelAnswer: item.modelAnswer, rubric: item.rubric };
  if (!Array.isArray(response.ticks)) return shown;
  const met = response.ticks.slice(0, item.rubric.length).filter(Boolean).length;
  return { ...shown, points: Math.floor((met * item.points) / item.rubric.length) };
}

// Several labelled amounts (bucket shares, running balances), one point each.
// A blank or non-number field is not marked: the learner is asked to fix it.
function gradeAmounts(item, typed) {
  const parsed = item.fields.map((f, i) => ({ field: f, result: parseAmount(typed?.[i]) }));
  const bad = parsed.find((p) => !p.result.ok);
  if (bad) return { invalid: true, feedback: `Check "${bad.field.label}": ${INVALID_MESSAGES[bad.result.reason] ?? INVALID_MESSAGES['not-an-amount']}` };
  const rubric = parsed.map(({ field, result }) => ({ criterion: field.label, met: result.cents === field.answer, answer: field.answer }));
  const each = item.points / item.fields.length;
  const correct = rubric.every((r) => r.met);
  const misses = rubric.filter((r) => !r.met).map((r) => `${r.criterion}: $${formatCents(r.answer)}`);
  return {
    points: rubric.filter((r) => r.met).length * each,
    max: item.points,
    correct,
    rubric,
    feedback: correct ? `Correct. ${item.explanation ?? ''}`.trim() : `The right amounts: ${misses.join('; ')}. ${item.explanation ?? ''}`.trim(),
  };
}

function gradeItem(item, response) {
  if (item.kind === 'numeric') return gradeNumeric(item, response);
  if (item.kind === 'amounts') return gradeAmounts(item, response);
  if (item.kind === 'entry') return gradeEntry(item, response);
  if (item.kind === 'explain') return gradeExplain(item, response);
  throw new Error(`Unknown item kind: ${item.kind}`);
}

const sum = (results, key) => results.reduce((s, r) => s + r[key], 0);

const passesEighty = (points, max) => max > 0 && points * 100 >= 80 * max;

// Pass: 80% of the points, like every check (author's rule). Recording
// questions carry more points, so missing both of them cannot pass.
function scoreGate(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  const producing = sum(results.filter((r) => r.part === 'producing'), 'points');
  return { points, max, producing, passed: passesEighty(points, max) };
}

const percentOfMax = (points, max) => (max > 0 ? Math.round((points * 1000) / max) / 10 : 0);
const moduleOrder = (id) => {
  const i = MODULES.findIndex((m) => m.id === id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

function scoreCheckpoint(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  const missed = new Set(results.filter((r) => r.points < r.max).map((r) => r.module));
  const missedModules = [...missed].sort((a, b) => moduleOrder(a) - moduleOrder(b) || a.localeCompare(b));
  return { points, max, percent: percentOfMax(points, max), passed: passesEighty(points, max), missedModules };
}

function scoreExam(results) {
  const points = sum(results, 'points');
  const max = sum(results, 'max');
  return { percent: percentOfMax(points, max), passed: passesEighty(points, max) };
}
};

defs["js/html.js"] = function (exports, require, define) {
define(exports, { escapeHTML: () => escapeHTML });
// Shared HTML helpers.

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
};

defs["js/items.js"] = function (exports, require, define) {
define(exports, { seedFor: () => seedFor, generateItem: () => generateItem, assessmentVersions: () => assessmentVersions, gateVersions: () => gateVersions, withRecall: () => withRecall });
// Exercise and gate items are generated from templates, so every gate can
// have several equivalent versions with different names and amounts.
//
// A template:
//   { id, module, kind: 'numeric'|'entry'|'explain', part: 'interpreting'|'producing'|'explaining',
//     points, params: { name: { min, max, step } | { pick: [...] } | { byVersion: [...] } }, build(params) -> fields }
// A byVersion parameter takes its value from the version number (version 1
// gets the first value, and so on, round again), so the versions of a check
// cycle through every scenario; outside a versioned check it is picked at random.
// build() returns the item's prompt and answer fields (see js/grade.js).

// mulberry32: a small, fast, seeded pseudo-random generator.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A stable 32-bit seed from any list of keys (FNV-1a).
function seedFor(...parts) {
  let h = 0x811c9dc5;
  for (const ch of parts.join('\u0000')) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function sampleParams(spec, rand, version) {
  const params = {};
  for (const key of Object.keys(spec).sort()) {
    const s = spec[key];
    if (Array.isArray(s.byVersion)) {
      const pickAt = Math.floor(rand() * s.byVersion.length);
      params[key] = s.byVersion[version === null ? pickAt : version % s.byVersion.length];
    } else if (Array.isArray(s.pick)) {
      params[key] = s.pick[Math.floor(rand() * s.pick.length)];
    } else {
      const step = s.step ?? 1;
      if (![s.min, s.max, step].every(Number.isSafeInteger) || step <= 0) {
        throw new Error(`Parameter "${key}" must use whole-number min, max and step (use cents for money).`);
      }
      const count = Math.floor((s.max - s.min) / step) + 1;
      params[key] = s.min + step * Math.floor(rand() * count);
    }
  }
  return params;
}

function generateItem(template, seed, { version = null } = {}) {
  const params = sampleParams(template.params ?? {}, mulberry32(seed), version);
  return {
    ...template.build(params),
    templateId: template.id,
    module: template.module,
    kind: template.kind,
    part: template.part,
    points: template.points,
    seed,
    params,
  };
}

// A module gate: 10 questions (author's rule): seven 2-point interpreting
// items, two 4-point producing items and one 2-point explaining item, 24
// points in all.
const GATE_SHAPE = { interpreting: [2, 2, 2, 2, 2, 2, 2], producing: [4, 4], explaining: [2] };
const PARTS = new Set(['interpreting', 'producing', 'explaining']);
const MAX_TRIES = 200;

function checkTemplates(templates, id) {
  for (const t of templates) {
    if (!PARTS.has(t.part)) throw new Error(`Template ${t.id} in ${id} has unknown part "${t.part}".`);
    if (t.kind === 'entry' && t.points !== 4) throw new Error(`Entry template ${t.id} must be worth 4 points (one per rubric line).`);
  }
}

function checkGateShape(templates, id) {
  for (const [part, points] of Object.entries(GATE_SHAPE)) {
    const has = templates.filter((t) => t.part === part).map((t) => t.points).sort();
    if (JSON.stringify(has) !== JSON.stringify(points)) {
      throw new Error(`Gate ${id} needs ${part} items worth ${points.join(' + ')} points, has ${has.length ? has.join(' + ') : 'none'}.`);
    }
  }
}

// What must differ between versions: the answer, or for explanation items the prompt.
const versionKey = (item) => JSON.stringify(item.answer ?? item.fields?.map((f) => f.answer) ?? item.prompt);

// count versions of an assessment. Every version of every item has a
// different answer, unless its template is marked fixed. Seeds come from
// the assessment id, version and template id, so reordering templates
// changes nothing.
function assessmentVersions(templates, id, { count = 4, shape = null } = {}) {
  checkTemplates(templates, id);
  if (shape === 'gate') checkGateShape(templates, id);
  const versions = Array.from({ length: count }, () => []);
  templates.forEach((template, t) => {
    const used = new Set();
    for (let v = 0; v < count; v++) {
      let chosen = null;
      for (let salt = 0; salt < MAX_TRIES && !chosen; salt++) {
        const item = generateItem(template, seedFor(id, v, template.id, salt), { version: v });
        if (template.fixed || !used.has(versionKey(item))) chosen = item;
      }
      if (!chosen) throw new Error(`Template ${template.id} gives the same answer too often to make ${count} versions; widen its parameter ranges or mark it fixed.`);
      if (chosen.kind === 'amounts' && chosen.fields?.length !== template.points) throw new Error(`Amounts template ${template.id} needs one field per point (${template.points} fields).`);
      used.add(versionKey(chosen));
      versions[v][t] = chosen;
    }
  });
  return versions;
}

// Four versions of a module gate, one per attempt.
function gateVersions(templates, gateId) {
  return assessmentVersions(templates, gateId, { count: 4, shape: 'gate' });
}

// A practice set with recall scheduled after a failed gate: the recall goes
// first, under its own ids (so its numbers differ from any copy of the same
// template already in the set), and no template appears twice.
function withRecall(templates, recallTemplates) {
  const due = recallTemplates.map((t) => ({ ...t, id: `${t.id}-due` }));
  const seen = new Set();
  return [...due, ...templates].filter((t) => !seen.has(t.id) && seen.add(t.id));
}
};

defs["js/ledger.js"] = function (exports, require, define) {
define(exports, { normalSide: () => normalSide, runningBalances: () => runningBalances, entryBalances: () => entryBalances, postEntry: () => postEntry, trialBalance: () => trialBalance });
// Double-entry ledger arithmetic. A page is
//   { id, type, account, rows: [{ date, items, folio, debit, credit, posted: [dr, cr] }] }
// with amounts in cents. A journal entry is
//   { date, folio, explanation, lines: [{ account: pageId, debit, credit }] }.

const NORMAL_SIDE = { asset: 'Dr', expense: 'Dr', liability: 'Cr', income: 'Cr', networth: 'Cr' };

function normalSide(type) {
  const side = NORMAL_SIDE[type];
  if (!side) throw new Error(`Unknown account type: ${type}`);
  return side;
}

function runningBalances(page) {
  const normal = normalSide(page.type);
  let net = 0; // debits minus credits
  return page.rows.map((r) => {
    net += (r.debit || 0) - (r.credit || 0);
    const side = net > 0 ? 'Dr' : net < 0 ? 'Cr' : normal;
    return { balance: Math.abs(net), side };
  });
}

const isAmount = (n) => Number.isSafeInteger(n) && n >= 0;

// Balanced: every amount is whole, non-negative cents; each line is a debit
// or a credit, not both; and total debits equal total credits (above zero).
function entryBalances(entry) {
  let debits = 0;
  let credits = 0;
  for (const line of entry.lines) {
    const debit = line.debit || 0;
    const credit = line.credit || 0;
    if (!isAmount(debit) || !isAmount(credit)) return false;
    if (debit > 0 && credit > 0) return false;
    debits += debit;
    credits += credit;
  }
  return debits > 0 && debits === credits;
}

// Returns { pages, entry }: new page objects with the entry's lines posted
// (folio = journal page, ✓ on the posted side), and a copy of the entry whose
// lines carry the ledger account number as folio and a posted mark.
function postEntry(entry, pages) {
  if (!entryBalances(entry)) throw new Error('This entry does not balance: debits must equal credits.');
  const copy = pages.map((p) => ({ ...p, rows: p.rows.map((r) => ({ ...r, posted: [...(r.posted ?? [false, false])] })) }));
  const postedLines = [];
  for (const line of entry.lines) {
    const page = copy.find((p) => p.id === line.account);
    if (!page) throw new Error(`No ledger page for account: ${line.account}`);
    const debit = line.debit || 0;
    const credit = line.credit || 0;
    page.rows.push({
      date: entry.date,
      items: line.items ?? entry.explanation,
      folio: entry.folio,
      debit,
      credit,
      posted: [debit > 0, credit > 0],
    });
    postedLines.push({ ...line, folio: page.accountNo, posted: true });
  }
  return { pages: copy, entry: { ...entry, lines: postedLines } };
}

function trialBalance(pages) {
  let debits = 0;
  let credits = 0;
  for (const page of pages) {
    const balances = runningBalances(page);
    if (balances.length === 0) continue;
    const { balance, side } = balances[balances.length - 1];
    if (side === 'Dr') debits += balance;
    else credits += balance;
  }
  return { debits, credits, balanced: debits === credits };
}
};

defs["js/ledgerView.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { formatCents, parseAmount } = require("js/money.js");
const { runningBalances } = require("js/ledger.js");
define(exports, { blankJournal: () => blankJournal, blankPage: () => blankPage, readLedgerInputs: () => readLedgerInputs, ledgerHTML: () => ledgerHTML, journalHTML: () => journalHTML });
// Draws a ledger page as an HTML table, modelled on classic green
// double-entry ledger paper. Pure: returns a string.





const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'items', label: 'Items' },
  { key: 'folio', label: 'Folio' },
  { key: 'drTick', label: '✓', aria: 'Debit posted', tick: 0 },
  { key: 'debit', label: 'Debits', money: true },
  { key: 'crTick', label: '✓', aria: 'Credit posted', tick: 1 },
  { key: 'credit', label: 'Credits', money: true },
  { key: 'side', label: 'Dr/Cr' },
  { key: 'balance', label: 'Balance', money: true },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
  if (!m) return date || '';
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return date;
  return `${MONTHS[month - 1]} ${day}`;
}

// A blank journal page to print and fill in by hand.
function blankJournal(rowCount = 25) {
  return { sheetNo: '', name: '', entries: [], minRows: rowCount };
}

function blankPage(rowCount = 25) {
  return { blank: true, sheetNo: '', accountNo: '', name: '', account: '', rows: [], minRows: rowCount };
}

// Values to put in an editable sheet: what the learner (or the lesson) wrote,
// never a computed balance, so typing cannot leave a stale answer showing.
function inputValues(row) {
  return {
    date: row.date ?? '',
    items: row.items ?? '',
    folio: row.folio ?? '',
    debit: row.debit ? formatCents(row.debit) : '',
    credit: row.credit ? formatCents(row.credit) : '',
    side: row.side ?? '',
    balance: row.balance != null ? formatCents(row.balance) : '',
  };
}

// Reads [name, value] pairs from an editable sheet (names "r{row}-{column}")
// back into rows. Amounts are parsed to cents; bad amounts are reported.
function readLedgerInputs(pairs) {
  const rows = [];
  const errors = [];
  for (const [name, raw] of pairs) {
    const m = /^r(\d+)-(\w+)$/.exec(name);
    if (!m) continue;
    const i = Number(m[1]);
    const key = m[2];
    const value = String(raw ?? '').trim();
    const row = (rows[i] ??= { date: '', items: '', folio: '', debit: 0, credit: 0, posted: [false, false] });
    if (key === 'debit' || key === 'credit' || key === 'balance') {
      if (value === '') { if (key !== 'balance') row[key] = 0; continue; }
      const parsed = parseAmount(value);
      if (parsed.ok) row[key] = parsed.cents;
      else errors.push({ row: i, column: key, reason: parsed.reason });
    } else if (key === 'drTick' || key === 'crTick') {
      row.posted[key === 'drTick' ? 0 : 1] = value === 'true';
    } else if (key === 'side') {
      const side = value.toLowerCase();
      if (side === 'dr' || side === 'cr') row.side = side === 'dr' ? 'Dr' : 'Cr';
    } else if (key === 'date' || key === 'items' || key === 'folio') {
      row[key] = value;
    }
  }
  return { rows: rows.filter(Boolean), errors };
}

function cellValues(row, balance) {
  return {
    date: formatDate(row.date),
    items: row.items ?? '',
    folio: row.folio ?? '',
    drTick: row.posted?.[0] ? '✓' : '',
    debit: row.debit ? formatCents(row.debit) : '',
    crTick: row.posted?.[1] ? '✓' : '',
    credit: row.credit ? formatCents(row.credit) : '',
    side: balance ? balance.side : '',
    balance: balance ? formatCents(balance.balance) : '',
  };
}

function headerFields(page) {
  const field = (label, value) =>
    `<div class="ledger-field"><span class="ledger-field-label">${label}</span><span class="ledger-field-value">${escapeHTML(value ?? '')}</span></div>`;
  return `<div class="ledger-head">
  <div class="ledger-head-row">${field('Sheet No.', page.sheetNo)}${field('Account No.', page.accountNo)}</div>
  <div class="ledger-head-row">${field('Name', page.name)}${field('Account', page.account)}</div>
  <div class="ledger-head-row ledger-head-minor">${field('Terms', page.terms)}${field('Rating', page.rating)}${field('Credit limit', page.creditLimit ? formatCents(page.creditLimit) : '')}</div>
</div>`;
}

function ledgerHTML(page, { highlightRow = null, editable = false, showAnswers = false, minRows = page.minRows ?? 0 } = {}) {
  const active = page.activeColumns ? new Set(page.activeColumns) : null;
  const inactive = (key) => active && !active.has(key);
  const balances = page.type ? runningBalances(page) : [];
  const label = page.blank ? 'blank sheet' : page.account;

  const head = COLUMNS.map((c) => {
    const classes = [`col-${c.key}`];
    if (inactive(c.key)) classes.push('inactive');
    const aria = c.aria ? ` aria-label="${c.aria}"` : '';
    const title = inactive(c.key) ? ` title="You'll learn this in Module 3"` : '';
    return `<th scope="col" class="${classes.join(' ')}"${aria}${title}>${c.label}</th>`;
  }).join('');

  const rows = page.rows.length >= minRows ? page.rows : [...page.rows, ...Array.from({ length: minRows - page.rows.length }, () => ({}))];

  const body = rows.map((row, i) => {
    const hasAmount = Boolean(row.debit || row.credit);
    const values = editable ? inputValues(row) : cellValues(row, hasAmount ? balances[i] : null);
    const ask = new Set(row.ask || []);
    const cells = COLUMNS.map((c) => {
      const classes = [`col-${c.key}`];
      if (c.money) classes.push('money');
      if (inactive(c.key)) {
        classes.push('inactive');
        return `<td class="${classes.join(' ')}"></td>`;
      }
      const cellLabel = `Row ${i + 1} ${c.aria || c.label}`;
      if (editable) {
        if (c.tick !== undefined) {
          const pressed = Boolean(row.posted?.[c.tick]);
          return `<td class="${classes.join(' ')}"><button type="button" class="tick" name="r${i}-${c.key}" aria-pressed="${pressed}" aria-label="${cellLabel}">${pressed ? '✓' : ''}</button></td>`;
        }
        const value = ask.has(c.key) && !showAnswers ? '' : values[c.key];
        const type = c.key === 'date' ? ' type="date"' : '';
        const mode = c.money ? ' inputmode="decimal"' : '';
        return `<td class="${classes.join(' ')}"><input${type} name="r${i}-${c.key}" value="${escapeHTML(value)}" aria-label="${cellLabel}"${mode}></td>`;
      }
      if (ask.has(c.key)) {
        if (!showAnswers) return `<td class="${classes.join(' ')}"><span class="ask"><span class="visually-hidden">to work out</span></span></td>`;
        classes.push('answer');
      }
      return `<td class="${classes.join(' ')}">${escapeHTML(values[c.key])}</td>`;
    }).join('');
    const highlighted = i === highlightRow;
    const rowClass = highlighted ? ' class="highlight"' : '';
    const marked = highlighted ? cells.replace(/^(<td[^>]*>)/, '$1<span class="visually-hidden">(this line) </span>') : cells;
    return `<tr data-row="${i}"${rowClass}>${marked}</tr>`;
  }).join('\n');

  // Modules 1–2 hide the debit and credit columns; the amounts are written
  // beside the sheet as money in and money out instead.
  const notes = active && !active.has('debit') && !active.has('credit')
    ? page.rows.filter((r) => r.debit || r.credit).map((r) => `<li>${escapeHTML(formatDate(r.date))}: ${r.broughtForward ? `brought forward $${formatCents(r.debit || r.credit)}` : r.debit ? `money in $${formatCents(r.debit)}` : `money out $${formatCents(r.credit)}`}</li>`).join('')
    : '';
  const notesHTML = notes ? `<ul class="money-notes" aria-label="Money in and out">${notes}</ul>` : '';
  return `<div class="ledger-sheet">
${headerFields(page)}
<div class="ledger-scroll" tabindex="0" role="region" aria-label="Ledger page: ${escapeHTML(label)}">
<table class="ledger" aria-label="Ledger page: ${escapeHTML(label)}">
<thead><tr>${head}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</div>
${notesHTML}
</div>`;
}

// A journal page (book of original entry): Date, Items (debited accounts,
// then credited accounts indented, then the explanation), Folio (ledger
// account number once posted), Debits, Credits.
function journalHTML(page, { highlightEntry = null, minRows = page.minRows ?? 0 } = {}) {
  const rows = page.entries.map((entry, e) => {
    const cls = e === highlightEntry ? ' class="highlight"' : '';
    const ordered = [...entry.lines.filter((l) => l.debit > 0), ...entry.lines.filter((l) => !(l.debit > 0))];
    const lines = ordered.map((l, i) => {
      const date = i === 0 ? escapeHTML(formatDate(entry.date)) : '';
      const label = escapeHTML(l.label ?? l.account);
      const item = l.debit > 0 ? `<span class="journal-debit">${label}</span>` : `<span class="journal-credit">${label}</span>`;
      return `<tr data-entry="${e}"${cls}><td class="col-date">${date}</td><td class="col-items">${item}</td><td class="col-folio">${escapeHTML(l.folio ?? '')}</td><td class="col-debit money">${l.debit ? formatCents(l.debit) : ''}</td><td class="col-credit money">${l.credit ? formatCents(l.credit) : ''}</td></tr>`;
    }).join('');
    const why = `<tr data-entry="${e}"${cls}><td class="col-date"></td><td class="col-items journal-explanation">${escapeHTML(entry.explanation ?? '')}</td><td></td><td class="money"></td><td class="money"></td></tr>`;
    return lines + why;
  }).join('\n');
  const used = page.entries.reduce((n, e) => n + e.lines.length + 1, 0);
  const blanks = Array.from({ length: Math.max(0, minRows - used) }, () => '<tr><td class="col-date"></td><td class="col-items"></td><td class="col-folio"></td><td class="col-debit money"></td><td class="col-credit money"></td></tr>').join('\n');
  return `<div class="ledger-sheet journal-sheet">
<div class="ledger-head"><div class="ledger-head-row"><div class="ledger-field"><span class="ledger-field-label">Journal</span><span class="ledger-field-value">Page ${escapeHTML(page.sheetNo ?? '')}</span></div><div class="ledger-field"><span class="ledger-field-label">Name</span><span class="ledger-field-value">${escapeHTML(page.name ?? '')}</span></div></div></div>
<div class="ledger-scroll" tabindex="0" role="region" aria-label="Journal page ${escapeHTML(page.sheetNo ?? '')}">
<table class="ledger journal" aria-label="Journal page ${escapeHTML(page.sheetNo ?? '')}">
<thead><tr><th scope="col" class="col-date">Date</th><th scope="col" class="col-items">Items</th><th scope="col" class="col-folio">Folio</th><th scope="col" class="col-debit">Debits</th><th scope="col" class="col-credit">Credits</th></tr></thead>
<tbody>
${rows}${blanks ? `\n${blanks}` : ''}
</tbody>
</table>
</div>
</div>`;
}
};

defs["js/lessonView.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { ledgerHTML, journalHTML } = require("js/ledgerView.js");
const { reportHTML } = require("js/reports.js");
const { gradeItem } = require("js/grade.js");
const { formatCents } = require("js/money.js");
const { SOURCES } = require("content/sources.js");
const { RESOURCES } = require("content/resources.js");
define(exports, { gradePrediction: () => gradePrediction, sourceDocHTML: () => sourceDocHTML, ledgerPanelHTML: () => ledgerPanelHTML, citationHTML: () => citationHTML, projectReady: () => projectReady, projectHTML: () => projectHTML, lessonEndHTML: () => lessonEndHTML, stepHTML: () => stepHTML });
// Draws one lesson step (pure: returns HTML strings). The pinned ledger is
// drawn separately by ledgerPanelHTML so it can sit beside the text.









function gradePrediction(step, typed) {
  return gradeItem({ kind: 'numeric', points: 1, answer: step.answer, misconceptions: step.misconceptions, explanation: step.explanation }, typed);
}

// A source document drawn beside the ledger: a pay stub, receipt, check or
// bank statement, as { kind, title, lines: [[label, value, direction?], ...], note }.
// Numbers are whole cents and are written as money; text is shown as is. A
// statement line marked 'in' or 'out' shows its sign.
const SIGNS = { in: '+', out: '−' };
function sourceDocHTML(doc) {
  const rows = doc.lines.map(([label, value, direction]) => {
    const shown = typeof value === 'number' ? `${SIGNS[direction] ?? ''}$${formatCents(value)}` : value;
    return `<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(shown)}</td></tr>`;
  }).join('');
  return `<figure class="source-doc source-${escapeHTML(doc.kind)}"><figcaption>${escapeHTML(doc.title)}</figcaption><table>${rows}</table>${doc.note ? `<p class="source-note">${escapeHTML(doc.note)}</p>` : ''}</figure>`;
}

// Everything drawn beside a step or a question: source document, journal
// page, reports, and one or more ledger pages. Used by lessons and checks alike.
function ledgerPanelHTML(step, { revealed = false } = {}) {
  const parts = [];
  if (step.sourceDoc) parts.push(sourceDocHTML(step.sourceDoc));
  if (step.journalPage) parts.push(journalHTML(step.journalPage, { highlightEntry: step.highlightEntry ?? null }));
  for (const report of [...(step.report ? [step.report] : []), ...(step.reports ?? [])]) parts.push(reportHTML(report, { showAnswers: revealed }));
  const pages = [...(step.ledger ? [step.ledger] : []), ...(step.ledgers ?? [])];
  pages.forEach((page, i) => parts.push(ledgerHTML(page, { highlightRow: i === 0 ? (step.highlightRow ?? null) : null, showAnswers: revealed })));
  return parts.join('');
}

function citationHTML(step) {
  const ids = [step.source, ...(step.sources ?? [])].filter((id) => typeof id === 'string' && SOURCES[id]);
  if (ids.length === 0) return '';
  const items = ids.map((id) => {
    const s = SOURCES[id];
    return `<a href="${escapeHTML(s.url)}" rel="noopener">${escapeHTML(s.title)}</a>, ${escapeHTML(s.publisher)} (checked ${escapeHTML(s.accessed)})`;
  });
  return `<p class="citation">Source: ${items.join('; ')}</p>`;
}

const PRINT_SHEETS = { blank: 'a blank ledger sheet', journal: 'a blank journal page', 'sample-month': 'the sample month (what happened, pay stubs, bank statement)' };
function printLinksHTML(ids) {
  const links = ids.filter((id) => PRINT_SHEETS[id]).map((id) => `<a href="print.html?sheet=${escapeHTML(id)}">${escapeHTML(PRINT_SHEETS[id])}</a>`);
  return links.length ? `<p class="print-links">Print: ${links.join(' · ')}</p>` : '';
}

const helpLinksHTML = (module) => {
  const links = (module.resources ?? []).map((id) => RESOURCES[id]).filter(Boolean)
    .map((r) => `<li><a href="${escapeHTML(r.url)}" rel="noopener">${escapeHTML(r.title)}</a> (${escapeHTML(r.publisher)})</li>`).join('');
  return links ? `<h3>Free help from official sites</h3><p>Stuck? First reread the worked example and rework it by hand. Then try these:</p><ul class="help-links">${links}</ul>` : '';
};

// The end of a final-project module: no practice set or check; the next
// module opens once the project is marked complete.
function projectEndHTML(module, completed) {
  const next = module.next ? `<a class="button" href="lesson.html?m=${escapeHTML(module.next.id)}">Go to ${escapeHTML(module.next.title)}</a>` : '';
  const lead = completed
    ? `<p><strong>This part of the final project is complete.</strong></p>${next ? `<p class="lesson-end-links">${next}</p>` : ''}`
    : '<p><strong>You have reached the end of this part of the final project.</strong> Choose your month above. If you used the sample month, enter its figures. Then tick every item and mark this part complete to open the next module.</p>';
  return `<div class="lesson-end">${lead}${helpLinksHTML(module)}</div>`;
}

// True when the project step's conditions are met: a month chosen, the
// sample month's figures right if it was chosen, and every item ticked (only
// indices that exist on this step count).
function projectReady(step, { path = null, figuresOk = false, checklist = [], rubric = [] } = {}) {
  const count = (ticked, items) => new Set(ticked.filter((i) => Number.isInteger(i) && i >= 0 && i < items.length)).size;
  return (path === 'own' || (path === 'sample' && figuresOk))
    && count(checklist, step.checklist) === step.checklist.length && count(rubric, step.rubric) === step.rubric.length;
}

// The final project's last step: which month the learner kept, the sample
// month's key figures (all must be right), then the checklist and rubric,
// then the button that marks the module complete. state is the saved
// project record plus { completed, figureResults }.
function projectHTML(step, state = {}) {
  const { path = null, figuresOk = false, checklist = [], rubric = [], completed = false, figureResults = null } = state;
  const radio = (value, label) => `<label><input type="radio" name="project-path" value="${value}"${path === value ? ' checked' : ''}${completed ? ' disabled' : ''}> ${escapeHTML(label)}</label>`;
  let html = `<fieldset class="project-path"><legend>Which month did you keep?</legend>${radio('sample', step.sampleLabel ?? 'The sample month')}${radio('own', 'My own month')}<p class="fieldset-note">Choose the month you really kept. The checks only help you if you answer them honestly.</p></fieldset>`;
  if (path === 'sample' && !figuresOk) {
    const fields = step.figures.map((f, i) => {
      const r = figureResults?.[i];
      const note = r == null ? '' : r ? `<span class="figure-note figure-right" id="figure-note-${i}">✓ Matches</span>` : `<span class="figure-note figure-wrong" id="figure-note-${i}">Not yet: recheck this figure in your books</span>`;
      const describe = r == null ? '' : ` aria-describedby="figure-note-${i}"${r ? '' : ' aria-invalid="true"'}`;
      return `<div class="amount-field"><label for="figure-${i}">${escapeHTML(f.label)}</label><div class="answer-row"><span aria-hidden="true">$</span><input id="figure-${i}" name="figure" inputmode="decimal" autocomplete="off" required${describe}></div>${note}</div>`;
    }).join('');
    html += `<form class="answer-form project-figures" data-kind="project-figures"><p>Enter these figures from your own work on the sample month. All of them must match before the checklist opens.</p>${fields}<button class="button" type="submit">Check my figures</button></form>`;
  }
  if (path === 'sample' && figuresOk) html += '<p class="feedback feedback-right" role="status" tabindex="-1">All your figures match the sample month\'s books.</p>';
  const ready = path === 'own' || (path === 'sample' && figuresOk);
  if (ready) {
    const box = (list, ticked, i, text) => `<li><label><input type="checkbox" data-list="${list}" value="${i}"${ticked.includes(i) ? ' checked' : ''}${completed ? ' disabled' : ''}> ${escapeHTML(text)}</label></li>`;
    html += `<fieldset class="project-list"><legend>Checklist: tick each one you have done</legend><ul class="ticks">${step.checklist.map((c, i) => box('checklist', checklist, i, c)).join('')}</ul></fieldset>`;
    html += `<fieldset class="project-list"><legend>Rubric: tick each one your work meets</legend><ul class="ticks">${step.rubric.map((c, i) => box('rubric', rubric, i, c)).join('')}</ul></fieldset>`;
    const all = projectReady(step, state);
    html += completed
      ? `<p class="feedback feedback-right" role="status" tabindex="-1">${escapeHTML(step.completeLabel ?? 'Project')} is marked complete.</p>`
      : `<p><button class="button" type="button" data-action="complete-project"${all ? '' : ' disabled aria-describedby="complete-note"'}>Mark ${escapeHTML(step.completeLabel ?? 'the project')} complete</button></p>${all ? '' : '<p class="feedback-note" id="complete-note">Tick every item in the checklist and the rubric first.</p>'}`;
  }
  return `<div class="project-check">${html}</div>`;
}

function lessonEndHTML(module) {
  const check = escapeHTML(module.checkId ?? module.id);
  const practice = escapeHTML(module.practiceId ?? `${module.id}-practice`);
  const next = module.practiceId === null ? 'Take the check again when you are ready.' : 'Next, do the practice set, then take the module check: 10 questions, and you need 80% of the points to move on.';
  return `<div class="lesson-end"><p><strong>You have finished the lesson.</strong> ${next}</p>
    <p class="lesson-end-links">${module.practiceId === null ? '' : `<a class="button" href="assess.html?id=${practice}">Do the practice set</a> `}<a class="button button-secondary" href="assess.html?id=${check}">${module.practiceId === null ? 'Take the check again' : 'Take the module check'}</a></p>
    ${helpLinksHTML(module)}</div>`;
}

function stepHTML(module, index, { revealed = false, feedback = null, project = null } = {}) {
  const step = module.steps[index];
  const last = index === module.steps.length - 1;
  const core = index === 0 && module.coreIdea ? `<p class="core-idea"><strong>Core idea:</strong> ${escapeHTML(module.coreIdea)}</p>` : '';
  // The last paragraph of a prediction step is its question; the answer box points to it.
  const paras = step.text ?? [];
  const text = paras.map((p, i) => `<p${step.kind === 'predict' && i === paras.length - 1 ? ' id="step-question"' : ''}>${escapeHTML(p)}</p>`).join('');
  const title = step.title ? `<h2 class="step-title" id="step-title" tabindex="-1">${escapeHTML(step.title)}</h2>` : `<h2 class="visually-hidden" id="step-title" tabindex="-1">Step ${index + 1}</h2>`;
  let body = core + text + citationHTML(step) + printLinksHTML(step.printLinks ?? []);
  if (step.prompt) {
    const model = step.promptAnswer ? `<details class="model-answer"><summary>Compare with a model answer</summary><p>${escapeHTML(step.promptAnswer)}</p></details>` : '';
    body += `<div class="self-explain"><label for="self-explain">${escapeHTML(step.prompt)}</label><textarea id="self-explain" rows="3" placeholder="Say it in your own words before you go on."></textarea>${model}</div>`;
  }
  if (step.kind === 'project') body += projectHTML(step, project ?? {});
  const waiting = step.kind === 'predict' && !revealed;
  if (waiting) {
    const invalid = feedback?.invalid;
    const described = paras.length ? 'step-question' : '';
    const noteAttrs = invalid ? ` aria-invalid="true" aria-describedby="${described} prediction-note"` : described ? ` aria-describedby="${described}"` : '';
    body += `<form class="answer-form predict-form" data-kind="predict">
      <label for="prediction">Your prediction (in dollars)</label>
      <div class="answer-row"><span aria-hidden="true">$</span><input id="prediction" name="prediction" inputmode="decimal" autocomplete="off" required${noteAttrs}></div>
      ${invalid ? `<p class="feedback feedback-note" id="prediction-note">${escapeHTML(feedback.feedback)}</p>` : ''}
      <button class="button" type="submit">Check my prediction</button>
    </form>`;
  } else if (step.kind === 'predict' && feedback) {
    body += `<div class="feedback ${feedback.correct ? 'feedback-right' : 'feedback-wrong'}" id="prediction-feedback" role="status" tabindex="-1"><p>${escapeHTML(feedback.correct ? 'Your prediction was right.' : 'Not quite.')} ${escapeHTML(feedback.feedback)}</p></div>`;
  }
  const back = index > 0 ? '<button class="button button-secondary" type="button" data-action="back">◀ Back</button>' : '';
  const reread = '<button class="button button-secondary" type="button" data-action="reread">Reread this step</button>';
  const next = !last && !waiting ? '<button class="button" type="button" data-action="next">Next ▶</button>' : '';
  const finish = last && !waiting ? (module.project ? projectEndHTML(module, Boolean(project?.completed)) : lessonEndHTML(module)) : '';
  return `<p class="crumb">Step ${index + 1} of ${module.steps.length}</p>${title}${body}<div class="step-nav">${back}${reread}${next}</div>${finish}`;
}
};

defs["js/money.js"] = function (exports, require, define) {
define(exports, { parseAmount: () => parseAmount, formatCents: () => formatCents, percentOf: () => percentOf, divideRound: () => divideRound });
// Money is always whole cents (integers). These helpers convert between
// what a learner types, what a ledger shows, and cents.

const PLAIN = /^\d*(\.\d{0,2})?$/;
const GROUPED = /^[1-9]\d{0,2}(,\d{3})+(\.\d{0,2})?$/;
const MAX_WHOLE_DIGITS = 12; // up to $999,999,999,999.99

function parseAmount(text) {
  if (text == null) return { ok: false, reason: 'empty' };
  let s = String(text).trim();
  if (s.startsWith('$')) s = s.slice(1).trim();
  if (s === '' || s === '.') return { ok: false, reason: 'empty' };
  if (!PLAIN.test(s) && !GROUPED.test(s)) {
    if (/^[\d,]*\.\d{3,}$/.test(s)) return { ok: false, reason: 'too-many-decimals' };
    return { ok: false, reason: 'not-an-amount' };
  }
  const [whole, frac = ''] = s.replace(/,/g, '').split('.');
  if (whole.replace(/^0+/, '').length > MAX_WHOLE_DIGITS) return { ok: false, reason: 'too-large' };
  const cents = Number(whole || '0') * 100 + Number(frac.padEnd(2, '0'));
  return { ok: true, cents };
}

function assertCents(cents) {
  if (!Number.isSafeInteger(cents)) throw new TypeError(`Expected whole cents, got ${cents}`);
}

function formatCents(cents) {
  assertCents(cents);
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rest = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${rest}`;
}

// rate is a decimal such as 0.062 (6.2%). The exact amount is worked out in
// whole numbers, then rounded to the cent by the thousandths of a dollar
// (the tenths of a cent): "4 and below, keep it below; 5 and above, give it
// a shove." 121200 × 0.062 = $75.144 -> 4 -> $75.14; 1005 × 0.1 = $1.005 -> 5 -> $1.01.
// Digits after the thousandths never matter. Negative amounts round the same
// way on their size.
const SCALE = 10_000_000_000n;

function percentOf(cents, rate) {
  assertCents(cents);
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) throw new RangeError(`Rate must be a decimal between 0 and 1, got ${rate}`);
  const r = BigInt(Math.round(rate * Number(SCALE)));
  const exact = BigInt(cents) * r; // the amount in cents, times SCALE
  const sign = exact < 0n ? -1n : 1n;
  const tenthsOfCents = (exact * sign * 10n) / SCALE; // truncated after the thousandths of a dollar
  const thousandthsDigit = tenthsOfCents % 10n;
  const wholeCents = tenthsOfCents / 10n + (thousandthsDigit >= 5n ? 1n : 0n);
  return Number(wholeCents * sign);
}

// Divides whole cents by a whole number (for example an annual tax by 26
// paychecks), rounding to the cent by the same thousandths rule.
function divideRound(cents, divisor) {
  assertCents(cents);
  if (!Number.isSafeInteger(divisor) || divisor <= 0) throw new RangeError(`Divisor must be a positive whole number, got ${divisor}`);
  const sign = cents < 0 ? -1 : 1;
  const tenthsOfCents = Math.floor((Math.abs(cents) * 10) / divisor);
  const thousandthsDigit = tenthsOfCents % 10;
  return sign * (Math.floor(tenthsOfCents / 10) + (thousandthsDigit >= 5 ? 1 : 0));
}
};

defs["js/names.js"] = function (exports, require, define) {
define(exports, { moduleName: () => moduleName });
// Plain names for modules and checks, as learners see them: "m05" ->
// "Module 5", "a1" -> "Add-on A1".

const moduleName = (id) => (/^m\d\d$/.test(id) ? `Module ${Number(id.slice(1))}`
  : /^a\d$/.test(id) ? `Add-on ${id.toUpperCase()}`
    : id === 'prereq' ? 'Money arithmetic refresher'
      : { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C', exam: 'Final exam', retention: 'Four-week review', demo: 'Sample check', 'placement-ca': 'Placement test (Module 5)', 'placement-cb': 'Placement test (Module 9)' }[id] ?? id);
};

defs["js/offlineRouter.js"] = function (exports, require, define) {
define(exports, { PAGE_NAMES: () => PAGE_NAMES, routeFromHash: () => routeFromHash, offlineHref: () => offlineHref, startOffline: () => startOffline });
// The router for the double-click version (offline/course.js). Browsers refuse
// module scripts in a page opened straight from a file, and Firefox keeps the
// saved data of each file apart, so that version runs the whole course inside
// index.html: each page is shown by its address after "#/"
// (index.html#/lesson.html?m=m03), and the course's own links become moves
// within index.html. On the website none of this runs.

const PAGE_NAMES = ['index.html', 'lesson.html', 'assess.html', 'print.html', 'certificate.html'];

function decoded(text) {
  try { return decodeURIComponent(text); } catch { return text; }
}

// Which page the address after "#" asks for. "#/lesson.html?m=m03" is a page;
// any other "#name" is a place on the home page (index.html#course-map).
function routeFromHash(hash) {
  if (hash.startsWith('#/')) {
    const rest = hash.slice(2);
    const q = rest.indexOf('?');
    const page = q === -1 ? rest : rest.slice(0, q);
    if (!PAGE_NAMES.includes(page)) return { page: 'index.html', search: '', anchor: null };
    return { page, search: q === -1 ? '' : rest.slice(q), anchor: null };
  }
  return { page: 'index.html', search: '', anchor: hash.length > 1 ? decoded(hash.slice(1)) : null };
}

// Where a link to `url` should go inside index.html (`home` is index.html's
// own address): "#/page?query" for one of the course's pages, "#name" for a
// place on the home page, or null when the browser should follow the link
// itself (index.html with no place, other files, other sites).
function offlineHref(url, home) {
  if (url.protocol !== home.protocol || url.host !== home.host) return null;
  const dir = home.pathname.slice(0, home.pathname.lastIndexOf('/') + 1);
  if (!url.pathname.startsWith(dir)) return null;
  const name = url.pathname.slice(dir.length);
  if (!PAGE_NAMES.includes(name)) return null;
  if (name === 'index.html') return url.hash.length > 1 && !url.hash.startsWith('#/') ? url.hash : null;
  return `#/${name}${url.search}`;
}

// Runs in the browser, from offline/course.js in index.html's head, before the
// body is read. `pages` holds each page's title, stylesheets, body and start.
function startOffline(pages) {
  const route = routeFromHash(location.hash);
  const page = pages[route.page];
  document.title = page.title;
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) link.remove();
  for (const href of page.styles) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
  }
  // Hide index.html's own body until the right page has replaced it.
  const hide = document.createElement('style');
  hide.textContent = 'body { visibility: hidden; }';
  document.head.append(hide);
  // Each move reloads index.html, so the browser's own scroll memory would
  // carry the last page's position over. Each page's position is kept in its
  // history entry instead, and brought back on Back, Forward and Reload.
  history.scrollRestoration = 'manual';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = page.body;
    // Show the page before it starts: browsers will not focus anything in a
    // hidden page, and the checks put focus in the first answer box.
    hide.remove();
    page.start(route.search);
    // A page coming back (Back, Forward, Reload) returns to where it was left.
    // A page opened fresh stays where its start left it (the focused answer
    // box), unless the address names a place on it.
    const saved = history.state?.pb101Scroll;
    const place = route.anchor && document.getElementById(route.anchor);
    if (saved != null) window.scrollTo(0, saved);
    else if (place) goTo(place);
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(saveScroll, 150);
    }, { passive: true });
    window.addEventListener('pagehide', () => { clearTimeout(timer); saveScroll(); });
  });

  // Keeps this page's position in its own history entry, never in the entry
  // of a page the learner is already moving to.
  let timer = null;
  let openingFresh = false;
  function saveScroll() {
    if (openingFresh) return;
    const now = routeFromHash(location.hash);
    if (now.page !== route.page || now.search !== route.search) return;
    history.replaceState({ ...history.state, pb101Scroll: window.scrollY }, '');
  }

  // Moves to a place on the page the way a followed link does, so the next
  // Tab continues from there.
  function goTo(place) {
    if (!place.matches('a[href], button, input, select, textarea, [tabindex]')) place.setAttribute('tabindex', '-1');
    place.scrollIntoView(); // its top at the top, as a followed link puts it
    place.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest?.('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const raw = link.getAttribute('href');
    if (raw.startsWith('#') && !raw.startsWith('#/')) {
      // A skip link or another place on this same page: go there without
      // changing the address, which names the page being shown.
      e.preventDefault();
      const place = document.getElementById(decoded(raw.slice(1)));
      if (place) goTo(place);
      return;
    }
    const to = offlineHref(new URL(link.href), new URL(location.href));
    if (!to) return;
    e.preventDefault();
    clearTimeout(timer);
    if (to === location.hash) {
      // A link to the page already shown opens it fresh, at the top.
      history.replaceState({ ...history.state, pb101Scroll: null }, '');
      openingFresh = true;
      location.reload();
      return;
    }
    saveScroll();
    location.assign(to); // the hashchange below shows the new page
  });

  // A followed link, Back or Forward: show the page the address now names.
  window.addEventListener('hashchange', () => {
    const next = routeFromHash(location.hash);
    if (next.page === route.page && next.search === route.search) return;
    clearTimeout(timer);
    location.reload();
  });
}
};

defs["js/paycheck.js"] = function (exports, require, define) {
const { percentOf, divideRound } = require("js/money.js");
define(exports, { federalWithholding: () => federalWithholding, paycheck: () => paycheck });
// A paycheck from an hourly wage: gross pay, the standard deductions and
// take-home pay, all in cents. Tax figures come from content/tax2026.js.
// Rounding to the cent uses the course's thousandths rule throughout.



// IRS Pub. 15-T Worksheet 1A (Form W-4 from 2020 or later, Single or
// Married Filing Separately, nothing entered in Steps 2–4).
function federalWithholding(grossCents, tax, period = 'biweekly') {
  const periods = tax.federal.payPeriodsPerYear[period];
  if (!periods) throw new RangeError(`Unknown pay period "${period}"; use weekly, biweekly, semimonthly or monthly.`);
  const annual = grossCents * periods;
  const adjusted = Math.max(0, annual - tax.federal.line1gCents);
  let row = tax.federal.singleSchedule[0];
  for (const r of tax.federal.singleSchedule) if (adjusted >= r[0]) row = r;
  const [atLeast, tentative, rate] = row;
  const annualTax = tentative + percentOf(adjusted - atLeast, rate);
  return divideRound(annualTax, periods);
}

// hours may include quarter hours (80.25). Social Security is not capped
// here: course examples stay far below the yearly wage base.
function paycheck({ rateCents, hours, tax, period = 'biweekly' }) {
  const hundredths = Math.round(hours * 100);
  if (Math.abs(hours * 100 - hundredths) > 1e-6) throw new RangeError(`Hours must be given to the hundredth of an hour, got ${hours}.`);
  const gross = divideRound(rateCents * hundredths, 100);
  const socialSecurity = percentOf(gross, tax.socialSecurityRate);
  const medicare = percentOf(gross, tax.medicareRate);
  const federal = federalWithholding(gross, tax, period);
  const arizona = percentOf(gross, tax.arizonaDefaultRate);
  const net = gross - socialSecurity - medicare - federal - arizona;
  return { gross, socialSecurity, medicare, federal, arizona, net };
}
};

defs["js/progress.js"] = function (exports, require, define) {
const { MODULES, CHECKPOINTS } = require("content/course.js");
const { longDate } = require("js/dates.js");
define(exports, { PROGRESS_VERSION: () => PROGRESS_VERSION, emptyProgress: () => emptyProgress, isUnlocked: () => isUnlocked, recordGate: () => recordGate, completeModule: () => completeModule, saveProject: () => saveProject, saveCertificateName: () => saveCertificateName, recordCheckpoint: () => recordCheckpoint, recordPlacement: () => recordPlacement, recordOther: () => recordOther, recordExam: () => recordExam, failureStep: () => failureStep, attemptsFor: () => attemptsFor, nextVersion: () => nextVersion, sessionMatches: () => sessionMatches, saveSession: () => saveSession, openSession: () => openSession, clearSession: () => clearSession, markStep: () => markStep, addTime: () => addTime, addErrorEntry: () => addErrorEntry, saveLedger: () => saveLedger, recordPractice: () => recordPractice, recallDue: () => recallDue, completePracticeSet: () => completePracticeSet, exportProgress: () => exportProgress, validateProgress: () => validateProgress, importProgress: () => importProgress });
// A learner's progress: what they have done, what is unlocked, and what to
// do after a failed check. Plain data, changed only by these functions,
// which always return a new object.




const PROGRESS_VERSION = 1;
const APP = 'personal-bookkeeping-101';
const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = 28;
const RECALL_SETS = 3;

function emptyProgress(started = new Date().toISOString()) {
  return {
    version: PROGRESS_VERSION,
    started,
    modules: {},
    checkpoints: {},
    placement: {},
    exam: { attempts: [] },
    examPassedAt: null,
    sessions: {},
    recall: {},
    other: {},
    remedialNeeded: false,
    errorLog: [],
    ledgers: {},
  };
}

const clone = (p) => structuredClone(p);
const moduleRecord = (p, id) => (p.modules[id] ??= { steps: [], timeMs: 0, gateAttempts: [], passed: false });

const moduleTitle = (id) => {
  const m = MODULES.find((x) => x.id === id);
  if (!m) return id;
  return id.startsWith('m') ? `Module ${Number(id.slice(1))}` : `Add-on ${id.toUpperCase()}`;
};
const CHECKPOINT_NAMES = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C' };

const modulePassed = (p, id) => Boolean(p.modules[id]?.passed);
const moduleIndex = (id) => MODULES.findIndex((m) => m.id === id);

// The furthest checkpoint passed, as a checkpoint or as a placement test.
// Passing a later checkpoint counts every earlier one.
function furthestCheckpoint(p) {
  let best = -1;
  CHECKPOINTS.forEach((c, i) => {
    if (p.checkpoints[c.id]?.passed || p.placement[c.id]?.passed) best = Math.max(best, i);
  });
  return best;
}
const checkpointPassed = (p, id) => furthestCheckpoint(p) >= CHECKPOINTS.findIndex((c) => c.id === id);
// Modules up to the furthest passed checkpoint stay open for review.
const coveredModule = (p, id) => {
  const best = furthestCheckpoint(p);
  return best >= 0 && moduleIndex(id) <= moduleIndex(CHECKPOINTS[best].after);
};

const open = { unlocked: true };
const locked = (reason, next) => ({ unlocked: false, reason, ...(next ? { next } : {}) });

function isUnlocked(id, progress, now = Date.now()) {
  if (id === 'prereq' || id === 'placement' || id === 'm01' || id === 'placement-ca') return open;
  // The Module 9 placement test is a second stage: it covers Modules 5–8 and
  // opens once Modules 1–4 are counted as passed.
  if (id === 'placement-cb') return checkpointPassed(progress, 'ca') ? open : locked('Pass the Module 5 placement test (or Checkpoint A) first.', 'placement-ca');

  const cp = CHECKPOINTS.find((c) => c.id === id);
  if (cp) return modulePassed(progress, cp.after) || checkpointPassed(progress, id) ? open : locked(`Pass the check at the end of ${moduleTitle(cp.after)} first.`, cp.after);

  if (id === 'exam') return modulePassed(progress, 'a3') ? open : locked('Finish the add-on modules first.', 'a3');
  if (id === 'retention') {
    if (!progress.examPassedAt) return locked('This review opens four weeks after you pass the final exam.');
    const opens = Date.parse(progress.examPassedAt) + RETENTION_DAYS * DAY_MS;
    return now >= opens ? open : locked(`This review opens on ${longDate(opens)}, four weeks after your final exam.`);
  }

  const index = moduleIndex(id);
  if (index <= 0) return locked('There is no such module.');
  if (coveredModule(progress, id)) return open;
  const gateCheckpoint = CHECKPOINTS.find((c) => MODULES[index - 1].id === c.after);
  if (gateCheckpoint) {
    return checkpointPassed(progress, gateCheckpoint.id) ? open : locked(`Pass ${CHECKPOINT_NAMES[gateCheckpoint.id]} first${gateCheckpoint.id === 'cc' ? '' : ' (or the placement test)'}.`, gateCheckpoint.id);
  }
  const previous = MODULES[index - 1].id;
  return modulePassed(progress, previous) ? open : locked(`Finish ${moduleTitle(previous)} first.`, previous);
}

// items: per-question results [{ templateId, module, part, points, max, selfMarked }],
// kept for the evaluation plan (self-marking accuracy, per-module results).
function recordGate(progress, moduleId, score, at, version, items = []) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  m.gateAttempts.push({ at, version, points: score.points, max: score.max, passed: score.passed, items });
  if (score.passed) m.passed = true;
  else p.recall[moduleId] = RECALL_SETS;
  delete p.sessions[moduleId];
  return p;
}

// For modules without a gate (the final project).
function completeModule(progress, moduleId, at) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  m.passed = true;
  m.completedAt = at;
  return p;
}

// The final project's working state for one module: which month the learner
// keeps ('sample' or 'own'), whether the sample month's key figures were all
// right, and the checklist and rubric items ticked (by index).
function saveProject(progress, moduleId, { path, figuresOk, checklist, rubric }) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  const before = m.project ?? { path: null, figuresOk: false, checklist: [], rubric: [] };
  m.project = {
    path: path ?? before.path,
    figuresOk: figuresOk ?? before.figuresOk,
    checklist: [...new Set(checklist ?? before.checklist)].sort((x, y) => x - y),
    rubric: [...new Set(rubric ?? before.rubric)].sort((x, y) => x - y),
  };
  return p;
}

// The name the learner wants on the certificate (kept with their progress,
// so it travels in a progress file).
function saveCertificateName(progress, name) {
  const p = clone(progress);
  p.certificateName = String(name);
  return p;
}

function recordCheckpoint(progress, id, score, at, version, items = []) {
  const p = clone(progress);
  const c = (p.checkpoints[id] ??= { attempts: [], passed: false });
  c.attempts.push({ at, version, percent: score.percent, passed: score.passed, missedModules: score.missedModules ?? [], items });
  if (score.passed) c.passed = true;
  delete p.sessions[id];
  return p;
}

// A placement test is a checkpoint taken early; passing it unlocks the
// module after that checkpoint.
// Placement tests have the ids "placement-ca" and "placement-cb".
function recordPlacement(progress, checkpointId, score, at, version, items = []) {
  const p = clone(progress);
  const record = (p.placement[checkpointId] ??= { attempts: [], passed: false });
  record.attempts.push({ at, version, percent: score.percent, passed: score.passed, missedModules: score.missedModules ?? [], items });
  if (score.passed) record.passed = true;
  delete p.sessions[`placement-${checkpointId}`];
  return p;
}

// Other recorded checks: the prerequisite check ("prereq") and the
// four-week retention test ("retention"). A failed prerequisite check puts
// the learner in the group that needed the remedial unit.
function recordOther(progress, id, score, at, version, items = []) {
  const p = clone(progress);
  const record = (p.other[id] ??= { attempts: [], passed: false });
  record.attempts.push({ at, version, percent: score.percent, passed: score.passed, items });
  if (score.passed) record.passed = true;
  if (id === 'prereq' && !score.passed) p.remedialNeeded = true;
  delete p.sessions[id];
  return p;
}

function recordExam(progress, score, at, version, items = []) {
  const p = clone(progress);
  p.exam.attempts.push({ at, version, percent: score.percent, passed: score.passed, items });
  if (score.passed && !p.examPassedAt) p.examPassedAt = at;
  delete p.sessions.exam;
  return p;
}

// After a failed gate: 1st -> retake (after a fresh practice set),
// 2nd -> rework the worked example, 3rd and later -> remediation and help.
function failureStep(failedAttempts) {
  if (failedAttempts <= 1) return 'retake';
  if (failedAttempts === 2) return 'rework-example';
  return 'remediation';
}

function attemptsFor(progress, id) {
  if (id === 'exam') return progress.exam.attempts.length;
  const placement = /^placement-(c[abc])$/.exec(id);
  if (placement) return progress.placement[placement[1]]?.attempts.length ?? 0;
  if (progress.modules[id]) return progress.modules[id].gateAttempts.length;
  if (progress.checkpoints[id]) return progress.checkpoints[id].attempts.length;
  if (progress.other[id]) return progress.other[id].attempts.length;
  return 0;
}

// The version for the next sitting: an open session keeps its version;
// otherwise each attempt gets the next version number (1, 2, 3, ...).
function nextVersion(progress, id) {
  const openOne = progress.sessions[id];
  if (openOne) return openOne.meta.version;
  return attemptsFor(progress, id) + 1;
}

// Before saving an answer: true only if no other tab has changed this
// sitting since this page started it (same version, same number of saved
// answers, and no attempt finished in the meantime).
function sessionMatches(progress, meta, resultsBefore, attemptsAtStart) {
  if (attemptsFor(progress, meta.assessmentId) !== attemptsAtStart) return false;
  const stored = progress.sessions[meta.assessmentId];
  if (!stored) return resultsBefore === 0;
  return stored.meta.version === meta.version && stored.results.length === resultsBefore;
}

function saveSession(progress, meta, results) {
  const p = clone(progress);
  p.sessions[meta.assessmentId] = { meta, results };
  return p;
}

function openSession(progress, id) {
  return progress.sessions[id] ?? null;
}

function clearSession(progress, id) {
  const p = clone(progress);
  delete p.sessions[id];
  return p;
}

function markStep(progress, moduleId, step) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  if (!m.steps.includes(step)) m.steps.push(step);
  if (m.steps.every((s) => typeof s === 'number')) m.steps.sort((a, b) => a - b);
  return p;
}

function addTime(progress, moduleId, ms) {
  const p = clone(progress);
  moduleRecord(p, moduleId).timeMs += Math.max(0, Math.round(ms));
  return p;
}

function addErrorEntry(progress, { moduleId, error, cause, correction }, at) {
  const p = clone(progress);
  p.errorLog.push({ at, moduleId, error, cause, correction });
  return p;
}

function saveLedger(progress, pageId, rows) {
  const p = clone(progress);
  p.ledgers[pageId] = structuredClone(rows);
  return p;
}

// A finished practice set: kept for the evaluation plan, and it counts down
// any recall questions scheduled after a failed gate.
// recalled lists the modules whose scheduled recall this set carried; only
// those count down. Without it (sittings saved before this rule), all do.
function recordPractice(progress, moduleId, score, at, recalled = null) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  (m.practice ??= []).push({ at, percent: score.percent });
  return completePracticeSet(p, recalled);
}

// Modules whose recall questions should be added to the next practice sets.
function recallDue(progress) {
  return Object.entries(progress.recall).filter(([, n]) => n > 0).map(([id]) => id);
}

function completePracticeSet(progress, recalled = null) {
  const p = clone(progress);
  for (const id of Object.keys(p.recall).filter((m) => recalled === null || recalled.includes(m))) {
    p.recall[id] -= 1;
    if (p.recall[id] <= 0) delete p.recall[id];
  }
  return p;
}

function exportProgress(progress) {
  return JSON.stringify({ app: APP, ...progress }, null, 2);
}

const FIELDS = {
  started: 'string', modules: 'object', checkpoints: 'object', placement: 'object', exam: 'object',
  sessions: 'object', recall: 'object', other: 'object', remedialNeeded: 'boolean', errorLog: 'array', ledgers: 'object',
};

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

// A saved answer in an unfinished sitting, as session.js records it.
function validResult(r) {
  const text = (v) => v === undefined || typeof v === 'string';
  return typeOf(r) === 'object' && typeof r.templateId === 'string' && text(r.part) && text(r.module)
    && Number.isFinite(r.points) && Number.isFinite(r.max);
}

function validateProgress(data) {
  if (typeOf(data) !== 'object') return 'This is not a progress file.';
  if (data.version !== PROGRESS_VERSION) return `This progress file is from a different version of the course (${data.version ?? 'unknown'}).`;
  for (const [field, type] of Object.entries(FIELDS)) {
    if (!(field in data)) return `This progress file is missing "${field}".`;
    if (typeOf(data[field]) !== type) return `This progress file has a damaged "${field}".`;
  }
  if (!(data.examPassedAt === null || typeof data.examPassedAt === 'string')) return 'This progress file has a damaged "examPassedAt".';
  if (data.certificateName !== undefined && typeof data.certificateName !== 'string') return 'This progress file has a damaged "certificateName".';
  if (!Array.isArray(data.exam.attempts)) return 'This progress file has a damaged "exam".';
  for (const [id, m] of Object.entries(data.modules)) {
    if (typeOf(m) !== 'object' || !Array.isArray(m.steps) || typeof m.timeMs !== 'number' || !Array.isArray(m.gateAttempts) || typeof m.passed !== 'boolean') {
      return `This progress file has a damaged record for ${id}.`;
    }
    if (m.project !== undefined) {
      const pr = m.project;
      const indices = (list) => Array.isArray(list) && list.every((i) => Number.isInteger(i) && i >= 0);
      if (typeOf(pr) !== 'object' || ![null, 'sample', 'own'].includes(pr.path) || typeof pr.figuresOk !== 'boolean' || !indices(pr.checklist) || !indices(pr.rubric)) {
        return `This progress file has a damaged final-project record for ${id}.`;
      }
    }
  }
  for (const group of ['checkpoints', 'placement', 'other']) {
    for (const [id, c] of Object.entries(data[group])) {
      if (typeOf(c) !== 'object' || !Array.isArray(c.attempts) || typeof c.passed !== 'boolean') return `This progress file has a damaged record for ${id}.`;
    }
  }
  for (const [id, s] of Object.entries(data.sessions)) {
    if (typeOf(s) !== 'object' || typeOf(s.meta) !== 'object' || !Array.isArray(s.results) || !s.results.every(validResult)) return `This progress file has a damaged sitting for ${id}.`;
  }
  return null;
}

function importProgress(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'This file could not be read. Choose a progress file saved from this course.' };
  }
  if (typeOf(data) !== 'object' || data.app !== APP) return { ok: false, reason: 'This is not a Personal Bookkeeping 101 progress file.' };
  const { app, ...progress } = data;
  const problem = validateProgress(progress);
  if (problem) return { ok: false, reason: problem };
  return { ok: true, progress };
}
};

defs["js/progressStore.js"] = function (exports, require, define) {
const { emptyProgress, validateProgress } = require("js/progress.js");
const { createStorage } = require("js/storage.js");
define(exports, { PROGRESS_KEY: () => PROGRESS_KEY, createProgressStore: () => createProgressStore, createFallingStore: () => createFallingStore });
// Loads and saves a learner's progress through a storage wrapper
// (js/storage.js). Damaged saved data is kept aside, never silently lost.
// Every change should go through update(), which applies it to the latest
// saved progress so a page holding an old copy cannot overwrite newer work
// (another tab, or a page restored with the Back button).




const PROGRESS_KEY = 'pb101-progress';

function createProgressStore(storage, now = () => new Date().toISOString(), key = PROGRESS_KEY) {
  const store = {
    available: storage.available,
    recovered: false,
    load() {
      const raw = storage.getRaw(key);
      if (raw == null) return emptyProgress(now());
      const saved = storage.get(key);
      if (saved == null || validateProgress(saved)) {
        storage.set(`${key}-damaged-${now()}`, saved ?? raw);
        storage.set(key, emptyProgress(now()));
        store.recovered = true;
        return emptyProgress(now());
      }
      return saved;
    },
    save(progress) {
      return storage.set(key, progress);
    },
    update(change) {
      const next = change(store.load());
      store.save(next);
      return next;
    },
  };
  return store;
}

// A progress store that moves to a same-tab fallback when the main storage is
// blocked or full, or fills up later, and says so through onFallBack. The
// fallback is the first of `fallbacks` (raw backends: sessionStorage, then
// window.name) that works, opened only when needed. Progress is carried over,
// so the learner keeps their place, and is written back to the main storage
// as soon as it has room again.
function createFallingStore(primary, fallbacks, { onFallBack = () => {}, now, key = PROGRESS_KEY } = {}) {
  const valid = (p) => p != null && !validateProgress(p);
  const readFrom = (backend) => {
    try {
      const text = backend?.getItem(key);
      return text == null ? null : JSON.parse(text);
    } catch {
      return null;
    }
  };
  const clearFallbacks = () => {
    for (const backend of fallbacks) {
      try { if (backend?.getItem(key) != null) backend.removeItem(key); } catch { /* nothing to clear */ }
    }
  };
  let active = createProgressStore(primary, now, key);
  let fellBack = false;
  const fallBack = (carried) => {
    if (fellBack) return;
    fellBack = true;
    const fallback = fallbacks.map((backend) => createStorage(backend)).find((s) => s.available) ?? createStorage(undefined);
    active = createProgressStore(fallback, now, key);
    if (valid(carried)) active.save(carried);
    onFallBack();
  };

  // An earlier page in this tab may have left newer progress in the fallback.
  const left = fallbacks.map(readFrom).find(valid);
  const saved = primary.get(key);
  if (!primary.available) fallBack(left ?? saved);
  else if (left) {
    if (primary.set(key, left)) clearFallbacks();
    else fallBack(left);
  } else if (valid(saved) && !primary.set(key, saved)) {
    // Present but cannot be rewritten: the storage is full.
    fallBack(saved);
  }

  const store = {
    get available() { return !fellBack; },
    get recovered() { return active.recovered; },
    load: () => active.load(),
    save(progress) {
      if (active.save(progress)) return true;
      if (fellBack) return false;
      fallBack(progress);
      return active.save(progress);
    },
    update(change) {
      const next = change(store.load());
      store.save(next);
      return next;
    },
  };
  return store;
}
};

defs["js/reports.js"] = function (exports, require, define) {
const { escapeHTML } = require("js/html.js");
const { formatCents } = require("js/money.js");
define(exports, { reportRows: () => reportRows, checkReport: () => checkReport, reportTitle: () => reportTitle, reportHTML: () => reportHTML });
// Reports drawn on the same green ruled paper as the ledger (design §3): the
// trial balance, bank reconciliation, budget, income statement and
// net-worth statement. Content stores only the figures that go in; every
// total is worked out here, so a report cannot be drawn with a wrong total.
//
// Shapes (amounts in cents):
//   trial-balance:    { accounts: [{ no, name, debit? , credit? }], errorShown? }
//   income-statement: { period, income: [{ no, name, amount }], expenses: [...], netLabel? }
//   net-worth:        { date, assets: [{ no, name, amount }], liabilities: [...] }
//   budget:           { period, lines: [{ no, name, budget, actual }] }
//   reconciliation:   { date, statement, deposits: [{ label, amount }], payments: [...],
//                       pages: [{ no, name, amount }], interest: [...], fees: [...] }
// Every report has { report, name } and may list row keys in `ask` to hide.




const TITLES = {
  'trial-balance': 'Trial balance',
  'income-statement': 'Income statement',
  'net-worth': 'Net-worth statement',
  budget: 'Budget and actual',
  reconciliation: 'Bank reconciliation',
};

const sum = (list, key = 'amount') => list.reduce((s, x) => s + (x[key] || 0), 0);
const heading = (label) => ({ label, values: null, heading: true });
const line = (key, no, label, values) => ({ key, no, label, values });
const total = (key, label, values) => ({ key, label, values, total: true });

function listRows(prefix, list) {
  return list.map((x, i) => line(`${prefix}-${i}`, x.no ?? '', x.name ?? x.label, [x.amount]));
}
// A heading with its lines, or nothing when there are no lines.
const section = (label, prefix, list) => (list.length ? [heading(label), ...listRows(prefix, list)] : []);

const BUILDERS = {
  'trial-balance': (r) => ({
    columns: ['Debits', 'Credits'],
    rows: [
      ...r.accounts.map((a, i) => line(`line-${i}`, a.no, a.name, [a.debit || null, a.credit || null])),
      total('total', 'Totals', [sum(r.accounts, 'debit'), sum(r.accounts, 'credit')]),
    ],
  }),
  'income-statement': (r) => {
    const income = sum(r.income);
    const expenses = sum(r.expenses);
    return {
      columns: ['Amount'],
      rows: [
        heading('Income'), ...listRows('income', r.income), total('total-income', 'Total income', [income]),
        heading('Expenses'), ...listRows('expense', r.expenses), total('total-expenses', 'Total expenses', [expenses]),
        total('net', r.netLabel ?? (income >= expenses ? 'Added to net worth' : 'Taken from net worth'), [Math.abs(income - expenses)]),
      ],
    };
  },
  'net-worth': (r) => {
    const assets = sum(r.assets);
    const liabilities = sum(r.liabilities);
    return {
      columns: ['Amount'],
      rows: [
        heading('What you own (assets)'), ...listRows('asset', r.assets), total('total-assets', 'Total assets', [assets]),
        heading('What you owe (liabilities)'), ...listRows('liability', r.liabilities), total('total-liabilities', 'Total liabilities', [liabilities]),
        total('net', 'Net worth', [assets - liabilities]),
      ],
    };
  },
  // A plan written before the month has no actual amounts yet.
  budget: (r) => {
    const planOnly = r.lines.every((l) => l.actual == null);
    const under = (l) => (l.actual != null && l.actual < l.budget ? l.budget - l.actual : null);
    const over = (l) => (l.actual != null && l.actual > l.budget ? l.actual - l.budget : null);
    const totals = planOnly
      ? [sum(r.lines, 'budget'), null, null, null]
      : [sum(r.lines, 'budget'), sum(r.lines, 'actual'), r.lines.reduce((s, l) => s + (under(l) ?? 0), 0), r.lines.reduce((s, l) => s + (over(l) ?? 0), 0)];
    return {
      columns: ['Budget', 'Actual', 'Under', 'Over'],
      rows: [...r.lines.map((l, i) => line(`line-${i}`, l.no, l.name, [l.budget, l.actual ?? null, under(l), over(l)])), total('total', 'Totals', totals)],
    };
  },
  reconciliation: (r) => {
    const adjustedBank = r.statement + sum(r.deposits) - sum(r.payments);
    const book = sum(r.pages);
    const adjustedBook = book + sum(r.interest) - sum(r.fees);
    return {
      columns: ['Amount'],
      rows: [
        line('statement', '', 'Bank statement: closing balance', [r.statement]),
        ...section('Add: deposits not yet on the statement', 'deposit', r.deposits),
        ...section('Less: payments not yet on the statement', 'payment', r.payments),
        total('adjusted-bank', 'Adjusted bank balance', [adjustedBank]),
        heading('Your pages at this bank'), ...listRows('page', r.pages),
        total('book', 'Book balance', [book]),
        ...section('Add: interest not yet recorded', 'interest', r.interest),
        ...section('Less: fees not yet recorded', 'fee', r.fees),
        total('adjusted-book', 'Adjusted book balance', [adjustedBook]),
      ],
    };
  },
};

function reportRows(report) {
  const build = BUILDERS[report.report];
  if (!build) throw new Error(`Unknown report type: ${report.report}`);
  return build(report);
}

// Plain-language problems with a report's figures; an empty list means sound.
function checkReport(report) {
  if (!BUILDERS[report.report]) return [`unknown report type "${report.report}".`];
  const problems = [];
  const amounts = [];
  const r = report;
  if (r.report === 'trial-balance') {
    r.accounts.forEach((a) => {
      amounts.push(a.debit ?? 0, a.credit ?? 0);
      if (Boolean(a.debit) === Boolean(a.credit)) problems.push(`trial balance: ${a.name} needs its balance on exactly one side.`);
    });
  } else if (r.report === 'budget') {
    r.lines.forEach((l) => amounts.push(l.budget, l.actual ?? 0));
    if (r.lines.some((l) => l.actual == null) && r.lines.some((l) => l.actual != null)) problems.push('budget: give every line an actual amount, or none (a plan).');
  } else if (r.report === 'reconciliation') {
    amounts.push(r.statement);
    for (const k of ['deposits', 'payments', 'pages', 'interest', 'fees']) r[k].forEach((x) => amounts.push(x.amount));
  } else {
    for (const k of ['income', 'expenses', 'assets', 'liabilities']) (r[k] ?? []).forEach((x) => amounts.push(x.amount));
  }
  if (amounts.some((n) => !Number.isSafeInteger(n) || n < 0)) return [...problems, `${r.report}: every amount must be whole cents, not below zero.`];

  const rows = reportRows(r).rows;
  const value = (key) => rows.find((x) => x.key === key).values;
  if (r.report === 'trial-balance') {
    const [dr, cr] = value('total');
    if (dr !== cr && !r.errorShown) problems.push(`trial balance does not balance: debits ${dr}, credits ${cr}.`);
    if (dr === cr && r.errorShown) problems.push('trial balance is marked as showing an error, but it balances.');
  }
  if (r.report === 'net-worth' && value('net')[0] < 0) problems.push('net-worth statement: net worth is below zero.');
  if (r.report === 'reconciliation' && value('adjusted-bank')[0] !== value('adjusted-book')[0]) {
    problems.push(`bank reconciliation: the adjusted balances do not agree (bank ${value('adjusted-bank')[0]}, books ${value('adjusted-book')[0]}).`);
  }
  return problems;
}

const reportTitle = (report) => report.title ?? TITLES[report.report];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longDate = (d) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d ?? '');
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : (d ?? '');
};

// Draws a report on ledger paper. Rows whose key is in report.ask show
// blank boxes until showAnswers is true. Each row's label is its row header,
// so a screen reader names the line a blank box belongs to.
function reportHTML(report, { showAnswers = false } = {}) {
  const { columns, rows } = reportRows(report);
  const ask = new Set(report.ask ?? []);
  const title = reportTitle(report);
  const when = report.period ?? longDate(report.date);
  const head = `<tr><th scope="col" class="col-folio">No.</th><th scope="col" class="col-items">Items</th>${columns.map((c) => `<th scope="col" class="col-money">${escapeHTML(c)}</th>`).join('')}</tr>`;
  const body = rows.map((row) => {
    const cls = [row.total ? 'total' : '', row.heading ? 'heading' : ''].filter(Boolean).join(' ');
    const cells = columns.map((_, c) => {
      const v = row.values?.[c];
      if (v == null) return '<td class="money col-money"></td>';
      if (ask.has(row.key)) {
        if (!showAnswers) return '<td class="money col-money"><span class="ask"><span class="visually-hidden">to work out</span></span></td>';
        return `<td class="money col-money answer">${formatCents(v)}</td>`;
      }
      return `<td class="money col-money">${formatCents(v)}</td>`;
    }).join('');
    return `<tr${cls ? ` class="${cls}"` : ''}><td class="col-folio">${escapeHTML(row.no ?? '')}</td><th scope="row" class="col-items">${escapeHTML(row.label)}</th>${cells}</tr>`;
  }).join('\n');
  return `<div class="ledger-sheet report-sheet">
<div class="ledger-head"><div class="ledger-head-row"><div class="ledger-field"><span class="ledger-field-label">${escapeHTML(title)}</span><span class="ledger-field-value">${escapeHTML(when)}</span></div><div class="ledger-field"><span class="ledger-field-label">Name</span><span class="ledger-field-value">${escapeHTML(report.name ?? '')}</span></div></div></div>
<div class="ledger-scroll" tabindex="0" role="region" aria-label="${escapeHTML(title)}">
<table class="ledger report report-${escapeHTML(report.report)}" aria-label="${escapeHTML(title)}">
<thead>${head}</thead>
<tbody>
${body}
</tbody>
</table>
</div>
</div>`;
}
};

defs["js/session.js"] = function (exports, require, define) {
const { gradeItem, scoreGate, scoreCheckpoint, scoreExam } = require("js/grade.js");
define(exports, { createSession: () => createSession, resumeSession: () => resumeSession, currentItem: () => currentItem, isComplete: () => isComplete, submit: () => submit, summary: () => summary });
// One sitting of a gate, checkpoint or exam: the learner answers the items in
// order. Pure and immutable so it can be tested and saved.



// meta: { assessmentId, kind: 'gate'|'checkpoint'|'exam'|'placement'|'retention', version }
function createSession(items, meta = { kind: 'gate' }) {
  return { items, meta, results: [], last: null };
}

// Rebuilds a sitting from saved results. Results are kept only while they
// line up with the items (same template, same order).
function resumeSession(items, meta, savedResults = []) {
  const results = [];
  for (const r of savedResults) {
    if (items[results.length]?.templateId !== r.templateId) break;
    results.push(r);
  }
  return { items, meta, results, last: null };
}

function currentItem(session) {
  return session.items[session.results.length] ?? null;
}

function isComplete(session) {
  return session.results.length === session.items.length;
}

// Grades the response to the current item. Invalid input and the first step
// of a self-marked explanation (showing the model answer) leave the learner
// on the same item; everything else records a result and moves on.
function submit(session, response) {
  const item = currentItem(session);
  if (!item) return session;
  const result = gradeItem(item, response);
  if (result.invalid || (result.selfMarked && result.points === undefined)) {
    return { ...session, last: result };
  }
  const recorded = { ...result, module: item.module, part: item.part, templateId: item.templateId, response };
  return { ...session, results: [...session.results, recorded], last: recorded };
}

const SCORERS = { gate: scoreGate, checkpoint: scoreCheckpoint, placement: scoreCheckpoint, exam: scoreExam, retention: scoreExam, prereq: scoreExam, practice: scoreExam };

function summary(session) {
  return (SCORERS[session.meta?.kind] ?? scoreGate)(session.results);
}
};

defs["js/storage.js"] = function (exports, require, define) {
define(exports, { createStorage: () => createStorage, windowNameBackend: () => windowNameBackend, sessionBackend: () => sessionBackend, browserBackend: () => browserBackend });
// A safe wrapper over localStorage (or any object with getItem/setItem/
// removeItem). It never throws: private windows, blocked storage and full
// storage all just report that saving is unavailable or failed.

const PROBE = '__pb101_probe__';

function createStorage(backend) {
  let available = false;
  if (backend) {
    try {
      backend.setItem(PROBE, '1');
      backend.removeItem(PROBE);
      available = true;
    } catch {
      available = false;
    }
  }

  return {
    available,
    get(key) {
      const text = this.getRaw(key);
      if (text == null) return null;
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    },
    getRaw(key) {
      if (!backend) return null;
      try {
        return backend.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      if (!available) return false;
      try {
        backend.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };
}

// A fallback for when localStorage is blocked: keeps values in window.name,
// which survives moving between pages in the same tab (but not closing it).
const NAME_PREFIX = 'pb101:';

function windowNameBackend(win = globalThis.window) {
  const read = () => {
    try {
      return win.name.startsWith(NAME_PREFIX) ? JSON.parse(win.name.slice(NAME_PREFIX.length)) : {};
    } catch {
      return {};
    }
  };
  // An emptied store gives the tab its name back blank.
  const write = (data) => { win.name = Object.keys(data).length ? NAME_PREFIX + JSON.stringify(data) : ''; };
  return {
    getItem: (k) => read()[k] ?? null,
    setItem: (k, v) => { const d = read(); d[k] = String(v); write(d); },
    removeItem: (k) => { const d = read(); delete d[k]; write(d); },
  };
}

// The browser's sessionStorage: kept for one tab and one site, never handed
// to another site the tab moves on to (unlike window.name).
function sessionBackend() {
  try {
    return globalThis.sessionStorage ?? undefined;
  } catch {
    return undefined;
  }
}

// The browser's localStorage, if the page is allowed to touch it at all.
function browserBackend() {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}
};

defs["js/textSize.js"] = function (exports, require, define) {
define(exports, { TEXT_SIZE_KEY: () => TEXT_SIZE_KEY, LARGE_CLASS: () => LARGE_CLASS, readLargeText: () => readLargeText, writeLargeText: () => writeLargeText, textSizeButtonHTML: () => textSizeButtonHTML });
// The large-text option (proposal's accessibility rule): one button in the
// top bar makes all text 25% larger; the choice is remembered in this
// browser. Every size in the course's styles is relative, so ledgers grow too.

const TEXT_SIZE_KEY = 'pb101-large-text';
const LARGE_CLASS = 'large-text';

// Reading or writing browser storage can throw (private windows, blocked
// storage); the option then simply lasts for this page.
function readLargeText(storage) {
  try { return storage?.getItem(TEXT_SIZE_KEY) === '1'; } catch { return false; }
}
function writeLargeText(storage, on) {
  try { storage?.setItem(TEXT_SIZE_KEY, on ? '1' : '0'); } catch { /* not kept; still applied on this page */ }
}

function textSizeButtonHTML(on) {
  return `<button class="text-size-toggle" type="button" aria-pressed="${on ? 'true' : 'false'}">Larger text</button>`;
}
};

const done = {};
const loading = new Set();
function define(exports, getters) {
  for (const [name, get] of Object.entries(getters)) Object.defineProperty(exports, name, { enumerable: true, get });
}
function require(id) {
  if (done[id]) return done[id];
  if (loading.has(id)) throw new Error('import cycle at ' + id);
  loading.add(id);
  const exports = {};
  defs[id](exports, require, define);
  loading.delete(id);
  done[id] = exports;
  return exports;
}

const pages = {
  "index.html": {
    title: "Personal Bookkeeping 101",
    styles: ["css/site.css"],
    body: "<a class=\"skip-link\" href=\"#main\">Skip to the main content</a>\n\n  <header class=\"topbar\">\n    <a class=\"brand\" href=\"index.html\">Personal Bookkeeping <span>101</span></a>\n  </header>\n\n  <main class=\"home\" id=\"main\">\n    <h1>Personal Bookkeeping 101</h1>\n    <p class=\"lede\">Learn to follow every dollar of your paycheck on a real double-entry ledger page, by hand or on screen. Money is a system with rules, and once you know the rules there is nothing to fear.</p>\n    <section class=\"author-note\" aria-labelledby=\"author-note-start\"><h2 id=\"author-note-start\">A note from the author</h2><p>Welcome. Before you begin Module 1, I want to ask one thing of you.</p><p>Do the checks and the final exam on your own. Please do not use AI for answers, and do not ask other people for answers. This course is free. There is no money reward, and there is no benefit in cheating. If you cheat, you only hurt yourself.</p><p>Alexander the Great did not conquer much of the world by cheating. Marcus Aurelius did not strengthen the Roman Empire by cheating. No one was ever granted real recognition of greatness by cheating. They earned it.</p><p>Be the person your ancestors imagined you to be. Take your time, reread when you need to, and make mistakes along the way. That is how you learn. Earn your certificate.</p><p class=\"author-note-signature\">— Raul Bautista, author of Personal Bookkeeping 101</p></section>\n    <p><a class=\"button\" href=\"lesson.html?m=m01\">Start Module 1</a></p>\n    <p class=\"before-start\">New to working with money on paper? Take the <a href=\"assess.html?id=prereq\">five-minute money check</a> first. If it shows any gaps, the <a href=\"lesson.html?m=prereq\">money arithmetic refresher</a> covers them.</p>\n    <p class=\"before-start\">Already keep books? An optional placement test can move you ahead: <a href=\"assess.html?id=placement-ca\">start at Module 5</a> (10 questions on Modules 1–4). After passing it, a second test can <a href=\"assess.html?id=placement-cb\">start you at Module 9</a> (10 questions on Modules 5–8). Each needs 80% or more.</p>\n\n    <h2>What you will be able to do</h2>\n    <ul>\n      <li>Keep your own books on double-entry ledger paper, and prove they balance.</li>\n      <li>Budget with logic instead of emotion, by deciding where each dollar goes before you spend it.</li>\n      <li>Plan for the future and build an emergency fund.</li>\n      <li>Understand how the Federal Reserve, inflation and IRAs affect your money (add-on modules).</li>\n    </ul>\n\n    <h2>How the course works</h2>\n    <ul class=\"facts\">\n      <li><strong>16 modules</strong> plus 3 add-on modules</li>\n      <li><strong>2.5 hours</strong> per module: 1 hour of lessons, 90 minutes of practice</li>\n      <li><strong>About 8 weeks</strong> at two modules a week</li>\n      <li><strong>Your own pace</strong> reread any step as often as you need</li>\n    </ul>\n    <p>Every example is a page of ledger paper. Each module ends with a short check, and you move on once you have shown you understand it. If you need more time, take it; if you already know the early material, a placement test can move you ahead.</p>\n\n    <h2>Course map</h2>\n    <nav class=\"course-map-overview\" id=\"course-map\" aria-label=\"Course map\"></nav>\n\n    <h2>Your progress</h2>\n    <p>Your progress saves automatically in this browser, including after you close it. Open the course the same way each time: use the same web address, or double-click the same index.html file. In a private or incognito window, progress lasts only until that window is closed. To keep a backup, or to move to another device, save a progress file and load it there.</p>\n    <p class=\"progress-tools\">\n      <button class=\"button\" type=\"button\" id=\"export-progress\">Save a progress file</button>\n      <input class=\"visually-hidden\" type=\"file\" id=\"import-progress\" accept=\"application/json,.json\">\n      <label class=\"button button-secondary\" for=\"import-progress\">Load a progress file</label>\n    </p>\n    <p id=\"import-status\" role=\"status\"></p>\n\n    <h2>Your error log</h2>\n    <div id=\"error-log\"></div>\n  </main>\n\n  <footer class=\"site-footer\">\n    <p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" rel=\"license\">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>\n  </footer>",
    start(search) {
const { startHomePage } = require("js/app/home.js");
startHomePage();
    },
  },
  "lesson.html": {
    title: "Lesson · Personal Bookkeeping 101",
    styles: ["css/site.css","css/print.css","css/ledger.css"],
    body: "<a class=\"skip-link\" href=\"#lesson\">Skip to the lesson</a>\n\n  <header class=\"topbar\">\n    <button class=\"menu-button\" type=\"button\" aria-controls=\"course-map-nav\" aria-expanded=\"false\">Course map</button>\n    <a class=\"brand\" href=\"index.html\">Personal Bookkeeping <span>101</span></a>\n    <span class=\"spacer\"></span>\n    <button class=\"map-toggle\" type=\"button\" aria-controls=\"course-map-nav\" aria-expanded=\"true\">Hide course map</button>\n  </header>\n\n  <div class=\"lesson-layout\" id=\"layout\">\n    <nav class=\"course-map\" id=\"course-map-nav\" aria-label=\"Course map\">\n      <div id=\"course-map\"></div>\n    </nav>\n\n    <main class=\"lesson-text\" id=\"lesson\">\n      <p class=\"crumb\" id=\"crumb\"></p>\n      <h1 id=\"module-title\">Loading…</h1>\n      <div id=\"lesson-body\">\n        <p>This module's lessons are being written. Use the course map to see where it fits in the course.</p>\n      </div>\n    </main>\n\n    <aside class=\"ledger-panel\" aria-label=\"Ledger page\">\n      <div class=\"ledger-pin\">\n        <p class=\"ledger-caption\">The ledger page stays here while you read.</p>\n        <div class=\"ledger-placeholder\" id=\"ledger\">The ledger page for this step will appear here.</div>\n      </div>\n    </aside>\n  </div>\n\n  <footer class=\"site-footer\">\n    <p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" rel=\"license\">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>\n  </footer>",
    start(search) {
const { startLessonPage, wireLayoutButtons } = require("js/app/lesson.js");
wireLayoutButtons();
startLessonPage(search);
    },
  },
  "assess.html": {
    title: "Check your understanding · Personal Bookkeeping 101",
    styles: ["css/site.css","css/print.css","css/ledger.css"],
    body: "<a class=\"skip-link\" href=\"#main\">Skip to the questions</a>\n\n  <header class=\"topbar\">\n    <a class=\"brand\" href=\"index.html\">Personal Bookkeeping <span>101</span></a>\n  </header>\n\n  <main class=\"home assess\" id=\"main\"></main>\n\n  <footer class=\"site-footer\">\n    <p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" rel=\"license\">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>\n  </footer>",
    start(search) {
const { startAssessment } = require("js/app/assess.js");
const params = new URLSearchParams(search);
startAssessment(document.getElementById('main'), params.get('id') || 'demo', params.has('v') ? Number(params.get('v')) : null);
    },
  },
  "print.html": {
    title: "Print a ledger sheet · Personal Bookkeeping 101",
    styles: ["css/site.css","css/ledger.css","css/print.css"],
    body: "<a class=\"skip-link\" href=\"#main\">Skip to the sheet</a>\n\n  <header class=\"topbar\">\n    <a class=\"brand\" href=\"index.html\">Personal Bookkeeping <span>101</span></a>\n  </header>\n\n  <main class=\"home print-page\" id=\"main\">\n    <h1 class=\"no-print\" id=\"sheet-title\">Print a ledger sheet</h1>\n    <p class=\"no-print\" id=\"sheet-note\">Use your browser's print command, or the button below. The sheet prints on one landscape page.</p>\n    <p class=\"no-print\"><button class=\"button print-button\" type=\"button\" id=\"print-button\">Print this sheet</button></p>\n    <div id=\"sheet\"></div>\n  </main>\n\n  <footer class=\"site-footer\">\n    <p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" rel=\"license\">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>\n  </footer>",
    start(search) {
const { renderPrintPage, lessonSheet, sheetFor } = require("js/app/print.js");
const params = new URLSearchParams(search);
let title;
const fromLesson = params.has('lesson') ? lessonSheet(params.get('lesson'), params.get('step')) : null;
if (fromLesson) {
  document.getElementById('sheet').innerHTML = fromLesson.html;
  title = fromLesson.title;
} else {
  title = renderPrintPage(document.getElementById('sheet'), params.get('sheet') || 'blank');
  const note = sheetFor(params.get('sheet') || 'blank')?.note;
  if (note) document.getElementById('sheet-note').textContent = note;
}
if (title) {
  document.getElementById('sheet-title').textContent = title;
  document.title = `${title} · Personal Bookkeeping 101`;
}
document.getElementById('print-button').addEventListener('click', () => window.print());
    },
  },
  "certificate.html": {
    title: "Your certificate · Personal Bookkeeping 101",
    styles: ["css/site.css","css/print.css"],
    body: "<a class=\"skip-link\" href=\"#main\">Skip to the certificate</a>\n\n  <header class=\"topbar\">\n    <a class=\"brand\" href=\"index.html\">Personal Bookkeeping <span>101</span></a>\n  </header>\n\n  <main class=\"home certificate-page\" id=\"main\">\n    <h1 class=\"no-print\">Your certificate</h1>\n    <div id=\"certificate-root\"></div>\n  </main>\n\n  <footer class=\"site-footer\">\n    <p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" rel=\"license\">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>\n  </footer>",
    start(search) {
const { startCertificatePage } = require("js/app/certificate.js");
startCertificatePage(document.getElementById('certificate-root'));
    },
  },
};

globalThis.pb101Offline = { require, pages, modules: Object.keys(defs) };
if (typeof document !== 'undefined') require("js/offlineRouter.js").startOffline(pages);
})();
