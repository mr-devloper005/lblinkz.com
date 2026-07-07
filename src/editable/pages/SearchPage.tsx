import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, FileText, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Public search must not surface profiles.
  if (derivedTask === 'profile') return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultRow({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const summary = summaryOf(post)
  // Public label: never render "Profile".
  const label = task === 'pdf' ? 'Reference document' : SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Entry'

  return (
    <Link href={href} className="group grid gap-6 border-t border-[var(--editable-border)] py-8 md:grid-cols-[70px_1fr_180px_auto] md:items-center">
      <p className="editable-display text-2xl leading-none tracking-[-0.01em] text-[var(--slot4-accent)]">
        {String(index + 1).padStart(2, '0')}
      </p>
      <div className="min-w-0">
        <h2 className="editable-display line-clamp-2 text-[1.35rem] leading-[1.25] tracking-[-0.01em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h2>
        {summary ? <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{stripHtml(summary)}</p> : null}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{label}</p>
      <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-page-text)] md:justify-self-end" />
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile').flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Exclude profiles from filter dropdown — publicly they are not a task type.
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile')

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-20 pt-24 sm:px-8 sm:pt-32 lg:px-10">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-display mt-8 max-w-4xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[4.75rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>
          </EditableReveal>

          <EditableReveal index={1} className="mt-16">
            <form action="/search" className="border-t border-[var(--slot4-page-text)]/25 pt-8">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-4 border-b border-[var(--slot4-page-text)]/25 pb-4">
                <Search className="h-6 w-6 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-2xl font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]/70 sm:text-3xl"
                />
                <button className="editable-emphasis text-xl text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]" type="submit">
                  search →
                </button>
              </label>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Subject"
                  className="min-w-[180px] rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none focus:border-[var(--slot4-page-text)]"
                />
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none focus:border-[var(--slot4-page-text)]"
                >
                  <option value="">All content</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.key === 'pdf' ? 'Reference documents' : item.label}</option>)}
                </select>
              </div>
            </form>
          </EditableReveal>

          <EditableReveal index={2} className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
                <h2 className="editable-display mt-4 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
                  {query ? <>Results for <span className="editable-emphasis">“{query}”</span></> : pagesContent.search.resultsTitle}
                </h2>
              </div>
              <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-6 py-3 text-sm font-medium hover:border-[var(--slot4-page-text)]">
                Open the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {results.length ? (
              <div className="mt-12">
                {results.map((post, index) => <SearchResultRow key={post.id || post.slug} post={post} index={index} />)}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-16 text-center">
                <FileText className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
                <p className="editable-display mt-6 text-3xl tracking-[-0.01em]">Nothing found on the shelf.</p>
                <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different phrase, subject, or content type.</p>
              </div>
            )}
          </EditableReveal>

          <div className="mt-24">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
