import { s3Storage } from '@payloadcms/storage-s3'

/**
 * Cloudflare R2 for uploaded media.
 *
 * R2 is S3-compatible, so the standard S3 adapter works with three
 * R2-specific settings: region must be 'auto', the endpoint is the
 * account-scoped r2.cloudflarestorage.com host, and path-style addressing is
 * required (R2 does not support virtual-hosted buckets).
 *
 * With none of the variables set the plugin is a no-op and uploads go to
 * disk, which is what local dev wants.
 *
 * No `prefix` is configured, deliberately. The cloud-storage plugin injects a
 * `prefix` column into the media collection when one is set, but only while
 * the plugin is enabled. That made the database schema depend on whether R2
 * env vars were present: migrations generated locally (R2 off) omitted the
 * column, and production (R2 on) then queried a column that did not exist,
 * failing every upload. Files land at the bucket root instead, which keeps
 * the schema identical in every environment.
 */

const REQUIRED = [
  'R2_BUCKET',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
] as const

const present = () => REQUIRED.filter((key) => Boolean(process.env[key]))
const missing = () => REQUIRED.filter((key) => !process.env[key])

export function isR2Configured(): boolean {
  return missing().length === 0
}

/**
 * Says which backend is active, and shouts if R2 is half-configured.
 *
 * A partial R2 config used to fall through to disk in silence, so uploads
 * failed in production with no clue why. Better to name the missing variables
 * at boot than to debug it from a red badge in the admin panel.
 */
function reportStorageBackend() {
  const missingKeys = missing()

  if (missingKeys.length === 0) {
    console.info(`[storage] Media uploads go to R2 bucket "${process.env.R2_BUCKET}"`)
    if (!process.env.R2_PUBLIC_URL) {
      console.warn(
        '[storage] R2_PUBLIC_URL is not set, so files are proxied through this server ' +
          'rather than served from Cloudflare. Uploads still work.',
      )
    }
    return
  }

  if (missingKeys.length < REQUIRED.length) {
    console.error(
      `[storage] R2 is only partly configured. Set ${missingKeys.join(', ')} ` +
        `(found ${present().join(', ')}). Falling back to local disk, which is ` +
        `not persistent unless a volume is mounted at MEDIA_DIR.`,
    )
    return
  }

  console.info(
    `[storage] Media uploads go to local disk at ${process.env.MEDIA_DIR || 'the default folder'}`,
  )
}

reportStorageBackend()

const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')

export const r2Storage = s3Storage({
  enabled: isR2Configured(),
  collections: {
    media: publicBase
      ? { generateFileURL: ({ filename }) => `${publicBase}/${filename}` }
      : true,
  },
  bucket: process.env.R2_BUCKET || '',
  config: {
    endpoint: process.env.R2_ENDPOINT || '',
    region: 'auto',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  },
})
