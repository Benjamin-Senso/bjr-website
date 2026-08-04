import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Prose'
import { JsonLd } from '../components/JsonLd'
import { getGlobal } from '../lib/content'
import { buildMetadata } from '../lib/metadata'
import { breadcrumbSchema } from '../lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const privacy = await getGlobal('privacy')
  return buildMetadata(privacy, 'Privacy', '/privacy')
}

export default async function PrivacyPage() {
  const privacy = await getGlobal('privacy')

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: privacy.heading, path: '/privacy' },
        ])}
      />

      <PageHeader heading={privacy.heading} intro={privacy.intro} />

      {privacy.lastUpdated ? (
        <p className="text-muted mb-6 text-center text-xs">
          Last updated {privacy.lastUpdated}
        </p>
      ) : null}

      {privacy.body ? (
        <Prose>
          <RichText data={privacy.body} />
        </Prose>
      ) : null}
    </PageShell>
  )
}
