// Money is always whole cents (integers). These helpers convert between
// what a learner types, what a ledger shows, and cents.

const PLAIN = /^\d*(\.\d{1,2})?$/;
const GROUPED = /^\d{1,3}(,\d{3})+(\.\d{1,2})?$/;

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
  const cents = Number(whole || '0') * 100 + Number(frac.padEnd(2, '0'));
  return { ok: true, cents };
}

export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rest = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${rest}`;
}

// rate is a decimal such as 0.062. Computed with integers so that
// 121200 × 0.062 = 7514.4 rounds to 7514, and 5 × 0.5 = 2.5 rounds to 3.
const SCALE = 10_000_000_000n;

export function percentOf(cents, rate) {
  const r = BigInt(Math.round(rate * Number(SCALE)));
  const product = BigInt(cents) * r;
  const sign = product < 0n ? -1n : 1n;
  const abs = product * sign;
  const rounded = (abs + SCALE / 2n) / SCALE;
  return Number(rounded * sign);
}
