import Link from 'next/link'
import { PageShell } from './components/PageShell'

export default function NotFound() {
  return (
    <PageShell width="narrow">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-accent font-display text-6xl">404</p>
        <h1 className="font-display mt-3 text-3xl font-normal">Nothing here</h1>
        <p className="text-muted mt-2 max-w-prose leading-relaxed text-balance">
          That page has either moved or never existed.
        </p>

        <Link
          href="/"
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-8 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Back home
          <span aria-hidden="true" className="text-[0.8em]">
            →
          </span>
        </Link>
      </div>
    </PageShell>
  )
}
