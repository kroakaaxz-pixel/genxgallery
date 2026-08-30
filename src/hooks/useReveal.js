import { useEffect, useRef } from 'react';

// Respects prefers-reduced-motion globally.
// Returns a ref to attach to the element you want revealed.
// Triggers once when the element enters the viewport.
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion: skip animation, just show immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    // Start hidden
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

// Staggered reveal for multiple children within a parent.
// Returns a ref for the parent, and applies staggered delays to direct children.
export function useStaggerReveal({ staggerMs = 60, childSelector = ':scope > *', threshold = 0.1, rootMargin = '0px 0px -30px 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const children = parent.querySelectorAll(childSelector);

    if (prefersReduced) {
      children.forEach((child) => {
        child.style.opacity = '1';
        child.style.transform = 'none';
      });
      return;
    }

    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(16px)';
      child.style.transition = `opacity 0.5s ease ${i * staggerMs}ms, transform 0.5s ease ${i * staggerMs}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
          observer.unobserve(parent);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(parent);
    return () => observer.disconnect();
  }, [staggerMs, childSelector, threshold, rootMargin]);

  return ref;
}
