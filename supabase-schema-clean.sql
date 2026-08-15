-- ============================================
-- SUPABASE SCHEMA FOR XAfor MOBILE SHOP
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  image_url TEXT NOT NULL,
  image_urls TEXT[],
  brand TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  specifications JSONB DEFAULT '{}',
  features TEXT[],
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================
-- 3. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'Xafor Mobile Shop',
  tagline TEXT DEFAULT 'Premium Mobile Phones & Accessories in Bangladesh',
  logo_url TEXT,
  phone TEXT DEFAULT '+880 1XXX-XXXXXXX',
  email TEXT DEFAULT 'info@xafor.com',
  address TEXT DEFAULT '123 Main Road, Dhaka, Bangladesh',
  home_delivery_charge NUMERIC(10,2) DEFAULT 80,
  outside_delivery_charge NUMERIC(10,2) DEFAULT 120,
  pickup_charge NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'BDT',
  currency_symbol TEXT DEFAULT '৳',
  dark_mode_enabled BOOLEAN DEFAULT TRUE,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  division TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ============================================
-- SEED DATA
-- ============================================

TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE site_settings CASCADE;

INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Smartphones', 'smartphones', 'Latest smartphones from top brands', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Accessories', 'accessories', 'Mobile accessories & peripherals', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Case & Covers', 'case-covers', 'Protective cases and stylish covers', 3),
  ('c0000000-0000-0000-0000-000000000004', 'Chargers & Cables', 'chargers-cables', 'Original chargers and cables', 4),
  ('c0000000-0000-0000-0000-000000000005', 'Audio', 'audio', 'Earphones, headphones & speakers', 5),
  ('c0000000-0000-0000-0000-000000000006', 'Tablets', 'tablets', 'Tablets and portable devices', 6);

