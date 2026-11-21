import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Centrally restores window scroll position on route changes.
 * If a hash anchor is provided (e.g. /visit#visit-form), it smoothly scrolls to that element.
 * Otherwise, it scrolls immediately to the top of the destination page.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to allow destination page DOM to render
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

