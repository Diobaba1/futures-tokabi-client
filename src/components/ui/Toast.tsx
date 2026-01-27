// =============================================================================
// FILE: src/components/ui/Toast.tsx
// =============================================================================
// Enhanced Toast Notification System with Title Support
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: ToastOptions | number) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  clearAll: () => void;
}

// =============================================================================
// Context
// =============================================================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// =============================================================================
// Toast Provider
// =============================================================================

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = generateId();
    const duration = toast.duration ?? 5000;

    setToasts(prev => {
      const newToasts = prev.length >= maxToasts ? prev.slice(1) : prev;
      return [...newToasts, { ...toast, id, duration }];
    });

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, [maxToasts]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    options?: ToastOptions | number
  ) => {
    const opts: ToastOptions = typeof options === 'number'
      ? { duration: options }
      : options || {};

    addToast({
      type,
      message,
      title: opts.title,
      duration: opts.duration,
      action: opts.action,
    });
  }, [addToast]);

  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'success', { duration: 4000, ...options });
  }, [showToast]);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'error', { duration: 7000, ...options });
  }, [showToast]);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'warning', { duration: 6000, ...options });
  }, [showToast]);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'info', options);
  }, [showToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Listen for custom notification events from axios interceptor
  useEffect(() => {
    const handleNotification = (event: CustomEvent<{ type: ToastType; title?: string; message: string }>) => {
      const { type, title, message } = event.detail;
      showToast(message, type, { title });
    };

    window.addEventListener('notification:show', handleNotification as EventListener);
    return () => {
      window.removeEventListener('notification:show', handleNotification as EventListener);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

// =============================================================================
// Toast Container
// =============================================================================

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 space-y-3 z-[9999] max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// Individual Toast Item
// =============================================================================

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const config = getToastConfig(toast.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={`
        pointer-events-auto w-full p-4 rounded-xl shadow-2xl backdrop-blur-xl
        border ${config.border} ${config.bg}
        flex items-start gap-3
      `}
    >
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`font-semibold text-sm ${config.titleColor}`}>
            {toast.title}
          </p>
        )}
        <p className={`text-sm ${config.textColor} ${toast.title ? 'mt-1' : ''}`}>
          {toast.message}
        </p>

        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className={`mt-2 text-sm font-medium ${config.actionColor} hover:underline`}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className={`flex-shrink-0 p-1 rounded-lg transition-colors ${config.dismissColor}`}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

// =============================================================================
// Toast Configuration
// =============================================================================

function getToastConfig(type: ToastType) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-gray-900/95',
        border: 'border-green-500/30',
        icon: <CheckCircle size={20} />,
        iconColor: 'text-green-400',
        titleColor: 'text-green-400',
        textColor: 'text-gray-200',
        actionColor: 'text-green-400',
        dismissColor: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
      };
    case 'error':
      return {
        bg: 'bg-gray-900/95',
        border: 'border-red-500/30',
        icon: <XCircle size={20} />,
        iconColor: 'text-red-400',
        titleColor: 'text-red-400',
        textColor: 'text-gray-200',
        actionColor: 'text-red-400',
        dismissColor: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
      };
    case 'warning':
      return {
        bg: 'bg-gray-900/95',
        border: 'border-yellow-500/30',
        icon: <AlertTriangle size={20} />,
        iconColor: 'text-yellow-400',
        titleColor: 'text-yellow-400',
        textColor: 'text-gray-200',
        actionColor: 'text-yellow-400',
        dismissColor: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
      };
    case 'info':
    default:
      return {
        bg: 'bg-gray-900/95',
        border: 'border-blue-500/30',
        icon: <Info size={20} />,
        iconColor: 'text-blue-400',
        titleColor: 'text-blue-400',
        textColor: 'text-gray-200',
        actionColor: 'text-blue-400',
        dismissColor: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
      };
  }
}

export default ToastProvider;
