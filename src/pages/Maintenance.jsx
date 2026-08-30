import styles from './Maintenance.module.css';

export default function Maintenance() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.label}>Gen X Gallery</p>
        <h1 className={styles.title}>
          Back<br />
          <em>soon.</em>
        </h1>
        <p className={styles.description}>
          We&rsquo;re temporarily offline for maintenance. The collection will be
          back better than before — check back shortly.
        </p>
        <div className={styles.divider} />
        <p className={styles.footer}>
          — The Gen X Gallery Team
        </p>
      </div>
    </main>
  );
}
