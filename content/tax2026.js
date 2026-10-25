// 2026 wage and payroll-tax figures for the course's standard paycheck.
// Each figure names its source (content/sources.js). Amounts are in cents.

export const TAX_2026 = {
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
