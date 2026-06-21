import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import './styles.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { GlassFilter } from './components/GlassFilter'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home' })

  const title = home?.metaTitle || home?.name || 'Benjamin Rutter'
  const description = home?.metaDescription || home?.bio || undefined
  const ogImage =
    home?.ogImage && typeof home.ogImage === 'object' ? home.ogImage.url : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <GlassFilter />
        <AuroraBackdrop />
        {children}
      </body>
    </html>
  )
}
