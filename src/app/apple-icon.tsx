import { ImageResponse } from 'next/og'

// iOS uses this when someone adds the site to their home screen. Without it
// they get a blurry screenshot of the page instead of a mark.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          color: '#9B8BC8',
          fontSize: 84,
          fontFamily: 'Georgia, serif',
        }}
      >
        BR
      </div>
    ),
    size,
  )
}
