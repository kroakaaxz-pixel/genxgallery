import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
