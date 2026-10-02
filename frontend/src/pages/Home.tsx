import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useAppNavigation } from '@utils/navigation';
import { SpendingChart } from '../components/SpendingChart';

export const HomePage: React.FC = () => {
  const router = useAppNavigation();
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text variant="displaySmall" style={styles.heading}>
          Finance Dashboard
        </Text>
        <View style={styles.actionsRow}>
          <Button mode="contained" onPress={() => router.push('/add-transaction')}>
            + Add Transaction
          </Button>
          <Button mode="outlined" onPress={() => router.push('/transactions')}>
            View All Transactions
          </Button>
        </View>
      </View>

      <SpendingChart />

      <View style={styles.statsGrid}>
        {[
          { label: 'TRANSACTIONS THIS MONTH', value: '--' },
          { label: 'AVERAGE TRANSACTION', value: '--' },
          { label: 'TOP CATEGORY', value: '--' },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text variant="headlineSmall" style={styles.statValue}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
  },
  heading: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flexGrow: 1,
    minWidth: 180,
    padding: 24,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
  },
});

export default HomePage;
