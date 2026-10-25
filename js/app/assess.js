// The assessment page: one item at a time, the learner commits an answer
// before seeing feedback, then sees results with explanations.

import { escapeHTML } from '../html.js';
import { ledgerHTML } from '../ledgerView.js';
import { parseAmount } from '../money.js';
import { gateVersions } from '../items.js';
import { createSession, submit, currentItem, isComplete, summary } from '../session.js';
import { DEMO_GATE } from '../../content/assess/demo.js';

const ASSESSMENTS = { demo: DEMO_GATE };

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
  const head = `<p class="crumb">Question ${index + 1} of ${total} · ${PART_LABELS[item.part]} · ${item.points} points</p>
    <p class="item-prompt">${escapeHTML(item.prompt)}</p>
    ${item.ledger ? ledgerHTML(item.ledger, { highlightRow: 0 }) : ''}`;
  if (item.kind === 'numeric') {
    return `${head}
      <form class="answer-form" data-kind="numeric">
        <label for="answer">Your answer (in dollars)</label>
        <div class="answer-row"><span aria-hidden="true">$</span><input id="answer" name="answer" inputmode="decimal" autocomplete="off" required></div>
        <button class="button" type="submit">Check my answer</button>
      </form>`;
  }
  if (item.kind === 'entry') {
    return `${head}
      <form class="answer-form" data-kind="entry">
        <table class="entry-table"><thead><tr><th scope="col">Account</th><th scope="col">Debit</th><th scope="col">Credit</th></tr></thead>
        <tbody>${[0, 1, 2].map((i) => entryRowHTML(item, i)).join('')}</tbody></table>
        <p><button class="link-button" type="button" data-action="add-line">Add a line</button></p>
        <button class="button" type="submit">Check my entry</button>
      </form>`;
  }
  return `${head}
    <form class="answer-form" data-kind="explain">
      <label for="explanation">Your explanation</label>
      <textarea id="explanation" name="text" rows="4" required></textarea>
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
  return `<div class="feedback ${tone}" role="status">
    <p><strong>${result.points} of ${result.max} points.</strong> ${escapeHTML(result.feedback ?? '')}</p>${rubric}
    <button class="button" type="button" data-action="next">Next</button>
  </div>`;
}

function resultsHTML(session) {
  const s = summary(session);
  const rows = session.results.map((r, i) => `<tr><td>${i + 1}</td><td>${PART_LABELS[r.part]}</td><td>${r.points} / ${r.max}</td></tr>`).join('');
  const verdict = s.passed
    ? '<p class="verdict pass">Passed. You have shown you understand this module.</p>'
    : `<p class="verdict retry">Not yet. You need 8 of 10 points, with the "Record it yourself" question fully correct. Review the module and try a different version of this check.</p>`;
  return `<h2>Your result: ${s.points} of ${s.max}</h2>${verdict}
    <table class="results"><thead><tr><th scope="col">Question</th><th scope="col">Part</th><th scope="col">Points</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function readEntry(form) {
  const lines = [];
  const errors = [];
  form.querySelectorAll('tbody tr').forEach((tr, i) => {
    const account = tr.querySelector('[name=account]').value;
    const amounts = {};
    for (const side of ['debit', 'credit']) {
      const raw = tr.querySelector(`[name=${side}]`).value.trim();
      if (raw === '') { amounts[side] = 0; continue; }
      const parsed = parseAmount(raw);
      if (parsed.ok) amounts[side] = parsed.cents;
      else errors.push(`Line ${i + 1} ${side}`);
    }
    lines.push({ account, debit: amounts.debit ?? 0, credit: amounts.credit ?? 0 });
  });
  return { lines, errors };
}

export function startAssessment(root, id, attempt = 1) {
  const assessment = ASSESSMENTS[id];
  if (!assessment) {
    root.innerHTML = '<h1>Check not found</h1><p>There is no check with that name. Return to the course map to find your next step.</p>';
    return;
  }
  const version = Math.min(Math.max(attempt, 1), 4) - 1;
  const items = gateVersions(assessment.templates, assessment.id)[version];
  let session = createSession(items);
  let pendingText = '';

  root.innerHTML = `<h1>${escapeHTML(assessment.title)}</h1>
    <p class="lede-small">Answer each question before you check it. Take as long as you need; nothing is timed.</p>
    <div id="item"></div><div id="response" aria-live="polite"></div>`;
  const itemBox = root.querySelector('#item');
  const responseBox = root.querySelector('#response');

  function show() {
    responseBox.innerHTML = '';
    if (isComplete(session)) {
      itemBox.innerHTML = resultsHTML(session);
      return;
    }
    itemBox.innerHTML = itemHTML(currentItem(session), session.results.length, session.items.length);
    itemBox.querySelector('input, textarea, select')?.focus();
  }

  root.addEventListener('click', (e) => {
    const action = e.target.dataset?.action;
    if (action === 'next') show();
    if (action === 'add-line') {
      const tbody = itemBox.querySelector('.entry-table tbody');
      tbody.insertAdjacentHTML('beforeend', entryRowHTML(currentItem(session), tbody.rows.length));
    }
  });

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const kind = form.dataset.kind;
    let response;
    if (kind === 'numeric') response = form.answer.value;
    if (kind === 'entry') {
      const { lines, errors } = readEntry(form);
      if (errors.length) {
        responseBox.innerHTML = `<p class="feedback feedback-note" role="status">Check these amounts: ${escapeHTML(errors.join(', '))}. Use digits, for example 75.14.</p>`;
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
    session = submit(session, response);
    const result = session.last;
    if (result.invalid) {
      responseBox.innerHTML = `<p class="feedback feedback-note" role="status">${escapeHTML(result.feedback)}</p>`;
      return;
    }
    if (result.selfMarked && session.results.length === before) {
      responseBox.innerHTML = selfMarkHTML(result, pendingText);
      itemBox.querySelector('form')?.querySelectorAll('textarea, button').forEach((el) => { el.disabled = true; });
      return;
    }
    itemBox.querySelectorAll('form input, form select, form textarea, form button').forEach((el) => { el.disabled = true; });
    responseBox.innerHTML = feedbackHTML(result);
    responseBox.querySelector('[data-action=next]')?.focus();
  });

  show();
}

