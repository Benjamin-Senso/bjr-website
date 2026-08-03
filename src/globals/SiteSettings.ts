import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Everything shared across all routes: identity, socials, footer, and the
 * fallback SEO used when a page leaves its own SEO fields blank.
 *
 * The nav itself is NOT editable here — its items map 1:1 to real routes in
 * the app directory, so making them CMS-driven would let an editor point the
 * nav at a page that does not exist.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('site-settings')],
  },
  admin: {
    description: 'Identity, social links, footer and default SEO — shared by every page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            {
              name: 'profileImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Profile Image',
              admin: {
                description: 'Avatar shown on the home page (a square image works best).',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: 'Benjamin Rutter',
              admin: {
                description: 'Your name — the main heading and the nav wordmark.',
              },
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Social Links',
              labels: { singular: 'Social Link', plural: 'Social Links' },
              admin: {
                description:
                  'Shown under your intro on the home page and again on the contact page.',
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
              name: 'footerText',
              type: 'text',
              label: 'Footer Text',
              defaultValue: `© ${new Date().getFullYear()} Benjamin Rutter`,
              admin: {
                description: 'Small text shown in the footer of every page.',
              },
            },
          ],
        },
        {
          label: 'Default SEO',
          fields: [
            {
              name: 'metaTitleSuffix',
              type: 'text',
              label: 'Title Suffix',
              defaultValue: 'Benjamin Rutter',
              admin: {
                description:
                  'Appended to each page title, e.g. "About · Benjamin Rutter". Leave blank for none.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Fallback Meta Description',
              defaultValue:
                'Benjamin Rutter builds brands and the businesses behind them. Founder of Senso Studio, a brand, product and venture studio working with internet-first companies across the UK, EU and MENA.',
              admin: {
                description: 'Used on any page that has not set its own description.',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'Site-wide Keywords',
              defaultValue:
                'Benjamin Rutter, Senso Studio, brand studio, product studio, venture studio, brand strategy, brand identity, advisory, consultancy, founder, UK, UAE, MENA',
              admin: {
                description: 'Comma separated. Appended to each page’s own keywords.',
              },
            },
            {
              name: 'jobTitle',
              type: 'text',
              label: 'Job Title',
              defaultValue: 'Founder, Senso Studio',
              admin: {
                description: 'Used in the Person structured data that search engines read.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Fallback Social Share Image',
              admin: {
                description: 'Used on any page that has not set its own (recommended 1200×630).',
              },
            },
          ],
        },
      ],
    },
  ],
}
