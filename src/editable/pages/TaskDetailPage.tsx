import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, CheckCircle2, Download, ExternalLink, Eye, FileText, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  // Related fetch — for a profile page we surface Reference Library (pdf)
  // entries so the "their contributions" ledger links into the library, not
  // to other profile records (which would 404 against /pdf/<slug>). For every
  // other task we use its own feed, dropping the current post.
  const related = task === 'profile'
    ? (await fetchTaskPosts('pdf', 8)).filter((item) => item.slug !== post.slug).slice(0, 4)
    : (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{children}</p>
  )
}

function BackLink({ label = 'Back to the library', href = '/pdf' }: { label?: string; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  )
}

/* ============================== ARTICLE ================================ */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <BackLink label="Back to the library" href="/pdf" />
        <div className="mt-14">
          <Kicker>{categoryOf(post, 'Journal')}</Kicker>
          <h1 className="editable-display mt-6 text-balance text-[2.5rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[4.5rem]">
            {post.title}
          </h1>
        </div>
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-14 aspect-[16/9] w-full rounded-2xl border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================== LISTING ================================ */
function ListingDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:py-28 lg:px-10">
      <BackLink label="Back to places" href="/listing" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <Kicker>Place</Kicker>
          <h1 className="editable-display mt-6 text-[2.5rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">{post.title}</h1>
          {leadText(post) ? <p className="mt-8 max-w-2xl text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
        </aside>
      </div>
    </section>
  )
}

/* ============================== CLASSIFIED ============================= */
function ClassifiedDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:py-28 lg:px-10">
      <BackLink label="Back to notices" href="/classified" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
            <Kicker>Notice</Kicker>
            <h1 className="editable-display mt-4 text-2xl leading-tight tracking-[-0.01em]">{post.title}</h1>
            <p className="editable-display mt-8 text-[3rem] leading-none tracking-[-0.02em] text-[var(--tk-accent)]">{price || 'Open'}</p>
            {location ? <p className="mt-6 text-sm text-[var(--tk-muted)]">{location}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <BodyContent post={post} />
        </article>
      </div>
    </section>
  )
}

/* ============================== IMAGE ================================== */
function ImageDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:py-28 lg:px-10">
      <BackLink label="Back to frames" href="/image" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="columns-1 gap-6 [column-fill:_balance] sm:columns-2">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="mb-6 break-inside-avoid overflow-hidden rounded-2xl">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Kicker>Frame</Kicker>
          <h1 className="editable-display mt-6 text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-4xl">{post.title}</h1>
          {leadText(post) ? <p className="mt-6 text-[15px] leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <BodyContent post={post} compact />
        </aside>
      </div>
    </section>
  )
}

/* ============================== BOOKMARK =============================== */
function BookmarkDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <BackLink label="Back to shelves" href="/sbm" />
      <div className="mt-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Bookmark className="h-6 w-6" />
      </div>
      <Kicker>Shelf entry</Kicker>
      <h1 className="editable-display mt-4 text-[2.5rem] leading-[1.05] tracking-[-0.015em] sm:text-5xl">{post.title}</h1>
      {leadText(post) ? <p className="mt-6 text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">
          Open the source <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      <BodyContent post={post} />
    </article>
  )
}

