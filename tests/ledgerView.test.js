import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ledgerHTML, blankPage, readLedgerInputs } from '../js/ledgerView.js';

const saving = {
  id: 'saving', sheetNo: 1, accountNo: 3, name: 'Jordan', account: 'Saving bucket', type: 'asset',
  rows: [
    { date: '2026-06-06', items: 'From paycheck, 15%', folio: 'J1', debit: 18180, credit: 0, posted: [true, false] },
    { date: '2026-06-20', items: 'From paycheck, 15%', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance'] },
  ],
};

const headers = (html) => [...html.matchAll(/<th[^>]*scope="col"[^>]*>(.*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());

test('the sheet has the nine classic columns in order', () => {
  assert.deepEqual(headers(ledgerHTML(saving)), ['Date', 'Items', 'Folio', '✓', 'Debits', '✓', 'Credits', 'Dr/Cr', 'Balance']);
});

test('the two check columns are named for screen readers', () => {
  const html = ledgerHTML(saving);
  assert.match(html, /aria-label="Debit posted"/);
  assert.match(html, /aria-label="Credit posted"/);
});

test('the table is labelled with the account title and shows the header fields', () => {
  const html = ledgerHTML(saving);
  assert.match(html, /<table[^>]*aria-label="Ledger page: Saving bucket"/);
  for (const text of ['Sheet No.', 'Account No.', 'Name', 'Account', 'Jordan', 'Saving bucket']) assert.ok(html.includes(text), text);
});

test('rows show dates, amounts, ticks, sides and running balances', () => {
  const html = ledgerHTML(saving, { showAnswers: true });
  assert.ok(html.includes('Jun 6'));
  assert.ok(html.includes('181.80'));
  assert.ok(html.includes('363.60'), 'running balance after second row');
  assert.ok(html.includes('✓'));
  assert.match(html, />Dr</);
});

test('cells the learner must work out stay blank unless answers are shown', () => {
  assert.ok(!ledgerHTML(saving).includes('363.60'));
  assert.match(ledgerHTML(saving), /class="ask"/);
  assert.ok(ledgerHTML(saving, { showAnswers: true }).includes('363.60'));
});

test('the requested row is highlighted', () => {
  const html = ledgerHTML(saving, { highlightRow: 1 });
  const rows = [...html.matchAll(/<tr[^>]*>/g)].map((m) => m[0]);
  const body = rows.filter((r) => r.includes('data-row'));
  assert.match(body[1], /class="[^"]*\bhighlight\b/);
  assert.doesNotMatch(body[0], /\bhighlight\b/);
});

test('editable mode turns cells into labelled inputs', () => {
  const html = ledgerHTML(saving, { editable: true });
  const inputs = html.match(/<input /g) || [];
  assert.equal(inputs.length, 2 * 7, 'seven typed columns per row (not the two tick columns)');
  assert.match(html, /<input [^>]*aria-label="Row 1 Debits"/);
  assert.match(html, /<input [^>]*type="date"[^>]*value="2026-06-06"/, 'dates keep their year');
  assert.match(html, /<button [^>]*class="tick"[^>]*name="r0-drTick"/);
});

test('editable mode never pre-fills a computed balance or side', () => {
  const html = ledgerHTML(saving, { editable: true, showAnswers: true });
  assert.doesNotMatch(html, /name="r0-balance" value="[^"]+"/);
  assert.doesNotMatch(html, /name="r0-side" value="[^"]+"/);
  const typed = ledgerHTML({ ...saving, rows: [{ ...saving.rows[0], side: 'Dr', balance: 18180 }] }, { editable: true });
  assert.match(typed, /name="r0-balance" value="181.80"/, 'a balance the learner typed is kept');
});

test('readLedgerInputs turns named input values back into rows, reporting bad amounts', () => {
  const { rows, errors } = readLedgerInputs([
    ['r0-date', '2026-06-06'], ['r0-items', 'Pay'], ['r0-folio', 'J1'], ['r0-debit', '1,212.00'], ['r0-credit', ''],
    ['r0-drTick', 'true'], ['r0-crTick', 'false'], ['r0-side', 'dr'], ['r0-balance', '1212'],
    ['r1-items', 'Lunch'], ['r1-credit', 'abc'],
  ]);
  assert.deepEqual(rows[0], { date: '2026-06-06', items: 'Pay', folio: 'J1', debit: 121200, credit: 0, posted: [true, false], side: 'Dr', balance: 121200 });
  assert.equal(rows[1].items, 'Lunch');
  assert.deepEqual(errors, [{ row: 1, column: 'credit', reason: 'not-an-amount' }]);
});

test('inactive columns are empty in both modes', () => {
  const page = { ...saving, activeColumns: ['date', 'items', 'balance'] };
  const html = ledgerHTML(page, { showAnswers: true }).split('<tbody>')[1];
  for (const hidden of ['J1', '✓', '>Dr<']) assert.ok(!html.includes(hidden), `${hidden} hidden`);
  assert.equal((html.match(/181\.80/g) || []).length, 1, 'balance shown, debit hidden');
  const edit = ledgerHTML(page, { editable: true });
  assert.doesNotMatch(edit, /name="r0-folio"/);
  assert.doesNotMatch(edit, /name="r0-drTick"/);
});

test('inactive columns are greyed and say when they are taught', () => {
  const html = ledgerHTML({ ...saving, activeColumns: ['date', 'items', 'balance'] });
  assert.match(html, /<th[^>]*class="[^"]*inactive[^"]*"[^>]*title="You'll learn this in Module 3"[^>]*>Folio/);
  assert.doesNotMatch(html, /<th[^>]*inactive[^>]*>Date/);
});

test('text is escaped', () => {
  const html = ledgerHTML({ ...saving, name: '<b>Al & Jo</b>', rows: [{ ...saving.rows[0], items: 'Tacos <3' }] });
  assert.ok(html.includes('&lt;b&gt;Al &amp; Jo&lt;/b&gt;'));
  assert.ok(html.includes('Tacos &lt;3'));
});

test('a blank page has empty header fields and the requested number of rows', () => {
  const html = ledgerHTML(blankPage(25));
  assert.equal((html.match(/data-row=/g) || []).length, 25);
  assert.match(html, /aria-label="Ledger page: blank sheet"/);
});

test('empty rows below the entries show no balance', () => {
  const page = { ...saving, rows: [saving.rows[0], {}, {}] };
  const html = ledgerHTML(page, { showAnswers: true });
  assert.equal((html.match(/181\.80/g) || []).length, 2, 'debit and balance on the first row only');
  assert.equal((html.match(/>Dr</g) || []).length, 1);
});

test('print sheets: blank and demo exist, unknown names do not', async () => {
  const { sheetFor } = await import('../js/app/print.js');
  assert.equal(sheetFor('blank').page.minRows, 25);
  assert.ok(sheetFor('demo').page.rows.some((r) => r.ask));
  assert.ok(sheetFor('demo').page.rows.every((r) => r.date), 'demo data has no filler rows');
  assert.equal(sheetFor('nope'), null);
});

test('cells to work out are announced, and revealed answers are marked for print', () => {
  assert.match(ledgerHTML(saving), /<span class="ask"><span class="visually-hidden">to work out<\/span><\/span>/);
  assert.match(ledgerHTML(saving, { showAnswers: true }), /<td class="[^"]*\banswer\b[^"]*">363.60<\/td>/);
});

test('minRows pads the drawing without padding the data', () => {
  const page = { ...saving };
  const html = ledgerHTML(page, { minRows: 6 });
  assert.equal((html.match(/data-row=/g) || []).length, 6);
  assert.equal(page.rows.length, 2);
});

test('impossible dates are shown as written', () => {
  assert.ok(ledgerHTML({ ...saving, rows: [{ ...saving.rows[0], date: '2026-13-40' }] }).includes('2026-13-40'));
});

test('attribute values are escaped', () => {
  const html = ledgerHTML({ ...saving, account: 'A"B', rows: [{ ...saving.rows[0], items: 'say "hi"' }] }, { editable: true });
  assert.match(html, /aria-label="Ledger page: A&quot;B"/);
  assert.match(html, /value="say &quot;hi&quot;"/);
});

test('a journal page shows date, accounts with credits indented, folio, debits and credits', async () => {
  const { journalHTML } = await import('../js/ledgerView.js');
  const html = journalHTML({
    sheetNo: 1, name: 'Jordan',
    entries: [{ date: '2026-06-06', folio: 'J1', explanation: 'Paycheck split into buckets', lines: [
      { account: 'saving', label: 'Saving bucket', debit: 18180, credit: 0, folio: 3 },
      { account: 'checking', label: 'Checking', debit: 0, credit: 18180, folio: 1 },
    ] }],
  });
  const heads = [...html.matchAll(/<th[^>]*scope="col"[^>]*>(.*?)<\/th>/g)].map((m) => m[1]);
  assert.deepEqual(heads, ['Date', 'Items', 'Folio', 'Debits', 'Credits']);
  assert.match(html, /aria-label="Journal page 1"/);
  assert.match(html, /class="journal-credit"[^>]*>Checking/);
  assert.ok(html.includes('Paycheck split into buckets'));
  assert.equal((html.match(/181\.80/g) || []).length, 2);
});
