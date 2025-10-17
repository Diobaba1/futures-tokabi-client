// src/hooks/useWebSocketHandler.ts
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useWebSocketHandler = () => {
  const { user, websocketStatus, reconnectWebSocket } = useAuth();

  useEffect(() => {
    const handlePortfolioUpdate = (event: CustomEvent) => {
      console.log('📊 Portfolio update received:', event.detail);
      // Handle portfolio updates here
      // You can update your portfolio state or trigger refetch
    };

    const handleWebSocketError = (event: CustomEvent) => {
      console.error('WebSocket error:', event.detail);
      // Handle WebSocket errors
    };

    // Add event listeners for WebSocket messages
    window.addEventListener('portfolioUpdate', handlePortfolioUpdate as EventListener);
    window.addEventListener('websocketError', handleWebSocketError as EventListener);

    return () => {
      window.removeEventListener('portfolioUpdate', handlePortfolioUpdate as EventListener);
      window.removeEventListener('websocketError', handleWebSocketError as EventListener);
    };
  }, []);

  // Debug WebSocket status changes
  useEffect(() => {
    console.log('WebSocket Status:', websocketStatus);
    
    if (websocketStatus === 'error') {
      console.log('WebSocket in error state, user can manually reconnect');
    }
  }, [websocketStatus]);

  return {
    websocketStatus,
    reconnectWebSocket,
    isWebSocketConnected: websocketStatus === 'connected',
  };
};