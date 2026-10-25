// The screen before the final exam's first question: the author's note on
// honest work (content/honor.js), then a button to begin. Pure.

import { honorNoteHTML } from '../content/honor.js';

export function examIntroHTML() {
  return `<div class="exam-intro">${honorNoteHTML('exam')}
  <p>The exam has 50 questions. Take as long as you need: nothing is timed, and your answers are saved as you go. You need 80% of the points to pass.</p>
  <p><button class="button" type="button" data-action="begin-exam">I am ready: begin the exam</button></p>
</div>`;
}
