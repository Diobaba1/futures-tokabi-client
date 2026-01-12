// src/providers/QueryProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Cache time - how long inactive data stays in cache
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
};

// Export the queryClient for use outside of React components
export { queryClient };

export default QueryProvider;
