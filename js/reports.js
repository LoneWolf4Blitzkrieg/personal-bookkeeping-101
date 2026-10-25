// Reports drawn on the same green ruled paper as the ledger (design §3): the
// trial balance, bank reconciliation, budget, income statement and
// net-worth statement. Content stores only the figures that go in; every
// total is worked out here, so a report cannot be drawn with a wrong total.
//
// Shapes (amounts in cents):
//   trial-balance:    { accounts: [{ no, name, debit? , credit? }], errorShown? }
//   income-statement: { period, income: [{ no, name, amount }], expenses: [...], netLabel? }
//   net-worth:        { date, assets: [{ no, name, amount }], liabilities: [...] }
//   budget:           { period, lines: [{ no, name, budget, actual }] }
//   reconciliation:   { date, statement, deposits: [{ label, amount }], payments: [...],
//                       pages: [{ no, name, amount }], interest: [...], fees: [...] }
// Every report has { report, name } and may list row keys in `ask` to hide.

import { escapeHTML } from './html.js';
import { formatCents } from './money.js';

const TITLES = {
  'trial-balance': 'Trial balance',
  'income-statement': 'Income statement',
  'net-worth': 'Net-worth statement',
  budget: 'Budget and actual',
  reconciliation: 'Bank reconciliation',
};

const sum = (list, key = 'amount') => list.reduce((s, x) => s + (x[key] || 0), 0);
const heading = (label) => ({ label, values: null, heading: true });
const line = (key, no, label, values) => ({ key, no, label, values });
const total = (key, label, values) => ({ key, label, values, total: true });

function listRows(prefix, list) {
  return list.map((x, i) => line(`${prefix}-${i}`, x.no ?? '', x.name ?? x.label, [x.amount]));
}
// A heading with its lines, or nothing when there are no lines.
const section = (label, prefix, list) => (list.length ? [heading(label), ...listRows(prefix, list)] : []);

const BUILDERS = {
  'trial-balance': (r) => ({
    columns: ['Debits', 'Credits'],
    rows: [
      ...r.accounts.map((a, i) => line(`line-${i}`, a.no, a.name, [a.debit || null, a.credit || null])),
      total('total', 'Totals', [sum(r.accounts, 'debit'), sum(r.accounts, 'credit')]),
    ],
  }),
  'income-statement': (r) => {
    const income = sum(r.income);
    const expenses = sum(r.expenses);
    return {
      columns: ['Amount'],
      rows: [
        heading('Income'), ...listRows('income', r.income), total('total-income', 'Total income', [income]),
        heading('Expenses'), ...listRows('expense', r.expenses), total('total-expenses', 'Total expenses', [expenses]),
        total('net', r.netLabel ?? (income >= expenses ? 'Added to net worth' : 'Taken from net worth'), [Math.abs(income - expenses)]),
      ],
    };
  },
  'net-worth': (r) => {
    const assets = sum(r.assets);
    const liabilities = sum(r.liabilities);
    return {
      columns: ['Amount'],
      rows: [
        heading('What you own (assets)'), ...listRows('asset', r.assets), total('total-assets', 'Total assets', [assets]),
        heading('What you owe (liabilities)'), ...listRows('liability', r.liabilities), total('total-liabilities', 'Total liabilities', [liabilities]),
        total('net', 'Net worth', [assets - liabilities]),
      ],
    };
  },
  // A plan written before the month has no actual amounts yet.
  budget: (r) => {
    const planOnly = r.lines.every((l) => l.actual == null);
    const under = (l) => (l.actual != null && l.actual < l.budget ? l.budget - l.actual : null);
    const over = (l) => (l.actual != null && l.actual > l.budget ? l.actual - l.budget : null);
    const totals = planOnly
      ? [sum(r.lines, 'budget'), null, null, null]
      : [sum(r.lines, 'budget'), sum(r.lines, 'actual'), r.lines.reduce((s, l) => s + (under(l) ?? 0), 0), r.lines.reduce((s, l) => s + (over(l) ?? 0), 0)];
    return {
      columns: ['Budget', 'Actual', 'Under', 'Over'],
      rows: [...r.lines.map((l, i) => line(`line-${i}`, l.no, l.name, [l.budget, l.actual ?? null, under(l), over(l)])), total('total', 'Totals', totals)],
    };
  },
  reconciliation: (r) => {
    const adjustedBank = r.statement + sum(r.deposits) - sum(r.payments);
    const book = sum(r.pages);
    const adjustedBook = book + sum(r.interest) - sum(r.fees);
    return {
      columns: ['Amount'],
      rows: [
        line('statement', '', 'Bank statement: closing balance', [r.statement]),
        ...section('Add: deposits not yet on the statement', 'deposit', r.deposits),
        ...section('Less: payments not yet on the statement', 'payment', r.payments),
        total('adjusted-bank', 'Adjusted bank balance', [adjustedBank]),
        heading('Your pages at this bank'), ...listRows('page', r.pages),
        total('book', 'Book balance', [book]),
        ...section('Add: interest not yet recorded', 'interest', r.interest),
        ...section('Less: fees not yet recorded', 'fee', r.fees),
        total('adjusted-book', 'Adjusted book balance', [adjustedBook]),
      ],
    };
  },
};

