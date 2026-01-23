// =============================================================================
// FILE: src/hooks/useSignals.ts
// =============================================================================
// Custom hooks for user signal access
// Users can only see: Symbol, Entry, SL, Active Status, Created Time
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { signalsService } from "../../api/services";
import type {
  UserSignal,
  UserSignalFilters,
  UserSignalStats,
  SignalStatus,
} from "../../types/signals.types";
import { isSubscriptionError } from "../../types/billings.types";

/**
 * Extract error message from various error types
 */
function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // Check for subscription error
    if (isSubscriptionError(err)) {
      return err.response?.data?.message || "Subscription required to access this feature";
    }
    // Standard axios error
    return (
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      "An error occurred"
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unknown error occurred";
}

/**
 * Hook for fetching user signals with limited visibility
 */
export function useSignals(initialFilters?: UserSignalFilters) {
  const [signals, setSignals] = useState<UserSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<UserSignalFilters>(initialFilters || {});

  const fetchSignals = useCallback(
    async (filterOverrides?: UserSignalFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters = { ...filters, ...filterOverrides };
        const response = await signalsService.getSignals(activeFilters);
        setSignals(response.signals);
        setHasMore(response.hasMore);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const newOffset = (filters.offset || 0) + (filters.limit || 50);
      const response = await signalsService.getSignals({ ...filters, offset: newOffset });
      setSignals((prev) => [...prev, ...response.signals]);
      setHasMore(response.hasMore);
      setFilters((prev) => ({ ...prev, offset: newOffset }));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters, hasMore, isLoading]);

  const updateFilters = useCallback((newFilters: Partial<UserSignalFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, offset: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return {
    signals,
    isLoading,
    error,
    hasMore,
    filters,
    fetchSignals,
    loadMore,
    updateFilters,
    resetFilters,
  };
}

/**
 * Hook for fetching active signals only
 */
export function useActiveSignals(symbol?: string, limit: number = 50) {
  const [signals, setSignals] = useState<UserSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signalsService.getActiveSignals(symbol, limit);
      setSignals(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [symbol, limit]);

  useEffect(() => {
    fetchActiveSignals();
  }, [fetchActiveSignals]);

  return {
    signals,
    isLoading,
    error,
    refetch: fetchActiveSignals,
  };
}

/**
 * Hook for fetching signal stats
 */
export function useSignalStats(timeframe: "1h" | "24h" | "7d" | "30d" | "all" = "24h") {
  const [stats, setStats] = useState<UserSignalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signalsService.getStats(timeframe);
      setStats(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

/**
 * Hook for fetching single signal detail
 */
export function useSignalDetail(signalId: string | null) {
  const [signal, setSignal] = useState<UserSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signalId) {
      setSignal(null);
      return;
    }

    const fetchSignal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await signalsService.getSignalById(signalId);
        setSignal(data);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignal();
  }, [signalId]);

  return { signal, isLoading, error };
}

/**
 * Hook for fetching available symbols
 */
export function useAvailableSymbols() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSymbols = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signalsService.getSymbols();
      setSymbols(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSymbols();
  }, [fetchSymbols]);

  return { symbols, isLoading, error, refetch: fetchSymbols };
}

/**
 * Hook for updating signal status
 */
export function useSignalStatusUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (signalId: string, status: SignalStatus | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signalsService.updateSignalStatus(signalId, status);
      return result;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateStatus, isLoading, error };
}