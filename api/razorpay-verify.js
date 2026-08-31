import crypto from 'node:crypto';

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
    // Signature is valid — payment is authenticated
    res.status(200).json({ valid: true });
  } else {
    // Signature is invalid — potential fraud or tampering
    res.status(400).json({ valid: false, error: 'Invalid payment signature' });
  }
}