import React from 'react'

/**
 * Typography wrapper for Lexical richText output.
 *
 * Sits in its own glass panel: long body copy read directly against the aurora
 * is hard work, and the backdrop blur gives the text a settled surface without
 * introducing a second visual language.
 *
 * Spacing targets the paragraphs themselves rather than this element's direct
 * children, because RichText renders its own wrapper in between.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="liquid-glass rounded-2xl p-6 sm:p-8">
      <div className="text-foreground/90 [&_a]:text-accent [&_a:hover]:text-accent-hover [&_h2]:font-display leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_li+li]:mt-1 [&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  )
}
