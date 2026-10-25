// A paycheck from an hourly wage: gross pay, the standard deductions and
// take-home pay, all in cents. Tax figures come from content/tax2026.js.
// Rounding to the cent uses the course's thousandths rule throughout.

import { percentOf, divideRound } from './money.js';

// IRS Pub. 15-T Worksheet 1A (Form W-4 from 2020 or later, Single or
// Married Filing Separately, nothing entered in Steps 2–4).
export function federalWithholding(grossCents, tax, period = 'biweekly') {
  const periods = tax.federal.payPeriodsPerYear[period];
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
export function paycheck({ rateCents, hours, tax, period = 'biweekly' }) {
  const hundredths = Math.round(hours * 100);
  const gross = divideRound(rateCents * hundredths, 100);
  const socialSecurity = percentOf(gross, tax.socialSecurityRate);
  const medicare = percentOf(gross, tax.medicareRate);
  const federal = federalWithholding(gross, tax, period);
  const arizona = percentOf(gross, tax.arizonaDefaultRate);
  const net = gross - socialSecurity - medicare - federal - arizona;
  return { gross, socialSecurity, medicare, federal, arizona, net };
}
