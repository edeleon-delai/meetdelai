import { Navigate, useParams } from 'react-router-dom';
import { approachLines, publishedOnly, tagList, usePortfolio } from '../../lib/portfolio';
import { Breadcrumb, Eyebrow, FlameCta } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const { projects, hydrated } = usePortfolio();

  // Only published work is reachable by URL — a draft must not be readable by
  // guessing its slug, which is the whole point of the admin's status field.
  const project = publishedOnly(projects).find((p) => p.slug === slug);

  if (!project) {
    // Before hydration the store is the shipped seed, so a locally-added
    // project would 404 for a frame. Wait for the real list before redirecting.
    if (!hydrated) return null;
    return <Navigate to="/work" replace />;
  }

  const bullets = approachLines(project);
  const tags = tagList(project);

  return (
    <>
      <SiteSeo route={{ name: 'project', slug: project.slug }} projects={projects} />
      <main>
        <section style={{ padding: 'clamp(44px,6vw,80px) 0 clamp(32px,4vw,48px)' }}>
          <div className="dl-wrap">
            <Breadcrumb trail={[{ to: '/work', label: 'Work' }]} current={project.title} />
            <h1
              style={{
                margin: '26px 0 0',
                fontSize: 'clamp(2.6rem,6vw,5rem)',
                lineHeight: .96,
                letterSpacing: '-.05em',
                fontWeight: 600,
              }}
            >
              {project.title}
            </h1>
            <p
              className="dl-measure-56"
              style={{ margin: '22px 0 0', fontSize: 'clamp(1.1rem,1.8vw,1.4rem)', lineHeight: 1.4, color: 'var(--dl-ink-3)' }}
            >
              {project.summary}
            </p>

            <div className="dl-tiles dl-tiles-150" style={{ marginTop: 36 }}>
              <Fact label="Client" value={project.client} />
              <Fact label="Category" value={project.category} />
              <Fact label="Year" value={project.year} />
              <Fact label="Updated" value={project.updated} />
            </div>

            {project.link ? (
              <div style={{ marginTop: 20 }}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dl-btn dl-btn-primary dl-btn-sm"
                  style={{ padding: '15px 22px' }}
                >
                  Visit the live product ↗
                </a>
              </div>
            ) : null}
          </div>
        </section>

        {project.cover ? (
          <section style={{ padding: '0 0 clamp(40px,5vw,68px)' }}>
            <div
              role="img"
              aria-label={`${project.title} — cover image`}
              className="dl-wrap dl-cover"
              style={{
                border: '1px solid var(--dl-line)',
                borderRadius: 6,
                height: 'clamp(260px,42vw,540px)',
                backgroundImage: `url("${project.cover}")`,
              }}
            />
          </section>
        ) : null}

        <section style={{ padding: '0 0 clamp(44px,6vw,80px)' }}>
          <div className="dl-wrap dl-grid dl-grid-300" style={{ gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow>The problem</Eyebrow>
              <p className="dl-prose" style={{ margin: '20px 0 0' }}>
                {project.challenge}
              </p>
              <div style={{ marginTop: 44 }}>
                <Eyebrow>The outcome</Eyebrow>
              </div>
              <p className="dl-prose" style={{ margin: '20px 0 0' }}>
                {project.result}
              </p>
            </div>

            <div className="dl-panel">
              <div className="dl-mono">What we built</div>
              <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 16 }}>
                {bullets.map((b) => (
                  <li key={b} className="dl-arrow-item" style={{ fontSize: 16.5 }}>
                    <span>→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {tags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: '1px solid var(--dl-line)',
                  }}
                >
                  {tags.map((t) => (
                    <span key={t} className="dl-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <FlameCta
          heading="Want something like this running in your business?"
          primary={{ to: '/contact', label: 'Discuss Your AI System' }}
          secondary={{ to: '/work', label: 'See What We Build' }}
        />
      </main>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--dl-sand)', padding: '18px 20px', boxShadow: '0 0 0 1px var(--dl-line)' }}>
      <div className="dl-mono-sm">{label}</div>
      <div style={{ marginTop: 7, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
