/** Small presentational pieces shared across the redesigned marketing pages. */
import { Link } from 'react-router-dom';
import type { Project } from '../../content';
import { projectHref } from '../../lib/portfolio';

export function Eyebrow({ children, tone = 'flame' }: { children: React.ReactNode; tone?: 'flame' | 'muted' | 'green' }) {
  const color = tone === 'flame' ? 'var(--dl-flame)' : tone === 'green' ? 'var(--dl-green)' : 'var(--dl-faint)';
  return (
    <div className="dl-mono" style={{ color }}>
      {children}
    </div>
  );
}

export function Breadcrumb({
  trail = [],
  current,
}: {
  trail?: Array<{ to: string; label: string }>;
  current: string;
}) {
  return (
    <nav
      className="dl-mono"
      style={{ fontSize: 11, letterSpacing: '.12em', display: 'flex', gap: 8, flexWrap: 'wrap' }}
      aria-label="Breadcrumb"
    >
      <Link to="/" style={{ color: 'var(--dl-faint)' }}>
        Home
      </Link>
      {trail.map((t) => (
        <span key={t.to} style={{ display: 'contents' }}>
          <span>/</span>
          <Link to={t.to} style={{ color: 'var(--dl-faint)' }}>
            {t.label}
          </Link>
        </span>
      ))}
      <span>/</span>
      <span style={{ color: 'var(--dl-ink)' }}>{current}</span>
    </nav>
  );
}

export function ProjectCard({ project, coverHeight = 190 }: { project: Project; coverHeight?: number }) {
  return (
    <Link to={projectHref(project)} className="dl-project-card">
      {project.cover ? (
        <div
          className="dl-cover"
          style={{ height: coverHeight, backgroundImage: `url("${project.cover}")` }}
        />
      ) : null}
      <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div
          className="dl-mono-sm"
          style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
        >
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.35rem', letterSpacing: '-.035em', fontWeight: 600 }}>{project.title}</h3>
        <p className="dl-body" style={{ margin: 0, flex: 1 }}>
          {project.summary}
        </p>
        <span className="dl-readmore">Case study →</span>
      </div>
    </Link>
  );
}

/** The orange closing band. `lines` are rendered as stacked buttons. */
export function FlameCta({
  eyebrow,
  heading,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  primary: { to: string; label: string };
  secondary?: { to: string; label: string };
}) {
  return (
    <section className="dl-sec-bottom">
      <div className="dl-wrap">
        <div
          className="dl-flame-block"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
            gap: 'clamp(24px,3vw,48px)',
            alignItems: 'end',
            padding: 'clamp(36px,5vw,68px)',
          }}
        >
          <div>
            {eyebrow ? (
              <div className="dl-mono" style={{ color: 'rgba(255,255,255,.75)' }}>
                {eyebrow}
              </div>
            ) : null}
            <h2
              style={{
                margin: '18px 0 0',
                fontSize: 'clamp(1.9rem,3.4vw,3rem)',
                lineHeight: 1.03,
                letterSpacing: '-.04em',
                fontWeight: 600,
                maxWidth: '18ch',
              }}
            >
              {heading}
            </h2>
            {body ? (
              <p
                style={{
                  margin: '18px 0 0',
                  fontSize: '1.02rem',
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,.86)',
                  maxWidth: '48ch',
                }}
              >
                {body}
              </p>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
            <Link to={primary.to} className="dl-btn dl-btn-dark dl-btn-block">
              {primary.label} <span>→</span>
            </Link>
            {secondary ? (
              <Link
                to={secondary.to}
                className="dl-btn dl-btn-block"
                style={{
                  background: 'rgba(255,255,255,.14)',
                  border: '1px solid rgba(255,255,255,.5)',
                  color: '#fff',
                  padding: '16px 25px',
                }}
              >
                {secondary.label} <span>→</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A two-column list of links inside a hairline stack. */
export function LinkStack({
  label,
  items,
}: {
  label: string;
  items: Array<{ to: string; primary: string; secondary?: string }>;
}) {
  return (
    <div>
      <div className="dl-mono">{label}</div>
      <div className="dl-stack" style={{ marginTop: 18 }}>
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            style={{
              padding: '20px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 600 }}>{i.primary}</span>
            {i.secondary ? (
              <span className="dl-mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>
                {i.secondary}
              </span>
            ) : (
              <span style={{ color: 'var(--dl-flame)' }}>→</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
