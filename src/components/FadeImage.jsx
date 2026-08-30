import { useState } from 'react';

// Wraps an <img> with:
// - fade-in on load for smoother visual experience
// - graceful fallback on error (replaces broken image icon with a subtle placeholder)
// Pure CSS transitions on opacity — no layout-triggering properties.
export default function FadeImage({ src, alt, className, style, loading = 'lazy', ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-cream-dark)',
          color: 'var(--color-ink-muted)',
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 500,
          minHeight: '120px',
        }}
        aria-label={alt || 'Image unavailable'}
        role="img"
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
      loading={loading}
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
