import * as migration_20260803_120126_initial from './20260803_120126_initial';
import * as migration_20260803_124148_add_contact_notify_email from './20260803_124148_add_contact_notify_email';

export const migrations = [
  {
    up: migration_20260803_120126_initial.up,
    down: migration_20260803_120126_initial.down,
    name: '20260803_120126_initial',
  },
  {
    up: migration_20260803_124148_add_contact_notify_email.up,
    down: migration_20260803_124148_add_contact_notify_email.down,
    name: '20260803_124148_add_contact_notify_email'
  },
];
