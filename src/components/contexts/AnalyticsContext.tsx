// src/contexts/AnalyticsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
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
  loading: boolean; // Add this for backward compatibility
  fetchPortfolio: () => Promise<void>; // Add this alias for refreshPortfolio
  fetchSystem: () => Promise<void>; // Add this alias for refreshSystem
  refreshPortfolio: (days?: number) => Promise<void>;
  refreshSystem: (days?: number) => Promise<void>;
  refreshAll: (portfolioDays?: number, systemDays?: number) => Promise<void>;
  clearAnalytics: () => void;
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
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioAnalytics | null>(null);
  const [system, setSystem] = useState<SystemAnalytics | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);

  const refreshPortfolio = useCallback(async (days = 30) => {
    setPortfolioLoading(true);
    try {
      const data = await analyticsService.getPortfolioAnalytics(days);
      setPortfolio(data);
    } catch (error) {
      console.error("[AnalyticsContext] Failed to fetch portfolio analytics", error);
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  const refreshSystem = useCallback(async (days = 7) => {
    setSystemLoading(true);
    try {
      const data = await analyticsService.getSystemAnalytics(days);
      setSystem(data);
    } catch (error) {
      console.error("[AnalyticsContext] Failed to fetch system analytics", error);
    } finally {
      setSystemLoading(false);
    }
  }, []);

  // Add aliases for backward compatibility
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
  }, []);

  // Combined loading state for backward compatibility
  const loading = portfolioLoading || systemLoading;

  const value = useMemo<AnalyticsContextType>(
    () => ({
      portfolio,
      system,
      portfolioLoading,
      systemLoading,
      loading, // Add combined loading state
      fetchPortfolio, // Add alias
      fetchSystem, // Add alias
      refreshPortfolio,
      refreshSystem,
      refreshAll,
      clearAnalytics,
    }),
    [
      portfolio,
      system,
      portfolioLoading,
      systemLoading,
      loading,
      fetchPortfolio,
      fetchSystem,
      refreshPortfolio,
      refreshSystem,
      refreshAll,
      clearAnalytics,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};