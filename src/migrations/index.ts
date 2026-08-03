import * as migration_20260803_103127_initial from './20260803_103127_initial';

export const migrations = [
  {
    up: migration_20260803_103127_initial.up,
    down: migration_20260803_103127_initial.down,
    name: '20260803_103127_initial'
  },
];
