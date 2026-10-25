// Placement tests (proposal: "Placement"), 10 questions each. Each is built
// from the checkpoints it skips: passing placement-ca opens Module 5, passing
// placement-cb opens Module 9. Taking one is optional.

import { CHECKPOINT_A_TEMPLATES } from './ca.js';
import { CHECKPOINT_B_TEMPLATES } from './cb.js';

export const PLACEMENT_A = {
  id: 'placement-ca',
  kind: 'placement',
  checkpointId: 'ca',
  title: 'Placement test: start at Module 5',
  templates: CHECKPOINT_A_TEMPLATES,
};

// Skipping Modules 1–8 means showing all of them in 10 questions (author's
// rule): one from each module, plus a recording and an explaining question
// from Module 8.
const PLACEMENT_B_IDS = [
  'm01-saving-share', 'm02-after-spending', 'm03-rule-balance', 'm04-record-paycheck', 'm05-group-total',
  'm06-record-journal', 'm07-receipt-split', 'm08-after-minimum', 'm08-record-card', 'm08-explain',
];
const ALL = [...CHECKPOINT_A_TEMPLATES, ...CHECKPOINT_B_TEMPLATES];
export const PLACEMENT_B = {
  id: 'placement-cb',
  kind: 'placement',
  checkpointId: 'cb',
  title: 'Placement test: start at Module 9',
  templates: PLACEMENT_B_IDS.map((id) => ALL.find((t) => t.id === id)),
};
