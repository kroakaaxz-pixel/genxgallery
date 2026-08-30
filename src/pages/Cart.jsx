import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, gstBreakdown } from '../utils/currency';
import { calculateShipping } from '../utils/shipping';
import { useHead } from '../hooks/useHead';
import styles from './Cart.module.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '0.9rem',
  border: '1.5px solid var(--color-border)',
  borderRadius: '2px',
  background: 'white',
  color: 'var(--color-ink)',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-muted)',
  marginBottom: '6px',
};

const errorStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-accent)',
  marginTop: '4px',
};

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
      </label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  useHead({ title: 'Cart', description: 'Your shopping cart at Gen X Gallery.' });

  const { gstAmount } = gstBreakdown(totalPrice);
  const shipping = calculateShipping(totalPrice);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter a valid 10-digit phone number';
    if (!houseNo.trim()) e.houseNo = 'House/Flat/Building is required';
    if (!street.trim()) e.street = 'Street address is required';
    if (!city.trim()) e.city = 'City is required';
    if (!state) e.state = 'State is required';
    if (!pincode.trim()) e.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildAddress = () => ({
    houseNo: houseNo.trim(),
    street: street.trim(),
    landmark: landmark.trim() || null,
    city: city.trim(),
    state,
    pincode: pincode.trim(),
    phone: phone.trim(),
  });

  const handleCheckout = async () => {
    if (!validate() || sending) return;

    setSending(true);
    const id = `GXG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setOrderId(id);
    const address = buildAddress();

    try {
      const res = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          items,
          totalPrice,
          orderId: id,
          shippingAddress: address,
        }),
      });
      const data = await res.json();
      if (!data.sent) {
        console.warn('Order confirmation email was not sent:', data.reason);
      }
    } catch (err) {
      console.warn('Failed to send order confirmation email:', err);
    }

    clearCart();
    setOrderPlaced(true);
    setSending(false);
  };

  if (orderPlaced) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyCart}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h2 className={styles.emptyTitle}>Order Placed</h2>
            <p className={styles.emptyText}>
              Thank you for your order. A confirmation has been sent to {email}.
              <br />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                Order ID: <strong style={{ color: 'var(--color-ink)' }}>{orderId}</strong>
              </span>
            </p>
            <Link to="/catalogue" className={`${styles.checkoutBtn}`} style={{ display: 'inline-block', width: 'auto', padding: '14px 32px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
                    {item.options.textureName && ` · ${item.options.textureName}`}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemPrice}>
                    {formatPrice((item.options.sizePrice || item.product.price) * item.quantity)}
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
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Includes GST (18%)</span>
              <span>{formatPrice(gstAmount)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping.label}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <p className={styles.taxNote}>Inclusive of all taxes</p>

            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Contact */}
              <FormField label="Full Name" required error={errors.name}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </FormField>
              <FormField label="Email" required error={errors.email}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </FormField>
              <FormField label="Phone Number" required error={errors.phone}>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" maxLength={10} style={inputStyle} />
              </FormField>

              {/* Address */}
              <FormField label="House / Flat / Building No." required error={errors.houseNo}>
                <input type="text" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="e.g. 42, Sunrise Apartments" style={inputStyle} />
              </FormField>
              <FormField label="Street Address / Area" required error={errors.street}>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="e.g. MG Road, Koramangala" style={inputStyle} />
              </FormField>
              <FormField label="Landmark" error={errors.landmark}>
                <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near XYZ Mall (optional)" style={inputStyle} />
              </FormField>

              {/* City / State / Pincode row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField label="City" required error={errors.city}>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={inputStyle} />
                </FormField>
                <FormField label="Pincode" required error={errors.pincode}>
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" maxLength={6} style={inputStyle} />
                </FormField>
              </div>
              <FormField label="State" required error={errors.state}>
                <select value={state} onChange={(e) => setState(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', color: state ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={sending}
              style={{ opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
            >
              {sending ? 'Placing Order…' : 'Place Order'}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', textAlign: 'center', marginTop: '12px' }}>
              Free shipping on orders above ₹999 · <Link to="/returns" style={{ color: 'var(--color-accent-text)' }}>Free returns within 7 days</Link>
            </p>
            <Link to="/catalogue" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
