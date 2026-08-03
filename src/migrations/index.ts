import * as migration_20260803_084925_initial from './20260803_084925_initial';

export const migrations = [
  {
    up: migration_20260803_084925_initial.up,
    down: migration_20260803_084925_initial.down,
    name: '20260803_084925_initial'
  },
];
