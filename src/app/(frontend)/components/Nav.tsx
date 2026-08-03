'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavRoute = { href: string; label: string }

/**
 * Routes are decided on the server (see layout.tsx) rather than in the CMS:
 * each one maps 1:1 to a directory in the app router, and routes with nothing
 * to show are dropped so the nav never leads somewhere empty.
 */
export function Nav({ routes, cta }: { routes: NavRoute[]; cta: NavRoute }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav
        aria-label="Main"
        className="liquid-glass flex items-center gap-1 rounded-full p-1.5 sm:gap-2"
      >
        {routes.map((route) => {
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
          href={cta.href}
          aria-current={isActive(cta.href) ? 'page' : undefined}
          className={
            'ml-1 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ' +
            (isActive(cta.href)
              ? 'border-accent/60 bg-accent/25 text-foreground'
              : 'border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 hover:text-foreground')
          }
        >
          {cta.label}
          <span aria-hidden="true" className="text-[0.7em]">
            ↗
          </span>
        </Link>
      </nav>
    </div>
  )
}
