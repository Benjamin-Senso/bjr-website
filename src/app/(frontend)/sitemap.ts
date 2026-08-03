import type { MetadataRoute } from 'next'
import { getVenturesCount } from './lib/content'
import { isBeehiivConfigured } from '@/lib/beehiiv'

export const dynamic = 'force-dynamic'

/**
 * Mirrors the nav: routes with nothing behind them yet are left out rather
 * than submitted to search engines as empty pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const lastModified = new Date()

  const paths: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/work', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
  ]

  if ((await getVenturesCount()) > 0) paths.push({ path: '/ventures', priority: 0.6 })
  if (isBeehiivConfigured()) paths.push({ path: '/writing', priority: 0.6 })

  return paths.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
