import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
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
import './styles/global.css';

const Admin = lazy(() => import('./pages/Admin'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
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
          <Route path="/admin" element={<Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading admin…</div>}><Admin /></Suspense>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
