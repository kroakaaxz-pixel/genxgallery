import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.errorNumber}>404</p>
      <p className={styles.label}>Page Not Found</p>
      <h1 className={styles.title}>This page doesn't exist.</h1>
      <p className={styles.text}>
        The frame you're looking for might have been moved, or maybe it never
        existed. Either way, we've got plenty of good ones in the collection.
      </p>
      <Link to="/" className={styles.homeLink}>
        Back to Gallery
      </Link>
    </main>
  );
}
