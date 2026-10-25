// Draws a ledger page as an HTML table, modelled on classic green
// double-entry ledger paper. Pure: returns a string.

import { escapeHTML } from './html.js';
import { formatCents, parseAmount } from './money.js';
import { runningBalances } from './ledger.js';

const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'items', label: 'Items' },
  { key: 'folio', label: 'Folio' },
  { key: 'drTick', label: '✓', aria: 'Debit posted', tick: 0 },
  { key: 'debit', label: 'Debits', money: true },
  { key: 'crTick', label: '✓', aria: 'Credit posted', tick: 1 },
  { key: 'credit', label: 'Credits', money: true },
  { key: 'side', label: 'Dr/Cr' },
  { key: 'balance', label: 'Balance', money: true },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
  if (!m) return date || '';
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return date;
  return `${MONTHS[month - 1]} ${day}`;
}

export function blankPage(rowCount = 25) {
  return { blank: true, sheetNo: '', accountNo: '', name: '', account: '', rows: [], minRows: rowCount };
}

// Values to put in an editable sheet: what the learner (or the lesson) wrote,
// never a computed balance, so typing cannot leave a stale answer showing.
function inputValues(row) {
  return {
    date: row.date ?? '',
    items: row.items ?? '',
    folio: row.folio ?? '',
    debit: row.debit ? formatCents(row.debit) : '',
    credit: row.credit ? formatCents(row.credit) : '',
    side: row.side ?? '',
    balance: row.balance != null ? formatCents(row.balance) : '',
  };
}

// Reads [name, value] pairs from an editable sheet (names "r{row}-{column}")
// back into rows. Amounts are parsed to cents; bad amounts are reported.
export function readLedgerInputs(pairs) {
  const rows = [];
  const errors = [];
  for (const [name, raw] of pairs) {
    const m = /^r(\d+)-(\w+)$/.exec(name);
    if (!m) continue;
    const i = Number(m[1]);
    const key = m[2];
    const value = String(raw ?? '').trim();
    const row = (rows[i] ??= { date: '', items: '', folio: '', debit: 0, credit: 0, posted: [false, false] });
    if (key === 'debit' || key === 'credit' || key === 'balance') {
      if (value === '') { if (key !== 'balance') row[key] = 0; continue; }
      const parsed = parseAmount(value);
      if (parsed.ok) row[key] = parsed.cents;
      else errors.push({ row: i, column: key, reason: parsed.reason });
    } else if (key === 'drTick' || key === 'crTick') {
      row.posted[key === 'drTick' ? 0 : 1] = value === 'true';
    } else if (key === 'side') {
      const side = value.toLowerCase();
      if (side === 'dr' || side === 'cr') row.side = side === 'dr' ? 'Dr' : 'Cr';
    } else if (key === 'date' || key === 'items' || key === 'folio') {
      row[key] = value;
    }
  }
  return { rows: rows.filter(Boolean), errors };
}

function cellValues(row, balance) {
  return {
    date: formatDate(row.date),
    items: row.items ?? '',
    folio: row.folio ?? '',
    drTick: row.posted?.[0] ? '✓' : '',
    debit: row.debit ? formatCents(row.debit) : '',
    crTick: row.posted?.[1] ? '✓' : '',
    credit: row.credit ? formatCents(row.credit) : '',
    side: balance ? balance.side : '',
    balance: balance ? formatCents(balance.balance) : '',
  };
}

function headerFields(page) {
  const field = (label, value) =>
    `<div class="ledger-field"><span class="ledger-field-label">${label}</span><span class="ledger-field-value">${escapeHTML(value ?? '')}</span></div>`;
  return `<div class="ledger-head">
  <div class="ledger-head-row">${field('Sheet No.', page.sheetNo)}${field('Account No.', page.accountNo)}</div>
  <div class="ledger-head-row">${field('Name', page.name)}${field('Account', page.account)}</div>
  <div class="ledger-head-row ledger-head-minor">${field('Terms', page.terms)}${field('Rating', page.rating)}${field('Credit limit', page.creditLimit ? formatCents(page.creditLimit) : '')}</div>
</div>`;
}

export function ledgerHTML(page, { highlightRow = null, editable = false, showAnswers = false, minRows = page.minRows ?? 0 } = {}) {
  const active = page.activeColumns ? new Set(page.activeColumns) : null;
  const inactive = (key) => active && !active.has(key);
  const balances = page.type ? runningBalances(page) : [];
  const label = page.blank ? 'blank sheet' : page.account;

  const head = COLUMNS.map((c) => {
    const classes = [`col-${c.key}`];
    if (inactive(c.key)) classes.push('inactive');
    const aria = c.aria ? ` aria-label="${c.aria}"` : '';
    const title = inactive(c.key) ? ` title="You'll learn this in Module 3"` : '';
    return `<th scope="col" class="${classes.join(' ')}"${aria}${title}>${c.label}</th>`;
  }).join('');

  const rows = page.rows.length >= minRows ? page.rows : [...page.rows, ...Array.from({ length: minRows - page.rows.length }, () => ({}))];

  const body = rows.map((row, i) => {
    const hasAmount = Boolean(row.debit || row.credit);
    const values = editable ? inputValues(row) : cellValues(row, hasAmount ? balances[i] : null);
    const ask = new Set(row.ask || []);
    const cells = COLUMNS.map((c) => {
      const classes = [`col-${c.key}`];
      if (c.money) classes.push('money');
      if (inactive(c.key)) {
        classes.push('inactive');
        return `<td class="${classes.join(' ')}"></td>`;
      }
      const cellLabel = `Row ${i + 1} ${c.aria || c.label}`;
      if (editable) {
        if (c.tick !== undefined) {
          const pressed = Boolean(row.posted?.[c.tick]);
          return `<td class="${classes.join(' ')}"><button type="button" class="tick" name="r${i}-${c.key}" aria-pressed="${pressed}" aria-label="${cellLabel}">${pressed ? '✓' : ''}</button></td>`;
        }
        const value = ask.has(c.key) && !showAnswers ? '' : values[c.key];
        const type = c.key === 'date' ? ' type="date"' : '';
        const mode = c.money ? ' inputmode="decimal"' : '';
        return `<td class="${classes.join(' ')}"><input${type} name="r${i}-${c.key}" value="${escapeHTML(value)}" aria-label="${cellLabel}"${mode}></td>`;
      }
      if (ask.has(c.key)) {
        if (!showAnswers) return `<td class="${classes.join(' ')}"><span class="ask"><span class="visually-hidden">to work out</span></span></td>`;
        classes.push('answer');
      }
      return `<td class="${classes.join(' ')}">${escapeHTML(values[c.key])}</td>`;
    }).join('');
    const rowClass = i === highlightRow ? ' class="highlight"' : '';
    return `<tr data-row="${i}"${rowClass}>${cells}</tr>`;
  }).join('\n');

  return `<div class="ledger-sheet">
${headerFields(page)}
<div class="ledger-scroll">
<table class="ledger" aria-label="Ledger page: ${escapeHTML(label)}">
<thead><tr>${head}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</div>
</div>`;
}
