import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkModule, checkAssessment } from '../js/contentRules.js';
import { MODULE_CONTENT } from '../content/modules/index.js';
import { ASSESSMENTS } from '../content/assess/index.js';
import { goodModule, badModules } from './fixtures/modules.js';
import { gateTemplates } from './fixtures/templates.js';

test('a well-formed module passes every rule', () => {
  assert.deepEqual(checkModule(goodModule), []);
});

const expectations = {
  unbalancedJournal: /does not balance/,
  wrongStoredBalance: /balance/,
  wrongStoredSide: /side/,
  untaughtIdea: /trial-balance.*not taught yet/,
  unknownIdea: /made-up-idea/,
  missingSource: /no-such-source/,
  unofficialResource: /official/,
  unknownResource: /no-such-resource/,
  askGivesAwayAnswer: /gives away/,
  earlyColumnsInModule1: /activeColumns/,
  stepWithoutUses: /uses/,
  folioTooEarly: /[Ff]olio/,
  ticksTooEarly: /posted/,
  journalTooEarly: /journal/,
  promptWithoutAnswer: /model answer/,
  stepWithoutId: /id/,
  duplicateStepIds: /duplicate/,
  noSteps: /no steps/,
  predictAnswerShown: /shows the answer/,
  predictWithoutAnswer: /answer/,
  askBalanceThenLaterShown: /gives away/,
  journalInModule1: /journal/,
  emptyActiveColumnsModule1: /activeColumns/,
  untaughtIdeaInPractice: /trial-balance.*not taught yet/,
  sourceDocNotCents: /cents/,
  negativeAnswer: /below zero/,
  reportTooEarly: /trial balance is taught in Module 9/,
  badReport: /does not balance/,
  statementNotAddingUp: /statement.*does not add up/,
};

for (const [name, pattern] of Object.entries(expectations)) {
  test(`content rule catches: ${name}`, () => {
    const problems = checkModule(badModules[name]);
    assert.ok(problems.some((p) => pattern.test(p)), `${name}: ${JSON.stringify(problems)}`);
  });
}

test('a gate\'s questions must belong to that module', () => {
  const stray = gateTemplates.map((t) => ({ ...t, module: 'm03' }));
  stray[0] = { ...stray[0], module: 'm09' };
  const problems = checkAssessment({ id: 'm03', kind: 'gate', templates: stray });
  assert.ok(problems.some((p) => /m09/.test(p)), JSON.stringify(problems));
});

test('prerequisite ideas are usable from the prerequisite check onward', () => {
  const m = { id: 'prereq', position: 'prereq', steps: [{ id: 'd', kind: 'explain', text: ['x'], uses: ['decimals', 'percentages'] }] };
  assert.deepEqual(checkModule(m), []);
});

test('a gate must have interpreting, producing and explaining templates', () => {
  assert.deepEqual(checkAssessment({ id: 'fx-gate', kind: 'gate', templates: gateTemplates }), []);
  const problems = checkAssessment({ id: 'fx-gate', kind: 'gate', templates: gateTemplates.slice(0, 9) });
  assert.ok(problems.some((p) => /explaining/.test(p)));
});

test('every module in the course passes the content rules', () => {
  for (const [id, module] of Object.entries(MODULE_CONTENT)) {
    assert.deepEqual(checkModule(module), [], id);
  }
});

test('every assessment in the course passes the content rules', () => {
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    assert.deepEqual(checkAssessment(a), [], id);
  }
});

test('the sample lesson passes the content rules', async () => {
  const { DEMO_LESSON } = await import('../content/modules/demo.js');
  assert.deepEqual(checkModule(DEMO_LESSON), []);
});

test('Modules 1–14 and the add-ons each have a lesson, a gate, a practice set, extra and remedial practice, and recall questions', async () => {
  for (const id of ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'a1', 'a2', 'a3']) {
    assert.ok(MODULE_CONTENT[id], `${id} lesson`);
    assert.ok(MODULE_CONTENT[id].recallTemplates?.length >= 1, `${id} recall`);
    for (const suffix of ['', '-practice', '-extra', '-remedial']) assert.ok(ASSESSMENTS[id + suffix], `${id}${suffix}`);
  }
});

test('Checkpoint A covers every module from 1 to 4 and has two versions', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const ca = ASSESSMENTS.ca;
  assert.deepEqual([...new Set(ca.templates.map((t) => t.module))], ['m01', 'm02', 'm03', 'm04']);
  assert.equal(assessmentVersions(ca.templates, 'ca', { count: 2 }).length, 2);
});

