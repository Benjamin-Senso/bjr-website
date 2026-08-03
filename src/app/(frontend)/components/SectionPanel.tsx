'use client'

import Image from 'next/image'
import Link from 'next/link'
import { resolveMedia } from '../lib/media'
import { useGlassPointer } from '../lib/useGlassPointer'
import type { Home } from '@/payload-types'

type LinkItem = NonNullable<Home['links']>[number]

/**
 * The home page's way through to everything else. Carries a real paragraph and
 * tags rather than a single line, so each panel gives enough context to be
 * worth the click on its own.
 */
export function SectionPanel({ link }: { link: LinkItem }) {
  const cover = resolveMedia(link.image)
  const { ref, onPointerMove, onPointerLeave } = useGlassPointer<HTMLAnchorElement>()

  const isInternal = link.url.startsWith('/')
  const tags = link.tags ?? []

  const className =
    'liquid-glass group hover:border-accent/45 flex flex-col overflow-hidden rounded-2xl text-left transition-[border-color,transform] duration-300 hover:-translate-y-1'

  const inner = (
    <>
      {cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={cover.url}
            alt={cover.alt || link.title}
            fill
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display min-w-0 text-2xl font-normal">{link.title}</h2>
          <span
            aria-hidden="true"
            className="text-muted group-hover:text-accent mt-1 shrink-0 transition-colors"
          >
            {isInternal ? '→' : '↗'}
          </span>
        </div>

        {link.description ? (
          <p className="text-muted mt-3 text-sm leading-relaxed">{link.description}</p>
        ) : null}

        {tags.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.id ?? tag.label}
                className="text-muted rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs"
              >
                {tag.label}
              </li>
            ))}
          </ul>
        ) : null}
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
