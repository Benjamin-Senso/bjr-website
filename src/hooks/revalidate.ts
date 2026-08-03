/**
 * Drops the cached content the moment an editor saves.
 *
 * next/cache is imported lazily and failures are swallowed on purpose: these
 * same configs are loaded by the `payload migrate` CLI, which runs outside the
 * Next server where revalidateTag has no request context to act on.
 */
async function revalidate(tag: string) {
  try {
    const { revalidateTag } = await import('next/cache')
    // Next 16 requires a cache profile alongside the tag. 'max' matches the
    // reads in lib/content.ts, which are held until something invalidates them.
    revalidateTag(tag, 'max')
  } catch {
    // Running outside the Next server (e.g. the migrate CLI). Nothing to drop.
  }
}

export const revalidateGlobal = (slug: string) => async () => {
  await revalidate(`global:${slug}`)
}

export const revalidateWorkItems = async () => {
  await revalidate('collection:work-items')
}
