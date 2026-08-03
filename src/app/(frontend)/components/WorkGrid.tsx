'use client'

import { useState } from 'react'
import type { WorkItem } from '@/payload-types'
import { WorkItemCard } from './WorkItemCard'
import { FilterPills } from './FilterPills'

/** Plural labels for the filter pills, keyed by the collection's `type` values. */
const TYPE_LABELS: Record<string, string> = {
  company: 'Companies',
  venture: 'Ventures',
  project: 'Projects',
  involvement: 'Involved',
}

// Fixed order so the pills do not reshuffle as content is added.
const TYPE_ORDER = ['company', 'venture', 'project', 'involvement']

export function WorkGrid({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState('all')

  if (!items.length) return null

  // Only surface a filter for types that actually have entries, so the pills
  // grow with the content instead of showing empty categories.
  const filters = [
    { value: 'all', label: 'All', count: items.length },
    ...TYPE_ORDER.map((type) => ({
      value: type,
      label: TYPE_LABELS[type] ?? type,
      count: items.filter((i) => i.type === type).length,
    })).filter((f) => f.count > 0),
  ]

  const shown = active === 'all' ? items : items.filter((i) => i.type === active)

  return (
    <section className="mt-12">
      <FilterPills filters={filters} active={active} onChange={setActive} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shown.map((item) => (
          <WorkItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
