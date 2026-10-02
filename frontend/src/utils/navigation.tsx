import React, { createContext, useContext } from 'react';

export type AppRoute = '/' | '/login' | '/add-transaction' | '/transactions' | '/profile';

interface NavContextValue {
  push: (path: AppRoute) => void;
  replace: (path: AppRoute) => void;
}

/**
 * Thin navigation abstraction so shared screens (src/pages, src/components)
 * don't hard-depend on a specific router implementation. The canonical
 * mobile/dev entry (app/_layout.tsx) provides this backed by expo-router;
 * the Vite web fallback (src/App.tsx) provides it backed by the browser
 * History API. Screens just call useAppNavigation().push(...).
 */
const NavContext = createContext<NavContextValue | null>(null);

export const NavProvider: React.FC<{ value: NavContextValue; children: React.ReactNode }> = ({
  value,
  children,
}) => <NavContext.Provider value={value}>{children}</NavContext.Provider>;

export const useAppNavigation = (): NavContextValue => {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error('useAppNavigation must be used within a NavProvider');
  }
  return ctx;
};
