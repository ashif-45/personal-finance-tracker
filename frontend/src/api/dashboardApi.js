import { fetchClient } from './fetchClient.js';

export const dashboardApi = {
  getSummary: () => fetchClient.get('/dashboard/summary'),
};