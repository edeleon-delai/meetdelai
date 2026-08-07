import { Link } from 'react-router-dom';
import { publishedOnly, usePortfolio } from '../../lib/portfolio';
import { Breadcrumb, ProjectCard } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function Work() {
  const { projects } = usePortfolio();
  const published = publishedOnly(projects);

  return (
    <>
      <SiteSeo route={{ name: 'work' }} projects={projects} />
      <main>
        <section className="dl-sec-head dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb current="Work" />
            <h1 className="dl-h1 dl-measure-15" style={{ marginTop: 26 }}>
              Things we built that are running right now.
            </h1>
            <p className="dl-lead-sm dl-measure-58" style={{ margin: '24px 0 0' }}>
              Products, internal tools, and automated operations. Every case study below is managed through the DELAI
              admin — drafts get reviewed by a person before anything reaches this page.
            </p>
          </div>
        </section>

        <section className="dl-sec-sm">
          <div className="dl-wrap">
            {published.length > 0 ? (
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 22 }}
              >
                {published.map((p) => (
                  <ProjectCard key={p.id} project={p} coverHeight={220} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed #c9c4b7',
                  borderRadius: 4,
                  padding: 44,
                  textAlign: 'center',
                  color: 'var(--dl-faint)',
                  fontSize: 15.5,
                }}
              >
                No published case studies yet.
              </div>
            )}

            <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-sm">
                Discuss Your AI System →
              </Link>
              <Link to="/services" className="dl-btn dl-btn-outline dl-btn-sm">
                Browse services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
