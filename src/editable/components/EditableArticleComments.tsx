'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory list */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-24 border-t border-[var(--tk-line)] pt-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Reader notes</p>
      <h3 className="editable-display mt-6 flex items-center gap-4 text-[1.75rem] leading-[1.15] tracking-[-0.01em] sm:text-[2rem]">
        <MessageCircle className="h-6 w-6 text-[var(--tk-accent)]" /> {all.length} {all.length === 1 ? 'note' : 'notes'}
      </h3>

      <form onSubmit={submit} className="mt-10 rounded-2xl bg-[var(--tk-raised)] p-8">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="w-full border-0 border-b border-[var(--tk-line)] bg-transparent py-3 text-base font-medium text-[var(--tk-text)] outline-none transition placeholder:text-[var(--tk-muted)] focus:border-[var(--tk-text)]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Leave a note…"
          rows={4}
          maxLength={1500}
          className="mt-5 w-full resize-y border-0 border-b border-[var(--tk-line)] bg-transparent py-3 text-[15px] leading-[1.75] text-[var(--tk-text)] outline-none transition placeholder:text-[var(--tk-muted)] focus:border-[var(--tk-text)]"
        />
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition-colors hover:bg-[var(--tk-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Leave the note
          </button>
        </div>
      </form>

      <div className="mt-12 grid gap-y-0">
        {all.map((comment) => (
          <div key={comment.id} className="grid gap-6 border-t border-[var(--tk-line)] py-8 sm:grid-cols-[60px_1fr]">
            <span className="editable-display flex h-11 w-11 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-lg text-[var(--tk-accent)]">
              {initial(comment.name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--tk-text)]">{comment.name || 'Guest'}</p>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.75] text-[var(--tk-text)]">{comment.comment}</p>
            </div>
          </div>
        ))}
        {!all.length ? (
          <p className="border-t border-[var(--tk-line)] py-8 text-sm text-[var(--tk-muted)]">Be the first to leave a note.</p>
        ) : null}
      </div>
    </section>
  )
}
