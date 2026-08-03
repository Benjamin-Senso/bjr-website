import Link from 'next/link'
import type { Work } from '@/payload-types'

type Advisory = NonNullable<Work['advisory']>

/**
 * Deliberately the last thing on the page. The brief is explicit that advisory
 * is earned by the proof above it rather than asserted in the header, so this
 * reads as an open door, not a service menu.
 */
export function AdvisorySection({ advisory }: { advisory?: Advisory | null }) {
  if (!advisory?.enabled) return null

  const points = advisory.points ?? []
  const isInternal = advisory.ctaUrl?.startsWith('/')

  return (
    <section className="mt-16">
      <div className="liquid-glass rounded-2xl p-6 sm:p-8">
        {advisory.heading ? (
          <h2 className="font-display text-2xl font-normal sm:text-3xl">{advisory.heading}</h2>
        ) : null}

        {advisory.body ? (
          <p className="text-muted mt-3 leading-relaxed">{advisory.body}</p>
        ) : null}

        {points.length ? (
          <ul className="mt-6 flex flex-col gap-4">
            {points.map((point) => (
              <li key={point.id ?? point.title} className="border-l border-white/10 pl-4">
                <h3 className="text-sm font-medium">{point.title}</h3>
                {point.description ? (
                  <p className="text-muted mt-1 text-sm leading-relaxed">{point.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {advisory.ctaUrl && advisory.ctaLabel ? (
          isInternal ? (
            <Link
              href={advisory.ctaUrl}
              className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-7 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {advisory.ctaLabel}
              <span aria-hidden="true" className="text-[0.8em]">
                →
              </span>
            </Link>
          ) : (
            <a
              href={advisory.ctaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-7 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {advisory.ctaLabel}
              <span aria-hidden="true" className="text-[0.8em]">
                ↗
              </span>
            </a>
          )
        ) : null}
      </div>
    </section>
  )
}
