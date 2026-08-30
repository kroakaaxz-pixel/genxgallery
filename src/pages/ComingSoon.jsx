import { useState } from 'react';
import styles from './ComingSoon.module.css';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Coming soon signup:', email);
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.label}>Est. 2026 — Gen X Gallery</p>
        <h1 className={styles.title}>
          Something&rsquo;s<br />
          <em>coming.</em>
        </h1>
        <p className={styles.description}>
          We&rsquo;re putting the finishing touches on a curated collection of
          framed prints, posters, and wall art that&rsquo;s worth your wall space.
          Stay tuned.
        </p>

        {submitted ? (
          <p className={styles.thanks}>
            We&rsquo;ll be in touch. Thanks for your interest.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.btn}>
              Notify Me
            </button>
          </form>
        )}

        <p className={styles.footer}>
          — The Gen X Gallery Team
        </p>
      </div>
    </main>
  );
}
