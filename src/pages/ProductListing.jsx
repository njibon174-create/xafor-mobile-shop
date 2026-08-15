import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { formatBDT } from '../utils/helpers';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const DEFAULT_PRICE = [0, 250000];

export default function ProductListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE);
  const [sortBy, setSortBy] = useState('price_asc');
  const [quickFilters, setQuickFilters] = useState([]);

  const toggleQuickFilter = (key) => {
    setQuickFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Map of category slug -> id (products store category_id as UUID)
  const categorySlugToId = {};
  categories.forEach((c) => { categorySlugToId[c.slug] = c.id; });

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

  // Sync the ?category=slug URL param to the selected category id
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categorySlugToId[categorySlug]) {
      setSelectedCategory(categorySlugToId[categorySlug]);
    } else if (categorySlug) {
      // Unknown slug (e.g. legacy 'phones') — just clear so we show everything
      setSelectedCategory('');
    }
  }, [searchParams, categories.length]);

  // Keep the URL in sync with the search box
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('search', searchQuery);
    else params.delete('search');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const brands = [...new Set(products.map(p => p.brand))].sort();

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    })
    // Apply quick filters on top
    .filter(product => {
      const specsText = product.specifications
        ? Object.values(product.specifications).join(' ').toLowerCase()
        : '';
      const ramMatch = quickFilters.includes('ram12')
        ? /\b1[2-9]\s?gb\b|\b[2-9]\d\s?gb\b/.test(specsText) : true;
      const storageMatch = quickFilters.includes('storage256')
        ? /\b(25[6-9]|[3-9]\d\d|\d{4,})\s?gb\b/.test(specsText) : true;
      const fiveG = quickFilters.includes('5g') ? specsText.includes('5g') : true;
      const inStock = quickFilters.includes('instock') ? (Number(product.stock) || 0) > 0 : true;
      const isNew = quickFilters.includes('new') ? product.is_featured === true : true;
      return ramMatch && storageMatch && fiveG && inStock && isNew;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange(DEFAULT_PRICE);
    setSearchQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('search');
    setSearchParams(params, { replace: true });
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.slug}`);
  };

  const hasActiveFilters =
    !!selectedCategory || !!selectedBrand ||
    priceRange[0] !== DEFAULT_PRICE[0] || priceRange[1] !== DEFAULT_PRICE[1] ||
    !!searchQuery;

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
            onChange={e => setSearchQuery(e.target.value)}
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

      {/* Results info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:border-white outline-none"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            priceRange={priceRange}
            onCategoryChange={(id) => {
              setSelectedCategory(id);
              const params = new URLSearchParams(searchParams);
              const cat = categories.find(c => c.id === id);
              if (cat) params.set('category', cat.slug);
              else params.delete('category');
              setSearchParams(params, { replace: true });
            }}
            onBrandChange={setSelectedBrand}
            onPriceChange={setPriceRange}
            onQuickFilter={toggleQuickFilter}
            activeQuickFilters={quickFilters}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Products Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-surface-dark dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-800/50 animate-pulse">
                    <div className="aspect-square bg-gray-800" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-2/3" />
                      <div className="h-3 bg-gray-800 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    onViewDetails={() => handleViewDetails(product)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
