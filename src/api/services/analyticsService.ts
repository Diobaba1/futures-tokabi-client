// src/api/services/analyticsService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { PortfolioAnalytics, SystemAnalytics } from '../../types/analytics.types';

export const analyticsService = {
  async getPortfolioAnalytics(days: number = 30): Promise<PortfolioAnalytics> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.PORTFOLIO, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio analytics:', error);
      throw error;
    }
  },

  async getSystemAnalytics(days: number = 7): Promise<SystemAnalytics> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.SYSTEM, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      throw error;
    }
  },
};