// Draws one lesson step (pure: returns HTML strings). The pinned ledger is
// drawn separately by ledgerPanelHTML so it can sit beside the text.

import { escapeHTML } from './html.js';
import { ledgerHTML, journalHTML } from './ledgerView.js';
import { gradeItem } from './grade.js';

export function gradePrediction(step, typed) {
  return gradeItem({ kind: 'numeric', points: 1, answer: step.answer, misconceptions: step.misconceptions, explanation: step.explanation }, typed);
}

// A source document drawn beside the ledger: a pay stub, receipt, check or
// bank statement, as { kind, title, lines: [[label, value], ...], note }.
export function sourceDocHTML(doc) {
  const rows = doc.lines.map(([label, value]) => `<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(value)}</td></tr>`).join('');
  return `<figure class="source-doc source-${escapeHTML(doc.kind)}"><figcaption>${escapeHTML(doc.title)}</figcaption><table>${rows}</table>${doc.note ? `<p class="source-note">${escapeHTML(doc.note)}</p>` : ''}</figure>`;
}

export function ledgerPanelHTML(step, { revealed = false } = {}) {
  const parts = [];
  if (step.sourceDoc) parts.push(sourceDocHTML(step.sourceDoc));
  if (step.journalPage) parts.push(journalHTML(step.journalPage, { highlightEntry: step.highlightEntry ?? null }));
  if (step.ledger) parts.push(ledgerHTML(step.ledger, { highlightRow: step.highlightRow ?? null, showAnswers: revealed }));
  return parts.join('');
}

export function stepHTML(module, index, { revealed = false, feedback = null } = {}) {
  const step = module.steps[index];
  const last = index === module.steps.length - 1;
  const text = (step.text ?? []).map((p) => `<p>${escapeHTML(p)}</p>`).join('');
  const title = step.title ? `<h2 class="step-title" id="step-title" tabindex="-1">${escapeHTML(step.title)}</h2>` : `<h2 class="visually-hidden" id="step-title" tabindex="-1">Step ${index + 1}</h2>`;
  let body = text;
  if (step.prompt) {
    body += `<div class="self-explain"><label for="self-explain">${escapeHTML(step.prompt)}</label><textarea id="self-explain" rows="3" placeholder="Say it in your own words before you go on."></textarea></div>`;
  }
  const waiting = step.kind === 'predict' && !revealed;
  if (waiting) {
    body += `<form class="answer-form predict-form" data-kind="predict">
      <label for="prediction">Your prediction (in dollars)</label>
      <div class="answer-row"><span aria-hidden="true">$</span><input id="prediction" name="prediction" inputmode="decimal" autocomplete="off" required></div>
      ${feedback?.invalid ? `<p class="feedback feedback-note">${escapeHTML(feedback.feedback)}</p>` : ''}
      <button class="button" type="submit">Check my prediction</button>
    </form>`;
  } else if (step.kind === 'predict' && feedback) {
    body += `<div class="feedback ${feedback.correct ? 'feedback-right' : 'feedback-wrong'}"><p>${escapeHTML(feedback.correct ? 'Your prediction was right.' : 'Not quite.')} ${escapeHTML(feedback.feedback)}</p></div>`;
  }
  const back = index > 0 ? '<button class="button button-secondary" type="button" data-action="back">◀ Back</button>' : '';
  const reread = '<button class="button button-secondary" type="button" data-action="reread">Reread this step</button>';
  const next = !last && !waiting ? '<button class="button" type="button" data-action="next">Next ▶</button>' : '';
  const finish = last && !waiting
    ? `<div class="lesson-end"><p><strong>You have finished the lesson.</strong> Next, do the practice set, then take the module check. You need 8 of 10 points to move on.</p>
       <p><a class="button" href="assess.html?id=${escapeHTML(module.checkId ?? module.id)}">Take the module check</a></p></div>`
    : '';
  return `<p class="crumb">Step ${index + 1} of ${module.steps.length}</p>${title}${body}<div class="step-nav">${back}${reread}${next}</div>${finish}`;
}
