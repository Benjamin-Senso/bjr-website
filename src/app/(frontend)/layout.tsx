import { Inter, Instrument_Serif } from 'next/font/google'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'
import { Nav, type NavRoute } from './components/Nav'
import { Footer } from './components/Footer'
import { getGlobal, getVenturesCount } from './lib/content'
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
  const [settings, venturesCount] = await Promise.all([
    getGlobal('site-settings'),
    getVenturesCount(),
  ])

  // Work before About: the studio is the proof, the story comes second.
  // Routes with nothing behind them yet stay out rather than leading somewhere
  // empty, and appear on their own once there is content.
  const routes: NavRoute[] = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    ...(venturesCount > 0 ? [{ href: '/ventures', label: 'Ventures' }] : []),
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
