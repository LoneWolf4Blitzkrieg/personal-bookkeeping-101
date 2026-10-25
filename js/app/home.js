// Home page: course map with progress, the error log, and saving or loading
// a progress file (a backup, or a way to move to another device).

import { renderCourseMap } from './nav.js';
import { exportProgress, importProgress } from '../progress.js';
import { escapeHTML } from '../html.js';
import { store, replace, mountChrome, onExternalChange } from './chrome.js';

function errorLogHTML(log) {
  if (log.length === 0) return '<p>Nothing yet. When you miss a question in a check, you can note what went wrong here.</p>';
  const rows = [...log].reverse().map((e) => `<tr><td>${escapeHTML(new Date(e.at).toLocaleDateString())}</td><td>${escapeHTML(e.moduleId)}</td><td>${escapeHTML(e.error)}</td><td>${escapeHTML(e.cause)}</td><td>${escapeHTML(e.correction)}</td></tr>`).join('');
  return `<table class="results error-log"><thead><tr><th scope="col">Date</th><th scope="col">Where</th><th scope="col">What went wrong</th><th scope="col">Why</th><th scope="col">The correct way</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function startHomePage() {
  mountChrome();
  const draw = () => {
    const progress = store.load();
    renderCourseMap(document.getElementById('course-map'), progress, null, { headingLevel: 3 });
    document.getElementById('error-log').innerHTML = errorLogHTML(progress.errorLog);
  };
  draw();
  onExternalChange(draw);

  document.getElementById('export-progress').addEventListener('click', () => {
    const blob = new Blob([exportProgress(store.load())], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookkeeping-101-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  const status = document.getElementById('import-status');
  document.getElementById('import-progress').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = importProgress(await file.text());
    e.target.value = '';
    if (!result.ok) {
      status.textContent = `${result.reason} Your current progress has not changed.`;
      return;
    }
    if (!window.confirm('Replace your current progress with the progress in this file? Anything you did after the file was saved will be replaced.')) {
      status.textContent = 'Nothing changed.';
      return;
    }
    status.textContent = replace(result.progress) ? 'Progress loaded from the file.' : 'This browser could not store the progress. Try again in a normal browser window.';
    draw();
  });
}
