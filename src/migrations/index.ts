import * as migration_20260803_090514_initial from './20260803_090514_initial';

export const migrations = [
  {
    up: migration_20260803_090514_initial.up,
    down: migration_20260803_090514_initial.down,
    name: '20260803_090514_initial'
  },
];
