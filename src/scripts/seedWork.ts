import { getPayload } from 'payload'
import config from '../payload.config'
import type { WorkItem } from '../payload-types'
import { lexicalDoc } from '../globals/fields/lexical'

/**
 * Seeds work items that were written outside the CMS.
 *
 * Creates by slug and SKIPS anything that already exists, so running it twice
 * cannot overwrite an edit made in the admin panel. Pass --force to replace an
 * existing entry deliberately.
 *
 *   pnpm seed:work
 *   pnpm seed:work --force
 */

const force = process.argv.includes('--force')

const items = [
  {
    slug: 'senso',
    name: 'Senso',
    type: 'company' as const,
    role: 'Founder',
    status: 'active' as const,
    url: 'https://sensostudio.co',
    order: 0,
    description:
      'A brand, product and venture studio working with internet-first companies across the UK, EU and MENA.',
    // The helper builds a valid Lexical document, but its inferred shape is
    // looser than the generated field type, so it is asserted once here.
    body: lexicalDoc([
      { heading: 'What it is' },
      {
        text: 'Senso is a brand, product and venture studio. It works with internet-first, growth-stage companies across the UK, EU and MENA, and it runs across two entities, one UK and one UAE.',
      },
      {
        text: 'It exists because of a gap I kept running into. Plenty of studios can make a company look good. Fewer can make it work. The brand lands, the site goes live, and then the business underneath it cannot deliver on the promise the brand just made. The positioning says premium and the invoicing says otherwise. That gap is where most of the damage happens, and almost nobody was treating it as one problem.',
      },
      { heading: 'What they do' },
      {
        text: 'The visible work is positioning, identity and product. Specifically, the kind that lets a young company hold its own against businesses several times its size. A growth-stage company is usually competing above its weight before it has the headcount or the history to justify it, and brand is how that gap gets closed. Done properly, a two-year-old company reads as though it has been around for ten.',
      },
      {
        text: 'Behind that sits the operational side. Finance, automation, delivery, and the systems a small team needs to move quickly without dropping things. It is less glamorous and it matters more. A studio that ships beautiful work and cannot forecast its own cash is one bad quarter from disappearing, and the same is true of the companies we work with.',
      },
      {
        text: 'Senso also builds and backs companies of its own, through its Ember partnerships and a growing DTC arm. That is partly appetite and partly discipline. Running your own ventures keeps you honest about what advice actually costs to implement.',
      },
      { heading: 'What I did' },
      { text: 'I founded it and I run it, and that means both halves of it.' },
      {
        text: "I picked up Adobe's design tools at eight and never really put them down. What kept me going was never one industry, it was the range. Getting inside very different sectors, learning how each one actually works, and noticing that the problems rhyme more than anyone admits. A challenger drinks brand and a fintech have far more in common than either would like to hear.",
      },
      {
        text: 'Senso is where that turned into a business rather than a habit. The client-facing side is strategy, brand and product. The other side is the machine: how work is priced and won, how projects are delivered, how money moves, what gets automated and what deliberately does not. I built that with the same care as anything a client sees, because it is the thing that decides whether the client work is any good.',
      },
      {
        text: 'Running it across two jurisdictions kept that honest. It is one thing to have a process. It is another to have one that survives two tax years, two currencies and two sets of rules. Most operational theory does not survive contact with a second country.',
      },
      {
        text: 'The result is a studio that can do the creative work and the commercial work, and an operator who has done both rather than read about them.',
      },
    ]) as WorkItem['body'],
  },
]

// Top-level await, not a floating promise: `payload run` executes the module
// and exits without waiting for one, so the seed silently did nothing.
try {
  const payload = await getPayload({ config })

  for (const item of items) {
    const existing = await payload.find({
      collection: 'work-items',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    const found = existing.docs[0]

    if (found && !force) {
      console.info(`[seed] "${item.name}" already exists, skipping. Use --force to replace.`)
      continue
    }

    if (found) {
      await payload.update({ collection: 'work-items', id: found.id, data: item })
      console.info(`[seed] Replaced "${item.name}"`)
      continue
    }

    await payload.create({ collection: 'work-items', data: item })
    console.info(`[seed] Created "${item.name}"`)
  }

  console.info('[seed] Done. Add cover images in the admin panel.')
  process.exit(0)
} catch (err) {
  console.error('[seed] Failed:', err)
  process.exit(1)
}
