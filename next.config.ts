import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// When media is served straight from R2 (rather than proxied through Next),
// its host has to be allowed explicitly or next/image rejects it.
const r2PublicUrl = process.env.R2_PUBLIC_URL
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []

if (r2PublicUrl) {
  try {
    const { protocol, hostname } = new URL(r2PublicUrl)
    remotePatterns.push({
      protocol: protocol.replace(':', '') as 'http' | 'https',
      hostname,
      pathname: '/**',
    })
  } catch {
    console.warn(`Ignoring malformed R2_PUBLIC_URL: ${r2PublicUrl}`)
  }
}

/**
 * Baseline security headers. None were set, so the admin panel could be framed
 * by any site (clickjacking against a logged-in session) and browsers were
 * free to sniff content types.
 *
 * Deliberately no Content-Security-Policy yet: Payload's admin and GTM both
 * need script-src rules that are easy to get wrong, and a broken CSP breaks the
 * site silently. Worth adding as its own piece of work.
 */
const securityHeaders = [
  // Only meaningful over HTTPS, which production is. Two years, and safe to
  // preload later once you are confident every subdomain is HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nothing here needs these, and denying them stops a third-party script
  // asking on your behalf.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
