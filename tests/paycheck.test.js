import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paycheck, federalWithholding } from '../js/paycheck.js';
import { TAX_2026 } from '../content/tax2026.js';

// The course's standard paycheck: Arizona minimum wage, two weeks, 80 hours.
//   gross            = 80 × $15.15                                = $1,212.00
//   Social Security  = 6.2% of $1,212.00 = $75.144     -> 4 ->    $75.14
//   Medicare         = 1.45% of $1,212.00 = $17.574    -> 4 ->    $17.57
//   federal (Pub. 15-T 2026, Worksheet 1A, Single, standard):
//     annual wages   = $1,212.00 × 26                             = $31,512.00
//     minus line 1g  = $31,512.00 − $8,600.00                      = $22,912.00
//     row $19,900–$57,900: $1,240.00 + 12% × ($22,912 − $19,900)
//                    = $1,240.00 + 12% × $3,012.00 = $1,240.00 + $361.44 = $1,601.44 a year
//     per paycheck   = $1,601.44 ÷ 26 = $61.5938…   -> 3 ->      $61.59
//   Arizona          = 2.0% of $1,212.00                          = $24.24
//   net              = $1,212.00 − 75.14 − 17.57 − 61.59 − 24.24  = $1,033.46
test('the standard Arizona minimum-wage paycheck', () => {
  assert.deepEqual(paycheck({ rateCents: 1515, hours: 80, tax: TAX_2026 }), {
    gross: 121200, socialSecurity: 7514, medicare: 1757, federal: 6159, arizona: 2424, net: 103346,
  });
});

test('hours can include quarter hours', () => {
  assert.equal(paycheck({ rateCents: 1515, hours: 80.25, tax: TAX_2026 }).gross, 121579); // 1215.7875 -> 8 -> 1,215.79
});

test('federal withholding is zero below the first bracket', () => {
  // $300 × 26 = $7,800 − $8,600 < 0 -> nothing withheld
  assert.equal(federalWithholding(30000, TAX_2026, 'biweekly'), 0);
});

test('federal withholding in the 22% bracket', () => {
  // $3,000 biweekly: 78,000 − 8,600 = 69,400; 5,800 + 22% × (69,400 − 57,900) = 5,800 + 2,530 = 8,330 / 26 = 320.384... -> 4 -> 320.38
  assert.equal(federalWithholding(300000, TAX_2026, 'biweekly'), 32038);
});
