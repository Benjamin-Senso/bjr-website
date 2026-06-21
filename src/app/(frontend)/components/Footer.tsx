export function Footer({ text }: { text?: string | null }) {
  if (!text) return null

  return (
    <footer className="text-muted mt-16 text-center text-sm">
      <p>{text}</p>
    </footer>
  )
}
