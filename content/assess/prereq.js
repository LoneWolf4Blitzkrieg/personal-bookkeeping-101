// The prerequisite check: money arithmetic the course assumes. Learners who
// score below 80% are pointed to the remedial unit (lesson.html?m=prereq).

import { percentOf } from '../../js/money.js';
import { money } from '../helpers.js';

const t = (id, params, build) => ({ id, module: 'prereq', kind: 'numeric', part: 'interpreting', points: 1, params, build });

export const PREREQ_CHECK = {
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
      explanation: `10% is ${money(percentOf(p.a, 0.1))} and 5% is ${money(percentOf(p.a, 0.05))}, so 15% is ${money(percentOf(p.a, 0.15))}.`,
    })),
    t('pre-round', { a: { min: 50001, max: 150000, step: 1 } }, (p) => ({
      prompt: `What is 6.2% of ${money(p.a)}, rounded to the cent?`, answer: percentOf(p.a, 0.062),
      explanation: `Look at the thousandths digit: 4 and below, keep it below; 5 and above, give it a shove. The answer is ${money(percentOf(p.a, 0.062))}.`,
    })),
    t('pre-times', { a: { min: 199, max: 1999, step: 1 }, n: { pick: [2, 3, 4, 5] } }, (p) => ({
      prompt: `A bus pass costs ${money(p.a)}. How much do ${p.n} passes cost?`, answer: p.a * p.n,
      explanation: `${p.n} × ${money(p.a)} = ${money(p.a * p.n)}.`,
    })),
    t('pre-total', { a: { min: 100, max: 3000, step: 1 }, b: { min: 100, max: 3000, step: 1 }, c: { min: 100, max: 3000, step: 1 } }, (p) => ({
      prompt: `Add up three receipts: ${money(p.a)}, ${money(p.b)} and ${money(p.c)}.`, answer: p.a + p.b + p.c,
      explanation: `${money(p.a)} + ${money(p.b)} + ${money(p.c)} = ${money(p.a + p.b + p.c)}.`,
    })),
  ],
};
