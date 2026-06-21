import type { Home } from '@/payload-types'
import type { IconType } from 'react-icons'
import {
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTiktok,
  FaThreads,
  FaGithub,
  FaFacebookF,
  FaEnvelope,
  FaGlobe,
} from 'react-icons/fa6'

const ICONS: Record<string, IconType> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  threads: FaThreads,
  github: FaGithub,
  facebook: FaFacebookF,
  email: FaEnvelope,
  website: FaGlobe,
}

const LABELS: Record<string, string> = {
  instagram: 'Instagram',
  x: 'X',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  threads: 'Threads',
  github: 'GitHub',
  facebook: 'Facebook',
  email: 'Email',
  website: 'Website',
}

export function Socials({ socials }: { socials: Home['socials'] }) {
  if (!socials || socials.length === 0) return null

  return (
    <nav aria-label="Social links" className="mt-5">
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {socials.map((social) => {
          const Icon = ICONS[social.platform] ?? FaGlobe
          const label = LABELS[social.platform] ?? 'Link'
          return (
            <li key={social.id ?? social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-muted hover:text-accent inline-flex transition-colors hover:-translate-y-0.5"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
