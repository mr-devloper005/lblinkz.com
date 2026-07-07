import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pb-40">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {pagesContent.about.badge}
              </p>
              <h1 className="editable-display mt-8 text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">
                {pagesContent.about.title.split(', ').map((chunk, i, arr) => (
                  <span key={i} className="block">
                    {i === arr.length - 1 && arr.length > 1 ? <span className="editable-emphasis">{chunk}</span> : `${chunk}${i < arr.length - 1 ? ',' : ''}`}
                  </span>
                ))}
              </h1>
            </EditableReveal>
            <EditableReveal index={1}>
              <p className="text-[19px] leading-[1.7] text-[var(--slot4-muted-text)] sm:text-[21px]">
                {pagesContent.about.description}
              </p>
              <div className="mt-10 space-y-6 text-[16px] leading-[1.85] text-[var(--slot4-muted-text)] sm:text-[17px]">
                {pagesContent.about.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        <section className="bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Principles</p>
              <h2 className="editable-display mt-6 max-w-3xl text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[3rem]">
                What guides the shelf.
              </h2>
            </EditableReveal>
            <div className="mt-16 grid gap-y-16 gap-x-12 lg:grid-cols-3">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <p className="editable-display text-4xl leading-none tracking-[-0.01em] text-[var(--slot4-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="editable-display mt-8 border-t border-[var(--editable-border)] pt-6 text-[1.5rem] leading-[1.2] tracking-[-0.01em]">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{value.description}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
