// 2026 borrowing, saving and inflation rates used in examples. Each figure names its source
// (content/sources.js).

export const RATES_2026 = {
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
