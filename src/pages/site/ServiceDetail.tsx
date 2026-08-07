import { Link, Navigate, useParams } from 'react-router-dom';
import { locations, serviceBySlug, services, verticalOf } from '../../content';
import { projectHref, publishedOnly, usePortfolio } from '../../lib/portfolio';
import { Breadcrumb, Eyebrow, LinkStack } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = serviceBySlug(slug);
  const { projects } = usePortfolio();

  // An unknown slug is a dead URL, not an empty page — send crawlers to the index.
  if (!service) return <Navigate to="/services" replace />;

  const vertical = verticalOf(service);
  const related = publishedOnly(projects).slice(0, 3);
  // Siblings first: another service in the same vertical is a far more useful
  // next click than whichever service happened to be defined next.
  const others = [
    ...services.filter((s) => s.slug !== service.slug && s.vertical === service.vertical),
    ...services.filter((s) => s.slug !== service.slug && s.vertical !== service.vertical),
  ].slice(0, 3);

  return (
    <>
      <SiteSeo route={{ name: 'service', slug: service.slug }} projects={projects} />
      <main>
        <section style={{ padding: 'clamp(44px,6vw,80px) 0 clamp(36px,4vw,60px)' }} className="dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb
              trail={[
                { to: '/services', label: 'What we build' },
                ...(vertical ? [{ to: `/services/${vertical.slug}`, label: vertical.name }] : []),
              ]}
              current={service.title}
            />
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
                {vertical ? (
                  <Link
                    to={`/services/${vertical.slug}`}
                    className="dl-mono"
                    style={{
                      display: 'inline-block',
                      color: 'var(--dl-flame)',
                      border: '1px solid var(--dl-line)',
                      borderRadius: 2,
                      padding: '7px 11px',
                      marginBottom: 20,
                      background: 'var(--dl-panel)',
                    }}
                  >
                    {vertical.name}
                  </Link>
                ) : null}
                <h1 className="dl-h1-detail dl-measure-15">{service.title}</h1>
                <p className="dl-lead dl-measure-52" style={{ margin: '24px 0 0' }}>
                  {service.lead}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
                <Link
                  to="/contact"
                  className="dl-btn dl-btn-primary dl-btn-block"
                  style={{ maxWidth: 360, padding: '17px 24px' }}
                >
                  {service.cta} <span>→</span>
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

        {/* the short version + "you probably need this if" */}
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
                {service.overview}
              </p>
            </div>
            <div className="dl-panel">
              <div className="dl-mono">You probably need this if</div>
              <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 14 }}>
                {service.signals.map((sig) => (
                  <li key={sig} className="dl-arrow-item">
                    <span>→</span>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* in practice */}
        <section className="dl-sec-sm dl-alt dl-rule-t dl-rule-b">
          <div className="dl-wrap">
            <Eyebrow>What this looks like in practice</Eyebrow>
            <div className="dl-tiles dl-tiles-290" style={{ marginTop: 32 }}>
              {service.examples.map((ex) => (
                <div key={ex.t} className="dl-tile dl-tile-md">
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    {ex.t}
                  </h3>
                  <p className="dl-body-m" style={{ margin: 0 }}>
                    {ex.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* deliverables */}
        <section className="dl-sec-sm">
          <div className="dl-wrap dl-grid dl-grid-300" style={{ gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <h2
                className="dl-measure-14"
                style={{ margin: 0, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.05, letterSpacing: '-.04em', fontWeight: 600 }}
              >
                What you actually get
              </h2>
              <p className="dl-measure-44" style={{ margin: '18px 0 0', fontSize: 16.5, lineHeight: 1.55, color: 'var(--dl-muted)' }}>
                Every engagement ends with something running in production and somebody on your team who knows how it
                works.
              </p>
            </div>
            <ul className="dl-stack" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {service.deliverables.map((d) => (
                <li key={d} style={{ padding: '22px 24px', fontSize: 16.5, display: 'flex', gap: 14, alignItems: 'baseline' }}>
                  <span style={{ width: 6, height: 6, background: 'var(--dl-flame)', borderRadius: 1, display: 'block', flex: 'none' }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* related */}
        <section style={{ padding: '0 0 clamp(44px,6vw,80px)' }}>
          <div
            className="dl-wrap"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(24px,3vw,40px)' }}
          >
            <LinkStack
              label="Related work"
              items={related.map((p) => ({ to: projectHref(p), primary: p.title, secondary: p.category }))}
            />
            <LinkStack
              label={vertical ? `More in ${vertical.name}` : 'Other services'}
              items={others.map((s) => ({ to: `/services/${s.slug}`, primary: s.title }))}
            />
          </div>
        </section>

        {/* service-area band — the comp closes the service page here, with no
            orange CTA; that one belongs to the case-study page. */}
        <section className="dl-sec-bottom">
          <div className="dl-wrap">
            <div
              className="dl-pine-block"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 32, alignItems: 'center' }}
            >
              <div>
                <h2 className="dl-h2-sm dl-measure-18">
                  Serving Miami, Fort Lauderdale, Broward and Palm Beach County.
                </h2>
                <p style={{ margin: '16px 0 0', fontSize: 16.5, lineHeight: 1.5, maxWidth: '46ch' }}>
                  On-site where it matters, remote where it doesn&rsquo;t.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {locations.map((l) => (
                  <Link
                    key={l.slug}
                    to={`/south-florida/${l.slug}`}
                    style={{
                      border: '1px solid rgba(220,229,226,.3)',
                      borderRadius: 3,
                      padding: '11px 15px',
                      fontSize: 14.5,
                      fontWeight: 500,
                    }}
                  >
                    {l.city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
