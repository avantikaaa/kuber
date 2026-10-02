import React from 'react';
import { HStack, Button, Box, useColorMode, Heading, Spacer, Badge } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg="bg-secondary" borderBottom="1px" borderColor="border-color" px={6} py={4} position="sticky" top={0} zIndex={10}>
      <HStack spacing={6} justify="space-between">
        <Heading size="md">💰 Finance Tracker</Heading>

        <HStack spacing={4}>
          <Button as={ReactRouterLink} to="/" variant="ghost" size="sm">
            Home
          </Button>
          <Button as={ReactRouterLink} to="/add-transaction" variant="ghost" size="sm">
            + Add
          </Button>
          <Button as={ReactRouterLink} to="/transactions" variant="ghost" size="sm">
            Transactions
          </Button>
          <Button as={ReactRouterLink} to="/profile" variant="ghost" size="sm">
            Profile
          </Button>
        </HStack>

        <Spacer />

        <HStack spacing={2}>
          <Button size="sm" variant="ghost" onClick={toggleColorMode}>
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>
          <Button as={ReactRouterLink} to="/login" variant="outline" size="sm">
            Login
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
