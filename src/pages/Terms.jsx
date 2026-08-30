import { Link } from 'react-router-dom';
import { useHead } from '../hooks/useHead';
import styles from './Legal.module.css';

export default function Terms() {
  useHead({
    title: 'Terms & Conditions',
    description: 'Terms of service for Gen X Gallery. Order policies, pricing, intellectual property, and liability limitations.',
  });

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Legal</p>
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.heroDate}>Last updated: August 2026</p>
        </div>
      </div>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.body}>
            {/* PLACEHOLDER: This is template terms language. Have it reviewed by someone
                with legal knowledge before launch. */}

            <h2>Order Acceptance</h2>
            <p>
              All orders placed on Gen X Gallery are subject to acceptance. We reserve the right
              to refuse or cancel any order for any reason, including limitations on quantities
              available, inaccuracies in product or pricing information, or errors identified by
              our fraud detection systems.
            </p>
            <p>
              You will receive an email confirmation once your order has been accepted and
              processed. This confirmation does not guarantee fulfillment — we may need to
              contact you if there are issues with your order.
            </p>

            <h2>Pricing &amp; Currency</h2>
            <p>
              All prices are displayed in <strong>Indian Rupees (INR/₹)</strong> and are inclusive
              of applicable taxes unless stated otherwise. We reserve the right to change prices
              at any time without prior notice. In the event of a pricing error on a product you
              have ordered, we will contact you before processing the order.
            </p>

            <h2>Custom &amp; Personalized Orders</h2>
            <p>
              Orders involving custom framing or uploaded personal photographs are produced to your
              specifications. As noted in our <Link to="/returns">Returns &amp; Refunds policy</Link>,
              custom/personalized orders are <strong>final sale</strong> and cannot be returned or
              refunded except in cases of manufacturing defect or shipping damage.
            </p>
            <p>
              By uploading a photo for custom framing, you confirm that you own the rights to that
              image or have permission from the rights holder. Gen X Gallery is not responsible for
              any intellectual property claims arising from customer-uploaded content.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website — including but not limited to logos, brand names,
              product descriptions, photography, and design elements — is the property of
              Gen X Gallery and is protected by applicable intellectual property laws.
              You may not reproduce, distribute, or create derivative works without our
              written consent.
            </p>
            <p>
              Customer-uploaded photos remain the property of the customer. We use them solely
              to fulfill your custom order and do not share them with third parties or use them
              for marketing without explicit permission.
            </p>

            <h2>Shipping &amp; Delivery</h2>
            <p>
              Delivery timeframes are estimates and not guarantees. Please refer to our{' '}
              <Link to="/shipping">Shipping Policy</Link> for detailed information on
              estimated delivery times, shipping regions, and custom order processing.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Gen X Gallery shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising out of
              your use of or inability to use our products or services. Our total liability for
              any claim shall not exceed the amount you paid for the specific product in question.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of the courts in
              your state of residence.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the site after changes are posted
              constitutes acceptance of the modified terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us at{' '}
              <strong>privacy@genxgallery.in</strong>
            </p>

            <div className={styles.note}>
              <p>
                <strong>Note:</strong> This is template terms and conditions language.
                It should be reviewed by someone with legal knowledge before going live.
                Ensure these terms don't contradict your Shipping/Returns policies.
              </p>
            </div>

            <Link to="/about" className={styles.backLink}>← Back to About</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
