import Link from 'next/link'
import { ArrowUpRight, BookOpen, Download, ScrollText, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

// The public feed is the Reference Library. We deliberately do not surface
// profile cards, profile CTAs, or profile links in any home section.
type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10'

function getExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Reference'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- HERO ---------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const hero = pool[0]
  const secondary = pool.slice(1, 3)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `A quiet library, ${SITE_CONFIG.name}.`
  const heroImage = hero ? getEditablePostImage(hero) : ''

  return (
    <section className={`relative border-b border-[var(--editable-border)]/70 ${container}`}>
      <div className="py-20 sm:py-28 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.home.hero.badge}
            </p>
            <h1 className="editable-display mt-8 max-w-[15ch] text-[2.75rem] leading-[1.02] tracking-[-0.015em] sm:text-6xl lg:text-[5rem]">
              {heroTitle.split(', ').map((chunk, idx, arr) => (
                <span key={idx} className="block">
                  {idx > 0 && arr.length > 1 ? <span className="editable-emphasis">{chunk}</span> : chunk}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.7] text-[var(--slot4-muted-text)] sm:text-lg">
              {pagesContent.home.hero.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={pagesContent.home.hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-medium text-[var(--slot4-on-accent)] transition-colors hover:bg-[var(--slot4-accent)]"
              >
                {pagesContent.home.hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={pagesContent.home.hero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-8 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition-colors hover:border-[var(--slot4-page-text)]"
              >
                {pagesContent.home.hero.secondaryCta.label}
              </Link>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="relative">
              {heroImage ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
                  <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-[var(--slot4-panel-bg)]">
                  <ScrollText className="h-16 w-16 text-[var(--slot4-muted-text)]/40" />
                </div>
              )}
              {hero ? (
                <div className="absolute -bottom-8 left-4 right-4 rounded-2xl bg-[var(--slot4-page-text)] p-6 text-[var(--slot4-on-accent)] shadow-[0_30px_60px_rgba(41,21,5,0.2)] sm:left-8 sm:right-auto sm:w-[300px] sm:p-7">
                  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--slot4-on-accent)]/60">
                    {pagesContent.home.hero.featureCardBadge}
                  </p>
                  <p className="editable-display mt-4 text-[1.35rem] leading-[1.25] tracking-[-0.01em]">
                    {hero.title}
                  </p>
                  <Link
                    href={postHref(primaryTask, hero, primaryRoute)}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-on-accent)]/80 hover:text-[var(--slot4-on-accent)]"
                  >
                    Read the entry <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}
            </div>
          </EditableReveal>
        </div>

        {/* Search rail */}
        <EditableReveal index={2} className="mt-24">
          <form action="/search" className="flex items-center gap-3 border-b border-[var(--slot4-page-text)]/25 pb-4">
            <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              placeholder={pagesContent.home.hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-lg font-medium tracking-[-0.005em] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]/70"
            />
            <button className="editable-emphasis text-lg text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
              search →
            </button>
          </form>
          {secondary.length ? (
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              Recently on the shelf: {secondary.map((p, i) => (
                <span key={p.id || p.slug || i}>
                  <Link href={postHref(primaryTask, p, primaryRoute)} className="editable-emphasis text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
                    {p.title}
                  </Link>
                  {i === 0 && secondary.length > 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          ) : null}
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------------------- INTRO / MISSION -------------------------- */
export function EditableIntroBand() {
  const intro = pagesContent.home.intro
  return (
    <section className={`${container}`}>
      <div className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{intro.badge}</p>
            <h2 className="editable-display mt-8 text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem] lg:text-[3.5rem]">
              {intro.title.split('.').map((chunk) => chunk.trim()).filter(Boolean).map((chunk, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span className="editable-emphasis">{chunk}.</span> : `${chunk}.`}
                </span>
              ))}
            </h2>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="space-y-6 text-[16px] leading-[1.85] text-[var(--slot4-muted-text)] sm:text-[17px]">
              {intro.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={intro.primaryLink.href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
                {intro.primaryLink.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="text-[var(--slot4-muted-text)]/40">·</span>
              <Link href={intro.secondaryLink.href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
                {intro.secondaryLink.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------- FEATURED SHELF (grid) ----------------------- */
export function EditableFeaturedShelf({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const items = pool.slice(0, 6)
  if (!items.length) return null

  return (
    <section className={`bg-[var(--slot4-panel-bg)]`}>
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0} className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">On the shelf</p>
            <h2 className="editable-display mt-6 text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem]">
              New arrivals, <span className="editable-emphasis">read them slowly.</span>
            </h2>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]">
            Open the library <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post, i) => {
            const image = getEditablePostImage(post)
            const href = postHref(primaryTask, post, primaryRoute)
            return (
              <EditableReveal key={post.id || post.slug} index={i}>
                <Link href={href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[1000ms] group-hover:scale-[1.04]" loading="lazy" />
                  </div>
                  <div className="mt-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
                    <h3 className="editable-display mt-3 line-clamp-3 text-[1.5rem] leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[1.75rem]">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-[14px] leading-[1.7] text-[var(--slot4-muted-text)]">{getExcerpt(post, 130)}</p>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- FEATURE SHOWCASE -------------------------- */
export function EditableFeatureShowcase({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts[0]
  if (!featured) return null
  const image = getEditablePostImage(featured)
  const href = postHref(primaryTask, featured, primaryRoute)
  return (
    <section className={container}>
      <div className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <EditableReveal index={0} className="order-2 lg:order-1">
            <div className="relative aspect-[5/6] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </EditableReveal>
          <EditableReveal index={1} className="order-1 lg:order-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">A closer look</p>
            <h2 className="editable-display mt-6 text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem]">
              {featured.title}
            </h2>
            <p className="mt-6 max-w-lg text-[16px] leading-[1.75] text-[var(--slot4-muted-text)] sm:text-[17px]">
              {getExcerpt(featured, 260)}
            </p>
            <Link
              href={href}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition-colors hover:bg-[var(--slot4-accent)]"
            >
              Open the entry <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- QUIET STATS ----------------------------- */
export function EditableStatsBand({ posts }: HomeSectionProps) {
  const total = posts.length || 24
  const stats = [
    { number: String(total).padStart(2, '0'), label: 'Documents on the shelf' },
    { number: '01', label: 'A single library, one voice' },
    { number: '∞', label: 'Free reads, free downloads' },
  ]
  return (
    <section className="bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]">
      <div className={`${container} py-24 sm:py-28`}>
        <div className="grid gap-12 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <EditableReveal key={stat.label} index={i}>
              <p className="editable-display text-[3.5rem] leading-[1] tracking-[-0.02em] text-[var(--slot4-on-accent)] sm:text-[5rem]">
                {stat.number}
              </p>
              <p className="mt-6 max-w-[18ch] text-[15px] leading-[1.6] text-[var(--slot4-on-accent)]/70">{stat.label}</p>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- PROCESS / STEPS --------------------------- */
export function EditableProcessSteps() {
  const steps = [
    {
      no: '01',
      title: 'Find a document',
      body: 'Search by subject or scroll the shelf. Each entry lives on its own page.',
      icon: Search,
    },
    {
      no: '02',
      title: 'Preview in full',
      body: 'The document opens in-page. Read the whole thing before you decide to take it.',
      icon: BookOpen,
    },
    {
      no: '03',
      title: 'Take the file',
      body: 'A plain download — no accounts, no forms, no gates. Yours to keep.',
      icon: Download,
    },
  ]
  return (
    <section className={container}>
      <div className="py-24 sm:py-32 lg:py-40">
        <EditableReveal index={0}>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">How the library works</p>
          <h2 className="editable-display mt-6 max-w-2xl text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem]">
            Read what is here. <span className="editable-emphasis">Take what you need.</span>
          </h2>
        </EditableReveal>
        <div className="mt-20 grid gap-y-16 gap-x-12 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <EditableReveal key={step.no} index={i}>
                <div className="flex items-start justify-between border-b border-[var(--editable-border)] pb-6">
                  <p className="editable-display text-4xl leading-none tracking-[-0.01em] text-[var(--slot4-accent)]">{step.no}</p>
                  <Icon className="h-6 w-6 text-[var(--slot4-page-text)]/50" />
                </div>
                <h3 className="editable-display mt-8 text-[1.5rem] leading-[1.2] tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-4 max-w-[32ch] text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{step.body}</p>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------- ADJACENT READING GRID ----------------------- */
export function EditableAdjacentReading({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const items = pool.slice(6, 12)
  if (!items.length) return null
  return (
    <section className={container}>
      <div className="py-24 sm:py-32 lg:py-40">
        <EditableReveal index={0}>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Adjacent reading</p>
          <h2 className="editable-display mt-6 text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem]">
            More from the deeper shelves.
          </h2>
        </EditableReveal>
        <div className="mt-16 grid gap-y-0">
          {items.map((post, i) => {
            const href = postHref(primaryTask, post, primaryRoute)
            return (
              <EditableReveal key={post.id || post.slug} index={i}>
                <Link href={href} className="group grid gap-6 border-t border-[var(--editable-border)] py-8 md:grid-cols-[80px_1fr_240px_auto] md:items-center">
                  <p className="editable-display text-3xl leading-none tracking-[-0.01em] text-[var(--slot4-accent)]">
                    {String(i + 7).padStart(2, '0')}
                  </p>
                  <div className="min-w-0">
                    <h3 className="editable-display line-clamp-2 text-[1.35rem] leading-[1.25] tracking-[-0.01em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)]">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-1 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{categoryOf(post)}</p>
                  <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-page-text)] md:justify-self-end" />
                </Link>
              </EditableReveal>
            )
          })}
        </div>
        <EditableReveal index={items.length} className="mt-16 flex justify-center">
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-8 py-4 text-sm font-medium text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]">
            Open the whole library <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------------------- CTA (dark band) -------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className="bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]">
      <div className={`${container} py-28 sm:py-32 lg:py-40`}>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{cta.badge}</p>
            <h2 className="editable-display mt-8 text-[2.5rem] leading-[1.05] tracking-[-0.01em] sm:text-[3.5rem] lg:text-[4.5rem]">
              {cta.title.split('.').filter(Boolean).map((chunk, i, arr) => (
                <span key={i} className="block">
                  {i === arr.length - 1 && arr.length > 1 ? <span className="editable-emphasis">{chunk.trim()}.</span> : `${chunk.trim()}.`}
                </span>
              ))}
            </h2>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className="max-w-lg text-[17px] leading-[1.75] text-[var(--slot4-on-accent)]/70 sm:text-lg">
              {cta.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-on-accent)] px-8 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition-colors hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]">
                {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-on-accent)]/40 px-8 py-4 text-sm font-medium text-[var(--slot4-on-accent)] transition-colors hover:border-[var(--slot4-on-accent)]">
                {cta.secondaryCta.label}
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* --- Legacy exports kept for HomePage.tsx signature compatibility -------- */
// These wrap the new sections so imports in HomePage keep working even if
// the file layout changes.
export const EditableStoryRail = EditableFeaturedShelf
export const EditableMagazineSplit = EditableFeatureShowcase
export const EditableTimeCollections = EditableAdjacentReading
