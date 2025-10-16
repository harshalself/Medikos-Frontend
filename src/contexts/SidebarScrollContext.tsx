import React, { createContext, useContext, useRef, useEffect } from 'react';

interface SidebarScrollContextType {
  sidebarRef: React.RefObject<HTMLElement>;
  preserveScrollPosition: () => void;
  restoreScrollPosition: () => void;
}

const SidebarScrollContext = createContext<SidebarScrollContextType | undefined>(undefined);

// Global scroll position storage
let globalScrollPosition = 0;

export const SidebarScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sidebarRef = useRef<HTMLElement>(null);

  const preserveScrollPosition = () => {
    if (sidebarRef.current) {
      globalScrollPosition = sidebarRef.current.scrollTop;
      // Also save to localStorage for persistence across sessions
      localStorage.setItem('sidebar-scroll-position', globalScrollPosition.toString());
    }
  };

  const restoreScrollPosition = () => {
    if (sidebarRef.current) {
      // Use in-memory position first, fallback to localStorage
      const savedPosition = globalScrollPosition || 
        parseInt(localStorage.getItem('sidebar-scroll-position') || '0', 10);
      
      // Immediate restore without delay to prevent flash
      sidebarRef.current.scrollTop = savedPosition;
      globalScrollPosition = savedPosition;
      
      // Double-check after a minimal delay
      setTimeout(() => {
        if (sidebarRef.current && sidebarRef.current.scrollTop !== savedPosition) {
          sidebarRef.current.scrollTop = savedPosition;
        }
      }, 10);
    }
  };

  return (
    <SidebarScrollContext.Provider value={{
      sidebarRef,
      preserveScrollPosition,
      restoreScrollPosition
    }}>
      {children}
    </SidebarScrollContext.Provider>
  );
};

export const useSidebarScroll = () => {
  const context = useContext(SidebarScrollContext);
  if (context === undefined) {
    throw new Error('useSidebarScroll must be used within a SidebarScrollProvider');
  }
  return context;
};