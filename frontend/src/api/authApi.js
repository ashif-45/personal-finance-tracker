import { fetchClient } from './fetchClient.js';

export const authApi = {
  register: (payload) => fetchClient.post('/auth/register', payload, { auth: false }),
  login: (payload) => fetchClient.post('/auth/login', payload, { auth: false }),
  refresh: (refreshToken) => fetchClient.post('/auth/refresh', { refreshToken }, { auth: false }),
};