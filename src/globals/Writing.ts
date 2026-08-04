import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
import { seoTab } from './fields/seo'

/**
 * Page copy only — the posts themselves are pulled live from beehiiv at
 * request time (see src/lib/beehiiv.ts), so there is nothing to keep in sync
 * by hand here.
 */
export const Writing: GlobalConfig = {
  slug: 'writing',
  label: 'Writing Page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('writing')],
  },
  admin: {
    description: 'The /writing page. Posts are pulled automatically from beehiiv.',
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
              defaultValue: 'Writing',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              defaultValue: 'Occasional notes on building brands, and the businesses behind them.',
              admin: {
                description: 'One or two lines directly under the heading.',
              },
            },
            {
              name: 'showSubscribe',
              type: 'checkbox',
              label: 'Show subscribe form',
              defaultValue: true,
            },
            {
              name: 'subscribeHeading',
              type: 'text',
              label: 'Subscribe Heading',
              defaultValue: 'Subscribe to the newsletter',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showSubscribe),
              },
            },
            {
              name: 'subscribeBlurb',
              type: 'text',
              label: 'Subscribe Blurb',
              defaultValue: 'Occasional notes on building brands, and the businesses behind them.',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showSubscribe),
              },
            },
            {
              name: 'postLimit',
              type: 'number',
              label: 'Posts To Show',
              defaultValue: 10,
              min: 1,
              max: 50,
            },
          ],
        },
        seoTab(
          'Writing',
          'Occasional notes from Benjamin Rutter on building brands, and the businesses behind them.',
          'Benjamin Rutter writing, brand notes, founder newsletter',
        ),
      ],
    },
  ],
}
