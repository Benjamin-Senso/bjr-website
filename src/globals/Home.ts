import type { GlobalConfig } from 'payload'
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
                  title: 'Senso Studio',
                  description: 'Brand, product and systems for growth-stage companies.',
                  url: 'https://sensostudio.co',
                },
                {
                  title: 'Ventures',
                  description: 'Things I have built or backed.',
                  url: '/ventures',
                },
                {
                  title: 'Get in touch',
                  description: 'For brand, product or advisory work.',
                  url: '/contact',
                },
              ],
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Thumbnail',
                  admin: {
                    description: 'Small image shown on the left of the card. Optional.',
                  },
                },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', label: 'Short Description' },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                  admin: {
                    description: 'An external URL, or an internal path such as /ventures.',
                  },
                },
              ],
            },
          ],
        },
        seoTab('Benjamin Rutter'),
      ],
    },
  ],
}
