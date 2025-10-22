// src/contexts/AnalyticsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  PortfolioAnalytics,
  SystemAnalytics,
} from "../../types/analytics.types";
import { analyticsService } from "../../api/services";

interface AnalyticsContextType {
  portfolio: PortfolioAnalytics | null;
  system: SystemAnalytics | null;
  portfolioLoading: boolean;
  systemLoading: boolean;
  portfolioError: string | null;
  systemError: string | null;
  loading: boolean;
  fetchPortfolio: () => Promise<void>;
  fetchSystem: () => Promise<void>;
  refreshPortfolio: (days?: number) => Promise<void>;
  refreshSystem: (days?: number) => Promise<void>;
  refreshAll: (portfolioDays?: number, systemDays?: number) => Promise<void>;
  clearAnalytics: () => void;
  clearErrors: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
  autoLoad?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  autoLoad = true,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioAnalytics | null>(null);
  const [system, setSystem] = useState<SystemAnalytics | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [systemError, setSystemError] = useState<string | null>(null);

  // Auto-load analytics on mount in production
  useEffect(() => {
  if (autoLoad) {
    const refreshAll = () => {
      console.log("Refreshing...");
    };
    refreshAll();
  }
}, [autoLoad]);

  const refreshPortfolio = useCallback(async (days = 30) => {
    setPortfolioLoading(true);
    setPortfolioError(null);
    try {
      const data = await analyticsService.getPortfolioAnalytics(days);
      setPortfolio(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch portfolio analytics';
      setPortfolioError(errorMessage);
      console.error("[AnalyticsContext] Failed to fetch portfolio analytics", error);
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  const refreshSystem = useCallback(async (days = 7) => {
    setSystemLoading(true);
    setSystemError(null);
    try {
      const data = await analyticsService.getSystemAnalytics(days);
      setSystem(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch system analytics';
      setSystemError(errorMessage);
      console.error("[AnalyticsContext] Failed to fetch system analytics", error);
    } finally {
      setSystemLoading(false);
    }
  }, []);

  const fetchPortfolio = useCallback(() => refreshPortfolio(30), [refreshPortfolio]);
  const fetchSystem = useCallback(() => refreshSystem(7), [refreshSystem]);

  const refreshAll = useCallback(
    async (portfolioDays = 30, systemDays = 7) => {
      await Promise.all([refreshPortfolio(portfolioDays), refreshSystem(systemDays)]);
    },
    [refreshPortfolio, refreshSystem]
  );

  const clearAnalytics = useCallback(() => {
    setPortfolio(null);
    setSystem(null);
    setPortfolioError(null);
    setSystemError(null);
  }, []);

  const clearErrors = useCallback(() => {
    setPortfolioError(null);
    setSystemError(null);
  }, []);

  const loading = portfolioLoading || systemLoading;

  const value = useMemo<AnalyticsContextType>(
    () => ({
      portfolio,
      system,
      portfolioLoading,
      systemLoading,
      portfolioError,
      systemError,
      loading,
      fetchPortfolio,
      fetchSystem,
      refreshPortfolio,
      refreshSystem,
      refreshAll,
      clearAnalytics,
      clearErrors,
    }),
    [
      portfolio,
      system,
      portfolioLoading,
      systemLoading,
      portfolioError,
      systemError,
      loading,
      fetchPortfolio,
      fetchSystem,
      refreshPortfolio,
      refreshSystem,
      refreshAll,
      clearAnalytics,
      clearErrors,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};