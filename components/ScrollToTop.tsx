import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Start new pages at the top.
 *
 * A single-page app keeps one document across navigations, so the scroll
 * position simply stays where it was. Following a link from the bottom of the
 * homepage therefore opened the next page already scrolled to its footer —
 * the visitor never saw the page they asked for.
 *
 * Three cases, deliberately handled differently:
 *
 *   • PUSH / REPLACE (a link was followed) → go to the top. This is the fix.
 *   • POP (browser back or forward) → leave the scroll alone. The visitor is
 *     returning to something they were already reading, and yanking them to
 *     the top of it is the same bug in the other direction.
 *   • A `#hash` in the URL → scroll to that element instead of the top, so
 *     in-page anchors keep working.
 *
 * The jump is explicitly instant. `index.css` sets `scroll-behavior: smooth`
 * for in-page anchors, and without this a navigation would animate a long
 * scroll up through a page the visitor has just left.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;

    if (hash) {
      // The target may not be mounted on the first frame after a route change.
      const raf = requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      });
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
