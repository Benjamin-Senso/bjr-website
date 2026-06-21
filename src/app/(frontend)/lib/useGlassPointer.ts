'use client'

import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/**
 * Drives the pointer-reactive specular highlight on `.liquid-glass` elements.
 * Sets --mx / --my (cursor position) and --glow (intensity) on the element so
 * the CSS ::before highlight tracks the pointer. Returns a ref + handlers to
 * spread onto the glass element.
 */
export function useGlassPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  const onPointerMove = useCallback((e: ReactPointerEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
    el.style.setProperty('--glow', '1')
  }, [])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    // Ease back to the resting top sheen.
    el.style.setProperty('--glow', '0.5')
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '0%')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
