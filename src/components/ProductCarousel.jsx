import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductCarousel.module.css';

const SCROLL_SPEED = 18;
const RESUME_DELAY = 4500;

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Drag state — refs for the animation loop (no re-render), state for cursor style
  const isDraggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

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

  const pauseAutoScroll = useCallback(() => {
    pausedRef.current = true;
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

  const getPageCount = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return total;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const visibleCards = Math.floor(el.offsetWidth / cardWidth) || 1;
    return Math.max(1, Math.ceil(total / visibleCards));
  }, [total]);

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => updatePage());
    observer.observe(el);
    return () => observer.disconnect();
  }, [updatePage]);

  // Auto-scroll animation loop — uses isDraggingRef (not state) to avoid restart
  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = scrollRef.current;
    if (!el) return;

    const tick = (now) => {
      if (!pausedRef.current && !isDraggingRef.current) {
        el.style.scrollSnapType = 'none';
        if (lastTimeRef.current !== null) {
          const dt = now - lastTimeRef.current;
          el.scrollLeft += SCROLL_SPEED * (dt / 16.67);
        }
        lastTimeRef.current = now;
      } else {
        el.style.scrollSnapType = '';
        lastTimeRef.current = null;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      el.style.scrollSnapType = '';
    };
  }, [prefersReducedMotion]);

  const scrollTo = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth || 260;
    const gap = 24;
    const scrollAmount = direction === 'prev' ? -(cardWidth + gap) : cardWidth + gap;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    pauseAutoScroll();
    scheduleResume();
  }, [pauseAutoScroll, scheduleResume]);

  // Mouse drag — store values in refs so the document listeners are stable
  const handleMouseDown = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();
    isDraggingRef.current = true;
    setDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  }, [pauseAutoScroll]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setDragging(false);
    const el = scrollRef.current;
    if (el) el.style.cursor = '';
    scheduleResume();
  }, [scheduleResume]);

  // Document-level mouse listeners — stable deps via useCallback handlers
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  const handleTouchStart = useCallback(() => { pauseAutoScroll(); }, [pauseAutoScroll]);
  const handleTouchEnd = useCallback(() => { scheduleResume(); }, [scheduleResume]);
  const handleMouseEnter = useCallback(() => { pauseAutoScroll(); }, [pauseAutoScroll]);
  const handleMouseLeave = useCallback(() => { scheduleResume(); }, [scheduleResume]);

  const handleArrowClick = useCallback((direction) => {
    pauseAutoScroll();
    scrollTo(direction);
  }, [pauseAutoScroll, scrollTo]);

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
        className={styles.track}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: dragging ? 'grabbing' : '' }}
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
