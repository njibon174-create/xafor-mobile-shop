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
    if (addToCart) {
      addToCart(product);
      // Visual feedback
      const btn = e.currentTarget;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>`;
      btn.classList.add('bg-green-500', 'text-white');
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('bg-green-500', 'text-white');
      }, 1200);
    }
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
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>
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
            e.stopPropagation();
            if (onViewDetails) onViewDetails(product);
          }}
          className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-white rounded-lg"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
