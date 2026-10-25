// The certificate page: locked until the final project and the final exam
// are done; then the learner types their name as it should appear, and can
// print the certificate on one page or download it as a file.

import { escapeHTML } from '../html.js';
import { certificateStatus, certificateHTML, certificateDocument, certificateFileName, cleanName, CERTIFICATE_CSS } from '../certificate.js';
import { saveCertificateName } from '../progress.js';
import { store, update, mountChrome } from './chrome.js';

export function startCertificatePage(root) {
  mountChrome();
  const style = document.createElement('style');
  style.textContent = CERTIFICATE_CSS;
  document.head.appendChild(style);

  const progress = store.load();
  const status = certificateStatus(progress);
  if (!status.ready) {
    root.innerHTML = `<div class="lock-notice"><p><strong>Not yet.</strong> ${escapeHTML(status.reason)}</p>
      <p>Your certificate is waiting for you at the end of the course. <a href="index.html#course-map">Go to the course map</a>.</p></div>`;
    return;
  }

  root.innerHTML = `<form class="answer-form no-print" id="name-form">
      <label for="certificate-name">Your name, as it should appear on the certificate</label>
      <input id="certificate-name" name="name" autocomplete="name" maxlength="80" required value="${escapeHTML(progress.certificateName ?? '')}">
      <button class="button" type="submit">Show my certificate</button>
    </form>
    <div id="certificate-view"></div>`;
  const form = root.querySelector('#name-form');
  const view = root.querySelector('#certificate-view');

  function draw(name) {
    if (!cleanName(name)) { view.innerHTML = ''; return; }
    view.innerHTML = `${certificateHTML({ name, date: status.date })}
      <p class="certificate-actions no-print"><button class="button" type="button" id="print-certificate">Print</button>
      <button class="button button-secondary" type="button" id="download-certificate">Download as a file</button></p>
      <p class="no-print">To save a PDF, choose Print, then pick "Save as PDF" as the printer.</p>`;
    view.querySelector('#print-certificate').addEventListener('click', () => window.print());
    view.querySelector('#download-certificate').addEventListener('click', () => {
      const blob = new Blob([certificateDocument({ name, date: status.date })], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = certificateFileName(name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = cleanName(form.name.value);
    if (!name) return;
    update((p) => saveCertificateName(p, name));
    draw(name);
    view.querySelector('.certificate')?.scrollIntoView({ behavior: 'smooth' });
  });
  if (progress.certificateName) draw(progress.certificateName);
}
