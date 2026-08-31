import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants.js';

/**
 * Central fetch wrapper.
 * - Auto-attaches JWT from localStorage.
 * - Parses JSON.
 * - Redirects to /login on 401.
 * - Supports file uploads via `upload()`.
 * - Throws normalized error with .message.
 */
async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: finalHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    throw new Error('Network error. Please check your connection.');
  }

  // Handle 401 → clear storage + redirect
  if (response.status === 401 && auth) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const msg = data?.message || `Request failed (${response.status})`;
    const error = new Error(msg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * File upload wrapper — uses FormData (multipart/form-data).
 * DO NOT set Content-Type manually; browser sets it with the boundary.
 */
async function uploadFile(path, file, fieldName = 'file') {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (networkErr) {
    throw new Error('Network error during upload.');
  }

  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const msg = data?.message || `Upload failed (${response.status})`;
    const error = new Error(msg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const fetchClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  upload: (path, file, fieldName) => uploadFile(path, file, fieldName),
};