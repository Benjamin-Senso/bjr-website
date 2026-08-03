import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../../components/PageShell'
import { Prose } from '../../components/Prose'
import { JsonLd } from '../../components/JsonLd'
import { getGlobal, getWorkItem } from '../../lib/content'
import { resolveMedia } from '../../lib/media'
import { buildMetadata } from '../../lib/metadata'
import { breadcrumbSchema, workItemSchema } from '../../lib/schema'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  company: 'Company',
  venture: 'Venture',
  project: 'Project',
  involvement: 'Involvement',
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const item = await getWorkItem(slug)
  if (!item) return buildMetadata({}, 'Not found', `/work/${slug}`)

  return buildMetadata(
    {
      metaTitle: item.name,
      metaDescription: item.description,
      ogImage: item.coverImage,
    },
    item.name,
    `/work/${slug}`,
  )
}

export default async function WorkItemPage({ params }: Params) {
  const { slug } = await params
  const [item, settings] = await Promise.all([getWorkItem(slug), getGlobal('site-settings')])

  if (!item) notFound()

  const cover = resolveMedia(item.coverImage)
  const gallery = (item.gallery ?? [])
    .map((entry) => ({ media: resolveMedia(entry.image), caption: entry.caption }))
    .filter((entry) => entry.media)

  const meta = [TYPE_LABELS[item.type] ?? item.type, item.role, item.year]
    .filter(Boolean)
    .join(' · ')

  return (
    <PageShell>
      <JsonLd
        data={[
          workItemSchema(item, settings),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: item.name, path: `/work/${item.slug}` },
          ]),
        ]}
      />

      <Link
        href="/work"
        className="text-muted hover:text-foreground mb-8 inline-flex items-center gap-1.5 self-start text-sm transition-colors"
      >
        <span aria-hidden="true">←</span> Back to work
      </Link>

      <header className="mb-8">
        <p className="text-accent/80 text-xs tracking-[0.12em] uppercase">{meta}</p>
        <h1 className="font-display mt-2 text-4xl font-normal sm:text-5xl">{item.name}</h1>
        {item.description ? (
          <p className="text-muted mt-3 leading-relaxed text-balance">{item.description}</p>
        ) : null}
      </header>

      {cover ? (
        <div className="border-border relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
          <Image
            src={cover.url}
            alt={cover.alt || item.name}
            fill
            sizes="(min-width: 672px) 672px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {item.body ? (
        <Prose>
          <RichText data={item.body} />
        </Prose>
      ) : null}

      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground mt-8 inline-flex items-center gap-1.5 self-start rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Visit {item.name}
          <span aria-hidden="true" className="text-[0.8em]">
            ↗
          </span>
        </a>
      ) : null}

      {gallery.length ? (
        <div className="mt-12 flex flex-col gap-6">
          {gallery.map((entry, i) => (
            <figure key={i}>
              <div className="border-border relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
                <Image
                  src={entry.media!.url}
                  alt={entry.media!.alt || entry.caption || item.name}
                  fill
                  sizes="(min-width: 672px) 672px, 100vw"
                  className="object-cover"
                />
              </div>
              {entry.caption ? (
                <figcaption className="text-muted mt-2 text-sm">{entry.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </PageShell>
  )
}
