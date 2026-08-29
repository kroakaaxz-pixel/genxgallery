import { useParams, Navigate } from 'react-router-dom';
import { getCategoryById, getProductsByCategory, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Category.module.css';

const categoryImages = {
  cars: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&h=600&fit=crop',
  anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1400&h=600&fit=crop',
  posters: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=600&fit=crop',
};

export default function Category() {
  const { id } = useParams();
  const category = getCategoryById(id);
  const products = getProductsByCategory(id);
  const catIndex = categories.findIndex((c) => c.id === id);

  if (!category) return <Navigate to="/404" replace />;

  return (
    <main className={styles.page}>
      <div className={styles.heroBanner}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${categoryImages[id]})` }}
        />
        <div className={styles.heroOverlay} />
        <span className={styles.heroNumber}>0{catIndex + 1}</span>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Category</p>
          <h1 className={styles.heroTitle}>{category.name}</h1>
          <p className={styles.heroTagline}>{category.tagline}</p>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.introText}>{category.description}</p>
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
