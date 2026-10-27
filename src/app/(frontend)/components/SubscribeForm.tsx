'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribeAction, type SubscribeState } from '../actions/subscribe'

const INITIAL: SubscribeState = { status: 'idle' }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground hover-tint shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium disabled:opacity-50"
    >
      {pending ? 'Subscribing…' : label}
    </button>
  )
}

/**
 * The email field on its own. The surrounding panel, heading and expectations
 * are rendered by the Subscribe server component, which keeps this client
 * bundle to the part that actually needs interactivity.
 *
 * Ids are generated rather than fixed so the block can appear more than once
 * on a page without two inputs claiming the same label.
 */
export function SubscribeForm({
  buttonLabel,
  footnote,
}: {
  buttonLabel?: string | null
  footnote?: string | null
}) {
  const [state, formAction] = useActionState(subscribeAction, INITIAL)
  const fieldId = useId()
  const errorId = `${fieldId}-error`

  if (state.status === 'success') {
    return (
      <p className="text-accent mt-5 text-sm" role="status">
        {state.message}
      </p>
    )
  }

  return (
    <>
      <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">
          Email address
        </label>
        <input
          id={fieldId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={state.status === 'error' ? errorId : undefined}
          className="text-foreground placeholder:text-muted focus:border-accent/60 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none transition-colors"
        />
        <SubmitButton label={buttonLabel || 'Subscribe'} />
      </form>

      {state.status === 'error' ? (
        <p id={errorId} className="mt-3 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}

      {footnote && state.status !== 'error' ? (
        <p className="text-muted mt-3 text-xs">{footnote}</p>
      ) : null}
    </>
  )
}
