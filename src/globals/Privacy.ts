import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
import { seoTab } from './fields/seo'
import { lexicalDoc } from './fields/lexical'

/**
 * The /privacy page.
 *
 * Ships with a real notice rather than a placeholder, because a consent banner
 * that links to an empty page is worse than no banner. It is written plainly
 * and covers what the site actually does: a contact form, analytics behind
 * consent, and the third parties involved. It is a starting point, not legal
 * advice.
 */
export const Privacy: GlobalConfig = {
  slug: 'privacy',
  label: 'Privacy Page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('privacy')],
  },
  admin: {
    description: 'The /privacy page, linked from the footer and the cookie banner.',
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
              defaultValue: 'Privacy',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              defaultValue:
                'What this site collects, why, and what you can ask me to do about it.',
            },
            {
              name: 'lastUpdated',
              type: 'text',
              label: 'Last Updated',
              defaultValue: 'August 2026',
              admin: { description: 'Shown under the intro. Update whenever the notice changes.' },
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body',
              defaultValue: () =>
                lexicalDoc([
                  { heading: 'The short version' },
                  {
                    text: 'This is a personal site. It does not sell anything, it does not have accounts, and it does not build a profile of you. Two things collect data: the contact form, and analytics, which only runs if you accept the cookie banner.',
                  },
                  { heading: 'If you use the contact form' },
                  {
                    text: 'I collect the name, email address and message you submit, so that I can read it and reply. That is the only reason it is collected and it is not used for anything else. The lawful basis is legitimate interest: you contacted me, so replying is expected.',
                  },
                  {
                    text: 'Messages are stored in this site’s own database and emailed to me. I keep them while a conversation is useful and delete them when it is not. Ask me to delete yours and I will.',
                  },
                  { heading: 'Cookies and analytics' },
                  {
                    text: 'No analytics or advertising cookies are set unless you accept them. The banner defaults to denied, and declining is a single click that is no harder to find than accepting.',
                  },
                  {
                    text: 'If you accept, Google Analytics runs through Google Tag Manager and records anonymous usage: which pages are visited, roughly where in the world visitors are, and which sites they arrived from. I use it to know whether the site is worth keeping. Your choice is remembered in your browser so you are not asked again, and you can change it by clearing this site’s data.',
                  },
                  { heading: 'Who else is involved' },
                  {
                    text: 'The site runs on a server I control, with the database on that same infrastructure. Uploaded images are stored with Cloudflare R2. Contact form notifications are sent through Resend. Analytics, if you accept it, goes to Google. Each of these only sees what it needs to do its job.',
                  },
                  { heading: 'Your rights' },
                  {
                    text: 'Under UK GDPR you can ask what data I hold about you, ask for a copy, ask me to correct it, or ask me to delete it. Email me and I will do it. If you are unhappy with how I have handled it, you can complain to the Information Commissioner’s Office at ico.org.uk.',
                  },
                  { heading: 'Changes' },
                  {
                    text: 'If this notice changes in a way that matters, the date at the top changes with it.',
                  },
                ]),
            },
          ],
        },
        seoTab(
          'Privacy',
          'What benjaminrutter.com collects, why, and how to ask for it to be removed.',
          'privacy, cookies, data protection',
        ),
      ],
    },
  ],
}
