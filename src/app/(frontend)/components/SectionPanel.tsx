'use client'

import Image from 'next/image'
import Link from 'next/link'
import { resolveMedia } from '../lib/media'
import { useGlassPointer } from '../lib/useGlassPointer'
import type { Home } from '@/payload-types'

type LinkItem = NonNullable<Home['links']>[number]

/**
 * The home page's way through to everything else: a full panel per destination
 * rather than a compact list row, so each section reads as somewhere to go.
 */
export function SectionPanel({ link }: { link: LinkItem }) {
  const thumb = resolveMedia(link.image)
  const { ref, onPointerMove, onPointerLeave } = useGlassPointer<HTMLAnchorElement>()

  const isInternal = link.url.startsWith('/')

  const className =
    'liquid-glass group hover:border-accent/45 flex flex-col overflow-hidden rounded-2xl transition-[border-color,transform] duration-300 hover:-translate-y-1'

  const inner = (
    <>
      {thumb ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={thumb.url}
            alt={thumb.alt || link.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-normal">{link.title}</h2>
          {link.description ? (
            <p className="text-muted mt-1.5 text-sm leading-relaxed">{link.description}</p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="text-muted group-hover:text-accent shrink-0 transition-colors"
        >
          {isInternal ? '→' : '↗'}
        </span>
      </div>
    </>
  )

  const handlers = { ref, onPointerMove, onPointerLeave, className }

  return isInternal ? (
    <Link href={link.url} {...handlers}>
      {inner}
    </Link>
  ) : (
    <a href={link.url} target="_blank" rel="noopener noreferrer" {...handlers}>
      {inner}
    </a>
  )
}
