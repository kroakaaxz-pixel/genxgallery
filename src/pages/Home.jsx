import { Link } from 'react-router-dom';
import { getActiveProducts, categories, getDiscountedPrice } from '../data/products';
import { formatPrice } from '../utils/currency';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const allProducts = getActiveProducts();
const featuredProducts = allProducts.filter((p) =>
  [1, 5, 9, 11].includes(p.id)
);

const categoryImages = {
  cars: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=1000&fit=crop',
  anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1000&fit=crop',
  posters: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1000&fit=crop',
};

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Est. 2026 — Wall Decor for People Who Care</p>
          <h1 className={styles.heroTitle}>
            Art that<br />
            <em>belongs</em> on<br />
            your wall.
          </h1>
          <p className={styles.heroSubtitle}>
            Premium framed prints for people who care about what's on their walls.
            Pop culture, automotive, anime, and typographic art — gallery-ready.
          </p>
          <div className={styles.heroActions}>
            <Link to="/catalogue" className={`${styles.btn} ${styles.btnPrimary}`}>
              Browse Collection
            </Link>
            <Link to="/customize" className={`${styles.btn} ${styles.btnSecondary}`}>
              Custom Frame
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=1200&fit=crop"
            alt="Gallery wall with framed prints"
          />
          <span className={styles.heroFigLabel}>Fig. 01 — The Collection</span>
        </div>
      </section>

      {/* Featured */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Now Showing</p>
              <h2 className={styles.sectionTitle}>Trending Frames</h2>
            </div>
            <Link to="/catalogue" className={styles.sectionLink}>
              View All →
            </Link>
          </div>
          <div className={styles.editorialGrid}>
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={styles.featuredItem}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.featuredItemImage}
                  loading="lazy"
                />
                <div className={styles.featuredItemInfo}>
                  <p className={styles.featuredItemFig}>
                    Fig. 0{index + 1} — {product.category}
                  </p>
                  <h3 className={styles.featuredItemName}>{product.name}</h3>
                  <p className={styles.featuredItemPrice}>
                    {product.discountPercent > 0 ? (
                      <>
                        <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '6px' }}>
                          {formatPrice(product.price)}
                        </span>
                        From {formatPrice(getDiscountedPrice(product))}
                      </>
                    ) : (
                      <>From {formatPrice(product.price)}</>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Explore</p>
              <h2 className={styles.sectionTitle}>By Category</h2>
            </div>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={styles.categoryCard}
              >
                <div
                  className={styles.categoryCardBg}
                  style={{ backgroundImage: `url(${categoryImages[cat.id]})` }}
                />
                <div className={styles.categoryCardOverlay} />
                <div className={styles.categoryCardContent}>
                  <p className={styles.categoryCardNumber}>
                    0{index + 1}
                  </p>
                  <h3 className={styles.categoryCardName}>{cat.name}</h3>
                  <p className={styles.categoryCardTagline}>{cat.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=1000&fit=crop"
                alt="Framed prints on a gallery wall"
              />
              <span className={styles.storyImageCaption}>
                Our studio, Brooklyn NY
              </span>
            </div>
            <div className={styles.storyContent}>
              <p className={styles.storyLabel}>The Story</p>
              <h2 className={styles.storyTitle}>
                Not just frames.<br />
                A point of view.
              </h2>
              <p className={styles.storyText}>
                Gen X Gallery started with a simple frustration: why is it so hard to find
                framed art that doesn't look like it came from a hotel lobby? We wanted
                automotive prints that actually capture the lines. Anime art that isn't
                just a screenshot. Posters that say something.
              </p>
              <p className={styles.storyText}>
                Every print in our collection is selected, not aggregated. Every frame is
                built to last. And every order ships ready to hang — no trips to the
                framer required.
              </p>
              <p className={styles.storySignature}>— The Gen X Gallery Team</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
