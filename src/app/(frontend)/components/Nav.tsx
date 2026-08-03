'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Routes are defined here rather than in the CMS: each entry maps 1:1 to a
 * directory in the app router, so letting an editor change them would let the
 * nav point at a page that does not exist.
 */
const ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
] as const

const CTA = { href: '/contact', label: 'Contact' }

export function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav
        aria-label="Main"
        className="liquid-glass flex items-center gap-1 rounded-full p-1.5 sm:gap-2"
      >
        {ROUTES.map((route) => {
          const active = isActive(route.href)
          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={active ? 'page' : undefined}
              className={
                'rounded-full px-3 py-1.5 text-sm transition-colors sm:px-4 ' +
                (active
                  ? 'text-foreground bg-white/10'
                  : 'text-muted hover:text-foreground hover:bg-white/[0.06]')
              }
            >
              {route.label}
            </Link>
          )
        })}

        <Link
          href={CTA.href}
          aria-current={isActive(CTA.href) ? 'page' : undefined}
          className={
            'ml-1 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ' +
            (isActive(CTA.href)
              ? 'border-accent/60 bg-accent/25 text-foreground'
              : 'border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground')
          }
        >
          {CTA.label}
          <span aria-hidden="true" className="text-[0.7em]">
            ↗
          </span>
        </Link>
      </nav>
    </div>
  )
}
