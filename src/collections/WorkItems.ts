import type { CollectionConfig } from 'payload'
import { revalidateWorkItems } from '../hooks/revalidate'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Everything shown in the grid on /work: companies, ventures, projects and
 * things you are involved in but do not own. Each one gets its own page at
 * /work/<slug>.
 *
 * One collection rather than several, because the difference between them is
 * a relationship, not a different shape of content. `type` drives the filter
 * pills, so adding an entry of a new type makes its pill appear on its own.
 *
 * Client case studies deliberately do not live here. /work links out to
 * sensostudio.co rather than duplicating them.
 */
export const WorkItems: CollectionConfig = {
  slug: 'work-items',
  labels: { singular: 'Work Item', plural: 'Work' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateWorkItems],
    afterDelete: [revalidateWorkItems],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'role', 'year'],
    description: 'Companies, ventures, projects and involvements shown on /work.',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'The URL, e.g. /work/signet. Generated from the name if left blank.',
      },
      hooks: {
        // Derive from the name on save, so the URL is never empty and stays
        // stable once set (editing it by hand is allowed and respected).
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim()) return slugify(value)
            if (typeof data?.name === 'string') return slugify(data.name)
            return value
          },
        ],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: { description: 'Shown on the card and at the top of the page. Landscape (16:9).' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'venture',
          admin: {
            width: '50%',
            description: 'Drives which filter the entry appears under.',
          },
          options: [
            { label: 'Company', value: 'company' },
            { label: 'Venture', value: 'venture' },
            { label: 'Project', value: 'project' },
            { label: 'Involvement', value: 'involvement' },
          ],
        },
        {
          name: 'role',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. Founder, Partner, Director, Advisor.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: { description: 'One or two lines, shown on the card and under the heading.' },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Page Content',
      admin: {
        description:
          'The write-up: what it is, what they do, what you have done for it. Written as an article rather than a formal case study.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      labels: { singular: 'Image', plural: 'Images' },
      admin: {
        description: 'Optional images shown below the write-up.',
        initCollapsed: true,
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'External URL',
          admin: { width: '60%', description: 'Their website. Optional.' },
        },
        {
          name: 'year',
          type: 'text',
          admin: { width: '40%', description: 'e.g. 2024, or 2021 to 2023.' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
        description: 'Optional pill on the card. Leave blank to show nothing.',
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Building', value: 'building' },
        { label: 'Exited', value: 'exited' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
