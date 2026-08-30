import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getActiveProducts, getNewArrivals, getSpecialDeals, categories, subCategories, getDiscountedPrice } from '../data/products';
import { formatPrice } from '../utils/currency';
import { useHead } from '../hooks/useHead';
import { useReveal, useStaggerReveal } from '../hooks/useReveal';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import FadeImage from '../components/FadeImage';
import styles from './Home.module.css';

const allProducts = getActiveProducts();
const featuredProducts = allProducts.filter((p) =>
  [1, 5, 9, 11].includes(p.id)
);
const newArrivals = getNewArrivals();
const specialDeals = getSpecialDeals();

const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Hero() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  // Ken Burns slow zoom on load
  useEffect(() => {
    if (prefersReducedMotion || !imageRef.current) return;
    imageRef.current.style.transform = 'scale(1)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = 'scale(1.06)';
        }
      });
    });
  }, []);

  // Parallax on scroll (RAF-throttled)
  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (imageRef.current) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.18;
            imageRef.current.style.transform = `translateY(${rate}px) scale(1.06)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroContent}>
        <p className={`${styles.heroLabel} ${styles.heroFadeUp} ${styles.heroFadeUp1}`}>
          Est. 2026 — Wall Decor for People Who Care
        </p>
        <h1 className={styles.heroTitle}>
          <span className={`${styles.heroLine} ${styles.heroFadeUp} ${styles.heroFadeUp2}`}>
            Art that
          </span>
          <br />
          <span className={`${styles.heroLine} ${styles.heroFadeUp} ${styles.heroFadeUp3}`}>
            <em>belongs</em> on
          </span>
          <br />
          <span className={`${styles.heroLine} ${styles.heroFadeUp} ${styles.heroFadeUp4}`}>
            your wall.
          </span>
        </h1>
        <p className={`${styles.heroSubtitle} ${styles.heroFadeUp} ${styles.heroFadeUp5}`}>
          Premium framed prints for people who care about what's on their walls.
          Pop culture, automotive, anime, and typographic art — gallery-ready.
        </p>
        <div className={`${styles.heroActions} ${styles.heroFadeUp} ${styles.heroFadeUp6}`}>
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
          ref={imageRef}
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=1200&fit=crop"
          alt="Gallery wall with framed prints"
          className={styles.heroImg}
        />
        <span className={styles.heroFigLabel}>Fig. 01 — The Collection</span>
      </div>
    </section>
  );
}

export default function Home() {
  useHead({
    title: null,
    description: 'Premium framed prints and posters for people who care about what\'s on their walls. Pop culture, automotive, anime, and typographic art — gallery-ready.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=630&fit=crop',
  });

  const featuredRef = useStaggerReveal({ staggerMs: 70, childSelector: `.${styles.featuredItem}` });
  const newArrivalsRef = useReveal();
  const specialDealsRef = useReveal();
  const categoriesRef = useStaggerReveal({ staggerMs: 80, childSelector: `.${styles.categoryCard}` });
  const storyRef = useReveal();

  return (
    <main>
      <Hero />

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
          <div className={styles.editorialGrid} ref={featuredRef}>
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={styles.featuredItem}
              >
                <FadeImage
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

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className={styles.carouselSection} ref={newArrivalsRef}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>Just In</p>
                <h2 className={styles.sectionTitle}>New Arrivals</h2>
              </div>
              <Link to="/catalogue" className={styles.sectionLink}>
                View All →
              </Link>
            </div>
            <ProductCarousel products={newArrivals} />
          </div>
        </section>
      )}

      {/* Special Deals */}
      {specialDeals.length > 0 && (
        <section className={`${styles.carouselSection} ${styles.carouselSectionAlt}`} ref={specialDealsRef}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>Limited Time</p>
                <h2 className={styles.sectionTitle}>Special Deals</h2>
              </div>
              <Link to="/catalogue" className={styles.sectionLink}>
                View All →
              </Link>
            </div>
            <ProductCarousel products={specialDeals} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Explore</p>
              <h2 className={styles.sectionTitle}>By Category</h2>
            </div>
          </div>
          <div className={styles.categoryGrid} ref={categoriesRef}>
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/${cat.id}`}
                className={styles.categoryCard}
              >
                <div
                  className={styles.categoryCardBg}
                  style={{ backgroundColor: cat.accent }}
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
      <section className={styles.story} ref={storyRef}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <FadeImage
                src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=1000&fit=crop"
                alt="Framed prints on a gallery wall"
                loading="lazy"
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
