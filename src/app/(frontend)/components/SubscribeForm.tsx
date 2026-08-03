'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribeAction, type SubscribeState } from '../actions/subscribe'

const INITIAL: SubscribeState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
    >
      {pending ? 'Subscribing…' : 'Subscribe'}
    </button>
  )
}

export function SubscribeForm({
  heading,
  blurb,
}: {
  heading?: string | null
  blurb?: string | null
}) {
  const [state, formAction] = useActionState(subscribeAction, INITIAL)

  return (
    <section className="liquid-glass mt-10 rounded-2xl p-6">
      {heading ? <h2 className="font-display text-2xl font-normal">{heading}</h2> : null}
      {blurb ? <p className="text-muted mt-1.5 text-sm leading-relaxed">{blurb}</p> : null}

      {state.status === 'success' ? (
        <p className="text-accent mt-4 text-sm" role="status">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="subscribe-email" className="sr-only">
            Email address
          </label>
          <input
            id="subscribe-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby={state.status === 'error' ? 'subscribe-error' : undefined}
            className="text-foreground placeholder:text-muted focus:border-accent/60 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none transition-colors"
          />
          <SubmitButton />
        </form>
      )}

      {state.status === 'error' ? (
        <p id="subscribe-error" className="mt-3 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}
    </section>
  )
}
