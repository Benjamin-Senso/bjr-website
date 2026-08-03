import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'

/**
 * The landing route. Identity (name, avatar, socials, footer) now lives in
 * Site Settings because every route renders it — this global only owns what is
 * unique to the home page.
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
              defaultValue:
                'Founder and builder. I design and ship products, brands, and the systems behind them.',
              admin: {
                description: 'A short one or two line intro shown under your name.',
              },
            },
            {
              name: 'linkGroups',
              type: 'array',
              label: 'Link Tabs',
              labels: { singular: 'Tab', plural: 'Tabs' },
              minRows: 1,
              admin: {
                description:
                  'Each tab is a group of link cards. The first tab is selected by default. If there is only one tab, the tab bar is hidden.',
                initCollapsed: false,
              },
              defaultValue: [
                {
                  label: 'Ventures',
                  links: [
                    {
                      title: 'Project One',
                      description: 'A short line about what this is.',
                      url: 'https://example.com/',
                    },
                    {
                      title: 'Project Two',
                      description: 'Another short description.',
                      url: 'https://example.com/',
                    },
                  ],
                },
                {
                  label: 'Social',
                  links: [
                    {
                      title: 'Instagram',
                      description: 'Follow along',
                      url: 'https://instagram.com/',
                    },
                    {
                      title: 'YouTube',
                      description: 'Watch the latest',
                      url: 'https://youtube.com/',
                    },
                  ],
                },
              ],
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Tab Label',
                  required: true,
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  labels: { singular: 'Link', plural: 'Links' },
                  minRows: 1,
                  admin: {
                    description:
                      'Each link is a glass card: thumbnail, title and short description.',
                    initCollapsed: true,
                  },
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
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Short Description',
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                    },
                  ],
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
