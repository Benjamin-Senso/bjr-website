import Image from 'next/image'
import Link from 'next/link'
import type { WorkItem } from '@/payload-types'
import { resolveMedia } from '../lib/media'

const TYPE_LABELS: Record<string, string> = {
  company: 'Company',
  venture: 'Venture',
  project: 'Project',
  involvement: 'Involvement',
}

/**
 * A short list of work on the home page.
 *
 * Deliberately slimmer than the cards on /work: the home page already carries
 * full-width section panels, and repeating that treatment would make the page
 * read as two competing lists rather than an intro and some proof.
 */
export function WorkPreview({ items }: { items: WorkItem[] }) {
  if (!items.length) return null

  return (
    <section className="mt-12 w-full">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-muted text-xs tracking-[0.12em] uppercase">Selected work</h2>
        <Link
          href="/work"
          className="text-muted hover:text-accent hover-tint group inline-flex items-center gap-1 text-xs"
        >
          All work
          <span aria-hidden="true" className="hover-arrow">
            →
          </span>
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const cover = resolveMedia(item.coverImage)
          const meta = [TYPE_LABELS[item.type] ?? item.type, item.role].filter(Boolean).join(' · ')

          return (
            <li key={item.id}>
              <Link
                href={`/work/${item.slug}`}
                className="liquid-glass hover-lift group flex items-center gap-4 rounded-2xl p-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                  {cover ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || item.name}
                      fill
                      sizes="48px"
                      className="hover-media object-cover"
                    />
                  ) : (
                    <span className="text-muted/60 font-display flex h-full w-full items-center justify-center text-lg">
                      {item.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display truncate text-lg">{item.name}</p>
                  {meta ? <p className="text-muted truncate text-xs">{meta}</p> : null}
                </div>

                <span
                  aria-hidden="true"
                  className="text-muted group-hover:text-accent hover-arrow shrink-0 pr-1"
                >
                  →
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
