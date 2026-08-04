import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'
import { seoTab } from './fields/seo'
import { lexicalParagraphs } from './fields/lexical'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('about')],
  },
  admin: {
    description: 'The /about page.',
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
              defaultValue: 'About',
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              defaultValue: 'An operator as much as a designer.',
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body',
              // A function default is applied at document creation. A static one
              // would be baked into the column DDL, where the apostrophes in this
              // JSON break the generated SQL.
              defaultValue: () =>
                lexicalParagraphs([
                "I picked up Adobe's design tools at eight and never really put them down. Since then I have worked with a lot of brands, and the draw has always been the range: getting inside very different industries and learning how each one actually works.",
                'That breadth is the useful part. The problems rhyme across sectors, and what works in one usually transfers to the next.',
                'Senso is where it all meets. A brand, product and venture studio working with internet-first, growth-stage companies across the UK, EU and MENA, run across two entities, one UK and one UAE.',
                'I built the studio and the machine behind it. The brand work clients see, and the commercial and operational systems that make a lean studio run: finance, automation, delivery.',
                'Most brand people cannot build systems. Most ops people cannot build brand. I do both, and I have done it building a real business across two jurisdictions.',
              ]),
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portrait',
              admin: {
                description: 'Optional image shown alongside the bio.',
              },
            },
            {
              name: 'helpWith',
              type: 'array',
              label: 'What I Help With',
              labels: { singular: 'Item', plural: 'Items' },
              admin: {
                description:
                  'Kept deliberately light. Position by proof, not by title. Expand into its own page only when advisory work is real.',
                initCollapsed: true,
              },
              defaultValue: [
                {
                  title: 'Brand and product',
                  description:
                    'Positioning, identity and product that make a new company look and feel like it has been around for years.',
                },
                {
                  title: 'The operational spine',
                  description:
                    'The finance, automation and delivery systems that let a lean team punch above its size.',
                },
                {
                  title: 'Ventures',
                  description:
                    "Building and backing companies, through Senso's Ember partnerships and a growing DTC arm.",
                },
              ],
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'facts',
              type: 'array',
              label: 'Quick Facts',
              labels: { singular: 'Fact', plural: 'Facts' },
              admin: {
                description:
                  'Optional short label/value pairs shown as a small grid, e.g. "Based / Dubai".',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        seoTab(
          'About',
          'How Benjamin Rutter got from picking up design tools at eight to running a brand, product and venture studio across two jurisdictions.',
          'Benjamin Rutter about, brand designer, operator, founder story, Senso Studio',
        ),
      ],
    },
  ],
}
