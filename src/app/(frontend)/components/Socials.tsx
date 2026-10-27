import type { SiteSetting } from '@/payload-types'
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

/**
 * Each platform's own colour, used on the icon only. The label and the pill
 * stay neutral: ten saturated chips in a row would pull more attention than
 * the paragraph above them, and X, Threads and GitHub have no colour to use
 * anyway, so they take the foreground.
 */
const COLOURS: Record<string, string> = {
  instagram: '#E1306C',
  x: '#FFFFFF',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  tiktok: '#FE2C55',
  threads: '#FFFFFF',
  github: '#FFFFFF',
  facebook: '#1877F2',
  email: '#9B8BC8',
  website: '#9B8BC8',
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

export function Socials({ socials }: { socials: SiteSetting['socials'] }) {
  if (!socials || socials.length === 0) return null

  return (
    <nav aria-label="Social links" className="mt-6">
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        {socials.map((social) => {
          const Icon = ICONS[social.platform] ?? FaGlobe
          const label = LABELS[social.platform] ?? 'Link'
          const colour = COLOURS[social.platform] ?? 'currentColor'
          return (
            <li key={social.id ?? social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass hover-lift text-foreground inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm"
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: colour }} aria-hidden="true" />
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
