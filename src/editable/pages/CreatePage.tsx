'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

// Public submission UI centers on the Reference Library. Profile task is never
// promoted as a submission type (contributors are created out-of-band).
const publicLabelFor = (task: TaskKey, defaultLabel: string) => (task === 'pdf' ? 'Reference document' : defaultLabel)

const fieldClass =
  'w-full border-0 border-b border-[var(--editable-border)] bg-transparent py-3 text-base font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'),
    []
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks.find((t) => t.key === 'pdf')?.key || enabledTasks[0]?.key || 'pdf') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-24 sm:px-8 sm:pt-40 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <EditableReveal index={0}>
                <div className="rounded-3xl bg-[var(--slot4-page-text)] p-16 text-[var(--slot4-on-accent)]">
                  <Lock className="h-14 w-14 opacity-60" />
                  <p className="editable-display mt-16 text-3xl leading-[1.15] tracking-[-0.01em]">
                    The shelf is small, and kept by hand.
                  </p>
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                  {pagesContent.create.locked.badge}
                </p>
                <h1 className="editable-display mt-8 text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-8 max-w-lg text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.locked.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] hover:bg-[var(--slot4-accent)]">
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-7 py-3.5 text-sm font-medium hover:border-[var(--slot4-page-text)]">
                    Create an account
                  </Link>
                </div>
              </EditableReveal>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-24 sm:px-8 sm:pt-32 lg:px-10">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.create.hero.badge}
            </p>
            <h1 className="editable-display mt-8 max-w-3xl text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
              {pagesContent.create.hero.description}
            </p>
          </EditableReveal>

          <div className="mt-16 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal index={1}>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Kind of entry</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-2xl border p-6 text-left transition ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-page-text)]/50'
                      }`}
                    >
                      <FileText className={`h-5 w-5 ${active ? 'text-[var(--slot4-on-accent)]' : 'text-[var(--slot4-accent)]'}`} />
                      <span className="editable-display mt-6 block text-[1.25rem] leading-[1.2] tracking-[-0.01em]">
                        {publicLabelFor(item.key, item.label)}
                      </span>
                      <span className={`mt-2 block text-[13px] leading-[1.55] ${active ? 'text-[var(--slot4-on-accent)]/70' : 'text-[var(--slot4-muted-text)]'}`}>
                        {item.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <form onSubmit={submit} className="rounded-3xl bg-[var(--slot4-panel-bg)] p-10 lg:p-14">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                      Filing {publicLabelFor(activeTask?.key || task, activeTask?.label || '').toLowerCase()}
                    </p>
                    <h2 className="editable-display mt-2 text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                    {session.name}
                  </span>
                </div>

                <div className="mt-8 space-y-6">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Working title" required />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Subject / category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="File or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Cover image URL (optional)" />
                  <textarea className={`${fieldClass} min-h-28 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="A short abstract" required />
                  <textarea className={`${fieldClass} min-h-52 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Body — context, notes, description" required />
                </div>

                {created ? (
                  <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)] p-5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                    <div>
                      <p className="editable-display text-lg leading-[1.2] text-[var(--slot4-page-text)]">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-[var(--slot4-muted-text)]">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button type="submit" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-medium text-[var(--slot4-on-accent)] transition-colors hover:bg-[var(--slot4-accent)]">
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
