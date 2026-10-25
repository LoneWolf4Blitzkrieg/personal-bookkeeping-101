import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAmount, formatCents, percentOf } from '../js/money.js';

test('parseAmount reads the loose ways people type money', () => {
  assert.deepEqual(parseAmount('1,212.00'), { ok: true, cents: 121200 });
  assert.deepEqual(parseAmount('$1212'), { ok: true, cents: 121200 });
  assert.deepEqual(parseAmount(' 75.14 '), { ok: true, cents: 7514 });
  assert.deepEqual(parseAmount('75.1'), { ok: true, cents: 7510 });
  assert.deepEqual(parseAmount('.50'), { ok: true, cents: 50 });
  assert.deepEqual(parseAmount('$ 12'), { ok: true, cents: 1200 });
  assert.deepEqual(parseAmount('0'), { ok: true, cents: 0 });
});

test('parseAmount rejects text that is not an amount, with a reason', () => {
  for (const text of ['abc', '', '   ', '1.234', '12,34', '1..2', '-5', '$', null, undefined]) {
    const r = parseAmount(text);
    assert.equal(r.ok, false, `"${text}" should be rejected`);
    assert.equal(typeof r.reason, 'string');
  }
});

test('formatCents writes amounts the way a ledger shows them', () => {
  assert.equal(formatCents(121200), '1,212.00');
  assert.equal(formatCents(0), '0.00');
  assert.equal(formatCents(7), '0.07');
  assert.equal(formatCents(123456789), '1,234,567.89');
  assert.equal(formatCents(-4550), '-45.50');
});

test('percentOf rounds half-up to the cent without floating-point drift', () => {
  assert.equal(percentOf(121200, 0.062), 7514);   // 7514.4
  assert.equal(percentOf(121200, 0.0145), 1757);  // 1757.4
  assert.equal(percentOf(5, 0.5), 3);             // 2.5 -> 3
  assert.equal(percentOf(1005, 0.1), 101);        // 100.5 -> 101
  assert.equal(percentOf(121200, 0.15), 18180);
  assert.equal(percentOf(0, 0.062), 0);
});

test('parseAmount: trailing dot, leading-zero groups and oversized numbers', () => {
  assert.deepEqual(parseAmount('75.'), { ok: true, cents: 7500 });
  assert.equal(parseAmount('00,123').ok, false);
  assert.equal(parseAmount('99999999999999999999').ok, false);
  assert.equal(parseAmount('9007199254740993').ok, false);
  assert.deepEqual(parseAmount('999,999,999,999.99'), { ok: true, cents: 99999999999999 });
});

test('percentOf and formatCents refuse inputs that are not whole cents or a decimal rate', () => {
  assert.throws(() => percentOf(1.5, 0.1), TypeError);
  assert.throws(() => percentOf(100, 6.2), RangeError);
  assert.throws(() => percentOf(100, -0.1), RangeError);
  assert.throws(() => formatCents(1.5), TypeError);
  assert.throws(() => formatCents(NaN), TypeError);
});
