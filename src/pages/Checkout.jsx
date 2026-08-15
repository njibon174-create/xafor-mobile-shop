import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../context/CartContext';
import { generateTrackingId, getDeliveryCharge, formatBDT, BANGLADESH_DIVISIONS } from '../utils/helpers';
import { useWishlist } from '../hooks/useWishlist';

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const shake = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Checkout({ onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('form');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    division: 'Dhaka',
    deliveryType: 'delivery',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [siteSettings, setSiteSettings] = useState(null);
  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(s => setSiteSettings(s));
  }, []);

  const deliveryCharge = cartTotal > 0 ? getDeliveryCharge(formData.division, formData.deliveryType) : 0;
  const grandTotal = cartTotal + deliveryCharge;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{11}$/.test(formData.phone.trim())) newErrors.phone = 'Enter valid 11-digit BD phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const trackingId = generateTrackingId();
      const orderItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      const { error } = await supabase.from('orders').insert({
        tracking_id: trackingId,
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim() || null,
        shipping_address: formData.address.trim(),
        division: formData.division,
        delivery_type: formData.deliveryType,
        delivery_charge: deliveryCharge,
        subtotal: cartTotal,
        total: grandTotal,
        notes: formData.notes.trim() || null,
        status: 'pending',
        items: orderItems,
      });

      if (error) throw error;

      clearCart();
      if (onSuccess) onSuccess();

      const orderData = {
        ...formData,
        deliveryCharge,
        cartTotal,
        grandTotal,
        items: orderItems,
        trackingId,
      };
      navigate('/order-success', { state: orderData });
    } catch (err) {
      console.error('Order error:', err);
      setSubmitError('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSaveForLater = (e) => {
    e.preventDefault();
    cart.forEach(item => addToWishlist(item));
    navigate('/wishlist');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface-dark dark:bg-surface-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products before checking out</p>
          <a href="/products" className="text-white underline hover:text-gray-300">Browse Products</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark dark:bg-surface-dark py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gray-400 mt-2">Complete your order with Cash on Delivery</p>
        </motion.div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden gap-4 mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${activeTab === 'form' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'}`}
          >
            Shipping Details
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${activeTab === 'summary' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'}`}
          >
            Order Summary
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className={`flex-1 space-y-6 ${activeTab !== 'form' ? 'hidden lg:block' : ''}`}
          >
            {/* Contact */}
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rahim Ahmed"
                    className={`w-full px-4 py-2.5 bg-gray-900 border rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-800'}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXX-XXXXXXX"
                    maxLength={11}
                    className={`w-full px-4 py-2.5 bg-gray-900 border rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-800'}`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Shipping Details</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Division *</label>
                <select
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
                >
                  {BANGLADESH_DIVISIONS.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Delivery Type *</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryType === 'delivery' ? 'border-white bg-white/5' : 'border-gray-800 hover:border-gray-700'}`}>
                    <input type="radio" name="deliveryType" value="delivery" checked={formData.deliveryType === 'delivery'} onChange={e => setFormData({ ...formData, deliveryType: 'delivery' })} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'delivery' ? 'border-white' : 'border-gray-600'}`}>
                      {formData.deliveryType === 'delivery' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="text-white font-medium">Home Delivery</span>
                      <p className="text-xs text-gray-400">{formData.division === 'Dhaka' ? '৳80' : '৳120'}</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryType === 'pickup' ? 'border-white bg-white/5' : 'border-gray-800 hover:border-gray-700'}`}>
                    <input type="radio" name="deliveryType" value="pickup" checked={formData.deliveryType === 'pickup'} onChange={e => setFormData({ ...formData, deliveryType: 'pickup' })} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'pickup' ? 'border-white' : 'border-gray-600'}`}>
                      {formData.deliveryType === 'pickup' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="text-white font-medium">Pickup</span>
                      <p className="text-xs text-gray-400">Free</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Delivery Address *</label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Room No, Road/Building, Area, Landmark..."
                  rows={3}
                  className={`w-full px-4 py-2.5 bg-gray-900 border rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-800'}`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Order Notes (optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Delivery instructions, gift message..."
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${submitting ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : submitError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : submitError ? (
                submitError
              ) : (
                <>
                  Place Order
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveForLater}
                className="flex-1 py-3 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-white hover:text-white transition-colors text-center"
              >
                Save for Later
              </button>
              <a
                href="/cart"
                className="py-3 px-4 border border-gray-700 text-gray-300 rounded-xl hover:border-white hover:text-white transition-colors text-center"
              >
                Edit Cart
              </a>
            </div>

            <p className="text-center text-xs text-gray-600">
              By placing this order, you agree to pay <span className="text-white">{formatBDT(grandTotal)}</span> in cash upon delivery.
            </p>
          </motion.form>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`lg:w-80 flex-shrink-0 ${activeTab === 'summary' ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={item.image_url || ''} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">× {item.quantity}</p>
                    </div>
                    <span className="text-sm text-white flex-shrink-0">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatBDT(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-white">{formatBDT(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-800 pt-4">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatBDT(grandTotal)}</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-green-400">Pay cash upon delivery. No advance payment needed.</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
