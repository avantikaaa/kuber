import React from 'react';
import { Container, VStack, Box, Heading, Grid, GridItem, Button, HStack } from '@chakra-ui/react';
import { SpendingChart } from '../components/SpendingChart';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="2xl" mb={2}>
            Finance Dashboard
          </Heading>
          <HStack spacing={4}>
            <Button as={Link} to="/add-transaction" colorScheme="blue">
              + Add Transaction
            </Button>
            <Button as={Link} to="/transactions" variant="outline">
              View All Transactions
            </Button>
          </HStack>
        </Box>

        {/* Analytics */}
        <SpendingChart />

        {/* Quick Stats (to be populated with real data) */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
          <GridItem bg="bg-secondary" p={6} borderRadius="lg">
            <Box mb={2} fontSize="sm" color="gray.500" fontWeight="bold">
              TRANSACTIONS THIS MONTH
            </Box>
            <Box fontSize="2xl" fontWeight="bold">
              --
            </Box>
          </GridItem>

          <GridItem bg="bg-secondary" p={6} borderRadius="lg">
            <Box mb={2} fontSize="sm" color="gray.500" fontWeight="bold">
              AVERAGE TRANSACTION
            </Box>
            <Box fontSize="2xl" fontWeight="bold">
              --
            </Box>
          </GridItem>

          <GridItem bg="bg-secondary" p={6} borderRadius="lg">
            <Box mb={2} fontSize="sm" color="gray.500" fontWeight="bold">
              TOP CATEGORY
            </Box>
            <Box fontSize="2xl" fontWeight="bold">
              --
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default HomePage;
