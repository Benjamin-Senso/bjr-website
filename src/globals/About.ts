import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The /about page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              defaultValue: 'About',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              admin: {
                description: 'One or two lines directly under the heading.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body',
              admin: {
                description: 'The long-form bio.',
              },
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portrait',
              admin: {
                description: 'Optional image shown alongside the bio.',
              },
            },
            {
              name: 'facts',
              type: 'array',
              label: 'Quick Facts',
              labels: { singular: 'Fact', plural: 'Facts' },
              admin: {
                description:
                  'Optional short label/value pairs shown as a small grid, e.g. "Based / Dubai".',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        seoTab('About'),
      ],
    },
  ],
}
