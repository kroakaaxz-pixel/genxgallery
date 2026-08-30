import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../lib/supabase';
import { formatPrice } from '../utils/currency';
import { useHead } from '../hooks/useHead';
import styles from './Account.module.css';

function formatStatus(status) {
  const map = {
    placed: 'Placed',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
}

function statusClass(status) {
  const map = {
    placed: styles.statusPlaced,
    confirmed: styles.statusConfirmed,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled,
  };
  return map[status] || '';
}

export default function AccountOrders() {
  useHead({ title: 'My Orders', description: 'View your order history at Gen X Gallery.' });
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getUserOrders(user.id).then((data) => {
      setOrders(data);
      setFetching(false);
    });
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>Account</p>
          <h1 className={styles.pageTitle}>My Orders</h1>
        </div>

        {fetching ? (
          <p className={styles.loadingText}>Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptyText}>When you place an order, it will show up here.</p>
            <Link to="/catalogue" className={styles.browseBtn}>Browse Collection</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusClass(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {(order.items || []).map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <span className={styles.orderItemName}>{item.name}</span>
                      <span className={styles.orderItemMeta}>
                        {item.options && <span>{item.options}</span>}
                        <span>× {item.quantity}</span>
                      </span>
                      <span className={styles.orderItemPrice}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>Total: {formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
