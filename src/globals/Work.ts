import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'

export const Work: GlobalConfig = {
  slug: 'work',
  label: 'Work Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The /work page — the ventures and companies you are behind.',
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
              defaultValue: 'Work',
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
              name: 'ventures',
              type: 'array',
              label: 'Ventures',
              labels: { singular: 'Venture', plural: 'Ventures' },
              admin: {
                description: 'Each venture renders as a glass card.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  admin: { description: 'Square logo or mark. Optional.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
                    {
                      name: 'role',
                      type: 'text',
                      admin: { width: '40%', description: 'e.g. Founder, Partner.' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      admin: { width: '70%' },
                    },
                    {
                      name: 'status',
                      type: 'select',
                      defaultValue: 'active',
                      admin: { width: '30%' },
                      options: [
                        { label: 'Active', value: 'active' },
                        { label: 'Exited', value: 'exited' },
                        { label: 'Advisory', value: 'advisory' },
                        { label: 'Building', value: 'building' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        seoTab('Work'),
      ],
    },
  ],
}
