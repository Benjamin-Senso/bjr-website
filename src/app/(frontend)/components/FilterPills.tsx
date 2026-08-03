'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export type Filter = { value: string; label: string; count: number }

/**
 * Segmented filter with the same sliding pill as the nav: one measured element
 * translated into place rather than a background that jumps between buttons.
 */
export function FilterPills({
  filters,
  active,
  onChange,
}: {
  filters: Filter[]
  active: string
  onChange: (value: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const [ready, setReady] = useState(false)

  const activeIndex = filters.findIndex((f) => f.value === active)

  const measure = useCallback(() => {
    const list = listRef.current
    const el = itemRefs.current[activeIndex]
    if (!list || !el) return
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width })
  }, [activeIndex])

  useLayoutEffect(() => {
    measure()
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [measure])

  useLayoutEffect(() => {
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  if (filters.length < 2) return null

  return (
    <div className="mb-6 flex justify-center">
      <div className="liquid-glass rounded-full p-1.5">
        <div ref={listRef} role="tablist" aria-label="Filter work" className="relative flex gap-1">
          {indicator ? (
            <span
              aria-hidden="true"
              className={
                'bg-accent/20 border-accent/50 absolute inset-y-0 left-0 rounded-full border ' +
                (ready
                  ? 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
                  : '')
              }
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
              }}
            />
          ) : null}

          {filters.map((filter, i) => {
            const isActive = filter.value === active
            return (
              <button
                key={filter.value}
                role="tab"
                type="button"
                aria-selected={isActive}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                onClick={() => onChange(filter.value)}
                className={
                  'relative z-10 rounded-full px-4 py-1.5 text-sm transition-colors ' +
                  (isActive ? 'text-foreground' : 'text-muted hover:text-foreground')
                }
              >
                {filter.label}
                <span className="ml-1.5 text-xs opacity-60">{filter.count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
