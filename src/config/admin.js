/**
 * Admin configuration
 *
 * The admin password is NOT here (and must never be). It lives only in the
 * ADMIN_PASSWORD server env var and is verified by the `/api/admin-auth`
 * serverless function, so it is never included in the browser bundle.
 *
 * See api/admin-auth.js for the login flow and its known limitations.
 */

/**
 * Social media links
 * Update these constants with your real handles/numbers.
 */
export const INSTAGRAM_HANDLE = 'genxgallery';
export const INSTAGRAM_URL = 'https://instagram.com/genxgallery';

export const WHATSAPP_NUMBER = '918011789331';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
