import type { MetadataRoute } from 'next'
import { getArticles, getWorkItems } from './lib/content'
import { siteUrl } from './lib/metadata'
import { isBeehiivConfigured } from '@/lib/beehiiv'

export const dynamic = 'force-dynamic'

/**
 * Mirrors the nav: routes with nothing behind them yet are left out rather
 * than submitted to search engines as empty pages. Every work item gets its
 * own entry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const lastModified = new Date()

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const items = await getWorkItems()
  for (const item of items) {
    if (!item.slug) continue
    entries.push({
      url: `${base}/work/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  const articles = await getArticles()
  if (articles.length) {
    entries.push({
      url: `${base}/journal`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  for (const article of articles) {
    if (!article.slug) continue
    entries.push({
      url: `${base}/journal/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  if (!articles.length && isBeehiivConfigured()) {
    entries.push({
      url: `${base}/journal`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return entries
}
