import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

/**
 * Generic SMTP rather than a single provider's SDK, so this works with Google
 * Workspace, Resend's SMTP bridge, Fastmail or anything else without a code
 * change.
 *
 * Returns undefined when SMTP is not configured, which leaves Payload on its
 * default console transport. Contact submissions are stored in the CMS either
 * way, so a missing mail server loses a notification, never a message.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function buildEmailAdapter() {
  if (!isEmailConfigured()) return undefined

  const port = Number(process.env.SMTP_PORT ?? 587)

  return nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER!,
    defaultFromName: process.env.SMTP_FROM_NAME || 'Benjamin Rutter',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port,
      // 465 is implicit TLS; everything else upgrades via STARTTLS.
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  })
}
