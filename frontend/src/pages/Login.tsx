import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Divider,
  SegmentedButtons,
  Snackbar,
} from 'react-native-paper';
import { apiClient } from '@utils/api';
import { useAuthStore } from '@utils/store';
import { useSnackbar } from '@utils/useSnackbar';
import { useAppNavigation } from '@utils/navigation';

export const LoginPage: React.FC = () => {
  const router = useAppNavigation();
  const snackbar = useSnackbar();
  const { setToken, setUser } = useAuthStore();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const setLoginField = (name: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const setSignupField = (name: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.login(loginData.email, loginData.password);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      snackbar.show({ title: 'Success', description: 'Logged in successfully', status: 'success', duration: 2000 });
      router.replace('/');
    } catch (error: any) {
      snackbar.show({ title: 'Error', description: error.response?.data?.error || 'Login failed', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    const newErrors: Record<string, string> = {};
    if (!signupData.username) newErrors.username = 'Username is required';
    if (!signupData.email) newErrors.email = 'Email is required';
    if (!signupData.password) newErrors.password = 'Password is required';
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.signup(signupData.username, signupData.email, signupData.password);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      snackbar.show({ title: 'Success', description: 'Account created successfully', status: 'success', duration: 2000 });
      router.replace('/');
    } catch (error: any) {
      snackbar.show({ title: 'Error', description: error.response?.data?.error || 'Signup failed', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBlock}>
        <Text variant="displaySmall">💰 Finance Tracker</Text>
        <Text style={styles.subtitle}>Manage your finances intelligently</Text>
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={(v) => setTab(v as 'signin' | 'signup')}
        buttons={[
          { value: 'signin', label: 'Sign In' },
          { value: 'signup', label: 'Sign Up' },
        ]}
        style={styles.tabs}
      />

      {tab === 'signin' ? (
        <View style={styles.form}>
          <TextInput
            label="Email Address *"
            placeholder="you@example.com"
            value={loginData.email}
            onChangeText={(v) => setLoginField('email', v)}
            error={!!errors.email}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Password *"
            placeholder="••••••••"
            secureTextEntry
            value={loginData.password}
            onChangeText={(v) => setLoginField('password', v)}
            error={!!errors.password}
          />
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>

          <Button mode="contained" onPress={handleLogin} loading={isLoading} disabled={isLoading}>
            Sign In
          </Button>

          <Divider style={styles.divider} />

          <View style={styles.switchRow}>
            <Text style={styles.subtitle}>Don't have an account?</Text>
            <Button mode="text" compact onPress={() => setTab('signup')}>
              Sign up
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            label="Username *"
            placeholder="your username"
            value={signupData.username}
            onChangeText={(v) => setSignupField('username', v)}
            error={!!errors.username}
          />
          <HelperText type="error" visible={!!errors.username}>
            {errors.username}
          </HelperText>

          <TextInput
            label="Email Address *"
            placeholder="you@example.com"
            value={signupData.email}
            onChangeText={(v) => setSignupField('email', v)}
            error={!!errors.email}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Password *"
            placeholder="••••••••"
            secureTextEntry
            value={signupData.password}
            onChangeText={(v) => setSignupField('password', v)}
            error={!!errors.password}
          />
          <HelperText type={errors.password ? 'error' : 'info'} visible>
            {errors.password || 'Min 8 chars, uppercase, lowercase, and number'}
          </HelperText>

          <TextInput
            label="Confirm Password *"
            placeholder="••••••••"
            secureTextEntry
            value={signupData.confirmPassword}
            onChangeText={(v) => setSignupField('confirmPassword', v)}
            error={!!errors.confirmPassword}
          />
          <HelperText type="error" visible={!!errors.confirmPassword}>
            {errors.confirmPassword}
          </HelperText>

          <Button mode="contained" onPress={handleSignup} loading={isLoading} disabled={isLoading}>
            Sign Up
          </Button>

          <Divider style={styles.divider} />

          <View style={styles.switchRow}>
            <Text style={styles.subtitle}>Already have an account?</Text>
            <Button mode="text" compact onPress={() => setTab('signin')}>
              Sign in
            </Button>
          </View>
        </View>
      )}

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    gap: 32,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  headerBlock: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    color: '#888',
  },
  tabs: {
    width: '100%',
  },
  form: {
    gap: 4,
    padding: 32,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default LoginPage;
