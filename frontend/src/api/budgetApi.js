import { fetchClient } from './fetchClient.js';

export const budgetApi = {
  getAll: () => fetchClient.get('/budgets'),
  getCurrent: () => fetchClient.get('/budgets/current'),
  create: (data) => fetchClient.post('/budgets', data),
  update: (id, data) => fetchClient.put(`/budgets/${id}`, data),
  delete: (id) => fetchClient.delete(`/budgets/${id}`),
  getAlerts: () => fetchClient.get('/budgets/alerts'),
};