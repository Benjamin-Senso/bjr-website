/**
 * Renders a JSON-LD block. Kept as a single component so every schema on the
 * site is serialised the same way.
 *
 * The `<` escape prevents a string inside the data from closing the script tag
 * early, which would let CMS content inject markup into the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
