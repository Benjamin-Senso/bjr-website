export function Footer({ text }: { text?: string | null }) {
  if (!text) return null

  return (
    <footer className="text-muted relative z-10 pb-10 text-center text-sm">
      <p>{text}</p>
    </footer>
  )
}
