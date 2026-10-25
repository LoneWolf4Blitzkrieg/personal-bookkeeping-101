// Rules every lesson, exercise and check must follow. Each returns a list of
// plain-language problems; an empty list means the content is sound.

import { MODULES, PREREQUISITE } from '../content/course.js';
import { SOURCES } from '../content/sources.js';
import { RESOURCES, isOfficialUrl } from '../content/resources.js';
import { entryBalances, runningBalances } from './ledger.js';
import { assessmentVersions, generateItem } from './items.js';
import { formatCents } from './money.js';
import { ledgerPanelHTML } from './lessonView.js';

const PREREQ_IDEAS = PREREQUISITE.ideas;
const ALL_IDEAS = new Set([...PREREQ_IDEAS, ...MODULES.flatMap((m) => m.ideas)]);
const EARLY_COLUMNS = ['balance', 'date', 'items'];
const EARLY_MODULES = new Set(['m01', 'm02']);

// Ideas a learner has met by a given point: the prerequisite arithmetic, plus
// every module up to and including that one.
function ideasTaughtBy(position) {
  const end = MODULES.findIndex((m) => m.id === position);
  return new Set([...PREREQ_IDEAS, ...MODULES.slice(0, end + 1).flatMap((m) => m.ideas)]);
}

// Visits every object in a piece of content, with a readable path.
function walk(node, path, visit) {
  if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${path}[${i}]`, visit));
  else if (node && typeof node === 'object') {
    visit(node, path);
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, visit);
  }
}

const isLedgerPage = (o) => Array.isArray(o.rows) && typeof o.type === 'string';
const isJournalPage = (o) => Array.isArray(o.entries) && o.entries.every((e) => Array.isArray(e?.lines));
const hasAmount = (r) => Boolean(r.debit || r.credit);
const ASK_KEYS = new Set(['debit', 'credit', 'balance', 'side']);

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
  // Once a line asks for something, every later balance would give it away
  // (and an asked amount would show in its own balance), so those rows must
  // ask for balance and side as well.
  const firstAsk = page.rows.findIndex((r) => (r.ask ?? []).some((k) => ASK_KEYS.has(k)));
  if (firstAsk !== -1) {
    page.rows.slice(firstAsk).forEach((r, j) => {
      const ask = new Set(r.ask ?? []);
      if (hasAmount(r) && !(ask.has('balance') && ask.has('side'))) problems.push(`${path}.rows[${firstAsk + j}]: showing this balance gives away an answer asked for above; ask for balance and side too.`);
    });
  }
  if (EARLY_MODULES.has(position)) {
    const cols = [...(page.activeColumns ?? [])].sort();
    if (cols.join() !== EARLY_COLUMNS.join()) problems.push(`${path}: modules 1 and 2 must set activeColumns to exactly date, items and balance (debits and credits are taught in Module 3).`);
  }
}

function checkCommon(node, path, position, problems) {
  const taught = ideasTaughtBy(position);
  walk(node, path, (o, p) => {
    if (isLedgerPage(o)) {
      checkLedger(o, p, position, problems);
      // Folio references (Module 5) and posted ticks (Module 6) stay blank until taught.
      o.rows.forEach((r, i) => {
        if (r.folio && !taught.has('folio-reference')) problems.push(`${p}.rows[${i}]: Folio references are taught in Module 5; leave the Folio column blank before then.`);
        if ((r.posted ?? []).some(Boolean) && !taught.has('posted-marks')) problems.push(`${p}.rows[${i}]: posted ticks are taught in Module 6; leave them blank before then.`);
      });
    }
    if (isJournalPage(o)) {
      if (EARLY_MODULES.has(position)) problems.push(`${p}: journal pages use debit and credit columns, which modules 1 and 2 do not teach yet.`);
      else if (!taught.has('journal-entry')) problems.push(`${p}: the journal is taught in Module 6; show the ledger pages instead before then.`);
      o.entries.forEach((e, i) => { if (!entryBalances(e)) problems.push(`${p}.entries[${i}]: this entry does not balance.`); });
    }
    if (o.journal && !entryBalances(o.journal)) problems.push(`${p}.journal: this entry does not balance.`);
    for (const id of [o.source, ...(Array.isArray(o.sources) ? o.sources : [])].filter((x) => typeof x === 'string')) {
      if (!SOURCES[id]) problems.push(`${p}: unknown source "${id}".`);
    }
    if (Array.isArray(o.uses)) {
      for (const idea of o.uses) {
        if (!ALL_IDEAS.has(idea)) problems.push(`${p}: "${idea}" is not an idea in the course.`);
        else if (!taught.has(idea)) problems.push(`${p}: "${idea}" is not taught yet at ${position}.`);
      }
    }
    if (o.sourceDoc) {
      for (const [label, value] of o.sourceDoc.lines ?? []) {
        if (typeof value === 'number' && !Number.isSafeInteger(value)) problems.push(`${p}.sourceDoc: "${label}" must be whole cents.`);
      }
    }
  });
}

function checkSteps(module, problems) {
  const steps = module.steps ?? [];
  if (steps.length === 0) problems.push(`${module.id}: has no steps.`);
  const seen = new Set();
  steps.forEach((s, i) => {
    if (typeof s.id !== 'string' || !s.id) problems.push(`steps[${i}]: every step needs an id (progress is saved by step id).`);
    else if (seen.has(s.id)) problems.push(`steps[${i}]: duplicate step id "${s.id}".`);
    else seen.add(s.id);
    if (!Array.isArray(s.uses)) problems.push(`steps[${i}]: every step must list the ideas it uses ("uses").`);
    if (s.prompt && !s.promptAnswer) problems.push(`steps[${i}]: a self-explanation prompt needs a model answer ("promptAnswer") to compare with.`);
    if (s.kind === 'predict') {
      if (!Number.isSafeInteger(s.answer)) { problems.push(`steps[${i}]: a predict step needs an answer in whole cents.`); return; }
      if (typeof s.explanation !== 'string' || !s.explanation) problems.push(`steps[${i}]: a predict step needs an explanation.`);
      const shown = ledgerPanelHTML(s, { revealed: false }) + (s.text ?? []).join(' ');
      if (shown.includes(formatCents(s.answer))) problems.push(`steps[${i}]: the page shows the answer (${formatCents(s.answer)}) before the learner predicts it.`);
    }
  });
}

export function checkModule(module) {
  const problems = [];
  const position = module.position ?? module.id;
  checkSteps(module, problems);
  for (const r of module.resources ?? []) {
    if (/^https?:/.test(r)) { if (!isOfficialUrl(r)) problems.push(`resources: ${r} is not an official site.`); }
    else if (!RESOURCES[r]) problems.push(`resources: unknown resource "${r}".`);
    else if (!isOfficialUrl(RESOURCES[r].url)) problems.push(`resources: ${r} does not point to an official site.`);
  }
  checkCommon(module, module.id, position, problems);
  return problems;
}

const EXTRA_SEEDS = 20;

export function checkAssessment(assessment) {
  const problems = [];
  const moduleIds = new Set(MODULES.map((m) => m.id));
  if (assessment.kind === 'gate' && moduleIds.has(assessment.id)) {
    for (const t of assessment.templates) {
      if (t.module !== assessment.id) problems.push(`${t.id} belongs to ${t.module}, not to the ${assessment.id} gate.`);
    }
  }
  for (const t of assessment.templates) {
    if (Array.isArray(t.uses)) checkCommon({ uses: t.uses }, t.id, t.module, problems);
    // Try more parameter values than the fixed versions use.
    for (let seed = 0; seed < EXTRA_SEEDS; seed++) {
      try {
        checkCommon(generateItem(t, 1000 + seed), `${t.id} (seed ${1000 + seed})`, t.module, problems);
      } catch (e) {
        problems.push(`${t.id}: fails to build with some values: ${e.message}`);
        break;
      }
    }
  }
  let versions;
  try {
    const shape = assessment.kind === 'gate' ? 'gate' : null;
    versions = assessmentVersions(assessment.templates, assessment.id, { count: assessment.kind === 'gate' ? 4 : 2, shape });
  } catch (e) {
    return [...problems, `${assessment.id}: ${e.message}`];
  }
  versions.forEach((items, v) => items.forEach((item, i) => checkCommon(item, `${assessment.id} version ${v + 1} question ${i + 1}`, item.module, problems)));
  return [...new Set(problems)];
}
