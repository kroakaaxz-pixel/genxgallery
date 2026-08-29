import { useState, useMemo } from 'react';
import { getActiveProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Catalogue.module.css';

const allProducts = getActiveProducts();

const filterOptions = ['all', 'cars', 'anime', 'posters'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
];

export default function Catalogue() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = filter === 'all' ? [...allProducts] : allProducts.filter((p) => p.category === filter);

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
  }, [filter, sort]);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>The Collection</p>
          <h1 className={styles.pageTitle}>All Frames</h1>
        </div>

        {/* Desktop controls */}
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${styles.filterBtn} ${filter === opt ? styles.filterBtnActive : ''}`}
              >
                {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
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
            {filter !== 'all' && (
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
            <div className={styles.mobileFilterRow}>
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setFilter(opt); setFiltersOpen(false); }}
                  className={`${styles.filterBtn} ${filter === opt ? styles.filterBtnActive : ''}`}
                >
                  {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
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
