import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@utils/api';
import { useTransactionStore } from '@utils/store';

export const useTransactions = (filters?: any) => {
  const { setTransactions } = useTransactionStore();

  return useQuery(
    ['transactions', filters],
    async () => {
      const response = await apiClient.getTransactions(filters);
      setTransactions(response.data);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useTransaction = (id: number) => {
  return useQuery(
    ['transaction', id],
    async () => {
      const response = await apiClient.getTransaction(id);
      return response.data;
    }
  );
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { addTransaction } = useTransactionStore();

  return useMutation(
    async (data: any) => {
      const response = await apiClient.createTransaction(data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        addTransaction(data);
        queryClient.invalidateQueries('transactions');
      },
    }
  );
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { updateTransaction: updateStoreTransaction } = useTransactionStore();

  return useMutation(
    async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.updateTransaction(id, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        updateStoreTransaction(data.id, data);
        queryClient.invalidateQueries(['transactions', { id: data.id }]);
      },
    }
  );
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { removeTransaction } = useTransactionStore();

  return useMutation(
    async (id: number) => {
      await apiClient.deleteTransaction(id);
    },
    {
      onSuccess: (_, id) => {
        removeTransaction(id);
        queryClient.invalidateQueries('transactions');
      },
    }
  );
};
