import { useState, useEffect, useNavigate } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getProductById, frameSizes, frameMaterials, posterSizes, getSizePrice, getPosterSizePrice, getDiscountedSizePrice, getDiscountedPrice, getReviewsForProduct } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { useHead } from '../hooks/useHead';
import ProductCarousel from '../components/ProductCarousel';
import { supabase, fetchProductById } from '../lib/supabase';
import styles from './ProductDetail.module.css';

const RECENTLY_VIEWED_KEY = 'gxg_recently_viewed';
const MAX_RECENT = 6;

function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch { return []; }
}

function addRecentlyViewed(productId) {
  const current = getRecentlyViewed().filter((id) => id !== productId);
  current.unshift(productId);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(current.slice(0, MAX_RECENT)));
}

function StarRating({ rating, count }) {
  return (
    <div className={styles.starRating}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= Math.round(rating) ? styles.starFilled : ''}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className={styles.ratingText}>{rating}</span>
      <span className={styles.reviewCount}>({count} reviews)</span>
    </div>
  );
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [dbProduct, setDbProduct] = useState(null);
  const [dbChecked, setDbChecked] = useState(false);
  const staticProduct = getProductById(id);
  const product = dbChecked ? dbProduct : (dbProduct || staticProduct);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchProductById(Number(id))
      .then((data) => {
        if (!cancelled) {
          setDbProduct(data);
          setDbChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) setDbChecked(true);
      });
    return () => { cancelled = true; };
  }, [id]);

  const isFramed = product?.category === 'framed-posters';
  const sizes = isFramed ? frameSizes : posterSizes;
  const getSizeFn = isFramed ? getSizePrice : getPosterSizePrice;

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'a4');
  const [selectedMaterial, setSelectedMaterial] = useState('black');

  // Track recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product]);

  // SEO
  useHead(
    product
      ? {
          title: product.name,
          description: product.description,
          image: product.image,
          type: 'product',
        }
      : {}
  );

  // Recently viewed (excluding current product)
  const recentlyViewed = getRecentlyViewed()
    .filter((vid) => vid !== product?.id)
    .map((vid) => getProductById(vid))
    .filter(Boolean);

  // Review data from centralized store
  const reviewData = product ? getReviewsForProduct(product.id) : null;

  if (!product) return <Navigate to="/404" replace />;

  const availableSizes = sizes.filter((s) => product.sizes?.includes(s.id));
  const hasDiscount = product.discountPercent > 0;
  const currentPrice = isFramed
    ? getDiscountedSizePrice(product, selectedSize)
    : Math.round(getPosterSizePrice(selectedSize) * (1 - (product.discountPercent || 0) / 100));
  const originalPrice = getSizeFn(selectedSize);

  const handleAddToCart = () => {
    const size = sizes.find((s) => s.id === selectedSize);
    const material = isFramed ? frameMaterials.find((m) => m.id === selectedMaterial) : null;
    addItem(product, {
      size: selectedSize,
      sizeLabel: size?.label,
      sizePrice: currentPrice,
      ...(isFramed && {
        material: selectedMaterial,
        materialName: material?.name,
      }),
    });
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/catalogue">Shop</Link>
          <span>/</span>
          <Link to={`/${product.category}`}>
            {product.category === 'framed-posters' ? 'Framed Posters' : 'Posters'}
          </Link>
          <span>/</span>
          <Link to={`/${product.category}/${product.subCategory}`}>
            {product.subCategory.charAt(0).toUpperCase() + product.subCategory.slice(1)}
          </Link>
          <span>/</span>
          {product.name}
        </nav>

        <div className={styles.productGrid}>
          <div className={styles.imageSection}>
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            <img
              src={product.image}
              alt={product.name}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.infoSection}>
            <p className={styles.productCategory}>
              {product.subCategory.charAt(0).toUpperCase() + product.subCategory.slice(1)}
              {!isFramed && <span className={styles.unframedTag}>Unframed</span>}
            </p>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>
              {hasDiscount ? (
                <>
                  <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '1rem', fontWeight: 400, marginRight: '8px' }}>
                    {formatPrice(originalPrice)}
                  </span>
                  <span>{formatPrice(currentPrice)}</span>
                  <span style={{ fontSize: '0.8rem', marginLeft: '6px' }}>-{product.discountPercent}%</span>
                </>
              ) : (
                formatPrice(currentPrice)
              )}
            </p>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Size</p>
              <div className={styles.sizeOptions}>
                {availableSizes.map((size) => {
                  const sizePrice = isFramed
                    ? getDiscountedSizePrice(product, size.id)
                    : Math.round(size.price * (1 - (product.discountPercent || 0) / 100));
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`${styles.sizeBtn} ${selectedSize === size.id ? styles.sizeBtnActive : ''}`}
                    >
                      {size.label}
                      <span className={styles.sizeBtnPrice}>
                        {hasDiscount ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>{formatPrice(size.price)}</span>
                            {' '}{formatPrice(sizePrice)}
                          </>
                        ) : (
                          formatPrice(size.price)
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isFramed && (
              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Frame</p>
                <div className={styles.materialOptions}>
                  {frameMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`${styles.materialBtn} ${selectedMaterial === mat.id ? styles.materialBtnActive : ''}`}
                      style={{ backgroundColor: mat.hex }}
                      title={mat.name}
                      aria-label={`Frame: ${mat.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                Add to Cart — {formatPrice(currentPrice)}
              </button>
              {isFramed && (
                <button
                  onClick={() => {
                    navigate(
                      '/customize?image=' +
                        encodeURIComponent(product.image || '') +
                        '&id=' +
                        encodeURIComponent(product.id)
                    );
                  }}
                  className={styles.customizeBtn}
                >
                    Customize
                  </button>
              )}
            </div>

            <button
              onClick={() => toggle(product.id)}
              className={`${styles.wishlistBtn} ${has(product.id) ? styles.wishlistBtnActive : ''}`}
            >
              <svg viewBox="0 0 24 24" fill={has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {has(product.id) ? 'Saved for later' : 'Save for later'}
            </button>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Print</span>
                <span className={styles.detailValue}>Giclée on archival paper</span>
              </div>
              {isFramed ? (
                <>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Frame</span>
                    <span className={styles.detailValue}>{frameMaterials.find((m) => m.id === selectedMaterial)?.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Glass</span>
                    <span className={styles.detailValue}>Museum-quality acrylic</span>
                  </div>
                </>
              ) : (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Type</span>
                  <span className={styles.detailValue}>Unframed print</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Shipping</span>
                <span className={styles.detailValue}>{isFramed ? 'Ready to hang, ships in 3–5 days' : 'Ships in a protective tube, 3–5 days'}</span>
              </div>
            </div>

            {reviewData && reviewData.reviews.length > 0 && (
              <div className={styles.reviewsSection}>
                <div className={styles.reviewsHeader}>
                  <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
                  <StarRating rating={reviewData.rating} count={reviewData.reviewCount} />
                </div>
                <div className={styles.reviewsList}>
                  {reviewData.reviews.map((review, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <span className={styles.reviewName}>{review.name}</span>
                        <span className={styles.reviewDate}>{timeAgo(review.date)}</span>
                      </div>
                      <div className={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`${styles.star} ${s <= review.rating ? styles.starFilled : ''}`}>★</span>
                        ))}
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div className={styles.recentlyViewed}>
            <h2 className={styles.recentlyViewedTitle}>Recently Viewed</h2>
            <ProductCarousel products={recentlyViewed} />
          </div>
        )}
      </div>
    </main>
  );
}
