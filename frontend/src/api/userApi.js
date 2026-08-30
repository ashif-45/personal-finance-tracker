import { fetchClient } from './fetchClient.js';

export const userApi = {
  getProfile: () => fetchClient.get('/users/profile'),
  updateProfile: (data) => fetchClient.put('/users/profile', data),
  changePassword: (data) => fetchClient.put('/users/change-password', data),
};