import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductCarousel.module.css';

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const total = products.length;

  // Calculate how many items are visible to determine page count
  const getPageCount = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return total;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const visibleCards = Math.floor(el.offsetWidth / cardWidth) || 1;
    return Math.max(1, Math.ceil(total / visibleCards));
  }, [total]);

  // Update current page based on scroll position
  const updatePage = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const gap = 24;
    const scrolled = Math.round(el.scrollLeft / (cardWidth + gap));
    const cardIdx = Math.min(scrolled, total - 1);
    const visibleCards = Math.floor(el.offsetWidth / (cardWidth + gap)) || 1;
    const page = Math.floor(cardIdx / visibleCards) + 1;
    setCurrentPage(Math.min(page, getPageCount()));
  }, [total, getPageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updatePage, { passive: true });
    updatePage();
    return () => el.removeEventListener('scroll', updatePage);
  }, [updatePage]);

  // Resize observer to recalculate on window resize
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => updatePage());
    observer.observe(el);
    return () => observer.disconnect();
  }, [updatePage]);

  const scrollTo = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const gap = 24;
    const scrollAmount = direction === 'prev' ? -(cardWidth + gap) : cardWidth + gap;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
    el.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const el = scrollRef.current;
    if (el) el.style.cursor = '';
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  const pageCount = getPageCount();

  return (
    <div className={styles.carousel}>
      <button
        onClick={() => scrollTo('prev')}
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className={styles.track}
        onMouseDown={handleMouseDown}
      >
        {products.map((product) => (
          <div key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollTo('next')}
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Next"
      >
        ›
      </button>

      {pageCount > 1 && (
        <div className={styles.indicator}>
          <span className={styles.indicatorCurrent}>
            {String(currentPage).padStart(2, '0')}
          </span>
          <span className={styles.indicatorSep}> / </span>
          <span className={styles.indicatorTotal}>
            {String(pageCount).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
