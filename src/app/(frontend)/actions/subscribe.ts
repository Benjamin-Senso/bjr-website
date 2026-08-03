'use server'

import { subscribe } from '@/lib/beehiiv'

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const result = await subscribe(email)
  if (!result.ok) return { status: 'error', message: result.error }

  return { status: 'success', message: 'Check your inbox to confirm.' }
}
