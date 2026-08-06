import { Link } from 'react-router-dom';
import { contact, locations, services } from '../../content';

export function SiteFooter() {
  return (
    <footer className="dl-footer">
      <div className="dl-wrap">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))',
            gap: 'clamp(28px,4vw,48px)',
          }}
        >
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dl-sand)' }}>
              <span className="dl-logo-mark" />
              <span className="dl-logo-text">DELAI</span>
            </Link>
            <p style={{ margin: '18px 0 0', fontSize: 15, lineHeight: 1.55, maxWidth: '34ch' }}>
              A South Florida AI technology company. We design, build, connect, and help operate AI systems inside real
              businesses.
            </p>
            <a
              href={`mailto:${contact.email}`}
              style={{ display: 'inline-block', marginTop: 18, color: 'var(--dl-sand)', fontWeight: 600, fontSize: 16 }}
            >
              {contact.email}
            </a>
            <div style={{ marginTop: 10, fontSize: 14.5 }}>Mon–Fri, 9:00–18:00 ET</div>
          </div>

          <FooterColumn title="Services">
            {services.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Service areas">
            {locations.map((l) => (
              <Link key={l.slug} to={`/south-florida/${l.slug}`}>
                {l.h1}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            <Link to="/work">Work</Link>
            <Link to="/about">About</Link>
            <Link to="/south-florida">South Florida</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin" style={{ color: '#6c6f67' }}>
              Admin
            </Link>
          </FooterColumn>
        </div>

        <div aria-hidden="true" className="dl-footer-word">
          <span>DELAI</span>
          <span />
        </div>

        <div className="dl-footer-legal">
          <span>© {new Date().getFullYear()} DELAI Solutions LLC · Miami · Fort Lauderdale · Palm Beach</span>
          <span>AI workflow automation · business process automation · connected systems</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: '#6c6f67',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'grid', gap: 9, marginTop: 16, fontSize: 15 }}>{children}</div>
    </div>
  );
}
