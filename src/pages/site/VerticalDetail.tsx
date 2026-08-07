import { Link, Navigate } from 'react-router-dom';
import { servicesIn, verticalBySlug, verticals } from '../../content';
import { publishedOnly, usePortfolio } from '../../lib/portfolio';
import { Breadcrumb, Eyebrow, ProjectCard } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

/**
 * One of the two things DELAI sells. Sits between /services and the individual
 * service pages, which keeps every existing service URL intact while giving
 * each vertical a page of its own to rank and to link to.
 *
 * Product Development is deliberately light on services and heavy on proof —
 * its argument is the portfolio, so the case studies render inline there rather
 * than as a footnote.
 *
 * `slug` arrives as a prop rather than a route param: these routes are declared
 * as literal paths so they outrank /services/:slug, which means there is no
 * param to read.
 */
export function VerticalDetail({ slug }: { slug: string }) {
  const vertical = verticalBySlug(slug);
  const { projects } = usePortfolio();

  if (!vertical) return <Navigate to="/services" replace />;

  const own = servicesIn(vertical.slug);
  const other = verticals.find((v) => v.slug !== vertical.slug);
  const published = publishedOnly(projects);
  const showPortfolio = vertical.slug === 'product-development' && published.length > 0;

  return (
    <>
      <SiteSeo route={{ name: 'vertical', slug: vertical.slug }} projects={projects} />
      <main>
        <section style={{ padding: 'clamp(44px,6vw,80px) 0 clamp(36px,4vw,60px)' }} className="dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb trail={[{ to: '/services', label: 'What we build' }]} current={vertical.name} />
            <div
              className="dl-grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))',
                gap: 'clamp(28px,4vw,60px)',
                marginTop: 28,
                alignItems: 'end',
              }}
            >
              <div>
                <h1 className="dl-h1-detail dl-measure-15">{vertical.h1}</h1>
                <p className="dl-lead dl-measure-52" style={{ margin: '24px 0 0' }}>
                  {vertical.lead}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
                <Link
                  to="/contact"
                  className="dl-btn dl-btn-primary dl-btn-block"
                  style={{ maxWidth: 360, padding: '17px 24px' }}
                >
                  {vertical.cta} <span>→</span>
                </Link>
                <Link
                  to="/work"
                  className="dl-btn dl-btn-outline dl-btn-block"
                  style={{ maxWidth: 360, padding: '16px 23px' }}
                >
                  See What We Build <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* the argument */}
        <section className="dl-sec-sm">
          <div className="dl-wrap dl-grid dl-grid-300" style={{ gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow>The short version</Eyebrow>
              <p
                style={{
                  margin: '20px 0 0',
                  fontSize: 'clamp(1.2rem,2vw,1.65rem)',
                  lineHeight: 1.35,
                  letterSpacing: '-.025em',
                  fontWeight: 500,
                }}
              >
                {vertical.overview}
              </p>
            </div>
            <div className="dl-panel">
              <div className="dl-mono">{vertical.tagline}</div>
              <p className="dl-body-m" style={{ margin: '18px 0 0' }}>
                {vertical.ctaBlurb}
              </p>
              <div style={{ marginTop: 22 }}>
                <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-sm">
                  {vertical.cta} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* what's in it */}
        <section className="dl-sec-sm dl-alt dl-rule-t dl-rule-b">
          <div className="dl-wrap">
            <Eyebrow>What this covers</Eyebrow>
            <div className="dl-tiles dl-tiles-290" style={{ marginTop: 32 }}>
              {vertical.capabilities.map((c) => (
                <div key={c.t} className="dl-tile dl-tile-md">
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    {c.t}
                  </h3>
                  <p className="dl-body-m" style={{ margin: 0 }}>
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* the services underneath */}
        {own.length > 0 && (
          <section className="dl-sec-sm">
            <div className="dl-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32, flexWrap: 'wrap' }}>
                <h2 className="dl-h2-sm dl-measure-18">
                  {own.length === 1 ? 'The service' : `${own.length} services under ${vertical.name}`}
                </h2>
                <Link to="/services" className="dl-link-rule">
                  All services →
                </Link>
              </div>
              <div className="dl-stack" style={{ marginTop: 32 }}>
                {own.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    style={{
                      padding: 'clamp(24px,3vw,36px)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
                      gap: 24,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
                      <span className="dl-mono" style={{ fontSize: 12, letterSpacing: '.14em', color: 'var(--dl-flame)' }}>
                        {s.num}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 'clamp(1.4rem,2.2vw,1.9rem)',
                          letterSpacing: '-.04em',
                          fontWeight: 600,
                          lineHeight: 1.05,
                        }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: 16, color: 'var(--dl-muted)', lineHeight: 1.5 }}>{s.lead}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Development argues with the portfolio, not with a list */}
        {showPortfolio && (
          <section className="dl-sec-sm dl-rule-t">
            <div className="dl-wrap">
              <Eyebrow>What we&rsquo;ve created</Eyebrow>
              <h2 className="dl-h2-sm dl-measure-18" style={{ marginTop: 16 }}>
                Products we designed, built, shipped and still run.
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
                  gap: 20,
                  marginTop: 36,
                }}
              >
                {published.slice(0, 3).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <Link to="/work" className="dl-btn dl-btn-outline dl-btn-sm">
                  Read the case studies →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* the other half of the business */}
        {other && (
          <section className="dl-sec-bottom" style={{ paddingTop: 'clamp(44px,6vw,80px)' }}>
            <div className="dl-wrap">
              <div
                className="dl-pine-block"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
                  gap: 32,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div className="dl-mono" style={{ color: 'var(--dl-green)' }}>
                    The other half
                  </div>
                  <h2 className="dl-h2-sm dl-measure-18" style={{ marginTop: 16 }}>
                    {other.tagline}
                  </h2>
                  <p style={{ margin: '16px 0 0', fontSize: 16.5, lineHeight: 1.5, maxWidth: '46ch' }}>
                    {other.cardBlurb}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
                  <Link
                    to={`/services/${other.slug}`}
                    className="dl-btn dl-btn-primary dl-btn-block"
                    style={{ padding: '16px 24px' }}
                  >
                    {other.name} <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
