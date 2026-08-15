import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function Home({ siteSettings }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, catsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true)
            .order('rating', { ascending: false })
            .limit(8),
          supabase.from('categories').select('*').order('sort_order').limit(6),
        ]);
        setFeaturedProducts(productsRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const siteName = siteSettings?.site_name || 'Xafor Mobile Shop';
  const tagline = siteSettings?.tagline || 'Premium Mobile Phones & Accessories in Bangladesh';

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-20"
        >
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full mb-6"
            >
              {tagline}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              {siteName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-400 mt-6 max-w-xl leading-relaxed"
            >
              Premium smartphones and accessories at the best prices in Bangladesh.
              Authentic products, Cash on Delivery, and fast shipping.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-black/20"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/track-order')}
                className="px-8 py-3.5 border border-gray-700 text-white font-semibold rounded-xl hover:border-white hover:text-white transition-all"
              >
                Track Order
              </button>
            </motion.div>
          </div>
        </motion.div>
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-white/3 to-transparent rounded-full blur-3xl" />
      </section>

      {/* Features bar */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'Over ৳5,000' },
            { icon: '💵', title: 'Cash on Delivery', desc: 'Pay on arrival' },
            { icon: '🔒', title: 'Secure Shopping', desc: '100% Authentic' },
            { icon: '🔄', title: 'Easy Returns', desc: '7-day policy' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 p-4 bg-surface-dark dark:bg-surface-dark rounded-xl border border-gray-800/50"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Products</h2>
            <p className="text-gray-400 mt-1">Handpicked premium phones and accessories</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-dark dark:bg-surface-dark rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-6 bg-gray-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No featured products yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                onViewDetails={() => navigate(`/product/${product.slug}`)}
              />
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 border border-gray-700 text-white font-semibold rounded-xl hover:border-white hover:text-white transition-all inline-flex items-center gap-2"
          >
            Browse All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Shop by Category</h2>
            <p className="text-gray-400 mt-1">Find exactly what you need</p>
          </div>
        </motion.div>

        {categories.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Smartphones', desc: 'Latest flagship & mid-range phones', icon: '📱', count: 9 },
              { name: 'Accessories', desc: 'Cases, chargers, cables & more', icon: '🎧', count: 7 },
              { name: 'Audio', desc: 'Earphones, headphones & speakers', icon: '🎵', count: 3 },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.1 }}
                onClick={() => navigate('/products')}
                className="group p-6 bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 hover:border-white transition-all cursor-pointer"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-lg font-semibold text-white group-hover:text-gray-200 transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{cat.desc}</p>
                <span className="text-xs text-gray-600 mt-2 block">{cat.count} products</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {categories.map(cat => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 hover:border-white transition-all cursor-pointer"
                onClick={() => {
                  const url = new URL('/products', window.location.origin);
                  url.searchParams.set('category', cat.slug);
                  navigate(`/products?category=${cat.slug}`);
                }}
              >
                {cat.image_url && (
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-gray-800">
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white group-hover:text-gray-200 transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-gray-800 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white/5,transparent_50%)]" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to find your perfect phone?</h2>
            <p className="text-gray-400 mb-6 max-w-md">Explore hundreds of smartphones and accessories. Cash on Delivery available across Bangladesh.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
