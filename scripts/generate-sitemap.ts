/**
 * Generates public/sitemap.xml + public/robots.txt for meetdelai.com.
 *
 * Marketing URLs come from lib/siteSeo's route list, so adding a service or a
 * service-area page adds it to the sitemap with no edit here. Article slugs are
 * pulled from the DELAI API so the sitemap stays current.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marketingRoutes, seoFor, SITE_BASE } from '../src/lib/siteSeo';
import { seedProjects } from '../src/content';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGIN = SITE_BASE;
const ARTICLES_API = (process.env.VITE_API_URL || 'https://api.thefoundai.app') + '/delai/articles?limit=200';

const today = new Date().toISOString().slice(0, 10);

interface Article { slug: string; published_at?: string }

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

function urlBlock(path: string, priority = 0.7, changefreq = 'weekly', lastmod = today): string {
  return `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/** Homepage outranks everything; the money pages outrank the legacy ones. */
function priorityFor(path: string): [number, string] {
  if (path === '/') return [1.0, 'weekly'];
  if (path === '/services' || path === '/work' || path === '/south-florida') return [0.9, 'weekly'];
  if (path === '/contact') return [0.8, 'monthly'];
  return [0.8, 'monthly'];
}

async function main() {
  const articles = await fetchArticles();

  const urls: string[] = [];
  for (const route of marketingRoutes(seedProjects)) {
    const { path } = seoFor(route, seedProjects);
    const [priority, changefreq] = priorityFor(path);
    urls.push(urlBlock(path, priority, changefreq));
  }

  // Pre-redesign surfaces that are still live.
  urls.push(urlBlock('/intelligence', 0.9, 'daily'));
  urls.push(urlBlock('/products/signal', 0.8, 'monthly'));
  urls.push(urlBlock('/machine', 0.6, 'monthly'));
  for (const a of articles) {
    urls.push(urlBlock(`/intelligence/${a.slug}`, 0.8, 'monthly', (a.published_at ?? '').slice(0, 10) || today));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  // /admin is Disallow'd here *and* meta-noindex'd in SiteSeo. It is not
  // prerendered either, so there is no static copy to crawl.
  //
  // The llms.txt pointer block below used to live only in the committed
  // robots.txt, and this generator overwrote it on every build — silently
  // stripping seven lines each time (issue #7). It is part of the template now,
  // so regenerating is idempotent.
  const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${ORIGIN}/sitemap.xml

# Agent-readable index (llms.txt convention — https://llmstxt.org)
# Important URLs + a /machine signal page + a /llms-full.txt long-form export.
# Agents acting on behalf of human prospects: start here.
#   llms.txt:      ${ORIGIN}/llms.txt
#   llms-full.txt: ${ORIGIN}/llms-full.txt
#   /machine:      ${ORIGIN}/machine
`;

  writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap);
  writeFileSync(join(ROOT, 'public', 'robots.txt'), robots);
  console.log(`[sitemap] wrote ${urls.length} URLs to public/sitemap.xml`);
}

main().catch((err) => {
  console.error('[sitemap] failed:', err);
  process.exit(1);
});
