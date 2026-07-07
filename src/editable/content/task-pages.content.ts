import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

// Public-facing surface is the Reference Library (pdf). The profile voice is
// kept for the direct-URL detail page only.
export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Long-form essays on the ideas behind the reference library.',
    description: 'Slow, considered writing on the practice and provenance of every study in the shelves.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Give each essay the room it needs.',
    chips: ['Long reads', 'Field notes', 'Editorial pacing'],
  },
  classified: {
    eyebrow: 'Notices',
    headline: 'Open calls, briefs, and short-lived offers.',
    description: 'A modest board of time-sensitive posts kept alongside the wider library.',
    filterLabel: 'Filter notice',
    secondaryNote: 'Quick to scan, easy to act on.',
    chips: ['Time sensitive', 'Open calls', 'Direct'],
  },
  sbm: {
    eyebrow: 'Shelves',
    headline: 'Curated links, tools, and reference points.',
    description: 'Small, deliberately maintained shelves for the sources we return to.',
    filterLabel: 'Filter shelf',
    secondaryNote: 'Grouped by intent, not by date.',
    chips: ['Curated', 'Reference', 'Small collections'],
  },
  profile: {
    eyebrow: 'Contributor',
    headline: 'A living record of a person who shapes the library.',
    description: 'A quiet profile page for a contributor — reachable only from the works they have signed.',
    filterLabel: 'Filter contributors',
    secondaryNote: 'A record, not a directory.',
    chips: ['Attribution', 'Provenance', 'Bio'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A slow-built shelf of studies, briefs, and field guides.',
    description: 'Downloadable references, field notes, and long documents kept in one calm library. Every entry opens as a full document with preview, quick facts, and a plain download.',
    filterLabel: 'Filter subject area',
    secondaryNote: 'Read what is here. Take what you need.',
    chips: ['Studies', 'Field notes', 'Briefs', 'Long reads'],
  },
  listing: {
    eyebrow: 'Places',
    headline: 'Curated destinations tied to the library’s subjects.',
    description: 'Locations we point to, the way a study points to a footnote.',
    filterLabel: 'Filter place',
    secondaryNote: 'Places worth writing down.',
    chips: ['Curated', 'Field visits', 'Referenced'],
  },
  image: {
    eyebrow: 'Portfolio',
    headline: 'A visual field of standout imagery from the archive.',
    description: 'Photographs, plates, and diagrams pulled from the wider library.',
    filterLabel: 'Filter visual',
    secondaryNote: 'Let the frames do the talking.',
    chips: ['Photographic', 'Editorial', 'Archive'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
