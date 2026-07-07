import Link from 'next/link'
import { ArrowUpRight, ChevronDown, FileText, Globe, MapPin, ScrollText, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

// PDF archive gets the editorial three-column grid. Other archives get a
// gentler wide grid — they remain functional but are not publicly promoted.
const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3',
  listing: 'grid gap-8 lg:grid-cols-2',
  classified: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3',
  profile: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All subjects' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const isPdf = task === 'pdf'

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative border-b border-[var(--tk-line)]">
          <div className="relative mx-auto max-w-[var(--editable-container)] px-6 pb-16 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-40">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                {theme.kicker} · {label}
              </p>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[2.5rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[4.75rem]">
                {voice?.headline || `The ${label.toLowerCase()} shelf.`}
              </h1>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-[var(--tk-muted)] sm:text-lg">
                {voice?.description || theme.note}
              </p>
              {voice?.chips?.length ? (
                <div className="mt-10 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </EditableReveal>

            <EditableReveal index={1} className="mt-16">
              <div className="flex flex-col gap-6 border-t border-[var(--tk-line)] pt-10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--tk-muted)]">
                  <span className="editable-display text-[1.75rem] leading-none tracking-[-0.01em] text-[var(--tk-text)]">
                    {String(posts.length).padStart(2, '0')}
                  </span>{' '}
                  {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-12 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter subject'}
                    >
                      <option value="all">All subjects</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-12 items-center rounded-full bg-[var(--tk-text)] px-6 text-sm font-medium text-[var(--tk-on-accent)] transition-colors hover:bg-[var(--tk-accent)]">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        {isPdf ? (
          <div className="mx-auto max-w-[var(--editable-container)] px-6 pt-10 sm:px-8 lg:px-10">
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-10 py-20 text-center">
              <ScrollText className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-3xl tracking-[-0.01em]">Nothing on this shelf yet.</h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--tk-muted)]">
                Try a different subject, or come back after new entries are filed.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-24 flex items-center justify-center gap-4 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-accent)]">
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-accent)]">
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

// ---- Reference Library (PDF) archive card ---------------------------------
function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className="group flex h-full flex-col">
      <div className="flex items-start justify-between border-b border-[var(--tk-line)] pb-6">
        <p className="editable-display text-[1.75rem] leading-none tracking-[-0.01em] text-[var(--tk-accent)]">
          {String(index + 1).padStart(2, '0')}
        </p>
        <span className="rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
          {category}
        </span>
      </div>
      <div className="mt-8 flex h-40 items-center justify-center rounded-2xl bg-[var(--tk-raised)]">
        <FileText className="h-14 w-14 text-[var(--tk-accent)]" strokeWidth={1.2} />
      </div>
      <h2 className="editable-display mt-8 line-clamp-3 text-[1.5rem] leading-[1.2] tracking-[-0.01em] transition-colors group-hover:text-[var(--tk-accent)] sm:text-[1.75rem]">
        {post.title}
      </h2>
      <p className="mt-4 line-clamp-3 flex-1 text-[14.5px] leading-[1.75] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-text)] transition-colors group-hover:text-[var(--tk-accent)]">
        Open the entry <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

// ---- Article / other archive variants (unchanged behaviour, warmer paint) -
function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Journal')
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[1000ms] group-hover:scale-[1.04]" />
      </div>
      <div className="mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          {category} · No. {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[1.5rem] leading-[1.2] tracking-[-0.01em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[14.5px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group flex items-center gap-6 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <MapPin className="h-8 w-8 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-xl tracking-[-0.01em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {location ? <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-accent)]">{location}</p> : null}
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  return (
    <Link href={href} className="group flex flex-col rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[2rem] leading-none tracking-[-0.01em] text-[var(--tk-accent)]">{price || 'Open'}</span>
      </div>
      <h2 className="editable-display mt-8 text-xl tracking-[-0.01em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-2xl">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(41,21,5,0.75))]" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-display line-clamp-2 text-lg leading-tight tracking-[-0.01em] text-white">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group flex flex-col rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">Shelf · {String(index + 1).padStart(2, '0')}</p>
      <h2 className="editable-display mt-2 text-lg tracking-[-0.01em]">{post.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      {website ? <p className="mt-4 truncate text-xs font-medium text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group flex flex-col items-center rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-6 text-xl tracking-[-0.01em]">{post.title}</h2>
      {role ? <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
