import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Prose'
import { WorkGrid } from '../components/WorkGrid'
import { getGlobal, getVentures } from '../lib/content'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const work = await getGlobal('work')
  return buildMetadata(work, 'Work')
}

export default async function WorkPage() {
  const [work, ventures] = await Promise.all([getGlobal('work'), getVentures()])
  const projects = work.projects ?? []

  return (
    <PageShell width="grid">
      <PageHeader heading={work.heading} intro={work.intro} />

      {work.body ? (
        <Prose>
          <RichText data={work.body} />
        </Prose>
      ) : null}

      {work.studioUrl ? (
        <a
          href={work.studioUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-8 inline-flex items-center gap-1.5 self-start rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {work.studioLinkLabel || 'Visit the studio'}
          <span aria-hidden="true" className="text-[0.8em]">
            ↗
          </span>
        </a>
      ) : null}

      <WorkGrid projects={projects} ventures={ventures} />
    </PageShell>
  )
}
