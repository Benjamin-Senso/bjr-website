export function Footer({ text }: { text?: string | null }) {
  return (
    <footer className="text-muted relative z-10 flex flex-col items-center gap-4 pb-10 text-center text-sm">
      {text ? <p>{text}</p> : null}

      <a
        href="https://sensostudio.co"
        target="_blank"
        rel="noreferrer noopener"
        className="liquid-glass hover:text-foreground group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors"
      >
        <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        Crafted by Senso
        <span aria-hidden="true" className="group-hover:text-accent transition-colors">
          ↗
        </span>
      </a>
    </footer>
  )
}
