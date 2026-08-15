import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer({ siteSettings }) {
  const siteName = siteSettings?.site_name || 'Xafor Mobile Shop';
  const tagline = siteSettings?.tagline || 'Premium Mobile Phones & Accessories in Bangladesh';
  const phone = siteSettings?.phone || '+880 1XXX-XXXXXXX';
  const email = siteSettings?.email || 'info@xafor.com';
  const address = siteSettings?.address || 'Dhanmondi, Dhaka, Bangladesh';

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-dark/50 dark:bg-surface-dark/50 border-t border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">{siteName}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link to="/products?category=phones" className="text-gray-400 hover:text-white text-sm transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=accessories" className="text-gray-400 hover:text-white text-sm transition-colors">Accessories</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white text-sm transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {address}
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.875c-1.717 0-2.386.858-2.386 1.973v2.656h3.378l-.532 3.47h-2.846v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.85.38-1.78.64-2.73.76 1.15-.91 1.93-2.36 2.03-3.87-.93.88-2.05 1.38-3.25 1.56C18.37 4.5 16.78 4 15.23 4c-2.15 0-4.08.15-5.93.44C9.47 3.16 7.62 2.5 5.21 2.5 2.8 2.5 1.31 3.18.87 4.14c-.48-.56-1.23-.8-2.05-.7-1.15.16-2.13.52-2.88.98C.38 6.58.62 8.6 1.26 10.2c.62-1.22 1.5-2.22 2.53-2.96C4.2 6.76 4.9 6.56 5.64 6.26c1.13.5 2.31.81 3.51.81s2.37-.31 3.51-.81C15.54 4.94 16.24 5.14 16.98 5.64c.73.4 1.62.72 2.53.96C20.02 6.5 20.26 6.58 20.5 6.66c.57-.14 1.1-.42 1.58-.78.92-.7 1.48-1.72 1.4-2.94.12-.94-.66-1.75-1.6-1.98z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.082-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.072 1.689-.072 4.948 0 3.259.014 3.667.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.072-4.949-.072ZM12 3.5c2.673 0 4.848.022 6.99.143 2.437.136 3.678 1.224 3.777 3.78.098 2.556.117 3.804.117 6.98 0 2.673-.022 3.858-.117 6.004-.136 2.435-1.224 3.678-3.78 3.777-2.556.098-3.804.119-6.004.119-2.672 0-3.857-.021-6.004-.118-2.435-.135-3.678-1.223-3.777-3.778-.098-2.555-.119-3.803-.119-6.003 0-2.672.021-3.857.118-6.004.135-2.436 1.223-3.678 3.778-3.777 2.555-.099 3.804-.119 6.004-.119Z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-gray-800/50">
          <p className="text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
