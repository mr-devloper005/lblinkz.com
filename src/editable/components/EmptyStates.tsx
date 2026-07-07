import Link from 'next/link'
import { ArrowUpRight, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on the shelf yet.',
  description = 'New entries will appear here as they are filed. The page stays ready.',
  actionLabel = 'Back to the library',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-3xl border border-dashed border-current/15 bg-current/[0.02] p-14 text-center', className)}>
      <ScrollText className="mx-auto h-8 w-8 text-current/60" />
      <h2 className="editable-display mt-6 text-3xl tracking-[-0.01em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-[1.75] text-current/65">{description}</p>
      <Link href={actionHref} className="mt-8 inline-flex items-center gap-2 rounded-full border border-current/25 px-6 py-3 text-sm font-medium transition hover:bg-current hover:text-background">
        {actionLabel} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} will appear here once they are added to the library.`}
      actionLabel="Explore the shelf"
      actionHref="/pdf"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for writing in. Your note has been saved and will be read by hand."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