/* =========================================================================
   REFERENCE LIBRARY (PDF) DETAIL — "Reading Room"
   -------------------------------------------------------------------------
   Full-bleed dark hero → broadsheet metadata masthead → centered pull-quote
   lead → paired filing cards → FULL-BLEED PDF preview iframe → centered
   reading column → tag chips → article-bottom ad → dark repeat CTA →
   horizontal snap-scroll related rail.
   ========================================================================= */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const category = categoryOf(post, 'Reference')
  const pages = getField(post, ['pages', 'pageCount'])
  const fileSize = getField(post, ['fileSize', 'size'])
  const filename = getField(post, ['filename', 'file']) || `${post.slug}.pdf`
  const lead = leadText(post)

  const masthead: Array<[string, string]> = [
    ['Format', 'PDF'],
    ['Subject', category],
  ]

  return (
    <>
      {/* ── HERO SLAB — dark espresso, all-serif, floating download pill ── */}
      <section className="relative bg-[var(--tk-text)] text-[var(--tk-on-accent)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-20 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/pdf" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-on-accent)]/70 transition hover:text-[var(--tk-on-accent)]">
              <ArrowLeft className="h-4 w-4" /> Back to the library
            </Link>
            {fileUrl ? (
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-on-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-text)] transition-colors hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]"
              >
                Download PDF <Download className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--tk-on-accent)]/25 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-on-accent)]/70">
              Reference document
            </span>
            <span className="rounded-full bg-[var(--tk-accent)] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-on-accent)]">
              PDF
            </span>
            <span className="rounded-full border border-[var(--tk-on-accent)]/25 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-on-accent)]/70">
              {category}
            </span>
          </div>

          <h1 className="editable-display mt-10 max-w-5xl text-balance text-[2.5rem] leading-[1.02] tracking-[-0.02em] text-[var(--tk-on-accent)] sm:text-[4rem] lg:text-[5.5rem]">
            {post.title}
          </h1>

          {fileUrl ? (
            <div className="mt-14 flex flex-wrap items-center gap-6 text-sm text-[var(--tk-on-accent)]/70">
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--tk-on-accent)]/85 hover:text-[var(--tk-on-accent)]">
                <ExternalLink className="h-4 w-4" /> Open in a new tab
              </Link>
              <span className="text-[var(--tk-on-accent)]/30">·</span>
              <span className="truncate font-mono text-xs uppercase tracking-[0.18em]">{filename}</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── BROADSHEET METADATA MASTHEAD ────────────────────────────────── */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10">
          <dl className="grid grid-cols-2 divide-y divide-[var(--tk-line)] sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
            {masthead.map(([label, value], i) => (
              <div key={label} className={`flex flex-col gap-3 py-7 ${i > 0 ? 'sm:border-l sm:border-[var(--tk-line)] sm:pl-6' : ''}`}>
                <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">{label}</dt>
                <dd className="editable-display truncate text-[1.35rem] leading-none tracking-[-0.01em] text-[var(--tk-text)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PULL-QUOTE LEAD (centered, narrow, italic serif) ─────────────── */}
      {lead ? (
        <section className="border-b border-[var(--tk-line)]">
          <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
            <p className="editable-emphasis text-center text-[1.75rem] leading-[1.4] tracking-[-0.005em] text-[var(--tk-text)] sm:text-[2rem]">
              “{lead}”
            </p>
          </div>
        </section>
      ) : null}

      {/* ── FILING CARDS ROW — "What's inside" + "The file" ─────────────── */}
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel A — What's inside */}
          <div className="flex flex-col gap-8 rounded-3xl bg-[var(--tk-raised)] p-10 sm:p-12">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Table of contents</p>
            <h2 className="editable-display text-[1.75rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.25rem]">What&rsquo;s inside</h2>
            <ol className="space-y-5 text-[15px] leading-[1.65]">
              {['Overview and context', 'Findings and evidence', 'Method and sources', 'References and appendix'].map((item, i) => (
                <li key={item} className="flex items-baseline gap-5 border-t border-[var(--tk-line)] pt-5">
                  <span className="editable-display shrink-0 text-lg leading-none tracking-[-0.01em] text-[var(--tk-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[var(--tk-text)]">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Panel B — The file (identity + download) */}
          <div className="flex flex-col gap-8 rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10 sm:p-12">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">The file</p>
            <div>
              <span className="editable-display block text-[4.5rem] leading-none tracking-[-0.03em] text-[var(--tk-accent)] sm:text-[5.5rem]">
                PDF
              </span>
              <p className="mt-6 truncate font-mono text-xs uppercase tracking-[0.18em] text-[var(--tk-muted)]">{filename}</p>
            </div>
            <dl className="grid gap-4 text-sm">
              <div className="flex items-center justify-between gap-3 border-t border-[var(--tk-line)] pt-4">
                <dt className="text-[var(--tk-muted)]">Subject</dt>
                <dd className="font-medium text-[var(--tk-text)]">{category}</dd>
              </div>
            </dl>
            {fileUrl ? (
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-4 text-sm font-medium text-[var(--tk-on-accent)] transition-colors hover:bg-[var(--tk-accent)]"
              >
                Take the file <Download className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED PDF PREVIEW — the visual centerpiece ──────────────── */}
      {fileUrl ? (
        <section className="bg-[var(--tk-raised)]">
          <div className="mx-auto max-w-[calc(var(--editable-container)+240px)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tk-line)] pb-6">
              <p className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">
                <Eye className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Reading preview
              </p>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-text)] hover:text-[var(--tk-accent)]"
              >
                Open full document <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={post.title}
              className="mt-8 h-[92vh] w-full rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]"
            />
          </div>
        </section>
      ) : null}

      {/* ── CENTERED READING COLUMN + TAGS ──────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">The document</p>
        <h2 className="editable-display mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
          About this reference.
        </h2>
        <BodyContent post={post} />

        {Array.isArray(post.tags) && post.tags.length ? (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--tk-line)] pt-10">
            {post.tags.slice(0, 10).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* Article-bottom ad, per spec placement */}
        <div className="mt-16">
          <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
        </div>
      </section>

      {/* ── REPEAT CTA — dark slab, the reference's own pattern ──────────── */}
      {fileUrl ? (
        <section className="bg-[var(--tk-text)] text-[var(--tk-on-accent)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
            <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent-soft)]">Take it home</p>
                <h2 className="editable-display mt-8 text-[2.5rem] leading-[1.05] tracking-[-0.01em] sm:text-[3.5rem] lg:text-[4.25rem]">
                  The whole document, <span className="editable-emphasis">yours to keep.</span>
                </h2>
              </div>
              <div>
                <p className="max-w-md text-[16px] leading-[1.75] text-[var(--tk-on-accent)]/70 sm:text-[17px]">
                  No accounts, no gates. If it&rsquo;s on the shelf, it&rsquo;s yours to take away.
                </p>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--tk-on-accent)] px-8 py-4 text-sm font-medium text-[var(--tk-text)] transition-colors hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]"
                >
                  Download PDF <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── RELATED — horizontal snap-scroll rail (typography only) ─────── */}
      {related.length ? (
        <section className="border-t border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:px-8 sm:py-28 lg:px-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Adjacent reading</p>
                <h2 className="editable-display mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.75rem]">
                  More from the library.
                </h2>
              </div>
              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-text)]/25 px-6 py-3 text-sm font-medium hover:border-[var(--tk-text)]"
              >
                Open the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-14 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
              {related.map((item, i) => {
                const size = getField(item, ['fileSize', 'size'])
                const rPages = getField(item, ['pages', 'pageCount'])
                const href = `/pdf/${item.slug}`
                return (
                  <Link
                    key={item.id || item.slug}
                    href={href}
                    className="group flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:w-[320px]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="editable-display text-3xl leading-none tracking-[-0.02em] text-[var(--tk-accent)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <FileText className="h-5 w-5 text-[var(--tk-muted)]" />
                    </div>
                    <h3 className="editable-display mt-14 line-clamp-3 text-[1.25rem] leading-[1.2] tracking-[-0.01em] transition-colors group-hover:text-[var(--tk-accent)]">
                      {item.title}
                    </h3>
                    <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                      <span>{size || 'PDF'}</span>
                      {rPages ? <span>{rPages} pp.</span> : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* =========================================================================
   CONTRIBUTOR (PROFILE) DETAIL — "Field Record"
   -------------------------------------------------------------------------
   Direct-URL only. Split-screen hero (avatar slab | dark bio panel) →
   broadsheet case-file bar → centered "About the contributor" body →
   contributions ledger + sticky sidebar with contact + trust + sidebar ad
   → full-bleed map. NO outbound profile links.
   ========================================================================= */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title'])
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'mobile'])
  const address = getField(post, ['address', 'location'])
  const company = getField(post, ['company', 'organization'])
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)

  const caseFile: Array<[string, string]> = [
    ['Location', location || '—'],
    ['Role', role || '—'],
    ['Site', website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '') : '—'],
    ['Status', 'Verified'],
  ]

  return (
    <>
      {/* ── SPLIT-SCREEN HERO ────────────────────────────────────────────── */}
      <section className="grid gap-0 lg:grid-cols-2">
        {/* Left: avatar slab (aspect square, taller on desktop) */}
        <div className="relative aspect-[4/3] w-full bg-[var(--tk-raised)] lg:aspect-auto lg:min-h-[720px]">
          {avatar ? (
            <img src={avatar} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="h-40 w-40 text-[var(--tk-muted)]/40" strokeWidth={0.8} />
            </div>
          )}
        </div>

        {/* Right: espresso bio panel */}
        <div className="relative bg-[var(--tk-text)] px-6 py-16 text-[var(--tk-on-accent)] sm:px-14 sm:py-24 lg:px-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent-soft)]">Contributor</p>

          <h1 className="editable-display mt-10 text-balance text-[2.5rem] leading-[1.02] tracking-[-0.02em] text-[var(--tk-on-accent)] sm:text-6xl lg:text-[4.5rem]">
            {post.title}
          </h1>

          {role || company ? (
            <p className="mt-6 text-lg text-[var(--tk-on-accent)]/70 sm:text-xl">
              {role}{role && company ? ' · ' : ''}{company}
            </p>
          ) : null}

          {lead ? (
            <p className="editable-emphasis mt-12 max-w-lg text-[1.35rem] leading-[1.5] tracking-[-0.005em] text-[var(--tk-on-accent)]/85 sm:text-[1.5rem]">
              &ldquo;{lead}&rdquo;
            </p>
          ) : null}

          <div className="mt-14 flex flex-wrap items-center gap-3">
            {website ? (
              <Link
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-on-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-text)] transition-colors hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]"
              >
                Visit their site <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-on-accent)]/30 px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition-colors hover:border-[var(--tk-on-accent)]"
              >
                <Mail className="h-4 w-4" /> Write to them
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── BROADSHEET CASE-FILE BAR ────────────────────────────────────── */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10">
          <dl className="grid grid-cols-2 divide-y divide-[var(--tk-line)] lg:grid-cols-4 lg:divide-y-0">
            {caseFile.map(([label, value], i) => (
              <div key={label} className={`flex flex-col gap-3 py-7 ${i > 0 ? 'lg:border-l lg:border-[var(--tk-line)] lg:pl-6' : ''}`}>
                <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">{label}</dt>
                <dd className="editable-display truncate text-[1.35rem] leading-none tracking-[-0.01em] text-[var(--tk-text)]">
                  {label === 'Status' ? (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {value}
                    </span>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CENTERED "About the contributor" ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Field record</p>
        <h2 className="editable-display mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
          About the contributor.
        </h2>
        <BodyContent post={post} />

        {Array.isArray(post.tags) && post.tags.length ? (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--tk-line)] pt-10">
            {post.tags.slice(0, 10).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {/* ── CONTRIBUTIONS LEDGER + STICKY SIDEBAR ────────────────────────── */}
      <section className="border-t border-[var(--tk-line)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* LEFT — contributions ledger */}
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Their contributions</p>
              <h2 className="editable-display mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
                What they&rsquo;ve filed on the shelf.
              </h2>
              {related.length ? (
                <ol className="mt-12">
                  {related.map((item, i) => (
                    <li key={item.id || item.slug}>
                      <Link
                        href={`/pdf/${item.slug}`}
                        className="group grid gap-6 border-t border-[var(--tk-line)] py-8 md:grid-cols-[64px_1fr_auto] md:items-center"
                      >
                        <span className="editable-display text-3xl leading-none tracking-[-0.02em] text-[var(--tk-accent)]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h3 className="editable-display line-clamp-2 text-[1.35rem] leading-[1.2] tracking-[-0.01em] transition-colors group-hover:text-[var(--tk-accent)]">
                            {item.title}
                          </h3>
                          <p className="mt-2 line-clamp-1 text-[14px] leading-[1.6] text-[var(--tk-muted)]">
                            {stripHtml(summaryText(item))}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[var(--tk-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-text)]" />
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-10 border-t border-[var(--tk-line)] pt-10 text-[15px] leading-[1.75] text-[var(--tk-muted)]">
                  Nothing filed yet.
                </p>
              )}
            </div>

            {/* RIGHT — sticky sidebar (contact + trust + ad) */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Contact card */}
              <div className="rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">Get in touch</p>
                <div className="mt-6 space-y-4">
                  {address ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span className="text-sm text-[var(--tk-text)]">{address}</span>
                    </div>
                  ) : null}
                  {phone ? (
                    <a href={`tel:${phone}`} className="flex items-start gap-3 text-sm text-[var(--tk-text)] transition-colors hover:text-[var(--tk-accent)]">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span>{phone}</span>
                    </a>
                  ) : null}
                  {email ? (
                    <a href={`mailto:${email}`} className="flex items-start gap-3 text-sm text-[var(--tk-text)] transition-colors hover:text-[var(--tk-accent)]">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span className="break-all">{email}</span>
                    </a>
                  ) : null}
                  {website ? (
                    <a href={website} target="_blank" rel="noreferrer" className="flex items-start gap-3 text-sm text-[var(--tk-text)] transition-colors hover:text-[var(--tk-accent)]">
                      <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span className="break-all">{website}</span>
                    </a>
                  ) : null}
                </div>
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition-colors hover:bg-[var(--tk-accent)]"
                  >
                    Visit their site <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>

              {/* Trust panel — three verified items */}
              <div className="rounded-3xl bg-[var(--tk-raised)] p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">On the record</p>
                <ul className="mt-6 space-y-4 text-sm">
                  {['Verified contributor', 'Contact details confirmed', 'Contributions kept current'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span className="text-[var(--tk-text)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar ad — spec placement */}
              <div>
                <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED MAP (when address/lat/lng available) ──────────────── */}
      {mapSrc ? (
        <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
          <div className="mx-auto max-w-[calc(var(--editable-container)+240px)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tk-line)] pb-6">
              <p className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> On the map
              </p>
              <span className="editable-display text-lg leading-none tracking-[-0.01em] text-[var(--tk-text)]">
                {address || location || post.title}
              </span>
            </div>
            <iframe
              src={mapSrc}
              title="Map"
              loading="lazy"
              className="mt-8 h-[70vh] w-full rounded-2xl border-0"
            />
          </div>
        </section>
      ) : null}
    </>
  )
}

/* --------------------------- Shared building blocks -------------------- */

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.75]' : 'text-[17px] leading-[1.85]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-3 break-words text-[15px] font-medium leading-6 text-[var(--tk-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-5 text-sm font-medium">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'On the map'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Get in touch</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:py-24 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <Kicker>Adjacent reading</Kicker>
            <h2 className="editable-display mt-6 text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem]">
              More {(taskConfig?.label || 'entries').toLowerCase()}.
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-medium">
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link key={item.id || item.slug} href={`${taskConfig?.route || `/${task}`}/${item.slug}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
                {getImages(item)[0] ? (
                  <img src={getImages(item)[0]} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FileText className="h-8 w-8 text-[var(--tk-muted)]" />
                  </div>
                )}
              </div>
              <h3 className="editable-display mt-5 line-clamp-2 text-lg leading-[1.25] tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-[var(--tk-muted)]">{stripHtml(summaryText(item))}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
