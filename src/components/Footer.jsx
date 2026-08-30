import { Link } from 'react-router-dom';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_URL } from '../config/admin';
import logoUrl from '../assets/logo.svg';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <img src={logoUrl} alt="" className={styles.brandLogoImg} />
              <span className={styles.brandLogoText}>GEN X <span className={styles.brandLogoAccent}>GALLERY</span></span>
            </div>
            <p className={styles.brandTagline}>
              Premium framed prints for people who care about what's on their walls.
              Pop culture, automotive, anime, and typographic art — gallery-ready.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/category/cars">Cars</Link></li>
              <li><Link to="/category/anime">Anime</Link></li>
              <li><Link to="/category/posters">Posters</Link></li>
              <li><Link to="/customize">Custom Frames</Link></li>
              <li><Link to="/catalogue">All Products</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Info</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns &amp; Refunds</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Connect</h4>
            <ul>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.socialBar}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={`Follow us on Instagram (${INSTAGRAM_HANDLE})`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 Gen X Gallery. All rights reserved.
          </p>
          <p className={styles.copyright}>
            Made with intention, not templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
