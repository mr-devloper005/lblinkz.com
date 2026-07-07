import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A quiet reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A quiet reference library',
    // Navbar renders no task links per the spec. This kept for compatibility.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the library', href: '/pdf' },
      secondary: { label: 'Contribute', href: '/create' },
    },
  },
  footer: {
    tagline: 'Field studies and slow reference.',
    description: 'A small, slow-built reference library. Studies, briefs, and long documents kept in one place — read what is here, take what you need.',
    columns: [
      {
        title: 'Library',
        // Only the Reference Library appears in footer discovery.
        links: [{ label: 'Reference Library', href: '/pdf' }],
      },
      {
        title: 'About',
        links: [
          { label: 'The project', href: '/about' },
          { label: 'Get in touch', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Made deliberately, kept quiet.',
  },
  commonLabels: {
    readMore: 'Keep reading',
    viewAll: 'See the whole shelf',
    explore: 'Explore',
    latest: 'New to the shelf',
    related: 'Adjacent reading',
    published: 'Filed',
  },
} as const
