// src/api/services/telegramConfigService.ts (updated)

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { 
  TelegramConfigCreate, 
  TelegramConfigUpdate, 
  TelegramConfigResponse 
} from '../../types/telegram-config.types';

class TelegramConfigService {
  private basePath = API_ENDPOINTS.USERS.TELEGRAM;

  async create(config: TelegramConfigCreate): Promise<TelegramConfigResponse> {
    const response = await axiosInstance.post(this.basePath, config);
    return response.data;
  }

  async get(): Promise<TelegramConfigResponse[]> {
    const response = await axiosInstance.get(this.basePath);
    return response.data;
  }

  async getById(configId: string): Promise<TelegramConfigResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.TELEGRAM_ID(configId));
    return response.data;
  }

  async update(configId: string, config: TelegramConfigUpdate): Promise<TelegramConfigResponse> {
    const response = await axiosInstance.put(API_ENDPOINTS.USERS.TELEGRAM_ID(configId), config);
    return response.data;
  }

  async delete(configId: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USERS.TELEGRAM_ID(configId));
  }
}

export const telegramConfigService = new TelegramConfigService();