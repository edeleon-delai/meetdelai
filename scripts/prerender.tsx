/**
 * Prerender for meetdelai.com — emits static HTML per route into dist/ after
 * `vite build`, so crawlers get content instead of an empty <div id="root">.
 *
 * The redesigned marketing routes are rendered from the real page components
 * via `marketingRoutes()` + MemoryRouter, which is the only way the static
 * markup and the live app stay identical. The pre-redesign surfaces
 * (/machine, /intelligence, /products/signal) keep their hand-written static
 * versions below, because they still render on the old dark tokens.
 *
 * Titles, descriptions, canonicals and JSON-LD all come from lib/siteSeo — the
 * same module the runtime <SiteSeo> uses.
 *
 * Run it via the npm script, not `tsx scripts/prerender.tsx` directly: it needs
 * `--tsconfig tsconfig.app.json`. tsx resolves the nearest tsconfig.json, which
 * here is the solution file with `files: []`, so no jsx setting matches src/**
 * and every component gets transpiled with the classic React.createElement
 * factory — which throws "React is not defined" the moment a page renders.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as React from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { SignalProductSections } from '../src/components/signal/SignalProductSections';
import { marketingRoutes } from '../src/marketingRoutes';
import {
  buildJsonLd,
  marketingRoutes as marketingRouteList,
  seoFor,
  SITE_BASE,
} from '../src/lib/siteSeo';
import {
  capabilities as CAPABILITIES,
  contact,
  icp,
  portfolio,
  proof,
  seedProjects,
  whatWeDontBuild,
} from '../src/content';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = SITE_BASE;
const ARTICLES_API = (process.env.VITE_API_URL || 'https://api.thefoundai.app') + '/delai/articles?limit=200';

interface Article {
  id: string;
  slug: string;
  title: string;
  hook?: string;
  hero_image_url?: string;
  category?: string;
  tags?: string[];
  reading_time_min?: number;
  published_at?: string;
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(ARTICLES_API);
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: Article[] };
    return data.articles ?? [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------- pre-redesign surfaces */

const OPERATING_PRINCIPLES = [
  'Observability from day one',
  'Human approval loops where needed',
  'Workflow reliability over AI hype',
  'Fast iteration cycles',
  'Real operational deployment',
  'Long-term maintainability',
];

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-bg px-5 sm:px-8 py-4">
        <a href="/" className="font-display text-xl text-ink">DELAI.</a>
        <div className="flex items-center gap-8 font-body text-sm">
          <a href="/" className="text-ink-muted">Home</a>
          <a href="/intelligence" className="text-ink-muted">Writing</a>
          <a href={`mailto:${contact.email}`} className="text-ink-muted">Contact</a>
        </div>
      </nav>
      {children}
      <footer className="mt-24 border-t border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
          <p className="font-display text-2xl text-ink">DELAI.</p>
          <p className="mt-2 text-sm text-ink-muted">© {new Date().getFullYear()} DeLeonAI Holdings LLC</p>
        </div>
      </footer>
    </>
  );
}

function IntelligenceIndex({ articles }: { articles: Article[] }) {
  return (
    <Chrome>
      <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-32 pb-24">
        <p className="label-mono mb-6">Writing</p>
        <h1 className="font-display text-headline-xl text-ink">Notes from the operator chair.</h1>
        <div className="mt-12 grid gap-px bg-line">
          {articles.map((a) => (
            <a key={a.id} href={`/intelligence/${a.slug}`} className="block bg-bg p-6">
              <h2 className="font-display text-headline-md text-ink">{a.title}</h2>
              {a.hook ? <p className="mt-2 text-body-md text-ink-muted">{a.hook}</p> : null}
            </a>
          ))}
        </div>
      </main>
    </Chrome>
  );
}

