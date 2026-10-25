// The celebration after the final exam is passed: the author's message,
// fireworks on a canvas and the Ode to Joy. Browsers do not let a page start
// sound by itself, so the music starts from the learner's click. A Stop
// button (or Escape) ends both. Learners who ask for less motion get slow,
// gentle sparkles instead of fireworks.

import { escapeHTML } from './html.js';
import { CELEBRATION } from '../content/celebration.js';

export function celebrationHTML(text = CELEBRATION) {
  return `<section class="celebration" aria-labelledby="celebration-title">
  <h2 id="celebration-title" tabindex="-1">${escapeHTML(text.headline)}</h2>
  <p class="celebration-message">${escapeHTML(text.message)}</p>
  <p class="celebration-controls"><button class="button" type="button" data-action="celebrate">${escapeHTML(text.button)}</button>
  <button class="button button-secondary" type="button" data-action="stop-celebration" hidden>Stop the music and fireworks</button></p>
  <p><a class="button" href="certificate.html">Get your certificate</a></p>
  <p class="celebration-credit">${escapeHTML(text.musicCredit)}</p>
</section>`;
}

const COLORS = ['#f4d35e', '#ee964b', '#f95738', '#7bd389', '#5fa8d3', '#c77dff', '#ffffff'];

// Runs in the browser only. Returns a function that stops everything.
export function startCelebration({ reducedMotion = false, music = CELEBRATION.music, onStop = () => {} } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'celebration-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const fit = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  fit();
  window.addEventListener('resize', fit);

  const audio = new Audio(music);
  audio.play().catch(() => {}); // a blocked or missing file leaves the fireworks running quietly

  let particles = [];
  let frame = null;
  let last = 0;
  let stopped = false;
  const rand = (a, b) => a + Math.random() * (b - a);

  function burst() {
    const x = rand(0.15, 0.85) * canvas.width;
    const y = rand(0.15, 0.5) * canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 * i) / 70;
      const speed = rand(1.5, 4.5);
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: rand(60, 100), color });
    }
  }

  function fireworks(t) {
    if (stopped) return;
    if (t - last > 650) { burst(); last = t; }
    // Fade the last frame out (trails) while keeping the page readable underneath.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.99; p.life -= 1;
      ctx.globalAlpha = Math.max(0, p.life / 100);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(fireworks);
  }

  // Reduced motion: a few still sparkles that slowly brighten and fade.
  let sparkleTimer = null;
  function sparkles() {
    const dots = Array.from({ length: 40 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.6, phase: Math.random() * Math.PI * 2, color: COLORS[Math.floor(Math.random() * COLORS.length)] }));
    let t = 0;
    sparkleTimer = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.15;
      for (const d of dots) {
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t + d.phase);
        ctx.fillStyle = d.color;
        ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }, 200);
  }

  if (reducedMotion) sparkles(); else frame = requestAnimationFrame(fireworks);

  function stop() {
    if (stopped) return;
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    if (sparkleTimer) clearInterval(sparkleTimer);
    audio.pause();
    window.removeEventListener('resize', fit);
    window.removeEventListener('keydown', onKey);
    canvas.remove();
    onStop();
  }
  function onKey(e) { if (e.key === 'Escape') stop(); }
  window.addEventListener('keydown', onKey);
  // The fireworks end with the music (about 50 seconds), or after a minute if it does not play.
  audio.addEventListener('ended', () => setTimeout(stop, 2500));
  setTimeout(() => { if (audio.paused) stop(); }, 60000);
  return stop;
}

// Wires a celebration section's buttons. Browser only.
export function wireCelebration(section) {
  const start = section.querySelector('[data-action="celebrate"]');
  const stopButton = section.querySelector('[data-action="stop-celebration"]');
  let stop = null;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  start.addEventListener('click', () => {
    if (stop) return;
    start.hidden = true;
    stopButton.hidden = false;
    stopButton.focus();
    stop = startCelebration({ reducedMotion, onStop: () => { stop = null; start.hidden = false; stopButton.hidden = true; start.focus(); } });
  });
  stopButton.addEventListener('click', () => stop?.());
}
