import type { GlobalConfig } from 'payload'
import { seoTab } from './fields/seo'
import { lexicalParagraphs } from './fields/lexical'

/**
 * The studio page. Deliberately does not duplicate sensostudio.co: it tells the
 * Senso story and links out. Ventures live in their own collection.
 */
export const Work: GlobalConfig = {
  slug: 'work',
  label: 'Work Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The /work page. Senso and selected proof, linking out to the studio site.',
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
              defaultValue:
                'Senso Studio. Strategy, brand, product and systems for growth-stage companies.',
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body',
              // Function default: a static one is baked into the column DDL,
              // which breaks on apostrophes inside the JSON.
              defaultValue: () =>
                lexicalParagraphs([
                  'Senso is a brand, product and venture studio. We work with internet-first, growth-stage companies across the UK, EU and MENA, run across two entities, one UK and one UAE.',
                  'The work is positioning, identity and product that make a new company look and feel like it has been around for years. Behind it sits the operational spine: pipeline, finance, automation and delivery.',
                ]),
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'studioUrl',
                  type: 'text',
                  label: 'Studio URL',
                  defaultValue: 'https://sensostudio.co',
                  admin: { width: '65%' },
                },
                {
                  name: 'studioLinkLabel',
                  type: 'text',
                  label: 'Link Label',
                  defaultValue: 'Visit Senso Studio',
                  admin: { width: '35%' },
                },
              ],
            },
            {
              name: 'proof',
              type: 'array',
              label: 'Selected Proof',
              labels: { singular: 'Item', plural: 'Items' },
              admin: {
                description:
                  'Selected work or outcomes. Keep it short and link out rather than duplicating case studies.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
                    {
                      name: 'meta',
                      type: 'text',
                      admin: { width: '40%', description: 'e.g. Brand and product, 2025.' },
                    },
                  ],
                },
                { name: 'description', type: 'textarea' },
                { name: 'url', type: 'text', label: 'URL' },
              ],
            },
          ],
        },
        seoTab('Work'),
      ],
    },
  ],
}
