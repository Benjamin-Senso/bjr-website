import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Prose'
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
  const proof = work.proof ?? []

  return (
    <PageShell>
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
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-8 inline-flex items-center gap-1.5 self-start rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {work.studioLinkLabel || 'Visit the studio'}
          <span aria-hidden="true" className="text-[0.8em]">
            ↗
          </span>
        </a>
      ) : null}

      {proof.length ? (
        <section className="mt-12">
          <h2 className="font-display mb-4 text-2xl font-normal">Selected proof</h2>
          <div className="flex flex-col gap-3">
            {proof.map((item) => {
              const Wrapper = item.url ? 'a' : 'div'
              const linkProps = item.url
                ? { href: item.url, target: '_blank' as const, rel: 'noreferrer noopener' }
                : {}

              return (
                <Wrapper
                  key={item.id ?? item.title}
                  {...linkProps}
                  className="liquid-glass group block rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-normal">{item.title}</h3>
                    {item.meta ? (
                      <span className="text-muted shrink-0 text-sm">{item.meta}</span>
                    ) : null}
                  </div>
                  {item.description ? (
                    <p className="text-muted mt-1.5 text-sm leading-relaxed">{item.description}</p>
                  ) : null}
                </Wrapper>
              )
            })}
          </div>
        </section>
      ) : null}
    </PageShell>
  )
}
