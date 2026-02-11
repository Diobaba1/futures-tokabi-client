// ============================================================================
// FILE: src/api/services/staffSignalsService.ts
// ============================================================================

import axiosInstance from "../axiosConfig";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";
import {
  StaffSignalCreateRequest,
  StaffSignalUpdateRequest,
  StaffSignalStatusUpdateRequest,
  StaffSignalResponse,
  StaffSignalDetailResponse,
  StaffSignalListResponse,
  StaffSignalStatsResponse,
  StaffSignalFilterParams,
  MarkTakeProfitHitRequest,
} from "../../types/staffSignals.types";

// =============================================================================
// Staff Signals Service
// =============================================================================

export const staffSignalsService = {
  // =========================================================================
  // CREATE
  // =========================================================================

  /**
   * Create a new staff signal
   */
  async create(data: StaffSignalCreateRequest): Promise<StaffSignalResponse> {
    const response = await axiosInstance.post<StaffSignalResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.CREATE,
      data
    );
    return response.data;
  },

  // =========================================================================
  // READ
  // =========================================================================

  /**
   * Get paginated list of staff signals with filters
   */
  async list(
    params?: StaffSignalFilterParams
  ): Promise<StaffSignalListResponse> {
    const queryString = params ? buildQueryString(params) : "";
    const response = await axiosInstance.get<StaffSignalListResponse>(
      `${API_ENDPOINTS.STAFF_SIGNALS.LIST}${queryString}`
    );
    return response.data;
  },

  /**
   * Get active signals with pagination
   */
  async getActive(params?: {
    symbol?: string;
    page?: number;
    page_size?: number;
  }): Promise<{
    items: StaffSignalResponse[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> {
    const queryString = params ? buildQueryString(params) : "";
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.STAFF_SIGNALS.ACTIVE}${queryString}`
    );
    return response.data;
  },

  /**
   * Get signal by ID with full details
   */
  async getById(signalId: string): Promise<StaffSignalDetailResponse> {
    const response = await axiosInstance.get<StaffSignalDetailResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.DETAIL(signalId)
    );
    return response.data;
  },

  /**
   * Get signal statistics
   */
  async getStats(days?: number): Promise<StaffSignalStatsResponse> {
    const queryString = days ? buildQueryString({ days }) : "";
    const response = await axiosInstance.get<StaffSignalStatsResponse>(
      `${API_ENDPOINTS.STAFF_SIGNALS.STATS_SUMMARY}${queryString}`
    );
    return response.data;
  },

  // =========================================================================
  // UPDATE
  // =========================================================================

  /**
   * Update a staff signal
   */
  async update(
    signalId: string,
    data: StaffSignalUpdateRequest
  ): Promise<StaffSignalResponse> {
    const response = await axiosInstance.put<StaffSignalResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.UPDATE(signalId),
      data
    );
    return response.data;
  },

  /**
   * Update signal status
   */
  async updateStatus(
    signalId: string,
    data: StaffSignalStatusUpdateRequest
  ): Promise<StaffSignalResponse> {
    const response = await axiosInstance.patch<StaffSignalResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.UPDATE_STATUS(signalId),
      data
    );
    return response.data;
  },

  /**
   * Deactivate a signal (soft delete)
   */
  async deactivate(
    signalId: string,
    reason?: string
  ): Promise<StaffSignalResponse> {
    const queryString = reason ? buildQueryString({ reason }) : "";
    const response = await axiosInstance.patch<StaffSignalResponse>(
      `${API_ENDPOINTS.STAFF_SIGNALS.DEACTIVATE(signalId)}${queryString}`
    );
    return response.data;
  },

  /**
   * Activate a signal
   */
  async activate(signalId: string): Promise<StaffSignalResponse> {
    const response = await axiosInstance.patch<StaffSignalResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.ACTIVATE(signalId)
    );
    return response.data;
  },

  // =========================================================================
  // EXECUTION TRACKING
  // =========================================================================

  /**
   * Mark a take profit level as hit
   */
  async markTpHit(
    signalId: string,
    data: MarkTakeProfitHitRequest
  ): Promise<StaffSignalResponse> {
    const response = await axiosInstance.post<StaffSignalResponse>(
      API_ENDPOINTS.STAFF_SIGNALS.MARK_TP_HIT(signalId),
      data
    );
    return response.data;
  },

  /**
   * Mark stop loss as hit
   */
  async markSlHit(
    signalId: string,
    executionNotes?: string
  ): Promise<StaffSignalResponse> {
    const queryString = executionNotes
      ? buildQueryString({ execution_notes: executionNotes })
      : "";
    const response = await axiosInstance.post<StaffSignalResponse>(
      `${API_ENDPOINTS.STAFF_SIGNALS.MARK_SL_HIT(signalId)}${queryString}`
    );
    return response.data;
  },
};

export default staffSignalsService;