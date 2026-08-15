import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useCart } from './hooks/useCart';
import { fetchSiteSettings } from './utils/supabaseClient';
import { motion } from 'framer-motion';

import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const settings = await fetchSiteSettings();
        setSiteSettings(settings);
        if (settings?.dark_mode_enabled !== false) {
          document.documentElement.classList.add('dark');
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCheckoutSuccess = () => {
    clearCart();
    setCartOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark text-white">
      <Navbar onCartClick={() => setCartOpen(true)} siteSettings={siteSettings} />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Home siteSettings={siteSettings} />
                </AnimatedPage>
              }
            />
            <Route
              path="/products"
              element={
                <AnimatedPage>
                  <ProductListing />
                </AnimatedPage>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <AnimatedPage>
                  <ProductDetail />
                </AnimatedPage>
              }
            />
            <Route
              path="/cart"
              element={
                <AnimatedPage>
                  <CartPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/checkout"
              element={
                <AnimatedPage>
                  <Checkout onSuccess={handleCheckoutSuccess} />
                </AnimatedPage>
              }
            />
            <Route
              path="/order-success"
              element={
                <AnimatedPage>
                  <OrderSuccess />
                </AnimatedPage>
              }
            />
            <Route
              path="/track-order"
              element={
                <AnimatedPage>
                  <TrackOrder />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer siteSettings={siteSettings} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckoutSuccess={handleCheckoutSuccess}
        siteSettings={siteSettings}
      />
    </div>
  );
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {children}
    </motion.div>
  );
}
