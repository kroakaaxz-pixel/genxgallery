import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly at load time. Previously a missing env var produced a silent
// null client: sign-in did nothing, order history came back empty, and orders
// were dropped on the floor with no indication anything was wrong.
const missingEnv = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
].filter(Boolean);

if (missingEnv.length > 0) {
  console.error(
    `[Gen X Gallery] Supabase is not configured — missing ${missingEnv.join(' and ')}. ` +
      'Sign-in, saved addresses, order history and order recording are all disabled. ' +
      'Set these in .env.local for local development, or in the Vercel project ' +
      'environment variables for a deployment, then rebuild. See .env.example.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** True when both public Supabase env vars are present. */
export const isSupabaseConfigured = supabase !== null;

// ── Auth helpers ──────────────────────────────────────────────

export function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signOut();
}

export function getCurrentUser() {
  if (!supabase) return Promise.resolve(null);
  return supabase.auth.getUser().then(({ data }) => data.user ?? null);
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// ── Profile helpers ───────────────────────────────────────────

export async function getProfile(userId) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Address helpers ───────────────────────────────────────────

export async function getAddresses(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addAddress(userId, address) {
  if (!supabase) throw new Error('Supabase not configured');
  // If marking as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);
  }
  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAddress(addressId, userId, address) {
  if (!supabase) throw new Error('Supabase not configured');
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true)
      .neq('id', addressId);
  }
  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(addressId, userId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);
  if (error) throw error;
}

// ── Order helpers ─────────────────────────────────────────────

export async function insertOrder(order) {
  if (!supabase) {
    // Loud, not silent: the caller must be able to tell the customer that the
    // order was not recorded rather than showing a false confirmation.
    throw new Error('Supabase not configured');
  }
  // No .select() here on purpose. Guest orders (user_id IS NULL) are not
  // readable under the orders SELECT policy, so asking for the inserted row
  // back would fail RLS and break guest checkout. The caller already knows the
  // order id it generated.
  const { error } = await supabase.from('orders').insert(order);
  if (error) throw error;
}

export async function getUserOrders(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ── Site status (unchanged) ───────────────────────────────────

export async function getSiteStatus() {
  if (!supabase) return 'live';
  try {
    const { data, error } = await supabase
      .from('site_status')
      .select('mode')
      .eq('id', 1)
      .single();
    if (error || !data) return 'live';
    return data.mode || 'live';
  } catch {
    return 'live';
  }
}

export async function setSiteStatus(mode) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('site_status')
    .upsert({ id: 1, mode }, { onConflict: 'id' });
  if (error) throw error;
}

// ── Product helpers ──────────────────────────────────────────

function dbToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category,
    description: row.description,
    price: Number(row.price),
    discountPercent: Number(row.discount_percent),
    sizes: row.sizes,
    image: row.image,
    badge: row.badge,
    naturalRatio: Number(row.natural_ratio),
    status: row.status,
    isDeleted: row.is_deleted,
    isNewArrival: row.is_new_arrival,
    isSpecialDeal: row.is_special_deal,
  };
}

function productToDb(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    sub_category: p.subCategory,
    description: p.description,
    price: p.price,
    discount_percent: p.discountPercent,
    sizes: p.sizes,
    image: p.image,
    badge: p.badge || '',
    natural_ratio: p.naturalRatio || 0.75,
    status: p.status || 'Active',
    is_deleted: p.isDeleted === true,
    is_new_arrival: p.isNewArrival === true,
    is_special_deal: p.isSpecialDeal === true,
  };
}

export async function fetchProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_deleted', false)
    .order('id');
  if (error) {
    console.error('[Supabase] fetchProducts failed:', error.message, error.details, error.hint);
    throw error;
  }
  return (data || []).map(dbToProduct);
}

export async function fetchAllProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  if (error) {
    console.error('[Supabase] fetchAllProducts failed:', error.message, error.details, error.hint);
    throw error;
  }
  return (data || []).map(dbToProduct);
}

export async function fetchProductById(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();
  if (error || !data) return null;
  return dbToProduct(data);
}

export async function createProduct(product) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .insert(productToDb(product))
    .select();
  if (error) {
    console.error('[Supabase] createProduct failed:', error.message, error.details, error.hint);
    throw error;
  }
  return data;
}

export async function updateProduct(id, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.subCategory !== undefined) dbUpdates.sub_category = updates.subCategory;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.discountPercent !== undefined) dbUpdates.discount_percent = updates.discountPercent;
  if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
  if (updates.naturalRatio !== undefined) dbUpdates.natural_ratio = updates.naturalRatio;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.isDeleted !== undefined) dbUpdates.is_deleted = updates.isDeleted;
  if (updates.isNewArrival !== undefined) dbUpdates.is_new_arrival = updates.isNewArrival;
  if (updates.isSpecialDeal !== undefined) dbUpdates.is_special_deal = updates.isSpecialDeal;
  const numId = Number(id);
  const { data, error } = await supabase
    .from('products')
    .update(dbUpdates)
    .eq('id', numId)
    .select();
  if (error) {
    console.error('[Supabase] updateProduct failed:', error.message, error.details, error.hint);
    throw error;
  }
  return data;
}

export async function deleteProduct(id) {
  return updateProduct(id, { isDeleted: true });
}

export async function restoreProduct(id) {
  return updateProduct(id, { isDeleted: false });
}
