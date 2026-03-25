-- ============================================================
--  VesTyle +++ — Schéma & Données de Test Complet
--  📦 TOUT-EN-UN — SQL Editor > RUN
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILS ──────────────────────────────────────────────
-- Note : REFERENCES auth.users(id) est commenté pour permettre le Seed sans utilisateur réel
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY, 
  role       TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client','vendor','courier','admin')),
  full_name  TEXT,
  phone      TEXT,
  whatsapp   TEXT,
  city_id    TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. BOUTIQUES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  city_id      TEXT NOT NULL,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE,
  bio          TEXT,
  address      TEXT,
  whatsapp     TEXT NOT NULL,
  banner_url   TEXT,
  avatar_url   TEXT,
  hours_open   TEXT,
  hours_close  TEXT,
  is_certified BOOLEAN DEFAULT FALSE,
  cert_score   INT DEFAULT 0 CHECK (cert_score BETWEEN 0 AND 100),
  click_count  INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  accent_color TEXT DEFAULT '#f97316',
  welcome_msg  TEXT,
  lat          FLOAT,
  lng          FLOAT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. CATÉGORIES STANDARDISÉES ─────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
);

INSERT INTO categories (id, name, icon) VALUES
  ('mode',         'Mode & Vêtements',       '👗'),
  ('electronique', 'Électronique',            '📱'),
  ('alimentation', 'Alimentation & Boissons', '🛒'),
  ('maison',       'Maison & Décoration',     '🏠'),
  ('beaute',       'Beauté & Santé',          '💄'),
  ('sport',        'Sport & Loisirs',         '⚽'),
  ('auto',         'Auto & Moto',             '🚗'),
  ('livres',       'Livres & Éducation',      '📚'),
  ('artisanat',    'Artisanat Local',         '🎨'),
  ('services',     'Services & Prestations',  '🔧')
ON CONFLICT (id) DO NOTHING;

-- ─── 4. PRODUITS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id       UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  category_id     TEXT REFERENCES categories(id) NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           INT NOT NULL,
  old_price       INT,
  stock           INT DEFAULT 0,
  images          TEXT[],
  is_published    BOOLEAN DEFAULT FALSE,
  is_trending     BOOLEAN DEFAULT FALSE,
  click_count     INT DEFAULT 0,
  promo_starts_at TIMESTAMPTZ,
  promo_ends_at   TIMESTAMPTZ,
  promo_price     INT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vue: prix effectif (promo active ou prix normal)
CREATE OR REPLACE VIEW products_with_price AS
  SELECT *,
    CASE
      WHEN promo_starts_at <= NOW() AND promo_ends_at >= NOW() THEN promo_price
      ELSE price
    END AS effective_price,
    (promo_starts_at <= NOW() AND promo_ends_at >= NOW()) AS promo_active
  FROM products
  WHERE is_published = true;

-- ─── 5. COMMANDES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id    UUID REFERENCES profiles(id),
  vendor_id    UUID REFERENCES vendors(id),
  courier_id   UUID REFERENCES profiles(id),
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_delivery','delivered','cancelled')),
  total_fcfa   INT,
  address      TEXT,
  lat          FLOAT,
  lng          FLOAT,
  notes        TEXT,
  proof_photo  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- ─── 6. ARTICLES D'UNE COMMANDE ──────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL
);

-- ─── 7. TRACKING GPS LIVREURS ────────────────────────────────
CREATE TABLE IF NOT EXISTS courier_locations (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  courier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id   UUID REFERENCES orders(id) ON DELETE SET NULL,
  lat        FLOAT NOT NULL,
  lng        FLOAT NOT NULL,
  is_online  BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_courier_location ON courier_locations(courier_id);

-- ─── 8. AVIS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id   UUID REFERENCES orders(id),
  client_id  UUID REFERENCES profiles(id),
  vendor_id  UUID REFERENCES vendors(id),
  courier_id UUID REFERENCES profiles(id),
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. SÉCURITÉ RLS ─────────────────────────────────────────
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "profil_own" ON profiles;
CREATE POLICY "profil_own" ON profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "vendors_read" ON vendors;
CREATE POLICY "vendors_read" ON vendors FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "vendors_write" ON vendors;
CREATE POLICY "vendors_write" ON vendors FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "products_read" ON products;
CREATE POLICY "products_read" ON products FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "products_write" ON products;
CREATE POLICY "products_write" ON products FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM vendors WHERE id = vendor_id)
);

