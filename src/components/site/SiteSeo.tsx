/**
 * Applies a route's SEO to <head>: title, description, canonical, Open Graph,
 * robots, geo hints, and the schema.org graph.
 *
 * Distinct from the legacy components/Seo.tsx, which the old dark pages still
 * use — this one adds the robots/geo tags the local-SEO brief depends on, and
 * derives everything from lib/siteSeo so the prerendered HTML and the runtime
 * tags come from one function.
 */
import { useEffect } from 'react';
import type { Project } from '../../content';
import { buildJsonLd, seoFor, SITE_BASE, type SiteRoute } from '../../lib/siteSeo';

const JSON_LD_ID = 'delai-ld';

export function SiteSeo({ route, projects = [] }: { route: SiteRoute; projects?: Project[] }) {
  // Projects only affect the /work/:slug title + Article node. Keying the
  // effect on the identity of the array would re-run it on every hydration
  // tick, so depend on the resolved strings instead.
  const seo = seoFor(route, projects);
  const jsonLd = JSON.stringify(buildJsonLd(route, seo, projects));

  useEffect(() => {
    document.title = seo.title;

    setMeta('meta[name="description"]', { tag: 'meta', name: 'description', content: seo.desc });
    setMeta('link[rel="canonical"]', { tag: 'link', rel: 'canonical', href: SITE_BASE + seo.path });
    setMeta('meta[property="og:title"]', { tag: 'meta', property: 'og:title', content: seo.title });
    setMeta('meta[property="og:description"]', { tag: 'meta', property: 'og:description', content: seo.desc });
    setMeta('meta[property="og:url"]', { tag: 'meta', property: 'og:url', content: SITE_BASE + seo.path });
    setMeta('meta[property="og:type"]', { tag: 'meta', property: 'og:type', content: 'website' });
    setMeta('meta[name="twitter:card"]', { tag: 'meta', name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="robots"]', {
      tag: 'meta',
      name: 'robots',
      content: seo.noindex ? 'noindex,nofollow' : 'index,follow',
    });
    setMeta('meta[name="geo.region"]', { tag: 'meta', name: 'geo.region', content: 'US-FL' });
    setMeta('meta[name="geo.placename"]', { tag: 'meta', name: 'geo.placename', content: 'Miami, Florida' });

    let ld = document.getElementById(JSON_LD_ID);
    if (!ld) {
      ld = document.createElement('script');
      (ld as HTMLScriptElement).type = 'application/ld+json';
      ld.id = JSON_LD_ID;
      document.head.appendChild(ld);
    }
    ld.textContent = jsonLd;
  }, [seo.title, seo.desc, seo.path, seo.noindex, jsonLd]);

  return null;
}

function setMeta(selector: string, attrs: Record<string, string> & { tag: string }) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.tag);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (k !== 'tag') el.setAttribute(k, v);
  }
}
