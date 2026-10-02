import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Button,
  Text,
  DataTable,
  Badge,
  Portal,
  Dialog,
  TextInput,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useTransactions, useDeleteTransaction } from '@hooks/useTransactions';
import { format } from 'date-fns';
import { useSnackbar } from '@utils/useSnackbar';
import type { Transaction } from '../types';

export const TransactionList: React.FC = () => {
  const snackbar = useSnackbar();
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    categoryId: '',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const { data: transactions = [], isLoading } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      snackbar.show({ title: 'Success', description: 'Transaction deleted', status: 'success', duration: 2000 });
      setDialogVisible(false);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to delete transaction', status: 'error' });
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Transactions
      </Text>

      <View style={styles.filters}>
        <TextInput
          label="From date"
          placeholder="YYYY-MM-DD"
          value={filters.from}
          onChangeText={(v) => setFilters((prev) => ({ ...prev, from: v }))}
          style={styles.filterInput}
        />
        <TextInput
          label="To date"
          placeholder="YYYY-MM-DD"
          value={filters.to}
          onChangeText={(v) => setFilters((prev) => ({ ...prev, to: v }))}
          style={styles.filterInput}
        />
        <Button mode="outlined" onPress={() => setFilters({ from: '', to: '', categoryId: '' })}>
          Clear Filters
        </Button>
      </View>

      {isLoading ? (
        <View style={styles.emptyBox}>
          <ActivityIndicator />
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.muted}>No transactions found. Create one to get started!</Text>
        </View>
      ) : (
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.colWide}>Description</DataTable.Title>
              <DataTable.Title numeric style={styles.col}>Amount</DataTable.Title>
              <DataTable.Title style={styles.col}>Category</DataTable.Title>
              <DataTable.Title style={styles.col}>Payment Mode</DataTable.Title>
              <DataTable.Title style={styles.col}>Date</DataTable.Title>
              <DataTable.Title style={styles.colWide}>Actions</DataTable.Title>
            </DataTable.Header>

            {transactions.map((transaction: Transaction) => (
              <DataTable.Row key={transaction.id}>
                <DataTable.Cell style={styles.colWide}>{transaction.description}</DataTable.Cell>
                <DataTable.Cell numeric style={styles.col}>
                  {transaction.currency} {transaction.amount.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell style={styles.col}>
                  <Badge>{transaction.category_id}</Badge>
                </DataTable.Cell>
                <DataTable.Cell style={styles.col}>{transaction.mode_of_payment}</DataTable.Cell>
                <DataTable.Cell style={styles.col}>
                  {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                </DataTable.Cell>
                <DataTable.Cell style={styles.colWide}>
                  <View style={styles.rowActions}>
                    <Button compact onPress={() => handleViewDetails(transaction)}>
                      View
                    </Button>
                    <Button
                      compact
                      textColor="#D32F2F"
                      onPress={() => handleDelete(transaction.id)}
                      loading={deleteMutation.isLoading}
                    >
                      Delete
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Transaction Details</Dialog.Title>
          <Dialog.Content>
            {selectedTransaction && (
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.mutedSmallBold}>Description</Text>
                  <Text variant="titleMedium">{selectedTransaction.description}</Text>
                </View>
                <View>
                  <Text style={styles.mutedSmallBold}>Amount</Text>
                  <Text variant="titleMedium">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.mutedSmallBold}>Payment Mode</Text>
                  <Badge>{selectedTransaction.mode_of_payment}</Badge>
                </View>
                <View>
                  <Text style={styles.mutedSmallBold}>Category</Text>
                  <Badge>{selectedTransaction.category_id}</Badge>
                </View>
                <View>
                  <Text style={styles.mutedSmallBold}>Date</Text>
                  <Text>{format(new Date(selectedTransaction.transaction_date), 'PPP')}</Text>
                </View>
                <View>
                  <Text style={styles.mutedSmallBold}>Created</Text>
                  <Text style={{ fontSize: 13 }}>
                    {format(new Date(selectedTransaction.created_at), 'PPpp')}
                  </Text>
                </View>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  heading: {
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterInput: {
    minWidth: 140,
  },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
  },
  muted: {
    color: '#888',
    fontSize: 16,
  },
  mutedSmallBold: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  table: {
    minWidth: 700,
  },
  col: {
    minWidth: 100,
  },
  colWide: {
    minWidth: 160,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 4,
  },
});
