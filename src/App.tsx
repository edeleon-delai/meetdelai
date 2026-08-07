import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { marketingRoutes } from './marketingRoutes';
import { Intelligence } from './pages/Intelligence';
import { ArticleDetail } from './pages/ArticleDetail';
import { MachineReader } from './pages/MachineReader';
import { ProductSignal } from './pages/ProductSignal';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Pre-redesign surfaces, kept because things outside this repo point
              at them: /machine and llms.txt are the agent-discoverability layer
              the DELAI MCP advertises, and the articles are served from the API.
              They still render on the old dark tokens — restyling them is
              follow-up work, not part of this brief. Declared first so their
              exact paths win over the redesign's catch-all. */}
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/intelligence/:slug" element={<ArticleDetail />} />
          <Route path="/machine" element={<MachineReader />} />
          <Route path="/products/signal" element={<ProductSignal />} />

          {/* Redesigned marketing site + admin. The comp routed on the hash
              (#/services); real paths are used here instead, because the whole
              brief is built around canonical URLs, breadcrumbs and JSON-LD,
              and a fragment is invisible to all three. */}
          {marketingRoutes()}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
