import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageShell } from '../../components/PageShell'
import { Prose } from '../../components/Prose'
import { JsonLd } from '../../components/JsonLd'
import { getArticle } from '../../lib/content'
import { resolveMedia } from '../../lib/media'
import { formatDate } from '../../lib/date'
import { buildMetadata } from '../../lib/metadata'
import { articleSchema, breadcrumbSchema } from '../../lib/schema'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return buildMetadata({}, 'Not found', `/writing/${slug}`)

  const metadata = await buildMetadata(
    {
      metaTitle: article.title,
      metaDescription: article.excerpt,
      ogImage: article.coverImage,
    },
    article.title,
    `/writing/${slug}`,
  )

  // Only when the piece was first published elsewhere. Normally this site is
  // the original, so the canonical buildMetadata set already points here.
  if (article.canonicalUrl) {
    metadata.alternates = { canonical: article.canonicalUrl }
  }

  // An article is not a generic page; the OG type affects how it previews.
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' } }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  const cover = resolveMedia(article.coverImage)
  const date = formatDate(article.publishedAt)

  return (
    <PageShell>
      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: article.title, path: `/writing/${article.slug}` },
          ]),
        ]}
      />

      <Link
        href="/writing"
        className="text-muted hover:text-foreground hover-tint mb-8 inline-flex items-center gap-1.5 self-start text-sm"
      >
        <span aria-hidden="true">←</span> Back to writing
      </Link>

      <header className="mb-8">
        {date ? (
          <p className="text-accent/80 text-xs tracking-[0.12em] uppercase">{date}</p>
        ) : null}
        <h1 className="font-display mt-2 text-4xl font-normal sm:text-5xl">{article.title}</h1>
        <p className="text-muted mt-3 leading-relaxed text-balance">{article.excerpt}</p>
      </header>

      {cover ? (
        <div className="border-border relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
          <Image
            src={cover.url}
            alt={cover.alt || article.title}
            fill
            sizes="(min-width: 672px) 672px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <Prose>
        <RichText data={article.body} />
      </Prose>
    </PageShell>
  )
}
