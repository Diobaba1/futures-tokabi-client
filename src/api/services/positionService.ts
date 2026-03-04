import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ActivePositionsResponse,
  ActivePosition,
  ClosePositionResult,
} from '../../types/position.types';

export const positionService = {
  async getActivePositions(params?: {
    symbol?: string;
    exchange_type?: string;
    page?: number;
    page_size?: number;
  }): Promise<ActivePositionsResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.POSITIONS.ACTIVE, { params });
    return response.data;
  },

  async getPositionDetail(executionId: string): Promise<ActivePosition> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.POSITIONS.DETAIL(executionId)
    );
    return response.data;
  },

  async closePosition(
    executionId: string,
    executionType: string
  ): Promise<ClosePositionResult> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.POSITIONS.CLOSE(executionId),
      { execution_type: executionType, confirm: true }
    );
    return response.data;
  },
};
