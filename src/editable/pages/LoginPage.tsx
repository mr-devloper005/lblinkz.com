import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-16 px-6 pb-24 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.auth.login.badge}
            </p>
            <h1 className="editable-display mt-8 max-w-xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-8 max-w-lg text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.login.description}
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--slot4-panel-bg)] p-10 lg:p-14">
            <h2 className="editable-display text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
              {pagesContent.auth.login.formTitle}
            </h2>
            <div className="mt-8">
              <EditableLocalLoginForm />
            </div>
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="editable-emphasis text-[var(--slot4-page-text)] underline-offset-4 hover:underline">
                {pagesContent.auth.login.createCta}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
