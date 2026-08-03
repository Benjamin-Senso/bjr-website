/**
 * Builders for Lexical documents, so richText fields can ship a real
 * defaultValue instead of starting empty.
 *
 * Note: pass these as a function default (`defaultValue: () => ...`). A static
 * value is baked into the column DDL, where apostrophes in the JSON break the
 * generated SQL.
 */

type Block = { heading: string } | { text: string }

const textNode = (text: string) => ({
  type: 'text',
  text,
  format: 0,
  style: '',
  mode: 'normal' as const,
  detail: 0,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  textStyle: '',
  children: [textNode(text)],
})

const heading = (text: string) => ({
  type: 'heading',
  tag: 'h2',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [textNode(text)],
})

const root = (children: unknown[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
})

/** Plain paragraphs. */
export const lexicalParagraphs = (paragraphs: string[]) => root(paragraphs.map(paragraph))

/** Mixed headings and paragraphs, for scaffolding a longer write-up. */
export const lexicalDoc = (blocks: Block[]) =>
  root(blocks.map((b) => ('heading' in b ? heading(b.heading) : paragraph(b.text))))
