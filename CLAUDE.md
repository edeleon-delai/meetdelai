# meetdelai.com — working rules

Marketing site for DELAI (`edeleon-delai/meetdelai`, public). React 19 + Vite 7 + TS + Tailwind 3, deployed on **Vercel** — every push to `main` auto-deploys production. See `README.md` for stack, routes and local setup.

## Site shape

Two design systems live here, on purpose:

| Routes | Look | Owned by |
|---|---|---|
| `/`, `/services`, `/services/<vertical>`, `/services/:slug`, `/work`, `/work/:slug`, `/south-florida`, `/south-florida/:slug`, `/about`, `/contact`, `/admin` | Light "DELAI redesign" (sand/flame/pine, Instrument Sans + JetBrains Mono) | `src/styles/delai.css`, scoped to `.dl-root` |
| `/intelligence`, `/intelligence/:slug`, `/machine`, `/products/signal` | Original dark brutalist | `src/index.css` + the Tailwind tokens in `tailwind.config.js` |

The dark pages are **not dead** — `/machine` and `llms.txt` are the agent-discoverability layer the DELAI MCP advertises, and the articles come from the API. Restyling them into the new system is open work; deleting them breaks things outside this repo.

The route table lives in **`src/marketingRoutes.tsx`** and is imported by both `src/App.tsx` and `scripts/prerender.tsx`, so the prerendered HTML is produced by the same components the browser runs. Don't declare those routes a second time anywhere.

## Content is data, not code

**`content/site.json` is the single source of truth** for the portfolio, capability map, ICP, proof numbers, meta copy and contact details. Read it through `src/content.ts` (typed). **Never restate any of it in a component, a script, or another repo.**

It was hardcoded once, in five places across two repos. Pulling a retired product from the footer left it live in the JSON-LD, `llms.txt`, the prerendered HTML, and the DELAI MCP's `get_services`; `/machine` additionally kept asserting "6 products in production" and "founder + 6 Offers" against a site that listed none.

Four sibling files follow the same rule, read through the same module:

- **`content/verticals.json`** — the two things DELAI sells. See below.
- **`content/services.json`** — the six services (copy, per-page meta, examples, deliverables, signals).
- **`content/locations.json`** — the seven South Florida service-area pages.
- **`content/projects.json`** — the shipped baseline for `/work` (see the admin section below).

They are separate files rather than new `site.json` keys because `site.json` is validated by the admin MCP's schema (`mcm-agents` → `api/lib/delai-content-schema.ts`); extra top-level keys risk failing the next `update_site_content` call.

Add a service or a city and it appears on its index page, the footer, the JSON-LD offer catalog, the sitemap and the prerender with no other edit — `src/lib/siteSeo.ts` derives all of that.

### Two verticals, six services

The site leads with **two categories**, not a flat service list:

- **Technology Operations** — the work inside a business: data movement, workflow automation, internal tool creation, AI agents, SOP enforcement, knowledge base management, custom AI platforms ("your own ChatGPT"). Owns 5 services.
- **Product Development** — software that ships as a product. Owns 1 service, and argues mostly through `/work`.

Rules that keep this from rotting:

- **A service joins a vertical via its own `vertical` key.** `verticals.json` lists no service slugs, so the two files cannot disagree.
- **`num` is per-vertical**, assigned by position. Globally sequential numbers left a visible gap (Technology Operations read `01,02,03,04,06`) the second a service changed vertical. Anywhere services from both verticals appear together, **group them by vertical** — a mixed list renumbers to nonsense. `/south-florida/:slug` does this.
- **Verticals share the `/services/*` namespace with services**, so a vertical slug and a service slug must never collide. Their routes are declared as literal paths in `src/marketingRoutes.tsx` (generated from content) so React Router's static-beats-dynamic ranking resolves them ahead of `/services/:slug`. Because there is no route param, `VerticalDetail` takes its slug as a **prop**.
- A service page's breadcrumb runs `Home → What we build → <Vertical> → <Service>`, in the JSON-LD as well as the UI.

