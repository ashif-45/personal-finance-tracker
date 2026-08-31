import { fetchClient } from './fetchClient.js';

export const budgetApi = {
  getAll: () => fetchClient.get('/budgets'),

  /** Current month (no params) or any period: getByPeriod(3, 2025) */
  getByPeriod: (month, year) => {
    const params = new URLSearchParams();
    if (month != null) params.append('month', month);
    if (year != null) params.append('year', year);
    const qs = params.toString();
    return fetchClient.get(`/budgets/by-period${qs ? `?${qs}` : ''}`);
  },

  /** Alias — still used by Navbar alerts / dashboard if needed */
  getCurrent: () => fetchClient.get('/budgets/current'),

  create: (data) => fetchClient.post('/budgets', data),
  update: (id, data) => fetchClient.put(`/budgets/${id}`, data),
  delete: (id) => fetchClient.delete(`/budgets/${id}`),
  getAlerts: () => fetchClient.get('/budgets/alerts'),
  bulkUpload: (file) => fetchClient.upload('/budgets/bulk-upload', file),
};