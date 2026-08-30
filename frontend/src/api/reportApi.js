import { fetchClient } from './fetchClient.js';

export const reportApi = {
  getMonthly: (year) => fetchClient.get(`/reports/monthly?year=${year}`),
  getYearly: () => fetchClient.get('/reports/yearly'),
  getCategory: (month, year) => fetchClient.get(`/reports/category?month=${month}&year=${year}`),
};