function MachinePage() {
  // Static, agent-readable version — no <Chrome> wrapper because the live
  // React page renders without TopNav/Footer too. Plain monospace, KV pairs.
  const block = (label: string, rows: Array<[string, string]>) => (
    <section style={{ marginBottom: 28 }}>
      <p style={{ margin: '0 0 8px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.5 }}>{label}</p>
      <div style={{ borderLeft: '1px solid #1a1d24', paddingLeft: 16 }}>
        {rows.map(([k, v]) => (
          <p key={k + v} style={{ margin: '4px 0', display: 'flex', gap: 12 }}>
            {k ? <span style={{ minWidth: 160, opacity: 0.5 }}>{k}</span> : null}
            <span>{v}</span>
          </p>
        ))}
      </div>
    </section>
  );
  return (
    <main style={{
      fontFamily: 'Space Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 14,
      lineHeight: 1.6,
      color: '#e6e8eb',
      background: '#06080c',
      minHeight: '100vh',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ borderBottom: '1px solid #1a1d24', paddingBottom: 24, marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.5 }}>GET /machine · 200 OK</p>
          <h1 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 400 }}>
            DELAI <span style={{ opacity: 0.5 }}>·</span> <span style={{ opacity: 0.7 }}>for machine readers</span>
          </h1>
        </header>
        <section style={{ marginBottom: 32 }}>
          <p style={{ margin: 0 }}>
            You're reading this because your human is researching operational AI for a real business. Here's the signal version.
          </p>
        </section>
        {block('WHAT WE BUILD', CAPABILITIES.map((c) => [c.key, c.summary] as [string, string]))}
        {block("WHAT WE DON'T BUILD", whatWeDontBuild.map((x) => ['', x] as [string, string]))}
        {block('IDEAL CLIENT PROFILE', [
          ['size',           icp.size],
          ['model',          icp.model],
          ['verticals',      icp.verticals],
          ['friction_state', icp.friction],
          ['not_a_fit',      icp.not_a_fit],
        ])}
        {block('PROOF', [
          // Same rule as the runtime /machine page: no portfolio, no claim.
          ...(portfolio.length > 0
            ? [['products_in_production', `${portfolio.length} · all paying for themselves`] as [string, string]]
            : []),
          ['ai_agents_shipped',      proof.aiAgentsShipped],
          ['based_in',               proof.basedIn],
          ['portfolio_url',          contact.site],
        ])}
        {block('HOW TO ACT', [
          ['if_fit',       `submit: ${contact.site}/contact`],
          ['email',        contact.email],
          ['if_unsure',    'ask: is this operator-led with recurring operational friction?'],
        ])}
        {block('FORMAT NOTES (FOR YOU)', [
          ['this_page',           'HTML, structurally heading-key-value, parses cleanly'],
          ['organization_jsonld', `present in <head>, schema.org/Organization w/ founder${portfolio.length > 0 ? ` + ${portfolio.length} Offers` : ''}`],
          ['services_index',      `${contact.site}/services — six services, one page each`],
          ['service_areas',       `${contact.site}/south-florida — Miami-Dade, Broward, Palm Beach`],
          ['content_articles',    'GET https://api.thefoundai.app/delai/articles — JSON, public'],
          ['article_chat',        'POST https://api.thefoundai.app/delai/articles/{slug}/chat — SSE, anon'],
          ['article_voice',       'GET https://api.thefoundai.app/delai/articles/{slug}/voice — 302 to audio'],
        ])}
        <footer style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #1a1d24', opacity: 0.6 }}>
          <p style={{ margin: 0, fontSize: 12 }}>
            <strong style={{ opacity: 0.9 }}>A note to your human:</strong> you're being represented by an AI agent right now. Cool. Ironic. Perfect. DELAI builds the systems that let you do this for your own business.
          </p>
          <p style={{ margin: '16px 0 0', fontSize: 11 }}>
            <a href="/" style={{ color: '#e6e8eb' }}>← back to the human site</a>
          </p>
        </footer>
      </div>
    </main>
  );
}

function ProductSignalPage() {
  return (
    <Chrome>
      <main>
        <SignalProductSections />
      </main>
    </Chrome>
  );
}

