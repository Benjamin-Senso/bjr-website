import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Prose'
import { resolveMedia } from '../lib/media'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about' })
  return buildMetadata(about, 'About')
}

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about' })
  const portrait = resolveMedia(about.portrait)

  return (
    <PageShell>
      <PageHeader heading={about.heading} intro={about.intro} />

      {portrait ? (
        <div className="border-border relative mb-8 aspect-[3/2] w-full overflow-hidden rounded-2xl border">
          <Image
            src={portrait.url}
            alt={portrait.alt || about.heading}
            fill
            sizes="(min-width: 672px) 672px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {about.body ? (
        <Prose>
          <RichText data={about.body} />
        </Prose>
      ) : null}

      {about.helpWith?.length ? (
        <section className="mt-12">
          <h2 className="font-display mb-4 text-2xl font-normal">What I help with</h2>
          <div className="flex flex-col gap-3">
            {about.helpWith.map((item) => (
              <div key={item.id ?? item.title} className="liquid-glass rounded-2xl p-5">
                <h3 className="font-display text-xl font-normal">{item.title}</h3>
                {item.description ? (
                  <p className="text-muted mt-1.5 text-sm leading-relaxed">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {about.facts?.length ? (
        <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {about.facts.map((fact) => (
            <div key={fact.id ?? fact.label} className="liquid-glass rounded-2xl px-5 py-4">
              <dt className="text-muted text-xs tracking-wide uppercase">{fact.label}</dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </PageShell>
  )
}
