import Image from 'next/image'
import Link from 'next/link'
import type { WorkItem } from '@/payload-types'
import { resolveMedia } from '../lib/media'

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  building: 'Building',
  exited: 'Exited',
}

/**
 * Always links to the item's own page rather than straight out to their site:
 * the write-up is the point, and the external link lives on that page.
 */
export function WorkItemCard({ item }: { item: WorkItem }) {
  const cover = resolveMedia(item.coverImage)
  const status = item.status ? STATUS_LABELS[item.status] : null
  const meta = [item.role, item.year].filter(Boolean).join(', ')

  return (
    <Link
      href={`/work/${item.slug}`}
      className="liquid-glass group hover:border-accent/45 flex flex-col overflow-hidden rounded-2xl transition-[border-color,transform] duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.04]">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || item.name}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-muted/50 font-display flex h-full w-full items-center justify-center text-5xl">
            {item.name.charAt(0)}
          </span>
        )}

        {status ? (
          <span className="text-foreground/90 absolute top-3 right-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-xs backdrop-blur-sm">
            {status}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-normal">{item.name}</h3>
          <span
            aria-hidden="true"
            className="text-muted group-hover:text-accent shrink-0 transition-colors"
          >
            →
          </span>
        </div>

        {meta ? <p className="text-muted mt-1 text-xs">{meta}</p> : null}

        {item.description ? (
          <p className="text-muted mt-2 text-sm leading-relaxed">{item.description}</p>
        ) : null}
      </div>
    </Link>
  )
}
