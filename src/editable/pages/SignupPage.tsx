import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Create account', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-16 px-6 pb-24 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-[0.9fr_1fr] lg:px-10">
          <div className="order-2 rounded-3xl bg-[var(--slot4-panel-bg)] p-10 lg:order-1 lg:p-14">
            <h1 className="editable-display text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
              {pagesContent.auth.signup.formTitle}
            </h1>
            <div className="mt-8">
              <EditableLocalSignupForm />
            </div>
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="editable-emphasis text-[var(--slot4-page-text)] underline-offset-4 hover:underline">
                {pagesContent.auth.signup.loginCta}
              </Link>
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.auth.signup.badge}
            </p>
            <h2 className="editable-display mt-8 max-w-xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-8 max-w-lg text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
