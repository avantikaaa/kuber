import React from 'react';
import { Container, VStack, Box } from '@chakra-ui/react';
import { TransactionList } from '../components/TransactionList';

export const TransactionsPage: React.FC = () => {
  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <TransactionList />
        </Box>
      </VStack>
    </Container>
  );
};

export default TransactionsPage;
