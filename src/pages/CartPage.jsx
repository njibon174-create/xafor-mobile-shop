import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const deliveryCharge = 80;
  const grandTotal = cartTotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">Looks like you haven't added anything yet. Browse our collection to find something you love.</p>
        <a href="/products" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/96'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">৳{item.price.toLocaleString('bn-BD')} each</p>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm text-white border-x border-gray-700 min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-white">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8 bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white">৳{cartTotal.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery (Dhaka)</span>
                  <span className="text-white">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-800 pt-4">
                  <span className="text-white">Total</span>
                  <span className="text-white">৳{grandTotal.toLocaleString('bn-BD')}</span>
                </div>
              </div>
              <a
                href="/checkout"
                className="mt-6 w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors block text-center"
              >
                Proceed to Checkout
              </a>
              <a
                href="/products"
                className="mt-3 block text-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                Continue Shopping
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
