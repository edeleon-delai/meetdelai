import { useState, type FormEvent } from 'react';
import { contact } from '../../content';
import { Breadcrumb } from '../../components/site/bits';
import { SiteSeo } from '../../components/site/SiteSeo';

const WHERE = [
  'Miami / Miami-Dade',
  'Fort Lauderdale / Broward',
  'Palm Beach County',
  'Elsewhere in Florida',
  'Outside Florida',
];

type Status = 'idle' | 'sending' | 'done' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  /** Kept so a failed submit can still hand off to a mail client. */
  const [lastBody, setLastBody] = useState<{ subject: string; body: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const get = (n: string) =>
      ((f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value ?? '').trim();

    const name = get('name');
    const company = get('company');
    const email = get('email');
    const where = get('where');
    const process = get('process');

    setLastBody({
      subject: `First automation — ${company || name}`,
      body: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nLocation: ${where}\n\nProcess to automate:\n${process}`,
    });

    setStatus('sending');
    setError('');

    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: name,
          email,
          business_name: company || undefined,
          where,
          goal: process,
          source: 'find-your-first-automation',
          referrer: document.referrer || undefined,
          utm_source: params.get('utm_source') || undefined,
          utm_medium: params.get('utm_medium') || undefined,
          utm_campaign: params.get('utm_campaign') || undefined,
          utm_term: params.get('utm_term') || undefined,
          company_website: get('company_website'),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Something went wrong.');
      }
      setStatus('done');
      f.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  const mailtoHref = lastBody
    ? `mailto:${contact.email}?subject=${encodeURIComponent(lastBody.subject)}&body=${encodeURIComponent(lastBody.body)}`
    : `mailto:${contact.email}`;

  return (
    <>
      <SiteSeo route={{ name: 'contact' }} />
      <main>
        <section style={{ padding: 'clamp(44px,6vw,80px) 0 clamp(56px,7vw,104px)' }}>
          <div className="dl-wrap">
            <Breadcrumb current="Contact" />
            <div
              className="dl-grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
                gap: 'clamp(32px,4vw,72px)',
                marginTop: 28,
                alignItems: 'start',
              }}
            >
              <div>
                <h1 className="dl-h1-detail dl-measure-14" style={{ lineHeight: .99 }}>
                  Tell us the process.
                </h1>
                <p className="dl-measure-48" style={{ margin: '22px 0 0', fontSize: '1.12rem', lineHeight: 1.5, color: 'var(--dl-ink-3)' }}>
                  Describe the work your team does by hand. We&rsquo;ll tell you whether it&rsquo;s worth automating,
                  roughly what it takes, and where we&rsquo;d start. No proposal theater.
                </p>

                <div className="dl-stack" style={{ marginTop: 36 }}>
                  <div style={{ padding: '22px 24px' }}>
                    <div className="dl-mono-sm">Email</div>
                    <a
                      href={`mailto:${contact.email}`}
                      style={{ display: 'block', marginTop: 7, fontWeight: 600, fontSize: 17 }}
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div style={{ padding: '22px 24px' }}>
                    <div className="dl-mono-sm">Service area</div>
                    <div style={{ marginTop: 7, fontSize: 16.5, lineHeight: 1.45 }}>
                      Miami-Dade, Broward, and Palm Beach County. On-site for discovery, remote for the rest.
                    </div>
                  </div>
                  <div style={{ padding: '22px 24px' }}>
                    <div className="dl-mono-sm">Hours</div>
                    <div style={{ marginTop: 7, fontSize: 16.5 }}>Monday–Friday, 9:00–18:00 ET</div>
                  </div>
                </div>
              </div>

              {status === 'done' ? (
                <div className="dl-form" role="status" style={{ gap: 12 }}>
                  <div className="dl-mono dl-mono-flame">Received</div>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '-.03em', fontWeight: 600 }}>
                    That&rsquo;s in front of us.
                  </h2>
                  <p className="dl-body-m" style={{ margin: 0 }}>
                    A person reads every one of these. Expect a straight answer within a business day — whether the
                    process is worth automating or not.
                  </p>
                  <button
                    type="button"
                    className="dl-row-btn"
                    style={{ justifySelf: 'start', marginTop: 6 }}
                    onClick={() => setStatus('idle')}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form id="delai-contact" onSubmit={onSubmit} className="dl-form">
                  <Field id="c-name" name="name" label="Name" required />
                  <Field id="c-company" name="company" label="Company" />
                  <Field id="c-email" name="email" label="Email" type="email" required />

                  <div className="dl-field">
                    <label htmlFor="c-where" className="dl-label">
                      Where are you
                    </label>
                    <select id="c-where" name="where" className="dl-input" defaultValue={WHERE[0]}>
                      {WHERE.map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="dl-field">
                    <label htmlFor="c-process" className="dl-label">
                      The process you&rsquo;d automate first
                    </label>
                    <textarea
                      id="c-process"
                      name="process"
                      required
                      rows={5}
                      placeholder="Every maintenance request comes into a shared inbox and a coordinator retypes it into two systems…"
                      className="dl-input dl-textarea"
                    />
                  </div>

                  {/* Honeypot: offscreen rather than display:none, which some
                      bots detect and skip. Never shown, never tabbable. */}
                  <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="c-company-website">Company website</label>
                    <input id="c-company-website" name="company_website" tabIndex={-1} autoComplete="off" />
                  </div>

                  {status === 'error' ? (
                    <div style={{ color: '#c2400f', fontSize: 14.5, lineHeight: 1.45 }} role="alert">
                      {error}{' '}
                      <a href={mailtoHref} style={{ color: '#c2400f', textDecoration: 'underline' }}>
                        Send it by email instead →
                      </a>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="dl-btn dl-btn-primary"
                    style={{ justifyContent: 'center', marginTop: 6, opacity: status === 'sending' ? .7 : 1 }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Find Your First Automation →'}
                  </button>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--dl-faint)', lineHeight: 1.45 }}>
                    Goes straight to a person at DELAI. Or write to {contact.email} directly.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="dl-field">
      <label htmlFor={id} className="dl-label">
        {label}
      </label>
      <input id={id} name={name} type={type} required={required} className="dl-input" />
    </div>
  );
}
