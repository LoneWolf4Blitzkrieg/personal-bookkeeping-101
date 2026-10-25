// Placement tests (proposal: "Placement"), 10 questions each, built from the
// checkpoint each one stands in for: placement-ca (Modules 1–4) opens Module 5;
// placement-cb (Modules 5–8, open after placement-ca) opens Module 9. Optional.

import { CHECKPOINT_A_TEMPLATES } from './ca.js';
import { CHECKPOINT_B_TEMPLATES } from './cb.js';

export const PLACEMENT_A = {
  id: 'placement-ca',
  kind: 'placement',
  checkpointId: 'ca',
  title: 'Placement test: start at Module 5',
  templates: CHECKPOINT_A_TEMPLATES,
};

// The second stage (author's ruling): after Modules 1–4 are counted as
// passed, this covers Modules 5–8 with Checkpoint B's 10 questions, so
// skipping eight modules takes 20 questions in two tests.
export const PLACEMENT_B = {
  id: 'placement-cb',
  kind: 'placement',
  checkpointId: 'cb',
  title: 'Placement test: start at Module 9 (step 2 of 2)',
  templates: CHECKPOINT_B_TEMPLATES,
};
