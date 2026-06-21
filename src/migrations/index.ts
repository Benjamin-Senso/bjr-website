import * as migration_20260621_120620_initial from './20260621_120620_initial';

export const migrations = [
  {
    up: migration_20260621_120620_initial.up,
    down: migration_20260621_120620_initial.down,
    name: '20260621_120620_initial'
  },
];
