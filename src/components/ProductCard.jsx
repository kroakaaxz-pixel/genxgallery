import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { frameSizes, getDiscountedPrice } from '../data/products';
import { formatPrice } from '../utils/currency';
import FadeImage from './FadeImage';
import styles from './ProductCard.module.css';

const ProductCard = memo(function ProductCard({ product, className = '' }) {
  const availableSizes = useMemo(
    () => frameSizes.filter((s) => product.sizes?.includes(s.id)),
    [product.sizes]
  );
  const hasDiscount = product.discountPercent > 0;
  const discountedPrice = useMemo(() => getDiscountedPrice(product), [product]);

  return (
    <Link
      to={`/product/${product.id}`}
      className={`${styles.card} ${className}`}
    >
      <div className={styles.imageWrap}>
        <FadeImage
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {hasDiscount && (
          <span className={styles.discountBadge}>-{product.discountPercent}%</span>
        )}
        {product.badge && !hasDiscount && (
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
          {hasDiscount ? (
            <>
              <span className={styles.priceStrikethrough}>{formatPrice(product.price)}</span>{' '}
              <span className={styles.priceAccent}>{formatPrice(discountedPrice)}</span>
            </>
          ) : (
            <>From <span className={styles.priceAccent}>{formatPrice(product.price)}</span></>
          )}
        </p>
      </div>
    </Link>
  );
});

export default ProductCard;
