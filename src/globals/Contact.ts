import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The /contact page.',
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
              defaultValue: 'Contact',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              defaultValue:
                'If you are building something and want brand and product that pulls commercial weight, get in touch.',
              admin: {
                description: 'A short line about what to get in touch about.',
              },
            },
            {
              name: 'email',
              type: 'text',
              label: 'Email Address',
              admin: {
                description: 'Rendered as a mailto: link. Just the address, no "mailto:" prefix.',
              },
            },
            {
              name: 'availability',
              type: 'text',
              label: 'Availability Note',
              admin: {
                description: 'Optional, e.g. "Open to advisory roles from Q1".',
              },
            },
            {
              name: 'showSocials',
              type: 'checkbox',
              label: 'Show social links',
              defaultValue: true,
              admin: {
                description: 'Repeats the socials from Site Settings on this page.',
              },
            },
          ],
        },
        seoTab('Contact'),
      ],
    },
  ],
}
