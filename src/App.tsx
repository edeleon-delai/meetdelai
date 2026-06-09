import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Landing } from './pages/Landing';
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
          <Route path="/" element={<Landing />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/intelligence/:slug" element={<ArticleDetail />} />
          <Route path="/machine" element={<MachineReader />} />
          <Route path="/products/signal" element={<ProductSignal />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
