// Shared building blocks for course content.

import { percentOf, formatCents } from '../js/money.js';
import { paycheck } from '../js/paycheck.js';
import { TAX_2026 } from './tax2026.js';

export const money = (cents) => `$${formatCents(cents)}`;

export const NAMES = ['Jordan', 'Maya', 'Luis', 'Ana', 'Devon', 'Kai', 'Rosa', 'Eli'];

// The course's suggested split of take-home pay. Spending gets whatever is
// left after the other four, so the buckets always add up to the paycheck.
export const BUCKET_RATES = { saving: 0.15, investing: 0.10, charity: 0.05, blow: 0.10 };

export function splitBuckets(takeHomeCents) {
  const saving = percentOf(takeHomeCents, BUCKET_RATES.saving);
  const investing = percentOf(takeHomeCents, BUCKET_RATES.investing);
  const charity = percentOf(takeHomeCents, BUCKET_RATES.charity);
  const blow = percentOf(takeHomeCents, BUCKET_RATES.blow);
  return { saving, investing, charity, blow, spending: takeHomeCents - saving - investing - charity - blow };
}

// A two-week paycheck at the 2026 Arizona minimum wage.
export function standardPaycheck(hours = 80) {
  return paycheck({ rateCents: TAX_2026.azMinimumWageCents, hours, tax: TAX_2026 });
}

export const PAYCHECK_SOURCES = ['azica-min-wage-2026', 'ssa-cola-2026', 'irs-p15t-2026', 'azdor-a4-2026'];

// A pay stub as a source document (amounts in cents).
export function payStub(hours, { employer = 'Sunny Days Car Wash (fictional)', detail = true } = {}) {
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
export function explainTemplate({ id, module, part = 'explaining', points = 2, variants }) {
  return {
    id, module, kind: 'explain', part, points,
    params: { variant: { pick: variants.map((_, i) => i) } },
    build: (p) => ({ ...variants[p.variant] }),
  };
}
