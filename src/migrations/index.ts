import * as migration_20260803_120126_initial from './20260803_120126_initial';

export const migrations = [
  {
    up: migration_20260803_120126_initial.up,
    down: migration_20260803_120126_initial.down,
    name: '20260803_120126_initial'
  },
];
