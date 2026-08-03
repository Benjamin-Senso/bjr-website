import { getPayload } from 'payload'
import config from '@payload-config'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { VentureCard } from '../components/VentureCard'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config })
  const page = await payload.findGlobal({ slug: 'ventures-page' })
  return buildMetadata(page, 'Ventures')
}

export default async function VenturesPage() {
  const payload = await getPayload({ config })
  const [page, ventures] = await Promise.all([
    payload.findGlobal({ slug: 'ventures-page' }),
    payload.find({ collection: 'ventures', limit: 100, sort: 'order' }),
  ])

  return (
    <PageShell>
      <PageHeader heading={page.heading} intro={page.intro} />

      {ventures.docs.length ? (
        <div className="flex flex-col gap-3">
          {ventures.docs.map((venture) => (
            <VentureCard key={venture.id} venture={venture} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center text-sm">Nothing here yet.</p>
      )}
    </PageShell>
  )
}
