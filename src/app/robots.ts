import type { MetadataRoute } from 'next'

// Rendered per request, not at build. As a static route it was baked when
// NEXT_PUBLIC_SERVER_URL did not exist, so the sitemap line shipped pointing
// at localhost and search engines were told to look there.
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The CMS and its API have no business in search results.
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
