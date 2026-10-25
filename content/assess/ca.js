// Checkpoint A: everything from Modules 1–4. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.

import { M01_CHECKPOINT } from '../modules/m01.js';
import { M02_CHECKPOINT } from '../modules/m02.js';
import { M03_CHECKPOINT } from '../modules/m03.js';
import { M04_CHECKPOINT } from '../modules/m04.js';

export const CHECKPOINT_A_TEMPLATES = [...M01_CHECKPOINT, ...M02_CHECKPOINT, ...M03_CHECKPOINT, ...M04_CHECKPOINT];

export const CHECKPOINT_A = {
  id: 'ca',
  kind: 'checkpoint',
  title: 'Checkpoint A: Modules 1–4',
  templates: CHECKPOINT_A_TEMPLATES,
};
