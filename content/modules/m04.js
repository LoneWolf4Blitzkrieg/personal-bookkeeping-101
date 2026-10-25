// Module 4: Your paycheck. Ideas: gross-vs-net, paycheck-deductions,
// recording-paycheck. Uses the real 2026 figures (content/tax2026.js); the
// employer on every pay stub is fictional.

import { percentOf } from '../../js/money.js';
import { money, NAMES, standardPaycheck, payStub, explainTemplate, PAYCHECK_SOURCES } from '../helpers.js';

const num = (id, part, params, build) => ({ id, module: 'm04', kind: 'numeric', part, points: part === 'interpreting' ? 2 : 1, params, build });
const HOURS = { min: 40, max: 90, step: 1 };
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
    explanation: `1.45% of ${money(pay.gross)} rounds to ${money(pay.medicare)} (4 and below, keep it below; 5 and above, give it a shove).`,
    sources: ['ssa-cola-2026'],
  };
});

const netFromStub = num('m04-net', 'interpreting', { hours: HOURS }, (p) => {
  const pay = standardPaycheck(p.hours);
  return {
    prompt: `A pay stub shows gross pay ${money(pay.gross)}, Social Security ${money(pay.socialSecurity)}, Medicare ${money(pay.medicare)}, federal income tax ${money(pay.federal)} and Arizona income tax ${money(pay.arizona)}. What is the take-home pay?`,
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
    explanation: `6.2% of ${money(pay.gross)} rounds to ${money(pay.socialSecurity)}.`,
    sources: ['ssa-cola-2026'],
  };
});

const recordPaycheck = {
  id: 'm04-record-paycheck', module: 'm04', kind: 'entry', part: 'producing', points: 4,
  params: { hours: HOURS },
  build: (p) => {
    const pay = standardPaycheck(p.hours);
    return {
      prompt: `Record this paycheck: gross pay ${money(pay.gross)}, total taxes withheld ${money(deductions(pay))}, take-home pay ${money(pay.net)} deposited in Checking.`,
      accounts: ACCOUNTS,
      answer: [
        { account: 'checking', debit: pay.net, credit: 0 },
        { account: 'taxes', debit: deductions(pay), credit: 0 },
        { account: 'wages', debit: 0, credit: pay.gross },
      ],
      explanation: 'Checking (asset) and Taxes withheld (expense) are debited; Wages (income) is credited for the full gross pay. The two sides are equal.',
      sourceDoc: payStub(p.hours),
      sources: PAYCHECK_SOURCES,
    };
  },
};

