import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TransactionList } from '../components/TransactionList';

export const TransactionsPage: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TransactionList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
});

export default TransactionsPage;