DROP POLICY IF EXISTS "gps_read" ON courier_locations;
CREATE POLICY "gps_read" ON courier_locations FOR SELECT USING (is_online = true);
DROP POLICY IF EXISTS "gps_write" ON courier_locations;
CREATE POLICY "gps_write" ON courier_locations FOR ALL USING (auth.uid() = courier_id);

-- ─── 10. TRIGGER AUTO-PROFIL ─────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── 11. REALTIME (Idempotent) ────────────────────────────────
-- Création de la publication si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Mise à jour des tables incluses (SET TABLE remplace toute la liste)
ALTER PUBLICATION supabase_realtime SET TABLE courier_locations, orders;

-- ─── 12. DONNÉES DE SEED (VENDEURS & PRODUITS) ──────────────

-- Profils fictifs pour le test
INSERT INTO profiles (id, role, full_name, phone, whatsapp, city_id)
VALUES 
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'vendor', 'Mme. Ngo Bayiha', '+237690000001', '+237690000001', 'douala'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'vendor', 'Aristide Tech', '+237670000002', '+237670000002', 'douala'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'vendor', 'Sali de Maroua', '+237650000003', '+237650000003', 'maroua'),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'vendor', 'Espace Chic Yaoundé', '+237680000004', '+237680000004', 'yaounde'),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'courier', 'Livreur Express Douala', '+237660000005', '+237660000005', 'douala')
ON CONFLICT (id) DO NOTHING;

-- Boutiques
INSERT INTO vendors (id, owner_id, city_id, name, slug, bio, whatsapp, banner_url, is_certified, cert_score, click_count, accent_color)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'douala', 'Mode & Wax Douala', 'mode-wax-douala', 'Les plus beaux modèles en wax africain.', '+237690000001', 'https://picsum.photos/seed/wax/800/400', true, 95, 1250, '#f97316'),
  ('22222222-2222-2222-2222-222222222222', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'douala', 'Aristide Tech Zone', 'aristide-tech', 'Vente de smartphones.', '+237670000002', 'https://picsum.photos/seed/tech/800/400', true, 88, 3400, '#3b82f6'),
  ('33333333-3333-3333-3333-333333333333', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'maroua', 'Cuir du Nord', 'cuir-du-nord', 'Sandalettes en cuir.', '+237650000003', 'https://picsum.photos/seed/leather/800/400', false, 75, 450, '#d4a853'),
  ('44444444-4444-4444-4444-444444444444', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'yaounde', 'L''Élégance de Yaoundé', 'elegance-yaounde', 'Luxe et prêt-à-porter.', '+237680000004', 'https://picsum.photos/seed/style/800/400', true, 92, 1100, '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Produits
INSERT INTO products (vendor_id, category_id, name, description, price, old_price, stock, images, is_published, is_trending)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'mode', 'Robe de Soirée Wax', 'Wax 100% coton.', 25000, 35000, 10, ARRAY['https://picsum.photos/seed/wax1/600/600'], true, true),
  ('22222222-2222-2222-2222-222222222222', 'electronique', 'iPhone 15 Pro Max 256GB', 'Garantie 1 an.', 850000, 1100000, 3, ARRAY['https://picsum.photos/seed/iphone/600/600'], true, true),
  ('33333333-3333-3333-3333-333333333333', 'artisanat', 'Sandalettes Cuir', 'Fait main.', 8000, 12000, 100, ARRAY['https://picsum.photos/seed/sandals/600/600'], true, true),
  ('44444444-4444-4444-4444-444444444444', 'mode', 'Montre Luxe Dorée', 'Automatique.', 125000, 180000, 5, ARRAY['https://picsum.photos/seed/watch/600/600'], true, true);

-- GPS
INSERT INTO courier_locations (courier_id, lat, lng, is_online)
VALUES ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 4.0511, 9.7679, true)
ON CONFLICT (courier_id) DO NOTHING;
