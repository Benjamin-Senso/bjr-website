import Script from 'next/script'

export const CONSENT_KEY = 'bjr-consent'

/**
 * Google Consent Mode v2 defaults.
 *
 * Must run BEFORE the GTM container, or tags fire once with no consent signal
 * and set cookies regardless. `beforeInteractive` guarantees that ordering
 * against the container's `afterInteractive`.
 *
 * Everything measurement-related starts denied, so a first-time visitor is
 * tracked only after they accept. A stored acceptance is replayed here rather
 * than in the banner, because the banner is a client component that mounts
 * after hydration, which would leave a window where consent was granted but
 * not yet signalled.
 *
 * wait_for_update gives that replay a moment to land before tags decide.
 */
export function ConsentDefaults() {
  return (
    <Script id="consent-defaults" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });
        try {
          if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
            gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted'
            });
          }
        } catch (e) {}
      `}
    </Script>
  )
}
