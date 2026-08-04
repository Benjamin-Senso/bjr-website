import type { SiteSetting, WorkItem } from '@/payload-types'
import { resolveMedia } from './media'
import { siteUrl } from './metadata'

/**
 * Structured data builders.
 *
 * The Person and WebSite blocks are emitted once from the layout with stable
 * @ids, so per-page blocks can reference them by @id instead of repeating the
 * whole entity. That is what lets search engines tie an article back to its
 * author rather than treating them as unrelated.
 */

export const personId = () => `${siteUrl()}/#person`
export const websiteId = () => `${siteUrl()}/#website`

export function personSchema(settings: SiteSetting) {
  const avatar = resolveMedia(settings.profileImage)
  const socials = (settings.socials ?? [])
    .map((s) => s.url)
    .filter((url): url is string => Boolean(url) && !url.startsWith('mailto:'))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(),
    name: settings.name,
    url: siteUrl(),
    ...(settings.jobTitle ? { jobTitle: settings.jobTitle } : {}),
    ...(settings.metaDescription ? { description: settings.metaDescription } : {}),
    ...(avatar ? { image: avatar.url } : {}),
    // sameAs is how a search engine ties this page to your social profiles and
    // treats them as the same entity rather than unrelated accounts.
    ...(socials.length ? { sameAs: socials } : {}),
    worksFor: {
      '@type': 'Organization',
      name: 'Senso Studio',
      url: 'https://sensostudio.co',
    },
    knowsAbout: [
      'Brand strategy',
      'Brand identity',
      'Product design',
      'Venture building',
      'Business operations',
    ],
  }
}

/**
 * Marks the home page as a profile about the site owner. Google treats
 * ProfilePage as a distinct type for creator and author pages, and it is the
 * accurate description of what the landing page is.
 */
export function profilePageSchema(settings: SiteSetting) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteUrl()}/#profile`,
    url: siteUrl(),
    name: settings.name,
    isPartOf: { '@id': websiteId() },
    mainEntity: { '@id': personId() },
  }
}

export function websiteSchema(settings: SiteSetting) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    url: siteUrl(),
    name: settings.name,
    inLanguage: 'en-GB',
    publisher: { '@id': personId() },
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl()}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  }
}

/** A work item's write-up is an article about it, authored by the site owner. */
export function workItemSchema(item: WorkItem, settings: SiteSetting) {
  const cover = resolveMedia(item.coverImage)
  const url = `${siteUrl()}/work/${item.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: item.name,
    ...(item.description ? { description: item.description } : {}),
    ...(cover ? { image: cover.url } : {}),
    url,
    mainEntityOfPage: url,
    author: { '@id': personId() },
    publisher: { '@id': personId() },
    isPartOf: { '@id': websiteId() },
    ...(item.createdAt ? { datePublished: item.createdAt } : {}),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    inLanguage: 'en-GB',
    ...(settings.name ? { creator: settings.name } : {}),
  }
}

/** The /work index, as an ordered list of the items on it. */
export function workCollectionSchema(items: WorkItem[], heading: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl()}/work#collection`,
    url: `${siteUrl()}/work`,
    name: heading,
    ...(description ? { description } : {}),
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${siteUrl()}/work/${item.slug}`,
      })),
    },
  }
}

export function contactPageSchema(email?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteUrl()}/contact#page`,
    url: `${siteUrl()}/contact`,
    isPartOf: { '@id': websiteId() },
    mainEntity: {
      '@id': personId(),
      ...(email ? { email } : {}),
    },
  }
}

export function aboutPageSchema(heading: string, description?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl()}/about#page`,
    url: `${siteUrl()}/about`,
    name: heading,
    ...(description ? { description } : {}),
    isPartOf: { '@id': websiteId() },
    mainEntity: { '@id': personId() },
  }
}
