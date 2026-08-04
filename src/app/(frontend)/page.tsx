import './styles.css'
import { Hero } from './components/Hero'
import { Socials } from './components/Socials'
import { SectionPanel } from './components/SectionPanel'
import { PageShell } from './components/PageShell'
import { WorkPreview } from './components/WorkPreview'
import { JsonLd } from './components/JsonLd'
import { profilePageSchema } from './lib/schema'
import { getGlobal, getWorkItems } from './lib/content'
import { buildMetadata } from './lib/metadata'

// Rendered per request so the build never needs a database; the reads
// themselves are cached and dropped by Payload's afterChange hooks.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const home = await getGlobal('home')
  return buildMetadata(home, 'Benjamin Rutter', '/')
}

export default async function HomePage() {
  const [home, settings, workItems] = await Promise.all([
    getGlobal('home'),
    getGlobal('site-settings'),
    getWorkItems(),
  ])

  const links = home.links ?? []
  // Two is enough to prove there is work behind the claim without turning the
  // home page into a second /work.
  const previewItems = workItems.slice(0, 2)

  return (
    <PageShell width="home">
      <JsonLd data={profilePageSchema(settings)} />

      <Hero name={settings.name} bio={home.bio} profileImage={settings.profileImage} />

      {home.statement ? (
        <p className="text-muted mt-4 max-w-prose text-center leading-relaxed text-balance">
          {home.statement}
        </p>
      ) : null}

      <Socials socials={settings.socials} />

      <WorkPreview items={previewItems} />

      {links.length ? (
        <section className="mt-10 grid w-full grid-cols-1 gap-4">
          {links.map((link) => (
            <SectionPanel key={link.id ?? link.url} link={link} />
          ))}
        </section>
      ) : null}
    </PageShell>
  )
}
