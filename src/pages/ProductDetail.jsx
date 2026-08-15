import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../hooks/useCart';
import { formatBDT, getDeliveryCharge, BANGLADESH_DIVISIONS } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      try {
        const [productRes, relatedRes] = await Promise.all([
          supabase.from('products').select('*').eq('slug', slug).single(),
          supabase.from('products')
            .select('*')
            .eq('is_active', true)
            .neq('slug', slug)
            .limit(4)
            .order('rating', { ascending: false }),
        ]);

        if (!isMounted) return;
        setProduct(productRes.data || null);
        setRelatedProducts(relatedRes.data || []);
      } catch (err) {
        console.error('Error loading product:', err);
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    setLoading(true);
    loadProduct();
    return () => { isMounted = false; };
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Safe defaults so the render never throws on missing fields
  const safeProduct = product || {};
  const specs = safeProduct.specifications && typeof safeProduct.specifications === 'object'
    ? safeProduct.specifications
    : {};
  const features = Array.isArray(safeProduct.features) ? safeProduct.features : [];
  const rating = Number(safeProduct.rating) || 0;
  const reviewCount = Number(safeProduct.review_count) || 0;
  const price = Number(safeProduct.price) || 0;
  const comparePrice = Number(safeProduct.compare_price) || 0;
  const stock = Number(safeProduct.stock) || 0;
  const imageUrl = safeProduct.image_url || 'https://via.placeholder.com/600x600';
  const imageUrls = Array.isArray(safeProduct.image_urls) ? safeProduct.image_urls : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">This product may have been removed</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4"
      >
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <button
            onClick={() => navigate('/products')}
            className="hover:text-white transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-600">Details</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-500 truncate max-w-[200px] sm:max-w-none">{safeProduct.name}</span>
        </nav>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900">
              <img
                src={imageUrl}
                alt={safeProduct.name}
                className="w-full h-full object-cover"
              />
              {safeProduct.is_featured && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>
            {imageUrls.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageUrls.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={img} alt={`${safeProduct.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-400 uppercase tracking-wider">{safeProduct.brand}</span>
                {safeProduct.category_id && (
                  <>
                    <span className="text-gray-600">/</span>
                    <button
                      onClick={() => navigate(`/products?category=${safeProduct.category_id}`)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {safeProduct.category_id}
                    </button>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{safeProduct.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-700'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">{formatBDT(price)}</span>
              {comparePrice > 0 && (
                <span className="text-lg text-gray-500 line-through">{formatBDT(comparePrice)}</span>
              )}
              {comparePrice > 0 && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  Save {formatBDT(comparePrice - price)}
                </span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed">{safeProduct.description}</p>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{key}</span>
                      <p className="text-sm text-white mt-0.5">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock & Add to Cart */}
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </span>
              {stock > 0 && (
                <span className="text-sm text-gray-500">Free shipping on orders over ৳5,000</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-700 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-lg"
                >
                  -
                </button>
                <span className="px-6 py-2.5 text-white min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  stock === 0
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-500 text-black'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-800">
              {[
                { icon: '🔒', text: 'Secure Checkout' },
                { icon: '🚚', text: 'Free Delivery over ৳5K' },
                { icon: '🔄', text: '7-Day Return Policy' },
                { icon: '💵', text: 'Cash on Delivery' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-gray-400">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-12 border-t border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard
                  key={related.id}
                  product={related}
                  addToCart={addToCart}
                  onViewDetails={() => navigate(`/product/${related.slug}`)}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
