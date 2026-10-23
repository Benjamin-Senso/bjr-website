import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { isEmailConfigured } from '../lib/email'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Emails the notification address whenever a message is stored.
 *
 * This lives on the collection rather than in the contact form's server
 * action, so the notification is tied to the record existing rather than to
 * one code path reaching the end of itself. Anything that creates a
 * submission now notifies.
 *
 * Every failure is swallowed on purpose. The message is already saved by the
 * time this runs, and throwing here would fail the create and tell a visitor
 * their message was lost when it was not.
 */
const notify: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const contact = await req.payload.findGlobal({ slug: 'contact' })
    const to = contact?.notifyEmail

    if (!to) {
      req.payload.logger.warn('[contact] No notifyEmail set, message stored but not emailed')
      return doc
    }
    if (!isEmailConfigured()) {
      req.payload.logger.error(
        '[contact] Message stored but NOT emailed: no email transport configured',
      )
      return doc
    }

    await req.payload.sendEmail({
      to,
      // From has to be the verified sender or the provider rejects it, so the
      // visitor goes in replyTo and hitting reply reaches them directly.
      replyTo: `${doc.name} <${doc.email}>`,
      subject: doc.subject ? `Website: ${doc.subject}` : `Website message from ${doc.name}`,
      text: `${doc.name} <${doc.email}>\n\n${doc.message}`,
      html:
        `<p><strong>${escapeHtml(doc.name)}</strong> &lt;${escapeHtml(doc.email)}&gt;</p>` +
        `<p>${escapeHtml(doc.message).replace(/\n/g, '<br>')}</p>`,
    })
    req.payload.logger.info(`[contact] Notification sent to ${to}`)
  } catch (err) {
    req.payload.logger.error({ err }, '[contact] Failed to send notification')
  }

  return doc
}

/**
 * Messages from the contact form.
 *
 * Stored in the CMS and emailed to the notification address. The stored copy
 * is the source of truth: a message in the database cannot be lost to a spam
 * filter or a bounced send.
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
  hooks: {
    afterChange: [notify],
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