test('Checkpoint B covers every module from 5 to 8 and has two versions', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const cb = ASSESSMENTS.cb;
  assert.equal(cb.kind, 'checkpoint');
  assert.deepEqual([...new Set(cb.templates.map((t) => t.module))], ['m05', 'm06', 'm07', 'm08']);
  assert.equal(assessmentVersions(cb.templates, 'cb', { count: 2 }).length, 2);
});

test('the two placement stages together cover every module they skip', () => {
  const a = ASSESSMENTS['placement-ca'];
  const b = ASSESSMENTS['placement-cb'];
  assert.deepEqual([a.kind, a.checkpointId, b.kind, b.checkpointId], ['placement', 'ca', 'placement', 'cb']);
  assert.deepEqual([...new Set(a.templates.map((t) => t.module))], ['m01', 'm02', 'm03', 'm04']);
  assert.deepEqual([...new Set(b.templates.map((t) => t.module))], ['m05', 'm06', 'm07', 'm08'], 'stage two covers Modules 5–8 (stage one covers 1–4)');
});

// Proposal: recall plus mixed production make up 20–30% of a practice set.
// Measured by points (the closest stand-in for time); one indivisible 4-point
// task can take a set to a third.
test('from Module 5, practice sets open with recall and draw 20% to 33% of their points from earlier modules', () => {
  for (const id of ['m05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'a1', 'a2', 'a3']) {
    const set = ASSESSMENTS[`${id}-practice`].templates;
    const points = (list) => list.reduce((s, t) => s + t.points, 0);
    const share = points(set.filter((t) => t.module !== id)) / points(set);
    assert.ok(share >= 0.2 && share <= 1 / 3, `${id}: ${Math.round(share * 100)}% from earlier modules`);
    assert.ok(set.some((t) => t.module !== id && t.part === 'producing'), `${id}: no earlier production task`);
    assert.ok(set[0].id.endsWith('-recall'), `${id}: should open with recall`);
  }
});

test('ledger pages in Modules 5–8 use the account numbers from the chart of accounts', async () => {
  const { CHART } = await import('../content/helpers.js');
  const byName = new Map(Object.values(CHART).map((a) => [a.name, a]));
  const pages = [];
  const walk = (o) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (Array.isArray(o.rows) && o.type) pages.push(o); Object.values(o).forEach(walk); }
  };
  for (const id of ['m02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08']) walk(MODULE_CONTENT[id]);
  for (const p of pages) {
    const a = byName.get(p.account);
    assert.ok(a, `${p.account} is not in the chart of accounts`);
    assert.equal(p.accountNo, a.no, `${p.account} should be account ${a.no}`);
  }
});

test('a check\'s numeric answers are never below zero, over many parameter values', async () => {
  const { checkAssessment } = await import('../js/contentRules.js');
  const t = { id: 'fx-negative', module: 'm03', kind: 'numeric', part: 'interpreting', points: 2, params: { a: { min: 100, max: 200, step: 1 } }, build: (p) => ({ prompt: `x ${p.a}`, answer: 150 - p.a, explanation: 'x' }) };
  assert.ok(checkAssessment({ id: 'fx-practice', kind: 'practice', templates: [t] }).some((p) => /below zero/.test(p)));
});

test('every recording question in the gates from Module 5 keeps one size across the four versions, and scenario cycles cover every scenario', async () => {
  const { gateVersions } = await import('../js/items.js');
  for (const id of ['m05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'a1', 'a2', 'a3']) {
    const gate = ASSESSMENTS[id];
    const versions = gateVersions(gate.templates, id);
    gate.templates.forEach((t, k) => {
      if (t.part !== 'producing') return;
      const items = versions.map((v) => v[k]);
      assert.equal(new Set(items.map((i) => (i.answer ?? i.fields).length)).size, 1, `${t.id}: versions of different sizes`);
      const scenarios = Object.values(t.params).find((s) => Array.isArray(s.byVersion))?.byVersion;
      if (scenarios) assert.deepEqual(new Set(items.map((i) => Object.values(i.params).find((v) => scenarios.includes(v)))), new Set(scenarios), `${t.id}: some scenarios never appear`);
    });
  }
});

test('every quiz and test is exactly 10 questions (author\'s rule)', () => {
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    if (['checkpoint', 'placement', 'gate'].includes(a.kind) || id === 'prereq') {
      if (id === 'demo') continue;
      assert.equal(a.templates.length, 10, `${id} has ${a.templates.length} questions`);
    }
  }
});

