import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/payload-types'
import { resolveMedia } from '../lib/media'
import { formatDate } from '../lib/date'

export function ArticleCard({ article }: { article: Article }) {
  const cover = resolveMedia(article.coverImage)
  const date = formatDate(article.publishedAt)

  return (
    <Link
      href={`/journal/${article.slug}`}
      className="liquid-glass hover-lift group flex flex-col overflow-hidden rounded-2xl"
    >
      {cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={cover.url}
            alt={cover.alt || article.title}
            fill
            sizes="(min-width: 640px) 672px, 100vw"
            className="hover-media object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {date ? <p className="text-muted text-xs">{date}</p> : null}

        <div className="mt-1 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-normal">{article.title}</h2>
          <span
            aria-hidden="true"
            className="text-muted group-hover:text-accent hover-arrow mt-1 shrink-0"
          >
            →
          </span>
        </div>

        <p className="text-muted mt-2 text-sm leading-relaxed">{article.excerpt}</p>
      </div>
    </Link>
  )
}
