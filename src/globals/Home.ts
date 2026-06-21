import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'All the content shown on the public home page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'profileImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Profile Image',
              admin: {
                description: 'Avatar shown at the top of the page (a square image works best).',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: 'Benjamin Rutter',
              admin: {
                description: 'Your name — shown as the main heading.',
              },
            },
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
              name: 'socials',
              type: 'array',
              label: 'Social Links',
              labels: { singular: 'Social Link', plural: 'Social Links' },
              admin: {
                description:
                  'Small inline icon links shown under your intro. Pick a platform for the icon. Optional.',
                initCollapsed: true,
              },
              defaultValue: [
                { platform: 'instagram', url: 'https://instagram.com/' },
                { platform: 'x', url: 'https://x.com/' },
                { platform: 'linkedin', url: 'https://linkedin.com/' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      defaultValue: 'website',
                      admin: { width: '50%' },
                      options: [
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'X (Twitter)', value: 'x' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'Threads', value: 'threads' },
                        { label: 'GitHub', value: 'github' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Email', value: 'email' },
                        { label: 'Website / Other', value: 'website' },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'Use a mailto: link for Email.',
                      },
                    },
                  ],
                },
              ],
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
                    description: 'Each link is a glass card: thumbnail, title and short description.',
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
            {
              name: 'footerText',
              type: 'text',
              label: 'Footer Text',
              defaultValue: `© ${new Date().getFullYear()} Benjamin Rutter`,
              admin: {
                description: 'Small text shown in the footer.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              defaultValue: 'Benjamin Rutter',
              admin: {
                description: 'Browser tab title and search/social title.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: {
                description: 'Short summary for search engines and link previews.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Social Share Image',
              admin: {
                description: 'Image shown when the site is shared (recommended 1200×630).',
              },
            },
          ],
        },
      ],
    },
  ],
}
