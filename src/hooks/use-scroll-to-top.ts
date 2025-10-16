import { useEffect } from 'react';

/**
 * Hook to scroll to top when component mounts
 * Ensures consistent page loading behavior across all pages
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};