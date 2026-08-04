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
              name: 'notifyEmail',
              type: 'email',
              label: 'Forward Messages To',
              defaultValue: 'ben@sensostudio.co',
              admin: {
                condition: (_, s) => s?.showForm !== false,
                description:
                  'Form submissions are emailed here. They are always stored under Messages as well, so nothing is lost if mail delivery fails.',
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
        seoTab(
          'Contact',
          'Get in touch about brand and product work, advisory and consulting, or a venture you want a partner on.',
          'contact Benjamin Rutter, brand consultancy, advisory, Senso Studio enquiries',
        ),
      ],
    },
  ],
}
