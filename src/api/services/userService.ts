// src/api/services/userService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

import {
  APIKeyAdd,
  APIKeysListResponse,
  SubscriptionUpdate,
  UserProfileResponse,
} from '../../types/user.types';

export const userService = {
  async addApiKey(data: APIKeyAdd): Promise<{
    status: string;
    message: string;
    api_key?: { id: string; validation_status: string };
    validation?: { valid: boolean; error?: string };
  }> {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS.API_KEYS, data);
    return response.data;
  },

  async testConnection(): Promise<{
    exchange: string;
    testnet: boolean;
    validation?: { valid: boolean };
    error?: string;
  }> {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS.API_KEYS_TEST);
    return response.data;
  },

  async getApiKeys(): Promise<APIKeysListResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.API_KEYS);
    return response.data;
  },

  async deleteApiKey(keyId: string): Promise<{ status: string; message: string }> {
    const response = await axiosInstance.delete(API_ENDPOINTS.USERS.API_KEYS_ID(keyId));
    return response.data;
  },

  async updateSubscription(data: SubscriptionUpdate): Promise<{ status: string; is_subscribed: boolean }> {
    const response = await axiosInstance.put(API_ENDPOINTS.USERS.SUBSCRIPTION, data);
    return response.data;
  },

  async getProfile(): Promise<UserProfileResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
    return response.data;
  },
};