const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('app_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async signup(userData) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  async googleLogin(credential) {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google login failed');
    return data;
  },

  // Activities
  async getActivities() {
    const res = await fetch(`${API_URL}/activities`, { headers: getHeaders() });
    return res.json();
  },

  async createActivity(activity) {
    const res = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activity)
    });
    return res.json();
  },

  async updateActivity(id, activity) {
    const res = await fetch(`${API_URL}/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(activity)
    });
    return res.json();
  },

  async deleteActivity(id) {
    const res = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_URL}/settings`, { headers: getHeaders() });
    return res.json();
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};
