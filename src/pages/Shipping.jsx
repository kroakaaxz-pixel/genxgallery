import { Link } from 'react-router-dom';
import { useHead } from '../hooks/useHead';
import styles from './Shipping.module.css';

export default function Shipping() {
  useHead({
    title: 'Shipping Policy',
    description: 'Shipping information for Gen X Gallery orders. Estimated delivery times, shipping regions, and details for custom framed orders.',
  });

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Policy</p>
          <h1 className={styles.heroTitle}>Shipping</h1>
        </div>
      </div>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.body}>
            {/* PLACEHOLDER: Replace these timeframes with real business details before launch */}
            <h2>Estimated Delivery</h2>
            <p>
              Orders are processed within 1–2 business days. Standard shipping within India
              takes <strong>3–7 business days</strong> from dispatch. Express shipping (where available)
              takes <strong>1–3 business days</strong>.
            </p>
            <p>
              You'll receive a tracking number by email once your order ships.
            </p>

            <h2>Custom &amp; Framed Orders</h2>
            <p>
              Framed posters and custom-framed prints are made to order. Please allow an additional
              <strong> 5–10 business days</strong> for production before shipping. These items are
              carefully packaged in custom crates to ensure they arrive in perfect condition.
            </p>

            <h2>Unframed Posters</h2>
            <p>
              Unframed prints ship flat in rigid mailers or protective tubes, depending on size.
              Standard delivery: <strong>3–5 business days</strong> from dispatch.
            </p>

            <h2>Shipping Regions</h2>
            <p>
              We currently ship within India. International shipping is not yet available —
              we're working on expanding coverage. If you'd like us to ship internationally,
              reach out via WhatsApp and we'll see what we can arrange.
            </p>

            <h2>Shipping Costs</h2>
            <p>
              Standard shipping is free on all orders above ₹999. A flat fee of ₹99 applies
              to smaller orders.
            </p>

            <div className={styles.note}>
              <p>
                <strong>Note:</strong> These are placeholder policies. Please update with your
                actual shipping partners, rates, and delivery timeframes before going live.
              </p>
            </div>

            <Link to="/about" className={styles.backLink}>← Back to About</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
