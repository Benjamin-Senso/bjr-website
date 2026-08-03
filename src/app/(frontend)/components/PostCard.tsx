import Image from 'next/image'
import type { BeehiivPost } from '@/lib/beehiiv'

function formatDate(iso?: string) {
  if (!iso) return null
  // Fixed locale so server and client render identically.
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export function PostCard({ post }: { post: BeehiivPost }) {
  const date = formatDate(post.publishedAt)

  return (
    <a
      href={post.webUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="liquid-glass hover-lift group block rounded-2xl p-5"
    >
      <div className="flex items-start gap-4">
        {post.thumbnailUrl ? (
          <div className="border-border relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
            <Image
              src={post.thumbnailUrl}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {date ? <p className="text-muted text-xs">{date}</p> : null}
          <h2 className="font-display mt-1 text-xl font-normal">{post.title}</h2>
          {post.subtitle ? (
            <p className="text-muted mt-1.5 text-sm leading-relaxed">{post.subtitle}</p>
          ) : null}
        </div>

        <span aria-hidden="true" className="text-muted group-hover:text-accent hover-arrow hover-arrow-diagonal shrink-0">
          →
        </span>
      </div>
    </a>
  )
}
