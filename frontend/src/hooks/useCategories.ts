import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@utils/api';
import { useCategoryStore } from '@utils/store';

export const useCategories = () => {
  const { setCategories } = useCategoryStore();

  return useQuery(
    ['categories'],
    async () => {
      const response = await apiClient.getCategories();
      setCategories(response.data);
      return response.data;
    },
    { staleTime: 10 * 60 * 1000 } // 10 minutes
  );
};

export const useSubcategories = (categoryId: number) => {
  return useQuery(
    ['subcategories', categoryId],
    async () => {
      const response = await apiClient.getSubcategories(categoryId);
      return response.data;
    }
  );
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { addCategory } = useCategoryStore();

  return useMutation(
    async (data: any) => {
      const response = await apiClient.createCategory(data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        addCategory(data);
        queryClient.invalidateQueries('categories');
      },
    }
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { updateCategory: updateStoreCategory } = useCategoryStore();

  return useMutation(
    async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.updateCategory(id, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        updateStoreCategory(data.id, data);
        queryClient.invalidateQueries('categories');
      },
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { removeCategory } = useCategoryStore();

  return useMutation(
    async (id: number) => {
      await apiClient.deleteCategory(id);
    },
    {
      onSuccess: (_, id) => {
        removeCategory(id);
        queryClient.invalidateQueries('categories');
      },
    }
  );
};

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ categoryId, data }: { categoryId: number; data: any }) => {
      const response = await apiClient.createSubcategory(categoryId, data);
      return response.data;
    },
    {
      onSuccess: (_, { categoryId }) => {
        queryClient.invalidateQueries(['subcategories', categoryId]);
      },
    }
  );
};
