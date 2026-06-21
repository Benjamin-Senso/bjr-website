import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and SEO.',
      },
    },
  ],
  // In production (Docker) MEDIA_DIR points at the persistent volume so uploads
  // survive restarts. Locally it's unset and Payload uses the default folder.
  upload: process.env.MEDIA_DIR ? { staticDir: process.env.MEDIA_DIR } : true,
}
