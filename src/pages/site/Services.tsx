import { Link } from 'react-router-dom';
import { servicesIn, verticals } from '../../content';
import { Breadcrumb } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

/**
 * The two-vertical index. Services are never listed flat any more — each one
 * appears under the vertical that owns it, so the first thing a visitor reads
 * is the two-category story rather than six equally-weighted line items.
 */
export function Services() {
  return (
    <>
      <SiteSeo route={{ name: 'services' }} />
      <main>
        <section className="dl-sec-head dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb current="What we build" />
            <h1 className="dl-h1 dl-measure-16" style={{ marginTop: 26 }}>
              We do two things, and we do them properly.
            </h1>
            <p className="dl-lead-sm dl-measure-60" style={{ margin: '24px 0 0' }}>
              <strong>Technology Operations</strong> is the work inside your business — data moving, workflows running,
              SOPs enforced, agents doing what people shouldn&rsquo;t. <strong>Product Development</strong> is software
              that ships as a product. Both end the same way: something real, running, that we stay to operate.
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

        {verticals.map((v, i) => {
          const own = servicesIn(v.slug);
          return (
            <section key={v.slug} className={i % 2 === 1 ? 'dl-sec-sm dl-alt dl-rule-t dl-rule-b' : 'dl-sec-sm'}>
              <div className="dl-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32, flexWrap: 'wrap' }}>
                  <div>
                    <div className="dl-mono dl-mono-flame">{`0${i + 1} · ${v.tagline}`}</div>
                    <h2 className="dl-h2 dl-measure-18" style={{ marginTop: 16 }}>
                      {v.name}
                    </h2>
                    <p className="dl-lead dl-measure-56" style={{ margin: '20px 0 0' }}>
                      {v.lead}
                    </p>
                  </div>
                  <Link to={`/services/${v.slug}`} className="dl-link-rule">
                    {v.name} in full →
                  </Link>
                </div>

                {/* the capability vocabulary, before the service list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
                  {v.capabilities.map((c) => (
                    <span key={c.t} className="dl-chip">
                      {c.t}
                    </span>
                  ))}
                </div>

                {own.length > 0 && (
                  <div className="dl-stack" style={{ marginTop: 28 }}>
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
                              fontSize: 'clamp(1.4rem,2.2vw,2rem)',
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
                )}

                {v.slug === 'product-development' && (
                  <p className="dl-body-m dl-measure-60" style={{ margin: '24px 0 0' }}>
                    The rest of the argument for this one is the{' '}
                    <Link to="/work" style={{ borderBottom: '1px solid var(--dl-ink)' }}>
                      portfolio
                    </Link>{' '}
                    — PAGE, Alba and EyeGoal are all things we built, shipped, and still run.
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
