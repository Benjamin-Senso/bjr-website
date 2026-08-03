'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { contactAction, type ContactState } from '../actions/contact'

const INITIAL: ContactState = { status: 'idle' }

const fieldClass =
  'text-foreground placeholder:text-muted focus:border-accent/60 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none transition-colors'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground hover-tint self-start rounded-full border px-5 py-2.5 text-sm font-medium disabled:opacity-50"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

export function ContactForm({ heading }: { heading?: string | null }) {
  const [state, formAction] = useActionState(contactAction, INITIAL)

  if (state.status === 'success') {
    return (
      <section className="liquid-glass mt-6 rounded-2xl p-6">
        <p className="text-accent" role="status">
          {state.message}
        </p>
      </section>
    )
  }

  return (
    <section className="liquid-glass mt-6 rounded-2xl p-6 sm:p-8">
      {heading ? <h2 className="font-display mb-5 text-2xl font-normal">{heading}</h2> : null}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="text-muted mb-1.5 block text-xs">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              aria-invalid={Boolean(state.fieldErrors?.name)}
              className={fieldClass}
            />
            {state.fieldErrors?.name ? (
              <p className="mt-1 text-xs text-red-400">{state.fieldErrors.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-email" className="text-muted mb-1.5 block text-xs">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className={fieldClass}
            />
            {state.fieldErrors?.email ? (
              <p className="mt-1 text-xs text-red-400">{state.fieldErrors.email}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="text-muted mb-1.5 block text-xs">
            Subject <span className="opacity-60">(optional)</span>
          </label>
          <input id="contact-subject" name="subject" className={fieldClass} />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-muted mb-1.5 block text-xs">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            aria-invalid={Boolean(state.fieldErrors?.message)}
            className={`${fieldClass} resize-y`}
          />
          {state.fieldErrors?.message ? (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.message}</p>
          ) : null}
        </div>

        {/* Honeypot. Hidden from users, irresistible to bots. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <SubmitButton />

        {state.status === 'error' && state.message ? (
          <p className="text-sm text-red-400" role="alert">
            {state.message}
          </p>
        ) : null}
      </form>
    </section>
  )
}
