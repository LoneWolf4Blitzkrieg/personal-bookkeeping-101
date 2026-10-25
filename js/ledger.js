// Double-entry ledger arithmetic. A page is
//   { id, type, account, rows: [{ date, items, folio, debit, credit, posted: [dr, cr] }] }
// with amounts in cents. A journal entry is
//   { date, folio, explanation, lines: [{ account: pageId, debit, credit }] }.

const NORMAL_SIDE = { asset: 'Dr', expense: 'Dr', liability: 'Cr', income: 'Cr', networth: 'Cr' };

export function normalSide(type) {
  const side = NORMAL_SIDE[type];
  if (!side) throw new Error(`Unknown account type: ${type}`);
  return side;
}

export function runningBalances(page) {
  const normal = normalSide(page.type);
  let net = 0; // debits minus credits
  return page.rows.map((r) => {
    net += (r.debit || 0) - (r.credit || 0);
    const side = net > 0 ? 'Dr' : net < 0 ? 'Cr' : normal;
    return { balance: Math.abs(net), side };
  });
}

const isAmount = (n) => Number.isSafeInteger(n) && n >= 0;

// Balanced: every amount is whole, non-negative cents; each line is a debit
// or a credit, not both; and total debits equal total credits (above zero).
export function entryBalances(entry) {
  let debits = 0;
  let credits = 0;
  for (const line of entry.lines) {
    const debit = line.debit || 0;
    const credit = line.credit || 0;
    if (!isAmount(debit) || !isAmount(credit)) return false;
    if (debit > 0 && credit > 0) return false;
    debits += debit;
    credits += credit;
  }
  return debits > 0 && debits === credits;
}

// Returns { pages, entry }: new page objects with the entry's lines posted
// (folio = journal page, ✓ on the posted side), and a copy of the entry whose
// lines carry the ledger account number as folio and a posted mark.
export function postEntry(entry, pages) {
  if (!entryBalances(entry)) throw new Error('This entry does not balance: debits must equal credits.');
  const copy = pages.map((p) => ({ ...p, rows: p.rows.map((r) => ({ ...r, posted: [...(r.posted ?? [false, false])] })) }));
  const postedLines = [];
  for (const line of entry.lines) {
    const page = copy.find((p) => p.id === line.account);
    if (!page) throw new Error(`No ledger page for account: ${line.account}`);
    const debit = line.debit || 0;
    const credit = line.credit || 0;
    page.rows.push({
      date: entry.date,
      items: line.items ?? entry.explanation,
      folio: entry.folio,
      debit,
      credit,
      posted: [debit > 0, credit > 0],
    });
    postedLines.push({ ...line, folio: page.accountNo, posted: true });
  }
  return { pages: copy, entry: { ...entry, lines: postedLines } };
}

export function trialBalance(pages) {
  let debits = 0;
  let credits = 0;
  for (const page of pages) {
    const balances = runningBalances(page);
    if (balances.length === 0) continue;
    const { balance, side } = balances[balances.length - 1];
    if (side === 'Dr') debits += balance;
    else credits += balance;
  }
  return { debits, credits, balanced: debits === credits };
}
