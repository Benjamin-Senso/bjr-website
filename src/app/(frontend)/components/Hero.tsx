import Image from 'next/image'
import type { Home } from '@/payload-types'
import { resolveMedia } from '../lib/media'

export function Hero({
  name,
  bio,
  profileImage,
}: {
  name: string
  bio: string
  profileImage: Home['profileImage']
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
      <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
      <p className="text-muted mt-2 max-w-prose leading-relaxed text-balance">{bio}</p>
    </header>
  )
}
