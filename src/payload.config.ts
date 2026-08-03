import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { WorkItems } from './collections/WorkItems'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { r2Storage } from './lib/storage'
import { buildEmailAdapter } from './lib/email'
import { SiteSettings } from './globals/SiteSettings'
import { Home } from './globals/Home'
import { About } from './globals/About'
import { Work } from './globals/Work'
import { Writing } from './globals/Writing'
import { Contact } from './globals/Contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— BJR',
    },
  },
  collections: [Users, Media, WorkItems, ContactSubmissions],
  globals: [SiteSettings, Home, About, Work, Writing, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Dev only: auto-sync the local schema as fields change. In production this
    // must stay off — push can ask an interactive "created or renamed?" question,
    // which hangs the container (no TTY). Production applies migrations instead;
    // the Docker CMD runs `payload migrate` before starting.
    push: process.env.NODE_ENV !== 'production',
  }),
  email: buildEmailAdapter(),
  sharp,
  plugins: [r2Storage],
})
