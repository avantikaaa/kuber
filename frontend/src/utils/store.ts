import { create } from 'zustand';
import type { User, Transaction, Category, EmailAccount } from '@types/index';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface TransactionStore {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  setTransactions: (transactions: Transaction[]) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  removeTransaction: (id: number) => void;
}

interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  removeCategory: (id: number) => void;
}

interface UIStore {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  defaultWidgets: string[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrency: (currency: string) => void;
  setDefaultWidgets: (widgets: string[]) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('auth_token');
  },
}));

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  currentTransaction: null,
  setTransactions: (transactions) => set({ transactions }),
  setCurrentTransaction: (currentTransaction) => set({ currentTransaction }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  updateTransaction: (id, updated) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updated } : t
      ),
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({
      categories: [category, ...state.categories],
    })),
  updateCategory: (id, updated) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updated } : c
      ),
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));

export const useUIStore = create<UIStore>((set) => ({
  theme: (localStorage.getItem('theme') as any) || 'system',
  currency: localStorage.getItem('currency') || 'USD',
  defaultWidgets: JSON.parse(localStorage.getItem('defaultWidgets') || '["current_month_pie", "spending_trend"]'),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  setCurrency: (currency) => {
    localStorage.setItem('currency', currency);
    set({ currency });
  },
  setDefaultWidgets: (widgets) => {
    localStorage.setItem('defaultWidgets', JSON.stringify(widgets));
    set({ defaultWidgets: widgets });
  },
}));
