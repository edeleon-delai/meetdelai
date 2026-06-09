/**
 * Generates public/sitemap.xml + public/robots.txt for meetdelai.com.
 * Pulls article slugs from the DELAI API so the sitemap stays current.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGIN = 'https://meetdelai.com';
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

async function main() {
  const articles = await fetchArticles();
  const urls: string[] = [
    urlBlock('/', 1.0, 'weekly'),
    urlBlock('/intelligence', 0.9, 'daily'),
    urlBlock('/products/signal', 0.8, 'monthly'),
    urlBlock('/machine', 0.6, 'monthly'),
  ];
  for (const a of articles) {
    urls.push(urlBlock(`/intelligence/${a.slug}`, 0.8, 'monthly', (a.published_at ?? '').slice(0, 10) || today));
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`;
  writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap);
  writeFileSync(join(ROOT, 'public', 'robots.txt'), robots);
  console.log(`[sitemap] wrote ${urls.length} URLs to public/sitemap.xml`);
}

main().catch((err) => {
  console.error('[sitemap] failed:', err);
  process.exit(1);
});