test('credit card pages stay within their limit, and the card-balance question never lands on $0.00', async () => {
  const { generateItem } = await import('../js/items.js');
  const { runningBalances } = await import('../js/ledger.js');
  const templates = [...new Map(Object.values(ASSESSMENTS).flatMap((a) => a.templates).filter((t) => t.module === 'm08').map((t) => [t.id, t])).values()];
  for (const t of templates) {
    for (let seed = 0; seed < 300; seed++) {
      const item = generateItem(t, seed);
      for (const page of [item.ledger, ...(item.ledgers ?? [])].filter((pg) => pg?.creditLimit)) {
        assert.ok(Math.max(...runningBalances(page).map((b) => b.balance)) <= page.creditLimit, `${t.id} seed ${seed}: over the credit limit`);
      }
      if (t.id.startsWith('m08-card-balance')) assert.ok(item.answer > 0, `${t.id} seed ${seed}: the payment clears the whole balance`);
    }
  }
});

test('Checkpoint C covers every module from 9 to 12 and has two versions', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const cc = ASSESSMENTS.cc;
  assert.equal(cc.kind, 'checkpoint');
  assert.deepEqual([...new Set(cc.templates.map((t) => t.module))], ['m09', 'm10', 'm11', 'm12']);
  assert.equal(assessmentVersions(cc.templates, 'cc', { count: 2 }).length, 2);
});

test('Sam\'s June books agree from the trial balance (Module 9) to the statements (Module 12)', async () => {
  const { reportRows } = await import('../js/reports.js');
  const { runningBalances } = await import('../js/ledger.js');
  const m09 = MODULE_CONTENT.m09.steps.find((s) => s.id === 'trial-balance').report;
  const m12 = MODULE_CONTENT.m12.steps;
  const value = (report, key) => reportRows(report).rows.find((r) => r.key === key).values[0];
  const is = m12.find((s) => s.id === 'income-statement').report;
  const nwStep = m12.find((s) => s.id === 'net-worth-statement');
  // Every income and expense line of the trial balance is on the income statement.
  const lines = [...is.income, ...is.expenses].map((x) => [x.no, x.amount]).sort((a, b) => a[0] - b[0]);
  const fromTb = m09.accounts.filter((a) => a.no >= 40).map((a) => [a.no, a.debit ?? a.credit]);
  assert.deepEqual(lines, fromTb);
  // Opening net worth + what June added = the net-worth statement = the Net worth page.
  const opening = m09.accounts.find((a) => a.no === 30).credit;
  const page = runningBalances(nwStep.ledger).at(-1).balance;
  assert.equal(opening + value(is, 'net'), page);
  assert.equal(value(nwStep.report, 'net'), page);
});

test('every question from Modules 1–14 and the add-ons stays sound over many parameter values', async () => {
  const { generateItem } = await import('../js/items.js');
  const { checkReport } = await import('../js/reports.js');
  const { runningBalances } = await import('../js/ledger.js');
  const late = new Set(['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'a1', 'a2', 'a3']);
  const templates = [...new Map(Object.values(ASSESSMENTS).flatMap((a) => a.templates).filter((t) => late.has(t.module)).map((t) => [t.id, t])).values()];
  for (const t of templates) {
    for (let seed = 0; seed < 400; seed++) {
      const item = generateItem(t, seed);
      const where = `${t.id} seed ${seed}`;
      if (item.kind === 'numeric') assert.ok(item.answer >= 0, `${where}: answer below zero`);
      for (const f of item.fields ?? []) assert.ok(f.answer >= 0, `${where}: "${f.label}" below zero`);
      for (const m of item.misconceptions ?? []) assert.notEqual(m.cents, item.answer, `${where}: a misconception equals the answer`);
      for (const r of [item.report, ...(item.reports ?? [])].filter(Boolean)) assert.deepEqual(checkReport(r), [], where);
      for (const page of [item.ledger, ...(item.ledgers ?? [])].filter(Boolean)) {
        assert.ok(runningBalances(page).every((b, i) => b.side === (page.type === 'asset' || page.type === 'expense' ? 'Dr' : 'Cr') || b.balance === 0 || !(page.rows[i].debit || page.rows[i].credit)), `${where}: ${page.account} crosses to the wrong side`);
      }
    }
  }
});

test('a module check holds at most one fluency drill', () => {
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    if (a.kind !== 'gate') continue;
    assert.ok(a.templates.filter((t) => /-drill-/.test(t.id)).length <= 1, `${id} has more than one drill`);
  }
});

test('within a sitting, no question shows the answer to a later question', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const { ledgerPanelHTML } = await import('../js/lessonView.js');
  const { formatCents } = await import('../js/money.js');
  const answersOf = (item) => [item.answer, ...(item.fields ?? []).map((f) => f.answer), ...(Array.isArray(item.answer) ? item.answer.flatMap((l) => [l.debit, l.credit]) : [])]
    .filter((c) => Number.isSafeInteger(c) && c >= 1000);
  const shownBy = (item) => [item.prompt, item.explanation ?? '', item.modelAnswer ?? '', ledgerPanelHTML(item, { revealed: true })].join(' ');
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    if (!['gate', 'checkpoint', 'placement'].includes(a.kind) || id === 'demo') continue;
    const versions = assessmentVersions(a.templates, a.id, { count: a.kind === 'gate' ? 4 : 2, shape: a.kind === 'gate' ? 'gate' : null });
    versions.forEach((items, v) => items.forEach((later, j) => {
      // An amount the later question prints itself (an entry's amounts, for
      // example) gives nothing away when an earlier question shows it too.
      for (const cents of answersOf(later).filter((c) => !shownBy({ ...later, explanation: '' }).includes(`$${formatCents(c)}`))) {
        const text = `$${formatCents(cents)}`;
        items.slice(0, j).forEach((earlier, i) => {
          assert.ok(!shownBy(earlier).includes(text), `${id} version ${v + 1}: question ${i + 1} shows ${text}, an answer to question ${j + 1}`);
        });
      }
    }));
  }
});

