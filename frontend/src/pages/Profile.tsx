import React, { useState } from 'react';
import {
  Container,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  HStack,
  Text,
  Select,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { EmailAccountManager } from '../components/EmailAccountManager';

export const ProfilePage: React.FC = () => {
  const toast = useToast();
  const [profileData, setProfileData] = useState({
    username: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
  });

  const [settings, setSettings] = useState({
    theme: 'system',
    currency: 'USD',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement profile update in Phase 1
    console.log('Save profile (not implemented yet)', profileData);

    toast({
      title: 'Info',
      description: 'Profile update will be implemented in Phase 1',
      status: 'info',
      duration: 3000,
    });

    setIsLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement settings update in Phase 1
    console.log('Save settings (not implemented yet)', settings);

    toast({
      title: 'Info',
      description: 'Settings update will be implemented in Phase 1',
      status: 'info',
      duration: 3000,
    });

    setIsLoading(false);
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl">Profile & Settings</Heading>
        </Box>

        <Tabs>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Preferences</Tab>
            <Tab>Email Accounts</Tab>
            <Tab>Account</Tab>
          </TabList>

          <TabPanels>
            {/* Profile Tab */}
            <TabPanel>
              <Box as="form" onSubmit={handleSaveProfile} p={6} bg="bg-secondary" borderRadius="lg">
                <Heading size="md" mb={6}>
                  Profile Information
                </Heading>

                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email (Read-only)</FormLabel>
                    <Input value={profileData.email} isDisabled />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Phone (Read-only)</FormLabel>
                    <Input value={profileData.phone} isDisabled />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    isLoading={isLoading}
                  >
                    Save Profile
                  </Button>
                </VStack>
              </Box>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel>
              <Box as="form" onSubmit={handleSaveSettings} p={6} bg="bg-secondary" borderRadius="lg">
                <Heading size="md" mb={6}>
                  Preferences
                </Heading>

                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <Select name="theme" value={settings.theme} onChange={handleSettingsChange}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Default Currency</FormLabel>
                    <Select name="currency" value={settings.currency} onChange={handleSettingsChange}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="GBP">GBP (£)</option>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    isLoading={isLoading}
                  >
                    Save Settings
                  </Button>
                </VStack>
              </Box>
            </TabPanel>

            {/* Email Accounts Tab */}
            <TabPanel>
              <EmailAccountManager />
            </TabPanel>

            {/* Account Tab */}
            <TabPanel>
              <Box p={6} bg="bg-secondary" borderRadius="lg">
                <Heading size="md" mb={6}>
                  Account
                </Heading>

                <VStack spacing={4}>
                  <Button w="full" variant="outline" colorScheme="blue">
                    Change Password
                  </Button>

                  <Button w="full" variant="outline" colorScheme="orange">
                    Export Data
                  </Button>

                  <Button w="full" variant="outline" colorScheme="red">
                    Sign Out
                  </Button>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box p={4} bg="yellow.50" borderRadius="lg" border="1px" borderColor="yellow.200">
          <Text fontSize="sm" color="yellow.800">
            <strong>Note:</strong> Full profile & settings functionality will be implemented in Phase 1.
            Email accounts placeholder showing Phase 3 UI.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
