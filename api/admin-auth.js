/**
 * Admin authentication (server-side).
 *
 * Replaces the previous client-side password comparison, which shipped the
 * password inside the JS bundle where any visitor could read it.
 *
 * The password now lives ONLY in the ADMIN_PASSWORD server env var and is
 * never sent to the browser. On success the browser receives an httpOnly,
 * SameSite=Strict cookie holding an HMAC-signed, expiring session token
 * (signed with ADMIN_SESSION_SECRET) that JavaScript cannot read.
 *
 *   GET    → { authenticated: boolean }   verify the current session cookie
 *   POST   → { password }                 log in, sets the session cookie
 *   DELETE →                              log out, clears the session cookie
 *
 * IMPORTANT — what this does and does not do:
 * This removes the credential from the client bundle and makes the password
 * check unforgeable. It is NOT a full authorization boundary: the admin panel
 * still renders entirely in the browser, and the Supabase writes it performs
 * (site status) still use the public anon key. See README / audit notes for the
 * recommended follow-up (Supabase Auth + RLS scoped to the owner account).
 */

import crypto from 'node:crypto';

const SESSION_COOKIE = 'gxg_admin';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

// Best-effort brute-force brake. Serverless instances are ephemeral and not
// shared, so this slows down casual guessing rather than stopping a
// distributed attacker — use a real store (Upstash/KV) if that matters.
const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.first > ATTEMPT_WINDOW_MS) return false;
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.first > ATTEMPT_WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
  } else {
    record.count += 1;
  }
  // Keep the map from growing without bound on a long-lived instance.
  if (attempts.size > 5000) {
    for (const [key, value] of attempts) {
      if (now - value.first > ATTEMPT_WINDOW_MS) attempts.delete(key);
    }
  }
}

/** Constant-time string compare that does not leak length via early return. */
function timingSafeEqualStr(a, b) {
  const ab = Buffer.from(String(a), 'utf8');
  const bb = Buffer.from(String(b), 'utf8');
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab); // keep the work comparable
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

/** Chrome allows Secure cookies on http://localhost; Safari does not. */
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

function config() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const missing = [];
  if (!password) missing.push('ADMIN_PASSWORD');
  if (!secret) missing.push('ADMIN_SESSION_SECRET');
  return { password, secret, missing };
}

export default async function handler(req, res) {
  const { password, secret, missing } = config();

  // ── Log out ──────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', cookieHeader('', 0, req));
    return res.status(200).json({ authenticated: false });
  }

  // ── Session check ────────────────────────────────────────────
  if (req.method === 'GET') {
    if (missing.length > 0) {
      // Detail to the server log only; the client gets a bare boolean.
      console.error(`Admin auth is not configured — missing: ${missing.join(', ')}`);
      return res.status(200).json({ authenticated: false });
    }
    const token = readCookie(req, SESSION_COOKIE);
    return res.status(200).json({ authenticated: verifyToken(token, secret) });
  }

  // ── Log in ───────────────────────────────────────────────────
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (missing.length > 0) {
    console.error(`Admin auth is not configured — missing: ${missing.join(', ')}`);
    return res.status(503).json({ error: 'Admin login is unavailable' });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many attempts' });
  }

  const submitted = req.body?.password;
  if (typeof submitted !== 'string' || submitted.length === 0) {
    recordFailure(ip);
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!timingSafeEqualStr(submitted, password)) {
    recordFailure(ip);
    return res.status(401).json({ error: 'Incorrect password' });
  }

  attempts.delete(ip);
  res.setHeader('Set-Cookie', cookieHeader(createToken(secret), SESSION_TTL_SECONDS, req));
  return res.status(200).json({ authenticated: true });
}
