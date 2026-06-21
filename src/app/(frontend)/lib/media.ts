import type { Media } from '@/payload-types'

export type ResolvedMedia = {
  url: string
  alt: string
  width?: number
  height?: number
}

/**
 * Upload fields come back as either a numeric ID (not populated), a full Media
 * object, or null. This normalises that to a simple shape the UI can use, or
 * null when there is no usable image.
 */
export function resolveMedia(value?: (number | null) | Media): ResolvedMedia | null {
  if (!value || typeof value !== 'object' || !value.url) return null
  return {
    url: value.url,
    alt: value.alt ?? '',
    width: value.width ?? undefined,
    height: value.height ?? undefined,
  }
}
