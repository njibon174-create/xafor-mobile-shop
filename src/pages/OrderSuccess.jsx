import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatBDT } from '../utils/helpers';

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
const scaleUp = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const trackingId = location.state?.trackingId || 'XAF-20260101-001';
  const order = location.state?.order || {};

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Success icon */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-400">Thank you for your order. Your tracking ID is below.</p>
        </motion.div>

        {/* Tracking ID Card */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6 text-center mb-8"
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-3">Your Tracking ID</p>
          <div className="flex items-center justify-center gap-3">
            <span className="px-4 py-2 bg-white/10 rounded-lg font-mono text-lg text-white tracking-wider">
              {trackingId}
            </span>
            <button
              onClick={copyTrackingId}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Copy tracking ID"
            >
              <svg className={`w-5 h-5 ${copied ? 'text-green-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
          )}
          <a
            href={`/track-order?tracking=${trackingId}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Track your order
          </a>
        </motion.div>

        {/* Order Details */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Delivery Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-green-400 font-medium">Pending</span>
            </div>
            {order.customer_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Customer</span>
                <span className="text-white">{order.customer_name}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phone</span>
                <span className="text-white">{order.customer_phone}</span>
              </div>
            )}
            {order.division && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Division</span>
                <span className="text-white">{order.division}</span>
              </div>
            )}
            {order.delivery_type && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Type</span>
                <span className="text-white">{order.delivery_type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}</span>
              </div>
            )}
            {order.delivery_charge !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Charge</span>
                <span className="text-white">{formatBDT(order.delivery_charge)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">{formatBDT(order.cartTotal || 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-800 pt-4">
              <span className="text-white">Total</span>
              <span className="text-white">{formatBDT(order.grandTotal || 0)}</span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="border-t border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Items Ordered</h2>
              </div>
              <div className="p-6 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity} &middot; {formatBDT(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-3">What happens next?</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-yellow-400 font-bold">1</span>
              </span>
              Your order is now <span className="text-white">pending</span>. We'll confirm it shortly.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-yellow-400 font-bold">2</span>
              </span>
              You'll receive a call/SMS to confirm your delivery details.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-yellow-400 font-bold">3</span>
              </span>
              Pay <span className="text-white font-medium">{formatBDT(order.grandTotal || 0)}</span> in cash when you receive the product.
            </li>
          </ul>
        </motion.div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/products')}
            className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate(`/track-order?tracking=${trackingId}`)}
            className="flex-1 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors text-center"
          >
            Track Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}
