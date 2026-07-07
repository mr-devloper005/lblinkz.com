import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-current/10', className)} />
}

export function PageLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] px-6 py-20 sm:px-8 lg:px-10', className)} aria-live="polite" aria-busy="true">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-current/50">{label}</p>
      <PulseBlock className="mt-8 h-16 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-6 h-4 w-2/3 max-w-2xl" />
      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <PulseBlock className="aspect-[4/5] w-full" />
            <PulseBlock className="mt-6 h-4 w-4/5" />
            <PulseBlock className="mt-3 h-3 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-10 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <PulseBlock className="aspect-[4/5] w-full" />
          <PulseBlock className="mt-5 h-4 w-5/6" />
          <PulseBlock className="mt-3 h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-96 w-full" />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-current/50">{label}</p>
        <PulseBlock className="mt-6 h-16 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
