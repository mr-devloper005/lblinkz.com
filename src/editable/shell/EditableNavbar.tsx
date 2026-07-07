'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Clean editorial navbar. Deliberately no task-page links — see spec.
// The mobile menu mirrors the desktop bar exactly.
const staticNav = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)]/70 bg-[var(--editable-nav-bg)]/92 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-8 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="editable-display block text-2xl leading-none tracking-[-0.01em] text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name}
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] md:block">
            — {globalContent.nav?.tagline || SITE_CONFIG.tagline}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-9 lg:flex">
          {staticNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] font-medium tracking-[-0.005em] transition-colors ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--slot4-page-text)]/15 text-[var(--slot4-page-text)] transition-colors hover:border-[var(--slot4-page-text)]/40 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[12px] font-medium tracking-[-0.005em] text-[var(--slot4-on-accent)] transition-colors hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden text-[12px] font-medium tracking-[-0.005em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-[var(--slot4-page-text)]/25 px-5 py-2.5 text-[12px] font-medium tracking-[-0.005em] text-[var(--slot4-page-text)] transition-colors hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[12px] font-medium tracking-[-0.005em] text-[var(--slot4-on-accent)] transition-colors hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--slot4-page-text)]/15 text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)]/70 bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {staticNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    active ? 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]"
            >
              Search
            </Link>
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]">Submit</Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)]">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]">Sign in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]">Get started</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
