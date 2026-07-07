import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A quiet reference library',
      description: 'Studies, briefs, and field guides kept in one calm library. Read what is here, take what you need.',
      openGraphTitle: 'A quiet reference library',
      openGraphDescription: 'Studies, briefs, and field guides in one calm library.',
      keywords: ['reference library', 'studies', 'briefs', 'field guides', 'downloadable documents'],
    },
    hero: {
      badge: `A shelf, not a feed — ${slot4BrandConfig.siteName}`,
      title: ['A quiet library of', 'studies, briefs, and field guides.'],
      description: 'Every entry opens as a full document — preview, quick facts, and a plain download. Slowly kept, generously shared.',
      primaryCta: { label: 'Enter the library', href: '/pdf' },
      secondaryCta: { label: 'About the project', href: '/about' },
      searchPlaceholder: 'Search the library — a subject, a phrase, a filename',
      focusLabel: 'On the shelf',
      featureCardBadge: 'A new arrival',
      featureCardTitle: 'The most recent addition sits at the top of the shelf.',
      featureCardDescription: 'When a new document lands, the home page quietly rearranges itself around it.',
    },
    intro: {
      badge: 'About the shelf',
      title: 'A library, not a stream.',
      paragraphs: [
        'Every document here is a full reference: a study, a brief, a field guide. Nothing is a thumbnail for something else, and nothing is behind a wall.',
        'The library grows slowly and on purpose. New additions appear on the front page, older material stays exactly where it was left.',
        'Everything is open and downloadable — a page for reading, a button for taking.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A single shelf for studies, briefs, and field guides.',
        'Preview any document in full before you download.',
        'Categorised, tagged, and quietly kept up to date.',
        'Free to read. Free to take away.',
      ],
      primaryLink: { label: 'Open the library', href: '/pdf' },
      secondaryLink: { label: 'About the shelf', href: '/about' },
    },
    cta: {
      badge: 'Take one home',
      title: 'The library is open. Pick up what you need.',
      description: 'No sign-in required. Preview the document, take the file, come back when you want more.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'Say hello', href: '/contact' },
    },
    taskSection: {
      heading: 'New in the {label}',
      descriptionSuffix: 'Recent additions to the shelf.',
    },
  },
  about: {
    badge: 'About the project',
    title: 'A small library, slowly kept.',
    description: `${slot4BrandConfig.siteName} is a quiet reference library — studies, briefs, and field guides, made available in full.`,
    paragraphs: [
      'The project began as a private folder of documents worth returning to. Over time it became easier to keep everything in one place than to keep forwarding files around.',
      'Nothing here is behind a paywall or a sign-up form. Every entry is a full document with a preview, quick facts, and a plain download.',
      'It grows slowly and on purpose. The shelf is small enough to remember what is on it.',
    ],
    values: [
      {
        title: 'Read what is here',
        description: 'Every document is presented in full — preview the pages, skim the summary, take the file.',
      },
      {
        title: 'Kept, not curated',
        description: 'The library is a working shelf. Additions are considered, older material stays exactly where it was.',
      },
      {
        title: 'Openly shared',
        description: 'No accounts, no gates. If it is on the shelf, it is yours to take.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'Send a note — questions, submissions, or corrections.',
    description: 'The shelf is small and personal. If you have a document to contribute, a correction to file, or a question, this is the place.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search the reference library by subject, title, or phrase.',
    },
    hero: {
      badge: 'Search the shelf',
      title: 'Find a study, a brief, or a field guide.',
      description: 'Search by title, subject, or a phrase that appears inside the document.',
      placeholder: 'A subject, a phrase, a filename…',
    },
    resultsTitle: 'On the shelf',
  },
  create: {
    metadata: {
      title: 'Contribute a document',
      description: 'Contribute a study, brief, or field guide to the reference library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit to the shelf.',
      description: 'Contributors sign in to add a document to the reference library. Every submission is reviewed before it lands on the front page.',
    },
    hero: {
      badge: 'Contribute',
      title: 'Add a document to the shelf.',
      description: 'Upload a study, brief, or field guide. Attach the file, add subject notes, and let us know how you would like it credited.',
    },
    formTitle: 'Document details',
    submitLabel: 'Submit to the shelf',
    successTitle: 'Submission received.',
  },
  auth: {
    login: {
      metadataDescription: 'Contributor sign-in.',
      badge: 'Contributor access',
      title: 'Welcome back to the shelf.',
      description: 'Sign in to add a document, edit a submission, or review a draft.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create one first.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Contributor sign-up.',
      badge: 'Join the shelf',
      title: 'Create an account to contribute.',
      description: 'Contributors sign up to submit documents, keep track of their entries, and correct their own listings.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least four characters.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Adjacent reading',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'Related places',
      fallbackTitle: 'Place',
    },
    image: {
      relatedTitle: 'Adjacent frames',
      fallbackTitle: 'Frame',
    },
    profile: {
      relatedTitle: 'Their contributions',
      fallbackDescription: 'A record is being kept for this contributor.',
      visitButton: 'Visit their site',
    },
  },
} as const
