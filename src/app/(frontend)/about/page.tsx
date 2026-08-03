import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
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
        <div className="prose-invert text-foreground/90 [&_a]:text-accent [&_a:hover]:text-accent-hover flex flex-col gap-4 leading-relaxed [&_a]:underline [&_h2]:font-display [&_h2]:mt-4 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-5">
          <RichText data={about.body} />
        </div>
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
