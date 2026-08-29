import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyCart}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Looks like you haven't found your perfect frame yet.
            </p>
            <Link to="/catalogue" className={`${styles.checkoutBtn}`} style={{ display: 'inline-block', width: 'auto', padding: '14px 32px' }}>
              Browse Collection
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>Your Selection</p>
          <h1 className={styles.pageTitle}>Cart</h1>
        </div>

        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.key} className={styles.cartItem}>
                <img
                  src={item.product.image || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=260&fit=crop'}
                  alt={item.product.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemCategory}>{item.product.category}</span>
                  <h3 className={styles.itemName}>{item.product.name}</h3>
                  <p className={styles.itemDetails}>
                    {item.options.sizeLabel && `${item.options.sizeLabel}`}
                    {item.options.materialName && ` · ${item.options.materialName}`}
                    {item.options.orientationLabel && ` · ${item.options.orientationLabel}`}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemPrice}>
                    ${(item.options.sizePrice || item.product.price) * item.quantity}
                  </p>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal ({items.length} items)</span>
              <span>${totalPrice}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
            <button className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
            <Link to="/catalogue" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
