import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
// delai.css is imported from main.tsx, not here: this module is also loaded by
// scripts/prerender.tsx under tsx/node, which cannot resolve a CSS import.

/**
 * Chrome for every redesigned route.
 *
 * `.dl-root` is what scopes the new light design system — the legacy dark
 * pages (/intelligence, /machine, /products/signal) render outside this shell
 * and keep the original tokens from index.css.
 */
export function SiteShell() {
  const { pathname } = useLocation();

  // The comp scrolled to top on every hash change; react-router preserves
  // scroll across navigations, so restore that behaviour explicitly.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="dl-root">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
