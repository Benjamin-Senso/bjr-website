import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { Socials } from '../components/Socials'
import { ContactForm } from '../components/ContactForm'
import { JsonLd } from '../components/JsonLd'
import { getGlobal } from '../lib/content'
import { buildMetadata } from '../lib/metadata'
import { breadcrumbSchema, contactPageSchema } from '../lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const contact = await getGlobal('contact')
  return buildMetadata(contact, 'Contact', '/contact')
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getGlobal('contact'), getGlobal('site-settings')])

  return (
    <PageShell>
      <JsonLd
        data={[
          contactPageSchema(contact.email),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: contact.heading, path: '/contact' },
          ]),
        ]}
      />

      <PageHeader heading={contact.heading} intro={contact.intro} />

      {contact.showForm !== false ? (
        <ContactForm heading={contact.formHeading} />
      ) : null}

      {contact.email ? (
        <a
          href={`mailto:${contact.email}`}
          className="liquid-glass hover-lift group mt-4 flex items-center justify-between gap-4 rounded-2xl px-6 py-5"
        >
          <span className="min-w-0">
            <span className="text-muted block text-xs tracking-wide uppercase">
              Or email directly
            </span>
            <span className="mt-1 block truncate text-lg">{contact.email}</span>
          </span>
          <span aria-hidden="true" className="text-muted group-hover:text-accent hover-arrow">
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
