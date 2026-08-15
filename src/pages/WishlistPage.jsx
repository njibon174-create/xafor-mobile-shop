import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';
import { formatBDT } from '../utils/helpers';

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8">Save your favorite products for later.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Browse Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Wishlist</h1>
          <span className="text-gray-400 text-sm">{wishlist.length} items</span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-surface-dark dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-800/50 hover:border-white/20 transition-all"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-900">
                <img
                  src={item.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  title="Remove from wishlist"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{item.brand}</span>
                <h3 className="text-base font-medium text-white mt-1 line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-semibold text-white">৳{item.price.toLocaleString('bn-BD')}</span>
                  <button
                    onClick={() => moveToCart(item)}
                    className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
