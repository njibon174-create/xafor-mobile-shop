import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';
import { fetchSiteSettings } from './utils/supabaseClient';
import { motion } from 'framer-motion';

import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import BrandPage from './pages/BrandPage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import WishlistPage from './pages/WishlistPage';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    let timer;
    async function init() {
      setLoading(true);
      try {
        // Add a timeout to the settings fetch so it doesn't hang the app
        const settingsPromise = fetchSiteSettings();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const settings = await Promise.race([settingsPromise, timeoutPromise]);
        setSiteSettings(settings);
        if (settings?.dark_mode_enabled === false) {
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.error('Failed to load site settings, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
    return () => clearTimeout(timer);
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
      <Navbar
        onCartClick={() => setCartOpen(true)}
        onWishlistClick={() => setWishlistOpen(true)}
        siteSettings={siteSettings}
      />
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
              path="/brand/:slug"
              element={
                <AnimatedPage>
                  <BrandPage />
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
            <Route
              path="/wishlist"
              element={
                <AnimatedPage>
                  <WishlistPage />
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

      <CartDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        isWishlist
        onCheckoutSuccess={() => {}}
        siteSettings={siteSettings}
      />
    </div>
  );
}
