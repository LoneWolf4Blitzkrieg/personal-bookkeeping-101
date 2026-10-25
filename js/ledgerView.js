// Draws a ledger page as an HTML table, modelled on classic green
// double-entry ledger paper. Pure: returns a string.

import { escapeHTML } from './html.js';
import { formatCents } from './money.js';
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
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}` : (date || '');
}

export function blankPage(rowCount = 25) {
  return { blank: true, sheetNo: '', accountNo: '', name: '', account: '', rows: Array.from({ length: rowCount }, () => ({})) };
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

export function ledgerHTML(page, { highlightRow = null, editable = false, showAnswers = false } = {}) {
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

  const body = page.rows.map((row, i) => {
    const hasAmount = Boolean(row.debit || row.credit);
    const values = cellValues(row, hasAmount ? balances[i] : null);
    const ask = new Set(row.ask || []);
    const cells = COLUMNS.map((c) => {
      const classes = [`col-${c.key}`];
      if (c.money) classes.push('money');
      if (inactive(c.key)) classes.push('inactive');
      const cellLabel = `Row ${i + 1} ${c.aria || c.label}`;
      if (editable) {
        if (c.tick !== undefined) {
          const pressed = Boolean(row.posted?.[c.tick]);
          return `<td class="${classes.join(' ')}"><button type="button" class="tick" aria-pressed="${pressed}" aria-label="${cellLabel}">${pressed ? '✓' : ''}</button></td>`;
        }
        const value = ask.has(c.key) && !showAnswers ? '' : values[c.key];
        const mode = c.money ? ' inputmode="decimal"' : '';
        return `<td class="${classes.join(' ')}"><input name="r${i}-${c.key}" value="${escapeHTML(value)}" aria-label="${cellLabel}"${mode}></td>`;
      }
      if (ask.has(c.key) && !showAnswers) return `<td class="${classes.join(' ')}"><span class="ask" aria-label="${cellLabel}: to work out"></span></td>`;
      return `<td class="${classes.join(' ')}">${escapeHTML(values[c.key])}</td>`;
    }).join('');
    const rowClass = i === highlightRow ? ' class="highlight"' : '';
    return `<tr data-row="${i}"${rowClass}>${cells}</tr>`;
  }).join('\n');

  return `<div class="ledger-sheet">
${headerFields(page)}
<table class="ledger" aria-label="Ledger page: ${escapeHTML(label)}">
<thead><tr>${head}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</div>`;
}
