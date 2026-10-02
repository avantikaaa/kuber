import React from 'react';
import { Container, Heading, VStack, Box, Divider } from '@chakra-ui/react';
import { TransactionForm } from '../components/TransactionForm';
import { EmailSuggestions } from '../components/EmailSuggestions';

export const AddTransactionPage: React.FC = () => {
  return (
    <Container maxW="2xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Email Suggestions */}
        <Box>
          <Heading size="md" mb={6}>
            📧 Suggested from Email
          </Heading>
          <EmailSuggestions />
        </Box>

        <Divider />

        {/* Manual Entry Form */}
        <Box>
          <Heading size="xl" mb={6}>
            + Add Transaction Manually
          </Heading>
          <TransactionForm />
        </Box>
      </VStack>
    </Container>
  );
};

export default AddTransactionPage;
