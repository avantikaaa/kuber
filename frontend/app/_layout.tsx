import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AppProviders, useAuthBootstrap } from '@/src/App';
import { NavProvider, type AppRoute } from '@utils/navigation';
import { Navigation } from '@components/Navigation';

// Routes reachable without a valid auth token.
const PUBLIC_ROUTES = new Set(['login']);

function AuthGate() {
  const { loading, token } = useAuthBootstrap();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    const current = segments[0] ?? '';
    const isPublic = PUBLIC_ROUTES.has(current);

    if (!token && !isPublic) {
      router.replace('/login');
    } else if (token && current === 'login') {
      router.replace('/');
    }
  }, [loading, token, segments, router]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const current = segments[0] ?? '';
  const showNav = !!token && current !== 'login';

  return (
    <NavProvider
      value={{
        push: (path: AppRoute) => router.push(path),
        replace: (path: AppRoute) => router.replace(path),
      }}
    >
      <View style={styles.flex}>
        {showNav && <Navigation />}
        <Slot />
      </View>
    </NavProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AuthGate />
    </AppProviders>
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
