import { useState } from 'react';

// Wraps an <img> with a fade-in on load for smoother visual experience.
// Pure CSS transition on opacity — no layout-triggering properties.
export default function FadeImage({ src, alt, className, style, loading = 'lazy', ...props }) {
  const [loaded, setLoaded] = useState(false);

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
      {...props}
    />
  );
}
