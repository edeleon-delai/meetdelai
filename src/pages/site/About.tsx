import { Link } from 'react-router-dom';
import { Breadcrumb, Eyebrow } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

const PRINCIPLES = [
  {
    h: "We build, we don't just advise",
    p: "Every engagement produces working software. If all you need is a roadmap, we're the wrong call.",
  },
  {
    h: 'A human stays in the loop',
    p: 'Automation handles the routine. People handle judgment, exceptions, and anything expensive to get wrong. Including on this website — our own AI agent drafts portfolio updates, but a person approves every publish.',
  },
  {
    h: 'We tell you when not to build',
    p: "Some processes aren't worth automating. We'd rather say that in week one than bill you for six.",
  },
  {
    h: 'You own everything',
    p: "The code, the data, the accounts. No dependency you can't unwind.",
  },
];

export function About() {
  return (
    <>
      <SiteSeo route={{ name: 'about' }} />
      <main>
        <section className="dl-sec-head dl-rule-b">
          <div className="dl-wrap">
            <Breadcrumb current="About" />
            <h1 className="dl-h1 dl-measure-16" style={{ marginTop: 26 }}>
              A South Florida AI company that ships software.
            </h1>
            <p className="dl-lead-sm dl-measure-60" style={{ margin: '24px 0 0' }}>
              DELAI is a technology company, not an advisory firm. We design, build, connect, and help operate
              AI-powered systems inside small and medium businesses — and we&rsquo;re accountable for whether they work.
            </p>
          </div>
        </section>

        <section className="dl-sec-sm">
          <div className="dl-wrap dl-grid dl-grid-300" style={{ gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow>How we work</Eyebrow>
              <p className="dl-prose" style={{ margin: '20px 0 0' }}>
                Most AI projects fail for boring reasons. Nobody mapped the real process. The data lived in four systems
                that disagreed. The tool got built for a demo instead of for the person who has to use it forty times a
                day. There was no plan for what happens when the model is wrong.
              </p>
              <p className="dl-prose" style={{ margin: '18px 0 0' }}>
                So we start small and concrete: one process, mapped honestly, rebuilt as software, wired into the
                systems you already pay for, with a human checkpoint anywhere being wrong is expensive. Then we watch it
                run and fix what it gets wrong. Then we do the next one.
              </p>
              <p className="dl-prose" style={{ margin: '18px 0 0' }}>
                We&rsquo;re based in South Florida and work on-site across Miami-Dade, Broward, and Palm Beach County. We
                prefer to see the process where it happens — at people&rsquo;s desks, watching the work move — with
                remote delivery available everywhere else.
              </p>
            </div>

            <div className="dl-stack">
              {PRINCIPLES.map((p) => (
                <div key={p.h} style={{ padding: 26 }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    {p.h}
                  </h3>
                  <p className="dl-body-m" style={{ margin: 0 }}>
                    {p.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dl-sec-bottom">
          <div className="dl-wrap">
            <div
              className="dl-pine-block"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 32, alignItems: 'center' }}
            >
              <h2 className="dl-h2-sm dl-measure-18">Show us the work your team keeps doing by hand.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'start' }}>
                <Link to="/contact" className="dl-btn dl-btn-primary dl-btn-block" style={{ padding: '16px 24px' }}>
                  Find Your First Automation <span>→</span>
                </Link>
                <Link
                  to="/services"
                  className="dl-btn dl-btn-block"
                  style={{ border: '1px solid rgba(220,229,226,.4)', padding: '15px 23px' }}
                >
                  Browse services <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
