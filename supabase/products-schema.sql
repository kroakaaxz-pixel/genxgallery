-- ============================================================
-- Gen X Gallery — Products Table
-- Run this in Supabase SQL Editor after schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL DEFAULT 'others',
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  sizes JSONB NOT NULL DEFAULT '["a5","a4"]'::jsonb,
  image TEXT NOT NULL DEFAULT '',
  badge TEXT DEFAULT '',
  natural_ratio NUMERIC(5,2) DEFAULT 0.75,
  status TEXT NOT NULL DEFAULT 'Active',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_special_deal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_deleted ON products(is_deleted);

-- ============================================================
-- RLS — Public can read non-deleted active products.
-- Admin writes are handled via service-role or admin session.
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-deleted products (storefront)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_deleted = false);

-- ============================================================
-- Seed data — mirrors the original static products array
-- ============================================================

INSERT INTO products (id, name, category, sub_category, description, price, discount_percent, sizes, image, badge, natural_ratio, status, is_deleted, is_new_arrival, is_special_deal) VALUES
(1, 'Skyline at Dusk', 'framed-posters', 'cars', 'R34 GT-R silhouetted against a Tokyo sunset. The car that launched a thousand dreams.', 2299, 15, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop', 'Best Seller', 0.75, 'Active', false, false, true),
(2, 'Porsche 911 Study', 'framed-posters', 'cars', 'A clean-side profile of the 993 generation. Timeless lines, timeless car.', 2699, 0, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=800&fit=crop', 'New', 0.75, 'Active', false, true, false),
(3, 'Midnight Runner', 'framed-posters', 'cars', 'AE86 in the mountain pass. Touge legends never die.', 2099, 10, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, true),
(4, 'Lambo & Gold', 'framed-posters', 'cars', 'Murciélago in a gallery setting. Excess as art form.', 3199, 0, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=800&fit=crop', 'Limited', 0.75, 'Active', false, false, false),
(5, 'Neon District', 'framed-posters', 'anime', 'Cyberpunk cityscape in the style of Ghost in the Shell. Rain-soaked streets and electric dreams.', 2499, 20, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop', 'Popular', 0.75, 'Active', false, false, true),
(6, 'Mecha Blueprint', 'framed-posters', 'anime', 'Technical illustration of a giant robot in the style of Evangelion cutaway diagrams.', 2299, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop', '', 0.75, 'Active', false, true, false),
(7, 'Spirit Forest', 'framed-posters', 'anime', 'Miyazaki-inspired forest spirit scene. Hand-painted aesthetic, giclée printed.', 2899, 0, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=800&fit=crop', 'Staff Pick', 0.75, 'Active', false, true, false),
(8, 'Samurai Moon', 'framed-posters', 'anime', 'Ronin under a blood moon. Bold linework meets ukiyo-e composition.', 2399, 5, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, false),
(9, 'Brutalist Summer', 'framed-posters', 'others', 'Minimalist concert poster for a fictional festival. Risograph-style two-color print.', 1699, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop', '', 0.75, 'Active', false, true, false),
(10, 'Coffee & Typography', 'framed-posters', 'others', 'Swiss-style typographic print. Clean, precise, and endlessly wall-worthy.', 1599, 25, '["a5"]'::jsonb, 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, true),
(11, 'Vintage Travel', 'framed-posters', 'others', 'Retro-futuristic travel poster for a city that never was. Offset print aesthetic.', 1899, 0, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, false),
(12, 'Cinema Noir', 'framed-posters', 'others', 'Fictional film poster in the tradition of 70s exploitation cinema. Bold, loud, unforgettable.', 1999, 0, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=800&fit=crop', 'New', 0.67, 'Active', false, true, false),
(13, 'Space Oddity', 'framed-posters', 'others', 'Vintage NASA-inspired astronomy print. Retro science meets modern framing.', 2099, 10, '["a4"]'::jsonb, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, true),
(14, 'GT-R Profile', 'posters', 'cars', 'Clean side-profile of the R35 GT-R. Minimal, bold, automotive art.', 699, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop', '', 0.75, 'Active', false, true, false),
(15, 'Turbo Silhouette', 'posters', 'cars', 'Silhouette study of a tuned JDM legend. Dark tones, sharp lines.', 599, 10, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, true),
(16, 'Neon Runner', 'posters', 'anime', 'Cyberpunk runner in a neon-lit alley. Vibrant, high-contrast print.', 599, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop', '', 0.75, 'Active', false, true, false),
(17, 'Spirit Deer', 'posters', 'anime', 'Miyazaki-inspired forest spirit as a young deer. Soft watercolor aesthetic.', 499, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=800&fit=crop', 'New', 0.75, 'Active', false, true, false),
(18, 'Café Racer Study', 'posters', 'bikes', 'Vintage café racer in a moody garage setting. Warm tones, film grain.', 599, 0, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop', '', 0.75, 'Active', false, true, false),
(19, 'Risograph Flowers', 'posters', 'others', 'Abstract floral composition in risograph-style two-color print.', 499, 15, '["a5","a4"]'::jsonb, 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop', '', 0.75, 'Active', false, false, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_products_updated_at();
