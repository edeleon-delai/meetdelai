import { Link } from 'react-router-dom';
import { services } from '../../content';
import { publishedOnly, usePortfolio } from '../../lib/portfolio';
import { Eyebrow, FlameCta, ProjectCard, ServiceCard } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

/** The hero's fake-but-honest run log. Purely decorative. */
const FLOW = [
  { t: '06:12:04', step: 'INTAKE', detail: 'maintenance request · unit 4B · email' },
  { t: '06:12:05', step: 'CLASSIFY', detail: 'plumbing · urgency high · conf 0.94' },
  { t: '06:12:05', step: 'DECIDE', detail: 'vendor AquaFix · under approval limit', tone: 'flame' },
  { t: '06:12:06', step: 'ACT', detail: 'work order #4821 · tenant notified' },
  { t: '06:12:07', step: 'SYNC', detail: 'ledger updated · owner report queued' },
  { t: '06:12:07', step: 'DONE', detail: '3.1s · 0 manual handoffs', tone: 'green' },
] as const;

const PILLARS = [
  { n: '01 / Design', h: 'We map the real process', p: 'Not the org chart version. The one with the spreadsheet and the group text.' },
  { n: '02 / Build', h: 'We write the software', p: 'Automations, applications, and AI that does a defined job with defined limits.' },
  { n: '03 / Connect', h: 'We wire it into your systems', p: 'The CRM, the accounting package, the ticketing tool, the thing from 2011.' },
  { n: '04 / Operate', h: 'We keep it honest', p: 'Monitoring, tuning, and a human in the loop everywhere being wrong is expensive.' },
];

const STEPS = [
  { n: 'STEP 01', h: 'Find the drag', p: 'A half-day walkthrough of how work actually moves. You leave with a ranked list of what is automatable and roughly what it’s worth.' },
  { n: 'STEP 02', h: 'Design the system', p: 'The workflow, the data, the tools it touches, the permissions, and every point where a human still decides.' },
  { n: 'STEP 03', h: 'Build and connect', p: 'We build it, wire it into the systems you already pay for, and run it alongside your team until it’s trusted.' },
  { n: 'STEP 04', h: 'Operate and expand', p: 'We watch it in production, tune what it gets wrong, and reuse the foundation for the next process.' },
];

const AREA_LINKS = [
  { slug: 'miami', city: 'Miami', sub: 'Miami-Dade' },
  { slug: 'fort-lauderdale', city: 'Fort Lauderdale', sub: 'Broward' },
  { slug: 'broward-county', city: 'Broward County', sub: 'Hollywood · Pembroke Pines' },
  { slug: 'palm-beach-county', city: 'Palm Beach County', sub: 'Boca · West Palm' },
];

