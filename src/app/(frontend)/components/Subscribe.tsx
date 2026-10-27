import { isBeehiivConfigured } from '@/lib/beehiiv'
import { getGlobal } from '../lib/content'
import { SubscribeForm } from './SubscribeForm'

type Placement = 'home' | 'about' | 'article' | 'journal'

/**
 * The newsletter signup block.
 *
 * Renders nothing unless beehiiv is connected. A signup field with no
 * publication behind it is worse than no field at all: the visitor hands over
 * an address, the action returns "Newsletter is not configured yet", and the
 * one person willing to subscribe is the one who sees it fail.
 *
 * Placement decides nothing about the look, only whether this spot is switched
 * on in the CMS. The journal page always shows it, since that is the page the
 * newsletter belongs to.
 */
export async function Subscribe({
  placement,
  variant = 'full',
}: {
  placement: Placement
  variant?: 'full' | 'inline'
}) {
  if (!isBeehiivConfigured()) return null

  const newsletter = await getGlobal('newsletter')

  const enabled =
    placement === 'journal' ||
    (placement === 'home' && newsletter.showOnHome !== false) ||
    (placement === 'about' && newsletter.showOnAbout !== false) ||
    (placement === 'article' && newsletter.showAfterArticles !== false)

  if (!enabled) return null

  const promises = newsletter.promises ?? []

  // In the hero the ask has to stay out of the way of the introduction, so it
  // is the field and one line of small print rather than the full panel.
  if (variant === 'inline') {
    return (
      <section className="mt-7 w-full max-w-md [&_p]:text-center">
        <SubscribeForm
          buttonLabel={newsletter.buttonLabel}
          footnote={
            newsletter.footnote ||
            promises.map((promise) => promise.label).join(' · ') ||
            undefined
          }
        />
      </section>
    )
  }

  return (
    <section className="liquid-glass mt-10 w-full rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-2xl font-normal">{newsletter.heading}</h2>

      {newsletter.blurb ? (
        <p className="text-muted mt-2 max-w-prose text-sm leading-relaxed">{newsletter.blurb}</p>
      ) : null}

      {promises.length ? (
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {promises.map((promise) => (
            <li
              key={promise.id ?? promise.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <span className="block text-sm font-medium">{promise.label}</span>
              <span className="text-muted mt-0.5 block text-xs leading-relaxed">
                {promise.detail}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <SubscribeForm buttonLabel={newsletter.buttonLabel} footnote={newsletter.footnote} />
    </section>
  )
}
