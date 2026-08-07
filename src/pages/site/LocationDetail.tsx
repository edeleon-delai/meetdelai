import { Link, Navigate, useParams } from 'react-router-dom';
import { locationBySlug, locations, servicesIn, verticals } from '../../content';
import { projectHref, publishedOnly, usePortfolio } from '../../lib/portfolio';
import { Breadcrumb, LinkStack } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function LocationDetail() {
  const { slug = '' } = useParams();
  const location = locationBySlug(slug);
  const { projects } = usePortfolio();

  if (!location) return <Navigate to="/south-florida" replace />;

  const related = publishedOnly(projects).slice(0, 3);
  const nearby = locations.filter((l) => l.slug !== location.slug);

  return (
    <>
      <SiteSeo route={{ name: 'location', slug: location.slug }} projects={projects} />
      <main>
        <section style={{ padding: 'clamp(44px,6vw,80px) 0 clamp(36px,4vw,56px)' }} className="dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb trail={[{ to: '/south-florida', label: 'South Florida' }]} current={location.city} />
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
                <h1 className="dl-h1-detail dl-measure-15">{location.h1}</h1>
                <p className="dl-lead dl-measure-52" style={{ margin: '24px 0 0' }}>
                  {location.lead}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
                <Link
                  to="/contact"
                  className="dl-btn dl-btn-primary dl-btn-block"
                  style={{ maxWidth: 360, padding: '17px 24px' }}
                >
                  Find Your First Automation <span>→</span>
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

        <section className="dl-sec-sm">
          <div className="dl-wrap dl-grid dl-grid-300" style={{ gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(1.15rem,1.9vw,1.55rem)',
                lineHeight: 1.4,
                letterSpacing: '-.02em',
                fontWeight: 500,
              }}
            >
              {location.body}
            </p>
            <div style={{ display: 'grid', gap: 24 }}>
              <ChipPanel label="Areas we serve" items={location.areas} />
              <ChipPanel label="Industries we work with here" items={location.industries} />
            </div>
          </div>
        </section>

        {/* Grouped by vertical rather than a flat six, so the two-category
            story holds on every city page too — and so the per-vertical
            numbering reads correctly instead of 01,02,03,04,01,05. */}
        <section className="dl-sec-sm dl-alt dl-rule-t dl-rule-b">
          <div className="dl-wrap">
            <h2 className="dl-h2-sm">What we build for {location.city} businesses</h2>
            {verticals.map((v) => (
              <div key={v.slug} style={{ marginTop: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
                  <div className="dl-mono dl-mono-flame">{v.name}</div>
                  <Link to={`/services/${v.slug}`} className="dl-readmore">
                    {v.tagline}
                  </Link>
                </div>
                <div className="dl-tiles dl-tiles-280" style={{ marginTop: 16 }}>
                  {servicesIn(v.slug).map((s) => (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      className="dl-card"
                      style={{ padding: '26px 24px', minHeight: 180, gap: 10 }}
                    >
                      <span className="dl-mono" style={{ letterSpacing: '.14em' }}>
                        {s.num}
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.22rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                        {s.title}
                      </h3>
                      <p className="dl-body" style={{ margin: 0, flex: 1 }}>
                        {s.lead}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dl-sec-sm">
          <div
            className="dl-wrap"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(24px,3vw,40px)' }}
          >
            <LinkStack
              label="Recent work"
              items={related.map((p) => ({ to: projectHref(p), primary: p.title, secondary: p.category }))}
            />
            <LinkStack
              label="Nearby service areas"
              items={nearby.map((l) => ({ to: `/south-florida/${l.slug}`, primary: l.city }))}
            />
          </div>
        </section>
      </main>
    </>
  );
}

function ChipPanel({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="dl-panel" style={{ padding: 26 }}>
      <div className="dl-mono">{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {items.map((i) => (
          <span key={i} className="dl-chip">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
