import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function Sidebar({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onQuickFilter,
  activeQuickFilters = [],
  onReset,
  hasActiveFilters = false,
}) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={slideIn}
      className="w-64 flex-shrink-0"
    >
      <div className="bg-surface-dark dark:bg-surface-dark rounded-2xl border border-gray-800 p-5 space-y-6">
        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all filters
          </button>
        )}

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Category</h3>
          <div className="space-y-1">
            <button
              onClick={() => onCategoryChange('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!selectedCategory ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Brand</h3>
          <div className="flex flex-wrap gap-1.5">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => onBrandChange(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedBrand === brand ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Price Range</h3>
          <div className="space-y-2">
            {[
              { label: 'Under ৳25,000', min: 0, max: 25000 },
              { label: '৳25,000 - ৳50,000', min: 25000, max: 50000 },
              { label: '৳50,000 - ৳100,000', min: 50000, max: 100000 },
              { label: '৳100,000 - ৳150,000', min: 100000, max: 150000 },
              { label: '৳150,000+', min: 150000, max: 999999 },
            ].map((option, i) => (
              <button
                key={i}
                onClick={() => onPriceChange([option.min, option.max])}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${priceRange[0] === option.min && priceRange[1] === option.max ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters - Functional */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Filters</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: '5g', label: '5G Phones' },
              { key: 'ram12', label: '12GB+ RAM' },
              { key: 'storage256', label: '256GB+ Storage' },
              { key: 'under50k', label: 'Under 50K', min: 0, max: 50000 },
              { key: 'instock', label: 'In Stock' },
              { key: 'new', label: 'New Arrivals' },
            ].map((filter) => {
              const active = activeQuickFilters.includes(filter.key);
              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    if (filter.min !== undefined) {
                      onPriceChange([filter.min, filter.max]);
                    } else {
                      onQuickFilter(filter.key);
                    }
                  }}
                  className={`px-3 py-2 text-xs rounded-lg transition-all border ${active ? 'bg-white text-black border-white' : 'bg-gray-800/50 text-gray-400 border-gray-800/50 hover:bg-gray-800 hover:text-white'}`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
