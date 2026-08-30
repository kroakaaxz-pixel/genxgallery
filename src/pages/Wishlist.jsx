import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../data/products';
import { useHead } from '../hooks/useHead';
import ProductCard from '../components/ProductCard';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  useHead({ title: 'Wishlist', description: 'Your saved items at Gen X Gallery.' });
  const { ids } = useWishlist();

  const products = useMemo(
    () => ids.map((id) => getProductById(id)).filter(Boolean),
    [ids]
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>Your Collection</p>
          <h1 className={styles.pageTitle}>Wishlist</h1>
        </div>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className={styles.emptyTitle}>Nothing saved yet</h2>
            <p className={styles.emptyText}>
              Browse the collection and tap the heart on anything you love.
            </p>
            <Link
              to="/catalogue"
              className={styles.browseBtn}
            >
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
