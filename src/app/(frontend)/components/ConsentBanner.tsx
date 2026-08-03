'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY } from './ConsentDefaults'

type Choice = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/** Pushes a consent update into the same dataLayer the defaults script created. */
function updateConsent(choice: Choice) {
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}

/**
 * Consent banner.
 *
 * Renders nothing until mounted, so the server never guesses at a choice
 * stored only in the browser. Declining is as easy as accepting and the
 * banner does not reappear either way: a "reject" that is harder to reach
 * than "accept" is not valid consent under UK GDPR.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
    } catch {
      // Storage blocked (private mode, strict settings). Without somewhere to
      // record a choice, asking again every page would be worse than staying
      // silent, and consent defaults remain denied.
    }
  }, [])

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice)
    } catch {
      // Non-fatal: the choice applies to this page view either way.
    }
    updateConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="consent-banner fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4"
    >
      <div className="liquid-glass mb-4 flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted text-sm leading-relaxed">
          I use analytics cookies to understand how the site is used. Nothing is set unless you
          accept.
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="text-muted hover:text-foreground hover-tint rounded-full border border-white/10 px-4 py-2 text-sm"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground hover-tint rounded-full border px-4 py-2 text-sm font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
