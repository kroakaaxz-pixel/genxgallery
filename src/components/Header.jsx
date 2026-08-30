import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mobileNavRef = useRef(null);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close on tap outside
  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutsideClick = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    // Delay to avoid the opening click from immediately closing
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Gen X <span>Gallery</span>
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
            <li>
              <NavLink
                to="/category/cars"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Cars
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/anime"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Anime
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/posters"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Posters
              </NavLink>
            </li>
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

      {mobileOpen && (
        <div className={styles.mobileNavBackdrop} ref={mobileNavRef}>
          <nav className={styles.mobileNav}>
            <NavLink to="/catalogue" className={styles.navLink} onClick={closeMobile}>Shop All</NavLink>
            <NavLink to="/category/cars" className={styles.navLink} onClick={closeMobile}>Cars</NavLink>
            <NavLink to="/category/anime" className={styles.navLink} onClick={closeMobile}>Anime</NavLink>
            <NavLink to="/category/posters" className={styles.navLink} onClick={closeMobile}>Posters</NavLink>
            <NavLink to="/customize" className={styles.navLink} onClick={closeMobile}>Customize</NavLink>
            <NavLink to="/about" className={styles.navLink} onClick={closeMobile}>About</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
