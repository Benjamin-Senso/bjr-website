/**
 * Builds a minimal Lexical document from plain paragraphs, so richText fields
 * can ship a real defaultValue instead of starting empty.
 */
export const lexicalParagraphs = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      textStyle: '',
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          mode: 'normal' as const,
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})
