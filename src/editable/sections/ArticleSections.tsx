import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-16 pt-24 sm:px-8 sm:pt-32 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{voice.eyebrow}</p>
        <h1 className="editable-display mt-8 max-w-4xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[4.75rem]">
          {voice.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">{voice.description}</p>
        <form action={basePath} className="mt-14 flex items-center gap-4 border-t border-[var(--slot4-page-text)]/25 pt-8">
          <select
            name="category"
            defaultValue={category || 'all'}
            className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none focus:border-[var(--slot4-page-text)]"
          >
            <option value="all">All subjects</option>
            {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] hover:bg-[var(--slot4-accent)]">
            Filter
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        {posts.length ? (
          <div className="grid gap-16">
            {posts.map((post, index) => (
              <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--editable-border)] p-16 text-center">
            <h2 className="editable-display text-3xl tracking-[-0.01em]">Nothing here yet.</h2>
            <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different subject.</p>
          </div>
        )}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--slot4-page-text)]/25 px-6 py-3 text-sm font-medium hover:border-[var(--slot4-page-text)]">Previous</Link> : null}
          <span className="rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)]">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--slot4-page-text)]/25 px-6 py-3 text-sm font-medium hover:border-[var(--slot4-page-text)]">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <article className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <Link href="/pdf" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]">
          <ArrowLeft className="h-4 w-4" /> Back to the library
        </Link>
        <div className="mt-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{voice.eyebrow}</p>
          <h1 className="editable-display mt-6 text-balance text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
            {post?.title || pagesContent.detailPages.article.fallbackTitle}
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
            {post?.summary || `Notes for ${slug} will render through the editable detail page.`}
          </p>
        </div>
        <div className="mt-16 rounded-2xl bg-[var(--slot4-panel-bg)] p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Reading note</p>
          <p className="editable-display mt-6 text-2xl leading-[1.25] tracking-[-0.01em]">{voice.secondaryNote}</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] hover:bg-[var(--slot4-accent)]">
            Write to us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </main>
  )
}
