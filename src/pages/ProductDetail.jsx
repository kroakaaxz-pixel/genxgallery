import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getProductById, frameSizes, frameMaterials, getSizePrice, getDiscountedSizePrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'a4');
  const [selectedMaterial, setSelectedMaterial] = useState('black');

  if (!product) return <Navigate to="/404" replace />;

  const availableSizes = frameSizes.filter((s) => product.sizes?.includes(s.id));
  const hasDiscount = product.discountPercent > 0;
  const currentPrice = getDiscountedSizePrice(product, selectedSize);
  const originalPrice = getSizePrice(selectedSize);

  const handleAddToCart = () => {
    const size = frameSizes.find((s) => s.id === selectedSize);
    const material = frameMaterials.find((m) => m.id === selectedMaterial);
    addItem(product, {
      size: selectedSize,
      sizeLabel: size?.label,
      sizePrice: currentPrice,
      material: selectedMaterial,
      materialName: material?.name,
    });
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/catalogue">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
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
            <p className={styles.productCategory}>{product.category}</p>
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
                  const sizeDiscounted = getDiscountedSizePrice(product, size.id);
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
                            {' '}{formatPrice(sizeDiscounted)}
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

            <div className={styles.actions}>
              <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                Add to Cart — {formatPrice(currentPrice)}
              </button>
              <Link to="/customize" className={styles.customizeBtn}>
                Customize
              </Link>
            </div>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Print</span>
                <span className={styles.detailValue}>Giclée on archival paper</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Frame</span>
                <span className={styles.detailValue}>{frameMaterials.find((m) => m.id === selectedMaterial)?.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Glass</span>
                <span className={styles.detailValue}>Museum-quality acrylic</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Shipping</span>
                <span className={styles.detailValue}>Ready to hang, ships in 3–5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
