import { useState, useEffect } from 'react';
import { products as initialProducts, categories, productStatuses, frameSizes, getDiscountedPrice } from '../data/products';
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

const monthlySalesData = [
  { month: 'Jan', revenue: 42500, orders: 28, returns: 2, cancellations: 1 },
  { month: 'Feb', revenue: 38200, orders: 24, returns: 1, cancellations: 3 },
  { month: 'Mar', revenue: 56800, orders: 38, returns: 3, cancellations: 2 },
  { month: 'Apr', revenue: 51200, orders: 34, returns: 4, cancellations: 1 },
  { month: 'May', revenue: 63400, orders: 42, returns: 2, cancellations: 2 },
  { month: 'Jun', revenue: 58900, orders: 39, returns: 5, cancellations: 3 },
  { month: 'Jul', revenue: 71200, orders: 47, returns: 3, cancellations: 2 },
  { month: 'Aug', revenue: 67500, orders: 44, returns: 4, cancellations: 1 },
  { month: 'Sep', revenue: 74800, orders: 50, returns: 2, cancellations: 4 },
  { month: 'Oct', revenue: 82100, orders: 55, returns: 6, cancellations: 2 },
  { month: 'Nov', revenue: 95400, orders: 64, returns: 3, cancellations: 3 },
  { month: 'Dec', revenue: 108200, orders: 72, returns: 5, cancellations: 4 },
];

const categorySalesData = [
  { name: 'Cars', value: 124500, fill: '#C23B22' },
  { name: 'Anime', value: 98700, fill: '#6B4C9A' },
  { name: 'Posters', value: 87600, fill: '#2D6A4F' },
];

const topProducts = [
  { name: 'Skyline at Dusk', units: 42, revenue: 84000 },
  { name: 'Neon District', units: 38, revenue: 76000 },
  { name: 'Vintage Travel', units: 31, revenue: 52700 },
  { name: 'Cinema Noir', units: 28, revenue: 44800 },
  { name: 'Spirit Forest', units: 25, revenue: 52500 },
];

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

function storeProducts(prods) {
  try {
    sessionStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
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
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(getStoredAuth);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [products, setProducts] = useState(() => getStoredProducts() ?? initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ ...emptyProduct });
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  // Persist products to session storage whenever they change
  useEffect(() => {
    storeProducts(products);
  }, [products]);

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
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p))
      );
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
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
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

  // Login screen
  if (!authenticated) {
    return (
      <main className={styles.page}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>Admin Panel</h1>
            <p className={styles.loginSubtitle}>Gen X Gallery — Product Management</p>
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
            onClick={() => setActiveTab('analytics')}
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.tabActive : ''}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            {/* Status filter */}
            <div className={styles.filterBar}>
              {['all', ...productStatuses].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`${styles.filterBtn} ${filterStatus === status ? styles.filterBtnActive : ''}`}
                >
                  {status === 'all' ? 'All' : status}
                  <span className={styles.filterCount}>
                    {status === 'all'
                      ? products.length
                      : products.filter((p) => p.status === status).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Add/Edit form */}
            {(showAddForm || editingId) && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className={styles.input}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={formData.discountPercent || 0}
                      onChange={(e) => handleFieldChange('discountPercent', Number(e.target.value))}
                      className={styles.input}
                      placeholder="0"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className={styles.input}
                    >
                      {productStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>Image URL</label>
                    <input
                      value={formData.image}
                      onChange={(e) => handleFieldChange('image', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Badge (optional)</label>
                    <input
                      value={formData.badge || ''}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className={styles.input}
                      placeholder="e.g. New, Limited"
                    />
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className={styles.input}
                      rows={3}
                    />
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label>Available Sizes</label>
                    <div className={styles.sizeCheckboxes}>
                      {frameSizes.map((size) => (
                        <label key={size.id} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size.id)}
                            onChange={() => handleSizeToggle(size.id)}
                          />
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

            {/* Product table */}
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
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.tableImage}
                        />
                      </td>
                      <td className={styles.cellName}>
                        {product.name}
                        {product.badge && (
                          <span className={styles.tableBadge}>{product.badge}</span>
                        )}
                      </td>
                      <td className={styles.cellCategory}>{product.category}</td>
                      <td className={styles.cellPrice}>
                        {product.discountPercent > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '6px' }}>
                              {formatPrice(product.price)}
                            </span>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                              {formatPrice(getDiscountedPrice(product))}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginLeft: '4px' }}>
                              -{product.discountPercent}%
                            </span>
                          </>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </td>
                      <td>
                        <select
                          value={product.status}
                          onChange={(e) => handleStatusToggle(product.id, e.target.value)}
                          className={`${styles.statusSelect} ${styles[`status${product.status.replace(/\s/g, '')}`]}`}
                        >
                          {productStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.cellActions}>
                        <button onClick={() => handleEdit(product)} className={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className={styles.emptyRow}>No products match this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.analytics}>
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Total Revenue</p>
                <p className={styles.kpiValue}>{formatPrice(840300)}</p>
                <p className={styles.kpiChange} style={{ color: '#2D6A4F' }}>+18.2% vs last year</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Total Orders</p>
                <p className={styles.kpiValue}>535</p>
                <p className={styles.kpiChange} style={{ color: '#2D6A4F' }}>+12.4% vs last year</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Returns</p>
                <p className={styles.kpiValue}>40</p>
                <p className={styles.kpiChange} style={{ color: '#C23B22' }}>7.5% return rate</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Cancellations</p>
                <p className={styles.kpiValue}>28</p>
                <p className={styles.kpiChange} style={{ color: '#C23B22' }}>5.2% cancel rate</p>
              </div>
            </div>

            {/* Charts */}
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySalesData}>
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
                  <BarChart data={monthlySalesData}>
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
                      data={categorySalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categorySalesData.map((entry, index) => (
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
                  {topProducts.map((item, i) => (
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
