/**
 * Signal product page sections — pure, presentational, no router hooks and no
 * `@/` imports, so BOTH the interactive page (src/pages/ProductSignal.tsx) and
 * the static prerender stub (scripts/prerender.tsx) can render the exact same
 * markup. Plain <a> tags only (the CTA is an external link to the app; the
 * pricing anchor is a hash link).
 *
 * Vendor-neutral by mandate: no stack/model/provider names appear in this
 * public surface — capabilities are described, not the infrastructure.
 */
import * as React from 'react'; // referenced via React.Fragment so the prerender
                                // (classic JSX via tsx) has React in scope.

/** The Signal web app signup deep-link. The app reads `?mode=signup` and shows
 *  the signup form on its auth screen. */
const SIGNUP_URL = 'https://signal.meetdelai.com/?mode=signup';
const SIGNIN_URL = 'https://signal.meetdelai.com/';
const ACCENT = '#F54E00';

const INPUTS = ['A topic', 'A question', 'A link', 'A PDF', 'A screenshot', 'A voice note', 'A YouTube video', 'Your notes'];

const PILLARS = [
  {
    kicker: 'Capture',
    title: 'Turn anything into a clear, narrated read.',
    body: 'Drop in a thought, a link, a PDF, a screenshot, or a voice note. Signal reads it, structures it, and hands you a sharp written piece — with studio-quality narration you can listen to anywhere.',
  },
  {
    kicker: 'Learn',
    title: 'Actually learn it — by doing.',
    body: 'Every topic becomes an interactive micro-lesson: short challenges, instant feedback, and the why behind each answer. Build a roadmap and level up, one focused session at a time.',
  },
  {
    kicker: 'Remember',
    title: 'A library that remembers what matters to you.',
    body: 'Everything you make is saved, searchable, and connected. Signal learns what you care about and gets sharper every time you use it — your own second brain, that talks back.',
  },
];

const FREE = ['10 pieces / month', '3 narrations / month', '10 follow-up chats / month', '1 learning roadmap / month'];
const PRO = ['Unlimited pieces', 'Unlimited narration', 'Unlimited follow-up chat', 'Unlimited roadmaps & lessons', 'Priority generation'];

export function SignalProductSections() {
  return (
    <React.Fragment>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        {/* soft Signal-orange glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-[120px] opacity-25"
          style={{ background: ACCENT }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-32 pb-20 sm:pb-28">
          <p className="label-mono mb-8">
            DELAI <span className="text-ink-faint">·</span>{' '}
            <span style={{ color: ACCENT }}>SIGNAL</span>
          </p>
          <h1 className="font-display text-headline-xl text-ink max-w-4xl">
            Turn anything into a clear,<br />
            <span className="italic text-ink-muted">narrated read.</span>
          </h1>
          <p className="mt-8 text-body-lg text-ink-muted max-w-2xl">
            Paste a thought, drop a link, upload a file, or record a voice note. Signal turns it
            into a sharp, narrated piece — then helps you actually learn it and remembers what
            matters to you.
          </p>
          <p className="mt-4 text-body-lg text-ink max-w-2xl">Your second brain, that talks back.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center gap-2 px-7 py-3.5 font-body text-sm uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              Start free
            </a>
            <a href={SIGNIN_URL} className="btn-ghost">Sign in</a>
          </div>
          <p className="mt-5 label-mono">Free to start · no credit card</p>
        </div>
      </section>

      {/* Capture anything */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
          <p className="label-mono mb-6">Capture anything</p>
          <h2 className="font-display text-headline-lg text-ink max-w-3xl">
            However the idea shows up, Signal understands it.
          </h2>
          <p className="mt-6 text-body-md text-ink-muted max-w-2xl">
            No forms, no formats to pick. Type, paste, link, upload, or speak — Signal infers what
            you mean and gets to work.
          </p>
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {INPUTS.map((i) => (
              <li key={i} className="bg-bg-2 p-6 flex items-baseline gap-3">
                <span className="font-mono text-mono-label" style={{ color: ACCENT }}>→</span>
                <span className="text-body-md text-ink">{i}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-body-md text-ink-muted max-w-2xl">
            One clear, narrated piece — every time.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
          <p className="label-mono mb-6">What you get</p>
          <div className="grid gap-px bg-line lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.kicker} className="bg-bg p-8">
                <p className="label-mono mb-4" style={{ color: ACCENT }}>{p.kicker}</p>
                <h3 className="font-display text-2xl text-ink leading-snug">{p.title}</h3>
                <p className="mt-4 text-body-md text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
          <p className="label-mono mb-6">Pricing</p>
          <h2 className="font-display text-headline-lg text-ink max-w-3xl">
            Start free. Go unlimited when you're hooked.
          </h2>
          <div className="mt-12 grid gap-px bg-line md:grid-cols-2">
            {/* Free */}
            <div className="bg-bg p-8">
              <p className="label-mono">Free</p>
              <p className="mt-4 font-display text-headline-md text-ink">$0</p>
              <p className="mt-1 text-sm text-ink-muted">Everything you need to start.</p>
              <ul className="mt-8 space-y-3">
                {FREE.map((f) => (
                  <li key={f} className="flex items-baseline gap-3 text-body-md text-ink">
                    <span className="font-mono text-mono-label text-ink-faint">·</span>{f}
                  </li>
                ))}
              </ul>
              <a href={SIGNUP_URL} className="btn-ghost mt-8">Start free</a>
            </div>
            {/* Pro */}
            <div className="bg-bg p-8" style={{ boxShadow: `inset 0 0 0 1px ${ACCENT}` }}>
              <div className="flex items-center gap-3">
                <p className="label-mono" style={{ color: ACCENT }}>Signal Pro</p>
                <span className="font-mono text-mono-label px-2 py-0.5" style={{ color: ACCENT, border: `1px solid ${ACCENT}` }}>Save 30%</span>
              </div>
              <p className="mt-4 font-display text-headline-md text-ink">
                $49.99 <span className="text-ink-muted text-2xl">/ year</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">or $5.99 / month · cancel anytime.</p>
              <ul className="mt-8 space-y-3">
                {PRO.map((f) => (
                  <li key={f} className="flex items-baseline gap-3 text-body-md text-ink">
                    <span className="font-mono text-mono-label" style={{ color: ACCENT }}>·</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href={SIGNUP_URL}
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 font-body text-sm uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                style={{ background: ACCENT }}
              >
                Start free
              </a>
            </div>
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            No card to start. Upgrade in-app the moment you want unlimited.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 sm:py-28 text-center">
          <p className="label-mono mb-6">Make your first piece</p>
          <h2 className="font-display text-headline-lg text-ink">
            Give Signal one idea.<br />Get back something worth keeping.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center gap-2 px-7 py-3.5 font-body text-sm uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              Start free
            </a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
