import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Ventures } from './collections/Ventures'
import { SiteSettings } from './globals/SiteSettings'
import { Home } from './globals/Home'
import { About } from './globals/About'
import { Work } from './globals/Work'
import { VenturesPage } from './globals/VenturesPage'
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
  collections: [Users, Media, Ventures],
  globals: [SiteSettings, Home, About, Work, VenturesPage, Writing, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./bjr.db',
    },
    // Dev only: auto-sync the local schema as fields change. In production this
    // must stay off — push can ask an interactive "created or renamed?" question,
    // which hangs the container (no TTY). Production applies migrations instead;
    // the Docker CMD runs `payload migrate` before starting.
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [],
})
