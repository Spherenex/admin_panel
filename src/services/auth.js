// services/auth.js
import { apiService } from './api';

class AuthService {
  async login(credentials) {
    try {
      return await apiService.post('/auth/login', credentials);
    } catch (err) {
      throw new Error(err.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      return await apiService.post('/auth/register', userData);
    } catch (err) {
      throw new Error(err.message || 'Registration failed');
    }
  }

  async getCurrentUser() {
    try {
      return await apiService.get('/auth/me');
    } catch (err) {
      throw new Error(err.message || 'Unable to fetch user');
    }
  }

  async refreshToken() {
    return await apiService.post('/auth/refresh');
  }

  async forgotPassword(email) {
    return await apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return await apiService.post('/auth/reset-password', { token, password });
  }
}

export const authService = new AuthService();
