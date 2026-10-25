// The assessment page: one item at a time, the learner commits an answer
// before seeing feedback, then sees results with explanations.

import { escapeHTML } from '../html.js';
import { ledgerPanelHTML, citationHTML } from '../lessonView.js';
import { MODULE_CONTENT } from '../../content/modules/index.js';
import { parseAmount } from '../money.js';
import { assessmentVersions, withRecall } from '../items.js';
import { createSession, resumeSession, submit, currentItem, isComplete, summary } from '../session.js';
import { isUnlocked, nextVersion, attemptsFor, openSession, saveSession, sessionMatches, recordGate, recordCheckpoint, recordExam, recordPlacement, recordOther, recordPractice, recallDue, failureStep, addErrorEntry } from '../progress.js';
import { store, update, mountChrome, trackTime } from './chrome.js';
import { ASSESSMENTS } from '../../content/assess/index.js';
import { examIntroHTML } from '../examView.js';
import { celebrationHTML, wireCelebration } from '../celebration.js';

const moduleName = (id) => (/^m\d\d$/.test(id) ? `Module ${Number(id.slice(1))}` : /^a\d$/.test(id) ? `Add-on ${id.toUpperCase()}` : id === 'prereq' ? 'Money arithmetic refresher' : id);

const PART_LABELS = { interpreting: 'Read and predict', producing: 'Record it yourself', explaining: 'Explain why' };

function entryRowHTML(item, i) {
  const options = ['<option value="">Choose an account</option>', ...item.accounts.map((a) => `<option value="${escapeHTML(a.id)}">${escapeHTML(a.label)}</option>`)].join('');
  return `<tr>
    <td><select name="account" aria-label="Line ${i + 1} account">${options}</select></td>
    <td><input name="debit" inputmode="decimal" aria-label="Line ${i + 1} debit"></td>
    <td><input name="credit" inputmode="decimal" aria-label="Line ${i + 1} credit"></td>
  </tr>`;
}

function itemHTML(item, index, total) {
  const head = `<p class="crumb">Question ${index + 1} of ${total} · ${PART_LABELS[item.part]} · ${item.points} ${item.points === 1 ? 'point' : 'points'}</p>
    <p class="item-prompt" id="prompt">${escapeHTML(item.prompt)}</p>
    ${ledgerPanelHTML({ ...item, highlightRow: item.highlightRow ?? 0 })}${citationHTML(item)}`;
  if (item.kind === 'numeric') {
    return `${head}
      <form class="answer-form" data-kind="numeric">
        <label for="answer">Your answer (in dollars)</label>
        <div class="answer-row"><span aria-hidden="true">$</span><input id="answer" name="answer" inputmode="decimal" autocomplete="off" aria-describedby="prompt" required></div>
        <button class="button" type="submit">Check my answer</button>
      </form>`;
  }
  if (item.kind === 'amounts') {
    const fields = item.fields.map((f, i) => `<div class="amount-field"><label for="amount-${i}">${escapeHTML(f.label)}</label><div class="answer-row"><span aria-hidden="true">$</span><input id="amount-${i}" name="amount" inputmode="decimal" autocomplete="off" required></div></div>`).join('');
    return `${head}
      <form class="answer-form" data-kind="amounts" aria-describedby="prompt">
        ${fields}
        <button class="button" type="submit">Check my amounts</button>
      </form>`;
  }
  if (item.kind === 'entry') {
    return `${head}
      <form class="answer-form" data-kind="entry">
        <table class="entry-table" aria-describedby="prompt"><thead><tr><th scope="col">Account</th><th scope="col">Debit</th><th scope="col">Credit</th></tr></thead>
        <tbody>${[0, 1, 2].map((i) => entryRowHTML(item, i)).join('')}</tbody></table>
        <p><button class="link-button" type="button" data-action="add-line">Add a line</button></p>
        <button class="button" type="submit">Check my entry</button>
      </form>`;
  }
  return `${head}
    <form class="answer-form" data-kind="explain">
      <label for="explanation">Your explanation</label>
      <textarea id="explanation" name="text" rows="4" aria-describedby="prompt" required></textarea>
      <button class="button" type="submit">Show the model answer</button>
    </form>`;
}

