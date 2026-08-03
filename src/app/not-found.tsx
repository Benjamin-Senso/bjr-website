import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter, Instrument_Serif } from 'next/font/google'
import './(frontend)/styles.css'

/**
 * Root 404, for URLs that match no route group at all.
 *
 * It must NOT render html/body: with no root layout, Next supplies a default
 * one, and returning our own here causes a hydration mismatch. The font
 * variables therefore hang off a wrapper element rather than <html>.
 *
 * The in-group not-found.tsx handles notFound() thrown inside a frontend
 * route, where the nav and backdrop are already mounted.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Not found',
}

export default function NotFound() {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <main className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6 text-center">
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
      </main>
    </div>
  )
}
