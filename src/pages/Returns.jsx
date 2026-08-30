import { Link } from 'react-router-dom';
import { useHead } from '../hooks/useHead';
import styles from './Returns.module.css';

export default function Returns() {
  useHead({
    title: 'Returns & Refunds',
    description: 'Returns and refund policy for Gen X Gallery. How to return items, refund timeframes, and policies for custom orders.',
  });

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Policy</p>
          <h1 className={styles.heroTitle}>Returns &amp; Refunds</h1>
        </div>
      </div>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.body}>
            {/* PLACEHOLDER: Replace these details with real business policies before launch */}
            <h2>Return Window</h2>
            <p>
              We accept returns within <strong>7 days from delivery</strong>. To be eligible,
              items must be in their original condition — unused, undamaged, and in original
              packaging.
            </p>

            <h2>How to Start a Return</h2>
            <p>
              Contact us via WhatsApp or email with your order number and reason for return.
              We'll provide return instructions and a shipping label (for domestic orders).
            </p>

            <h2>Refunds</h2>
            <p>
              Once we receive and inspect your return, we'll process your refund within
              <strong> 5–7 business days</strong>. Refunds are issued to the original payment
              method. Shipping costs are non-refundable unless the return is due to our error.
            </p>

            <h2>Custom &amp; Personalized Orders</h2>
            <p>
              Custom-framed prints and orders with uploaded photos are <strong>final sale</strong>
              and cannot be returned or refunded, except in cases of manufacturing defect or
              damage during shipping. Each custom piece is made to your specifications — please
              double-check your selection before placing the order.
            </p>

            <h2>Damaged or Defective Items</h2>
            <p>
              If your order arrives damaged, contact us within 48 hours with photos of the
              damage. We'll arrange a replacement or full refund at no cost to you.
            </p>

            <h2>Exchanges</h2>
            <p>
              We don't currently offer direct exchanges. If you'd like a different item,
              simply return the original for a refund and place a new order.
            </p>

            <div className={styles.note}>
              <p>
                <strong>Note:</strong> These are placeholder policies. Please update with your
                actual return windows, conditions, and refund processes before going live.
              </p>
            </div>

            <Link to="/about" className={styles.backLink}>← Back to About</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
