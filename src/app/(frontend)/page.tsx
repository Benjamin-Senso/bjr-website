import { getPayload } from 'payload'
import config from '@payload-config'
import './styles.css'
import { Hero } from './components/Hero'
import { Socials } from './components/Socials'
import { LinkTabs } from './components/LinkTabs'
import { Footer } from './components/Footer'

// Content is editable in the CMS, so always render fresh on request.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home' })

  return (
    <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-md flex-col items-center px-6 py-16 sm:py-20">
      <Hero name={home.name} bio={home.bio} profileImage={home.profileImage} />
      <Socials socials={home.socials} />
      <LinkTabs groups={home.linkGroups ?? []} />
      <div className="flex-1" />
      <Footer text={home.footerText} />
    </main>
  )
}
