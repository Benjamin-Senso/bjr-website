import { notFound } from 'next/navigation'

/**
 * Catch-all for unmatched URLs.
 *
 * A root-level not-found.tsx would make Next generate a default layout with
 * its own html/body, which then nests inside the one (frontend)/layout.tsx
 * renders. Catching it inside the group instead keeps a single html element
 * and gives the 404 the nav and backdrop for free.
 */
export default function NotFoundCatchAll(): never {
  notFound()
}
