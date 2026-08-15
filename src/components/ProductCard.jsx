import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -4, scale: 1.02, transition: { duration: 0.3 } },
};

export default function ProductCard({ product, addToCart, onViewDetails }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group bg-surface-dark dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-800/50 hover:border-white/20 transition-all cursor-pointer"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-900">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.is_featured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-600 line-through">
                ৳{product.compare_price.toLocaleString('bn-BD')}
              </span>
            )}
          </div>
          <h3 className="text-base font-medium text-white group-hover:text-gray-200 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-700'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-semibold text-white">
              ৳{product.price.toLocaleString('bn-BD')}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-white text-black rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            title="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onViewDetails();
          }}
          className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-white rounded-lg"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
