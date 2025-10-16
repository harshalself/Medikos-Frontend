import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Always scroll to top on route change for consistent UX
    container.scrollTop = 0;
    
    // Also ensure window scroll is reset (fallback)
    window.scrollTo(0, 0);
    
  }, [location.pathname]);

  return { scrollContainerRef };
};