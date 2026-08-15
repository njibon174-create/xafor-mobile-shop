import { motion } from 'framer-motion';

export default function Footer({ siteSettings }) {
  const siteName = siteSettings?.site_name || 'Xafor Mobile Shop';
  const phone = siteSettings?.phone || '+880 1XXX-XXXXXXX';
  const email = siteSettings?.email || 'info@xafor.com';
  const address = siteSettings?.address || '123 Main Road, Dhaka, Bangladesh';

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-dark/50 dark:bg-surface-dark/50 border-t border-gray-800 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">{siteName}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium mobile phones and accessories in Bangladesh. Authentic products with Cash on Delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['Smartphones', 'Accessories', 'Audio', 'Tablets', 'Cases & Covers'].map(link => (
                <li key={link}>
                  <a href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Track Order', 'Shipping Info', 'Returns & Refunds', 'FAQ', 'Contact Us'].map(link => (
                <li key={link}>
                  <a href="/track-order" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:{phone}" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li>
                <a href="mailto:{email}" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li className="text-sm text-gray-400">{address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service'].map(link => (
              <a key={link} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
