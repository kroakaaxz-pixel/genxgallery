/**
 * GET /api/check-products-table
 *
 * Checks whether the products table exists in Supabase and returns its row
 * count. Used by the admin panel to detect a missing table and show setup
 * instructions instead of a broken UI.
 *
 * Requires only the public anon key — this is a read-only check.
 */
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ exists: false, error: 'Supabase not configured' });
  }

  const supabase = createClient(url, key);

  try {
    // Try to select from the products table. If it doesn't exist, PostgREST
    // returns a 404 with code PGRST205.
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      const isMissingTable = error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table');
      return res.status(200).json({
        exists: !isMissingTable,
        rowCount: 0,
        error: error.message,
        code: error.code,
        setupRequired: isMissingTable,
      });
    }

    return res.status(200).json({ exists: true, rowCount: count ?? 0 });
  } catch (err) {
    return res.status(500).json({ exists: false, error: err.message });
  }
}
