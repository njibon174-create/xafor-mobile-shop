// Variant options per product. When a product has no entry, options are
// derived from its `specifications` (single value) as a fallback.
// Edit this map to change the available colors / RAM / storage per product.
const VARIANT_MAP = {
  'samsung-galaxy-s24-ultra': {
    color: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
    ram: ['12GB'],
    storage: ['256GB', '512GB', '1TB'],
  },
  'iphone-15-pro-max': {
    color: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    ram: ['8GB'],
    storage: ['256GB', '512GB', '1TB'],
  },
  'google-pixel-8-pro': {
    color: ['Porcelain', 'Bay', 'Obsidian'],
    ram: ['12GB'],
    storage: ['128GB', '256GB', '512GB'],
  },
};

export function getVariantOptions(product) {
  if (!product) return { color: [], ram: [], storage: [] };

  const mapped = VARIANT_MAP[product.slug];
  const specs =
    product.specifications && typeof product.specifications === 'object'
      ? product.specifications
      : {};

  const ramFromSpec = specs.ram ? [String(specs.ram)] : [];
  const storageFromSpec = specs.storage ? [String(specs.storage)] : [];

  return {
    color: mapped?.color || [],
    ram: mapped?.ram || ramFromSpec,
    storage: mapped?.storage || storageFromSpec,
  };
}
