import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Badge,
  Text,
  Card,
  CardBody,
  Spinner,
  Center,
  useToast,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { apiClient } from '@utils/api';
import { useCategories } from '@hooks/useCategories';

interface EmailSuggestion {
  id: number;
  email_id: string;
  email_subject: string;
  email_body: string;
  created_at: string;
}

export const EmailSuggestions: React.FC = () => {
  const toast = useToast();
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailSuggestion | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [importing, setImporting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: categories = [] } = useCategories();

  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // TODO: Use actual API when connected
      // const response = await apiClient.getEmailSuggestions();
      // setSuggestions(response.data);
      setSuggestions([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load email suggestions',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (emailId: string) => {
    if (!categoryId) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setImporting(true);
      // TODO: Call API when connected
      // await apiClient.createTransactionFromEmail(emailId, { categoryId: parseInt(categoryId) });

      toast({
        title: 'Info',
        description: 'Email import not yet fully implemented. Will be added in Phase 3.',
        status: 'info',
        duration: 3000,
      });

      // Remove from suggestions
      setSuggestions(suggestions.filter((s) => s.email_id !== emailId));
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import email',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setImporting(false);
    }
  };

  const handleSkip = async (emailId: string) => {
    try {
      // TODO: Call API when connected
      // await apiClient.skipEmailSuggestion(emailId);
      setSuggestions(suggestions.filter((s) => s.email_id !== emailId));
      toast({
        title: 'Success',
        description: 'Email skipped',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to skip email',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleQuickAdd = (email: EmailSuggestion) => {
    setSelectedEmail(email);
    setCategoryId('');
    onOpen();
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner />
      </Center>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Box p={8} bg="bg-secondary" borderRadius="lg" textAlign="center">
        <Text color="gray.500" mb={4}>
          No pending email imports
        </Text>
        <Text fontSize="sm" color="gray.400">
          Connect an email account and sync to see transaction suggestions
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Suggested from Email</Heading>

      <VStack spacing={4}>
        {suggestions.map((email) => (
          <Card key={email.id} w="full">
            <CardBody>
              <VStack align="start" spacing={2}>
                <Box>
                  <Heading size="sm" mb={1}>
                    {email.email_subject}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {email.email_body}
                  </Text>
                </Box>

                <HStack spacing={2} w="full" justify="flex-end">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleQuickAdd(email)}
                  >
                    Quick Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSkip(email.email_id)}
                  >
                    Skip
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Import Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import from Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEmail && (
              <VStack spacing={4} align="start">
                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="bold">
                    EMAIL SUBJECT
                  </Text>
                  <Text mb={4}>{selectedEmail.email_subject}</Text>
                </Box>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    placeholder="Select a category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Box p={4} bg="blue.50" borderRadius="lg" w="full">
                  <Text fontSize="sm" color="blue.800">
                    <strong>Note:</strong> Email parsing is not fully implemented yet. A basic
                    transaction will be created. Full extraction coming in Phase 3.
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() =>
                selectedEmail && handleImport(selectedEmail.email_id)
              }
              isLoading={importing}
              loadingText="Importing..."
            >
              Import Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
