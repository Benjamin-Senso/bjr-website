export function Footer({ text }: { text?: string | null }) {
  return (
    <footer className="text-muted relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 pb-10 text-sm sm:flex-row sm:justify-between">
      <p>{text}</p>

      <a
        href="https://sensostudio.co"
        target="_blank"
        rel="noreferrer noopener"
        className="liquid-glass hover:text-foreground hover-tint group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
      >
        <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        Crafted by Senso
        <span aria-hidden="true" className="group-hover:text-accent hover-arrow hover-arrow-diagonal">
          ↗
        </span>
      </a>
    </footer>
  )
}
