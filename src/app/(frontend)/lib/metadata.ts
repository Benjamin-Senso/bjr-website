import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { resolveMedia } from './media'

type PageSeo = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: unknown
}

/**
 * Builds per-route metadata, falling back to Site Settings for anything the
 * page leaves blank. metadataBase comes from NEXT_PUBLIC_SERVER_URL so the
 * OG image URLs resolve absolute, which social scrapers require.
 */
export async function buildMetadata(page: PageSeo, fallbackTitle: string): Promise<Metadata> {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const base = page.metaTitle || fallbackTitle
  const suffix = settings?.metaTitleSuffix
  // No em dashes anywhere in user-facing copy (house style).
  const title = suffix && base !== suffix ? `${base} · ${suffix}` : base

  const description = page.metaDescription || settings?.metaDescription || undefined

  const image =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolveMedia(page.ogImage as any)?.url ?? resolveMedia(settings?.ogImage)?.url ?? undefined

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
