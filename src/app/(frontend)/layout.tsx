import { Inter, Instrument_Serif } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'
import { Nav, type NavRoute } from './components/Nav'
import { Footer } from './components/Footer'
import { isBeehiivConfigured } from '@/lib/beehiiv'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Display face for headings. Instrument Serif ships a single 400 weight.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })

  const [settings, ventures] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.count({ collection: 'ventures' }),
  ])

  // One good page beats five thin ones: routes that have nothing to show yet
  // stay out of the nav and appear on their own once there is content.
  const routes: NavRoute[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    ...(ventures.totalDocs > 0 ? [{ href: '/ventures', label: 'Ventures' }] : []),
    ...(isBeehiivConfigured() ? [{ href: '/writing', label: 'Writing' }] : []),
  ]

  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <GlassFilter />
        <AuroraBackdrop />
        <Nav routes={routes} cta={{ href: '/contact', label: 'Contact' }} />
        {children}
        <Footer text={settings?.footerText} />
      </body>
    </html>
  )
}
