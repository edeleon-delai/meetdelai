/**
 * Publishes content/site.json to two places so nothing has to re-declare it:
 *
 *  1. public/site-content.json — served at https://meetdelai.com/site-content.json.
 *     The DELAI MCP server (mcm-agents, delai-mcp.ts) fetches this for its
 *     get_services tool instead of carrying its own copy of the portfolio,
 *     which is exactly how a retired product stayed live for agents after
 *     being pulled from the site.
 *
 *  2. index.html's <title> / description / og:description. That file is only
 *     the Vite template — prerender.tsx rewrites the head per route in dist —
 *     but leaving stale copy there is how drift starts. Idempotent: writes
 *     only when the values actually differ.
 *
 * Runs in prebuild, before the sitemap and llms.txt generators.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { meta, site } from '../src/content';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function publishJson(): void {
  const target = join(ROOT, 'public', 'site-content.json');
  // `site` already has the authoring-only `_comment` stripped by src/content.ts.
  const next = JSON.stringify(site, null, 2) + '\n';
  const current = (() => {
    try { return readFileSync(target, 'utf8'); } catch { return null; }
  })();
  if (current === next) {
    console.log('[site-content] public/site-content.json already current');
    return;
  }
  writeFileSync(target, next);
  console.log(`[site-content] wrote public/site-content.json (portfolio: ${site.portfolio.length} items)`);
}

function syncIndexHtml(): void {
  const target = join(ROOT, 'index.html');
  const before = readFileSync(target, 'utf8');
  let after = before;

  after = after.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  after = after.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  );
  after = after.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  after = after.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`,
  );

  if (after === before) {
    console.log('[site-content] index.html head already current');
    return;
  }
  writeFileSync(target, after);
  console.log('[site-content] synced index.html head from content/site.json');
}

publishJson();
syncIndexHtml();
