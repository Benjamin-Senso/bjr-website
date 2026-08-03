import { s3Storage } from '@payloadcms/storage-s3'

/**
 * Cloudflare R2 for uploaded media.
 *
 * R2 is S3-compatible, so the standard S3 adapter works with three
 * R2-specific settings: region must be 'auto', the endpoint is the
 * account-scoped r2.cloudflarestorage.com host, and path-style addressing is
 * required (R2 does not support virtual-hosted buckets).
 *
 * The plugin is a no-op unless all four variables are present, so local dev
 * keeps writing to disk with no configuration.
 */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_BUCKET &&
      process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
  )
}

/**
 * Public base URL for served files, e.g. https://media.example.com. Without
 * it, files are proxied through the Next server instead of hitting R2's edge
 * directly, which still works but gives up the CDN.
 */
const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')

export const r2Storage = s3Storage({
  enabled: isR2Configured(),
  collections: {
    media: publicBase ? { prefix: 'media', generateFileURL: ({ filename }) => `${publicBase}/media/${filename}` } : { prefix: 'media' },
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
