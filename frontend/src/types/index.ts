export interface User {
  id: number;
  username: string;
  email: string;
  default_currency: string;
  theme: 'light' | 'dark' | 'system';
  default_widgets: string[];
  created_at: string;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  is_system: boolean;
  created_at: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  currency: string;
  mode_of_payment: string;
  bank_account_id?: number;
  category_id: number;
  subcategory_id?: number;
  source: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface EmailAccount {
  id: number;
  user_id: number;
  email_address: string;
  provider: string;
  last_synced_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface EmailTransaction {
  id: number;
  user_id: number;
  email_id: string;
  email_subject: string;
  email_body: string;
  extracted_transaction_id?: number;
  extraction_status: 'pending' | 'success' | 'failed' | 'skipped';
  extraction_error?: string;
  created_at: string;
}

export interface ExtractedTransaction {
  description: string;
  amount: number;
  currency: string;
  mode_of_payment: string;
  date: string;
  account_ending?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface SpendingData {
  id: number;
  name: string;
  color: string;
  total: number;
  count: number;
}

export interface TrendData {
  date: string;
  total: number;
  count: number;
}

export interface PaymentModeData {
  mode_of_payment: string;
  total: number;
  count: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
