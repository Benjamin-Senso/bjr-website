'use client'

import Image from 'next/image'
import { resolveMedia } from '../lib/media'
import { useGlassPointer } from '../lib/useGlassPointer'
import type { Home } from '@/payload-types'

type LinkItem = NonNullable<NonNullable<Home['linkGroups']>[number]['links']>[number]

export function LinkCard({ link }: { link: LinkItem }) {
  const thumb = resolveMedia(link.image)
  const { ref, onPointerMove, onPointerLeave } = useGlassPointer<HTMLAnchorElement>()

  return (
    <a
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass group flex items-center gap-4 rounded-[20px] p-3 transition-[border-color] duration-200 hover:border-accent/45"
    >
      <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
        {thumb ? (
          <Image
            src={thumb.url}
            alt={thumb.alt || link.title}
            fill
            sizes="52px"
            className="object-cover"
          />
        ) : (
          <span className="text-muted flex h-full w-full items-center justify-center text-lg font-medium">
            {link.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{link.title}</p>
        {link.description ? (
          <p className="text-muted truncate text-sm">{link.description}</p>
        ) : null}
      </div>

      <span
        aria-hidden="true"
        className="text-muted shrink-0 pr-1 transition-colors group-hover:text-accent"
      >
        →
      </span>
    </a>
  )
}
