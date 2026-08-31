-- ============================================================
-- Add INSERT and UPDATE RLS policies for products table
-- The admin panel uses the anon key — without these policies,
-- all writes (create, update, delete/soft-delete) are silently
-- rejected by RLS.
--
-- Run this in Supabase SQL Editor after products-schema.sql
-- ============================================================

-- Drop old restrictive policies if they exist
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;

-- SELECT: anyone can read (storefront filters is_deleted at app level)
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- INSERT: allow anon to create products (admin panel)
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- UPDATE: allow anon to update products (admin panel)
-- This covers: edit fields, change status, soft-delete, restore
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);
