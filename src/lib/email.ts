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

/**
 * Says which transport is active at boot.
 *
 * Notification failures are deliberately silent to the visitor, which means a
 * misconfigured mailbox looks exactly like nobody getting in touch. Printing
 * this on start is the difference between noticing in a deploy log and
 * noticing three months of missed enquiries.
 */
export function reportEmailTransport() {
  if (isResendConfigured()) {
    console.info(`[email] Notifications send via Resend from ${fromAddress()}`)
    return
  }
  if (isSmtpConfigured()) {
    console.info(`[email] Notifications send via SMTP host ${process.env.SMTP_HOST}`)
    return
  }

  // Half-configured is the dangerous state: the operator believes mail is set
  // up, and the generic "nothing configured" message sends them to check the
  // one variable they already set. Name the missing half instead.
  if (process.env.RESEND_API_KEY && !fromAddress()) {
    console.error(
      '[email] RESEND_API_KEY is set but EMAIL_FROM is not, so NOTHING IS EMAILED. ' +
        'Set EMAIL_FROM to an address on a domain verified in Resend.',
    )
    return
  }
  if (fromAddress() && !process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    console.error(
      `[email] EMAIL_FROM is set to ${fromAddress()} but no RESEND_API_KEY or SMTP_HOST, ` +
        'so NOTHING IS EMAILED.',
    )
    return
  }
  if (process.env.SMTP_HOST && !isSmtpConfigured()) {
    const missing = (['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const).filter(
      (k) => !process.env[k],
    )
    console.error(`[email] SMTP is half-configured. Missing ${missing.join(', ')}.`)
    return
  }

  console.error(
    '[email] NO EMAIL TRANSPORT CONFIGURED. Contact form messages are stored in the CMS ' +
      'but nothing is emailed. Set RESEND_API_KEY and EMAIL_FROM to fix this.',
  )
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
