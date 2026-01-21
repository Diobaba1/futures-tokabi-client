// ============================================================================
// FILE: src/components/hooks/useWebSocketChat.ts
// React hook for WebSocket chat functionality
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChatMessage,
  ConnectionStatus,
  RawChatMessage,
  parseRawMessage,
} from '../../types/chatMessage.types';
import { RateLimitInfo } from '../../types/userSymbolSearch.types';
import { websocketService } from '../../api/services/websocketService';

interface UseWebSocketChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
  rateLimit: RateLimitInfo | null;
  sendSymbols: (symbols: string[]) => boolean;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
  clearError: () => void;
}

export function useWebSocketChat(): UseWebSocketChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  // Track if we should auto-connect
  const hasConnectedRef = useRef(false);

  // Handle incoming messages
  const handleMessage = useCallback((raw: RawChatMessage) => {
    const message = parseRawMessage(raw);

    // Handle different message types
    switch (message.type) {
      case 'welcome':
        // Update rate limit from welcome message
        if (message.metadata?.rateLimit) {
          setRateLimit(message.metadata.rateLimit);
        }
        break;

      case 'bot_thinking':
        setIsTyping(true);
        break;

      case 'status_update':
        // Status updates don't need to be stored as messages
        // but we can add them for progress display
        break;

      case 'bot_response':
        setIsTyping(false);
        // Update rate limit from response
        if (message.metadata?.rateLimit) {
          setRateLimit(message.metadata.rateLimit);
        }
        break;

      case 'error':
        setIsTyping(false);
        break;

      case 'rate_limit':
        setIsTyping(false);
        // Update rate limit info
        if (message.metadata) {
          const meta = message.metadata as any;
          if (meta.searchesRemaining !== undefined) {
            setRateLimit({
              searches_remaining: meta.searchesRemaining,
              reset_time: meta.resetTime,
              limit_per_4h: meta.limitPer4h || 2,
            });
          }
        }
        break;
    }

    // Add message to list (except for pong messages)
    if (message.type !== 'pong') {
      setMessages(prev => [...prev, message]);
    }
  }, []);

  // Handle connection status changes
  const handleStatusChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);

    if (status === 'disconnected' && !hasConnectedRef.current) {
      setError(null);
    } else if (status === 'error') {
      setIsTyping(false);
    }
  }, []);

  // Handle errors
  const handleError = useCallback((err: string) => {
    setError(err);
    setIsTyping(false);
  }, []);

  // Set up WebSocket event handlers
  useEffect(() => {
    const unsubMessage = websocketService.onMessage(handleMessage);
    const unsubStatus = websocketService.onStatusChange(handleStatusChange);
    const unsubError = websocketService.onError(handleError);

    // Auto-connect if we have a token
    const token = localStorage.getItem('accessToken');
    if (token && !hasConnectedRef.current) {
      hasConnectedRef.current = true;
      websocketService.connect();
    }

    return () => {
      unsubMessage();
      unsubStatus();
      unsubError();
    };
  }, [handleMessage, handleStatusChange, handleError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount - let the service manage the connection
      // This allows the connection to persist across page navigations
    };
  }, []);

  // Send symbols for analysis
  const sendSymbols = useCallback((symbols: string[]): boolean => {
    if (!websocketService.isConnected()) {
      setError('Not connected to server. Please wait...');
      websocketService.connect();
      return false;
    }

    // Clear previous error
    setError(null);

    // Create a local user message for immediate display
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user_message',
      content: `Analyze: ${symbols.join(', ')}`,
      timestamp: new Date(),
      metadata: { symbols },
    };

    setMessages(prev => [...prev, userMessage]);

    return websocketService.analyzeSymbols(symbols);
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    hasConnectedRef.current = true;
    websocketService.connect();
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isConnected: connectionStatus === 'connected',
    isTyping,
    connectionStatus,
    error,
    rateLimit,
    sendSymbols,
    connect,
    disconnect,
    clearMessages,
    clearError,
  };
}
