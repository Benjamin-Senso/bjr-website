import * as migration_20260803_110116_initial from './20260803_110116_initial';

export const migrations = [
  {
    up: migration_20260803_110116_initial.up,
    down: migration_20260803_110116_initial.down,
    name: '20260803_110116_initial'
  },
];
