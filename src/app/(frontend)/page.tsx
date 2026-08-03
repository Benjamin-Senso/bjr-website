import { getPayload } from 'payload'
import config from '@payload-config'
import './styles.css'
import { Hero } from './components/Hero'
import { Socials } from './components/Socials'
import { LinkCard } from './components/LinkCard'
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

  const links = home.links ?? []

  return (
    <PageShell width="narrow">
      <Hero name={settings.name} bio={home.bio} profileImage={settings.profileImage} />

      {home.statement ? (
        <p className="text-muted mt-4 max-w-prose text-center leading-relaxed text-balance">
          {home.statement}
        </p>
      ) : null}

      <Socials socials={settings.socials} />

      {links.length ? (
        <section className="mt-10 flex w-full flex-col gap-3">
          {links.map((link) => (
            <LinkCard key={link.id ?? link.url} link={link} />
          ))}
        </section>
      ) : null}
    </PageShell>
  )
}
