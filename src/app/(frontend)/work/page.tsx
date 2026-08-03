import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Prose'
import { WorkGrid } from '../components/WorkGrid'
import { AdvisorySection } from '../components/AdvisorySection'
import { JsonLd } from '../components/JsonLd'
import { getGlobal, getWorkItems } from '../lib/content'
import { buildMetadata } from '../lib/metadata'
import { breadcrumbSchema, workCollectionSchema } from '../lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const work = await getGlobal('work')
  return buildMetadata(work, 'Work', '/work')
}

export default async function WorkPage() {
  const [work, items] = await Promise.all([getGlobal('work'), getWorkItems()])

  return (
    <PageShell width="grid">
      <JsonLd
        data={[
          workCollectionSchema(items, work.heading, work.intro ?? undefined),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: work.heading, path: '/work' },
          ]),
        ]}
      />

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
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground hover-tint group mt-8 inline-flex items-center gap-1.5 self-start rounded-full border px-5 py-2.5 text-sm font-medium"
        >
          {work.studioLinkLabel || 'Visit the studio'}
          <span aria-hidden="true" className="hover-arrow hover-arrow-diagonal text-[0.8em]">
            ↗
          </span>
        </a>
      ) : null}

      <WorkGrid items={items} />

      <AdvisorySection advisory={work.advisory} />
    </PageShell>
  )
}
