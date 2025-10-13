// src/api/services/analyticsService.ts
import axiosInstance from '../axiosConfig';
import { API } from '../endpoints';
import { PortfolioAnalytics, SystemAnalytics } from '../../types/analytics.types';

export const analyticsService = {
  async getPortfolioAnalytics(days: number = 30): Promise<PortfolioAnalytics> {
    const url = `${API.ANALYTICS.PORTFOLIO}${days !== 30 ? `?days=${days}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  async getSystemAnalytics(days: number = 7): Promise<SystemAnalytics> {
    const url = `${API.ANALYTICS.SYSTEM}${days !== 7 ? `?days=${days}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },
};