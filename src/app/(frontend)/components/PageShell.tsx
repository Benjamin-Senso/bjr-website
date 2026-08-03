import React from 'react'

/**
 * Shared page container. The home page stays linktree-narrow; the content
 * routes run wider so their cards do not feel cramped.
 */
export function PageShell({
  children,
  width = 'wide',
}: {
  children: React.ReactNode
  width?: 'narrow' | 'home' | 'wide' | 'grid'
}) {
  const max =
    width === 'narrow'
      ? 'max-w-md items-center'
      : width === 'home'
        ? 'max-w-lg items-center' // hero stays centred, panels get a little more room
      : width === 'grid'
        ? 'max-w-4xl' // room for a two-column panel grid
        : 'max-w-2xl'

  return (
    <main
      className={
        // Generous top padding: the sticky nav sits directly above, and the
        // content needs room to breathe under it.
        'relative z-10 mx-auto flex min-h-svh w-full flex-col px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 ' +
        max
      }
    >
      {children}
    </main>
  )
}
