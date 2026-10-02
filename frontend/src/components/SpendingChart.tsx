import React, { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Heading,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { query } from '@utils/api';
import { getCategoryColor } from '@utils/theme';

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

export const SpendingChart: React.FC = () => {
  const toast = useToast();
  const [view, setView] = useState<'pie' | 'trend'>('pie');
  const [period, setPeriod] = useState<'7' | '30' | '90' | '180'>('30');
  const [data, setData] = useState<SpendingData[] | TrendData[]>([]);
  const [total, setTotal] = useState('0');
  const [loading, setLoading] = useState(false);

  const fetchData = async (v: 'pie' | 'trend', p: string) => {
    setLoading(true);
    try {
      const response = await query.getSpendingTrends(p, v === 'pie' ? 'category' : 'trend');
      setData(response.data);
      setTotal(response.total || '0');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load spending data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(view, period);
  }, [view, period]);

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="lg" color="brand.light.primary" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={4}>
          Spending Analytics
        </Heading>

        {/* Controls */}
        <HStack spacing={4} mb={6} flexWrap="wrap">
          <HStack spacing={2}>
            <Text fontWeight="bold">View:</Text>
            <Button
              size="sm"
              variant={view === 'pie' ? 'solid' : 'outline'}
              onClick={() => setView('pie')}
            >
              Distribution
            </Button>
            <Button
              size="sm"
              variant={view === 'trend' ? 'solid' : 'outline'}
              onClick={() => setView('trend')}
            >
              Trend
            </Button>
          </HStack>

          <HStack spacing={2}>
            <Text fontWeight="bold">Period:</Text>
            {(['7', '30', '90', '180'] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'solid' : 'outline'}
                onClick={() => setPeriod(p)}
              >
                {p === '7' ? '7d' : p === '30' ? '30d' : p === '90' ? '90d' : '6m'}
              </Button>
            ))}
          </HStack>
        </HStack>
      </Box>

      {/* Chart */}
      <Box bg="bg-secondary" p={6} borderRadius="lg" h="400px">
        {data.length === 0 ? (
          <Center h="full">
            <Text color="gray.500">No data available for this period</Text>
          </Center>
        ) : view === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data as SpendingData[]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="total"
              >
                {(data as SpendingData[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getCategoryColor(index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data as TrendData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1A1A3E"
                strokeWidth={2}
                name="Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Summary */}
      <Box bg="bg-secondary" p={6} borderRadius="lg">
        <VStack align="start" spacing={2}>
          <Text fontSize="sm" color="gray.500" fontWeight="bold">
            TOTAL SPENDING
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="brand.light.primary">
            ${parseFloat(total).toFixed(2)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Last {period === '7' ? '7 days' : period === '30' ? '30 days' : period === '90' ? '90 days' : '6 months'}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};
