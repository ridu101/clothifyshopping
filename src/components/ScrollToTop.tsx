import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global scroll-to-top: every route change scrolls the window back to the top.
 * Uses smooth behavior, but falls back to instant on reduced-motion preference.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Use a microtask delay so the new page mounts before the scroll fires.
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
