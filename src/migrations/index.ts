import * as migration_20260803_120126_initial from './20260803_120126_initial';
import * as migration_20260803_124148_add_contact_notify_email from './20260803_124148_add_contact_notify_email';
import * as migration_20260804_062242_add_privacy_and_seo_defaults from './20260804_062242_add_privacy_and_seo_defaults';
import * as migration_20260817_173813_add_articles from './20260817_173813_add_articles';

export const migrations = [
  {
    up: migration_20260803_120126_initial.up,
    down: migration_20260803_120126_initial.down,
    name: '20260803_120126_initial',
  },
  {
    up: migration_20260803_124148_add_contact_notify_email.up,
    down: migration_20260803_124148_add_contact_notify_email.down,
    name: '20260803_124148_add_contact_notify_email',
  },
  {
    up: migration_20260804_062242_add_privacy_and_seo_defaults.up,
    down: migration_20260804_062242_add_privacy_and_seo_defaults.down,
    name: '20260804_062242_add_privacy_and_seo_defaults',
  },
  {
    up: migration_20260817_173813_add_articles.up,
    down: migration_20260817_173813_add_articles.down,
    name: '20260817_173813_add_articles'
  },
];
