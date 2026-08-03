import { Inter, Instrument_Serif } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'

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
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <GlassFilter />
        <AuroraBackdrop />
        <Nav />
        {children}
        <Footer text={settings?.footerText} />
      </body>
    </html>
  )
}
