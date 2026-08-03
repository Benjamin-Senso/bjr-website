'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export type NavRoute = { href: string; label: string }

type Indicator = { left: number; width: number } | null

/**
 * Routes are decided on the server (see layout.tsx) rather than in the CMS:
 * each one maps 1:1 to a directory in the app router, and routes with nothing
 * to show are dropped so the nav never leads somewhere empty.
 *
 * The active pill is a single element measured against the active item and
 * translated into place, so it slides between items instead of cutting. It
 * covers the CTA too, switching to the accent colour there, which keeps one
 * continuous element rather than a pill that vanishes at the last item.
 */
export function Nav({ routes, cta }: { routes: NavRoute[]; cta: NavRoute }) {
  const pathname = usePathname()
  const items = [...routes, cta]

  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [indicator, setIndicator] = useState<Indicator>(null)
  // Suppresses the transition on first paint so the pill does not slide in
  // from the left edge on load.
  const [ready, setReady] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const activeIndex = items.findIndex((item) => isActive(item.href))
  const ctaActive = activeIndex === items.length - 1

  const measure = useCallback(() => {
    const list = listRef.current
    const el = itemRefs.current[activeIndex]
    if (!list || !el) {
      setIndicator(null)
      return
    }
    // Rects rather than offsetLeft: offsetLeft is relative to whichever
    // ancestor happens to be positioned, which is easy to get wrong by a
    // padding's worth.
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({
      left: elRect.left - listRect.left,
      width: elRect.width,
    })
  }, [activeIndex])

  useLayoutEffect(() => {
    measure()
    // Two frames: one for layout, one to let the initial position paint before
    // transitions are enabled.
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [measure])

  useLayoutEffect(() => {
    // Web fonts and viewport changes both shift item widths after first paint.
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav aria-label="Main" className="liquid-glass rounded-full p-1.5">
        <div ref={listRef} className="relative flex items-center gap-1 sm:gap-2">
          {indicator ? (
            <span
              aria-hidden="true"
              className={
                'absolute inset-y-0 left-0 rounded-full ' +
                (ready
                  ? 'nav-indicator '
                  : '') +
                (ctaActive ? 'border-accent/60 bg-accent/25 border' : 'bg-white/10')
              }
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
              }}
            />
          ) : null}

          {items.map((item, i) => {
            const active = i === activeIndex
            const isCta = i === items.length - 1

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                aria-current={active ? 'page' : undefined}
                className={
                  'hover-tint relative z-10 rounded-full px-3 py-1.5 text-sm sm:px-4 ' +
                  (isCta ? 'border-accent/50 ml-1 inline-flex items-center gap-1 border font-medium ' : '') +
                  (active
                    ? 'text-foreground'
                    : isCta
                      ? 'text-accent hover:text-foreground'
                      : 'text-muted hover:text-foreground')
                }
              >
                {item.label}
                {isCta ? (
                  <span aria-hidden="true" className="text-[0.7em]">
                    ↗
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
