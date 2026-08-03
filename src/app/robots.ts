import type { MetadataRoute } from 'next'

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
