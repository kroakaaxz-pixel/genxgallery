import { useHead } from '../hooks/useHead';
import styles from './About.module.css';

export default function About() {
  useHead({
    title: 'Our Story',
    description: 'Gen X Gallery started with a simple frustration: why is it so hard to find framed art that doesn\'t look like it came from a hotel lobby? Learn about our mission.',
  });

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Our Story</p>
          <h1 className={styles.heroTitle}>
            Not just frames.<br />A point of view.
          </h1>
        </div>
      </div>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.contentGrid}>
            <div className={styles.textBlock}>
              <h2>We got tired of boring walls.</h2>
              <p>
                Gen X Gallery started with a simple frustration: why is it so hard to find
                framed art that doesn't look like it came from a hotel lobby? We wanted
                automotive prints that actually capture the lines. Anime art that isn't
                just a screenshot. Posters that say something about who you are.
              </p>
              <p>
                So we started making them. Every print in our collection is curated,
                not aggregated. We work with artists, scour archives, and commission
                original work — because your walls deserve better than what an
                algorithm picks for you.
              </p>
            </div>

            <div className={styles.textBlock}>
              <h2>Quality you can see and feel.</h2>
              <p>
                Every frame is built to museum standards. Giclée printing on archival
                paper. Solid wood frames (no MDF, no particle board). Museum-quality
                acrylic glazing that protects without the glare. And everything ships
                ready to hang — no trips to the framer required.
              </p>
              <p>
                We obsess over the details so you don't have to. The mat width, the
                frame profile, the paper weight — it's all been considered. You just
                pick what speaks to you.
              </p>
            </div>
          </div>

          <blockquote className={styles.pullquote}>
            "We wanted to build the kind of store we'd actually want to shop at —
            one that treats pop culture art with the same respect a gallery
            gives to fine art."
          </blockquote>
        </div>
      </section>

      <section className={styles.values}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <p className={styles.valueNumber}>01</p>
              <h3 className={styles.valueTitle}>Curated, Not Algorithmic</h3>
              <p className={styles.valueText}>
                Every print is hand-selected by humans who care about the intersection
                of pop culture and design. No filler, no fluff.
              </p>
            </div>
            <div className={styles.valueCard}>
              <p className={styles.valueNumber}>02</p>
              <h3 className={styles.valueTitle}>Built to Last</h3>
              <p className={styles.valueText}>
                Solid wood frames, archival paper, museum glazing. These aren't
                disposable prints — they're meant to outlast trends.
              </p>
            </div>
            <div className={styles.valueCard}>
              <p className={styles.valueNumber}>03</p>
              <h3 className={styles.valueTitle}>Ready to Hang</h3>
              <p className={styles.valueText}>
                Every order ships assembled, wired, and ready to go on your wall
                the moment it arrives. No framing shop visits required.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
