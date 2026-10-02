import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  HStack,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { apiClient } from '@utils/api';
import { useAuthStore } from '@utils/store';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setToken, setUser } = useAuthStore();

  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast({
        title: 'Success',
        description: 'Logged in successfully',
        status: 'success',
        duration: 2000,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Login failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const response = await apiClient.signup(
        signupData.username,
        signupData.email,
        signupData.password
      );
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      toast({
        title: 'Success',
        description: 'Account created successfully',
        status: 'success',
        duration: 2000,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Signup failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="sm" py={20}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="2xl" mb={2}>
            💰 Finance Tracker
          </Heading>
          <Text color="gray.600">Manage your finances intelligently</Text>
        </Box>

        <Tabs index={tabIndex} onChange={setTabIndex} w="full">
          <TabList mb="1em">
            <Tab flex={1}>Sign In</Tab>
            <Tab flex={1}>Sign Up</Tab>
          </TabList>

          <TabPanels>
            {/* Sign In Tab */}
            <TabPanel>
              <Box as="form" onSubmit={handleLogin} w="full" p={8} bg="bg-secondary" borderRadius="lg">
                <VStack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />
                    {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                    {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>

                  <Divider />

                  <HStack spacing={2} justify="center" w="full">
                    <Text color="gray.600" fontSize="sm">
                      Don't have an account?
                    </Text>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                      onClick={() => setTabIndex(1)}
                    >
                      Sign up
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </TabPanel>

            {/* Sign Up Tab */}
            <TabPanel>
              <Box as="form" onSubmit={handleSignup} w="full" p={8} bg="bg-secondary" borderRadius="lg">
                <VStack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      name="username"
                      placeholder="your username"
                      value={signupData.username}
                      onChange={handleSignupChange}
                    />
                    {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                    />
                    {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={handleSignupChange}
                    />
                    {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Min 8 chars, uppercase, lowercase, and number
                    </Text>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                    />
                    {errors.confirmPassword && (
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Sign Up
                  </Button>

                  <Divider />

                  <HStack spacing={2} justify="center" w="full">
                    <Text color="gray.600" fontSize="sm">
                      Already have an account?
                    </Text>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                      onClick={() => setTabIndex(0)}
                    >
                      Sign in
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default LoginPage;
