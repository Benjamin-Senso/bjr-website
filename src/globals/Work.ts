import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
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
  hooks: {
    afterChange: [revalidateGlobal('work')],
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
                'The studio, the ventures around it, and advisory work with founders and operators.',
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
                  'The work is positioning, identity and product that make a new company look and feel like it has been around for years. Behind it sits the operational side: finance, automation, delivery and the systems that let a lean team run.',
                  'Some of that is client work. Some is ventures I have built or backed. And some is advisory, working directly with founders and operators on the same problems.',
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
              name: 'advisory',
              type: 'group',
              label: 'Advisory',
              admin: {
                description:
                  'Sits below the work, so the proof comes first. Keep it understated until advisory work is a bigger part of the picture.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show this section',
                  defaultValue: true,
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Advisory and consultancy',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue:
                    'Alongside the studio I take on a small number of advisory and consulting engagements. Usually founders and operators who need brand and product that pulls commercial weight, and the operational spine to run it.',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  name: 'points',
                  type: 'array',
                  label: 'What that looks like',
                  labels: { singular: 'Point', plural: 'Points' },
                  admin: {
                    initCollapsed: true,
                    condition: (_, s) => Boolean(s?.enabled),
                  },
                  defaultValue: [
                    {
                      title: 'Brand-led growth',
                      description:
                        'Positioning and product that make a new company look and feel like it has been around for years.',
                    },
                    {
                      title: 'The operating spine',
                      description:
                        'Finance, automation and delivery, so a lean team can punch above its size.',
                    },
                    {
                      title: 'Across industries',
                      description:
                        'A lot of brands in very different sectors, and the problems tend to rhyme.',
                    },
                  ],
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea' },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                  fields: [
                    {
                      name: 'ctaLabel',
                      type: 'text',
                      label: 'CTA Label',
                      defaultValue: 'Start a conversation',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ctaUrl',
                      type: 'text',
                      label: 'CTA URL',
                      defaultValue: '/contact',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        seoTab('Work'),
      ],
    },
  ],
}
