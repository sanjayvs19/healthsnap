/**
 * HealthSnap Central API Client
 * Connects the React frontend to the FastAPI backend with JWT Bearer authentication.
 */

const DEPLOYED_BACKEND = 'https://healthsnap-6.onrender.com';

// Pick the API base URL:
// - Use the VITE_API_URL env value if it's a real (non-local) URL
// - Otherwise, when hosted on Vercel/Render, use the deployed backend
// - Local dev falls back to localhost:8000
const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
const isLocalUrl = !envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1') || envUrl.includes('0.0.0.0');
const isHostedDeploy =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('.vercel.app') || window.location.hostname.endsWith('.onrender.com'));

const BASE_URL = !isLocalUrl ? envUrl : isHostedDeploy ? DEPLOYED_BACKEND : 'http://localhost:8000';

const TOKEN_KEY = 'healthsnap_jwt_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = tokenStorage.get();

  const headers = {
    ...options.headers
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is an object and not FormData, stringify it and set JSON header
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      let errorMsg = data?.detail || response.statusText || 'An error occurred';
      if (Array.isArray(errorMsg)) {
        // FastAPI validation errors
        errorMsg = errorMsg.map(err => err.msg || JSON.stringify(err)).join(', ');
      }
      
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to connect to HealthSnap server at ${BASE_URL}. Please ensure the backend is running.`
      );
    }
    throw err;
  }
}

export const api = {
  auth: {
    signup: (userData) => request('/api/auth/signup', { method: 'POST', body: userData }),
    login: (credentials) => request('/api/auth/login', { method: 'POST', body: credentials }),
    getMe: () => request('/api/auth/me', { method: 'GET' }),
    forgotPassword: (email) => request('/api/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (data) => request('/api/auth/reset-password', { method: 'POST', body: data }),
    logout: () => {
      tokenStorage.clear();
      return request('/api/auth/logout', { method: 'POST' }).catch(() => null);
    }
  },

  users: {
    getProfile: () => request('/api/users/me', { method: 'GET' }),
    updateProfile: (data) => request('/api/users/me', { method: 'PUT', body: data }),
    deleteAccount: () => request('/api/users/me', { method: 'DELETE' })
  },

  wellness: {
    getAll: () => request('/api/wellness', { method: 'GET' }),
    getById: (id) => request(`/api/wellness/${id}`, { method: 'GET' }),
    create: (data) => request('/api/wellness', { method: 'POST', body: data }),
    update: (id, data) => request(`/api/wellness/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/api/wellness/${id}`, { method: 'DELETE' }),
    createSelfReport: (data) => request('/api/wellness/self-report', { method: 'POST', body: data }),
    getSelfReports: () => request('/api/wellness/self-report', { method: 'GET' })
  },

  activity: {
    get: () => request('/api/activity', { method: 'GET' }),
    log: (data) => request('/api/activity', { method: 'POST', body: data })
  },

  sleep: {
    get: () => request('/api/sleep', { method: 'GET' }),
    log: (data) => request('/api/sleep', { method: 'POST', body: data })
  },

  food: {
    analyze: async (file, customName = '') => {
      const formData = new FormData();
      formData.append('file', file);
      if (customName) formData.append('custom_name', customName);
      return request('/api/food/analyze', {
        method: 'POST',
        body: formData
      });
    },
    logMeal: (data) => request('/api/food', { method: 'POST', body: data }),
    getLogs: () => request('/api/food', { method: 'GET' })
  },

  voice: {
    transcribe: async ({ file, transcript, autoSaveJournal = false }) => {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (transcript) formData.append('transcript', transcript);
      formData.append('auto_save_journal', autoSaveJournal ? 'true' : 'false');
      return request('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });
    }
  },

  ai: {
    analyze: () => request('/api/ai/analyze', { method: 'POST' })
  },

  dashboard: {
    get: () => request('/api/dashboard', { method: 'GET' })
  },

  reports: {
    getDaily: (dateStr) => request(`/api/reports/daily?date=${dateStr}`),
    getWeekly: (startDate, endDate) => request(`/api/reports/weekly?start_date=${startDate}&end_date=${endDate}`),
    getMonthly: (year, month) => request(`/api/reports/monthly?year=${year}&month=${month}`),
    
    // Authenticated binary/text file downloader
    downloadFile: async (path, defaultFilename) => {
      const url = `${BASE_URL}${path}`;
      const token = tokenStorage.get();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = defaultFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }
  }
};

export default api;

