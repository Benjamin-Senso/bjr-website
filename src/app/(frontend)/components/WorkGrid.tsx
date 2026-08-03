'use client'

import { useMemo, useState } from 'react'
import type { Work, Venture } from '@/payload-types'
import { ProjectCard } from './ProjectCard'
import { FilterPills } from './FilterPills'

type Project = NonNullable<Work['projects']>[number]

/**
 * Projects and ventures share one grid so the page reads as a single body of
 * work, with the pills narrowing it rather than splitting it across routes.
 * Ventures are mapped onto the project card shape at the boundary.
 */
export function WorkGrid({ projects, ventures }: { projects: Project[]; ventures: Venture[] }) {
  const [active, setActive] = useState('all')

  const venturesAsProjects: Project[] = useMemo(
    () =>
      ventures.map((v) => ({
        id: v.id.toString(),
        title: v.name,
        meta: [v.role, v.year].filter(Boolean).join(', ') || undefined,
        description: v.description ?? undefined,
        url: v.url ?? undefined,
        coverImage: v.logo,
      })),
    [ventures],
  )

  const filters = [
    { value: 'all', label: 'All', count: projects.length + venturesAsProjects.length },
    { value: 'projects', label: 'Projects', count: projects.length },
    { value: 'ventures', label: 'Ventures', count: venturesAsProjects.length },
  ].filter((f) => f.value === 'all' || f.count > 0)

  const shown =
    active === 'projects'
      ? projects
      : active === 'ventures'
        ? venturesAsProjects
        : [...projects, ...venturesAsProjects]

  if (!shown.length && active === 'all') return null

  return (
    <section className="mt-12">
      <FilterPills filters={filters} active={active} onChange={setActive} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shown.map((project) => (
          <ProjectCard key={project.id ?? project.title} project={project} />
        ))}
      </div>
    </section>
  )
}
