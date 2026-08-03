import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

export const globalTag = (slug: string) => `global:${slug}`
export const VENTURES_TAG = 'collection:ventures'

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

export const getVentures = unstable_cache(
  async () => {
    const payload = await getPayload({ config: payloadConfig })
    const result = await payload.find({
      collection: 'ventures',
      limit: 100,
      sort: 'order',
      depth: 2,
    })
    return result.docs
  },
  ['ventures'],
  { tags: [VENTURES_TAG], revalidate: 300 },
)

export const getVenturesCount = unstable_cache(
  async () => {
    const payload = await getPayload({ config: payloadConfig })
    const result = await payload.count({ collection: 'ventures' })
    return result.totalDocs
  },
  ['ventures-count'],
  { tags: [VENTURES_TAG], revalidate: 300 },
)
