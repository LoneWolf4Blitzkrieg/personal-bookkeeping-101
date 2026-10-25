// The author's note on honest work. His own words are kept below as the
// record; a Sonnet agent adapted them, at his request, for two places: the
// home page before Module 1, and the final exam before its first question.

import { escapeHTML } from '../js/html.js';

export const HONOR_NOTE_ORIGINAL = 'Do not use AI for answers or ask other people for answers. This is a course to better yourself. There is no money reward. There is no benefit for cheating. If you cheat, then you only hurt yourself. Alexander the Great did not achieve greatness over the world because he cheated, Marcus Aurelius did not strengthen the Roman Empire by cheating, and no man was ever granted objective acknowledgement of greatness by cheating. He earned it. Be the man or woman that your ancestors imagined you to be. Earn your certificate.';

export const HONOR_SIGNATURE = '— Raul Bautista, author of Personal Bookkeeping 101';

export const HONOR_NOTES = {
  start: {
    title: 'A note from the author',
    paragraphs: [
      'Welcome. Before you begin Module 1, I want to ask one thing of you.',
      'Do the checks and the final exam on your own. Please do not use AI for answers, and do not ask other people for answers. This course is free. There is no money reward, and there is no benefit in cheating. If you cheat, you only hurt yourself.',
      'Alexander the Great did not conquer much of the world by cheating. Marcus Aurelius did not strengthen the Roman Empire by cheating. No one was ever granted real recognition of greatness by cheating. They earned it.',
      'Be the person your ancestors imagined you to be. Take your time, reread when you need to, and make mistakes along the way. That is how you learn. Earn your certificate.',
    ],
  },
  exam: {
    title: 'Before you begin',
    paragraphs: [
      'This exam is yours alone. No AI, and no one else giving you answers. There is no money reward and no benefit in cheating. If you cheat, you only hurt yourself.',
      'Alexander the Great and Marcus Aurelius did not achieve greatness by cheating. No one ever has. They earned it.',
      'Be the person your ancestors imagined you to be. Breathe, take your time, and do your own work. Earn your certificate.',
    ],
  },
};

export function honorNoteHTML(which) {
  const note = HONOR_NOTES[which];
  const id = `author-note-${which}`;
  const paragraphs = note.paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('');
  return `<section class="author-note" aria-labelledby="${id}"><h2 id="${id}">${escapeHTML(note.title)}</h2>${paragraphs}<p class="author-note-signature">${escapeHTML(HONOR_SIGNATURE)}</p></section>`;
}
