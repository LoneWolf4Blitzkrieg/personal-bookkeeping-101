// Placement tests (proposal: "Placement"). Each is built from the
// checkpoints it skips: passing placement-ca opens Module 5, passing
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

// Skipping Modules 1–8 means showing all of them, so this draws on both
// checkpoints.
export const PLACEMENT_B = {
  id: 'placement-cb',
  kind: 'placement',
  checkpointId: 'cb',
  title: 'Placement test: start at Module 9',
  templates: [...CHECKPOINT_A_TEMPLATES, ...CHECKPOINT_B_TEMPLATES],
};
