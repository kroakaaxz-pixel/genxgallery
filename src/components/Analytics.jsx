import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

// Load Google Analytics (GA4) script
function loadGA(id) {
  if (document.querySelector(`script[src*="gtag/js?id=${id}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });
}

// Load Meta Pixel script
function loadMetaPixel(id) {
  if (window.fbq) return;
  (function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  })(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
}

// Track a page view
function trackPageView(path) {
  if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

// Track an Add to Cart event
export function trackAddToCart(itemName, value) {
  if (GA_ID && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [{ item_name: itemName }],
      value: value,
      currency: 'INR',
    });
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: itemName,
      value: value,
      currency: 'INR',
    });
  }
}

export default function Analytics() {
  const location = useLocation();

  // Load scripts on mount (if IDs are configured)
  useEffect(() => {
    if (GA_ID) loadGA(GA_ID);
    if (META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