function selfMarkHTML(result, text) {
  const ticks = result.rubric.map((c, i) =>
    `<li><label><input type="checkbox" name="tick" value="${i}"> ${escapeHTML(c)}</label></li>`).join('');
  return `<div class="feedback">
    <p><strong>Your answer:</strong> ${escapeHTML(text)}</p>
    <p><strong>Model answer:</strong> ${escapeHTML(result.modelAnswer)}</p>
    <form class="answer-form" data-kind="ticks">
      <fieldset><legend>Tick each point your answer made</legend><ul class="ticks">${ticks}</ul></fieldset>
      <button class="button" type="submit">Mark my answer</button>
    </form>
  </div>`;
}

function feedbackHTML(result) {
  const rubric = result.rubric && !result.selfMarked
    ? `<ul class="rubric">${result.rubric.map((r) => `<li class="${r.met ? 'met' : 'missed'}">${r.met ? '✓' : '✗'} ${escapeHTML(r.criterion)}</li>`).join('')}</ul>`
    : '';
  const tone = result.correct === false || (result.selfMarked && result.points < result.max) ? 'feedback-wrong' : 'feedback-right';
  return `<div class="feedback ${tone}">
    <p><strong>${result.points} of ${result.max} ${result.max === 1 ? 'point' : 'points'}.</strong> ${escapeHTML(result.feedback ?? '')}</p>${rubric}
    <button class="button" type="button" data-action="next">Next</button>
  </div>`;
}

const VERDICTS = {
  gate: {
    pass: 'Passed. You have shown you understand this module.',
    retry: 'Not yet. You need 80% of the points (20 of 24). The "Record it yourself" questions are worth the most, so look at those first.',
  },
  checkpoint: {
    pass: 'Passed. Everything so far has stuck.',
    retry: 'Not yet. You need 80%. Go back to the earliest module listed below, redo its practice set and gate, then try this checkpoint again.',
  },
  exam: { pass: 'Passed. You have completed the course.', retry: 'Not yet. You need 80%. Review the modules listed below, earliest first, then try again. You will get a different version.' },
  retention: { pass: 'Well remembered. Four weeks on, the course has stuck.', retry: 'Some of it has faded, which is normal after four weeks. Reread the modules listed below; nothing in the course is locked by this review.' },
  prereq: {
    pass: 'Passed. You have the money arithmetic this course uses. Start Module 1 whenever you are ready.',
    retry: 'Not yet. Work through the <a href="lesson.html?m=prereq">money arithmetic refresher</a>, then take this check again. It only takes a few minutes.',
  },
  practice: { pass: 'Practice set done. When you are ready, take the module check.', retry: 'Practice set done. Look over the explanations for the questions you missed, then take the module check when you are ready.' },
};

// Placement results name the module the learner may start at. The Module 9
// test is taken after Modules 1–4 are counted as passed, so a learner who
// does not pass it starts at Module 5.
const PLACEMENT_START = { ca: 'm05', cb: 'm09' };
const PLACEMENT_RETRY = {
  ca: 'Not yet. You need 80%. Start at Module 1 and work through the modules listed below; nothing is lost by starting at the beginning. You can try the placement test again later.',
  cb: 'Not yet. You need 80%. Modules 1 to 4 still count as passed, so <a href="lesson.html?m=m05">start at Module 5</a> and work through the modules listed below. You can try this placement test again later.',
};
function placementWords(checkpointId) {
  const start = PLACEMENT_START[checkpointId];
  return {
    pass: `Passed. You can start at <a href="lesson.html?m=${start}">Module ${Number(start.slice(1))}</a>. The earlier modules stay open if you want to review them.`,
    retry: PLACEMENT_RETRY[checkpointId],
  };
}

