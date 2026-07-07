import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Warm editorial task surfaces (Fabian-inspired).

  Every task shares one visual language: cream canvas, espresso ink, olive accent,
  Fraunces + Inter. Only kicker/note copy varies. Renamed display labels:
  - pdf     → "Reference Library"
  - profile → "Contributor" (only surfaced on the profile detail page)
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Fraunces', 'Times New Roman', Georgia, serif"
const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f5f1e9',
  surface: '#ffffff',
  raised: '#eee7db',
  text: '#291505',
  muted: '#645d57',
  line: '#e1dcd2',
  accent: '#6f7d40',
  accentSoft: '#e6e7d3',
  onAccent: '#f5f1e9',
  glow: 'rgba(111,125,64,0.10)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long-form reads, essays, and quiet analysis.' },
  listing: { ...base, kicker: 'Places', note: 'Curated destinations and directory records.' },
  classified: { ...base, kicker: 'Notices', note: 'Time-sensitive offers and open calls.' },
  image: { ...base, kicker: 'Portfolio', note: 'A visual field of standout imagery.' },
  sbm: { ...base, kicker: 'Shelves', note: 'Curated links, tools, and reference points.' },
  pdf: { ...base, kicker: 'Reference document', note: 'Downloadable studies, briefs, and field guides.' },
  profile: { ...base, kicker: 'Contributor', note: 'A living record of a person who shapes the library.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
