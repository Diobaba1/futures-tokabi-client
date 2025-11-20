// src/api/services/portfolioService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import type { PortfolioResponse } from '../../types/portfolio.types';

export const portfolioService = {
  getPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PORTFOLIO.GET);
    return response.data;
  },
};