import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Menu, Snackbar } from 'react-native-paper';
import { useCreateTransaction, useUpdateTransaction } from '@hooks/useTransactions';
import {
  useCategories,
  useCreateCategory,
  useCreateSubcategory,
  useSubcategories,
} from '@hooks/useCategories';
import { getCategoryColor } from '@utils/theme';
import { useSnackbar } from '@utils/useSnackbar';
import type { Transaction, Category, Subcategory } from '../types';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const PAYMENT_MODES = [
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'cash', label: 'Cash' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'cheque', label: 'Cheque' },
];

interface TransactionFormProps {
  initialData?: Transaction;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
}

// Simple labeled dropdown built from a Paper Menu, since Paper has no native <Select>.
const DropdownField: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}> = ({ label, value, options, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TextInput
          label={label}
          value={selected?.label || ''}
          editable={false}
          right={<TextInput.Icon icon="menu-down" onPress={() => setVisible(true)} />}
          onPressIn={() => setVisible(true)}
          style={styles.input}
        />
      }
    >
      {options.map((opt) => (
        <Menu.Item
          key={opt.value}
          title={opt.label}
          onPress={() => {
            onSelect(opt.value);
            setVisible(false);
          }}
        />
      ))}
    </Menu>
  );
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const snackbar = useSnackbar();
  const { data: categories } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialData?.category_id || null
  );
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { data: subcategories } = useSubcategories(selectedCategory!);
  const createSubcategoryMutation = useCreateSubcategory();
  const [isNewSubcategory, setIsNewSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount ? String(initialData.amount) : '',
    currency: initialData?.currency || 'USD',
    mode_of_payment: initialData?.mode_of_payment || 'card',
    category_id: initialData?.category_id ? String(initialData.category_id) : '',
    subcategory_id: initialData?.subcategory_id ? String(initialData.subcategory_id) : '',
    bank_account_id: initialData?.bank_account_id ? String(initialData.bank_account_id) : '',
    transaction_date: initialData?.transaction_date || new Date().toISOString().split('T')[0],
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const setField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (value: string) => {
    if (value === '__new__') {
      setIsNewCategory(true);
      setSelectedCategory(null);
      setFormData((prev) => ({ ...prev, category_id: value, subcategory_id: '' }));
      return;
    }
    setIsNewCategory(false);
    setSelectedCategory(parseInt(value));
    setFormData((prev) => ({ ...prev, category_id: value, subcategory_id: '' }));
    setIsNewSubcategory(false);
    setNewSubcategoryName('');
  };

  const handleSubcategorySelect = (value: string) => {
    if (value === '__new__') {
      setIsNewSubcategory(true);
      setFormData((prev) => ({ ...prev, subcategory_id: '' }));
      return;
    }
    setIsNewSubcategory(false);
    setField('subcategory_id', value);
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || (!formData.category_id && !isNewCategory)) {
      snackbar.show({ title: 'Error', description: 'Please fill in all required fields', status: 'error' });
      return;
    }

    if (isNewCategory && !newCategoryName.trim()) {
      snackbar.show({ title: 'Error', description: 'Please enter a category name', status: 'error' });
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
        categoryId = parseInt(formData.category_id);
      }

      let subcategoryId: number | null = null;
      if (isNewSubcategory) {
        if (!newSubcategoryName.trim()) {
          snackbar.show({ title: 'Error', description: 'Please enter a subcategory name', status: 'error' });
          return;
        }
        const newSubcategory = await createSubcategoryMutation.mutateAsync({
          categoryId,
          data: { name: newSubcategoryName.trim() },
        });
        subcategoryId = newSubcategory.id;
      } else if (formData.subcategory_id) {
        subcategoryId = parseInt(formData.subcategory_id);
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: categoryId,
        subcategory_id: subcategoryId,
        bank_account_id: formData.bank_account_id ? parseInt(formData.bank_account_id) : null,
      };

      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        snackbar.show({ title: 'Success', description: 'Transaction updated', status: 'success', duration: 2000 });
      } else {
        await createMutation.mutateAsync(payload);
        snackbar.show({ title: 'Success', description: 'Transaction created', status: 'success', duration: 2000 });
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
        setIsNewSubcategory(false);
        setNewSubcategoryName('');
      }
      onSuccess && onSuccess({} as Transaction);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to save transaction', status: 'error' });
    }
  };

  const categoryOptions = [
    ...(categories?.map((cat: Category) => ({ value: String(cat.id), label: cat.name })) || []),
    { value: '__new__', label: '+ Add new category' },
  ];

  const subcategoryOptions = [
    { value: '', label: 'None' },
    ...(subcategories?.map((sub: Subcategory) => ({ value: String(sub.id), label: sub.name })) || []),
    { value: '__new__', label: '+ Add new subcategory' },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        label="Description *"
        placeholder="What did you buy?"
        value={formData.description}
        onChangeText={(v) => setField('description', v)}
        style={styles.input}
      />

      <View style={styles.row}>
        <TextInput
          label="Amount *"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={formData.amount}
          onChangeText={(v) => setField('amount', v)}
          style={[styles.input, styles.flex1]}
        />
        <DropdownField
          label="Currency *"
          value={formData.currency}
          options={CURRENCIES}
          onSelect={(v) => setField('currency', v)}
        />
      </View>

      <DropdownField
        label="Mode of Payment *"
        value={formData.mode_of_payment}
        options={PAYMENT_MODES}
        onSelect={(v) => setField('mode_of_payment', v)}
      />

      {isNewCategory ? (
        <View style={styles.row}>
          <TextInput
            label="New category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={[styles.input, styles.flex1]}
            autoFocus
          />
          <Button
            mode="outlined"
            onPress={() => {
              setIsNewCategory(false);
              setNewCategoryName('');
            }}
          >
            Cancel
          </Button>
        </View>
      ) : (
        <DropdownField
          label="Category *"
          value={formData.category_id}
          options={categoryOptions}
          onSelect={handleCategorySelect}
        />
      )}

      {(isNewCategory || selectedCategory) && (
        <>
          {isNewSubcategory ? (
            <View style={styles.row}>
              <TextInput
                label="New subcategory name"
                value={newSubcategoryName}
                onChangeText={setNewSubcategoryName}
                style={[styles.input, styles.flex1]}
                autoFocus
              />
              <Button
                mode="outlined"
                onPress={() => {
                  setIsNewSubcategory(false);
                  setNewSubcategoryName('');
                }}
              >
                Cancel
              </Button>
            </View>
          ) : isNewCategory ? (
            <Button mode="outlined" onPress={() => setIsNewSubcategory(true)} style={styles.input}>
              + Add subcategory (optional)
            </Button>
          ) : (
            <DropdownField
              label="Subcategory (optional)"
              value={formData.subcategory_id}
              options={subcategoryOptions}
              onSelect={handleSubcategorySelect}
            />
          )}
        </>
      )}

      <TextInput
        label="Date *"
        placeholder="YYYY-MM-DD"
        value={formData.transaction_date}
        onChangeText={(v) => setField('transaction_date', v)}
        style={styles.input}
      />

      <View style={[styles.row, styles.actions]}>
        {onCancel && (
          <Button mode="outlined" onPress={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading}>
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </View>

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  input: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  actions: {
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
