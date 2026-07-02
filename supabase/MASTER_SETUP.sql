-- =====================================================================
-- CLOTHIFY SHOPPING — MASTER DATABASE SETUP
-- Paste this ENTIRE file into the Supabase SQL Editor and click Run.
-- It is idempotent: safe to re-run. It will create every table, index,
-- function, trigger, RLS policy, storage bucket, realtime publication,
-- and seed row required by the current codebase.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- 2. Shared helper: updated_at trigger
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================================
-- 3. TABLES  (each block: CREATE → GRANT → ENABLE RLS → POLICIES → TRIGGER)
-- =====================================================================

-- ---- profiles -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---- user_roles -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL   ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Role check (SECURITY DEFINER — prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ---- app_settings ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view app settings"   ON public.app_settings;
DROP POLICY IF EXISTS "Admins can insert app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admins can update app settings" ON public.app_settings;

CREATE POLICY "Anyone can view app settings"
  ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert app settings"
  ON public.app_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update app settings"
  ON public.app_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ---- products -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  price       integer NOT NULL DEFAULT 0,
  cost_price  integer NOT NULL DEFAULT 0,
  category    text NOT NULL,
  year        integer NOT NULL DEFAULT 2025,
  sizes       jsonb NOT NULL DEFAULT '[]'::jsonb,
  stock       integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image       text NOT NULL DEFAULT '',
  colors      jsonb NOT NULL DEFAULT '[]'::jsonb,
  trending    boolean NOT NULL DEFAULT false,
  featured    boolean NOT NULL DEFAULT false,
  seasonal    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seasonal ON public.products(seasonal);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products"   ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---- cart_items -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size       text NOT NULL DEFAULT '',
  quantity   integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cart_select_own ON public.cart_items;
DROP POLICY IF EXISTS cart_insert_own ON public.cart_items;
DROP POLICY IF EXISTS cart_update_own ON public.cart_items;
DROP POLICY IF EXISTS cart_delete_own ON public.cart_items;

CREATE POLICY cart_select_own ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY cart_insert_own ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY cart_update_own ON public.cart_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY cart_delete_own ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---- wishlist -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlist TO authenticated;
GRANT ALL ON public.wishlist TO service_role;

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wishlist_select_own ON public.wishlist;
DROP POLICY IF EXISTS wishlist_insert_own ON public.wishlist;
DROP POLICY IF EXISTS wishlist_delete_own ON public.wishlist;
DROP POLICY IF EXISTS wishlist_admin_all  ON public.wishlist;

CREATE POLICY wishlist_select_own ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY wishlist_insert_own ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY wishlist_delete_own ON public.wishlist FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY wishlist_admin_all  ON public.wishlist FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---- orders ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name       text NOT NULL,
  phone               text NOT NULL,
  address             text NOT NULL,
  city                text NOT NULL,
  delivery_type       text NOT NULL CHECK (delivery_type IN ('dhaka','outside')),
  items               jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal            integer NOT NULL DEFAULT 0,
  delivery_charge     integer NOT NULL DEFAULT 0,
  total_price         integer NOT NULL DEFAULT 0,
  status              text NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method      text NOT NULL DEFAULT 'cod',
  payment_status      text NOT NULL DEFAULT 'pending',
  transaction_id      text,
  card_type           text,
  bank_tran_id        text,
  return_status       text,
  return_reason       text,
  return_requested_at timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON public.orders(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders"                ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders"              ON public.orders;
DROP POLICY IF EXISTS "Users can update payment fields on own orders"  ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders"                     ON public.orders;
DROP POLICY IF EXISTS "Admins can update order status"                 ON public.orders;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update payment fields on own orders"
  ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update order status"
  ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---- return_requests ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.return_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id       text NOT NULL,
  product_title    text NOT NULL DEFAULT '',
  product_image    text NOT NULL DEFAULT '',
  product_size     text NOT NULL DEFAULT '',
  product_quantity integer NOT NULL DEFAULT 1,
  reason           text NOT NULL DEFAULT '',
  status           text NOT NULL DEFAULT 'requested',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order_id ON public.return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_user_id  ON public.return_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status   ON public.return_requests(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.return_requests TO authenticated;
GRANT ALL ON public.return_requests TO service_role;

ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own return requests"    ON public.return_requests;
DROP POLICY IF EXISTS "Users can create their own return requests"  ON public.return_requests;
DROP POLICY IF EXISTS "Admins can view all return requests"         ON public.return_requests;
DROP POLICY IF EXISTS "Admins can update return requests"           ON public.return_requests;

CREATE POLICY "Users can view their own return requests"
  ON public.return_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own return requests"
  ON public.return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all return requests"
  ON public.return_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update return requests"
  ON public.return_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_return_requests_updated_at ON public.return_requests;
CREATE TRIGGER update_return_requests_updated_at
  BEFORE UPDATE ON public.return_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 4. New-user hook: create profile + auto-grant admin
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'ridu116540@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created         ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_admin   ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin_role();

-- =====================================================================
-- 5. Realtime — publish tables the app subscribes to
-- =====================================================================
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['products','orders','cart_items','wishlist','return_requests','app_settings'])
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;

-- =====================================================================
-- 6. Storage bucket + policies (product-images)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public read product-images"    ON storage.objects;
DROP POLICY IF EXISTS "Admins upload product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admins update product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admins delete product-images"  ON storage.objects;

CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins upload product-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update product-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete product-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- 7. Seed data (safe defaults — will not overwrite existing rows)
-- =====================================================================
INSERT INTO public.app_settings (key, value)
VALUES ('active_season', 'winter')
ON CONFLICT (key) DO NOTHING;

-- =====================================================================
-- DONE.
-- Products are seeded automatically by the frontend on first load
-- (ProductContext / src/data/products.ts) using the existing premium
-- catalog images — no product images are regenerated or replaced.
-- =====================================================================
