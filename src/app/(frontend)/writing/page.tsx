import { PageShell } from '../components/PageShell'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { SubscribeForm } from '../components/SubscribeForm'
import { getPosts, isBeehiivConfigured } from '@/lib/beehiiv'
import { getGlobal } from '../lib/content'
import { buildMetadata } from '../lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const writing = await getGlobal('writing')
  return buildMetadata(writing, 'Writing')
}

export default async function WritingPage() {
  const writing = await getGlobal('writing')
  const posts = await getPosts(writing.postLimit ?? 10)

  return (
    <PageShell>
      <PageHeader heading={writing.heading} intro={writing.intro} />

      {posts.length ? (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center text-sm">
          {isBeehiivConfigured()
            ? 'No posts published yet.'
            : 'Posts will appear here once the newsletter is connected.'}
        </p>
      )}

      {writing.showSubscribe ? (
        <SubscribeForm heading={writing.subscribeHeading} blurb={writing.subscribeBlurb} />
      ) : null}
    </PageShell>
  )
}
