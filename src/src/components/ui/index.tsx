// =============================================================================
// FILE: src/components/ui/index.tsx
// =============================================================================
// Reusable UI Components
// =============================================================================

import React from "react";

// =============================================================================
// Button
// =============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25",
    secondary:
      "bg-slate-800 text-slate-200 hover:bg-slate-700 focus:ring-slate-500 border border-slate-700",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500",
    danger:
      "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 focus:ring-rose-500 border border-rose-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// =============================================================================
// Card
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl
        ${hover ? "hover:border-slate-700 hover:bg-slate-900/70 transition-all cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// =============================================================================
// Badge
// =============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
}) => {
  const variants = {
    default: "bg-slate-700 text-slate-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    danger: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    info: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  const dotColors = {
    default: "bg-slate-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-rose-400",
    info: "bg-sky-400",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg
        ${variants[variant]} ${sizes[size]}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      {children}
    </span>
  );
};

// =============================================================================
// Select
// =============================================================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  className = "",
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl
          text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50
          focus:border-emerald-500/50 transition-all appearance-none cursor-pointer
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// =============================================================================
// Spinner
// =============================================================================

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// =============================================================================
// StatCard
// =============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
}) => {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-slate-400",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
          {trend && trendValue && (
            <p className={`text-sm font-medium mt-1 ${trendColors[trend]}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className="text-slate-600">{icon}</div>}
      </div>
    </Card>
  );
};

// =============================================================================
// EmptyState
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-slate-600 mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {action}
    </div>
  );
};

export * from './Button';
export * from './Input';