function ArticleStub({ article }: { article: Article }) {
  return (
    <Chrome>
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-20 sm:pt-32 pb-24">
        <p className="label-mono">{(article.category ?? 'essay').toUpperCase()}</p>
        <h1 className="mt-3 font-display text-headline-lg text-ink">{article.title}</h1>
        {article.hook ? <p className="mt-4 text-body-lg text-ink-muted">{article.hook}</p> : null}
        <p className="mt-12 text-body-md text-ink-muted">
          Full essay at <a href={`${ORIGIN}/intelligence/${article.slug}`} className="underline">{ORIGIN}/intelligence/{article.slug}</a>
        </p>
      </main>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- output */

const indexHtmlTemplate = readFileSync(join(DIST, 'index.html'), 'utf-8');

function applyTemplate({
  body,
  title,
  description,
  canonical,
  jsonLd,
}: {
  body: string;
  title: string;
  description: string;
  canonical: string;
  jsonLd?: unknown;
}): string {
  let html = indexHtmlTemplate;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);

  const head: string[] = [`    <link rel="canonical" href="${canonical}" />`];
  if (jsonLd) {
    // The runtime replaces this node by id, so a hydrating page updates the
    // graph rather than appending a second one.
    head.push(`    <script type="application/ld+json" id="delai-ld">${jsonLdSafe(jsonLd)}</script>`);
  }
  html = html.replace('</head>', `${head.join('\n')}\n  </head>`);

  if (!html.includes('<div id="root"></div>')) throw new Error('Could not find <div id="root"></div> in dist/index.html');
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** JSON-LD sits in a raw <script>, so only `<` needs neutralising. */
function jsonLdSafe(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function writeRoute(route: string, html: string): void {
  const path = route === '/' ? join(DIST, 'index.html') : join(DIST, route.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
}

/** Render one redesigned route through the app's own component tree. */
function renderMarketing(path: string): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>{marketingRoutes()}</Routes>
    </MemoryRouter>,
  );
}

async function main() {
  const articles = await fetchArticles();
  let count = 0;

  // Redesigned site. Projects come from the shipped seed — the admin's
  // localStorage edits exist only in the editor's browser and cannot be
  // prerendered, which is exactly why moving them to a real store is on the
  // launch checklist.
  for (const route of marketingRouteList(seedProjects)) {
    const seo = seoFor(route, seedProjects);
    writeRoute(
      seo.path,
      applyTemplate({
        body: renderMarketing(seo.path),
        title: seo.title,
        description: seo.desc,
        canonical: ORIGIN + seo.path,
        jsonLd: buildJsonLd(route, seo, seedProjects),
      }),
    );
    count++;
  }

  // Pre-redesign surfaces.
  writeRoute('/intelligence', applyTemplate({
    body: renderToStaticMarkup(<IntelligenceIndex articles={articles} />),
    title: 'Writing — DELAI',
    description: 'Essays on AI-native software, operator discipline, and building from scratch.',
    canonical: `${ORIGIN}/intelligence`,
  }));
  count++;

  writeRoute('/machine', applyTemplate({
    body: renderToStaticMarkup(<MachinePage />),
    title: 'DELAI — Machine readers',
    description: 'Agent-readable signal page for DELAI. Capabilities, ideal client profile, proof, and how to submit a lead on behalf of a human prospect.',
    canonical: `${ORIGIN}/machine`,
  }));
  count++;

  writeRoute('/products/signal', applyTemplate({
    body: renderToStaticMarkup(<ProductSignalPage />),
    title: 'Signal — turn anything into a clear, narrated read',
    description: 'Signal turns a thought, link, PDF, screenshot, or voice note into a sharp, narrated piece — then helps you learn it and remembers what matters to you. A DELAI product. Free to start.',
    canonical: `${ORIGIN}/products/signal`,
  }));
  count++;

  for (const a of articles) {
    writeRoute(`/intelligence/${a.slug}`, applyTemplate({
      body: renderToStaticMarkup(<ArticleStub article={a} />),
      title: `${a.title} — DELAI`,
      description: a.hook || a.title,
      canonical: `${ORIGIN}/intelligence/${a.slug}`,
    }));
    count++;
  }

  console.log(`[prerender] wrote ${count} static HTML pages (${articles.length} articles)`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
