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

const nextConfig: NextConfig = {
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
