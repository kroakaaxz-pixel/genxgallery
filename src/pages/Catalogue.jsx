import { useState, useMemo, useEffect } from 'react';
import { getActiveProducts, categories, subCategories } from '../data/products';
import { useHead } from '../hooks/useHead';
import ProductCard from '../components/ProductCard';
import { supabase, fetchProducts } from '../lib/supabase';
import styles from './Catalogue.module.css';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
];

export default function Catalogue() {
  useHead({
    title: 'Catalogue',
    description: 'Browse the full Gen X Gallery collection — framed posters, unframed prints, and custom frames across anime, cars, bikes, and more.',
  });
  const [allProducts, setAllProducts] = useState(getActiveProducts());
  const [catFilter, setCatFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    fetchProducts()
      .then((data) => { if (data) setAllProducts(data); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let items = [...allProducts];

    if (catFilter !== 'all') {
      items = items.filter((p) => p.category === catFilter);
    }
    if (subFilter !== 'all') {
      items = items.filter((p) => p.subCategory === subFilter);
    }

    switch (sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return items;
  }, [catFilter, subFilter, sort]);

  const activeFilterCount = (catFilter !== 'all' ? 1 : 0) + (subFilter !== 'all' ? 1 : 0);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>The Collection</p>
          <h1 className={styles.pageTitle}>All Prints</h1>
        </div>

        {/* Desktop controls */}
        <div className={styles.controls}>
          <div className={styles.filterGroups}>
            <div className={styles.filterGroup}>
              <span className={styles.filterGroupLabel}>Type</span>
              <button
                onClick={() => { setCatFilter('all'); setSubFilter('all'); }}
                className={`${styles.filterBtn} ${catFilter === 'all' && subFilter === 'all' ? styles.filterBtnActive : ''}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCatFilter(cat.id); setSubFilter('all'); }}
                  className={`${styles.filterBtn} ${catFilter === cat.id && subFilter === 'all' ? styles.filterBtnActive : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterGroupLabel}>Sub-category</span>
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubFilter(sub.id)}
                  className={`${styles.filterBtn} ${subFilter === sub.id ? styles.filterBtnActive : ''}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlsRight}>
            <span className={styles.resultCount}>
              {filtered.length} {filtered.length === 1 ? 'print' : 'prints'}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.sortSelect}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className={styles.mobileControls}>
          <button
            className={styles.filterToggle}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-label="Toggle filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="16" y2="12" />
              <line x1="4" y1="18" x2="12" y2="18" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.activeFilterDot} />
            )}
          </button>
          <span className={styles.resultCount}>
            {filtered.length} {filtered.length === 1 ? 'print' : 'prints'}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={styles.sortSelect}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile filter panel */}
        {filtersOpen && (
          <div className={styles.mobileFilterPanel}>
            <div className={styles.mobileFilterSection}>
              <p className={styles.mobileFilterLabel}>Type</p>
              <div className={styles.mobileFilterRow}>
                <button
                  onClick={() => { setCatFilter('all'); setSubFilter('all'); setFiltersOpen(false); }}
                  className={`${styles.filterBtn} ${catFilter === 'all' && subFilter === 'all' ? styles.filterBtnActive : ''}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCatFilter(cat.id); setSubFilter('all'); setFiltersOpen(false); }}
                    className={`${styles.filterBtn} ${catFilter === cat.id && subFilter === 'all' ? styles.filterBtnActive : ''}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.mobileFilterSection}>
              <p className={styles.mobileFilterLabel}>Sub-category</p>
              <div className={styles.mobileFilterRow}>
                {subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => { setSubFilter(sub.id); setFiltersOpen(false); }}
                    className={`${styles.filterBtn} ${subFilter === sub.id ? styles.filterBtnActive : ''}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={styles.productGrid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
