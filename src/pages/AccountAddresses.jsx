import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../lib/supabase';
import { useHead } from '../hooks/useHead';
import styles from './Account.module.css';

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

function emptyForm() {
  return { house_no: '', street: '', landmark: '', city: '', state: '', pincode: '', phone: '', is_default: false };
}

export default function AccountAddresses() {
  useHead({ title: 'Saved Addresses', description: 'Manage your delivery addresses at Gen X Gallery.' });
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getAddresses(user.id).then((data) => {
      setAddresses(data);
      setFetching(false);
    });
  }, [user]);

  const refresh = async () => {
    if (!user) return;
    const data = await getAddresses(user.id);
    setAddresses(data);
  };

  const handleSave = async () => {
    if (!user || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editingId) {
        await updateAddress(editingId, user.id, form);
      } else {
        await addAddress(user.id, form);
      }
      setEditingId(null);
      setForm(emptyForm());
      setShowAdd(false);
      await refresh();
    } catch {
      // Not logging the error object: a Postgres constraint violation can echo
      // the submitted address back in its detail/hint fields.
      console.error('Failed to save address.');
      setSaveError('Could not save this address. Please try again.');
    }
    setSaving(false);
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      house_no: addr.house_no || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      phone: addr.phone || '',
      is_default: addr.is_default || false,
    });
    setShowAdd(true);
  };

  const handleDelete = async (addrId) => {
    if (!user) return;
    if (!window.confirm('Delete this address?')) return;
    await deleteAddress(addrId, user.id);
    await refresh();
  };

  const handleSetDefault = async (addrId) => {
    if (!user) return;
    await updateAddress(addrId, user.id, { is_default: true });
    await refresh();
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowAdd(false);
    setSaveError('');
  };

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>Account</p>
          <h1 className={styles.pageTitle}>Saved Addresses</h1>
        </div>

        {fetching ? (
          <p className={styles.loadingText}>Loading addresses…</p>
        ) : (
          <>
            {addresses.length > 0 && (
              <div className={styles.addressesGrid}>
                {addresses.map((addr) => (
                  <div key={addr.id} className={`${styles.addressCard} ${addr.is_default ? styles.addressDefault : ''}`}>
                    {addr.is_default && <span className={styles.defaultBadge}>Default</span>}
                    <p>{addr.house_no}</p>
                    <p>{addr.street}</p>
                    {addr.landmark && <p>{addr.landmark}</p>}
                    <p>{addr.city}, {addr.state} {addr.pincode}</p>
                    <p>Phone: {addr.phone}</p>
                    <div className={styles.addressActions}>
                      {!addr.is_default && (
                        <button className={styles.addressActionBtn} onClick={() => handleSetDefault(addr.id)}>
                          Set as default
                        </button>
                      )}
                      <button className={styles.addressActionBtn} onClick={() => handleEdit(addr)}>
                        Edit
                      </button>
                      <button className={`${styles.addressActionBtn} ${styles.addressActionDanger}`} onClick={() => handleDelete(addr.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showAdd && (
              <button className={styles.addAddressBtn} onClick={() => { setEditingId(null); setForm(emptyForm()); setShowAdd(true); }}>
                + Add New Address
              </button>
            )}

            {showAdd && (
              <div className={styles.addressForm}>
                <h3 className={styles.formTitle}>{editingId ? 'Edit Address' : 'New Address'}</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label style={labelStyle}>House / Flat / Building</label>
                    <input style={inputStyle} value={form.house_no} onChange={(e) => setForm({ ...form, house_no: e.target.value })} placeholder="e.g. 42, Sunrise Apartments" />
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>Street / Area</label>
                    <input style={inputStyle} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="e.g. MG Road, Koramangala" />
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>Landmark</label>
                    <input style={inputStyle} value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Optional" />
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>City</label>
                    <input style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>State</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>Pincode</label>
                    <input style={inputStyle} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} maxLength={6} />
                  </div>
                  <div className={styles.formField}>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} maxLength={10} />
                  </div>
                </div>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  />
                  Set as default address
                </label>
                {saveError && (
                  <p role="alert" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '8px' }}>
                    {saveError}
                  </p>
                )}
                <div className={styles.formActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : editingId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button className={styles.cancelBtn} onClick={cancelForm}>Cancel</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
