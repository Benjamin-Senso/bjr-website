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
  {
    slug: 'signet',
    name: 'Signet',
    type: 'venture' as const,
    role: 'Founder',
    status: 'building' as const,
    url: 'https://withsignet.co',
    order: 1,
    description:
      'E-signing for founders and small teams. Contracts, proposals and NDAs, signed without the other side needing an account.',
    body: lexicalDoc([
      { heading: 'What it is' },
      {
        text: 'Signet is an e-signing product for founders and small teams. Contracts, proposals and NDAs go out for signature and come back sealed with a verifiable record, and the person signing never has to create an account.',
      },
      {
        text: 'That last part is the point. Most e-signing tools ask your client to sign up for something before they can sign anything, which puts a login screen between you and a closed deal. With Signet the link is the session. They click, they sign, it is done.',
      },
      { heading: 'What they do' },
      {
        text: 'Templates are designed rather than generic, so what lands in someone\u2019s inbox looks like it came from you rather than from a form builder. Every completed document carries a tamper-evident seal, a certificate of completion delivered to all parties, and an audit trail where each event is immutable. It is aligned with eIDAS and ESIGN, with data residency in the UK and EU.',
      },
      {
        text: 'The product is built around the paperwork small businesses actually push through: sales contracts, proposals and scopes of work, NDAs, master service agreements, offer letters, client onboarding. Some sectors carry their own version of that. Waste and recycling has transfer notes. Construction has RAMS and sign-offs. Facilities management has permits. Those are not edge cases to the people who send them every day.',
      },
      {
        text: 'Plenty is still being built. Approvals before a document sends, sequential and parallel routing, client spaces, renewal reminders, multi-entity branding, webhooks. Signet is early and does not pretend otherwise.',
      },
      { heading: 'What I did' },
      {
        text: 'Signet came out of a problem I had rather than a market I spotted. Running a studio across two entities means a constant stream of proposals, engagement letters and NDAs, and every tool I tried treated the signing experience as an afterthought. The client got a generic email, a login wall, and a PDF that looked nothing like the brand that sent it.',
      },
      {
        text: 'So the brief was narrow. Make signing feel like part of the brand rather than a detour away from it, and make the proof genuinely provable rather than a claim in a footer. Those two pull against each other. Tamper-evidence tends to arrive wrapped in the ugliest interface in the business, and design-led tools tend to be vague about what they can actually stand behind.',
      },
      {
        text: 'What I do here is what I do at the studio, applied to my own product: positioning, brand and product, and the commercial side underneath it. The difference is that there is no client to hand it to at the end.',
      },
    ]) as WorkItem['body'],
  },
  {
    slug: 'mandem-meetup',
    name: 'Mandem Meetup',
    type: 'involvement' as const,
    role: 'Partner',
    status: 'active' as const,
    // The rebuilt site, launching this week. Swap to the apex once it is live.
    url: 'https://dev.mandemmeetup.org',
    order: 2,
    description:
      'A free grassroots community supporting men\u2019s mental health, running in Manchester and Wolverhampton.',
    body: lexicalDoc([
      { heading: 'What it is' },
      {
        text: 'Mandem Meetup is a free grassroots community supporting men\u2019s mental health, running in Manchester and Wolverhampton. Jamie Dennis started it after experiencing what it felt like to be properly heard for the first time. It began around a kitchen table and has grown into something supporting over a thousand men a year.',
      },
      {
        text: 'It is deliberately not therapy. Nobody there is claiming to fix anyone. The whole thing rests on a simpler idea: that most men do not need an intervention, they need somewhere to be honest without it becoming a thing.',
      },
      { heading: 'What they do' },
      {
        text: 'Everything is free to attend. Football, hiking, foraging, workouts, music and chess sit alongside the WhatsApp communities that keep it running between meetups. The activity is mostly a pretext. It is easier to say something real while you are walking or kicking a ball than sitting in a circle being asked how you feel.',
      },
      {
        text: 'Underneath that sits work most people never see. Safeguarding, a referral route for people who need more than a meetup can give, a quiet space for when the noise gets too much, and accessibility choices so the site works for whoever turns up to it. That infrastructure is what separates a community from a group chat.',
      },
      { heading: 'What I did' },
      {
        text: 'I came to it as someone who could help with the part Jamie should not have to think about. A grassroots organisation lives or dies on whether it can explain itself clearly to the people it serves, to partners and to funders, and that is squarely what I do.',
      },
      {
        text: 'The honest reason I am involved is narrower than any of that. Men are famously bad at asking for help and I am not an exception to it. Somewhere that lowers the cost of being honest is worth more than most things I could put my time into.',
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
