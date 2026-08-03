import Image from 'next/image'
import type { Work } from '@/payload-types'
import { resolveMedia } from '../lib/media'

type Project = NonNullable<Work['projects']>[number]

export function ProjectCard({ project }: { project: Project }) {
  const cover = resolveMedia(project.coverImage)

  // Only wrap in an anchor when there is somewhere to go.
  const Wrapper = project.url ? 'a' : 'div'
  const linkProps = project.url
    ? { href: project.url, target: '_blank' as const, rel: 'noreferrer noopener' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="liquid-glass group flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.04]">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || project.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-muted/50 font-display flex h-full w-full items-center justify-center text-5xl">
            {project.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-normal">{project.title}</h3>
          {project.url ? (
            <span
              aria-hidden="true"
              className="text-muted group-hover:text-accent shrink-0 transition-colors"
            >
              ↗
            </span>
          ) : null}
        </div>

        {project.meta ? <p className="text-muted mt-1 text-xs">{project.meta}</p> : null}

        {project.description ? (
          <p className="text-muted mt-2 text-sm leading-relaxed">{project.description}</p>
        ) : null}
      </div>
    </Wrapper>
  )
}