export function reportRows(report) {
  const build = BUILDERS[report.report];
  if (!build) throw new Error(`Unknown report type: ${report.report}`);
  return build(report);
}

// Plain-language problems with a report's figures; an empty list means sound.
export function checkReport(report) {
  if (!BUILDERS[report.report]) return [`unknown report type "${report.report}".`];
  const problems = [];
  const amounts = [];
  const r = report;
  if (r.report === 'trial-balance') {
    r.accounts.forEach((a) => {
      amounts.push(a.debit ?? 0, a.credit ?? 0);
      if (Boolean(a.debit) === Boolean(a.credit)) problems.push(`trial balance: ${a.name} needs its balance on exactly one side.`);
    });
  } else if (r.report === 'budget') {
    r.lines.forEach((l) => amounts.push(l.budget, l.actual ?? 0));
    if (r.lines.some((l) => l.actual == null) && r.lines.some((l) => l.actual != null)) problems.push('budget: give every line an actual amount, or none (a plan).');
  } else if (r.report === 'reconciliation') {
    amounts.push(r.statement);
    for (const k of ['deposits', 'payments', 'pages', 'interest', 'fees']) r[k].forEach((x) => amounts.push(x.amount));
  } else {
    for (const k of ['income', 'expenses', 'assets', 'liabilities']) (r[k] ?? []).forEach((x) => amounts.push(x.amount));
  }
  if (amounts.some((n) => !Number.isSafeInteger(n) || n < 0)) return [...problems, `${r.report}: every amount must be whole cents, not below zero.`];

  const rows = reportRows(r).rows;
  const value = (key) => rows.find((x) => x.key === key).values;
  if (r.report === 'trial-balance') {
    const [dr, cr] = value('total');
    if (dr !== cr && !r.errorShown) problems.push(`trial balance does not balance: debits ${dr}, credits ${cr}.`);
    if (dr === cr && r.errorShown) problems.push('trial balance is marked as showing an error, but it balances.');
  }
  if (r.report === 'net-worth' && value('net')[0] < 0) problems.push('net-worth statement: net worth is below zero.');
  if (r.report === 'reconciliation' && value('adjusted-bank')[0] !== value('adjusted-book')[0]) {
    problems.push(`bank reconciliation: the adjusted balances do not agree (bank ${value('adjusted-bank')[0]}, books ${value('adjusted-book')[0]}).`);
  }
  return problems;
}

export const reportTitle = (report) => report.title ?? TITLES[report.report];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longDate = (d) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d ?? '');
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : (d ?? '');
};

// Draws a report on ledger paper. Rows whose key is in report.ask show
// blank boxes until showAnswers is true. Each row's label is its row header,
// so a screen reader names the line a blank box belongs to.
export function reportHTML(report, { showAnswers = false } = {}) {
  const { columns, rows } = reportRows(report);
  const ask = new Set(report.ask ?? []);
  const title = reportTitle(report);
  const when = report.period ?? longDate(report.date);
  const head = `<tr><th scope="col" class="col-folio">No.</th><th scope="col" class="col-items">Items</th>${columns.map((c) => `<th scope="col" class="col-money">${escapeHTML(c)}</th>`).join('')}</tr>`;
  const body = rows.map((row) => {
    const cls = [row.total ? 'total' : '', row.heading ? 'heading' : ''].filter(Boolean).join(' ');
    const cells = columns.map((_, c) => {
      const v = row.values?.[c];
      if (v == null) return '<td class="money col-money"></td>';
      if (ask.has(row.key)) {
        if (!showAnswers) return '<td class="money col-money"><span class="ask"><span class="visually-hidden">to work out</span></span></td>';
        return `<td class="money col-money answer">${formatCents(v)}</td>`;
      }
      return `<td class="money col-money">${formatCents(v)}</td>`;
    }).join('');
    return `<tr${cls ? ` class="${cls}"` : ''}><td class="col-folio">${escapeHTML(row.no ?? '')}</td><th scope="row" class="col-items">${escapeHTML(row.label)}</th>${cells}</tr>`;
  }).join('\n');
  return `<div class="ledger-sheet report-sheet">
<div class="ledger-head"><div class="ledger-head-row"><div class="ledger-field"><span class="ledger-field-label">${escapeHTML(title)}</span><span class="ledger-field-value">${escapeHTML(when)}</span></div><div class="ledger-field"><span class="ledger-field-label">Name</span><span class="ledger-field-value">${escapeHTML(report.name ?? '')}</span></div></div></div>
<div class="ledger-scroll" tabindex="0" role="region" aria-label="${escapeHTML(title)}">
<table class="ledger report report-${escapeHTML(report.report)}" aria-label="${escapeHTML(title)}">
<thead>${head}</thead>
<tbody>
${body}
</tbody>
</table>
</div>
</div>`;
}
