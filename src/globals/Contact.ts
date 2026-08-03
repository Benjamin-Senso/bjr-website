import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
import { seoTab } from './fields/seo'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('contact')],
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
                'Studio work, advisory and consulting, or a venture you want a partner on. If you are building something and want brand and product that pulls commercial weight, get in touch.',
              admin: {
                description: 'A short line about what to get in touch about.',
              },
            },
            {
              name: 'showForm',
              type: 'checkbox',
              label: 'Show contact form',
              defaultValue: true,
              admin: {
                description: 'Messages are stored in the CMS under Messages.',
              },
            },
            {
              name: 'formHeading',
              type: 'text',
              label: 'Form Heading',
              defaultValue: 'Send a message',
              admin: { condition: (_, s) => s?.showForm !== false },
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
