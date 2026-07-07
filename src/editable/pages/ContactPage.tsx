'use client'

import { FileText, MessageCircle, ScrollText } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: FileText, title: 'Submit a document', body: 'Send a study, brief, or field guide for the shelf. Attach the file, tell us how to credit you.' },
  { icon: ScrollText, title: 'File a correction', body: 'Spotted something out of date in an existing entry? Point us at it and we will fix it.' },
  { icon: MessageCircle, title: 'Everything else', body: 'A question, a note, a hello. The shelf is small and personal.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pb-40">
          <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {pagesContent.contact.eyebrow}
              </p>
              <h1 className="editable-display mt-8 text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
                {pagesContent.contact.title}
              </h1>
              <p className="mt-8 max-w-lg text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
                {pagesContent.contact.description}
              </p>
              <div className="mt-14 space-y-8">
                {lanes.map((lane) => (
                  <div key={lane.title} className="border-t border-[var(--editable-border)] pt-6">
                    <div className="flex items-start gap-6">
                      <lane.icon className="h-6 w-6 shrink-0 text-[var(--slot4-accent)]" />
                      <div>
                        <h2 className="editable-display text-[1.35rem] leading-[1.25] tracking-[-0.01em]">{lane.title}</h2>
                        <p className="mt-3 text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-3xl bg-[var(--slot4-panel-bg)] p-10 lg:p-14">
                <h2 className="editable-display text-[1.75rem] leading-[1.15] tracking-[-0.01em] sm:text-[2rem]">
                  {pagesContent.contact.formTitle}
                </h2>
                <div className="mt-8">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
