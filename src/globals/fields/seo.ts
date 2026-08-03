import type { Tab } from 'payload'

/**
 * Per-page SEO tab. Every page global gets one so titles, keywords and share
 * images can differ per route; anything left blank falls back to Site Settings.
 */
export const seoTab = (defaultTitle: string): Tab => ({
  label: 'SEO',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      defaultValue: defaultTitle,
      admin: {
        description: 'Browser tab title and search/social title for this page.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      admin: {
        description: 'Short summary for search engines and link previews. Aim for 150-160 characters.',
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords',
      admin: {
        description:
          'Comma separated. Falls back to the site-wide list. Note that Google ignores the keywords meta tag; this mainly helps other crawlers and keeps the intended terms on record.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Share Image',
      admin: {
        description:
          'Image shown when this page is shared (recommended 1200×630). Falls back to the site-wide one.',
      },
    },
  ],
})
