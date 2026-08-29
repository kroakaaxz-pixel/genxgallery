import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              Gen X <span>Gallery</span>
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
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
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
