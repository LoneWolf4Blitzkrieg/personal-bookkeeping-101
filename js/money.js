// Money is always whole cents (integers). These helpers convert between
// what a learner types, what a ledger shows, and cents.

const PLAIN = /^\d*(\.\d{0,2})?$/;
const GROUPED = /^[1-9]\d{0,2}(,\d{3})+(\.\d{0,2})?$/;
const MAX_WHOLE_DIGITS = 12; // up to $999,999,999,999.99

export function parseAmount(text) {
  if (text == null) return { ok: false, reason: 'empty' };
  let s = String(text).trim();
  if (s.startsWith('$')) s = s.slice(1).trim();
  if (s === '' || s === '.') return { ok: false, reason: 'empty' };
  if (!PLAIN.test(s) && !GROUPED.test(s)) {
    if (/^[\d,]*\.\d{3,}$/.test(s)) return { ok: false, reason: 'too-many-decimals' };
    return { ok: false, reason: 'not-an-amount' };
  }
  const [whole, frac = ''] = s.replace(/,/g, '').split('.');
  if (whole.replace(/^0+/, '').length > MAX_WHOLE_DIGITS) return { ok: false, reason: 'too-large' };
  const cents = Number(whole || '0') * 100 + Number(frac.padEnd(2, '0'));
  return { ok: true, cents };
}

function assertCents(cents) {
  if (!Number.isSafeInteger(cents)) throw new TypeError(`Expected whole cents, got ${cents}`);
}

export function formatCents(cents) {
  assertCents(cents);
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rest = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${rest}`;
}

// rate is a decimal such as 0.062 (6.2%). The exact amount is worked out in
// whole numbers, then rounded to the cent by the thousandths of a dollar
// (the tenths of a cent): "4 and below, keep it below; 5 and above, give it
// a shove." 121200 × 0.062 = $75.144 -> 4 -> $75.14; 1005 × 0.1 = $1.005 -> 5 -> $1.01.
// Digits after the thousandths never matter. Negative amounts round the same
// way on their size.
const SCALE = 10_000_000_000n;

export function percentOf(cents, rate) {
  assertCents(cents);
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) throw new RangeError(`Rate must be a decimal between 0 and 1, got ${rate}`);
  const r = BigInt(Math.round(rate * Number(SCALE)));
  const exact = BigInt(cents) * r; // the amount in cents, times SCALE
  const sign = exact < 0n ? -1n : 1n;
  const tenthsOfCents = (exact * sign * 10n) / SCALE; // truncated after the thousandths of a dollar
  const thousandthsDigit = tenthsOfCents % 10n;
  const wholeCents = tenthsOfCents / 10n + (thousandthsDigit >= 5n ? 1n : 0n);
  return Number(wholeCents * sign);
}
