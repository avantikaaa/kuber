import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useCreateTransaction, useUpdateTransaction } from '@hooks/useTransactions';
import { useCategories, useCreateCategory, useSubcategories } from '@hooks/useCategories';
import { getCategoryColor } from '@utils/theme';
import type { Transaction } from '@types/index';

const NEW_CATEGORY_VALUE = '__new__';

interface TransactionFormProps {
  initialData?: Transaction;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const toast = useToast();
  const { data: categories } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialData?.category_id || null
  );
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { data: subcategories } = useSubcategories(selectedCategory!);

  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    currency: initialData?.currency || 'USD',
    mode_of_payment: initialData?.mode_of_payment || 'card',
    category_id: initialData?.category_id || '',
    subcategory_id: initialData?.subcategory_id || '',
    bank_account_id: initialData?.bank_account_id || '',
    transaction_date: initialData?.transaction_date || new Date().toISOString().split('T')[0],
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset subcategory when category changes
    if (name === 'category_id') {
      if (value === NEW_CATEGORY_VALUE) {
        setIsNewCategory(true);
        setSelectedCategory(null);
        setFormData((prev) => ({ ...prev, subcategory_id: '' }));
        return;
      }
      setIsNewCategory(false);
      setSelectedCategory(parseInt(value));
      setFormData((prev) => ({ ...prev, subcategory_id: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || (!formData.category_id && !isNewCategory)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (isNewCategory && !newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      let categoryId: number;
      if (isNewCategory) {
        const newCategory = await createCategoryMutation.mutateAsync({
          name: newCategoryName.trim(),
          color: getCategoryColor(categories?.length || 0),
        });
        categoryId = newCategory.id;
      } else {
        categoryId = parseInt(formData.category_id as string);
      }

      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            ...formData,
            amount: parseFloat(formData.amount as string),
            category_id: categoryId,
            subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id as string) : null,
            bank_account_id: formData.bank_account_id ? parseInt(formData.bank_account_id as string) : null,
          },
        });
        toast({
          title: 'Success',
          description: 'Transaction updated',
          status: 'success',
          duration: 2000,
        });
      } else {
        await createMutation.mutateAsync({
          ...formData,
          amount: parseFloat(formData.amount as string),
          category_id: categoryId,
          subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id as string) : null,
          bank_account_id: formData.bank_account_id ? parseInt(formData.bank_account_id as string) : null,
        });
        toast({
          title: 'Success',
          description: 'Transaction created',
          status: 'success',
          duration: 2000,
        });
        setFormData({
          description: '',
          amount: '',
          currency: 'USD',
          mode_of_payment: 'card',
          category_id: '',
          subcategory_id: '',
          bank_account_id: '',
          transaction_date: new Date().toISOString().split('T')[0],
        });
        setIsNewCategory(false);
        setNewCategoryName('');
      }
      onSuccess && onSuccess({} as Transaction);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save transaction',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="bg-secondary" borderRadius="lg">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            placeholder="What did you buy?"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <HStack spacing={4} w="full">
          <FormControl isRequired flex={1}>
            <FormLabel>Amount</FormLabel>
            <Input
              name="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired flex={1}>
            <FormLabel>Currency</FormLabel>
            <Select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
            </Select>
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel>Mode of Payment</FormLabel>
          <Select name="mode_of_payment" value={formData.mode_of_payment} onChange={handleChange}>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="wallet">Wallet</option>
            <option value="cheque">Cheque</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          {isNewCategory ? (
            <HStack>
              <Input
                autoFocus
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewCategory(false);
                  setNewCategoryName('');
                }}
              >
                Cancel
              </Button>
            </HStack>
          ) : (
            <Select
              name="category_id"
              placeholder="Select category"
              value={formData.category_id}
              onChange={handleChange}
            >
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value={NEW_CATEGORY_VALUE}>+ Add new category</option>
            </Select>
          )}
        </FormControl>

        {!isNewCategory && selectedCategory && subcategories && subcategories.length > 0 && (
          <FormControl>
            <FormLabel>Subcategory</FormLabel>
            <Select
              name="subcategory_id"
              placeholder="Select subcategory (optional)"
              value={formData.subcategory_id}
              onChange={handleChange}
            >
              <option value="">None</option>
              {subcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel>Date</FormLabel>
          <Input
            name="transaction_date"
            type="date"
            value={formData.transaction_date}
            onChange={handleChange}
          />
        </FormControl>

        <HStack spacing={4} w="full" justifyContent="flex-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} isDisabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText={initialData ? 'Updating...' : 'Creating...'}
          >
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
