// Checkpoint B: everything from Modules 5–8. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.

import { M05_CHECKPOINT } from '../modules/m05.js';
import { M06_CHECKPOINT } from '../modules/m06.js';
import { M07_CHECKPOINT } from '../modules/m07.js';
import { M08_CHECKPOINT } from '../modules/m08.js';

export const CHECKPOINT_B_TEMPLATES = [...M05_CHECKPOINT, ...M06_CHECKPOINT, ...M07_CHECKPOINT, ...M08_CHECKPOINT];

export const CHECKPOINT_B = {
  id: 'cb',
  kind: 'checkpoint',
  title: 'Checkpoint B: Modules 5–8',
  templates: CHECKPOINT_B_TEMPLATES,
};
