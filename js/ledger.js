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

export function entryBalances(entry) {
  let debits = 0;
  let credits = 0;
  for (const line of entry.lines) {
    debits += line.debit || 0;
    credits += line.credit || 0;
  }
  return debits > 0 && debits === credits;
}

export function postEntry(entry, pages) {
  const copy = pages.map((p) => ({ ...p, rows: p.rows.map((r) => ({ ...r, posted: [...r.posted] })) }));
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
  }
  return copy;
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
