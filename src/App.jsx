import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import CitySelectPage from './pages/CitySelectPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductPage from './pages/ProductPage';
import VendorStorePage from './pages/VendorStorePage';
import CartPage from './pages/CartPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import CourierPage from './pages/CourierPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import CartFab from './components/CartFab';
import { useCartStore } from './store/useCartStore';

function AppInner() {
  const location = useLocation();
  const selectedCity = useCartStore((s) => s.selectedCity);

  // Dark mode auto based on hour (22h - 7h = dark)
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 22 || h < 7) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const showNav   = location.pathname !== '/';
  const showCart  = location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {showNav && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Page 1 : Sélecteur de Ville */}
          <Route path="/" element={<CitySelectPage />} />

          {/* Page 2 : Marketplace de la Ville */}
          <Route path="/ville/:cityId" element={<MarketplacePage />} />

          {/* Détail Produit */}
          <Route path="/produit/:id" element={<ProductPage />} />

          {/* Vitrine Vendeur */}
          <Route path="/boutique/:vendorId" element={<VendorStorePage />} />

          {/* Panier & Tracking */}
          <Route path="/panier" element={<CartPage />} />

          {/* Espace Vendeur SaaS */}
          <Route path="/dashboard/*" element={<VendorDashboardPage />} />

          {/* Espace Livreur */}
          <Route path="/livreur/*" element={<CourierPage />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Fallback */}
          <Route path="*" element={<CitySelectPage />} />
        </Routes>
      </AnimatePresence>
      {showCart && <CartFab />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
