import { Route } from 'react-router-dom';
import { SiteShell } from './components/site/SiteShell';
import { Home } from './pages/site/Home';
import { Services } from './pages/site/Services';
import { ServiceDetail } from './pages/site/ServiceDetail';
import { Work } from './pages/site/Work';
import { ProjectDetail } from './pages/site/ProjectDetail';
import { Areas } from './pages/site/Areas';
import { LocationDetail } from './pages/site/LocationDetail';
import { About } from './pages/site/About';
import { Contact } from './pages/site/Contact';
import { Admin } from './pages/admin/Admin';

/**
 * The redesigned site's route table, as <Route> elements.
 *
 * Shared by App.tsx and scripts/prerender.tsx so the static HTML a crawler
 * receives is produced by the same components the browser renders. Defining it
 * twice is how prerendered markup silently drifts from the live app.
 */
export function marketingRoutes() {
  return (
    <Route element={<SiteShell />}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/work" element={<Work />} />
      <Route path="/work/:slug" element={<ProjectDetail />} />
      <Route path="/south-florida" element={<Areas />} />
      <Route path="/south-florida/:slug" element={<LocationDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Home />} />
    </Route>
  );
}
