import { Link } from 'react-router-dom';
import { services } from '../../content';
import { Breadcrumb } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function Services() {
  return (
    <>
      <SiteSeo route={{ name: 'services' }} />
      <main>
        <section className="dl-sec-head dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb current="Services" />
            <h1 className="dl-h1 dl-measure-16" style={{ marginTop: 26 }}>
              What DELAI builds for South Florida businesses.
            </h1>
            <p className="dl-lead-sm dl-measure-60" style={{ margin: '24px 0 0' }}>
              Six services. Every one of them ends with working software running inside your business — not a
              recommendation, not a vendor shortlist, not a slide.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
              <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-sm">
                Find Your First Automation →
              </Link>
              <Link to="/work" className="dl-btn dl-btn-outline dl-btn-sm">
                See What We Build
              </Link>
            </div>
          </div>
        </section>

        <section className="dl-sec-sm">
          <div className="dl-wrap dl-stack">
            {services.map((s) => (
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
                  <span
                    className="dl-mono"
                    style={{ fontSize: 12, letterSpacing: '.14em', color: 'var(--dl-flame)' }}
                  >
                    {s.num}
                  </span>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 'clamp(1.5rem,2.4vw,2.1rem)',
                      letterSpacing: '-.04em',
                      fontWeight: 600,
                      lineHeight: 1.05,
                    }}
                  >
                    {s.title}
                  </h2>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: 'var(--dl-muted)', lineHeight: 1.5 }}>{s.lead}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
