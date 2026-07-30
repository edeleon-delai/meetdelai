import { Link } from 'react-router-dom';
import { footerBlurb, portfolio } from '../content';

export function Footer() {
  // Portfolio is data now (content/site.json). An empty list hides the column
  // entirely rather than leaving a bare heading — retiring the last product
  // should not leave a ghost.
  const showPortfolio = portfolio.length > 0;

  return (
    <footer className="mt-24 border-t border-line bg-bg">
      <div className={`mx-auto max-w-6xl px-5 sm:px-8 py-16 grid gap-12 ${showPortfolio ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <div className="space-y-3">
          <p className="font-display text-2xl text-ink">DELAI<span className="text-ink-faint">.</span></p>
          <p className="text-sm text-ink-muted max-w-xs">
            {footerBlurb}
          </p>
        </div>
        {showPortfolio && (
          <div>
            <p className="label-mono mb-4">Portfolio</p>
            <ul className="space-y-2">
              {portfolio.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-ink-muted hover:text-ink transition-colors">
                    {p.name}
                    <span className="text-ink-faint ml-2">— {p.tag}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
