import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../utils/supabaseClient';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function Navbar({ onCartClick, onWishlistClick, siteSettings }) {
  const { theme, toggleTheme } = useTheme();
  const [brands, setBrands] = useState([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const siteName = siteSettings?.site_name || 'Xafor Mobile Shop';

  useEffect(() => {
    let isMounted = true;
    supabase
      .from('products')
      .select('brand')
      .eq('is_active', true)
      .then(({ data }) => {
        if (!isMounted || !data) return;
        const unique = [...new Set(data.map(d => d.brand))].sort();
        setBrands(unique);
      });
    return () => { isMounted = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-surface-dark/90 dark:bg-surface-dark/90 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-white flex items-center justify-center rounded-lg">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">{siteName}</span>
          </button>

          {/* Brands dropdown (desktop) */}
          <div className="hidden lg:block relative" onMouseLeave={() => setBrandOpen(false)}>
            <button
              onClick={() => setBrandOpen(o => !o)}
              onMouseEnter={() => setBrandOpen(true)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Brands
              <svg className={`w-4 h-4 transition-transform ${brandOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {brandOpen && brands.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-surface-dark dark:bg-surface-dark border border-gray-800 rounded-xl p-2 shadow-2xl z-50">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => { setBrandOpen(false); navigate(`/brand/${b}`); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search phones, accessories..."
                className="w-full pl-12 pr-4 py-2 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="p-2.5 rounded-lg hover:bg-gray-800 transition-colors relative"
              title="Wishlist"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="p-2.5 rounded-lg hover:bg-gray-800 transition-colors relative"
              title="Cart"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-gray-800 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Hamburger (mobile) */}
            <button className="md:hidden p-2.5 rounded-lg hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
            />
          </div>
        </form>
      </div>
    </motion.nav>
  );
}
