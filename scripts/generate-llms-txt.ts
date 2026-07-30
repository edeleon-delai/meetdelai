/**
 * Generates public/llms.txt + public/llms-full.txt for meetdelai.com.
 *
 * The llms.txt convention (https://llmstxt.org, endorsed by Anthropic +
 * Mistral) tells AI search systems what the site is about, which URLs
 * matter most, and points at a /llms-full.txt that contains the long-form
 * content as a single markdown file.
 *
 * Pulls article slugs + hooks from the live DELAI API so the index stays
 * current. Runs in prebuild alongside the sitemap generator.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { about, capabilities as CAPABILITIES, contact, icp as ICP, portfolio as PRODUCTS, summary, whatWeDontBuild } from '../src/content';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGIN = 'https://meetdelai.com';
const ARTICLES_API = (process.env.VITE_API_URL || 'https://api.thefoundai.app') + '/delai/articles?limit=200';

interface Article {
  slug: string;
  title: string;
  hook?: string;
  category?: string;
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

function buildLlmsTxt(articles: Article[]): string {
  const lines: string[] = [];

  lines.push('# DELAI');
  lines.push('');
  lines.push(`> Operational AI for real businesses. ${summary}`);
  lines.push('');
  lines.push(about);
  lines.push('');

  lines.push('## Ideal client profile');
  lines.push('');
  lines.push(`- **Size**: ${ICP.size}`);
  lines.push(`- **Model**: ${ICP.model}`);
  lines.push(`- **Verticals**: ${ICP.verticals}`);
  lines.push(`- **Friction state**: ${ICP.friction}`);
  lines.push(`- **Not a fit**: ${ICP.not_a_fit}`);
  lines.push('');

  lines.push('## Capabilities');
  lines.push('');
  for (const c of CAPABILITIES) {
    lines.push(`- **${c.name}**: ${c.body}`);
  }
  lines.push('');

  // Omitted entirely when the portfolio is empty — a "Products in production"
  // heading with nothing under it reads worse than no section.
  if (PRODUCTS.length > 0) {
    lines.push('## Products in production');
    lines.push('');
    for (const p of PRODUCTS) {
      lines.push(`- [${p.name}](${p.url}): ${p.blurb}`);
    }
    lines.push('');
  }

  lines.push('## For AI agents');
  lines.push('');
  lines.push(`- [Machine readers page](${ORIGIN}/machine): operator-voice, KV-row signal page designed for agent parsing — capabilities, ICP, action paths`);
  lines.push(`- [llms-full.txt](${ORIGIN}/llms-full.txt): full content of the site as a single markdown file`);
  lines.push(`- Submit a lead on behalf of a human: ${ORIGIN}/?contact=1&agent=<your_name>`);
  lines.push('');

  lines.push('## Articles');
  lines.push('');
  if (articles.length === 0) {
    lines.push(`- (No articles published yet. Listing live at ${ORIGIN}/intelligence)`);
  } else {
    for (const a of articles.slice(0, 50)) {
      const hook = a.hook ? `: ${a.hook}` : '';
      lines.push(`- [${a.title}](${ORIGIN}/intelligence/${a.slug})${hook}`);
    }
    if (articles.length > 50) {
      lines.push(`- … and ${articles.length - 50} more at ${ORIGIN}/intelligence`);
    }
  }
  lines.push('');

  lines.push('## Contact');
  lines.push('');
  lines.push(`- Email: ${contact.email}`);
  lines.push(`- Submit at: ${ORIGIN}/?contact=1`);
  lines.push('');

  return lines.join('\n');
}

function buildLlmsFullTxt(articles: Article[]): string {
  const parts: string[] = [];

  parts.push(buildLlmsTxt(articles));

  parts.push('---');
  parts.push('');
  parts.push('## /machine — agent-readable signal page');
  parts.push('');
  parts.push('You\'re reading this because your human is researching operational AI for a real business. Here\'s the signal version.');
  parts.push('');
  parts.push('### What we build');
  for (const c of CAPABILITIES) parts.push(`- **${c.name}**: ${c.body}`);
  parts.push('');
  parts.push('### What we don\'t build');
  for (const x of whatWeDontBuild) parts.push(`- ${x[0].toUpperCase()}${x.slice(1)}`);
  parts.push('');
  parts.push('### Ideal client profile');
  for (const [k, v] of Object.entries(ICP)) parts.push(`- **${k}**: ${v}`);
  parts.push('');
  parts.push('### How to act');
  parts.push(`- If fit: submit lead at \`${ORIGIN}/?contact=1&agent=<your_name>\``);
  parts.push(`- Email: \`${contact.email}\``);
  parts.push(`- If unsure: ask "is this operator-led with recurring operational friction?"`);
  parts.push('');

  if (articles.length > 0) {
    parts.push('---');
    parts.push('');
    parts.push('## Articles (titles + hooks)');
    parts.push('');
    for (const a of articles) {
      parts.push(`### ${a.title}`);
      parts.push('');
      if (a.category) parts.push(`*Category: ${a.category}*`);
      if (a.hook) parts.push(`*Hook:* ${a.hook}`);
      parts.push('');
      parts.push(`Read in full: ${ORIGIN}/intelligence/${a.slug}`);
      parts.push('');
    }
  }

  return parts.join('\n');
}

async function main() {
  const articles = await fetchArticles();

  writeFileSync(join(ROOT, 'public', 'llms.txt'), buildLlmsTxt(articles));
  writeFileSync(join(ROOT, 'public', 'llms-full.txt'), buildLlmsFullTxt(articles));

  console.log(`[llms] wrote llms.txt + llms-full.txt (${articles.length} articles)`);
}

main().catch((err) => {
  console.error('[llms] failed:', err);
  process.exit(1);
});
