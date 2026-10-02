import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Badge,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { apiClient } from '@utils/api';
import { format } from 'date-fns';

interface EmailAccount {
  id: number;
  email_address: string;
  provider: string;
  is_active: boolean;
  last_synced_at?: string;
  created_at: string;
}

export const EmailAccountManager: React.FC = () => {
  const toast = useToast();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newAccount, setNewAccount] = useState({
    email_address: '',
    provider: 'gmail',
  });

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // TODO: Use actual API call when connected
      // const response = await apiClient.getEmailAccounts();
      // setAccounts(response.data);
      setAccounts([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load email accounts',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.email_address) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // TODO: Implement OAuth flow for actual email provider
      // For now, just show a placeholder
      toast({
        title: 'Info',
        description: `OAuth flow for ${newAccount.provider} not yet implemented. This will be added in Phase 3.`,
        status: 'info',
        duration: 5000,
      });

      setNewAccount({ email_address: '', provider: 'gmail' });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add email account',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRemoveAccount = async (id: number) => {
    if (confirm('Are you sure you want to remove this email account?')) {
      try {
        // TODO: Call API when connected
        // await apiClient.removeEmailAccount(id);
        setAccounts(accounts.filter((a) => a.id !== id));
        toast({
          title: 'Success',
          description: 'Email account removed',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove email account',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSyncAccount = async (id: number) => {
    try {
      setSyncing(id);
      // TODO: Call API when connected
      // await apiClient.syncEmailAccount(id);
      toast({
        title: 'Info',
        description: 'Email sync not yet implemented. Will be added in Phase 3.',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync emails',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSyncing(null);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="md">Connected Email Accounts</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          + Add Account
        </Button>
      </HStack>

      {loading ? (
        <Center h="200px">
          <Spinner />
        </Center>
      ) : accounts.length === 0 ? (
        <Box p={8} bg="bg-secondary" borderRadius="lg" textAlign="center">
          <Text color="gray.500" mb={4}>
            No email accounts connected yet
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Connect Your Email
          </Button>
        </Box>
      ) : (
        accounts.map((account) => (
          <Box key={account.id} p={4} bg="bg-secondary" borderRadius="lg">
            <HStack justify="space-between" mb={3}>
              <VStack align="start" spacing={1}>
                <HStack>
                  <Text fontWeight="bold">{account.email_address}</Text>
                  {account.is_active && (
                    <Badge colorScheme="green">Active</Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  Provider: {account.provider.toUpperCase()}
                </Text>
                {account.last_synced_at && (
                  <Text fontSize="sm" color="gray.500">
                    Last synced:{' '}
                    {format(new Date(account.last_synced_at), 'MMM dd, yyyy HH:mm')}
                  </Text>
                )}
              </VStack>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncAccount(account.id)}
                  isLoading={syncing === account.id}
                  loadingText="Syncing..."
                >
                  Sync
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemoveAccount(account.id)}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))
      )}

      {/* Add Email Account Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Email Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box p={4} bg="blue.50" borderRadius="lg" w="full">
                <Text fontSize="sm" color="blue.800">
                  <strong>Note:</strong> OAuth2 authentication will be implemented in Phase 3.
                  Currently showing UI placeholder.
                </Text>
              </Box>

              <FormControl>
                <FormLabel>Email Provider</FormLabel>
                <Select
                  value={newAccount.provider}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, provider: e.target.value })
                  }
                >
                  <option value="gmail">Gmail (Google Account)</option>
                  <option value="outlook">Outlook / Microsoft</option>
                  <option value="icloud">iCloud Mail</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input
                  placeholder="your.email@gmail.com"
                  value={newAccount.email_address}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email_address: e.target.value })
                  }
                />
              </FormControl>

              <Box p={4} bg="yellow.50" borderRadius="lg" w="full">
                <Text fontSize="xs" color="yellow.800">
                  Click "Connect" to open your email provider's login. We'll never store your
                  password.
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddAccount}>
              Connect Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
