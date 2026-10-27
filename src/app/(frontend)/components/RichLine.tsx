import Image from 'next/image'
import Link from 'next/link'
import type { WorkItem } from '@/payload-types'
import { resolveMedia } from '../lib/media'

/**
 * A single paragraph of biography with two pieces of inline markup.
 *
 *   *word*    emphasis, set in the display serif italic
 *   [slug]    the named work item, rendered as its logo plus its name and
 *             linked to its page
 *
 * A full rich text editor would be the obvious reach here, but this is one
 * paragraph whose only needs are emphasis and references to things the CMS
 * already knows about. A convention keeps the field a plain textarea, keeps
 * the markup readable while editing, and means a venture renamed in the work
 * collection is renamed here too rather than drifting out of sync.
 *
 * An unknown slug falls back to its own text, so a typo reads as a plain word
 * rather than disappearing from the sentence.
 */

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'em'; value: string }
  | { kind: 'ref'; value: string }

const PATTERN = /\*([^*]+)\*|\[([^\]]+)\]/g

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0

  for (const match of input.matchAll(PATTERN)) {
    const at = match.index ?? 0
    if (at > cursor) tokens.push({ kind: 'text', value: input.slice(cursor, at) })

    if (match[1] !== undefined) tokens.push({ kind: 'em', value: match[1] })
    else if (match[2] !== undefined) tokens.push({ kind: 'ref', value: match[2] })

    cursor = at + match[0].length
  }

  if (cursor < input.length) tokens.push({ kind: 'text', value: input.slice(cursor) })
  return tokens
}

function Reference({ item }: { item: WorkItem }) {
  const logo = resolveMedia(item.coverImage)

  return (
    <Link
      href={`/work/${item.slug}`}
      className="text-foreground hover:text-accent mx-0.5 inline-flex items-baseline gap-1.5 font-medium transition-colors"
    >
      {logo ? (
        <span className="relative inline-block h-[1.05em] w-[1.05em] shrink-0 translate-y-[0.14em] overflow-hidden rounded-[0.3em] border border-white/10 bg-white/[0.06]">
          <Image src={logo.url} alt="" fill sizes="24px" className="object-cover" />
        </span>
      ) : null}
      {item.name}
    </Link>
  )
}

export function RichLine({
  text,
  items = [],
  className,
}: {
  text: string
  items?: WorkItem[]
  className?: string
}) {
  const bySlug = new Map(items.filter((item) => item.slug).map((item) => [item.slug as string, item]))

  return (
    <p className={className}>
      {tokenize(text).map((token, i) => {
        if (token.kind === 'em') {
          return (
            <em key={i} className="font-display text-foreground text-[1.12em] italic">
              {token.value}
            </em>
          )
        }

        if (token.kind === 'ref') {
          const item = bySlug.get(token.value)
          return item ? <Reference key={i} item={item} /> : <span key={i}>{token.value}</span>
        }

        return <span key={i}>{token.value}</span>
      })}
    </p>
  )
}