Consumers — update this list if you add one:

| Consumer | Uses |
|---|---|
| `src/components/Footer.tsx` | `portfolio` (column hidden when empty) — dark pages only |
| `src/components/Seo.tsx` | `makesOffer` JSON-LD (key omitted when empty), org description — dark pages only |
| `src/pages/MachineReader.tsx` | `/machine` blocks: capabilities, don't-build, ICP, proof, format notes |
| `scripts/prerender.tsx` | the static copy of the same blocks, plus every redesigned route |
| `scripts/generate-llms-txt.ts` | summary, about, ICP, capabilities, products, contact |
| `scripts/publish-site-content.ts` | emits `public/site-content.json`, syncs `index.html`'s head |
| `src/lib/siteSeo.ts` | `contact.site` as the canonical origin; `services` → JSON-LD offer catalog; per-route title/description/breadcrumbs |
| `src/components/site/SiteFooter.tsx` | `verticals` (one column each), the services under them, `locations`, `contact.email` |
| `scripts/generate-sitemap.ts` | the marketing route list — every service and city page |

`scripts/publish-site-content.ts` runs first in `prebuild` and is idempotent. It publishes `/site-content.json`, which **`mcm-agents` fetches** (`server/src/api/lib/delai-site-content.ts`) for the public MCP — so a copy change here propagates to the agent-facing surface with no deploy on that side.

`_comment` in `site.json` is authoring documentation. It is stripped before publishing and cannot be patched by the admin MCP.

## Editing content as an agent

Either edit `content/site.json` directly and push, or call the DELAI admin MCP:

```
POST https://api.thefoundai.app/delai/admin/mcp     header: x-admin-secret
tools: get_site_content, update_site_content
```

`update_site_content` shallow-merges top-level keys, validates the merged document (`mcm-agents` → `api/lib/delai-content-schema.ts`), and commits here. **Arrays replace wholesale** — to remove a product, send `portfolio` without it. Adding a genuinely new top-level field needs a code change in `src/content.ts` first, or nothing will render it.

## /admin — portfolio console

`/admin` is a prototype, and the app says so: its **Launch checklist** tab is the live list of what has to be real before it manages anything that matters.

- **Auth is a client-side password** from `VITE_ADMIN_PASSWORD`. Unset ⇒ nobody can sign in, which is the safe default. The value is compiled into a **public** bundle, so it is obscurity, not security — never treat it as a secret, and never hardcode one in source (the design comp did; this repo must not).
- **Content is localStorage** (`delai.projects.v3`, `delai.hermes.queue.v1`), layered over `content/projects.json`. Edits therefore live in one browser and **cannot be prerendered** — the static `/work` pages always show the shipped baseline. The Hermes integration tab documents the intended real contract (`POST /api/portfolio/drafts`, agent tokens scoped to `draft:write`, publish restricted to a human session).
- Only `status: "published"` projects are reachable off `/admin` — `/work/:slug` refuses a draft slug rather than rendering it.
- `/admin` is `noindex,nofollow`, `Disallow`ed in robots.txt, and not prerendered.

## Leads — the one server-side path

`/contact` ("Find Your First Automation") is **not** a mailto hand-off any more. It posts to `POST /api/lead`, a Vercel function that:

1. stores the lead on the DELAI API (`POST /delai/leads`, anonymous) — the same store the admin MCP's `list_leads` reads;
2. emails `LEAD_NOTIFY_EMAIL` (default `edeleon@meetdelai.com`) through Resend.

**Storage is the contract; email is best-effort.** If Resend is unset or errors the lead is still saved and the response is still `201` — with `emailed: false`. Losing a lead because a mail API had a bad minute is the worse failure. If the POST fails outright the form shows a mailto link pre-filled with what they typed, so nothing is lost.