function resultsHTML(session) {
  const s = summary(session);
  const kind = session.meta?.kind ?? 'gate';
  const words = kind === 'placement' ? placementWords(session.meta.checkpointId) : VERDICTS[kind] ?? VERDICTS.gate;
  const score = s.max !== undefined ? `${s.points} of ${s.max}` : `${s.percent}%`;
  const missedList = s.missedModules ?? (['exam', 'retention'].includes(kind) && !s.passed ? [...new Set(session.results.filter((r) => r.points < r.max).map((r) => r.module))] : []);
  const missed = missedList.length ? `<p>Review these first: ${missedList.map((id) => `<a href="lesson.html?m=${escapeHTML(id)}">${escapeHTML(moduleName(id))}</a>`).join(', ')}</p>` : '';
  const rows = session.results.map((r, i) => {
    const item = session.items[i];
    const why = item.kind === 'explain' ? `Model answer: ${item.modelAnswer}` : (item.explanation ?? '');
    return `<tr><td>${i + 1}</td><td>${PART_LABELS[r.part]}</td><td>${r.points} / ${r.max}</td><td>${escapeHTML(why)}</td></tr>`;
  }).join('');
  return `<h2 id="results-heading" tabindex="-1">Your result: ${score}</h2>
    <p class="verdict ${s.passed ? 'pass' : 'retry'}">${s.passed ? words.pass : words.retry}</p>${missed}
    <table class="results"><thead><tr><th scope="col">Question</th><th scope="col">Part</th><th scope="col">Points</th><th scope="col">Why</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function readEntry(form) {
  const lines = [];
  const errors = [];
  form.querySelectorAll('tbody tr').forEach((tr, i) => {
    const account = tr.querySelector('[name=account]').value;
    const amounts = {};
    for (const side of ['debit', 'credit']) {
      const field = tr.querySelector(`[name=${side}]`);
      const raw = field.value.trim();
      field.removeAttribute('aria-invalid');
      if (raw === '') { amounts[side] = 0; continue; }
      const parsed = parseAmount(raw);
      if (parsed.ok) amounts[side] = parsed.cents;
      else { errors.push({ label: `Line ${i + 1} ${side}`, field }); field.setAttribute('aria-invalid', 'true'); }
    }
    lines.push({ account, debit: amounts.debit ?? 0, credit: amounts.credit ?? 0 });
  });
  return { lines, errors };
}

const safeAttempt = (n) => (Number.isInteger(n) && n >= 1 ? Math.min(n, 4) : 1);

const NEXT_STEPS = {
  retake: 'Do the module\'s practice set again with fresh problems, then take this check again. You will get a different version.',
  'rework-example': 'Go back to the module\'s worked example and rework it by hand. Write in your error log below what went wrong and why, then take the check again.',
  remediation: 'Work through the module\'s extra practice on common mistakes, and read the free articles linked at the end of the module. Then take the check again. Needing more tries is normal; it is how the course makes sure nothing is skipped.',
};

function errorLogFormHTML() {
  return `<form class="answer-form error-log-form" data-kind="errorlog">
    <h3>Add to your error log</h3>
    <p>Writing down a mistake turns it into practice. Fill this in for any question you missed.</p>
    <label for="log-error">What went wrong</label><input id="log-error" name="error" required>
    <label for="log-cause">Why it happened</label><input id="log-cause" name="cause" required>
    <label for="log-fix">The correct way</label><input id="log-fix" name="correction" required>
    <button class="button" type="submit">Save to my error log</button>
  </form>`;
}

// Records a finished sitting in the learner's progress, with per-question
// results for the evaluation plan.
function recordResult(progress, session, at) {
  const { assessmentId, kind, version } = session.meta;
  const score = summary(session);
  const items = session.results.map((r) => ({ templateId: r.templateId, module: r.module, part: r.part, points: r.points, max: r.max, selfMarked: Boolean(r.selfMarked) }));
  if (kind === 'gate') return recordGate(progress, assessmentId, score, at, version, items);
  if (kind === 'checkpoint') return recordCheckpoint(progress, assessmentId, score, at, version, items);
  if (kind === 'placement') return recordPlacement(progress, session.meta.checkpointId, score, at, version, items);
  if (kind === 'exam') return recordExam(progress, score, at, version, items);
  if (kind === 'practice') return recordPractice(progress, session.meta.module, score, at, session.meta.recalled ?? null);
  return recordOther(progress, assessmentId, score, at, version, items);
}

// Items for a given attempt. Every attempt gets fresh numbers; if a check's
// templates cannot make that many different versions, versions repeat.
function itemsFor(assessment, version) {
  const shape = assessment.kind === 'gate' ? 'gate' : null;
  const base = assessment.kind === 'gate' ? 4 : 2;
  try {
    return assessmentVersions(assessment.templates, assessment.id, { count: Math.max(base, version), shape })[version - 1];
  } catch {
    return assessmentVersions(assessment.templates, assessment.id, { count: base, shape })[(version - 1) % base];
  }
}

export function startAssessment(root, id, requestedVersion) {
  mountChrome();
  let progress = store.load();
  const assessment = ASSESSMENTS[id];
  if (!assessment) {
    root.innerHTML = '<h1>Check not found</h1><p>There is no check with that name. Return to the course map to find your next step.</p>';
    return;
  }
  // Practice sets open with their module.
  const access = assessment.alwaysOpen ? { unlocked: true } : isUnlocked(assessment.kind === 'practice' ? assessment.module : assessment.id, progress);
  if (!access.unlocked) {
    root.innerHTML = `<h1>${escapeHTML(assessment.title)}</h1><div class="lock-notice"><p><strong>Not open yet.</strong> ${escapeHTML(access.reason)}</p></div>`;
    return;
  }
  // The demonstration gate lets ?v= choose a version; real checks use the learner's attempt count.
  const version = assessment.alwaysOpen && requestedVersion ? safeAttempt(requestedVersion) : nextVersion(progress, assessment.id);
  // A module's practice set also carries recall questions from any module
  // whose gate was failed recently (proposal: "Passing and retaking").
  const recalled = assessment.kind === 'practice' ? recallDue(progress).filter((m) => m !== assessment.module && MODULE_CONTENT[m]?.recallTemplates) : [];
  const recall = recalled.flatMap((m) => MODULE_CONTENT[m].recallTemplates);
  const items = itemsFor(recall.length ? { ...assessment, templates: withRecall(assessment.templates, recall) } : assessment, version);
  const meta = { assessmentId: assessment.id, kind: assessment.kind, version, ...(assessment.checkpointId ? { checkpointId: assessment.checkpointId } : {}), ...(assessment.module ? { module: assessment.module, recalled } : {}) };
  const saved = openSession(progress, assessment.id);
  let session = saved && saved.meta.version === version ? resumeSession(items, meta, saved.results) : createSession(items, meta);
  const attemptsAtStart = attemptsFor(progress, assessment.id);
  let pendingText = '';
  let examBegun = false;
  let stale = false;
  // A sitting that was already complete when saved (for example after a
  // template changed) is recorded now rather than left hanging.
  if (saved && isComplete(session)) progress = update((p) => recordResult(p, session, new Date().toISOString()));
  if (assessment.kind === 'gate') trackTime(assessment.id);

  root.innerHTML = `<h1>${escapeHTML(assessment.title)}</h1>
    <p class="lede-small">Answer each question before you check it. Take as long as you need; nothing is timed.</p>
    <div id="item"></div><div id="response" aria-live="polite"></div>`;
  const itemBox = root.querySelector('#item');
  const responseBox = root.querySelector('#response');

  function show() {
    responseBox.innerHTML = '';
    if (isComplete(session)) {
      itemBox.innerHTML = resultsHTML(session);
      const s = summary(session);
      if (session.meta.kind === 'gate' && !s.passed) {
        const failed = (store.load().modules[session.meta.assessmentId]?.gateAttempts ?? []).filter((a) => !a.passed).length;
        itemBox.insertAdjacentHTML('beforeend', `<div class="next-step"><h3>What to do next</h3><p>${NEXT_STEPS[failureStep(failed)]}</p></div>`);
      }
      if (!s.passed) itemBox.insertAdjacentHTML('beforeend', errorLogFormHTML());
      if (session.meta.kind === 'exam' && s.passed) {
        itemBox.querySelector('#results-heading').insertAdjacentHTML('beforebegin', celebrationHTML());
        wireCelebration(itemBox.querySelector('.celebration'));
        itemBox.querySelector('#celebration-title').focus();
        return;
      }
      // Passing the last add-on check opens the final exam.
      if (session.meta.kind === 'gate' && session.meta.assessmentId === 'a3' && s.passed) {
        itemBox.querySelector('.verdict').insertAdjacentHTML('afterend', '<p><a class="button" href="assess.html?id=exam">Go to the final exam</a></p>');
      }
      itemBox.querySelector('#results-heading').focus();
      return;
    }
    // Before the exam's first question: the author's note on honest work.
    if (session.meta.kind === 'exam' && session.results.length === 0 && !examBegun) {
      itemBox.innerHTML = examIntroHTML();
      return;
    }
    itemBox.innerHTML = itemHTML(currentItem(session), session.results.length, session.items.length);
    itemBox.querySelector('input, textarea, select')?.focus();
  }

  root.addEventListener('click', (e) => {
    const action = e.target.dataset?.action;
    if (action === 'next') show();
    if (action === 'begin-exam') { examBegun = true; show(); }
    if (action === 'add-line') {
      const tbody = itemBox.querySelector('.entry-table tbody');
      tbody.insertAdjacentHTML('beforeend', entryRowHTML(currentItem(session), tbody.rows.length));
      tbody.rows[tbody.rows.length - 1].querySelector('select').focus();
    }
  });

  // Enter inside the entry table moves to the next box instead of submitting.
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.closest?.('.entry-table')) return;
    e.preventDefault();
    const fields = [...itemBox.querySelectorAll('.entry-table select, .entry-table input')];
    const next = fields[fields.indexOf(e.target) + 1];
    (next ?? itemBox.querySelector('.answer-form button[type=submit]'))?.focus();
  });

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const kind = form.dataset.kind;
    if (kind === 'errorlog') {
      progress = update((p) => addErrorEntry(p, { moduleId: session.meta.assessmentId, error: form.error.value.trim(), cause: form.cause.value.trim(), correction: form.correction.value.trim() }, new Date().toISOString()));
      form.outerHTML = '<p class="feedback feedback-right" id="log-saved" tabindex="-1">Saved to your error log. Review it before your next try.</p>';
      root.querySelector('#log-saved').focus();
      return;
    }
    if (stale) return;
    let response;
    if (kind === 'numeric') response = form.answer.value;
    if (kind === 'amounts') response = [...form.querySelectorAll('[name=amount]')].map((el) => el.value);
    if (kind === 'entry') {
      const { lines, errors } = readEntry(form);
      if (errors.length) {
        responseBox.innerHTML = `<p class="feedback feedback-note">Check these amounts: ${escapeHTML(errors.map((x) => x.label).join(', '))}. Use digits, for example 75.14.</p>`;
        errors[0].field.focus();
        return;
      }
      response = lines;
    }
    if (kind === 'explain') { pendingText = form.text.value; response = { text: pendingText }; }
    if (kind === 'ticks') {
      const ticks = currentItem(session).rubric.map((_, i) => form.querySelector(`[name=tick][value="${i}"]`).checked);
      response = { text: pendingText, ticks };
    }

    const before = session.results.length;
    const previous = session;
    session = submit(session, response);
    const result = session.last;
    if (result.invalid) {
      responseBox.innerHTML = `<p class="feedback feedback-note">${escapeHTML(result.feedback)}</p>`;
      return;
    }
    if (result.selfMarked && session.results.length === before) {
      responseBox.innerHTML = selfMarkHTML(result, pendingText);
      itemBox.querySelector('form')?.querySelectorAll('textarea, button').forEach((el) => { el.disabled = true; });
      responseBox.querySelector('[name=tick]')?.focus();
      return;
    }
    // Another tab or window may have moved this sitting on. If so, keep its
    // version of events and ask the learner to reload.
    if (!sessionMatches(store.load(), session.meta, previous.results.length, attemptsAtStart)) {
      stale = true;
      session = previous;
      responseBox.innerHTML = '<p class="feedback feedback-wrong">This check was changed in another tab or window. Reload this page to continue from where it is now.</p>';
      itemBox.querySelectorAll('form input, form select, form textarea, form button').forEach((el) => { el.disabled = true; });
      return;
    }
    // Keep the sitting safe: save after every answer, record the result at the end.
    progress = update((p) => (isComplete(session)
      ? recordResult(p, session, new Date().toISOString())
      : saveSession(p, session.meta, session.results)));
    itemBox.querySelectorAll('form input, form select, form textarea, form button').forEach((el) => { el.disabled = true; });
    responseBox.innerHTML = feedbackHTML(result);
    responseBox.querySelector('[data-action=next]')?.focus();
  });

  show();
}

