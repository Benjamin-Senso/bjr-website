import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Socials } from '../components/Socials'
import { getGlobal } from '../lib/content'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const contact = await getGlobal('contact')
  return buildMetadata(contact, 'Contact')
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getGlobal('contact'), getGlobal('site-settings')])

  return (
    <PageShell>
      <PageHeader heading={contact.heading} intro={contact.intro} />

      {contact.email ? (
        <a
          href={`mailto:${contact.email}`}
          className="liquid-glass group flex items-center justify-between gap-4 rounded-2xl px-6 py-5 transition-transform hover:-translate-y-0.5"
        >
          <span className="min-w-0">
            <span className="text-muted block text-xs tracking-wide uppercase">Email</span>
            <span className="mt-1 block truncate text-lg">{contact.email}</span>
          </span>
          <span aria-hidden="true" className="text-muted group-hover:text-accent transition-colors">
            →
          </span>
        </a>
      ) : null}

      {contact.availability ? (
        <p className="text-muted mt-6 text-center text-sm">{contact.availability}</p>
      ) : null}

      {contact.showSocials ? <Socials socials={settings.socials} /> : null}
    </PageShell>
  )
}
