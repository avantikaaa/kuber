import React, { useEffect } from 'react';
import { ChakraProvider, Box, Center, Spinner } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from '@utils/theme';
import { useAuthStore } from '@utils/store';
import { Navigation } from '@components/Navigation';
import { apiClient } from '@utils/api';

// Pages
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

// Protected Route Wrapper
// TODO: skipping auth check during local dev — restore before shipping
const SKIP_AUTH = true;
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  if (SKIP_AUTH) return <>{children}</>;
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppContent() {
  const { token, user, setUser, setToken } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Check if user is still logged in on app load
    if (token) {
      apiClient
        .verifyToken()
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid, clear it
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="bg-primary">
      {token && <Navigation />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-transaction"
          element={
            <ProtectedRoute>
              <AddTransactionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
