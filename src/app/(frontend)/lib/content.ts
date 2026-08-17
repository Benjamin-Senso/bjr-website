import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

export const globalTag = (slug: string) => `global:${slug}`
export const WORK_ITEMS_TAG = 'collection:work-items'
export const ARTICLES_TAG = 'collection:articles'

/**
 * Routes stay dynamic so `next build` never needs a database (the Docker image
 * is built before migrations run). Caching the reads instead means a navigation
 * costs a render, not a SQLite round trip, and the tags let Payload's afterChange
 * hooks drop the cache the moment something is edited.
 */
export function getGlobal<T extends GlobalSlug>(slug: T): Promise<Config['globals'][T]> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: payloadConfig })
      return payload.findGlobal({ slug, depth: 2 })
    },
    ['global', slug],
    { tags: [globalTag(slug)], revalidate: 300 },
  )() as Promise<Config['globals'][T]>
}

export function getWorkItem(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: payloadConfig })
      const result = await payload.find({
        collection: 'work-items',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['work-item', slug],
    { tags: [WORK_ITEMS_TAG], revalidate: 300 },
  )()
}

/**
 * Published articles only. The collection's access control already hides
 * drafts from anonymous readers, but filtering here too means a draft can
 * never appear through the cached path either.
 */
export const getArticles = unstable_cache(
  async () => {
    const payload = await getPayload({ config: payloadConfig })
    const result = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      limit: 100,
      sort: '-publishedAt',
      depth: 2,
    })
    return result.docs
  },
  ['articles'],
  { tags: [ARTICLES_TAG], revalidate: 300 },
)

export function getArticle(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: payloadConfig })
      const result = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['article', slug],
    { tags: [ARTICLES_TAG], revalidate: 300 },
  )()
}

export const getWorkItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: payloadConfig })
    const result = await payload.find({
      collection: 'work-items',
      limit: 200,
      sort: 'order',
      depth: 2,
    })
    return result.docs
  },
  ['work-items'],
  { tags: [WORK_ITEMS_TAG], revalidate: 300 },
)
