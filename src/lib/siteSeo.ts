/**
 * Per-route SEO for the marketing site: titles, descriptions, canonicals, and
 * the schema.org graph.
 *
 * Ported from the redesign comp's applySEO/buildLD. It is deliberately a pure
 * data module — the runtime pages and the build-time prerenderer both call it,
 * so the static HTML a crawler gets and the tags React sets on navigation
 * cannot drift apart.
 *
 * Every string here comes from content/*.json via src/content.ts. Nothing is
 * restated locally.
 */
import {
  contact,
  locationBySlug,
  locations,
  serviceBySlug,
  services,
  type Project,
} from '../content';

export type SiteRoute =
  | { name: 'home' }
  | { name: 'services' }
  | { name: 'service'; slug: string }
  | { name: 'work' }
  | { name: 'project'; slug: string }
  | { name: 'areas' }
  | { name: 'location'; slug: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'admin' };

export interface RouteSeo {
  title: string;
  desc: string;
  path: string;
  noindex?: boolean;
}

/** Canonical origin, no trailing slash. */
export const SITE_BASE = contact.site.replace(/\/$/, '');

const DEFAULT_SEO: RouteSeo = {
  title: 'DELAI — AI Automation Company in South Florida',
  desc: 'DELAI designs, builds, connects, and operates AI systems for small and medium businesses in Miami, Fort Lauderdale, Broward, and Palm Beach County.',
  path: '/',
};

export function seoFor(route: SiteRoute, projects: Project[] = []): RouteSeo {
  switch (route.name) {
    case 'services':
      return {
        title: 'AI Automation Services for South Florida Businesses | DELAI',
        desc: 'Six services: AI workflow automation, business process automation, AI systems and frameworks, internal AI tools, customer-facing AI applications, and connected operational systems.',
        path: '/services',
      };
    case 'service': {
      const s = serviceBySlug(route.slug);
      return s
        ? { title: s.metaTitle, desc: s.metaDesc, path: `/services/${s.slug}` }
        : DEFAULT_SEO;
    }
    case 'work':
      return {
        title: "AI Systems & Products We've Built | DELAI Portfolio",
        desc: 'Case studies from DELAI: AI applications, internal tools, and connected operational systems built for businesses in South Florida.',
        path: '/work',
      };
    case 'project': {
      const p = projects.find((x) => x.slug === route.slug);
      return p
        ? {
            title: `${p.title} — Case Study | DELAI`,
            desc: String(p.summary ?? '').slice(0, 300),
            path: `/work/${p.slug}`,
          }
        : DEFAULT_SEO;
    }
    case 'areas':
      return {
        title: 'AI Automation Across South Florida | Miami, Fort Lauderdale, Broward, Palm Beach',
        desc: 'DELAI serves businesses across South Florida with AI automation and custom systems — on-site in Miami-Dade, Broward, and Palm Beach County.',
        path: '/south-florida',
      };
    case 'location': {
      const l = locationBySlug(route.slug);
      return l
        ? { title: l.metaTitle, desc: l.metaDesc, path: `/south-florida/${l.slug}` }
        : DEFAULT_SEO;
    }
    case 'about':
      return {
        title: 'About DELAI | AI Systems Company in South Florida',
        desc: 'DELAI is a South Florida AI technology company. We design, build, connect, and help operate AI-powered systems inside small and medium businesses.',
        path: '/about',
      };
    case 'contact':
      return {
        title: 'Contact DELAI | AI Automation in Miami & Fort Lauderdale',
        desc: 'Talk to DELAI about your first automation. Serving Miami-Dade, Broward, and Palm Beach County.',
        path: '/contact',
      };
    case 'admin':
      return { title: 'Portfolio Admin | DELAI', desc: '', path: '/admin', noindex: true };
    default:
      return DEFAULT_SEO;
  }
}

const AREA_SERVED_NAMES = [
  'Miami, FL',
  'Miami-Dade County, FL',
  'Fort Lauderdale, FL',
  'Broward County, FL',
  'West Palm Beach, FL',
  'Palm Beach County, FL',
  'Boca Raton, FL',
  'Hollywood, FL',
  'Coral Gables, FL',
  'South Florida',
];

