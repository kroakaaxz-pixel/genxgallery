-- ============================================================
-- Gen X Gallery — RLS policy fixes (security audit, 2026-08-31)
-- Run this in the Supabase SQL Editor against your EXISTING database.
-- Safe to re-run (every statement is idempotent).
--
-- These correct real holes in the policies created with the original
-- schema. Until this runs, the anon key can read every guest order.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ORDERS — SELECT was readable by the entire internet
-- ------------------------------------------------------------
-- The old policy was:
--     USING (auth.uid() = user_id OR user_id IS NULL)
-- Guest checkouts store user_id = NULL, so `user_id IS NULL` matched every
-- guest order for every caller — including unauthenticated ones holding the
-- public anon key. That exposed customer email, full postal address and
-- phone number for all guest orders.
--
-- Guest orders are now readable by NOBODY through the anon key. They remain
-- reachable from the Supabase dashboard and from any server-side code using
-- the service-role key (which bypasses RLS).
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ------------------------------------------------------------
-- 2. ORDERS — INSERT allowed writing into another user's history
-- ------------------------------------------------------------
-- The old policy was WITH CHECK (true), so any caller could insert a row
-- with user_id set to somebody else's UUID and have it appear in that
-- person's order history. Guest checkout still works (user_id IS NULL);
-- a signed-in caller may now only insert rows owned by themselves.
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- No UPDATE or DELETE policy exists on orders, so clients cannot alter or
-- remove orders at all. That is intentional — leave it that way.

-- ------------------------------------------------------------
-- 3. ADDRESSES — UPDATE could reassign a row to another user
-- ------------------------------------------------------------
-- USING controls which rows you may target; WITH CHECK controls what the row
-- is allowed to look like afterwards. Without WITH CHECK, a user could take
-- their own address row and set user_id to someone else's UUID, planting an
-- address in that person's saved addresses.
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. PROFILES — UPDATE had no WITH CHECK either
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- 5. Verify
-- ------------------------------------------------------------
-- RLS must be ON for all three tables (rowsecurity = true):
--   SELECT tablename, rowsecurity FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN ('profiles', 'addresses', 'orders', 'site_status');
--
-- Review the resulting policy set (qual = USING, with_check = WITH CHECK):
--   SELECT tablename, policyname, cmd, qual, with_check
--     FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, cmd;
--
-- Sanity check the important one — as an anonymous caller this must return 0:
--   SELECT count(*) FROM orders;   -- run in a logged-out client, not the editor

-- ============================================================
-- 6. OUTSTANDING — site_status is writable by anyone (NOT fixed here)
-- ============================================================
-- The `site_status` table is not part of schema.sql and, as created, has no
-- RLS. The admin panel writes to it with the public anon key, which means any
-- visitor can flip the whole storefront into "Coming Soon" or "Maintenance"
-- with a single request. That is an availability issue, not a data leak.
--
-- It is left as-is deliberately: locking it down breaks the admin panel's
-- Site Status tab until those writes move server-side. The fix, once you are
-- ready, is to route writes through a serverless function authenticated by the
-- admin session cookie and using SUPABASE_SERVICE_ROLE_KEY, then apply:
--
--   ALTER TABLE site_status ENABLE ROW LEVEL SECURITY;
--
--   DROP POLICY IF EXISTS "Anyone can read site status" ON site_status;
--   CREATE POLICY "Anyone can read site status"
--     ON site_status FOR SELECT USING (true);
--
--   -- No INSERT/UPDATE/DELETE policy: only the service-role key may write.
--
-- Do NOT run the ALTER above before the write path is server-side.
