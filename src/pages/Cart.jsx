import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAddresses, addAddress, insertOrder } from '../lib/supabase';
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

// Razorpay CDN script loader — only loads once per page
let razorpayScriptLoaded = false;
export function ensureRazorpayScript() {
  if (razorpayScriptLoaded) return;
  razorpayScriptLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => {
    // Razorpay global becomes available as Razorpay
    console.log('Razorpay CDN script loaded');
  };
  script.onerror = (err) => {
    console.error('Razorpay CDN script failed to load:', err);
  };
  document.body.appendChild(script);
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
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
  const [saveAddress, setSaveAddress] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [sending, setSending] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [errors, setErrors] = useState({});
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Pre-fill from default saved address when logged in
  useEffect(() => {
    if (!user) return;
    if (user.user_metadata?.full_name && !name) setName(user.user_metadata.full_name);
    if (user.email && !email) setEmail(user.email);
    getAddresses(user.id).then((addrs) => {
      const def = addrs.find((a) => a.is_default) || addrs[0];
      if (def) {
        setHouseNo(def.house_no || '');
        setStreet(def.street || '');
        setLandmark(def.landmark || '');
        setCity(def.city || '');
        setState(def.state || '');
        setPincode(def.pincode || '');
        setPhone(def.phone || '');
      }
    });
  }, [user]);

  useEffect(() => {
    // Ensure Razorpay CDN script is loaded once
    ensureRazorpayScript();
    setRazorpayReady(true);
  }, []);

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
    setCheckoutError('');

    const id = `GXG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const address = buildAddress();

    // 1. Persist the order to Supabase (status: 'placed')
    try {
      const orderItems = items.map((item) => ({
        name: item.product?.name || item.name,
        options: [item.options?.sizeLabel, item.options?.materialName, item.options?.textureName].filter(Boolean).join(' · '),
        quantity: item.quantity,
        price: (item.options?.sizePrice || item.product?.price || 0) * item.quantity,
      }));
      await insertOrder({
        id,
        user_id: user?.id || null,
        email: email.trim(),
        items: orderItems,
        address,
        subtotal: totalPrice,
        total: totalPrice,
        status: 'placed',
      });
    } catch (err) {
      console.error('Order insert failed:', err);
      setCheckoutError('We could not place your order just now. Please try again in a moment.');
      setSending(false);
      return;
    }

    // 2. Create a Razorpay order (server-side, uses Key Secret)
    try {
      const razorRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const razorData = await razorRes.json();
      if (!razorData.id) {
        throw new Error('Razorpay order creation failed');
      }

      // 3. Open Razorpay Checkout modal
      // @ts-ignore — Razorpay global injected by CDN
      window.Razorpay = window.Razorpay || require('razorpay');

      // Handler called when user completes/cancels payment
      const handleRazorpayResponse = async (response) => {
        // response contains razorpay_payment_id and razorpay_signature
        // Verify the payment signature server-side
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: razorData.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.valid) {
          // Payment verified — update order status to 'paid' in Supabase
          try {
            await supabase?.from('orders').update({ status: 'paid', razorpay_order_id: razorData.id, razorpay_payment_id: response.razorpay_payment_id }).eq('id', id);
            // Send confirmation email (best-effort, non-blocking)
            const emailRes = await fetch('/api/send-order-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email.trim(),
                name: name.trim(),
                items,
                totalPrice,
                orderId: id,
              }),
            });
            const emailData = await emailRes.json();
            if (!emailData.sent) {
              console.warn('Order confirmation email was not sent:', emailData.reason);
            }
            clearCart();
            setOrderPlaced(true);
            setOrderId(id);
          } catch (supaErr) {
            console.error('Supabase update failed after payment verify:', supaErr);
            // Payment was valid but we couldn't update DB — show alert
            alert('Payment successful, but we could not update your order. Please contact support with order ID: ' + id);
          }
        } else {
          // Signature invalid — do not mark as paid
          setCheckoutError('Payment verification failed. The payment may have been declined. Please try again.');
        }
      };

      const rzp = new (window.Razorpay || {})({
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorData.amount,
        currency: razorData.currency,
        name: 'Gen X Gallery',
        description: 'Custom Frame Order',
        order_id: razorData.id,
        handler: handleRazorpayResponse,
        prefill: { name, email, contact: phone },
        theme: { color: '#C23B22' },
        modal: {
          ondismiss: () => {
            // User closed the modal without paying
            setCheckoutError('Payment was cancelled. Your order has not been placed.');

            // Do NOT update order status — keep it as 'placed' so it can be retryed
          },
        },
      });

      rzp.open();
    } catch (razorpayErr) {
      console.error('Razorpay checkout failed:', razorpayErr);
      setCheckoutError('Could not start Razorpay checkout. Please try again later.');
    } finally {
      setSending(false);
    }
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
              {user && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-ink-light)', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }}
                  />
                  Save this address for future orders
                </label>
              )}

              {/* Razorpay payment section — shown only when Razorpay is ready */}
              {razorpayReady && !orderPlaced && (
                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-cream-dark)', borderRadius: '2px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '8px' }}>
                    Pay securely via Razorpay
                  </p>
                  <button
                    className={styles.checkoutBtn}
                    onClick={handleCheckout}
                    disabled={sending}
                    style={{ opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
                  >
                    {sending ? 'Processing Payment…' : 'Place Order — Pay ₹' + totalPrice.toLocaleString('en-IN')}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '8px' }}>
                    Free shipping on orders above ₹999 · <Link to="/returns" style={{ color: 'var(--color-accent-text)' }}>Free returns within 7 days</Link>
                  </p>
                </div>
              )}
            </div>
            <Link to="/catalogue" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}