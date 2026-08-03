import type { CollectionConfig } from 'payload'

/**
 * Messages from the contact form.
 *
 * Stored in the CMS rather than emailed: there is no email adapter configured,
 * and a submission written to the database cannot be silently lost to a spam
 * filter or a bounced send. Read them at /admin.
 *
 * Create is left open because the public form has to write here; the server
 * action is the only caller and it validates first. Reading is admin-only, so
 * submissions are never exposed through the public API.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Message', plural: 'Messages' },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    description: 'Messages sent through the contact form.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'handled',
      type: 'checkbox',
      label: 'Replied',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
