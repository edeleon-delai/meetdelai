import { Link } from 'react-router-dom';
import { locations } from '../../content';
import { Breadcrumb } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function Areas() {
  return (
    <>
      <SiteSeo route={{ name: 'areas' }} />
      <main>
        <section className="dl-sec-head dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb current="South Florida" />
            <h1 className="dl-h1 dl-measure-16" style={{ marginTop: 26 }}>
              AI automation company serving South Florida.
            </h1>
            <p className="dl-lead-sm dl-measure-60" style={{ margin: '24px 0 0' }}>
              DELAI works with small and medium businesses across Miami-Dade, Broward, and Palm Beach County. We prefer
              to see the process where it happens, so discovery usually starts in your office — with remote delivery
              available everywhere else.
            </p>
            <div style={{ marginTop: 30 }}>
              <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-sm">
                Find Your First Automation →
              </Link>
            </div>
          </div>
        </section>

        <section className="dl-sec-sm">
          <div className="dl-wrap dl-tiles dl-tiles-300">
            {locations.map((l) => (
              <Link
                key={l.slug}
                to={`/south-florida/${l.slug}`}
                className="dl-card"
                style={{ padding: 'clamp(26px,3vw,36px)', minHeight: 240 }}
              >
                <span className="dl-mono-sm">{l.region}</span>
                <h2
                  style={{
                    margin: '4px 0 0',
                    fontSize: 'clamp(1.5rem,2.2vw,2rem)',
                    letterSpacing: '-.04em',
                    fontWeight: 600,
                    lineHeight: 1.05,
                  }}
                >
                  {l.city}
                </h2>
                <p className="dl-body-m" style={{ margin: 0, flex: 1 }}>
                  {l.lead}
                </p>
                <span className="dl-readmore">View {l.city} →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
