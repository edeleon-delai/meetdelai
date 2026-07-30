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
