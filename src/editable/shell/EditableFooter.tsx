'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Deep espresso panel with cream ink, editorial multi-column footer.
// Discovery column lists ONLY the Reference Library (renamed pdf task).
export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 pt-24 pb-10 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="editable-display block text-[2.25rem] leading-[1.05] tracking-[-0.01em] text-[var(--editable-footer-text)]">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.75] text-[var(--editable-footer-text)]/70">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <Link
              href="/pdf"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-footer-text)]/25 px-6 py-3 text-sm font-medium text-[var(--editable-footer-text)] transition-colors hover:border-[var(--editable-footer-text)] hover:bg-[var(--editable-footer-text)] hover:text-[var(--editable-footer-bg)]"
            >
              Enter the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--editable-footer-text)]/50">Library</h3>
            <div className="mt-6 grid gap-3">
              <Link href="/pdf" className="text-[15px] font-medium text-[var(--editable-footer-text)] transition-colors hover:text-[var(--slot4-accent)]">
                Reference Library
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--editable-footer-text)]/50">Resources</h3>
            <div className="mt-6 grid gap-3">
              <Link href="/about" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">The project</Link>
              <Link href="/contact" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Get in touch</Link>
              <Link href="/search" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Search</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--editable-footer-text)]/50">Account</h3>
            <div className="mt-6 grid gap-3">
              {session ? (
                <>
                  <Link href="/create" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Submit a document</Link>
                  <button type="button" onClick={logout} className="text-left text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Sign in</Link>
                  <Link href="/signup" className="text-[15px] font-medium text-[var(--editable-footer-text)]/85 transition-colors hover:text-[var(--slot4-accent)]">Create account</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[var(--editable-footer-text)]/12 pt-8 text-[13px] text-[var(--editable-footer-text)]/55 sm:flex-row sm:items-center">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote || 'All rights reserved.'}</p>
          <p className="italic text-[var(--editable-footer-text)]/55">{globalContent.footer?.tagline || ''}</p>
        </div>
      </div>
    </footer>
  )
}
