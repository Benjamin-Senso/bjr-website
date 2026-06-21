'use client'

import { useState } from 'react'
import type { Home } from '@/payload-types'
import { LinkCard } from './LinkCard'

export function LinkTabs({ groups }: { groups: NonNullable<Home['linkGroups']> }) {
  const [active, setActive] = useState(0)

  if (groups.length === 0) return null

  const showTabs = groups.length > 1
  const current = groups[active] ?? groups[0]

  return (
    <section className="mt-10 w-full">
      {showTabs ? (
        <div
          role="tablist"
          aria-label="Link categories"
          className="mb-6 flex flex-wrap items-center justify-center gap-2"
        >
          {groups.map((group, i) => {
            const isActive = i === active
            return (
              <button
                key={group.id ?? group.label}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
                  (isActive
                    ? 'border-accent/60 bg-accent/15 text-accent'
                    : 'text-muted border-white/10 bg-white/[0.03] hover:border-white/20 hover:text-foreground')
                }
              >
                {group.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div role="tabpanel" className="flex flex-col gap-3">
        {(current.links ?? []).map((link) => (
          <LinkCard key={link.id ?? link.url} link={link} />
        ))}
      </div>
    </section>
  )
}
