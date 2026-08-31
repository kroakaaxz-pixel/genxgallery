import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signOut, supabase, fetchProducts } from '../lib/supabase';
import { getActiveProducts, categories, subCategories } from '../data/products';
import logoUrl from '../assets/logo.svg';
import styles from './Header.module.css';

export default function Header() {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState(getActiveProducts());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileNavRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setSearchOpen(false);
    setQuery('');
    setUserMenuOpen(false);
  }, [location]);

  // Fetch products from Supabase for search
  useEffect(() => {
    fetchProducts()
      .then((data) => { if (data) setAllProducts(data); })
      .catch(() => {});
  }, []);

  // Close on tap outside
  useEffect(() => {
    if (!mobileOpen) return;
    const handleOutsideClick = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [mobileOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [mobileOpen]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on tap outside
  useEffect(() => {
    if (!searchOpen) return;
    const handleOutside = (e) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.searchButton}`)
      ) {
        setSearchOpen(false);
        setQuery('');
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutside);
    };
  }, [searchOpen]);

  // Close user menu on tap outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutside);
    };
  }, [userMenuOpen]);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      handleResultClick(results[0].id);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <img src={logoUrl} alt="" className={styles.logoImg} />
            <span className={styles.logoText}>GEN X <span className={styles.logoAccent}>GALLERY</span></span>
          </Link>

          <nav className={styles.nav}>
            <ul className={styles.navLinks}>
              <li>
                <NavLink
                  to="/catalogue"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  Shop
                </NavLink>
              </li>
              {categories.map((cat) => (
                <li key={cat.id} className={styles.navDropdown}>
                  <NavLink
                    to={`/${cat.id}`}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                  >
                    {cat.name}
                  </NavLink>
                  <ul className={styles.dropdownMenu}>
                    {subCategories.map((sub) => (
                      <li key={sub.id}>
                        <NavLink
                          to={`/${cat.id}/${sub.id}`}
                          className={styles.dropdownLink}
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              <li>
                <NavLink
                  to="/customize"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  Customize
                </NavLink>
              </li>
            </ul>

            <div className={styles.actions}>
              <div className={styles.searchWrap}>
                <button
                  className={styles.searchButton}
                  onClick={() => { setSearchOpen(!searchOpen); setQuery(''); }}
                  aria-label="Search products"
                  aria-expanded={searchOpen}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                {searchOpen && (
                  <div className={styles.searchDropdown} ref={searchDropdownRef}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                      <svg className={styles.searchInputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search prints..."
                        className={styles.searchInput}
                      />
                      {query && (
                        <button
                          type="button"
                          className={styles.searchClear}
                          onClick={() => setQuery('')}
                          aria-label="Clear search"
                        >
                          ×
                        </button>
                      )}
                    </form>

                    {query.trim() && (
                      <div className={styles.searchResults}>
                        {results.length > 0 ? (
                          results.map((product) => (
                            <button
                              key={product.id}
                              className={styles.searchResult}
                              onClick={() => handleResultClick(product.id)}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className={styles.searchResultImg}
                              />
                              <div className={styles.searchResultInfo}>
                                <span className={styles.searchResultCategory}>{product.subCategory}</span>
                                <span className={styles.searchResultName}>{product.name}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={styles.searchEmpty}>No prints found for &ldquo;{query}&rdquo;</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <NavLink to="/wishlist" className={styles.wishlistButton} aria-label="Wishlist">
                <svg className={styles.wishlistIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className={styles.wishlistBadge}>{wishlistCount}</span>
                )}
              </NavLink>

              <NavLink to="/cart" className={styles.cartButton} aria-label="Cart">
                <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </NavLink>

              {/* Auth button */}
              {user ? (
                <div className={styles.userMenuWrap} ref={userMenuRef}>
                  <button
                    className={styles.userButton}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        className={styles.userAvatar}
                      />
                    ) : (
                      <span className={styles.userInitial}>
                        {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userDropdownHeader}>
                        <span className={styles.userDropdownName}>
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </div>
                      <NavLink to="/account/orders" className={styles.userDropdownLink} onClick={() => setUserMenuOpen(false)}>
                        My Orders
                      </NavLink>
                      <NavLink to="/account/addresses" className={styles.userDropdownLink} onClick={() => setUserMenuOpen(false)}>
                        Saved Addresses
                      </NavLink>
                      <button
                        className={styles.userDropdownLink}
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className={styles.signInButton}
                  onClick={() => signInWithGoogle()}
                  aria-label="Sign in with Google"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.signInIcon}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className={styles.signInText}>Sign In</span>
                </button>
              )}

              <button
                className={styles.mobileMenuButton}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {mobileOpen && (
        <div className={styles.mobileNavBackdrop} ref={mobileNavRef} onClick={closeMobile}>
          <nav className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
            <NavLink to="/catalogue" className={styles.navLink} onClick={closeMobile}>Shop All</NavLink>
            {categories.map((cat) => (
              <div key={cat.id} className={styles.mobileNavGroup}>
                <button
                  className={styles.mobileNavGroupToggle}
                  onClick={() => setMobileExpanded(mobileExpanded === cat.id ? null : cat.id)}
                  aria-expanded={mobileExpanded === cat.id}
                >
                  {cat.name}
                  <span className={`${styles.mobileNavArrow} ${mobileExpanded === cat.id ? styles.mobileNavArrowOpen : ''}`}>›</span>
                </button>
                {mobileExpanded === cat.id && (
                  <div className={styles.mobileNavSub}>
                    {subCategories.map((sub) => (
                      <NavLink
                        key={sub.id}
                        to={`/${cat.id}/${sub.id}`}
                        className={styles.mobileNavLink}
                        onClick={closeMobile}
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink to="/customize" className={styles.navLink} onClick={closeMobile}>Customize</NavLink>
            <NavLink to="/about" className={styles.navLink} onClick={closeMobile}>About</NavLink>
            {user ? (
              <>
                <NavLink to="/account/orders" className={styles.navLink} onClick={closeMobile}>My Orders</NavLink>
                <NavLink to="/account/addresses" className={styles.navLink} onClick={closeMobile}>Saved Addresses</NavLink>
                <button
                  className={styles.navLink}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', width: '100%' }}
                  onClick={() => { signOut(); closeMobile(); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className={styles.navLink}
                style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', width: '100%' }}
                onClick={() => { signInWithGoogle(); closeMobile(); }}
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
