import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatBDT } from '../utils/helpers';

const slideIn = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function CartDrawer({ open, onClose, onCheckoutSuccess, siteSettings, isWishlist = false }) {
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { wishlist, removeFromWishlist, moveToCart, wishlistTotal } = useWishlist();
  const navigate = useNavigate();

  const items = isWishlist ? wishlist : cart;
  const total = isWishlist ? wishlistTotal : cartTotal;
  const removeItem = isWishlist ? removeFromWishlist : removeFromCart;
  const moveItem = isWishlist ? (product) => { addToCart(product); removeFromWishlist(product.id); } : null;

  if (isWishlist) {
    if (wishlist.length === 0) {
      return (
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              <motion.div
                className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-dark dark:bg-surface-dark shadow-2xl z-50 flex flex-col"
                variants={slideIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">Wishlist</h2>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">Your wishlist is empty</p>
                  <p className="text-gray-600 text-sm mt-1">Save products you love</p>
                </div>
                <div className="p-6 border-t border-gray-800">
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-dark dark:bg-surface-dark shadow-2xl z-50 flex flex-col"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-semibold text-white">Wishlist</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{wishlist.length} items</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">৳{item.price.toLocaleString('bn-BD')}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              moveToCart(item);
                              navigate('/cart');
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-gray-800 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Value</span>
                  <span className="text-white">৳{total.toLocaleString('bn-BD')}</span>
                </div>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  View Full Wishlist
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Cart drawer (existing logic)
  const deliveryCharge = 80;
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-dark dark:bg-surface-dark shadow-2xl z-50 flex flex-col"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">Your Cart</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-600 text-sm mt-1">Add some products to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          <img
                            src={item.image_url || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">
                            ৳{item.price.toLocaleString('bn-BD')}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-700 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                              >
                                −
                              </button>
                              <span className="px-3 py-1.5 text-sm text-white border-x border-gray-700 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-800 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">৳{cartTotal.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-white">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-800 pt-4">
                  <span className="text-white">Total</span>
                  <span className="text-white">৳{grandTotal.toLocaleString('bn-BD')}</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
