import Image from 'next/image'
import type { SiteSetting, WorkItem } from '@/payload-types'
import { resolveMedia } from '../lib/media'
import { RichLine } from './RichLine'

export function Hero({
  name,
  bio,
  profileImage,
  workItems = [],
}: {
  name: string
  bio: string
  profileImage: SiteSetting['profileImage']
  workItems?: WorkItem[]
}) {
  const avatar = resolveMedia(profileImage)
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')

  return (
    <header className="flex flex-col items-center text-center">
      <div className="border-border relative h-24 w-24 overflow-hidden rounded-full border bg-white/[0.04]">
        {avatar ? (
          <Image
            src={avatar.url}
            alt={avatar.alt || name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-muted flex h-full w-full items-center justify-center text-2xl font-medium">
            {initials}
          </span>
        )}
      </div>
      <h1 className="mt-5 font-display text-3xl font-normal sm:text-4xl">{name}</h1>
      <RichLine
        text={bio}
        items={workItems}
        className="text-muted mt-2 max-w-prose leading-relaxed text-balance"
      />
    </header>
  )
}
