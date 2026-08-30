import { fetchClient } from './fetchClient.js';

export const categoryApi = {
  getAll: (type) => fetchClient.get(`/categories${type ? `?type=${type}` : ''}`),
  create: (data) => fetchClient.post('/categories', data),
  update: (id, data) => fetchClient.put(`/categories/${id}`, data),
  delete: (id) => fetchClient.delete(`/categories/${id}`),
};