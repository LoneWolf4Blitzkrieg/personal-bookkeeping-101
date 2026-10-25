// Module 9: Proving your books. Ideas: trial-balance, common-errors,
// error-by-size. Trial balances are drawn as reports (js/reports.js), which
// work out their own totals. Amounts are illustrative.

import { money, NAMES, explainTemplate, chartPage, CHART } from '../helpers.js';
import { M05_LESSON } from './m05.js';
import { M07_LESSON } from './m07.js';
import { M08_LESSON, M08_GATE } from './m08.js';

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
// $74.15), or null when there are no two different digits to swap.
function swapped(c) {
  const d = Math.floor(c / 100);
  const tens = Math.floor(d / 10) % 10;
  const ones = d % 10;
  if (d < 10 || tens === ones) return null;
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

// --- Lesson -------------------------------------------------------------------

// Sam's June: the same books are closed and reported in Module 12.
const JUNE = [
  acct('spending', 'debit', 62694), acct('saving', 'debit', 15502), acct('cash', 'debit', 2240), acct('card', 'credit', 4905), acct('net-worth', 'credit', 30000),
  acct('wages', 'credit', 121200), acct('taxes', 'debit', 17854), acct('rent', 'debit', 45000), acct('groceries', 'debit', 9640), acct('eating-out', 'debit', 3175),
];
const SMALL = [acct('spending', 'debit', 41200), acct('saving', 'debit', 31000), acct('card', 'credit', 8025), acct('net-worth', 'credit', 70000), acct('groceries', 'debit', 5825)];
const SWAPPED = SMALL.map((a) => (a.no === CHART.groceries.no ? { ...a, debit: 8525 } : a));

export const M09_LESSON = {
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

export const M09_GATE = { id: 'm09', kind: 'gate', title: 'Module 9 check', templates: [tbTotal, diagnose, tbFromPages, explainProof] };

// Fluency drill on the core operation: halving a wrong-side difference.
const drill = [1, 2, 3].map((n) => num(`m09-drill-${n}`, 'interpreting', { half: { min: 100, max: 9000, step: 1 } }, (p) => ({
  prompt: `Drill ${n} of 3: the totals are ${money(2 * p.half)} apart because one amount was posted on the wrong side. What amount do you look for?`, answer: p.half,
  explanation: `Half of ${money(2 * p.half)} is ${money(p.half)}.`,
})));

const cardMixed = { ...M08_GATE.templates.find((t) => t.part === 'producing'), id: 'm08-record-card-mixed-m09' };

export const M09_PRACTICE = {
  id: 'm09-practice', kind: 'practice', module: 'm09', title: 'Module 9 practice set',
  templates: [...M08_LESSON.recallTemplates, ...M07_LESSON.recallTemplates, ...M05_LESSON.recallTemplates, ...drill, tbTotal, diagnose, wrongSide, oneSided, slide, tbBlanks, tbFromPages, cardMixed, { ...explainProof, id: 'm09-explain-practice' }],
};

export const M09_EXTRA = {
  id: 'm09-extra', kind: 'practice', module: 'm09', title: 'Module 9 extra practice',
  templates: [tbTotal, oneSided, tbFromPages].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M09_REMEDIAL = {
  id: 'm09-remedial', kind: 'practice', module: 'm09', title: 'Module 9: common mistakes',
  templates: [diagnose, wrongSide, slide].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint C draws from this module.
export const M09_CHECKPOINT = [tbTotal, diagnose, tbFromPages];
