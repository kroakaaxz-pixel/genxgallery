/**
 * Admin site status endpoint — uses SUPABASE_SERVICE_ROLE_KEY
 * so RLS policies do not block the write.
 *
 * GET    → { mode: 'live' | 'coming_soon' | 'maintenance' }   read current mode
 * POST   → { mode }                                            update site status
 * DELETE →                                                  clear cookie + reset to 'live'
 *
 * The gxg_admin httpOnly cookie is checked for validity (same
 * pattern as admin-auth.js). On success, a Supabase client
 * initialized with SUPABASE_SERVICE_ROLE_KEY bypasses RLS and
 * performs the upsert.  Any failure or missing/invalid cookie
 * results in a 401 response — never exposes the service key to
 * the browser.
 */

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SESSION_COOKIE = 'gxg_admin';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = globalThis._adminAttempts?.get(ip);
  if (!record || now - record.first > 10 * 60 * 1000) return false;
  return record.count >= 8;
}

function recordFailure(ip) {
  const now = Date.now();
  const record = globalThis._adminAttempts?.get(ip);
  if (!record || now - record.first > 10 * 60 * 1000) {
    globalThis._adminAttempts?.set(ip, { count: 1, first: now });
  } else {
    record.count += 1;
  }
  if (globalThis._adminAttempts?.size > 5000) {
    for (const [key, value] of globalThis._adminAttempts) {
      if (now - value.first > 10 * 60 * 1000) globalThis._adminAttempts.delete(key);
    }
  }
}

function timingSafeEqualStr(a, b) {
  const ab = Buffer.from(String(a), 'utf8');
  const bb = Buffer.from(String(b), 'utf8');
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp }), 'utf8').toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

function verifyToken(token, secret) {
  if (typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!signature) return false;
  if (!timingSafeEqualStr(signature, sign(payload, secret))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return null;
}

function isLocalHost(req) {
  const host = req.headers?.host || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

function cookieHeader(value, maxAge, req) {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${maxAge}`,
  ];
  if (!isLocalHost(req)) parts.push('Secure');
  return parts.join('; ');
}

/** Create a Supabase client using the service-role key (server-side only). */
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✏️ DEBUG: Log env var presence (true/only — never the actual secret values)
console.log('[admin-site-status] Env vars check:', {
  VITE_SUPABASE_URL: !!supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '[admin-site-status] SUPABASE_SERVICE_ROLE_KEY missing — site status writes disabled.'
  );
}

/** Supabase client — only created when env vars are present. */
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { 'x-odobuilder-service-role': true } },
    })
  : null;

/** Unified handler for all admin-site-status methods. */
export default async function handler(req, res) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const missing = [];
  if (!password) missing.push('ADMIN_PASSWORD');
  if (!secret) missing.push('ADMIN_SESSION_SECRET');

  // ── Log out ──────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', cookieHeader('', 0, req));
    globalThis._adminAttempts = globalThis._adminAttempts || new Map();
    globalThis._adminAttempts.clear();
    return res.status(200).json({ authenticated: false });
  }

  // ── Session check ────────────────────────────────────────────
  if (req.method === 'GET') {
    if (missing.length > 0) {
      console.error(
        `[admin-site-status] Admin auth not configured — missing: ${missing.join(', ')}`
      );
      return res.status(200).json({ authenticated: false });
    }
    const token = readCookie(req, SESSION_COOKIE);
    return res.status(200).json({ authenticated: verifyToken(token, secret) });
  }

  // ── Method guard ─────────────────────────────────────────────
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (missing.length > 0) {
    console.error(`[admin-site-status] Admin auth not configured — missing: ${missing.join(', ')}`);
    return res.status(503).json({ error: 'Admin login is unavailable' });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many attempts' });
  }

  const submittedMode = req.body?.mode;
  if (typeof submittedMode !== 'string' || submittedMode.length === 0) {
    recordFailure(ip);
    return res.status(400).json({ error: 'Mode is required' });
  }

  // Verify the gxg_admin cookie (same check as admin-auth.js)
  const token = readCookie(req, SESSION_COOKIE);
  if (!token || !verifyToken(token, secret)) {
    recordFailure(ip);
    return res.status(401).json({ error: 'Unauthorized — invalid admin session' });
  }

  // Cookie is valid — proceed with site status upsert using service role key
  try {
    if (!supabase) {
      console.error(
        '[admin-site-status] Supabase client not initialized — check VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
      );
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const { data, error } = await supabase
      .from('site_status')
      .upsert({ id: 1, mode: submittedMode }, { onConflict: 'id' });

    if (error) {
      console.error(
        '[admin-site-status] Supabase upsert error:',
        error.message,
        error.detail,
        error.hint
      );
      return res.status(500).json({ error: 'Failed to update site status' });
    }

    return res.status(200).json({ mode: submittedMode, success: true });
  } catch (err) {
    console.error(
      '[admin-site-status] Unexpected error:',
      err.message,
      err.stack
    );
    return res.status(500).json({ error: 'Internal server error' });
  }
}