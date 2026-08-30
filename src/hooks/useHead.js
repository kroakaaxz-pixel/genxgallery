import { useEffect } from 'react';

const SITE_NAME = 'Gen X Gallery';
const DEFAULT_DESCRIPTION = 'Premium framed prints for people who care about what\'s on their walls. Pop culture, automotive, anime, and typographic art — gallery-ready.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=630&fit=crop';
const SITE_URL = 'https://genxgallery.com';

export function useHead({ title, description, image, url, type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Framed Prints`;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || DEFAULT_IMAGE;
    const pageUrl = url ? `${SITE_URL}${url}` : `${SITE_URL}${window.location.pathname}`;

    document.title = fullTitle;

    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`)
        || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('article:')) {
          el.setAttribute('property', property);
        } else {
          el.setAttribute('name', property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', desc);
    setMeta('og:title', fullTitle);
    setMeta('og:description', desc);
    setMeta('og:image', img);
    setMeta('og:url', pageUrl);
    setMeta('og:type', type);
    setMeta('og:site_name', SITE_NAME);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', img);
  }, [title, description, image, url, type]);
}
