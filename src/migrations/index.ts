import * as migration_20260803_102312_initial from './20260803_102312_initial';

export const migrations = [
  {
    up: migration_20260803_102312_initial.up,
    down: migration_20260803_102312_initial.down,
    name: '20260803_102312_initial'
  },
];
