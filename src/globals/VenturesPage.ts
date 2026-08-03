import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'

/** Page copy for /ventures. The ventures themselves live in the collection. */
export const VenturesPage: GlobalConfig = {
  slug: 'ventures-page',
  label: 'Ventures Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Heading and intro for /ventures. Add the ventures themselves under Ventures.',
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
              defaultValue: 'Ventures',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              defaultValue:
                'Things I have built or backed, through Senso and its Ember partnerships.',
            },
          ],
        },
        seoTab('Ventures'),
      ],
    },
  ],
}
