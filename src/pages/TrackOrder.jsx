import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { formatBDT } from '../utils/helpers';

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const trackingParam = searchParams.get('tracking');
  const [trackingId, setTrackingId] = useState(trackingParam || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOrder = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_id', trackingId.trim().toUpperCase())
        .single();

      if (err || !data) {
        setOrder(null);
        setError('No order found with this tracking ID. Please check and try again.');
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingParam) searchOrder();
  }, [trackingParam]);

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Track Your Order</h1>
          <p className="text-gray-400 mt-2">Enter your tracking ID to check order status</p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6 mb-8"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter tracking ID (e.g. XAF-20260101-001)"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all font-mono uppercase"
              onKeyDown={e => e.key === 'Enter' && searchOrder()}
            />
            <button
              onClick={searchOrder}
              disabled={loading || !trackingId.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                loading || !trackingId.trim()
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Search
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}
        </motion.div>

        {/* Results */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Order Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tracking ID</span>
                  <span className="text-white font-mono">{order.tracking_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order Date</span>
                  <span className="text-white">
                    {new Date(order.created_at).toLocaleDateString('bn-BD', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Customer</span>
                  <span className="text-white">{order.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-white">{order.customer_phone}</span>
                </div>
                {order.customer_email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{order.customer_email}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Division</span>
                  <span className="text-white">{order.division}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Type</span>
                  <span className="text-white">{order.delivery_type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Charge</span>
                  <span className="text-white">{formatBDT(order.delivery_charge)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-800 pt-4">
                  <span className="text-white">Total Paid</span>
                  <span className="text-white">{formatBDT(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Items Ordered</h2>
              </div>
              <div className="p-6 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">📱</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} &middot; {formatBDT(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Order Timeline</h2>
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-800" />
                {[
                  { status: 'pending', label: 'Order Placed', time: new Date(order.created_at).toLocaleString('bn-BD'), done: true },
                  { status: 'confirmed', label: 'Order Confirmed', time: order.status !== 'pending' ? '—' : 'Pending', done: order.status !== 'pending' },
                  { status: 'processing', label: 'Processing', time: '—', done: order.status === 'delivered' || order.status === 'shipped' },
                  { status: 'shipped', label: 'Shipped', time: '—', done: order.status === 'shipped' || order.status === 'delivered' },
                  { status: 'delivered', label: 'Delivered', time: '—', done: order.status === 'delivered' },
                ].map((step, i) => (
                  <div key={i} className="relative pb-6">
                    <div className={`absolute left-0 top-0 w-5 h-5 rounded-full border-2 z-10 ${step.done ? 'bg-white border-white' : 'bg-gray-800 border-gray-800'}`} />
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-sm ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                      <span className="text-xs text-gray-600">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state before search */}
        {!order && !error && trackingId === (trackingParam || '') && (
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
            <h3 className="text-xl font-semibold text-white mb-2">Track Your Order</h3>
            <p className="text-gray-400">Enter your tracking ID above to see order status, delivery details, and timeline.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
