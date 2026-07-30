import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <p className="font-display text-2xl text-ink">DELAI<span className="text-ink-faint">.</span></p>
          <p className="text-sm text-ink-muted max-w-xs">
            Operational AI systems for modern businesses.
          </p>
        </div>
        <div>
          <p className="label-mono mb-4">Index</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-ink-muted hover:text-ink transition-colors">Home</Link></li>
            <li><Link to="/intelligence" className="text-ink-muted hover:text-ink transition-colors">Writing</Link></li>
            <li><a href="mailto:hello@meetdelai.com" className="text-ink-muted hover:text-ink transition-colors">Email</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-mono-label text-ink-faint">
            © {new Date().getFullYear()} DELAI · DELEONAI HOLDINGS LLC
          </p>
          <p className="font-mono text-mono-label text-ink-faint">
            BUILT IN SOUTH FLORIDA
          </p>
        </div>
      </div>
    </footer>
  );
}
