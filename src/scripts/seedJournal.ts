import { getPayload } from 'payload'
import config from '../payload.config'
import type { Article } from '../payload-types'
import { lexicalDoc } from '../globals/fields/lexical'

/**
 * Seeds journal articles as DRAFTS.
 *
 * Nothing here goes live on its own. Read each piece in the admin panel, edit
 * what is wrong, then flip Status to Published. Creates by slug and skips
 * anything that already exists, so re-running cannot overwrite your edits.
 *
 *   pnpm seed:journal
 *   pnpm seed:journal --force
 */

const force = process.argv.includes('--force')

const articles = [
  {
    slug: 'what-a-rebrand-actually-costs',
    title: 'What a rebrand actually costs a growth-stage company',
    excerpt:
      'The invoice is the smallest number involved. Here is what else it takes, and how to tell when you are too early to bother.',
    body: lexicalDoc([
      {
        text: 'Every founder who asks me about a rebrand asks about the fee first. It is the wrong question, and not because the fee does not matter. It is the wrong question because it is the one cost you can see, plan for and sign off. The costs that actually derail a rebrand are the ones nobody puts in the budget.',
      },
      { heading: 'The cost you can see' },
      {
        text: 'There is a real number and it varies enormously by scope. A positioning and identity project for a growth-stage company is not the same as a logo, and anyone quoting you the same figure for both is selling one and calling it the other. That part is straightforward and any decent studio will walk you through it.',
      },
      { heading: 'The cost nobody budgets' },
      {
        text: 'The expensive part is your own time. Not the workshops, which everyone expects. The decisions.',
      },
      {
        text: 'A rebrand forces a company to state what it is, who it is for, and what it will not do. Most growth-stage companies have never written that down, because they have been too busy growing to need it. The moment you try, you discover the founders disagree. Not violently, just enough that the answer has never been settled. That disagreement was survivable while it stayed implicit. A rebrand makes it explicit, and then someone has to resolve it.',
      },
      {
        text: 'Budget six weeks for that. Not six weeks of work, six weeks of elapsed time while decisions move between people who are all busy. It is the single most common reason projects run long, and it is almost never the studio.',
      },
      { heading: 'The cost after launch' },
      {
        text: 'A new brand is not finished when the identity is delivered. It has to be applied, and application is where most of the value is either realised or thrown away. Sales decks, proposals, the invoice template, the onboarding email, the way the team answers the phone. Every one of those is a place the new positioning either shows up or quietly does not.',
      },
      {
        text: 'Companies routinely spend well on the brand and nothing on the application, then conclude that branding does not work. What did not work was stopping halfway.',
      },
      { heading: 'When you are too early' },
      {
        text: 'You are too early if you cannot yet describe who your best customer is, or if you are still changing what you sell every quarter. A brand is a commitment. Committing to a position you are about to abandon is worse than looking generic for another year, because you will pay to undo it.',
      },
      {
        text: 'You are also too early if the business underneath cannot deliver what the brand would promise. If the positioning says premium and the invoicing, onboarding and support say otherwise, the rebrand does not fix the gap. It advertises it.',
      },
      { heading: 'When it is worth it' },
      {
        text: 'When you are consistently competing against companies several times your size and losing on perception rather than on substance. When good people turn down offers because they have never heard of you. When your own team describes what you do three different ways.',
      },
      {
        text: 'Those are brand problems, and they cost more every quarter you leave them. That is the calculation worth doing, not the one about the fee.',
      },
    ]),
  },
  {
    slug: 'why-the-rebrand-did-not-move-revenue',
    title: 'Why the rebrand did not move revenue',
    excerpt:
      'Usually the brand was fine. What broke was everything the brand promised and the business could not deliver.',
    body: lexicalDoc([
      {
        text: 'A company spends properly on a rebrand. The work is good, the team is pleased, the launch goes well. Six months later revenue looks the same and someone concludes that branding is expensive decoration.',
      },
      {
        text: 'I have seen this from the inside often enough to be confident about the cause. It is rarely the brand.',
      },
      { heading: 'The promise and the machine' },
      {
        text: 'A brand is a promise about what it is like to work with you. Good positioning makes that promise specific and slightly ambitious, because a promise you already comfortably keep is not doing any work.',
      },
      {
        text: 'The problem is that everything after the promise is operational. The speed of the reply, the clarity of the proposal, whether the invoice looks like it came from the same company as the website, whether the thing arrives when you said it would. A customer experiences the promise entirely through those, and not at all through the brand guidelines.',
      },
      {
        text: 'So when a new brand says premium and the operations still say scrappy, the gap does not close. It widens, because expectations went up and delivery did not.',
      },
      { heading: 'What that looks like in practice' },
      {
        text: 'The website says enterprise-ready and the contract is a Word document with the previous client’s name still in it. The positioning says considered and the proposal arrives in eleven days. The identity is beautiful and the invoice is a template nobody has looked at since 2019.',
      },
      {
        text: 'Every one of those is a moment where a customer quietly revises their estimate of you, and none of them are fixed by design.',
      },
      { heading: 'Why studios rarely say this' },
      {
        text: 'Because it is not their scope, and because it sounds like an excuse. A studio that delivers identity has no remit over your finance process, and raising it can look like pre-emptively blaming the client for a result that has not happened yet.',
      },
      {
        text: 'It is still true. Most brand people cannot build systems and most operations people cannot build brand, so the gap between them tends to belong to nobody.',
      },
      { heading: 'What to do about it' },
      {
        text: 'Before the rebrand, list every point where a customer touches your company. Not the marketing ones, all of them. First reply, proposal, contract, invoice, onboarding, support, renewal.',
      },
      {
        text: 'Then ask, honestly, which of those would embarrass you if a prospect judged you entirely on it. Fix the worst two before you launch anything. They are usually cheap, usually operational, and they will do more for revenue than another round on the logo.',
      },
      {
        text: 'The brand tells people what to expect. The machine decides whether they get it. Fund both or the first one is just an expensive claim.',
      },
    ]),
  },
]

try {
  const payload = await getPayload({ config })

  for (const article of articles) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })

    const found = existing.docs[0]
    // Always seeded as a draft. Publishing is a deliberate act in the admin.
    const data = { ...article, status: 'draft' as const, body: article.body as Article['body'] }

    if (found && !force) {
      console.info(`[seed] "${article.title}" already exists, skipping.`)
      continue
    }

    if (found) {
      await payload.update({ collection: 'articles', id: found.id, data })
      console.info(`[seed] Replaced "${article.title}"`)
      continue
    }

    await payload.create({ collection: 'articles', data })
    console.info(`[seed] Created draft "${article.title}"`)
  }

  console.info('[seed] Done. All drafts. Review in the admin, then set Status to Published.')
  process.exit(0)
} catch (err) {
  console.error('[seed] Failed:', err)
  process.exit(1)
}
