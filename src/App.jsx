import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy, useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Customize from './pages/Customize';
import Cart from './pages/Cart';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { getSiteStatus } from './lib/supabase';
import './styles/global.css';

const Admin = lazy(() => import('./pages/Admin'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteStatusGate({ mode, children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // Admin always accessible
  if (isAdmin) return children;

  if (mode === 'coming_soon') {
    return (
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading…</div>}>
        <ComingSoon />
      </Suspense>
    );
  }

  if (mode === 'maintenance') {
    return (
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading…</div>}>
        <Maintenance />
      </Suspense>
    );
  }

  return children;
}

function App() {
  const [siteMode, setSiteMode] = useState('live');
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    getSiteStatus().then((mode) => {
      setSiteMode(mode);
      setStatusLoaded(true);
    });
  }, []);

  // Don't render routes until status is checked (prevents flash)
  if (!statusLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9rem' }}>Loading…</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <SiteStatusGate mode={siteMode}>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/posters" element={<Category />} />
            <Route path="/posters/:subCategory" element={<Category />} />
            <Route path="/framed-posters" element={<Category />} />
            <Route path="/framed-posters/:subCategory" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading admin…</div>}><Admin onStatusChange={setSiteMode} /></Suspense>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </SiteStatusGate>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
