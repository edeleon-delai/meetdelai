import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/south-florida', label: 'South Florida' },
  { to: '/about', label: 'About' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  return (
    <header className="dl-header">
      <div className="dl-wrap dl-header-bar">
        <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="dl-logo-mark" />
          <span className="dl-logo-text">DELAI</span>
        </Link>

        <nav className="dl-nav-desktop">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: pathname.startsWith(l.to) ? 'var(--dl-flame)' : undefined,
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className="dl-btn dl-btn-primary" style={{ padding: '12px 18px', fontSize: 14 }}>
            Find Your First Automation
          </Link>
        </nav>

        <button
          type="button"
          className="dl-nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="dl-nav-mobile">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={close}>
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={close}
            className="dl-btn dl-btn-primary"
            style={{ marginTop: 10, justifyContent: 'center', padding: '16px 18px', minHeight: 44 }}
          >
            Find Your First Automation →
          </Link>
        </nav>
      )}
    </header>
  );
}
