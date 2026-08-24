import { ImageResponse } from 'next/og'
import { getArticle } from '../../lib/content'

/**
 * Auto-generated share image for each article.
 *
 * Writing a piece should not also require sourcing a photograph. This renders
 * the title on the site's own palette and display face, so every article has a
 * share card that looks deliberate the moment it is published. Uploading a
 * cover image in the CMS overrides it.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Benjamin Rutter'

/**
 * The image runtime has no access to the site's webfonts, so the display face
 * is fetched as a binary. Returns null on any failure: an off-brand card is a
 * far better outcome than a broken image, and share cards are not worth
 * failing a page render over.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 86400 } },
    ).then((r) => r.text())

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1]
    if (!url) return null

    return await fetch(url, { next: { revalidate: 86400 } }).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [article, font] = await Promise.all([getArticle(slug), loadDisplayFont()])
  const title = article?.title ?? 'Benjamin Rutter'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#000000',
          // Two blooms rather than one: Satori renders radial gradients weakly,
          // so a single soft one reads as almost black at this size.
          backgroundImage:
            'radial-gradient(900px circle at 15% -10%, rgba(155,139,200,0.55), rgba(0,0,0,0) 60%),' +
            'radial-gradient(700px circle at 85% 110%, rgba(155,139,200,0.28), rgba(0,0,0,0) 60%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#9B8BC8' }} />
          <div style={{ color: '#9B8BC8', fontSize: 22, letterSpacing: 4 }}>JOURNAL</div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#ededed',
            fontSize: title.length > 70 ? 60 : 72,
            lineHeight: 1.12,
            maxWidth: 1000,
            ...(font ? { fontFamily: 'Instrument Serif' } : {}),
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', color: '#8a8a8a', fontSize: 24 }}>benjaminrutter.com</div>
      </div>
    ),
    {
      ...size,
      ...(font
        ? { fonts: [{ name: 'Instrument Serif', data: font, style: 'normal', weight: 400 }] }
        : {}),
    },
  )
}
