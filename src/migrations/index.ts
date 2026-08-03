import * as migration_20260803_093633_initial from './20260803_093633_initial';

export const migrations = [
  {
    up: migration_20260803_093633_initial.up,
    down: migration_20260803_093633_initial.down,
    name: '20260803_093633_initial'
  },
];
