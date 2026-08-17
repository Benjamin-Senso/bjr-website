import type { Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'
import { Nav, type NavRoute } from './components/Nav'
import { Footer } from './components/Footer'
import { JsonLd } from './components/JsonLd'
import { ConsentDefaults } from './components/ConsentDefaults'
import { ConsentBanner } from './components/ConsentBanner'
import { GoogleTagManager } from '@next/third-parties/google'
import { getArticles, getGlobal } from './lib/content'
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

/**
 * viewportFit 'cover' lets the page paint into the notch and home-indicator
 * areas; the safe-area insets in styles.css then keep content clear of them.
 * Without it iOS letterboxes the page and the inset variables all read 0.
 */
export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, articles] = await Promise.all([getGlobal('site-settings'), getArticles()])

  // Work before About: the studio is the proof, the story comes second.
  const routes: NavRoute[] = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    // Writing appears once there is something to read, from either source.
    ...(articles.length || isBeehiivConfigured() ? [{ href: '/writing', label: 'Writing' }] : []),
  ]

  // Read at request time rather than baked in at build: a plain env var keeps
  // the container ID swappable per environment without a rebuild.
  const gtmId = process.env.GTM_ID

  return (
    <html lang="en-GB" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        {/* Inside body, not a direct child of <html>: a script there is invalid
            HTML and triggers a hydration mismatch. Next hoists the
            beforeInteractive consent defaults into <head> regardless, so they
            still run before the container's afterInteractive load. */}
        <ConsentDefaults />
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}

        {/* Emitted once with stable @ids so per-page schema can reference these
            entities instead of repeating them. */}
        <JsonLd data={[personSchema(settings), websiteSchema(settings)]} />
        <GlassFilter />
        <AuroraBackdrop />
        <Nav routes={routes} cta={{ href: '/contact', label: 'Contact' }} />
        {children}
        <Footer text={settings?.footerText} />
        {gtmId ? <ConsentBanner /> : null}
      </body>
    </html>
  )
}
