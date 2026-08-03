'use client'

import { useEffect } from 'react'
import { PageShell } from './components/PageShell'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageShell width="narrow">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-normal">Something went wrong</h1>
        <p className="text-muted mt-2 max-w-prose leading-relaxed text-balance">
          That is on us, not you. Try again in a moment.
        </p>

        <button
          type="button"
          onClick={reset}
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-8 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Try again
        </button>

        {error.digest ? (
          <p className="text-muted/60 mt-6 font-mono text-xs">{error.digest}</p>
        ) : null}
      </div>
    </PageShell>
  )
}
