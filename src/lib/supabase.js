import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
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
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (error) {
    console.warn('Failed to insert order into Supabase:', error.message);
    return null;
  }
  return data;
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
