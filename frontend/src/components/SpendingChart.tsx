import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Text, ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { apiClient } from '@utils/api';
import { getCategoryColor } from '@utils/theme';
import { useSnackbar } from '@utils/useSnackbar';

interface SpendingData {
  id: number;
  name: string;
  color: string;
  total: number;
  count: number;
  percentage?: string;
}

interface TrendData {
  date: string;
  total: number;
  count: number;
}

const PERIODS = ['7', '30', '90', '180'] as const;
const periodLabel = (p: string) => (p === '7' ? '7d' : p === '30' ? '30d' : p === '90' ? '90d' : '6m');

export const SpendingChart: React.FC = () => {
  const theme = useTheme();
  const snackbar = useSnackbar();
  const [view, setView] = useState<'pie' | 'trend'>('pie');
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('30');
  const [data, setData] = useState<SpendingData[] | TrendData[]>([]);
  const [total, setTotal] = useState('0');
  const [loading, setLoading] = useState(false);

  const fetchData = async (v: 'pie' | 'trend', p: string) => {
    setLoading(true);
    try {
      const response = await apiClient.getSpendingTrends(p, v === 'pie' ? 'category' : 'trend');
      setData(response.data.data ?? response.data);
      setTotal(response.data.total || '0');
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to load spending data', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(view, period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, period]);

  const screenWidth = Dimensions.get('window').width - 48;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Spending Analytics
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.controlsRow}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>View:</Text>
          <Button mode={view === 'pie' ? 'contained' : 'outlined'} onPress={() => setView('pie')} compact style={styles.controlBtn}>
            Distribution
          </Button>
          <Button mode={view === 'trend' ? 'contained' : 'outlined'} onPress={() => setView('trend')} compact style={styles.controlBtn}>
            Trend
          </Button>
        </View>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Period:</Text>
          {PERIODS.map((p) => (
            <Button
              key={p}
              mode={period === p ? 'contained' : 'outlined'}
              onPress={() => setPeriod(p)}
              compact
              style={styles.controlBtn}
            >
              {periodLabel(p)}
            </Button>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.chartBox, { backgroundColor: theme.colors.surface }]}>
        {data.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.muted}>No data available for this period</Text>
          </View>
        ) : view === 'pie' ? (
          <PieChart
            data={(data as SpendingData[]).map((entry, index) => ({
              name: entry.name,
              population: entry.total,
              color: entry.color || getCategoryColor(index),
              legendFontColor: theme.colors.onSurface,
              legendFontSize: 12,
            }))}
            width={screenWidth}
            height={260}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="8"
          />
        ) : (
          <LineChart
            data={{
              labels: (data as TrendData[]).map((d) => d.date.slice(5)),
              datasets: [{ data: (data as TrendData[]).map((d) => d.total) }],
            }}
            width={screenWidth}
            height={260}
            chartConfig={chartConfig}
            bezier
          />
        )}
      </View>

      <View style={[styles.summaryBox, { backgroundColor: theme.colors.surface }]}>
        <Text style={styles.muted}>TOTAL SPENDING</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          ${parseFloat(total).toFixed(2)}
        </Text>
        <Text style={styles.muted}>
          Last {period === '7' ? '7 days' : period === '30' ? '30 days' : period === '90' ? '90 days' : '6 months'}
        </Text>
      </View>

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(26, 26, 62, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  decimalPlaces: 2,
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontWeight: 'bold',
  },
  controlsRow: {
    flexDirection: 'row',
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  controlLabel: {
    fontWeight: 'bold',
  },
  controlBtn: {
    marginRight: 4,
  },
  chartBox: {
    padding: 16,
    borderRadius: 12,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBox: {
    padding: 24,
    borderRadius: 12,
    gap: 4,
  },
  center: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
