import { useState, useEffect } from 'react';
import { products as initialProducts, categories, productStatuses, frameSizes } from '../data/products';
import { ADMIN_PASSWORD } from '../config/admin';
import { formatPrice } from '../utils/currency';
import styles from './Admin.module.css';

const STORAGE_KEY = 'gxg_admin_auth';
const PRODUCTS_KEY = 'gxg_admin_products';

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
  sizes: ['8x10', '11x14'],
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
            <h1 className={styles.title}>Product Management</h1>
            <p className={styles.subtitle}>{products.length} products total</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleAddNew} className={styles.addBtn}>+ Add Product</button>
            <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
          </div>
        </div>

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
                <label>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  className={styles.input}
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
                  <td className={styles.cellPrice}>{formatPrice(product.price)}</td>
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
      </div>
    </main>
  );
}
