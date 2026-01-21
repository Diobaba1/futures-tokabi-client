// ============================================================================
// FILE: src/hooks/useStaffSignals.tsx
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import { staffSignalsService } from "../../api/services";
import {
  StaffSignalResponse,
  StaffSignalDetailResponse,
  StaffSignalStatsResponse,
  StaffSignalCreateRequest,
  StaffSignalUpdateRequest,
  StaffSignalFilterParams,
  MarkTakeProfitHitRequest,
} from "../../types/staffSignals.types";

// =============================================================================
// Types
// =============================================================================

interface UseStaffSignalsState {
  signals: StaffSignalResponse[];
  activeSignals: StaffSignalResponse[];
  selectedSignal: StaffSignalDetailResponse | null;
  stats: StaffSignalStatsResponse | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface UseStaffSignalsReturn extends UseStaffSignalsState {
  // Fetch operations
  fetchSignals: (params?: StaffSignalFilterParams) => Promise<void>;
  fetchActiveSignals: (symbol?: string) => Promise<void>;
  fetchSignalById: (signalId: string) => Promise<void>;
  fetchStats: (days?: number) => Promise<void>;

  // CRUD operations
  createSignal: (data: StaffSignalCreateRequest) => Promise<StaffSignalResponse>;
  updateSignal: (
    signalId: string,
    data: StaffSignalUpdateRequest
  ) => Promise<StaffSignalResponse>;

  // Status operations
  deactivateSignal: (signalId: string, reason?: string) => Promise<void>;
  activateSignal: (signalId: string) => Promise<void>;

  // Execution tracking
  markTpHit: (
    signalId: string,
    tpLevel: number,
    hitPrice?: number
  ) => Promise<void>;
  markSlHit: (signalId: string, notes?: string) => Promise<void>;

  // Utilities
  clearError: () => void;
  clearSelectedSignal: () => void;
  refreshSignals: () => Promise<void>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export const useStaffSignals = (
  initialFilters?: StaffSignalFilterParams
): UseStaffSignalsReturn => {
  const [state, setState] = useState<UseStaffSignalsState>({
    signals: [],
    activeSignals: [],
    selectedSignal: null,
    stats: null,
    pagination: {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    },
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
  });

  const [currentFilters, setCurrentFilters] = useState<StaffSignalFilterParams>(
    initialFilters || {}
  );

  // =========================================================================
  // Helper Functions
  // =========================================================================

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setCreating = (isCreating: boolean) => {
    setState((prev) => ({ ...prev, isCreating }));
  };

  const setUpdating = (isUpdating: boolean) => {
    setState((prev) => ({ ...prev, isUpdating }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedSignal = useCallback(() => {
    setState((prev) => ({ ...prev, selectedSignal: null }));
  }, []);

  // =========================================================================
  // Fetch Operations
  // =========================================================================

  const fetchSignals = useCallback(
    async (params?: StaffSignalFilterParams) => {
      setLoading(true);
      setError(null);

      try {
        const filters = params || currentFilters;
        setCurrentFilters(filters);

        const response = await staffSignalsService.list(filters);

        setState((prev) => ({
          ...prev,
          signals: response.signals,
          pagination: {
            total: response.total,
            page: response.page,
            pageSize: response.page_size,
            totalPages: response.total_pages,
          },
          isLoading: false,
        }));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to fetch signals";
        setError(errorMessage);
        setLoading(false);
      }
    },
    [currentFilters]
  );

  const fetchActiveSignals = useCallback(async (symbol?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await staffSignalsService.getActive(symbol);

      setState((prev) => ({
        ...prev,
        activeSignals: response,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Failed to fetch active signals";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const fetchSignalById = useCallback(async (signalId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await staffSignalsService.getById(signalId);

      setState((prev) => ({
        ...prev,
        selectedSignal: response,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Failed to fetch signal details";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (days?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await staffSignalsService.getStats(days);

      setState((prev) => ({
        ...prev,
        stats: response,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Failed to fetch statistics";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  // =========================================================================
  // CRUD Operations
  // =========================================================================

  const createSignal = useCallback(
    async (data: StaffSignalCreateRequest): Promise<StaffSignalResponse> => {
      setCreating(true);
      setError(null);

      try {
        const response = await staffSignalsService.create(data);

        // Refresh signals list
        await fetchSignals(currentFilters);

        setCreating(false);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to create signal";
        setError(errorMessage);
        setCreating(false);
        throw err;
      }
    },
    [fetchSignals, currentFilters]
  );

  const updateSignal = useCallback(
    async (
      signalId: string,
      data: StaffSignalUpdateRequest
    ): Promise<StaffSignalResponse> => {
      setUpdating(true);
      setError(null);

      try {
        const response = await staffSignalsService.update(signalId, data);

        // Update in local state
        setState((prev) => ({
          ...prev,
          signals: prev.signals.map((s) =>
            s.id === signalId ? response : s
          ),
          activeSignals: prev.activeSignals.map((s) =>
            s.id === signalId ? response : s
          ),
          selectedSignal:
            prev.selectedSignal?.id === signalId
              ? { ...prev.selectedSignal, ...response }
              : prev.selectedSignal,
          isUpdating: false,
        }));

        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to update signal";
        setError(errorMessage);
        setUpdating(false);
        throw err;
      }
    },
    []
  );

  // =========================================================================
  // Status Operations
  // =========================================================================

  const deactivateSignal = useCallback(
    async (signalId: string, reason?: string) => {
      setUpdating(true);
      setError(null);

      try {
        const response = await staffSignalsService.deactivate(signalId, reason);

        // Update in local state
        setState((prev) => ({
          ...prev,
          signals: prev.signals.map((s) =>
            s.id === signalId ? response : s
          ),
          activeSignals: prev.activeSignals.filter((s) => s.id !== signalId),
          isUpdating: false,
        }));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to deactivate signal";
        setError(errorMessage);
        setUpdating(false);
        throw err;
      }
    },
    []
  );

  const activateSignal = useCallback(async (signalId: string) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await staffSignalsService.activate(signalId);

      // Update in local state
      setState((prev) => ({
        ...prev,
        signals: prev.signals.map((s) =>
          s.id === signalId ? response : s
        ),
        activeSignals: [...prev.activeSignals, response],
        isUpdating: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Failed to activate signal";
      setError(errorMessage);
      setUpdating(false);
      throw err;
    }
  }, []);

  // =========================================================================
  // Execution Tracking
  // =========================================================================

  const markTpHit = useCallback(
    async (signalId: string, tpLevel: number, hitPrice?: number) => {
      setUpdating(true);
      setError(null);

      try {
        const data: MarkTakeProfitHitRequest = {
          tp_level: tpLevel,
          hit_price: hitPrice,
        };

        const response = await staffSignalsService.markTpHit(signalId, data);

        // Update in local state
        setState((prev) => ({
          ...prev,
          signals: prev.signals.map((s) =>
            s.id === signalId ? response : s
          ),
          activeSignals: prev.activeSignals.map((s) =>
            s.id === signalId ? response : s
          ),
          selectedSignal:
            prev.selectedSignal?.id === signalId
              ? { ...prev.selectedSignal, ...response }
              : prev.selectedSignal,
          isUpdating: false,
        }));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to mark take profit";
        setError(errorMessage);
        setUpdating(false);
        throw err;
      }
    },
    []
  );

  const markSlHit = useCallback(
    async (signalId: string, notes?: string) => {
      setUpdating(true);
      setError(null);

      try {
        const response = await staffSignalsService.markSlHit(signalId, notes);

        // Update in local state
        setState((prev) => ({
          ...prev,
          signals: prev.signals.map((s) =>
            s.id === signalId ? response : s
          ),
          activeSignals: prev.activeSignals.filter((s) => s.id !== signalId),
          selectedSignal:
            prev.selectedSignal?.id === signalId
              ? { ...prev.selectedSignal, ...response }
              : prev.selectedSignal,
          isUpdating: false,
        }));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || "Failed to mark stop loss";
        setError(errorMessage);
        setUpdating(false);
        throw err;
      }
    },
    []
  );

  // =========================================================================
  // Utilities
  // =========================================================================

  const refreshSignals = useCallback(async () => {
    await fetchSignals(currentFilters);
  }, [fetchSignals, currentFilters]);

  // =========================================================================
  // Initial Load
  // =========================================================================

  useEffect(() => {
    if (initialFilters) {
      fetchSignals(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================================
  // Return
  // =========================================================================

  return {
    ...state,
    fetchSignals,
    fetchActiveSignals,
    fetchSignalById,
    fetchStats,
    createSignal,
    updateSignal,
    deactivateSignal,
    activateSignal,
    markTpHit,
    markSlHit,
    clearError,
    clearSelectedSignal,
    refreshSignals,
  };
};

export default useStaffSignals;