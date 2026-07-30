# meetdelai.com — working rules

Marketing site for DELAI (`edeleon-delai/meetdelai`, public). React 19 + Vite 7 + TS + Tailwind 3, deployed on **Vercel** — every push to `main` auto-deploys production. See `README.md` for stack, routes and local setup.

## Content is data, not code

**`content/site.json` is the single source of truth** for the portfolio, capability map, ICP, proof numbers, meta copy and contact details. Read it through `src/content.ts` (typed). **Never restate any of it in a component, a script, or another repo.**

It was hardcoded once, in five places across two repos. Pulling a retired product from the footer left it live in the JSON-LD, `llms.txt`, the prerendered HTML, and the DELAI MCP's `get_services`; `/machine` additionally kept asserting "6 products in production" and "founder + 6 Offers" against a site that listed none.

Consumers — update this list if you add one:

| Consumer | Uses |
|---|---|
| `src/components/Footer.tsx` | `portfolio` (column hidden when empty) |
| `src/components/Seo.tsx` | `makesOffer` JSON-LD (key omitted when empty), org description |
| `src/pages/MachineReader.tsx` | `/machine` blocks: capabilities, don't-build, ICP, proof, format notes |
| `scripts/prerender.tsx` | the static copy of the same blocks + home-route `<title>`/description |
| `scripts/generate-llms-txt.ts` | summary, about, ICP, capabilities, products, contact |
| `scripts/publish-site-content.ts` | emits `public/site-content.json`, syncs `index.html`'s head |

`scripts/publish-site-content.ts` runs first in `prebuild` and is idempotent. It publishes `/site-content.json`, which **`mcm-agents` fetches** (`server/src/api/lib/delai-site-content.ts`) for the public MCP — so a copy change here propagates to the agent-facing surface with no deploy on that side.

`_comment` in `site.json` is authoring documentation. It is stripped before publishing and cannot be patched by the admin MCP.

## Editing content as an agent

Either edit `content/site.json` directly and push, or call the DELAI admin MCP:

```
POST https://api.thefoundai.app/delai/admin/mcp     header: x-admin-secret
tools: get_site_content, update_site_content
```

`update_site_content` shallow-merges top-level keys, validates the merged document (`mcm-agents` → `api/lib/delai-content-schema.ts`), and commits here. **Arrays replace wholesale** — to remove a product, send `portfolio` without it. Adding a genuinely new top-level field needs a code change in `src/content.ts` first, or nothing will render it.

## Gotchas

- **Prerendered, not SSR.** `scripts/prerender.tsx` writes static HTML per route into `dist/` after `vite build`, rewriting `<title>`/description/og from its own args. `index.html` is only the Vite template. `/machine` exists **twice** — runtime (`MachineReader.tsx`) and static (`prerender.tsx`) — keep them in step; both read `site.json`.
- **`scripts/generate-sitemap.ts` overwrites `public/robots.txt`** from an inline template that is missing the committed llms.txt pointer block, so every build silently strips 7 lines. Don't commit that side effect. Tracked in issue #7.
- Articles are **not** in this repo — they're `delai_articles` rows served by `api.thefoundai.app/delai/articles`, fetched at runtime and at build time (for `llms.txt` + prerender). Manage them via the admin MCP's `upsert_article` / `publish_article`.
- Verify a content change at `https://meetdelai.com/site-content.json`, not just in the footer.
