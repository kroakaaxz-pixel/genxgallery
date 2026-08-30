/**
 * Shipping cost calculation
 *
 * Centralises shipping logic so it can be swapped for a real
 * Shiprocket API call without touching the Cart component.
 *
 * ──────────────────────────────────────────────────────────────
 * TODO: Replace this mock calculation with a real Shiprocket
 * API call (rate calculator endpoint, using pincode/weight/
 * dimensions) once Shiprocket integration is set up.
 *
 * Will need SHIPROCKET_API_KEY or similar credentials as
 * server-side env vars, likely via a Vercel serverless function
 * similar to the order confirmation email setup, since Shiprocket
 * API calls shouldn't be made directly from the client.
 * ──────────────────────────────────────────────────────────────
 */

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_FEE = 99;

/**
 * Calculate the shipping cost for an order.
 *
 * @param {number}  cartTotal  – pre-shipping total in ₹ (GST-inclusive)
 * @param {object}  [address]  – delivery address object (future use for
 *                               weight/zone-based Shiprocket rates)
 * @returns {{ amount: number, label: string }}
 *   amount  – numeric cost to display (0 for free)
 *   label   – short string shown next to the amount ("Free" or "₹99")
 */
export function calculateShipping(cartTotal, address) {
  // Current logic: free shipping above threshold, flat fee otherwise.
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
    return { amount: 0, label: 'Free' };
  }
  return { amount: FLAT_SHIPPING_FEE, label: `₹${FLAT_SHIPPING_FEE}` };
}
