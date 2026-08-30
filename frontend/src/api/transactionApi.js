import { fetchClient } from './fetchClient.js';

export const transactionApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return fetchClient.get(`/transactions?${query.toString()}`);
  },
  getById: (id) => fetchClient.get(`/transactions/${id}`),
  create: (data) => fetchClient.post('/transactions', data),
  update: (id, data) => fetchClient.put(`/transactions/${id}`, data),
  delete: (id) => fetchClient.delete(`/transactions/${id}`),
};