/**
 * Typed accessor for content/site.json — the single source of truth for
 * meetdelai.com's marketing content.
 *
 * Everything that used to be hardcoded in more than one place (the product
 * portfolio, capability map, ICP, meta copy) lives in that one file now. It
 * bit us once already: the portfolio list existed in five places across two
 * repos, so removing a retired product from the footer left it live in the
 * JSON-LD, llms.txt, the prerendered HTML, and the MCP get_services tool.
 *
 * Consumers: Footer.tsx, Seo.tsx, scripts/generate-llms-txt.ts,
 * scripts/prerender.tsx, and — over HTTP — the DELAI MCP server, which reads
 * the copy published at /site-content.json.
 *
 * If you need a new content field, add it here, not to a component.
 */
import raw from '../content/site.json';
import rawServices from '../content/services.json';
import rawLocations from '../content/locations.json';
import rawProjects from '../content/projects.json';

export interface PortfolioItem {
  /** Display name, e.g. "PAGE". */
  name: string;
  /** Public URL. Shown as the footer link target. */
  url: string;
  /** Short footer suffix, e.g. "Payments". */
  tag: string;
  /** Sentence-long description used by JSON-LD, llms.txt, and the MCP. */
  blurb: string;
}

export interface Capability {
  /** Stable snake_case id — the row key on /machine. Don't rename casually. */
  key: string;
  name: string;
  /** Terse form for /machine and the MCP's get_services payload. */
  summary: string;
  /** Sentence form for llms.txt and the rendered pages. */
  body: string;
}

export interface Icp {
  size: string;
  model: string;
  verticals: string;
  friction: string;
  not_a_fit: string;
}

export interface SiteContent {
  brand: string;
  legalName: string;
  founder: string;
  tagline: string;
  footerBlurb: string;
  summary: string;
  about: string;
  meta: { title: string; description: string; ogDescription: string };
  portfolio: PortfolioItem[];
  capabilities: Capability[];
  whatWeDontBuild: string[];
  icp: Icp;
  proof: { aiAgentsShipped: string; basedIn: string };
  contact: { email: string; site: string; machineReadersPage: string };
}

/**
 * `content/site.json` carries a leading `_comment` for whoever opens the file
 * (agents included). It is documentation, not content — strip it so it can
 * never leak into a rendered page or the published /site-content.json.
 */
const { _comment: _ignored, ...content } = raw as SiteContent & { _comment?: string };

export const site: SiteContent = content;

export const {
  brand,
  legalName,
  founder,
  tagline,
  footerBlurb,
  summary,
  about,
  meta,
  portfolio,
  capabilities,
  whatWeDontBuild,
  icp,
  proof,
  contact,
} = site;

/* ------------------------------------------------------------------ *
 * Services, service areas, and case studies.
 *
 * Same discipline as site.json, three more files. `content/site.json`
 * is validated by the admin MCP's schema (mcm-agents ->
 * api/lib/delai-content-schema.ts), so bolting six services and seven
 * city pages onto it as new top-level keys would risk failing that
 * validation on the next update_site_content call. They live in
 * sibling files instead, behind the same rule: the copy exists once,
 * here, and every surface derives from it.
 * ------------------------------------------------------------------ */

/** One "what this looks like in practice" card on a service page. */
export interface ServiceExample {
  t: string;
  d: string;
}

export interface Service {
  /** URL segment: /services/<slug>. Don't rename — it's an indexed URL. */
  slug: string;
  /** Two-digit display index, e.g. "01". Ordering is the array's. */
  num: string;
  title: string;
  /** One sentence. Cards, footer, and JSON-LD Offer description. */
  lead: string;
  metaTitle: string;
  metaDesc: string;
  /** The "short version" paragraph at the top of the detail page. */
  overview: string;
  examples: ServiceExample[];
  deliverables: string[];
  /** "You probably need this if…" bullets. */
  signals: string[];
  /** Primary button label on the detail page. */
  cta: string;
}

export interface Location {
  /** URL segment: /south-florida/<slug>. Don't rename — indexed URL. */
  slug: string;
  city: string;
  /** County / administrative area, used for the JSON-LD areaServed. */
  region: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  lead: string;
  body: string;
  areas: string[];
  industries: string[];
}

export type ProjectStatus = 'draft' | 'in_review' | 'published';

/** Who last authored the record — a person, or the Hermes agent. */
export type ProjectSource = 'human' | 'hermes';

export interface Project {
  id: string;
  /** URL segment: /work/<slug>. */
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  /** Only `published` is visible on the public site. */
  status: ProjectStatus;
  featured: boolean;
  source: ProjectSource;
  /** Optional external URL for a live product. */
  link: string;
  summary: string;
  challenge: string;
  /** Newline-delimited: one "what we built" bullet per line. */
  approach: string;
  result: string;
  /** Comma-separated. Split at render time, not in storage. */
  tags: string;
  /** DOM id of the admin Media tab's image slot for this project. */
  coverId: string;
  /** Cover image URL, or '' for none. Public pages omit the block. */
  cover: string;
  /** ISO date (YYYY-MM-DD) of the last edit. */
  updated: string;
}

const { _comment: _s, ...servicesDoc } = rawServices as { _comment?: string; services: Service[] };
const { _comment: _l, ...locationsDoc } = rawLocations as { _comment?: string; locations: Location[] };
const { _comment: _p, ...projectsDoc } = rawProjects as { _comment?: string; projects: Project[] };

export const services: Service[] = servicesDoc.services;
export const locations: Location[] = locationsDoc.locations;

/**
 * Shipped baseline for /work. The admin overlays a locally-edited copy at
 * runtime (see src/lib/portfolio.ts) — read that, not this, anywhere the
 * user's own edits should win.
 */
export const seedProjects: Project[] = projectsDoc.projects;

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const locationBySlug = (slug: string): Location | undefined =>
  locations.find((l) => l.slug === slug);
