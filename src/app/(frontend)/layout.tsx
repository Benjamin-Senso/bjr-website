import { Inter, Instrument_Serif } from 'next/font/google'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'
import { Nav, type NavRoute } from './components/Nav'
import { Footer } from './components/Footer'
import { JsonLd } from './components/JsonLd'
import { getGlobal } from './lib/content'
import { personSchema, websiteSchema } from './lib/schema'
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
  const settings = await getGlobal('site-settings')

  // Work before About: the studio is the proof, the story comes second.
  const routes: NavRoute[] = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    // Writing only appears once the newsletter is actually connected.
    ...(isBeehiivConfigured() ? [{ href: '/writing', label: 'Writing' }] : []),
  ]

  return (
    <html lang="en-GB" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        {/* Emitted once with stable @ids so per-page schema can reference these
            entities instead of repeating them. */}
        <JsonLd data={[personSchema(settings), websiteSchema(settings)]} />
        <GlassFilter />
        <AuroraBackdrop />
        <Nav routes={routes} cta={{ href: '/contact', label: 'Contact' }} />
        {children}
        <Footer text={settings?.footerText} />
      </body>
    </html>
  )
}
