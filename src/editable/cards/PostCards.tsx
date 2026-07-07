import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Reference'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// EDITORIAL FEATURE CARD — a full-bleed cover treatment for a single lead item.
export function EditorialFeatureCard({ post, href, label = 'From the shelf' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/11] w-full lg:aspect-[16/9]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-[1200ms] group-hover:scale-[1.04] group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,21,5,0.25),rgba(41,21,5,0.88))]" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-8 sm:p-12 lg:p-16">
          <span className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>{label}</span>
          <h3 className="editable-display max-w-3xl text-[2rem] leading-[1.05] tracking-[-0.01em] text-[var(--slot4-on-accent)] sm:text-[2.75rem] lg:text-[3.5rem]">
            {post.title}
          </h3>
          <p className="max-w-2xl text-[15px] leading-[1.7] text-[var(--slot4-on-accent)]/80 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-on-accent)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)]">
            Open document <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// RAIL POST CARD — used in horizontal rails on the home page.
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-5">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)} · No. {String(index + 1).padStart(2, '0')}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-2xl leading-[1.15] tracking-[-0.01em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-2 text-[14px] leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

// COMPACT INDEX CARD — a numbered editorial row for lists / rails.
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group flex items-start gap-6 border-t border-[var(--editable-border)] py-6 ${dc.motion.fade}`}>
      <span className="editable-display shrink-0 text-3xl leading-none tracking-[-0.01em] text-[var(--slot4-accent)] sm:text-4xl">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-2 line-clamp-2 text-xl leading-[1.2] tracking-[-0.01em] ${pal.panelText} sm:text-2xl`}>
          {post.title}
        </h3>
        <p className={`mt-2 line-clamp-2 text-[14px] leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
      </div>
      <ArrowUpRight className="mt-2 h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-page-text)]" />
    </Link>
  )
}

// ARTICLE LIST CARD — a large horizontal reading card.
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 ${dc.motion.fade} sm:grid-cols-[280px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[4/5] sm:aspect-[4/5]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 py-2">
        <p className={`${dc.type.eyebrow}`}>Entry {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-4 line-clamp-3 text-3xl leading-[1.1] tracking-[-0.01em] ${pal.panelText} sm:text-4xl`}>
          {post.title}
        </h2>
        <p className={`mt-5 line-clamp-3 text-[15px] leading-[1.8] ${pal.mutedText}`}>{getEditableExcerpt(post, 200)}</p>
        <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${pal.panelText}`}>
          Open document <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
