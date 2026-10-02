import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  signup = (username: string, email: string, password: string) =>
    this.client.post('/auth/signup', { username, email, password });

  login = (email: string, password: string) =>
    this.client.post('/auth/login', { email, password });

  verifyToken = () => this.client.post('/auth/verify');

  logout = () => this.client.post('/auth/logout');

  // User endpoints
  getProfile = () => this.client.get('/user/profile');

  updateProfile = (data: any) => this.client.put('/user/profile', data);

  changePassword = (currentPassword: string, newPassword: string) =>
    this.client.post('/user/change-password', { currentPassword, newPassword });

  // Transaction endpoints
  createTransaction = (data: any) => this.client.post('/transactions', data);

  getTransactions = (filters?: any) =>
    this.client.get('/transactions', { params: filters });

  getTransaction = (id: number) => this.client.get(`/transactions/${id}`);

  updateTransaction = (id: number, data: any) =>
    this.client.put(`/transactions/${id}`, data);

  deleteTransaction = (id: number) => this.client.delete(`/transactions/${id}`);

  // Category endpoints
  getCategories = () => this.client.get('/categories');

  createCategory = (data: any) => this.client.post('/categories', data);

  updateCategory = (id: number, data: any) =>
    this.client.put(`/categories/${id}`, data);

  deleteCategory = (id: number) => this.client.delete(`/categories/${id}`);

  getSubcategories = (categoryId: number) =>
    this.client.get(`/categories/${categoryId}/subcategories`);

  createSubcategory = (categoryId: number, data: any) =>
    this.client.post(`/categories/${categoryId}/subcategories`, data);

  // Email account endpoints
  getEmailAccounts = () => this.client.get('/email-accounts');

  addEmailAccount = (data: any) => this.client.post('/email-accounts', data);

  removeEmailAccount = (id: number) => this.client.delete(`/email-accounts/${id}`);

  syncEmailAccount = (id: number) => this.client.post(`/email-accounts/${id}/sync`);

  // Email suggestions
  getEmailSuggestions = () => this.client.get('/email-suggestions');

  createTransactionFromEmail = (emailId: string, data: any) =>
    this.client.post(`/transactions/from-email/${emailId}`, data);

  // Analytics endpoints
  getSpendingTrends = (period?: string, view?: string) =>
    this.client.get('/analytics/spending-trends', { params: { period, view } });

  getDashboardWidgets = () => this.client.get('/analytics/dashboard-widgets');
}

export const apiClient = new ApiClient();
