'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function contactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: a hidden field real users never fill in. Silently accept so a bot
  // gets no signal about why it failed.
  if (String(formData.get('company') ?? '').trim()) {
    return { status: 'success', message: 'Thanks. I will get back to you.' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!name) fieldErrors.name = 'Please add your name.'
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Please add a valid email address.'
  if (message.length < 10) fieldErrors.message = 'Please add a little more detail.'

  if (Object.keys(fieldErrors).length) {
    return { status: 'error', message: 'Please check the fields above.', fieldErrors }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        subject: subject || undefined,
        message,
        handled: false,
      },
    })
  } catch (err) {
    console.error('contact: failed to store submission', err)
    return { status: 'error', message: 'Something went wrong. Please email me instead.' }
  }

  return { status: 'success', message: 'Thanks. I will get back to you.' }
}
