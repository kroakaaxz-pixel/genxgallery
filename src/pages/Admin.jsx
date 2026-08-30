import { useState, useEffect } from 'react';
import { products as initialProducts, categories, productStatuses, frameSizes, getDiscountedPrice } from '../data/products';
import { initialOrders, orderStatuses, computeAnalytics } from '../data/orders';
import { ADMIN_PASSWORD } from '../config/admin';
import { formatPrice } from '../utils/currency';
import styles from './Admin.module.css';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';

const STORAGE_KEY = 'gxg_admin_auth';
const PRODUCTS_KEY = 'gxg_admin_products';
const ORDERS_KEY = 'gxg_admin_orders';

function getStoredAuth() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getStoredProducts() {
  try {
    const stored = sessionStorage.getItem(PRODUCTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function getStoredOrders() {
  try {
    const stored = sessionStorage.getItem(ORDERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function storeProducts(prods) {
  try {
    sessionStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
  } catch { /* ignore */ }
}

function storeOrders(orders) {
  try {
    sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch { /* ignore */ }
}

const emptyProduct = {
  name: '',
  category: 'cars',
  description: '',
  price: 0,
  discountPercent: 0,
  sizes: ['a5', 'a4'],
  image: '',
  badge: '',
  naturalRatio: 0.75,
  status: 'Active',
  isNewArrival: false,
  isSpecialDeal: false,
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(getStoredAuth);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [products, setProducts] = useState(() => getStoredProducts() ?? initialProducts);
  const [orders, setOrders] = useState(() => getStoredOrders() ?? initialOrders);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ ...emptyProduct });
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  // Orders state
  const [orderFilter, setOrderFilter] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderEditForm, setOrderEditForm] = useState(null);

  // Persist to session storage
  useEffect(() => { storeProducts(products); }, [products]);
  useEffect(() => { storeOrders(orders); }, [orders]);

  const analytics = computeAnalytics(orders);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // ─── Product handlers ───
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ ...emptyProduct, id: Date.now() });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ ...emptyProduct });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p)));
    } else {
      setProducts((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) handleCancel();
    }
  };

  const handleStatusToggle = (id, newStatus) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (sizeId) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(sizeId)
        ? prev.sizes.filter((s) => s !== sizeId)
        : [...prev.sizes, sizeId];
      return { ...prev, sizes };
    });
  };

  // ─── Order handlers ───
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const updated = { ...o, status: newStatus };
      if (newStatus === 'Delivered' && !o.deliveredDate) {
        updated.deliveredDate = new Date().toISOString().split('T')[0];
      }
      return updated;
    }));
    if (viewingOrder?.id === orderId) {
      setViewingOrder((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, status: newStatus };
        if (newStatus === 'Delivered' && !prev.deliveredDate) {
          updated.deliveredDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      });
    }
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setEditingOrder(null);
    setOrderEditForm(null);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order.id);
    setOrderEditForm({ ...order, items: order.items.map((item) => ({ ...item })) });
    setViewingOrder(null);
  };

  const handleOrderFieldChange = (field, value) => {
    setOrderEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderAddressChange = (field, value) => {
    setOrderEditForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleOrderItemChange = (index, field, value) => {
    setOrderEditForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      // Recalculate unit price if size/texture changed
      if (field === 'size') {
        const sizePrice = field === 'size'
          ? frameSizes.find((s) => s.id === value)?.price || items[index].unitPrice
          : items[index].unitPrice;
        const textureUpcharge = items[index].texture === 'glossy' ? 200 : 0;
        items[index].unitPrice = sizePrice + textureUpcharge;
      }
      if (field === 'texture') {
        const basePrice = frameSizes.find((s) => s.id === items[index].size)?.price || 0;
        const textureUpcharge = value === 'glossy' ? 200 : 0;
        items[index].unitPrice = basePrice + textureUpcharge;
      }
      if (field === 'quantity') {
        items[index].quantity = Math.max(1, Number(value));
      }
      const newTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      return { ...prev, items, total: newTotal };
    });
  };

  const handleRemoveOrderItem = (index) => {
    setOrderEditForm((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      const newTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      return { ...prev, items, total: newTotal };
    });
  };

  const handleSaveOrder = () => {
    if (!orderEditForm) return;
    setOrders((prev) => prev.map((o) => (o.id === orderEditForm.id ? orderEditForm : o)));
    setEditingOrder(null);
    setOrderEditForm(null);
  };

  const handleCancelOrderEdit = () => {
    setEditingOrder(null);
    setOrderEditForm(null);
  };

  // Login screen
  if (!authenticated) {
    return (
      <main className={styles.page}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>Admin Panel</h1>
            <p className={styles.loginSubtitle}>Gen X Gallery — Store Management</p>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={styles.loginInput}
                autoFocus
              />
              {passwordError && <p className={styles.loginError}>{passwordError}</p>}
              <button type="submit" className={styles.loginBtn}>Sign In</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const filteredProducts = filterStatus === 'all'
    ? products
    : products.filter((p) => p.status === filterStatus);

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === orderFilter);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Gen X Gallery — Store Management</p>
          </div>
          <div className={styles.headerActions}>
            {activeTab === 'products' && (
              <button onClick={handleAddNew} className={styles.addBtn}>+ Add Product</button>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
          </div>
        </div>

        {/* Tab bar */}
        <div className={styles.tabBar}>
          <button
            onClick={() => setActiveTab('products')}
            className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.tabActive : ''}`}
          >
            Analytics
          </button>
        </div>

        {/* ═══════════ PRODUCTS TAB ═══════════ */}
        {activeTab === 'products' && (
          <>
            <div className={styles.filterBar}>
              {['all', ...productStatuses].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`${styles.filterBtn} ${filterStatus === status ? styles.filterBtnActive : ''}`}
                >
                  {status === 'all' ? 'All' : status}
                  <span className={styles.filterCount}>
                    {status === 'all' ? products.length : products.filter((p) => p.status === status).length}
                  </span>
                </button>
              ))}
            </div>

            {(showAddForm || editingId) && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>Name</label>
                    <input value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Category</label>
                    <select value={formData.category} onChange={(e) => handleFieldChange('category', e.target.value)} className={styles.input}>
                      {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>Price (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => handleFieldChange('price', Number(e.target.value))} className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Discount %</label>
                    <input type="number" min="0" max="90" value={formData.discountPercent || 0} onChange={(e) => handleFieldChange('discountPercent', Number(e.target.value))} className={styles.input} placeholder="0" />
                  </div>
                  <div className={styles.formField}>
                    <label>Status</label>
                    <select value={formData.status} onChange={(e) => handleFieldChange('status', e.target.value)} className={styles.input}>
                      {productStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label>Showcase Tags</label>
                    <div className={styles.sizeCheckboxes}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" checked={formData.isNewArrival || false} onChange={() => handleFieldChange('isNewArrival', !formData.isNewArrival)} />
                        New Arrival
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" checked={formData.isSpecialDeal || false} onChange={() => handleFieldChange('isSpecialDeal', !formData.isSpecialDeal)} />
                        Special Deal
                      </label>
                    </div>
                  </div>
                  <div className={styles.formField}>
                    <label>Image URL</label>
                    <input value={formData.image} onChange={(e) => handleFieldChange('image', e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.formField}>
                    <label>Badge (optional)</label>
                    <input value={formData.badge || ''} onChange={(e) => handleFieldChange('badge', e.target.value)} className={styles.input} placeholder="e.g. New, Limited" />
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label>Description</label>
                    <textarea value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} className={styles.input} rows={3} />
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label>Available Sizes</label>
                    <div className={styles.sizeCheckboxes}>
                      {frameSizes.map((size) => (
                        <label key={size.id} className={styles.checkboxLabel}>
                          <input type="checkbox" checked={formData.sizes.includes(size.id)} onChange={() => handleSizeToggle(size.id)} />
                          {size.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                  <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            )}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thImage}>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className={styles.thActions}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className={styles.row}>
                      <td><img src={product.image} alt={product.name} className={styles.tableImage} /></td>
                      <td className={styles.cellName}>
                        {product.name}
                        {product.badge && <span className={styles.tableBadge}>{product.badge}</span>}
                        {product.isNewArrival && <span className={styles.tableTagNew}>New Arrival</span>}
                        {product.isSpecialDeal && <span className={styles.tableTagDeal}>Special Deal</span>}
                      </td>
                      <td className={styles.cellCategory}>{product.category}</td>
                      <td className={styles.cellPrice}>
                        {product.discountPercent > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '6px' }}>{formatPrice(product.price)}</span>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{formatPrice(getDiscountedPrice(product))}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginLeft: '4px' }}>-{product.discountPercent}%</span>
                          </>
                        ) : formatPrice(product.price)}
                      </td>
                      <td>
                        <select value={product.status} onChange={(e) => handleStatusToggle(product.id, e.target.value)} className={`${styles.statusSelect} ${styles[`status${product.status.replace(/\s/g, '')}`]}`}>
                          {productStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </td>
                      <td className={styles.cellActions}>
                        <button onClick={() => handleEdit(product)} className={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={6} className={styles.emptyRow}>No products match this filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══════════ ORDERS TAB ═══════════ */}
        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            {/* Status filter */}
            <div className={styles.filterBar}>
              {['all', ...orderStatuses].map((status) => (
                <button
                  key={status}
                  onClick={() => { setOrderFilter(status); setViewingOrder(null); setEditingOrder(null); }}
                  className={`${styles.filterBtn} ${orderFilter === status ? styles.filterBtnActive : ''}`}
                >
                  {status === 'all' ? 'All' : status}
                  <span className={styles.filterCount}>
                    {status === 'all' ? orders.length : orders.filter((o) => o.status === status).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Order detail / edit view */}
            {(viewingOrder || editingOrder) && (() => {
              const order = editingOrder ? orderEditForm : viewingOrder;
              if (!order) return null;
              const isEditing = editingOrder === order.id;
              return (
                <div className={styles.orderDetail}>
                  <div className={styles.orderDetailHeader}>
                    <h2 className={styles.orderDetailTitle}>
                      {isEditing ? `Edit ${order.id}` : `Order ${order.id}`}
                    </h2>
                    <div className={styles.orderDetailActions}>
                      {isEditing ? (
                        <>
                          <button onClick={handleSaveOrder} className={styles.saveBtn}>Save Changes</button>
                          <button onClick={handleCancelOrderEdit} className={styles.cancelBtn}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditOrder(order)} className={styles.editBtn}>Edit Order</button>
                          <button onClick={() => setViewingOrder(null)} className={styles.cancelBtn}>Close</button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className={styles.orderDetailGrid}>
                    {/* Customer info */}
                    <div className={styles.orderDetailCard}>
                      <h3 className={styles.orderDetailCardTitle}>Customer</h3>
                      {isEditing ? (
                        <div className={styles.orderEditFields}>
                          <div className={styles.formField}>
                            <label>Name</label>
                            <input value={order.customerName} onChange={(e) => handleOrderFieldChange('customerName', e.target.value)} className={styles.input} />
                          </div>
                          <div className={styles.formField}>
                            <label>Email</label>
                            <input value={order.email} onChange={(e) => handleOrderFieldChange('email', e.target.value)} className={styles.input} />
                          </div>
                          <div className={styles.formField}>
                            <label>Phone</label>
                            <input value={order.phone} onChange={(e) => handleOrderFieldChange('phone', e.target.value)} className={styles.input} />
                          </div>
                        </div>
                      ) : (
                        <div className={styles.orderInfoList}>
                          <p><strong>{order.customerName}</strong></p>
                          <p>{order.email}</p>
                          <p>{order.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className={styles.orderDetailCard}>
                      <h3 className={styles.orderDetailCardTitle}>Delivery Address</h3>
                      {isEditing ? (
                        <div className={styles.orderEditFields}>
                          <div className={styles.formField}>
                            <label>Street</label>
                            <input value={order.address.street} onChange={(e) => handleOrderAddressChange('street', e.target.value)} className={styles.input} />
                          </div>
                          <div className={styles.formField}>
                            <label>City</label>
                            <input value={order.address.city} onChange={(e) => handleOrderAddressChange('city', e.target.value)} className={styles.input} />
                          </div>
                          <div className={styles.formField}>
                            <label>Pincode</label>
                            <input value={order.address.pincode} onChange={(e) => handleOrderAddressChange('pincode', e.target.value)} className={styles.input} />
                          </div>
                        </div>
                      ) : (
                        <div className={styles.orderInfoList}>
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                        </div>
                      )}
                    </div>

                    {/* Status & Dates */}
                    <div className={styles.orderDetailCard}>
                      <h3 className={styles.orderDetailCardTitle}>Status</h3>
                      <div className={styles.orderInfoList}>
                        <div className={styles.formField}>
                          <label>Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className={`${styles.statusSelect} ${styles[`status${order.status.replace(/\s/g, '')}`]}`}
                            disabled={isEditing}
                          >
                            {orderStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                          </select>
                        </div>
                        <p>Placed: <strong>{order.date}</strong></p>
                        {order.deliveredDate && <p>Delivered: <strong>{order.deliveredDate}</strong></p>}
                        {order.notes && <p className={styles.orderNotes}>Note: {order.notes}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className={styles.orderDetailCard} style={{ marginTop: 'var(--space-lg)' }}>
                    <h3 className={styles.orderDetailCardTitle}>Items</h3>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Frame</th>
                            <th>Finish</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                            {isEditing && <th></th>}
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx} className={styles.row}>
                              <td className={styles.cellName}>{item.productName}</td>
                              <td>
                                {isEditing ? (
                                  <select value={item.size} onChange={(e) => handleOrderItemChange(idx, 'size', e.target.value)} className={styles.statusSelect}>
                                    {frameSizes.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                                  </select>
                                ) : item.sizeLabel}
                              </td>
                              <td>
                                {isEditing ? (
                                  <select value={item.material} onChange={(e) => handleOrderItemChange(idx, 'material', e.target.value)} className={styles.statusSelect}>
                                    <option value="black">Black</option>
                                    <option value="white">White</option>
                                    <option value="silver">Silver</option>
                                  </select>
                                ) : item.materialName}
                              </td>
                              <td>
                                {isEditing ? (
                                  <select value={item.texture} onChange={(e) => handleOrderItemChange(idx, 'texture', e.target.value)} className={styles.statusSelect}>
                                    <option value="matte">Matte</option>
                                    <option value="glossy">Glossy</option>
                                  </select>
                                ) : item.textureName}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input type="number" min="1" value={item.quantity} onChange={(e) => handleOrderItemChange(idx, 'quantity', e.target.value)} className={styles.statusSelect} style={{ width: '50px' }} />
                                ) : item.quantity}
                              </td>
                              <td>{formatPrice(item.unitPrice)}</td>
                              <td className={styles.cellPrice}>{formatPrice(item.unitPrice * item.quantity)}</td>
                              {isEditing && (
                                <td>
                                  <button onClick={() => handleRemoveOrderItem(idx)} className={styles.deleteBtn}>Remove</button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.orderTotalRow}>
                      <span>Total</span>
                      <span className={styles.orderTotalValue}>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Orders table */}
            {!viewingOrder && !editingOrder && (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th className={styles.thActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className={styles.row}>
                        <td className={styles.cellName}>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{order.date}</td>
                        <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                        <td className={styles.cellPrice}>{formatPrice(order.total)}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className={`${styles.statusSelect} ${styles[`status${order.status.replace(/\s/g, '')}`]}`}
                          >
                            {orderStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                          </select>
                        </td>
                        <td className={styles.cellActions}>
                          <button onClick={() => handleViewOrder(order)} className={styles.editBtn}>View</button>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={7} className={styles.emptyRow}>No orders match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ ANALYTICS TAB ═══════════ */}
        {activeTab === 'analytics' && (
          <div className={styles.analytics}>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Total Revenue</p>
                <p className={styles.kpiValue}>{formatPrice(analytics.totalRevenue)}</p>
                <p className={styles.kpiChange} style={{ color: '#2D6A4F' }}>From {analytics.activeOrders} active orders</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Net Profit</p>
                <p className={styles.kpiValue}>{formatPrice(analytics.profit)}</p>
                <p className={styles.kpiChange} style={{ color: '#2D6A4F' }}>After {formatPrice(analytics.totalCost)} COGS (42%)</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Returns</p>
                <p className={styles.kpiValue}>{analytics.returnedCount}</p>
                <p className={styles.kpiChange} style={{ color: '#C23B22' }}>{analytics.returnRate}% rate · {formatPrice(analytics.lossFromReturns)} lost</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Cancellations</p>
                <p className={styles.kpiValue}>{analytics.cancelledCount}</p>
                <p className={styles.kpiChange} style={{ color: '#C23B22' }}>{analytics.cancelRate}% rate · {formatPrice(analytics.lossFromCancellations)} lost</p>
              </div>
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Monthly Revenue (Active Orders)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Area type="monotone" dataKey="revenue" stroke="#C23B22" fill="#C23B22" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Orders vs Returns vs Cancellations</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="returns" fill="#C23B22" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="cancellations" fill="#C5A55A" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categorySalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categorySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatPrice(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Top Products</h3>
                <div className={styles.topProductsList}>
                  {analytics.topProducts.map((item, i) => (
                    <div key={i} className={styles.topProductRow}>
                      <span className={styles.topProductRank}>#{i + 1}</span>
                      <div className={styles.topProductInfo}>
                        <span className={styles.topProductName}>{item.name}</span>
                        <span className={styles.topProductMeta}>{item.units} units sold</span>
                      </div>
                      <span className={styles.topProductRevenue}>{formatPrice(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
