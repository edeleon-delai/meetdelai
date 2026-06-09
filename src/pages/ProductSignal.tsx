import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { SignalProductSections } from '@/components/signal/SignalProductSections';

/** Signal product page — meetdelai.com/products/signal. The marketing sections
 *  live in a shared pure component so the prerender stub renders identical
 *  markup. */
export function ProductSignal() {
  return (
    <>
      <Seo
        title="Signal — turn anything into a clear, narrated read"
        description="Signal turns a thought, link, PDF, screenshot, or voice note into a sharp, narrated piece — then helps you learn it and remembers what matters to you. A DELAI product. Free to start."
        canonical="https://meetdelai.com/products/signal"
        jsonLd={signalAppSchema()}
      />
      <TopNav />
      <main>
        <SignalProductSections />
      </main>
      <Footer />
    </>
  );
}

/** schema.org/SoftwareApplication for rich results. */
function signalAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Signal',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web, iOS',
    url: 'https://signal.meetdelai.com',
    description:
      'Signal turns anything — a thought, link, PDF, screenshot, or voice note — into a clear, narrated read, helps you learn it, and remembers what matters to you.',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
      { '@type': 'Offer', price: '5.99', priceCurrency: 'USD', name: 'Signal Pro (monthly)' },
      { '@type': 'Offer', price: '49.99', priceCurrency: 'USD', name: 'Signal Pro (annual)' },
    ],
    publisher: { '@type': 'Organization', name: 'DELAI', url: 'https://meetdelai.com' },
  };
}
