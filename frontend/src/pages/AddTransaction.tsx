import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { TransactionForm } from '../components/TransactionForm';
import { EmailSuggestions } from '../components/EmailSuggestions';

export const AddTransactionPage: React.FC = () => {
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text variant="titleMedium" style={styles.heading}>
          📧 Suggested from Email
        </Text>
        <EmailSuggestions />
      </View>

      <Divider />

      <View>
        <Text variant="headlineMedium" style={styles.heading}>
          + Add Transaction Manually
        </Text>
        <View style={[styles.formWrap, { backgroundColor: theme.colors.surface }]}>
          <TransactionForm />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  heading: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  formWrap: {
    borderRadius: 12,
  },
});

export default AddTransactionPage;
