/**
 * Currency formatting utility
 *
 * Centralizes all price display logic so currency can be swapped easily.
 * Currently configured for INR (₹).
 */

const CURRENCY_SYMBOL = '₹';
const LOCALE = 'en-IN';

/**
 * Format a number as INR currency with Indian-style grouping.
 * e.g. 1499 → "₹1,499"  |  3199 → "₹3,199"
 */
export function formatPrice(amount) {
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString(LOCALE)}`;
}

/**
 * Format just the number with Indian-style grouping (no symbol).
 * e.g. 1499 → "1,499"
 */
export function formatNumber(amount) {
  return Number(amount).toLocaleString(LOCALE);
}

export { CURRENCY_SYMBOL };
