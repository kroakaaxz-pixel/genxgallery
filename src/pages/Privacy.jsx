import { Link } from 'react-router-dom';
import { useHead } from '../hooks/useHead';
import styles from './Legal.module.css';

export default function Privacy() {
  useHead({
    title: 'Privacy Policy',
    description: 'How Gen X Gallery collects, uses, and protects your personal information. Your privacy matters to us.',
  });

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Legal</p>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroDate}>Last updated: August 2026</p>
        </div>
      </div>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.body}>
            {/* PLACEHOLDER: This is template privacy policy language. Have it reviewed by someone
                with legal knowledge before launch. Replace privacy@genxgallery.in with a real address. */}

            <h2>What We Collect</h2>
            <p>
              When you place an order or create an account, we collect:
            </p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Shipping and billing address</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely — we do not store card details)</li>
              <li>Any photos you upload for custom framing orders</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve our products and services</li>
              <li>Send occasional marketing communications (only if you opt in)</li>
              <li>Respond to your customer service inquiries</li>
            </ul>

            <h2>What We Don't Do</h2>
            <p>
              We <strong>never sell, rent, or trade</strong> your personal information to
              third parties. Your data stays with us and is only shared with service providers
              directly necessary to fulfill your order (e.g. shipping carriers, payment processors).
            </p>

            <h2>Cookies &amp; Analytics</h2>
            <p>
              Our website uses cookies to maintain your session (cart contents, login state) and
              to understand how visitors use our site. We use analytics tools including
              <strong> Google Analytics</strong> and <strong>Meta Pixel</strong> to measure site
              performance and improve your experience. These tools collect anonymized usage data
              such as pages visited, time spent on site, and referral sources.
            </p>
            <p>
              You can control cookies through your browser settings. Disabling cookies may affect
              site functionality (e.g. cart may not persist between pages).
            </p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. To make a
              request, contact us at the email below. We will respond within 30 days.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our site is not intended for children under 13. We do not knowingly collect
              personal information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page
              with an updated revision date.
            </p>

            <h2>Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at:{' '}
              <strong>privacy@genxgallery.in</strong>
            </p>

            <div className={styles.note}>
              <p>
                <strong>Note:</strong> This is placeholder/template privacy policy language.
                It should be reviewed by someone with legal knowledge before going live.
                The contact email (privacy@genxgallery.in) needs to be replaced with a real address.
              </p>
            </div>

            <Link to="/about" className={styles.backLink}>← Back to About</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
