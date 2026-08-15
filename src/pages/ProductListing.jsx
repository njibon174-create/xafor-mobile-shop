import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../hooks/useCart';
import { formatBDT } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function ProductListing() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 250000]);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*').eq('is_active', true).order('price'),
          supabase.from('categories').select('*').order('sort_order'),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const brands = [...new Set(products.map(p => p.brand))].sort();

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Shop All</h1>
        <p className="text-gray-400 mt-2">Browse our collection of premium phones and accessories</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search phones, accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-dark dark:bg-surface-dark border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onBrandChange={setSelectedBrand}
              onPriceChange={setPriceRange}
              onReset={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setPriceRange([0, 250000]);
              }}
            />
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setPriceRange([0, 250000]);
              }}
              className="mt-6 w-full py-2.5 text-sm text-gray-400 hover:text-white border border-gray-800 rounded-lg hover:border-white transition-all"
            >
              Clear All Filters
            </button>
          </div>

          {/* Mobile Filters Toggle */}
          <div className="flex lg:hidden items-center gap-4 mb-6">
            <button className="p-2 border border-gray-800 rounded-lg hover:border-white transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="sr-only">Filters</span>
            </button>
            <span className="text-gray-400 text-sm">{filteredProducts.length} products</span>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface-dark dark:bg-surface-dark rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-800 rounded w-1/2" />
                      <div className="h-5 bg-gray-800 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    onViewDetails={() => navigate(`/product/${product.slug}`)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
