import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import ProductCard from '../components/ProductCard';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function BrandPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const brand = decodeURIComponent(slug || '');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('brand', brand)
          .order('price');
        if (isMounted) setProducts(data || []);
      } catch (err) {
        console.error('Error loading brand products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    setLoading(true);
    load();
    return () => { isMounted = false; };
  }, [brand]);

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6"
      >
        <button
          onClick={() => navigate('/products')}
          className="text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          ← All Products
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{brand}</h1>
        <p className="text-gray-400 mt-2">
          {loading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'product' : 'products'}`}
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No products found for this brand.</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={() => {}}
                onViewDetails={() => navigate(`/product/${product.slug}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