type Node = Record<string, unknown>;

export function buildJsonLd(
  route: SiteRoute,
  seo: RouteSeo,
  projects: Project[] = [],
  base: string = SITE_BASE,
): Node {
  const areaServed = AREA_SERVED_NAMES.map((name) => ({ '@type': 'City', name }));

  const org: Node = {
    '@type': ['ProfessionalService', 'LocalBusiness', 'Organization'],
    '@id': `${base}/#organization`,
    name: 'DELAI',
    legalName: 'DELAI Solutions LLC',
    alternateName: 'DELAI Solutions',
    url: `${base}/`,
    email: contact.email,
    description:
      'DELAI is a South Florida AI technology company. We design, build, connect, and help operate AI workflow automation, business process automation, AI systems, internal AI tools, customer-facing AI applications, and connected operational systems for small and medium businesses.',
    slogan: 'We build the AI systems that run the work.',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      postalCode: '33131',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.7617, longitude: -80.1918 },
    areaServed,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    knowsAbout: [
      'AI workflow automation',
      'Business process automation',
      'AI systems and frameworks',
      'Internal AI tools',
      'Customer-facing AI applications',
      'System integration',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI systems and automation services',
      itemListElement: services.map((sv) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: sv.title,
          description: sv.lead,
          url: `${base}/services/${sv.slug}`,
          areaServed: 'South Florida',
        },
      })),
    },
  };

  const graph: Node[] = [
    org,
    {
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      url: `${base}/`,
      name: 'DELAI',
      publisher: { '@id': `${base}/#organization` },
    },
  ];

  const crumbs: Array<{ name: string; path: string }> = [{ name: 'Home', path: '/' }];
  if (route.name === 'service' || route.name === 'services') crumbs.push({ name: 'Services', path: '/services' });
  if (route.name === 'project' || route.name === 'work') crumbs.push({ name: 'Work', path: '/work' });
  if (route.name === 'location' || route.name === 'areas') crumbs.push({ name: 'South Florida', path: '/south-florida' });
  if (seo.path !== '/' && crumbs[crumbs.length - 1].path !== seo.path) {
    crumbs.push({ name: seo.title.split('|')[0].trim(), path: seo.path });
  }
  if (crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: base + c.path,
      })),
    });
  }

  if (route.name === 'service') {
    const sv = serviceBySlug(route.slug);
    if (sv) {
      graph.push({
        '@type': 'Service',
        name: sv.title,
        serviceType: sv.title,
        description: sv.metaDesc,
        provider: { '@id': `${base}/#organization` },
        areaServed,
        url: `${base}/services/${sv.slug}`,
      });
    }
  }

  if (route.name === 'location') {
    const l = locationBySlug(route.slug);
    if (l) {
      graph.push({
        '@type': 'Service',
        name: `AI automation and systems in ${l.city}`,
        description: l.metaDesc,
        provider: { '@id': `${base}/#organization` },
        areaServed: { '@type': 'AdministrativeArea', name: l.region },
        url: `${base}/south-florida/${l.slug}`,
      });
    }
  }

  if (route.name === 'project') {
    const p = projects.find((x) => x.slug === route.slug);
    if (p) {
      graph.push({
        '@type': 'Article',
        headline: `${p.title} — Case Study`,
        description: p.summary,
        author: { '@id': `${base}/#organization` },
        publisher: { '@id': `${base}/#organization` },
        dateModified: p.updated,
        mainEntityOfPage: `${base}/work/${p.slug}`,
      });
    }
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Every indexable marketing URL, for the sitemap and the prerenderer. */
export function marketingRoutes(projects: Project[]): SiteRoute[] {
  return [
    { name: 'home' },
    { name: 'services' },
    ...services.map((s): SiteRoute => ({ name: 'service', slug: s.slug })),
    { name: 'work' },
    ...projects
      .filter((p) => p.status === 'published')
      .map((p): SiteRoute => ({ name: 'project', slug: p.slug })),
    { name: 'areas' },
    ...locations.map((l): SiteRoute => ({ name: 'location', slug: l.slug })),
    { name: 'about' },
    { name: 'contact' },
  ];
}