const explainPay = explainTemplate({
  id: 'm04-explain', module: 'm04',
  variants: [
    { prompt: 'In one or two sentences: why is Wages credited with the gross pay, not the take-home pay?',
      modelAnswer: 'You earned the whole gross amount; part of it was paid to the government for you as taxes. So Wages records all of it, and the taxes are recorded as an expense.',
      rubric: ['Says the whole gross amount was earned', 'Says the withheld part is recorded separately (as a tax expense)'] },
    { prompt: 'In one or two sentences: what is the difference between gross pay and take-home pay?',
      modelAnswer: 'Gross pay is what you earned before anything is taken out. Take-home pay is what is left after taxes are withheld, the amount that reaches your account.',
      rubric: ['Gross is before deductions', 'Take-home is what is left after deductions (what you actually receive)'] },
    { prompt: 'In one or two sentences: why should a budget start from take-home pay rather than gross pay?',
      modelAnswer: 'Because take-home pay is the money you actually get to use; the withheld taxes never reach your account.',
      rubric: ['Says take-home is the money you actually receive', 'Says withheld taxes cannot be spent or saved'] },
    { prompt: 'In one or two sentences: why does the paycheck entry debit two accounts?',
      modelAnswer: 'Part of the pay goes to Checking and part goes to taxes, so both are debited; together they equal the gross pay credited to Wages.',
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
    answer: deductions(pay), explanation: `Together: ${money(deductions(pay))}.`, sources: PAYCHECK_SOURCES,
  };
});

// --- Lesson -------------------------------------------------------------------

const std = standardPaycheck(80);
const p72 = standardPaycheck(72);

export const M04_LESSON = {
  id: 'm04',
  title: 'Your paycheck',
  coreIdea: 'Gross pay minus the taxes withheld is take-home pay, and one entry records all of it: Checking and taxes debited, Wages credited.',
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
        'Gross pay is what you earn before anything is taken out: hours × hourly wage. Two weeks of 80 hours at Arizona\'s 2026 minimum wage of $15.15 is 80 × $15.15 = $1,212.00.',
        'Take-home pay (also called net pay) is what reaches your account after taxes are withheld. For this paycheck it is $1,033.46. That is the number your five buckets are split from.',
      ],
      prompt: 'Why is take-home pay smaller than gross pay?',
      sourceDoc: payStub(80, { detail: false }),
      sources: ['azica-min-wage-2026'],
    },
    {
      id: 'deductions', kind: 'explain', title: 'Where the difference goes', uses: ['paycheck-deductions', 'percentages'],
      text: [
        `Four amounts are withheld. Social Security: 6.2% of gross, $75.144, which rounds to ${money(std.socialSecurity)}. Medicare: 1.45%, $17.574, which rounds to ${money(std.medicare)}.`,
        `Federal income tax: worked out from the IRS tables for 2026, ${money(std.federal)} for this paycheck. Arizona income tax: 2.0% unless you choose another rate on Form A-4, so ${money(std.arizona)}.`,
        `Total withheld: ${money(deductions(std))}. $1,212.00 − ${money(deductions(std))} = $1,033.46. Remember the rounding rhyme: look at the thousandths digit; 4 and below, keep it below; 5 and above, give it a shove.`,
      ],
      prompt: 'Which of the four deductions is worked out from a table instead of a single percentage?',
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
      text: [`Kai's deductions are Social Security ${money(p72.socialSecurity)}, Medicare ${money(p72.medicare)}, federal income tax ${money(p72.federal)} and Arizona income tax ${money(p72.arizona)}. What is the take-home pay from $1,090.80?`],
      answer: p72.net,
      misconceptions: [{ cents: p72.gross - p72.federal, explanation: 'Take away all four deductions, not just federal income tax.' }],
      explanation: `The four deductions total ${money(deductions(p72))}. $1,090.80 − ${money(deductions(p72))} = ${money(p72.net)}.`,
      sources: PAYCHECK_SOURCES,
    },
    {
      id: 'record', kind: 'explain', title: 'Recording the paycheck', uses: ['recording-paycheck', 'debit-credit-rules', 'equal-sides'],
      text: [
        'One journal entry records the whole paycheck. Checking goes up by the take-home pay: debit. Taxes withheld is an expense: debit. Wages, the income you earned, goes up by the full gross pay: credit.',
        `Debits: $1,033.46 + ${money(deductions(std))} = $1,212.00. Credit: $1,212.00. The two sides are equal.`,
        'Then post each line to its ledger page. Here is the Checking page after posting.',
      ],
      prompt: 'Why is Wages credited for $1,212.00 and not $1,033.46?',
      journalPage: {
        sheetNo: 1, name: 'Jordan (example)',
        entries: [{ date: '2026-06-05', folio: 'J1', explanation: 'Paycheck, two weeks', lines: [
          { account: 'checking', label: 'Checking', debit: std.net, credit: 0, folio: 1 },
          { account: 'taxes', label: 'Taxes withheld', debit: deductions(std), credit: 0, folio: 50 },
          { account: 'wages', label: 'Wages', debit: 0, credit: std.gross, folio: 40 },
        ] }],
      },
      ledger: { sheetNo: 1, accountNo: 1, name: 'Jordan (example)', account: 'Checking', type: 'asset',
        rows: [{ date: '2026-06-05', items: 'Paycheck', folio: 'J1', debit: std.net, credit: 0, posted: [true, false] }] },
      highlightRow: 0,
      sources: PAYCHECK_SOURCES,
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
      id: 'independent', kind: 'predict', title: 'On your own', uses: ['gross-vs-net'],
      text: ['Ana works 64 hours at $15.15 an hour. What is her gross pay?'],
      answer: standardPaycheck(64).gross,
      explanation: `64 × $15.15 = ${money(standardPaycheck(64).gross)}.`,
      sources: ['azica-min-wage-2026'],
    },
    {
      id: 'exit-check', kind: 'predict', title: 'Exit check', uses: ['paycheck-deductions', 'percentages'],
      text: [`Ana's gross pay is ${money(standardPaycheck(64).gross)}. How much is withheld for Arizona income tax at 2.0%?`],
      answer: standardPaycheck(64).arizona,
      explanation: `2.0% of ${money(standardPaycheck(64).gross)} is ${money(standardPaycheck(64).arizona)}.`,
      sources: ['azdor-a4-2026'],
    },
  ],
  resources: ['irs-understanding-withholding', 'azica-min-wage', 'cfpb-budget'],
  recallTemplates: [grossPay, netFromStub].map((t) => ({ ...t, id: `${t.id}-recall`, points: 1 })),
};

// --- Checks ---------------------------------------------------------------------

export const M04_GATE = { id: 'm04', kind: 'gate', title: 'Module 4 check', templates: [grossPay, medicare, recordPaycheck, explainPay] };

export const M04_PRACTICE = {
  id: 'm04-practice', kind: 'practice', module: 'm04', title: 'Module 4 practice set',
  templates: [recallEquation, grossPay, socialSecurity, taxesTotal, netFromStub, recordPaycheck, { ...explainPay, id: 'm04-explain-practice' }],
};

export const M04_EXTRA = {
  id: 'm04-extra', kind: 'practice', module: 'm04', title: 'Module 4 extra practice',
  templates: [grossPay, medicare, recordPaycheck].map((t) => ({ ...t, id: `${t.id}-extra` })),
};

export const M04_REMEDIAL = {
  id: 'm04-remedial', kind: 'practice', module: 'm04', title: 'Module 4: common mistakes',
  templates: [netFromStub, taxesTotal, recordPaycheck].map((t) => ({ ...t, id: `${t.id}-remedial` })),
};

// Questions Checkpoint A draws from this module.
export const M04_CHECKPOINT = [grossPay, netFromStub, recordPaycheck];
