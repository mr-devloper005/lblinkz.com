import type { Metadata } from 'next'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchHomeTaskFeed, fetchHomeTimeSections, type HomeTimeSection } from '@/lib/task-data'
import { pagesContent } from '@/editable/content/pages.content'
import type { SitePost } from '@/lib/site-connector'
import {
  EditableHomeCta,
  EditableHomeHero,
  EditableIntroBand,
  EditableFeaturedShelf,
  EditableFeatureShowcase,
  EditableStatsBand,
  EditableProcessSteps,
  EditableAdjacentReading,
} from '@/editable/sections/HomeSections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: pagesContent.home.metadata.title,
    description: pagesContent.home.metadata.description,
    openGraphTitle: pagesContent.home.metadata.openGraphTitle,
    openGraphDescription: pagesContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...pagesContent.home.metadata.keywords],
  })
}

type TaskFeedItem = { task: (typeof SITE_CONFIG.tasks)[number]; posts: SitePost[] }

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

// Public feed is anchored to the Reference Library (pdf task). Profiles are
// deliberately never surfaced as home cards.
export default async function HomePage() {
  const primaryTask: TaskKey =
    (SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf')?.key as TaskKey) ||
    ((SITE_CONFIG.tasks.find((task) => task.enabled && task.key !== 'profile')?.key || 'article') as TaskKey)
  const primaryRoute = SITE_CONFIG.taskViews[primaryTask] || `/${primaryTask}`
  const taskFeed: TaskFeedItem[] = await fetchHomeTaskFeed(12, { timeoutMs: 2500 })
  const primaryPosts = uniquePosts(
    taskFeed.find(({ task }) => task.key === primaryTask)?.posts ||
      taskFeed.filter(({ task }) => task.key !== 'profile').flatMap(({ posts }) => posts)
  ).slice(0, 24)
  const timeSections: HomeTimeSection[] = await fetchHomeTimeSections(primaryTask, { limit: 8, timeoutMs: 2500 })
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')

  const props = { primaryTask, primaryRoute, posts: primaryPosts, timeSections }

  return (
    <EditableSiteShell>
      <main>
        <SchemaJsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }}
        />
        <EditableHomeHero {...props} />
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-6 sm:px-8 lg:px-10">
          <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel eager className="mx-auto w-full" />
        </div>
        <EditableIntroBand />
        <EditableFeaturedShelf {...props} />
        <EditableFeatureShowcase {...props} />
        <EditableStatsBand {...props} />
        <EditableProcessSteps />
        <EditableAdjacentReading {...props} />
        <EditableHomeCta />
      </main>
    </EditableSiteShell>
  )
}
