import { getPayload } from 'payload'
import config from '@payload-config'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { VentureCard } from '../components/VentureCard'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config })
  const work = await payload.findGlobal({ slug: 'work' })
  return buildMetadata(work, 'Work')
}

export default async function WorkPage() {
  const payload = await getPayload({ config })
  const work = await payload.findGlobal({ slug: 'work' })
  const ventures = work.ventures ?? []

  return (
    <PageShell>
      <PageHeader heading={work.heading} intro={work.intro} />

      {ventures.length ? (
        <div className="flex flex-col gap-3">
          {ventures.map((venture) => (
            <VentureCard key={venture.id ?? venture.name} venture={venture} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center text-sm">Nothing here yet.</p>
      )}
    </PageShell>
  )
}
