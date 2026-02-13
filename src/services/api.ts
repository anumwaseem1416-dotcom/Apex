import axios from 'axios';

// In production (e.g. Vercel), localhost points to the user's machine.
// Configure this in Vercel as an environment variable, e.g.
// VITE_API_BASE_URL=https://your-backend-domain.com/api
const envBaseUrl =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const API_BASE_URL = envBaseUrl || (isLocalhost ? 'http://localhost:3001/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  // Frontend-only authentication: backend auth endpoints are intentionally disabled.
  // (Keeps other API flows unchanged.)
  login: async (_email: string, _password: string) => {
    throw new Error('Backend authentication is disabled (frontend-only auth).');
  },
  createUser: async (_userData: any) => {
    throw new Error('Backend authentication is disabled (frontend-only auth).');
  },
};

// Customers
export const customers = {
  getAll: () => api.get('/customers'),
  create: (data: any) => api.post('/customers', data),
  getById: (id: string) => api.get(`/customers/${id}`),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getPurchases: (id: string, period?: string) => api.get(`/customers/${id}/purchases${period ? `?period=${period}` : ''}`),
};

// Products
export const products = {
  getPhones: () => api.get('/products/phones'),
  createPhone: (data: any) => api.post('/products/phones', data),
  updatePhone: (id: string, data: any) => api.put(`/products/phones/${id}`, data),
  deletePhone: (id: string) => api.delete(`/products/phones/${id}`),
  getPhoneById: (id: string) => api.get(`/products/phones/${id}`),
  getLaptops: () => api.get('/products/laptops'),
  createLaptop: (data: any) => api.post('/products/laptops', data),
  updateLaptop: (id: string, data: any) => api.put(`/products/laptops/${id}`, data),
  deleteLaptop: (id: string) => api.delete(`/products/laptops/${id}`),
  getWatches: () => api.get('/products/watches'),
  createWatch: (data: any) => api.post('/products/watches', data),
  updateWatch: (id: string, data: any) => api.put(`/products/watches/${id}`, data),
  deleteWatch: (id: string) => api.delete(`/products/watches/${id}`),
  getAccessories: () => api.get('/products/accessories'),
  createAccessory: (data: any) => api.post('/products/accessories', data),
  updateAccessory: (id: string, data: any) => api.put(`/products/accessories/${id}`, data),
  deleteAccessory: (id: string) => api.delete(`/products/accessories/${id}`),
};

// Sales
export const sales = {
  getAll: () => api.get('/sales'),
  create: (data: any) => api.post('/sales', data),
  getById: (id: string) => api.get(`/sales/${id}`),
  delete: (id: string) => api.delete(`/sales/${id}`),
  getDailyTransactions: (date: string, type?: string) => 
    api.get(`/sales/daily/${date}${type && type !== 'ALL' ? `?type=${type}` : ''}`),
  getTransactionsByPeriod: (period: string, date: Date, type?: string) => {
    const params = new URLSearchParams();
    if (type && type !== 'ALL') params.append('type', type);
    params.append('date', date.toISOString());
    return api.get(`/sales/period/${period}?${params.toString()}`);
  },
};

// Credits
export const credits = {
  getAll: () => api.get('/credits'),
  updatePayment: (id: string, paymentAmount: number) => 
    api.put(`/credits/${id}/payment`, { paymentAmount }),
  delete: (id: string) => api.delete(`/credits/${id}`),
  getOverdue: () => api.get('/credits/overdue'),
};

// Expenses
export const expenses = {
  getAll: () => api.get('/expenses'),
  create: (data: any) => api.post('/expenses', data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getMonthly: (year: number, month: number) => 
    api.get(`/expenses/monthly/${year}/${month}`),
};

// Dashboard
export const dashboard = {
  getStats: () => api.get('/dashboard/stats'),
  getBestSelling: () => api.get('/dashboard/best-selling'),
};

// Admin
export const admin = {
  clearAllData: () => api.delete('/admin/clear-all-data'),
};

export default api;