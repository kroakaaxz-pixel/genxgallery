import crypto from 'node:crypto';
import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  // Razorpay expects amount in the smallest currency unit.
  // For INR, that's paise (1/100 of a rupee). We round to nearest paise.
  const amountInPaise = Math.round(Number(amount) * 100);

  const razorPayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorPayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorPayKeyId || !razorPayKeySecret) {
    console.error('Razorpay keys not configured — missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
    return res.status(503).json({ error: 'Payment service is not configured' });
  }

  try {
    var razorpay = new Razorpay({
      key_id: razorPayKeyId,
      key_secret: razorPayKeySecret,
    });

    var options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // auto-capture the payment
    };

    var order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
}