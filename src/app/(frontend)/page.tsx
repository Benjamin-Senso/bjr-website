import { getPayload } from 'payload'
import config from '@payload-config'
import './styles.css'
import { Hero } from './components/Hero'
import { Socials } from './components/Socials'
import { LinkTabs } from './components/LinkTabs'
import { PageShell } from './components/PageShell'
import { buildMetadata } from './lib/metadata'

// Content is editable in the CMS, so always render fresh on request.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home' })
  return buildMetadata(home, 'Benjamin Rutter')
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const [home, settings] = await Promise.all([
    payload.findGlobal({ slug: 'home' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  return (
    <PageShell width="narrow">
      <Hero name={settings.name} bio={home.bio} profileImage={settings.profileImage} />
      <Socials socials={settings.socials} />
      <LinkTabs groups={home.linkGroups ?? []} />
    </PageShell>
  )
}
