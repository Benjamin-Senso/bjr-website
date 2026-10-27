import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * The newsletter signup, configured once and rendered in several places.
 *
 * The block only ever renders when beehiiv is connected (see
 * src/lib/beehiiv.ts). An email field with no publication behind it collects
 * addresses into nothing and tells the visitor it is "not configured yet",
 * which is worse than not asking, so the absence of a key hides the block
 * rather than degrading it.
 *
 * The promises are a deliberate part of the ask. Someone deciding whether to
 * hand over an address wants to know what arrives and how often; naming the
 * cadence honestly, including that it is infrequent, converts better than
 * implying a weekly send that never comes.
 */
export const Newsletter: GlobalConfig = {
  slug: 'newsletter',
  label: 'Newsletter',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('newsletter')],
  },
  admin: {
    description:
      'The email signup. Only appears once beehiiv is connected via BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID.',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Notes from the work',
    },
    {
      name: 'blurb',
      type: 'textarea',
      label: 'Blurb',
      defaultValue:
        'Occasional writing on brand, product and the operations underneath. Sent when there is something worth sending, not on a schedule.',
      admin: {
        description: 'One or two lines under the heading.',
      },
    },
    {
      name: 'promises',
      type: 'array',
      label: 'What To Expect',
      labels: { singular: 'Promise', plural: 'Promises' },
      maxRows: 4,
      admin: {
        description:
          'Short, honest expectations shown above the email field. Three works best. Leave empty to hide them.',
      },
      defaultValue: [
        { label: 'Essays', detail: 'What worked, what did not, and why' },
        { label: 'Occasional', detail: 'A few times a year, not weekly' },
        { label: 'No spam', detail: 'One-click unsubscribe' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'detail', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      defaultValue: 'Subscribe',
    },
    {
      name: 'footnote',
      type: 'text',
      label: 'Footnote',
      admin: {
        description: 'Optional small print under the field, e.g. "No spam, ever."',
      },
    },
    {
      type: 'collapsible',
      label: 'Where It Appears',
      admin: {
        description: 'The journal page always shows it. These control the other placements.',
      },
      fields: [
        {
          name: 'showOnHome',
          type: 'checkbox',
          label: 'Home page',
          defaultValue: true,
        },
        {
          name: 'showOnAbout',
          type: 'checkbox',
          label: 'About page',
          defaultValue: true,
        },
        {
          name: 'showAfterArticles',
          type: 'checkbox',
          label: 'End of each article',
          defaultValue: true,
          admin: {
            description: 'The highest-intent moment on the site: somebody has just read to the end.',
          },
        },
      ],
    },
  ],
}
