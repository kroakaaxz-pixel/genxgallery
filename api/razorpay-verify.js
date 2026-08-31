import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { global: { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({ error: 'Missing required payment parameters' });
  }

  const razorPayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorPayKeySecret) {
    console.error('Razorpay key secret not configured');
    return res.status(503).json({ error: 'Payment service is not configured' });
  }

  // Build the signature hash: order_id|payment_id
  const sign = crypto
    .createHmac('sha256', razorPayKeySecret)
    .update(razorpay_order_id + '|' + razorpay_payment_id, 'utf8')
    .digest('hex');

  // Compare the signature Razorpay sent with the one we generated
  const isValid = sign === razorpay_signature;

  if (isValid) {
    // Signature is valid — payment is authenticated.
    // Update the order status to 'paid' and store Razorpay IDs using the
    // service-role key, which bypasses RLS. This must happen server-side
    // only — never trust the frontend's "payment success" callback alone.
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
        })
        .eq('id', razorpay_order_id); // Note: order id stored as razorpay_order_id

      if (error) {
        console.error('Supabase order update failed after payment verify:', error);
        // We still consider the payment valid; the order update failure
        // is a separate issue (e.g., order not found, RLS misconfig).
        // The frontend should still show payment success but log the error.
      }
    } catch (supaErr) {
      console.error('Supabase update exception after payment verify:', supaErr);
    }

    res.status(200).json({ valid: true });
  } else {
    // Signature is invalid — potential fraud or tampering
    res.status(400).json({ valid: false, error: 'Invalid payment signature' });
  }
}