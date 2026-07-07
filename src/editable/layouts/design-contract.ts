import type { CSSProperties } from 'react'

// Fabian-inspired warm editorial system.
// - Ivory canvas (#f5f1e9), deep espresso ink (#291505), olive accent (#6f7d40).
// - Fraunces serif display + Inter humanist body (see editable-global.css).
// - Pill buttons, 12–16px card radii, 80/120/160 section rhythm.
export const editableRootStyle = {
  '--slot4-page-bg': '#f5f1e9',
  '--slot4-page-text': '#291505',
  '--slot4-panel-bg': '#eee7db',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#645d57',
  '--slot4-soft-muted-text': '#8a827b',
  '--slot4-accent': '#6f7d40',
  '--slot4-accent-fill': '#6f7d40',
  '--slot4-accent-soft': '#e6e7d3',
  '--slot4-on-accent': '#f5f1e9',
  '--slot4-dark-bg': '#291505',
  '--slot4-dark-text': '#f5f1e9',
  '--slot4-media-bg': '#e5e0d8',
  '--slot4-cream': '#f5f1e9',
  '--slot4-warm': '#eee7db',
  '--slot4-lavender': '#e5e0d8',
  '--slot4-gray': '#e1dcd2',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f5f1e9',
  '--editable-page-text': '#291505',
  '--editable-container': '1216px',
  '--editable-border': '#e1dcd2',
  '--editable-nav-bg': '#f5f1e9',
  '--editable-nav-text': '#291505',
  '--editable-nav-active': '#6f7d40',
  '--editable-nav-active-text': '#f5f1e9',
  '--editable-cta-bg': '#291505',
  '--editable-cta-text': '#f5f1e9',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#291505',
  '--editable-footer-text': '#f5f1e9',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_1px_2px_rgba(41,21,5,0.04)]',
  shadowStrong: 'shadow-[0_24px_60px_rgba(41,21,5,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(41,21,5,0.04),rgba(41,21,5,0.66))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.75rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[4.25rem]',
    sectionTitle: 'editable-display text-[2rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem]',
    displayText: 'editable-display text-[3rem] leading-[1] tracking-[-0.01em] sm:text-[3.5rem]',
    body: 'text-[15px] leading-[1.75] sm:text-base',
    emphasis: 'editable-emphasis',
    lead: 'text-lg leading-[1.7] sm:text-xl sm:leading-[1.6] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-2xl ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium tracking-[-0.01em] text-[var(--slot4-on-accent)] transition-colors duration-500 hover:bg-[var(--slot4-accent)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 bg-transparent px-7 py-3.5 text-sm font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] transition-colors duration-500 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition-colors duration-500 hover:brightness-110`,
    ghost: `inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition-colors hover:text-[var(--slot4-accent)]`,
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/60 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    ratioLandscape: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-700 hover:-translate-y-1',
    fade: 'transition duration-500 hover:opacity-85',
    zoom: 'transition duration-[900ms] group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the site palette in editableRootStyle first; every downstream component consumes these vars.',
  'Keep section order in HomeSections.tsx so a full-home rewrite happens in one place.',
  'Serif display + humanist sans; headings are regular weight, not bold.',
  'Buttons are pill-shaped; cards use 16–24px radii with hairline borders.',
  'Reference Library (renamed pdf) is the only publicly-surfaced task feed.',
  'Use postHref() for all post links so task routes keep working.',
] as const
