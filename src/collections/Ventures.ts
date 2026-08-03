import type { CollectionConfig } from 'payload'
import { revalidateVentures } from '../hooks/revalidate'

/**
 * Ventures are recurring content added over time, so they earn a collection
 * rather than an array on a page global.
 */
export const Ventures: CollectionConfig = {
  slug: 'ventures',
  labels: { singular: 'Venture', plural: 'Ventures' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateVentures],
    afterDelete: [revalidateVentures],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'status', 'year'],
    description: 'Things you have built or backed. Shown on /ventures, newest first.',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: { description: 'Square logo or mark. Optional.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          admin: { width: '50%', description: 'e.g. Founder, Partner, Advisor.' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          admin: { width: '50%' },
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Building', value: 'building' },
            { label: 'Advisory', value: 'advisory' },
            { label: 'Exited', value: 'exited' },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'One or two lines. Keep it plain.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'url', type: 'text', label: 'URL', admin: { width: '60%' } },
        {
          name: 'year',
          type: 'text',
          admin: { width: '40%', description: 'e.g. 2024, or 2021 to 2023.' },
        },
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
