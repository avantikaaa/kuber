import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  VStack,
  Text,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Badge,
  Input,
  Select,
} from '@chakra-ui/react';
import { useTransactions, useDeleteTransaction } from '@hooks/useTransactions';
import { format } from 'date-fns';
import type { Transaction } from '@types/index';

export const TransactionList: React.FC = () => {
  const toast = useToast();
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    categoryId: '',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: transactions = [], isLoading } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({
          title: 'Success',
          description: 'Transaction deleted',
          status: 'success',
          duration: 2000,
        });
        onClose();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete transaction',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    onOpen();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={4}>
          Transactions
        </Heading>

        {/* Filters */}
        <HStack spacing={4} mb={6}>
          <Input
            name="from"
            type="date"
            placeholder="From date"
            value={filters.from}
            onChange={handleFilterChange}
          />
          <Input
            name="to"
            type="date"
            placeholder="To date"
            value={filters.to}
            onChange={handleFilterChange}
          />
          <Button
            onClick={() => setFilters({ from: '', to: '', categoryId: '' })}
            variant="outline"
          >
            Clear Filters
          </Button>
        </HStack>

        {/* Transaction Table */}
        {transactions.length === 0 ? (
          <Box p={8} textAlign="center" bg="bg-secondary" borderRadius="lg">
            <Text fontSize="lg" color="gray.500">
              No transactions found. Create one to get started!
            </Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr bg="bg-secondary">
                  <Th>Description</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Category</Th>
                  <Th>Payment Mode</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction: Transaction) => (
                  <Tr key={transaction.id} _hover={{ bg: 'bg-secondary' }}>
                    <Td>{transaction.description}</Td>
                    <Td isNumeric fontWeight="bold">
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </Td>
                    <Td>
                      <Badge colorScheme="blue">{transaction.category_id}</Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme="purple" textTransform="capitalize">
                        {transaction.mode_of_payment}
                      </Badge>
                    </Td>
                    <Td>{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(transaction.id)}
                          isLoading={deleteMutation.isLoading}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Transaction Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <VStack spacing={4} align="start">
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Description
                  </Text>
                  <Text fontSize="lg">{selectedTransaction.description}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Amount
                  </Text>
                  <Text fontSize="lg">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Payment Mode
                  </Text>
                  <Badge colorScheme="purple" textTransform="capitalize">
                    {selectedTransaction.mode_of_payment}
                  </Badge>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Category
                  </Text>
                  <Badge colorScheme="blue">{selectedTransaction.category_id}</Badge>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Date
                  </Text>
                  <Text>{format(new Date(selectedTransaction.transaction_date), 'PPP')}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">
                    Created
                  </Text>
                  <Text fontSize="sm">
                    {format(new Date(selectedTransaction.created_at), 'PPpp')}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
