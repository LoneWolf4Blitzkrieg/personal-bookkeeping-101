// Rules every lesson, exercise and check must follow. Each returns a list of
// plain-language problems; an empty list means the content is sound.

import { MODULES } from '../content/course.js';
import { SOURCES } from '../content/sources.js';
import { RESOURCES, isOfficialUrl } from '../content/resources.js';
import { entryBalances, runningBalances } from './ledger.js';
import { assessmentVersions } from './items.js';

const ALL_IDEAS = new Set(MODULES.flatMap((m) => m.ideas));
const EARLY_COLUMNS = new Set(['date', 'items', 'balance']);
const ideasTaughtBy = (moduleId) => {
  const end = MODULES.findIndex((m) => m.id === moduleId);
  return new Set(MODULES.slice(0, end + 1).flatMap((m) => m.ideas));
};

// Visits every object in a piece of content, with a readable path.
function walk(node, path, visit) {
  if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${path}[${i}]`, visit));
  else if (node && typeof node === 'object') {
    visit(node, path);
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, visit);
  }
}

const isLedgerPage = (o) => Array.isArray(o.rows) && typeof o.type === 'string';
const hasAmount = (r) => Boolean(r.debit || r.credit);

function checkLedger(page, path, position, problems) {
  let balances;
  try {
    balances = runningBalances(page);
  } catch (e) {
    problems.push(`${path}: ${e.message}`);
    return;
  }
  page.rows.forEach((r, i) => {
    if (r.balance !== undefined && r.balance !== balances[i].balance) problems.push(`${path}.rows[${i}]: stored balance ${r.balance} should be ${balances[i].balance}.`);
    if (r.side !== undefined && r.side !== balances[i].side) problems.push(`${path}.rows[${i}]: stored side ${r.side} should be ${balances[i].side}.`);
  });
  // Asking for an amount while later balances show gives the answer away.
  const firstAskedAmount = page.rows.findIndex((r) => (r.ask ?? []).some((k) => k === 'debit' || k === 'credit'));
  if (firstAskedAmount !== -1) {
    page.rows.slice(firstAskedAmount).forEach((r, j) => {
      const ask = new Set(r.ask ?? []);
      if (hasAmount(r) && !(ask.has('balance') && ask.has('side'))) problems.push(`${path}.rows[${firstAskedAmount + j}]: showing this balance gives away the amount asked for above; ask for balance and side too.`);
    });
  }
  if ((position === 'm01' || position === 'm02') && !(page.activeColumns && page.activeColumns.every((c) => EARLY_COLUMNS.has(c)))) {
    problems.push(`${path}: modules 1 and 2 must set activeColumns to date, items and balance only (debits and credits are taught in Module 3).`);
  }
}

function checkCommon(node, path, position, problems) {
  walk(node, path, (o, p) => {
    if (isLedgerPage(o)) checkLedger(o, p, position, problems);
    if (o.journal && !entryBalances(o.journal)) problems.push(`${p}.journal: this entry does not balance.`);
    for (const id of [o.source, ...(Array.isArray(o.sources) ? o.sources : [])].filter((x) => typeof x === 'string')) {
      if (!SOURCES[id]) problems.push(`${p}: unknown source "${id}".`);
    }
  });
}

export function checkModule(module) {
  const problems = [];
  const position = module.position ?? module.id;
  const taught = ideasTaughtBy(position);
  (module.steps ?? []).forEach((s, i) => {
    if (!Array.isArray(s.uses)) { problems.push(`steps[${i}]: every step must list the ideas it uses ("uses").`); return; }
    for (const idea of s.uses) {
      if (!ALL_IDEAS.has(idea)) problems.push(`steps[${i}]: "${idea}" is not an idea in the course.`);
      else if (!taught.has(idea)) problems.push(`steps[${i}]: "${idea}" is not taught yet at ${position}.`);
    }
  });
  for (const r of module.resources ?? []) {
    if (/^https?:/.test(r)) { if (!isOfficialUrl(r)) problems.push(`resources: ${r} is not an official site.`); }
    else if (!RESOURCES[r]) problems.push(`resources: unknown resource "${r}".`);
    else if (!isOfficialUrl(RESOURCES[r].url)) problems.push(`resources: ${r} does not point to an official site.`);
  }
  checkCommon(module, module.id, position, problems);
  return problems;
}

export function checkAssessment(assessment) {
  const problems = [];
  let versions;
  try {
    const shape = assessment.kind === 'gate' ? 'gate' : null;
    versions = assessmentVersions(assessment.templates, assessment.id, { count: assessment.kind === 'gate' ? 4 : 2, shape });
  } catch (e) {
    return [`${assessment.id}: ${e.message}`];
  }
  versions.forEach((items, v) => items.forEach((item, i) => checkCommon(item, `${assessment.id} version ${v + 1} question ${i + 1}`, item.module, problems)));
  return problems;
}
