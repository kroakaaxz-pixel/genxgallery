import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductCarousel.module.css';

const SCROLL_SPEED = 18; // px per frame (~540px/s at 60fps = one card every ~3s)
const RESUME_DELAY = 4500; // ms after last interaction before auto-scroll resumes

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pausedRef = useRef(false);
  const interactionTimerRef = useRef(null);

  const total = products.length;

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pause auto-scroll on interaction
  const pauseAutoScroll = useCallback(() => {
    pausedRef.current = true;
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  // Resume auto-scroll after idle
  const scheduleResume = useCallback(() => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

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

  // Auto-scroll animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = scrollRef.current;
    if (!el) return;

    const tick = (now) => {
      if (!pausedRef.current && !isDragging) {
        // Disable snap during auto-scroll so continuous pixel-scroll is smooth
        el.style.scrollSnapType = 'none';
        if (lastTimeRef.current !== null) {
          const dt = now - lastTimeRef.current;
          el.scrollLeft += SCROLL_SPEED * (dt / 16.67);
        }
        lastTimeRef.current = now;
      } else {
        // Re-enable snap when paused so manual scrolling aligns to cards
        el.style.scrollSnapType = '';
        lastTimeRef.current = null;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (el) el.style.scrollSnapType = '';
    };
  }, [prefersReducedMotion, isDragging]);

  // Manual scroll
  const scrollTo = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const gap = 24;
    const scrollAmount = direction === 'prev' ? -(cardWidth + gap) : cardWidth + gap;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    pauseAutoScroll();
    scheduleResume();
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();
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
    if (!isDragging) return;
    setIsDragging(false);
    const el = scrollRef.current;
    if (el) el.style.cursor = '';
    scheduleResume();
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  // Touch events
  const handleTouchStart = () => {
    pauseAutoScroll();
  };

  const handleTouchEnd = () => {
    scheduleResume();
  };

  // Mouse hover
  const handleMouseEnter = () => {
    pauseAutoScroll();
  };

  const handleMouseLeave = () => {
    scheduleResume();
  };

  // Arrow click
  const handleArrowClick = (direction) => {
    pauseAutoScroll();
    scrollTo(direction);
  };

  const pageCount = getPageCount();

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => handleArrowClick('prev')}
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className={`${styles.track} ${prefersReducedMotion ? '' : styles.trackAutoScroll}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {products.map((product) => (
          <div key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => handleArrowClick('next')}
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