`GET /api/leads` backs the admin's Leads tab. It holds `DELAI_ADMIN_SECRET` server-side (upstream `GET /delai/leads` is 401 without it) and gates itself on `ADMIN_PASSWORD`, checked against an env var. **This is the only real access boundary in the admin** — the sign-in screen compares `VITE_ADMIN_PASSWORD`, which is compiled into the public bundle. Set `ADMIN_PASSWORD` to the same value so one sign-in unlocks both.

Env vars (Vercel project settings, never the repo) — see `.env.example`:

| Var | Side | Without it |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | client | `/admin` cannot be signed into |
| `ADMIN_PASSWORD` | server | Leads tab returns 503 |
| `DELAI_ADMIN_SECRET` | server | Leads tab returns 503 |
| `RESEND_API_KEY` | server | leads still stored, no email |
| `LEAD_NOTIFY_EMAIL` / `LEAD_FROM_EMAIL` | server | defaults below |

**Resend: the sender domain is the trap.** DELAI has its own Resend account (key on the Hostinger box, `/opt/mastra-studio/.env` — copy it into Vercel). **`meetdelai.com` is NOT a verified sending domain on it**, so `from: hello@meetdelai.com` returns `403 validation_error` every single time. Verified domains: `thefoundai.app`, `longestash.com`, `mycloudmenu.com`, `myfluxe.com`, `mymcm.app`, `simplelenses.com`. `LEAD_FROM_EMAIL` therefore defaults to `DELAI <leads@thefoundai.app>` — an internal notification address, with `reply_to` set to the lead's own email so replying works. To send as `meetdelai.com`, verify it at resend.com/domains (DKIM/SPF) first.

Two other Resend accounts exist and are **not** interchangeable with this one: **EyeGoal's** is client infrastructure (SVG-CTO AWS SSM, `*.eyegoal.org` senders) — never borrow it for DELAI; **FundScout's** is separate again (`send.pagepay.app`).

**"Accepted" is not "delivered."** A `200` with an id only means Resend took it. Confirm with `GET https://api.resend.com/emails/<id>` and look for `last_event: delivered`.

**`vite dev` serves no functions** — `/api/lead` and `/api/leads` 404 locally. Use `vercel dev` or a preview deployment to exercise them. `vercel.json`'s SPA rewrite is `/((?!api/).*)` precisely so `/api` is never swallowed by it.

## Gotchas

- **Prerendered, not SSR.** `scripts/prerender.tsx` writes static HTML per route into `dist/` after `vite build`. The redesigned routes render through the real components; the dark pages keep hand-written static copies in that script. `index.html` is only the Vite template. `/machine` exists **twice** — runtime (`MachineReader.tsx`) and static (`prerender.tsx`) — keep them in step; both read `site.json`.
- **The prerender needs `--tsconfig tsconfig.app.json`** (the npm script passes it). `tsx` resolves the nearest `tsconfig.json`, which is the solution file with `files: []`, so nothing matches `src/**` and every component gets the classic `React.createElement` factory — which throws `React is not defined` the moment a page renders. `tsconfig.node.json` also carries `lib: DOM` now, for typechecking only: the scripts still run under Node, and everything they reach guards with `typeof window`.
- **Auto-fit grids must be `minmax(min(Npx,100%),1fr)`.** The comp used a bare `minmax(400px,1fr)` hero grid, which forces a track wider than a phone and scrolls the whole page sideways. Fixed everywhere; don't reintroduce the bare form.
- `scripts/generate-sitemap.ts` **used to** silently strip the llms.txt pointer block out of `public/robots.txt` on every build (issue #7). The block is part of the generator's template now, so regenerating is idempotent — keep it that way.
- Articles are **not** in this repo — they're `delai_articles` rows served by `api.thefoundai.app/delai/articles`, fetched at runtime and at build time (for `llms.txt` + prerender). Manage them via the admin MCP's `upsert_article` / `publish_article`.
- Verify a content change at `https://meetdelai.com/site-content.json`, not just in the footer.
