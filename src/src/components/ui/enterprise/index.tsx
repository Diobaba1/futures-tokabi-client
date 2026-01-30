// =============================================================================
// FILE: src/components/ui/enterprise/index.tsx
// =============================================================================
// Enterprise-Grade UI Components for Professional Trading Dashboard
// =============================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================================================
// MetricCard - Professional metric display with trend indicators
// =============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  sparkline?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  variant = "default",
  size = "md",
  loading = false,
  sparkline,
}) => {
  const variantStyles = {
    default: "border-slate-700/50 bg-slate-900/60",
    success: "border-emerald-500/30 bg-emerald-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    danger: "border-rose-500/30 bg-rose-500/5",
    info: "border-sky-500/30 bg-sky-500/5",
  };

  const iconColors = {
    default: "text-slate-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
    info: "text-sky-400",
  };

  const sizeStyles = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const valueSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  if (loading) {
    return (
      <div className={`rounded-2xl border backdrop-blur-sm ${variantStyles[variant]} ${sizeStyles[size]}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700/50 rounded w-24 mb-3" />
          <div className="h-8 bg-slate-700/50 rounded w-32 mb-2" />
          <div className="h-3 bg-slate-700/50 rounded w-20" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className={iconColors[variant]}>{icon}</span>}
            <p className="text-sm font-medium text-slate-400 truncate">{title}</p>
          </div>
          <p className={`font-bold text-white tracking-tight ${valueSizes[size]}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  change >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {change >= 0 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                )}
                {Math.abs(change).toFixed(2)}%
              </span>
              {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
            </div>
          )}
        </div>
        {sparkline && sparkline.length > 0 && (
          <div className="w-20 h-12 ml-4">
            <Sparkline data={sparkline} color={change !== undefined && change >= 0 ? "#10b981" : "#f43f5e"} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// Sparkline - Mini chart component
// =============================================================================

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "#10b981",
  width = 80,
  height = 48,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height * 0.8 - height * 0.1;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// =============================================================================
// StatusBadge - Enhanced status indicator
// =============================================================================

interface StatusBadgeProps {
  status: "active" | "pending" | "success" | "warning" | "error" | "inactive";
  label?: string;
  size?: "xs" | "sm" | "md";
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
  pulse = false,
}) => {
  const statusConfig = {
    active: { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500", defaultLabel: "Active" },
    pending: { bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-500", defaultLabel: "Pending" },
    success: { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500", defaultLabel: "Success" },
    warning: { bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-500", defaultLabel: "Warning" },
    error: { bg: "bg-rose-500/20", text: "text-rose-400", dot: "bg-rose-500", defaultLabel: "Error" },
    inactive: { bg: "bg-slate-500/20", text: "text-slate-400", dot: "bg-slate-500", defaultLabel: "Inactive" },
  };

  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const dotSizes = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bg} ${config.text} ${sizeStyles[size]}`}
    >
      <span className={`rounded-full ${config.dot} ${dotSizes[size]} ${pulse ? "animate-pulse" : ""}`} />
      {label || config.defaultLabel}
    </span>
  );
};

// =============================================================================
// ProgressRing - Circular progress indicator
// =============================================================================

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  label?: string;
  color?: "emerald" | "amber" | "rose" | "sky" | "slate";
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = "md",
  showValue = true,
  label,
  color = "emerald",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeConfig = {
    sm: { size: 48, stroke: 4, fontSize: "text-xs" },
    md: { size: 64, stroke: 5, fontSize: "text-sm" },
    lg: { size: 80, stroke: 6, fontSize: "text-base" },
  };

  const colorConfig = {
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    rose: "stroke-rose-500",
    sky: "stroke-sky-500",
    slate: "stroke-slate-500",
  };

  const { size: svgSize, stroke, fontSize } = sizeConfig[size];
  const radius = (svgSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-700/50"
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorConfig[color]} transition-all duration-500`}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-white ${fontSize}`}>{Math.round(percentage)}%</span>
          {label && <span className="text-[10px] text-slate-500">{label}</span>}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// DataTable - Enterprise data table with sorting and pagination
// =============================================================================

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string;
  stickyHeader?: boolean;
  compact?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  keyExtractor,
  stickyHeader = false,
  compact = false,
}: DataTableProps<T>) {
  const cellPadding = compact ? "px-4 py-3" : "px-6 py-4";
  const headerPadding = compact ? "px-4 py-3" : "px-6 py-4";

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={stickyHeader ? "sticky top-0 z-10" : ""}>
            <tr className="border-b border-slate-700/50 bg-slate-800/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`${headerPadding} text-${column.align || "left"} text-xs font-semibold text-slate-400 uppercase tracking-wider`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            <AnimatePresence>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-slate-400">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <motion.tr
                    key={keyExtractor ? keyExtractor(item) : index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onRowClick?.(item)}
                    className={`${onRowClick ? "cursor-pointer hover:bg-slate-800/50" : ""} transition-colors`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`${cellPadding} text-${column.align || "left"} text-sm text-slate-300`}
                      >
                        {column.render
                          ? column.render(item, index)
                          : String((item as Record<string, unknown>)[column.key as string] ?? "-")}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// QuickActionCard - Quick action button card
// =============================================================================

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "primary" | "warning" | "danger";
  disabled?: boolean;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  const variantStyles = {
    default: "border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50",
    primary: "border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10",
    warning: "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10",
    danger: "border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/10",
  };

  const iconColors = {
    default: "text-slate-400 group-hover:text-white",
    primary: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`group w-full p-4 rounded-xl border bg-slate-900/40 backdrop-blur-sm text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 ${iconColors[variant]}`}>{icon}</div>
        <div className="min-w-0">
          <p className="font-medium text-white truncate">{title}</p>
          {description && <p className="text-xs text-slate-500 truncate">{description}</p>}
        </div>
        <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
};

// =============================================================================
// SectionHeader - Consistent section headers
// =============================================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && <div className="text-emerald-400">{icon}</div>}
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

// =============================================================================
// LiveIndicator - Real-time connection indicator
// =============================================================================

interface LiveIndicatorProps {
  isLive: boolean;
  isConnecting?: boolean;
  label?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isLive,
  isConnecting = false,
  label,
}) => {
  if (isConnecting) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-medium text-amber-400">{label || "Connecting..."}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
        isLive
          ? "bg-emerald-500/10 border border-emerald-500/30"
          : "bg-slate-500/10 border border-slate-500/30"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
      <span className={`text-xs font-medium ${isLive ? "text-emerald-400" : "text-slate-400"}`}>
        {label || (isLive ? "Live" : "Offline")}
      </span>
    </div>
  );
};

// =============================================================================
// PnLDisplay - Professional P&L display
// =============================================================================

interface PnLDisplayProps {
  value: number;
  percentage?: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const PnLDisplay: React.FC<PnLDisplayProps> = ({
  value,
  percentage,
  size = "md",
  showIcon = true,
}) => {
  const isPositive = value >= 0;
  const color = isPositive ? "text-emerald-400" : "text-rose-400";

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const formatValue = (val: number) => {
    const prefix = val >= 0 ? "+" : "";
    return `${prefix}$${Math.abs(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      {showIcon && (
        <span>
          {isPositive ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
        </span>
      )}
      <span className={`font-semibold ${sizeStyles[size]}`}>{formatValue(value)}</span>
      {percentage !== undefined && (
        <span className="text-xs opacity-80">({isPositive ? "+" : ""}{percentage.toFixed(2)}%)</span>
      )}
    </div>
  );
};
