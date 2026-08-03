import type { Metadata } from 'next'
import { getGlobal } from './content'
import { resolveMedia } from './media'

type PageSeo = {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  ogImage?: unknown
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
}

const splitKeywords = (value?: string | null) =>
  value
    ?.split(',')
    .map((k) => k.trim())
    .filter(Boolean) ?? []

/**
 * Builds per-route metadata, falling back to Site Settings for anything the
 * page leaves blank. metadataBase comes from NEXT_PUBLIC_SERVER_URL so the
 * OG image URLs resolve absolute, which social scrapers require.
 */
export async function buildMetadata(
  page: PageSeo,
  fallbackTitle: string,
  path = '/',
): Promise<Metadata> {
  const settings = await getGlobal('site-settings')

  const base = page.metaTitle || fallbackTitle
  const suffix = settings?.metaTitleSuffix
  // No em dashes anywhere in user-facing copy (house style).
  const title = suffix && base !== suffix ? `${base} · ${suffix}` : base

  const description = page.metaDescription || settings?.metaDescription || undefined

  const image =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolveMedia(page.ogImage as any)?.url ?? resolveMedia(settings?.ogImage)?.url ?? undefined

  const keywords = [...splitKeywords(page.keywords), ...splitKeywords(settings?.keywords)]
  const url = `${siteUrl()}${path === '/' ? '' : path}`

  return {
    metadataBase: new URL(siteUrl()),
    title,
    description,
    keywords: keywords.length ? Array.from(new Set(keywords)) : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: settings?.name || 'Benjamin Rutter',
      locale: 'en_GB',
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}
