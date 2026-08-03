import Image from 'next/image'
import type { Work } from '@/payload-types'
import { resolveMedia } from '../lib/media'

type Venture = NonNullable<Work['ventures']>[number]

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  exited: 'Exited',
  advisory: 'Advisory',
  building: 'Building',
}

export function VentureCard({ venture }: { venture: Venture }) {
  const logo = resolveMedia(venture.logo)
  const status = venture.status ? STATUS_LABELS[venture.status] : null

  // Only wrap in an anchor when there is somewhere to go.
  const Wrapper = venture.url ? 'a' : 'div'
  const linkProps = venture.url
    ? { href: venture.url, target: '_blank' as const, rel: 'noreferrer noopener' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="liquid-glass group block rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="border-border relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-white/[0.04]">
          {logo ? (
            <Image src={logo.url} alt={logo.alt || venture.name} fill sizes="48px" className="object-cover" />
          ) : (
            <span className="text-muted flex h-full w-full items-center justify-center text-lg font-medium">
              {venture.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="font-display text-xl font-normal">{venture.name}</h2>
            {venture.role ? <span className="text-muted text-sm">{venture.role}</span> : null}
          </div>
          {venture.description ? (
            <p className="text-muted mt-1.5 text-sm leading-relaxed">{venture.description}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {status ? (
            <span className="text-muted rounded-full border border-white/10 px-2.5 py-1 text-xs">
              {status}
            </span>
          ) : null}
          {venture.url ? (
            <span
              aria-hidden="true"
              className="text-muted group-hover:text-accent transition-colors"
            >
              →
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  )
}
