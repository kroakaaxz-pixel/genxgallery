import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { getCategoryById, getProductsBySubCategory, getProductsByCategory, categories, subCategories, getSubCategoryById } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Category.module.css';

const categoryImages = {
  'framed-posters': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&h=600&fit=crop',
  posters: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=600&fit=crop',
  anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1400&h=600&fit=crop',
  cars: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&h=600&fit=crop',
  bikes: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&h=600&fit=crop',
  others: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=600&fit=crop',
};

const subCategoryDescriptions = {
  anime: 'Iconic scenes, character studies, and poster art from the series that defined a generation.',
  cars: 'From vintage JDM legends to modern supercars — prints that celebrate automotive culture.',
  bikes: 'Café racers, dirt bikes, and everything in between. Two-wheeled art for your walls.',
  others: 'Movie posters, music art, retro ads, typographic prints, and more.',
};

export default function Category() {
  const { subCategory: subParam, id } = useParams();
  const { pathname } = useLocation();

  const isLegacyRoute = !!id;
  const segments = pathname.split('/').filter(Boolean);
  const categoryId = isLegacyRoute ? id : segments[0];
  const subCategoryId = isLegacyRoute ? null : (subParam || null);

  const category = getCategoryById(categoryId);
  if (!category) return <Navigate to="/404" replace />;

  const subCategory = subCategoryId ? getSubCategoryById(subCategoryId) : null;

  const products = subCategoryId
    ? getProductsBySubCategory(categoryId, subCategoryId)
    : getProductsByCategory(categoryId);

  const catIndex = categories.findIndex((c) => c.id === categoryId);
  const heroImage = categoryImages[subCategoryId || categoryId] || categoryImages[categoryId];

  const pageTitle = subCategory
    ? `${category.name} — ${subCategory.name}`
    : category.name;

  const pageDescription = subCategoryId
    ? subCategoryDescriptions[subCategoryId]
    : category.description;

  return (
    <main className={styles.page}>
      <div className={styles.heroBanner}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className={styles.heroOverlay} />
        <span className={styles.heroNumber}>0{catIndex + 1}</span>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>{category.name}</p>
          <h1 className={styles.heroTitle}>{pageTitle}</h1>
          <p className={styles.heroTagline}>{pageDescription}</p>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        {/* Sub-category nav */}
        <div className={styles.subNav}>
          <Link
            to={`/${categoryId}`}
            className={`${styles.subNavLink} ${!subCategoryId ? styles.subNavLinkActive : ''}`}
          >
            All
          </Link>
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/${categoryId}/${sub.id}`}
              className={`${styles.subNavLink} ${subCategoryId === sub.id ? styles.subNavLinkActive : ''}`}
            >
              {sub.name}
            </Link>
          ))}
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className={styles.emptyState}>No products in this category yet.</p>
        )}
      </div>
    </main>
  );
}
