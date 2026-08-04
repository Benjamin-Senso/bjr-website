import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
import { seoTab } from './fields/seo'

/**
 * The landing page: who I am, the intersection, one line on the studio, and a
 * clear next step. Identity lives in Site Settings; the tabbed link groups are
 * gone now that the nav does that job.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('home')],
  },
  admin: {
    description: 'The landing page. Name, avatar and socials live in Site Settings.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'bio',
              type: 'textarea',
              required: true,
              defaultValue: 'I build brands, and the businesses behind them.',
              admin: {
                description: 'The one line under your name. Lead with the intersection.',
              },
            },
            {
              name: 'statement',
              type: 'textarea',
              label: 'Statement',
              defaultValue:
                'Founder of Senso Studio, a brand, product and venture studio working with internet-first companies across the UK, EU and MENA. An operator as much as a designer.',
              admin: {
                description: 'A short paragraph under the intro. Keep it to two or three lines.',
              },
            },
            {
              name: 'links',
              type: 'array',
              label: 'Primary Links',
              labels: { singular: 'Link', plural: 'Links' },
              admin: {
                description:
                  'The clear next step. Keep this to a handful, the nav already covers the rest.',
                initCollapsed: true,
              },
              defaultValue: [
                {
                  title: 'Work',
                  description:
                    'Senso is a brand, product and venture studio working with internet-first, growth-stage companies across the UK, EU and MENA. Positioning, identity and product, plus the operational spine underneath it.',
                  tags: [{ label: 'Senso' }, { label: 'Signet' }, { label: 'Mandem Meetup' }],
                  url: '/work',
                },
                {
                  title: 'About',
                  description:
                    'I picked up Adobe at eight and never put it down. Since then, a lot of brands across a lot of industries. Most brand people cannot build systems, most ops people cannot build brand. I do both.',
                  tags: [{ label: 'Brand' }, { label: 'Product' }, { label: 'Operations' }],
                  url: '/about',
                },
                {
                  title: 'Contact',
                  description:
                    'For brand and product work, advisory, or a venture you want a partner on. Two entities, one UK and one UAE.',
                  tags: [{ label: 'Advisory' }, { label: 'Ventures' }],
                  url: '/contact',
                },
              ],
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Cover Image',
                  admin: {
                    description: 'Optional image across the top of the panel. Landscape (16:9).',
                  },
                },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    description: 'Two or three lines. Give it enough to be worth clicking.',
                  },
                },
                {
                  name: 'tags',
                  type: 'array',
                  label: 'Tags',
                  labels: { singular: 'Tag', plural: 'Tags' },
                  admin: {
                    description: 'Small pills along the bottom. Keep to three or four.',
                    initCollapsed: true,
                  },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                  admin: {
                    description: 'An external URL, or an internal path such as /work.',
                  },
                },
              ],
            },
          ],
        },
        seoTab(
          'Benjamin Rutter',
          'Benjamin Rutter builds brands and the businesses behind them. Founder of Senso Studio, working with internet-first companies across the UK, EU and MENA.',
          'Benjamin Rutter, Senso Studio, brand studio, founder, brand and product, UK, UAE',
        ),
      ],
    },
  ],
}
