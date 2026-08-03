import React from 'react'

/** Shared typography wrapper for Lexical richText output. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    // RichText renders its own wrapper element, so spacing has to target the
    // paragraphs themselves rather than this div's direct children.
    <div className="text-foreground/90 [&_a]:text-accent [&_a:hover]:text-accent-hover [&_h2]:font-display leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_li+li]:mt-1 [&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  )
}
