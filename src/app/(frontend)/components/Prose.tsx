import React from 'react'

/**
 * Typography for Lexical richText output.
 *
 * Sits in its own glass panel: long body copy read directly against the aurora
 * is hard work, and the backdrop blur gives the text a settled surface without
 * introducing a second visual language.
 *
 * Spacing targets the elements themselves rather than this element's direct
 * children, because RichText renders its own wrapper in between. Headings use
 * a larger top margin than bottom so each section binds to the text under it
 * rather than floating between two blocks.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="liquid-glass rounded-2xl p-6 sm:p-8">
      <div
        className={[
          'text-foreground/90 leading-relaxed',
          // Paragraphs
          '[&_p+p]:mt-4',
          // Headings
          '[&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-normal',
          '[&_h3]:font-display [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-normal',
          // First heading should not push away from the panel's top padding
          '[&>*>*:first-child]:mt-0',
          // Links
          '[&_a]:text-accent [&_a:hover]:text-accent-hover [&_a]:underline [&_a]:underline-offset-2',
          // Lists
          '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
          '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_li+li]:mt-1.5',
          // Emphasis
          '[&_strong]:text-foreground [&_strong]:font-medium',
          // Quotes and rules
          '[&_blockquote]:border-accent/40 [&_blockquote]:text-muted [&_blockquote]:my-6 [&_blockquote]:border-l [&_blockquote]:pl-4 [&_blockquote]:italic',
          '[&_hr]:my-8 [&_hr]:border-white/10',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
