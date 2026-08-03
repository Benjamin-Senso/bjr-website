import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

/**
 * Email transport, in order of preference:
 *
 *   1. Resend, if RESEND_API_KEY is set. Preferred on a VPS: it is plain
 *      HTTPS, so it is unaffected by hosts that block or throttle outbound
 *      SMTP ports, and it needs no app passwords.
 *   2. Generic SMTP, if SMTP_HOST/USER/PASS are set. Works with Google
 *      Workspace, Fastmail, or Resend's own SMTP bridge.
 *   3. Nothing, leaving Payload on its default console transport.
 *
 * Contact submissions are stored in the CMS regardless, so a missing or broken
 * transport loses a notification, never a message.
 */

const fromAddress = () => process.env.EMAIL_FROM || process.env.SMTP_FROM || ''
const fromName = () => process.env.EMAIL_FROM_NAME || 'Benjamin Rutter'

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && fromAddress())
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function isEmailConfigured(): boolean {
  return isResendConfigured() || isSmtpConfigured()
}

export function buildEmailAdapter() {
  if (isResendConfigured()) {
    return resendAdapter({
      defaultFromAddress: fromAddress(),
      defaultFromName: fromName(),
      apiKey: process.env.RESEND_API_KEY!,
    })
  }

  if (isSmtpConfigured()) {
    const port = Number(process.env.SMTP_PORT ?? 587)

    return nodemailerAdapter({
      defaultFromAddress: fromAddress() || process.env.SMTP_USER!,
      defaultFromName: fromName(),
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

  return undefined
}
