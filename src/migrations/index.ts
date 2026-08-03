import * as migration_20260803_122919_initial from './20260803_122919_initial';

export const migrations = [
  {
    up: migration_20260803_122919_initial.up,
    down: migration_20260803_122919_initial.down,
    name: '20260803_122919_initial'
  },
];
