// print.html?sheet=blank — a blank ledger sheet to print and fill in by hand.
// print.html?sheet=demo  — a filled example (answers hidden) for checking print layout.
// Lesson sheets are added by id in later tasks.

import { ledgerHTML, blankPage } from '../ledgerView.js';

const DEMO = {
  sheetNo: 1, accountNo: 3, name: 'Jordan (example)', account: 'Saving bucket', type: 'asset',
  rows: [
    { date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] },
    { date: '2026-06-20', items: 'From paycheck, 15%', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance', 'side'] },
    ...Array.from({ length: 18 }, () => ({})),
  ],
};

export function sheetFor(name) {
  if (name === 'blank') return { title: 'Blank ledger sheet', page: blankPage(25) };
  if (name === 'demo') return { title: 'Example ledger sheet', page: DEMO };
  return null;
}

export function renderPrintPage(container, name) {
  const sheet = sheetFor(name);
  if (!sheet) {
    container.innerHTML = '<p>There is no sheet with that name. <a href="print.html?sheet=blank">Print a blank ledger sheet</a> instead.</p>';
    return null;
  }
  container.innerHTML = ledgerHTML(sheet.page);
  return sheet.title;
}
