export function PageHeader({ heading, intro }: { heading: string; intro?: string | null }) {
  return (
    <header className="mb-10 text-center">
      <h1 className="font-display text-4xl font-normal sm:text-5xl">{heading}</h1>
      {intro ? (
        <p className="text-muted mx-auto mt-3 max-w-prose leading-relaxed text-balance">{intro}</p>
      ) : null}
    </header>
  )
}
