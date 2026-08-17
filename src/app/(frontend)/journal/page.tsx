import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { ArticleCard } from '../components/ArticleCard'
import { PostCard } from '../components/PostCard'
import { SubscribeForm } from '../components/SubscribeForm'
import { JsonLd } from '../components/JsonLd'
import { getPosts, isBeehiivConfigured } from '@/lib/beehiiv'
import { getGlobal, getArticles } from '../lib/content'
import { buildMetadata } from '../lib/metadata'
import { breadcrumbSchema, journalCollectionSchema } from '../lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const journal = await getGlobal('writing')
  return buildMetadata(journal, 'Journal', '/journal')
}

export default async function WritingPage() {
  const [journal, articles] = await Promise.all([getGlobal('writing'), getArticles()])
  // Newsletter issues live on beehiiv's domain, so they sit below the pieces
  // written here rather than competing with them.
  const posts = await getPosts(journal.postLimit ?? 10)

  return (
    <PageShell>
      <JsonLd
        data={[
          journalCollectionSchema(articles, journal.heading, journal.intro ?? undefined),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: journal.heading, path: '/journal' },
          ]),
        ]}
      />

      <PageHeader heading={journal.heading} intro={journal.intro} />

      {articles.length ? (
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center text-sm">Nothing published yet.</p>
      )}

      {posts.length ? (
        <section className="mt-14">
          <h2 className="text-muted mb-3 text-xs tracking-[0.12em] uppercase">
            From the newsletter
          </h2>
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {journal.showSubscribe && isBeehiivConfigured() ? (
        <SubscribeForm heading={journal.subscribeHeading} blurb={journal.subscribeBlurb} />
      ) : null}
    </PageShell>
  )
}
