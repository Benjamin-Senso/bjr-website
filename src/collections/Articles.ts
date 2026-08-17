import type { CollectionConfig } from 'payload'
import { revalidateArticles } from '../hooks/revalidate'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Articles published at /writing/<slug>.
 *
 * These live on this domain deliberately. Publishing primarily to Medium or a
 * newsletter hands the search value to their domain; writing here first and
 * syndicating outward with a canonical pointing back keeps it.
 *
 * Drafts are invisible to the public API as well as the site, so a half
 * finished piece cannot leak through /api/articles.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Writing' },
  access: {
    // Anonymous readers only ever see published posts. Logged-in editors see
    // everything, which is what makes previewing a draft possible.
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  hooks: {
    afterChange: [revalidateArticles],
    afterDelete: [revalidateArticles],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    description: 'Articles published at /writing. Drafts are not visible to the public.',
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'One or two sentences. Shown on the index, and used as the search and social description.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: { description: 'Shown on the card and at the top of the article. Landscape (16:9).' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Drafts are hidden from the site, the API and the sitemap.',
      },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Sets the order on the index. Defaults to now when first published.',
      },
      hooks: {
        beforeChange: [
          ({ value, data }) => {
            // Stamp on first publish so the date reflects when it went live,
            // not when the draft was started.
            if (!value && data?.status === 'published') return new Date().toISOString()
            return value
          },
        ],
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'The URL, e.g. /writing/what-a-rebrand-costs. Generated from the title.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim()) return slugify(value)
            if (typeof data?.title === 'string') return slugify(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL',
      admin: {
        position: 'sidebar',
        description:
          'Leave blank. Only set this if the piece was originally published elsewhere and that copy should be treated as the original.',
      },
    },
  ],
}
