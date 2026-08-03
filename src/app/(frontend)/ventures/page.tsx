import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { VentureCard } from '../components/VentureCard'
import { getGlobal, getVentures } from '../lib/content'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getGlobal('ventures-page')
  return buildMetadata(page, 'Ventures')
}

export default async function VenturesPage() {
  const [page, ventures] = await Promise.all([getGlobal('ventures-page'), getVentures()])

  return (
    <PageShell>
      <PageHeader heading={page.heading} intro={page.intro} />

      {ventures.length ? (
        <div className="flex flex-col gap-3">
          {ventures.map((venture) => (
            <VentureCard key={venture.id} venture={venture} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center text-sm">Nothing here yet.</p>
      )}
    </PageShell>
  )
}