export function Home() {
  const { projects } = usePortfolio();
  const featured = publishedOnly(projects).filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <SiteSeo route={{ name: 'home' }} projects={projects} />
      <main>
        {/* ---------------------------------------------------------- hero */}
        <section className="dl-sec-hero">
          <div className="dl-wrap dl-grid dl-grid-2" style={{ alignItems: 'center', gap: 'clamp(32px,4vw,56px)' }}>
            <div>
              <div
                className="dl-mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  color: 'var(--dl-muted)',
                  border: '1px solid var(--dl-line)',
                  borderRadius: 2,
                  padding: '7px 11px',
                  background: 'var(--dl-panel)',
                }}
              >
                <span className="dl-dot" style={{ background: '#3fa34d' }} />
                AI Systems Company · South Florida
              </div>

              <h1 className="dl-h1-hero dl-measure-15" style={{ marginTop: 26 }}>
                Your team is doing the work your software should be doing.
              </h1>

              <p className="dl-lead dl-measure-52" style={{ margin: '26px 0 0' }}>
                DELAI designs, builds, connects, and helps operate AI systems inside real businesses. Not a tool
                recommendation. Not a strategy deck. Working software that runs the process.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
                <Link to="/contact" className="dl-btn dl-btn-primary">
                  Find Your First Automation →
                </Link>
                <Link to="/work" className="dl-btn dl-btn-outline">
                  See What We Build
                </Link>
              </div>

              <div
                className="dl-mono"
                style={{ marginTop: 26, fontSize: 11.5, letterSpacing: '.09em' }}
              >
                Miami · Fort Lauderdale · Broward · Palm Beach · On-site across South Florida
              </div>
            </div>

            <div className="dl-terminal">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderBottom: '1px solid rgba(220,229,226,.16)',
                  paddingBottom: 14,
                }}
              >
                <span className="dl-mono" style={{ letterSpacing: '.14em', color: '#8fa8a3' }}>
                  maintenance_intake.flow
                </span>
                <span
                  className="dl-mono"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, letterSpacing: '.1em', color: 'var(--dl-green)' }}
                >
                  <span className="dl-dot" style={{ width: 6, height: 6, background: 'var(--dl-green)' }} />
                  live
                </span>
              </div>

              <div style={{ display: 'grid', gap: 2, marginTop: 16 }}>
                {FLOW.map((row) => {
                  const tone = 'tone' in row ? row.tone : undefined;
                  return (
                    <div
                      key={row.step}
                      className="dl-term-row"
                      style={
                        tone === 'flame'
                          ? { background: 'rgba(255,82,39,.16)', border: '1px solid rgba(255,82,39,.35)' }
                          : tone === 'green'
                            ? { background: 'rgba(124,224,106,.1)', border: '1px solid rgba(124,224,106,.28)' }
                            : undefined
                      }
                    >
                      <span style={{ color: tone === 'flame' ? '#e0a18c' : '#6e8b86' }}>{row.t}</span>
                      <span
                        style={{
                          color: tone === 'flame' ? '#ffb39c' : tone === 'green' ? 'var(--dl-green)' : 'var(--dl-sand)',
                        }}
                      >
                        {row.step}
                      </span>
                      <span style={{ color: tone === 'flame' ? '#f5cdc0' : '#b7c7c3' }}>{row.detail}</span>
                    </div>
                  );
                })}
              </div>

              <p style={{ margin: '18px 0 0', fontSize: 14.5, lineHeight: 1.5, color: '#8fa8a3' }}>
                Three seconds of software instead of forty minutes of somebody&rsquo;s morning. That is the entire pitch.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- who we build for */}
        <section className="dl-rule-t dl-rule-b dl-alt" style={{ padding: '26px 0' }}>
          <div
            className="dl-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(20px,4vw,48px)',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <span className="dl-mono" style={{ letterSpacing: '.14em', whiteSpace: 'nowrap' }}>
              Who we build for
            </span>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, color: 'var(--dl-ink-2)' }}>
                Built for operators across hospitality, healthcare, real estate, professional services, and local
                commerce.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- four pillars */}
        <section className="dl-sec">
          <div className="dl-wrap">
            <div className="dl-grid dl-grid-320" style={{ alignItems: 'start' }}>
              <h2 className="dl-h2 dl-measure-16">
                We don&rsquo;t recommend AI tools. We build the thing and help you run it.
              </h2>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.55, color: 'var(--dl-ink-3)', maxWidth: '56ch' }}>
                Plenty of firms will audit your stack and hand you a roadmap. We do the four things that come after that
                — and we stay through the part where it has to actually work on a Tuesday.
              </p>
            </div>
            <div className="dl-tiles dl-tiles-230" style={{ marginTop: 'clamp(32px,4vw,56px)' }}>
              {PILLARS.map((p) => (
                <div key={p.n} className="dl-tile">
                  <div className="dl-mono" style={{ letterSpacing: '.14em', color: 'var(--dl-flame)' }}>
                    {p.n}
                  </div>
                  <h3 style={{ margin: '20px 0 8px', fontSize: '1.3rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    {p.h}
                  </h3>
                  <p className="dl-body" style={{ margin: 0 }}>
                    {p.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- services */}
        <section id="services" className="dl-sec dl-alt dl-rule-t dl-rule-b">
          <div className="dl-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <Eyebrow>What we build</Eyebrow>
                <h2 className="dl-h2 dl-measure-18" style={{ marginTop: 16 }}>
                  Six things, done properly.
                </h2>
              </div>
              <Link to="/services" className="dl-link-rule">
                All services →
              </Link>
            </div>
            <div className="dl-tiles dl-tiles-300" style={{ marginTop: 40 }}>
              {services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-sm">
                Automate a Business Process →
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ selected work */}
        {featured.length > 0 && (
          <section className="dl-sec">
            <div className="dl-wrap">
              <Eyebrow>Selected work</Eyebrow>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  gap: 32,
                  flexWrap: 'wrap',
                  marginTop: 16,
                }}
              >
                <h2 className="dl-h2 dl-measure-18">Systems and products we&rsquo;ve shipped.</h2>
                <Link to="/work" className="dl-link-rule">
                  See what we build →
                </Link>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
                  gap: 20,
                  marginTop: 40,
                }}
              >
                {featured.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------- service area */}
        <section className="dl-sec" style={{ background: 'var(--dl-pine)', color: 'var(--dl-pine-ink)' }}>
          <div className="dl-wrap dl-grid dl-grid-320" style={{ alignItems: 'center', gap: 'clamp(28px,4vw,64px)' }}>
            <div>
              <Eyebrow tone="green">Service area</Eyebrow>
              <h2 className="dl-h2 dl-measure-16" style={{ marginTop: 18, color: 'var(--dl-sand)' }}>
                An AI automation company that will actually come to your office.
              </h2>
              <p style={{ margin: '22px 0 0', fontSize: '1.05rem', lineHeight: 1.55, color: '#8fa8a3', maxWidth: '52ch' }}>
                We prefer to see the process where it happens. DELAI works on-site across Miami-Dade, Broward, and Palm
                Beach County, with remote delivery available everywhere else.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link to="/south-florida" className="dl-btn dl-btn-primary dl-btn-sm">
                  See our service area →
                </Link>
              </div>
            </div>
            <div className="dl-tiles dl-tiles-180">
              {AREA_LINKS.map((a) => (
                <Link
                  key={a.slug}
                  to={`/south-florida/${a.slug}`}
                  style={{
                    background: 'var(--dl-pine)',
                    padding: '24px 22px',
                    display: 'block',
                    boxShadow: '0 0 0 1px rgba(220,229,226,.2)',
                  }}
                >
                  <div style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dl-sand)' }}>
                    {a.city}
                  </div>
                  <div
                    className="dl-mono"
                    style={{ fontSize: 11, letterSpacing: '.1em', color: '#7a9591', marginTop: 6 }}
                  >
                    {a.sub}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- how it works */}
        <section className="dl-sec dl-rule-b">
          <div className="dl-wrap">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="dl-h2 dl-measure-20" style={{ marginTop: 16 }}>
              Start with one process. Not a transformation program.
            </h2>
            <div className="dl-tiles dl-tiles-240" style={{ marginTop: 40 }}>
              {STEPS.map((s) => (
                <div key={s.n} className="dl-tile dl-tile-lg">
                  <div className="dl-mono" style={{ letterSpacing: '.14em', color: 'var(--dl-flame)' }}>
                    {s.n}
                  </div>
                  <h3 style={{ margin: '24px 0 10px', fontSize: '1.3rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    {s.h}
                  </h3>
                  <p className="dl-body" style={{ margin: 0 }}>
                    {s.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FlameCta
          eyebrow="Start somewhere useful"
          heading="Tell us the process. We'll tell you if it's worth automating."
          body="Straight answer, no proposal theater. If it isn't worth building, we'll say so."
          primary={{ to: '/contact', label: 'Find Your First Automation' }}
          secondary={{ to: '/contact', label: 'Discuss Your AI System' }}
        />
      </main>
    </>
  );
}
