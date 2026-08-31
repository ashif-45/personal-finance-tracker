import { fetchClient } from './fetchClient.js';

export const dashboardApi = {
  getSummary: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const qs = params.toString();
    return fetchClient.get(`/dashboard/summary${qs ? `?${qs}` : ''}`);
  },
};