INSERT INTO products (id, name, slug, description, price, compare_price, stock, image_url, brand, category_id, specifications, features, rating, review_count, is_featured) VALUES
('p0000000-0000-0000-0000-000000000001', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'The ultimate Galaxy experience with built-in S Pen, 200MP camera, and Galaxy AI.', 195000, 210000, 15, 'https://images.unsplash.com/photo-1618384982589-73e16d965893?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"12GB","storage":"256GB","battery":"5000mAh","display":"6.8 inch Dynamic AMOLED 2X","camera":"200MP + 50MP + 12MP + 10MP","os":"Android 14","processor":"Snapdragon 8 Gen 3","refresh_rate":"120Hz","weight":"233g"}', '{"Galaxy AI features","Built-in S Pen","Titanium frame","5G connectivity","Water resistant IP68"}', 4.8, 342, TRUE),
('p0000000-0000-0000-0000-000000000002', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design. A17 Pro chip. Action button. USB-C. The most powerful iPhone ever.', 225000, 240000, 10, 'https://images.unsplash.com/photo-1611521896450-70f63f9d543e?w=600&h=600&fit=crop', 'Apple', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"8GB","storage":"256GB","battery":"4422mAh","display":"6.7 inch Super Retina XDR","camera":"48MP + 12MP + 12MP","os":"iOS 17","processor":"A17 Pro","refresh_rate":"120Hz ProMotion","weight":"221g"}', '{"Titanium design","A17 Pro chip","Action button","USB-C","Cinema-grade videos"}', 4.9, 528, TRUE),
('p0000000-0000-0000-0000-000000000003', 'Google Pixel 8 Pro', 'google-pixel-8-pro', 'The brightest, most advanced Pixel yet with AI magic and incredible camera.', 145000, 160000, 8, 'https://images.unsplash.com/photo-1598327107444-ec61563743bc?w=600&h=600&fit=crop', 'Google', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"12GB","storage":"128GB","battery":"5050mAh","display":"6.7 inch LTPO OLED","camera":"50MP + 48MP + 48MP","os":"Android 14","processor":"Tensor G3","refresh_rate":"120Hz","weight":"213g"}', '{"AI-powered Magic Editor","Night Sight","Tensor G3 chip","7 years of updates","Bright display"}', 4.6, 198, TRUE),
('p0000000-0000-0000-0000-000000000004', 'Samsung Galaxy S24 FE', 'samsung-galaxy-s24-fe', 'The best of Galaxy in a stunning new design. Compact, smart, and connected.', 85000, 95000, 20, 'https://images.unsplash.com/photo-1511707279542-9ae5dd5de3c0?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"8GB","storage":"128GB","battery":"4700mAh","display":"6.4 inch Dynamic AMOLED 2X","camera":"50MP + 12MP + 10MP","os":"Android 14","processor":"Exynos 2400e","refresh_rate":"120Hz","weight":"197g"}', '{"Compact design","Galaxy AI","Exynos 2400e","120Hz display","IP68 rated"}', 4.5, 87, FALSE),
('p0000000-0000-0000-0000-000000000005', 'Xiaomi Redmi Note 13 Pro+ 5G', 'redmi-note-13-pro-plus', 'Premium flagship features at an incredible value. 200MP camera and 120W fast charging.', 42000, 48000, 30, 'https://images.unsplash.com/photo-1603561591444-3547d7646e4b?w=600&h=600&fit=crop', 'Xiaomi', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"8GB","storage":"256GB","battery":"5100mAh","display":"6.67 inch Curved AMOLED","camera":"200MP + 8MP + 2MP","os":"Android 14","processor":"Dimensity 7200 Ultra","refresh_rate":"120Hz","weight":"190g"}', '{"200MP camera","120W fast charging","Curved AMOLED","IR blaster","Side fingerprint"}', 4.4, 156, FALSE),
('p0000000-0000-0000-0000-000000000006', 'OnePlus 12R', 'oneplus-12r', 'Built for speed with Snapdragon 8 Gen 2 and incredible battery life.', 68000, 75000, 15, 'https://images.unsplash.com/photo-1526259605509-744b3fedf0f3?w=600&h=600&fit=crop', 'OnePlus', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"16GB","storage":"256GB","battery":"5500mAh","display":"6.78 inch LTPO AMOLED","camera":"50MP + 48MP + 32MP","os":"Android 14","processor":"Snapdragon 8 Gen 2","refresh_rate":"120Hz","weight":"207g"}', '{"65W SUPERVOOC charging","Snapdragon 8 Gen 2","100% 21:9 Cinema display","Alert slider","OPTIC in-display fingerprint"}', 4.5, 203, FALSE),
('p0000000-0000-0000-0000-000000000007', 'Samsung Galaxy A35 5G', 'samsung-galaxy-a35', 'Powerful all-rounder with exceptional battery life and water resistant design.', 32000, 38000, 25, 'https://images.unsplash.com/photo-1586959898208-13b6c8d0c9f2?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"8GB","storage":"128GB","battery":"5000mAh","display":"6.6 inch Super AMOLED","camera":"50MP + 8MP + 5MP","os":"Android 14","processor":"Exynos 1380","refresh_rate":"120Hz","weight":"209g"}', '{"IP67 water resistant","Super AMOLED","5000mAh battery","4 years OS updates","Side fingerprint"}', 4.3, 312, FALSE),
('p0000000-0000-0000-0000-000000000008', 'iPhone 13', 'iphone-13', 'Superfast A15 Bionic chip. Photographic Styles. Next-level True Tone display.', 78000, 85000, 12, 'https://images.unsplash.com/photo-1581783898319-1afc82db536a?w=600&h=600&fit=crop', 'Apple', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"4GB","storage":"128GB","battery":"3227mAh","display":"6.1 inch Super Retina XDR","camera":"12MP + 12MP","os":"iOS 17","processor":"A15 Bionic","refresh_rate":"60Hz","weight":"174g"}', '{"A15 Bionic chip","Ceramic Shield","Cinematic mode","Night mode","MagSafe compatible"}', 4.4, 189, FALSE),
('p0000000-0000-0000-0000-000000000009', 'Realme 12 Pro+ 5G', 'realme-12-pro-plus', 'Stunning portrait master with 50MP Sony IMX882 camera and 100W Dart Charge.', 38000, 42000, 20, 'https://images.unsplash.com/photo-1571781927241-2b0a1c2c963c?w=600&h=600&fit=crop', 'Realme', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"ram":"8GB","storage":"256GB","battery":"4500mAh","display":"6.7 inch AMOLED","camera":"50MP + 8MP + 2MP","os":"Android 14","processor":"Dimensity 7050","refresh_rate":"120Hz","weight":"189g"}', '{"Sony IMX882 camera","100W Dart Charge","Amoled curved display","AI beauty portrait","Dual color temperature"}', 4.2, 145, FALSE),
('p0000000-0000-0000-0000-000000000010', 'Samsung Fast Charging 25W USB-C Adapter', 'samsung-25w-adapter', 'Official Samsung 25W fast charging wall adapter. Compact and efficient.', 2500, 3500, 50, 'https://images.unsplash.com/photo-1610945415833-042632a10bc1?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000004'::uuid, '{}', '{"Fast charging","Compact design","USB-C port","Official Samsung accessory","Overvoltage protection"}', 4.6, 78, FALSE),
('p0000000-0000-0000-0000-000000000011', 'Apple AirPods Pro (2nd Gen)', 'airpods-pro-2nd-gen', 'Active Noise Cancellation, Personalized Spatial Audio, and sweat/water resistant.', 22000, 28000, 20, 'https://images.unsplash.com/photo-1606227462016-5e160697fff2?w=600&h=600&fit=crop', 'Apple', 'c0000000-0000-0000-0000-000000000005'::uuid, '{"battery_life":"Up to 6 hours","charging_case":"Up to 30 hours total","connectivity":"Bluetooth 5.3","noise_cancellation":"Active","water_resistance":"IPX4","weight":"5.3g per earbud"}', '{"Active Noise Cancellation","Personalized Spatial Audio","Adaptive Transparency","MagSafe charging case","Siri integration"}', 4.8, 445, TRUE),
('p0000000-0000-0000-0000-000000000012', 'Samsung Galaxy Watch 6 Classic', 'galaxy-watch-6-classic', 'Classical design with modern smart features. Rotating bezel and advanced health monitoring.', 28000, 32000, 8, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000002'::uuid, '{"display":"1.5 inch Super AMOLED","battery":"40 hours typical","water_resistance":"5 ATM + IP68","sensors":"Heart rate, ECG, BIA, SpO2","compatibility":"Android 11+","processor":"Dual-core 1.6GHz"}', '{"Rotating bezel","BioActive Sensor","ECG monitoring","Body composition analysis","Wear OS by Samsung"}', 4.5, 92, FALSE),
('p0000000-0000-0000-0000-000000000013', 'Silicon Protective Case for iPhone 15 Pro', 'iphone-15-pro-case-silicone', 'Soft-touch silicone case with precise cutouts and MagSafe compatibility.', 3500, 4500, 40, 'https://images.unsplash.com/photo-1581783898319-1afc82db536a?w=600&h=600&fit=crop', 'Generic', 'c0000000-0000-0000-0000-000000000003'::uuid, '{"compatibility":"iPhone 15 Pro","material":"Soft-touch silicone","features":"MagSafe compatible","color_options":"Black, White, Blue, Red, Green"}', '{"4mm raised edges","Precision cutouts","Non-slip interior","Dust resistant","Recycled material"}', 4.3, 267, FALSE),
('p0000000-0000-0000-0000-000000000014', 'Anker USB-C to Lightning Cable (1m)', 'anker-usb-c-lightning-1m', 'Durable braided USB-C to Lightning cable. 18W fast charging support. MFi certified.', 1200, 1800, 60, 'https://images.unsplash.com/photo-1610945415833-042632a10bc1?w=600&h=600&fit=crop', 'Anker', 'c0000000-0000-0000-0000-000000000004'::uuid, '{"length":"1 meter (3.3 ft)","connector":"USB-C to Lightning","charging":"18W fast charge","material":"Braided nylon","certifications":"MFi certified","durability":"10,000+ bends"}', '{"Braided design","Tangle-free","Fast charging","MFi certified","6ft version available"}', 4.7, 534, FALSE),
('p0000000-0000-0000-0000-000000000015', 'Samsung Galaxy Buds FE', 'galaxy-buds-fe', 'Comfortable, compact earbuds with Active Noise Cancellation and 3 principles of acoustic design.', 11000, 14000, 25, 'https://images.unsplash.com/photo-1606227462016-5e160697fff2?w=600&h=600&fit=crop', 'Samsung', 'c0000000-0000-0000-0000-000000000005'::uuid, '{"battery_life":"Up to 10 hours","charging_case":"Up to 30 hours total","connectivity":"Bluetooth 5.2","noise_cancellation":"Active ANC","water_resistance":"IPX7","weight":"5.0g per bud"}', '{"ANC","Wi-Fi calling","Wear detection","Samsung Scalable Codec","Comfortable wingtip fit"}', 4.4, 178, FALSE),
('p0000000-0000-0000-0000-000000000016', 'Wireless Charging Stand for Samsung', 'samsung-wireless-charger-stand', 'Fast wireless charging stand compatible with all Qi-enabled devices. LED indicator.', 3200, 4000, 30, 'https://images.unsplash.com/photo-1610945415833-042632a10bc1?w=600&h=600&fit=crop', 'Generic', 'c0000000-0000-0000-0000-000000000004'::uuid, '{"charging_speed":"15W (Samsung), 10W (other Qi)","compatibility":"Qi-enabled devices, Samsung phones","features":"LED indicator, adjustable angle","input":"USB-C 5V/3A or 9V/2A"}', '{"Fast wireless charging","Adjustable viewing angle","LED indicator","Cool touch surface","Works with phone + watch"}', 4.2, 112, FALSE);

INSERT INTO site_settings (id, site_name, tagline, phone, email, address, home_delivery_charge, outside_delivery_charge, pickup_charge, currency, currency_symbol, dark_mode_enabled) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Xafor Mobile Shop', 'Premium Mobile Phones & Accessories in Bangladesh', '+880 1XXX-XXXXXXX', 'info@xafor.com', '123 Main Road, Dhaka, Bangladesh', 80, 120, 0, 'BDT', '৳', TRUE);

-- ============================================
-- DISABLE RLS (Demo Only)
-- ============================================
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE categories IS 'Product categories (phones, accessories, etc.)';
COMMENT ON TABLE products IS 'Product catalog with specifications stored as JSONB';
COMMENT ON TABLE site_settings IS 'Editable site configuration - CMS managed';
COMMENT ON TABLE orders IS 'Customer orders with COD tracking';
COMMENT ON COLUMN products.specifications IS 'JSONB object: { ram, storage, battery, display, camera, os, processor, refresh_rate, weight }';
COMMENT ON COLUMN orders.items IS 'JSONB array of order items: [{ product_id, name, price, quantity, image_url }]';
