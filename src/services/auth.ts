import axios from 'axios';
import { AuthResponse, LoginCredentials, RegistrationData, User, UserAddress, NotificationPreferences } from '../types/auth';

const API_BASE_URL = '/api/auth';

export const authService = {
  async register(data: RegistrationData): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_BASE_URL}/logout`);
  },

  async updateProfile(userId: string, userData: Partial<User>): Promise<User> {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
    return response.data;
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    await axios.put(`${API_BASE_URL}/users/${userId}/password`, {
      oldPassword,
      newPassword
    });
  },

  async addAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, address);
    return response.data;
  },

  async updateAddress(userId: string, addressId: string, address: Partial<UserAddress>): Promise<UserAddress> {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/addresses/${addressId}`, address);
    return response.data;
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/users/${userId}/addresses/${addressId}`);
  },

  async updateNotificationPreferences(userId: string, preferences: NotificationPreferences): Promise<NotificationPreferences> {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/notifications`, preferences);
    return response.data;
  },

  async enable2FA(userId: string): Promise<{ qrCode: string }> {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/2fa/enable`);
    return response.data;
  },

  async verify2FA(userId: string, token: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/users/${userId}/2fa/verify`, { token });
  },

  async disable2FA(userId: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/users/${userId}/2fa/disable`);
  }
};