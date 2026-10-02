import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider, QueryClient } from 'react-query';
import theme from '@utils/theme';
import { useAuthStore } from '@utils/store';
import { apiClient } from '@utils/api';
import { NavProvider, type AppRoute } from '@utils/navigation';
import { Navigation } from '@components/Navigation';
import HomePage from '@pages/Home';
import AddTransactionPage from '@pages/AddTransaction';
import TransactionsPage from '@pages/Transactions';
import ProfilePage from '@pages/Profile';
import LoginPage from '@pages/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Checks the stored auth token on mount and clears it if invalid.
 * Navigation guards for the expo-router entry live in app/_layout.tsx;
 * this hook only owns the token-verification side effect so it can be
 * reused from both that layout and the web (Vite) fallback shell below.
 */
export const useAuthBootstrap = () => {
  const { token, setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient
        .verifyToken()
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, token };
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const ROUTE_PAGES: Record<AppRoute, React.FC> = {
  '/': HomePage,
  '/add-transaction': AddTransactionPage,
  '/transactions': TransactionsPage,
  '/profile': ProfilePage,
  '/login': LoginPage,
};

const isBrowser = Platform.OS === 'web' && typeof window !== 'undefined';

const useBrowserPath = (): { path: AppRoute; navigate: (next: AppRoute, replace?: boolean) => void } => {
  const getPath = () => (isBrowser ? (window.location.pathname as AppRoute) : '/');
  const [path, setPath] = useState<AppRoute>(getPath());

  useEffect(() => {
    if (!isBrowser) return;
    const onPopState = () => setPath(getPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: AppRoute, replace = false) => {
    if (isBrowser) {
      if (replace) window.history.replaceState({}, '', next);
      else window.history.pushState({}, '', next);
    }
    setPath(next);
  };

  return { path, navigate };
};

/**
 * Standalone app shell for entry points that don't run through expo-router's
 * file-based navigation: the Vite web build (web/main.tsx) and a bare
 * registerRootComponent host. `npx expo start` instead boots through
 * app/_layout.tsx, which is the canonical/primary router and provides the
 * same NavProvider backed by expo-router.
 */
function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  const { loading, token } = useAuthBootstrap();
  const { path, navigate } = useBrowserPath();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isLoginRoute = path === '/login';
  const effectivePath: AppRoute = !token && !isLoginRoute ? '/login' : path;
  const Page = ROUTE_PAGES[effectivePath] || HomePage;

  return (
    <NavProvider
      value={{
        push: (next) => navigate(next, false),
        replace: (next) => navigate(next, true),
      }}
    >
      <View style={styles.flex}>
        {token && !isLoginRoute && <Navigation />}
        <Page />
      </View>
    </NavProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
