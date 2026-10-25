// Module 1: What money is. Ideas: money-uses, five-buckets, page-per-bucket.
// Debits and credits are not taught yet, so ledgers show Date, Items and
// Balance only, with money in and out written beside the sheet.

import { percentOf } from '../../js/money.js';
import { money, NAMES, splitBuckets, explainTemplate, exactPercent, PAYCHECK_SOURCES } from '../helpers.js';

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

export const M01_LESSON = {
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

export const M01_PRACTICE = {
  id: 'm01-practice', kind: 'practice', module: 'm01', title: 'Module 1 practice set',
  templates: [...drill, recallPercent, blowShare, investingShare, spendingLeft, totalCheck, splitFour, explainJobs].map(asPractice),
};

export const M01_EXTRA = {
  id: 'm01-extra', kind: 'practice', module: 'm01', title: 'Module 1 extra practice',
  templates: [savingShare, charityShare, blowShare, priceMeasure, otherBuckets, splitFour, splitFromSaving].map((t) => asPractice({ ...t, id: `${t.id}-extra` })),
};

export const M01_REMEDIAL = {
  id: 'm01-remedial', kind: 'practice', module: 'm01', title: 'Module 1: common mistakes',
  templates: [savingShare, spendingLeft, totalCheck].map((t) => asPractice({ ...t, id: `${t.id}-remedial` })),
};

// The module check: 10 questions (7 read and predict, 2 record it yourself,
// 1 explain why). Practice items count as 2-point interpreting items here.
const asGate = (t) => ({ ...t, part: 'interpreting', points: 2 });
export const M01_GATE = {
  id: 'm01', kind: 'gate', title: 'Module 1 check',
  templates: [savingShare, charityShare, spendingLeft, asGate(blowShare), priceMeasure, otherBuckets, drill[0], splitFour, splitFromSaving, explainSplit],
};

// Questions Checkpoint A draws from this module.
export const M01_CHECKPOINT = [savingShare, splitFour];
