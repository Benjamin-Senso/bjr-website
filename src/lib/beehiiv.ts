/**
 * Minimal beehiiv v2 API client.
 *
 * Both env vars are optional: with them unset the writing page still renders,
 * just with an empty state, so the site never hard-fails on a missing key.
 *
 * Docs: https://developers.beehiiv.com/api-reference
 */

const API_BASE = 'https://api.beehiiv.com/v2'

export type BeehiivPost = {
  id: string
  title: string
  subtitle?: string
  webUrl: string
  thumbnailUrl?: string
  publishedAt?: string
}

type RawPost = {
  id: string
  title?: string
  subtitle?: string
  web_url?: string
  thumbnail_url?: string
  publish_date?: number | string
  status?: string
}

export function isBeehiivConfigured(): boolean {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID)
}

function credentials() {
  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !publicationId) return null
  return { apiKey, publicationId }
}

/** beehiiv returns publish_date as a unix timestamp (seconds). */
function toIsoDate(value: RawPost['publish_date']): string | undefined {
  if (value === undefined || value === null) return undefined
  const seconds = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(seconds)) return undefined
  return new Date(seconds * 1000).toISOString()
}

/**
 * Fetch published posts, newest first. Returns [] on any failure — a flaky
 * newsletter API should degrade the page, not 500 it.
 */
export async function getPosts(limit = 10): Promise<BeehiivPost[]> {
  const creds = credentials()
  if (!creds) return []

  const url = new URL(`${API_BASE}/publications/${creds.publicationId}/posts`)
  url.searchParams.set('status', 'confirmed')
  url.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 50)))
  url.searchParams.set('order_by', 'publish_date')
  url.searchParams.set('direction', 'desc')

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${creds.apiKey}` },
      // Posts change rarely; revalidate rather than hitting the API per request.
      next: { revalidate: 600 },
    })

    if (!res.ok) {
      console.error(`beehiiv: posts request failed (${res.status})`)
      return []
    }

    const json = (await res.json()) as { data?: RawPost[] }
    return (json.data ?? [])
      .filter((post) => post.web_url)
      .map((post) => ({
        id: post.id,
        title: post.title || 'Untitled',
        subtitle: post.subtitle || undefined,
        webUrl: post.web_url as string,
        thumbnailUrl: post.thumbnail_url || undefined,
        publishedAt: toIsoDate(post.publish_date),
      }))
  } catch (err) {
    console.error('beehiiv: posts request threw', err)
    return []
  }
}

export type SubscribeResult = { ok: true } | { ok: false; error: string }

/** Create a subscription. Called server-side only — the API key never ships to the client. */
export async function subscribe(email: string): Promise<SubscribeResult> {
  const creds = credentials()
  if (!creds) return { ok: false, error: 'Newsletter is not configured yet.' }

  try {
    const res = await fetch(`${API_BASE}/publications/${creds.publicationId}/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'website',
      }),
    })

    if (!res.ok) {
      console.error(`beehiiv: subscribe failed (${res.status})`)
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }

    return { ok: true }
  } catch (err) {
    console.error('beehiiv: subscribe threw', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
