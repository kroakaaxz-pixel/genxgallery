import { Link } from 'react-router-dom';
import { frameSizes } from '../data/products';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, className = '' }) {
  const availableSizes = frameSizes.filter((s) => product.sizes?.includes(s.id));

  return (
    <Link
      to={`/product/${product.id}`}
      className={`${styles.card} ${className}`}
    >
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        <div className={styles.overlay}>
          <div className={styles.hoverInfo}>
            <div className={styles.sizeOptions}>
              {availableSizes.map((size) => (
                <span key={size.id} className={styles.sizeChip}>
                  {size.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>
          From <span className={styles.priceAccent}>${product.price}</span>
        </p>
      </div>
    </Link>
  );
}