test('the final project modules end with a project step whose figures appear nowhere in the course', async () => {
  const { M15_FIGURES } = await import('../content/modules/m15.js');
  const { M16_FIGURES } = await import('../content/modules/m16.js');
  const { sheetFor } = await import('../js/app/print.js');
  const { formatCents } = await import('../js/money.js');
  const pack = sheetFor('sample-month').html;
  for (const [id, figures, next] of [['m15', M15_FIGURES, 'm16'], ['m16', M16_FIGURES, 'a1']]) {
    const lesson = MODULE_CONTENT[id];
    assert.equal(lesson.project, true, id);
    assert.equal(lesson.next.id, next, id);
    const last = lesson.steps.at(-1);
    assert.equal(last.kind, 'project', id);
    assert.equal(last.figures, figures, id);
    for (const f of figures) assert.ok(!pack.includes(formatCents(f.answer)), `${id}: "${f.label}" is printed in the sample-month pack`);
    assert.ok(!ASSESSMENTS[id], `${id} has no module check`);
  }
});

test('content rules catch a project step that is misplaced, shows a figure, or lacks its lists', () => {
  const project = { id: 'p', kind: 'project', uses: [], text: ['Your total should be $12.34.'], figures: [{ label: 'Total', answer: 1234 }], checklist: [], rubric: ['Done'] };
  const lesson = { id: 'm15', title: 'x', steps: [project, { id: 'after', kind: 'explain', uses: [], text: ['x'] }] };
  const problems = checkModule(lesson);
  for (const pattern of [/final-project module/, /must be the last step/, /checklist/, /can be copied/]) assert.ok(problems.some((p) => pattern.test(p)), `${pattern}: ${JSON.stringify(problems)}`);
});

test('the printable sheets include a blank journal page and the sample month', async () => {
  const { sheetFor } = await import('../js/app/print.js');
  const journal = sheetFor('journal');
  assert.match(journal.html, /journal-sheet/);
  assert.ok((journal.html.match(/<tr>/g) ?? []).length >= 25, 'at least 25 blank lines');
  const sample = sheetFor('sample-month');
  for (const part of ['Net-worth statement', 'Budget and actual', 'The plan from Module 15', 'What happened in July 2026', 'Pay stub', 'Bank statement']) assert.ok(sample.html.includes(part), part);
});

test('Add-on A2 never grades the debated question, and shows evidence from each side', async () => {
  const a2 = MODULE_CONTENT.a2;
  const debated = a2.steps.filter((s) => (s.tags ?? []).includes('debated'));
  assert.ok(debated.length >= 1, 'the debate is taught');
  for (const s of debated) {
    assert.equal(s.kind, 'explain', `${s.id}: a debated step is never a check`);
    assert.ok(s.sources.includes('sffed-2024-12') && (s.sources.includes('kcfed-2023-markups') || s.sources.includes('ftc-grocery-2024')), `${s.id}: cites both sides`);
  }
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    for (const t of a.templates) assert.ok(!(t.tags ?? []).includes('debated'), `${id}: ${t.id} is a graded item tagged debated`);
  }
});
