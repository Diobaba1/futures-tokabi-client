// ============================================================================
// FILE: src/components/chat/ChatContainer.tsx
// Main chat container component
// ============================================================================

import React, { useEffect, useRef } from 'react';
import {
  WifiIcon,
  WifiOffIcon,
  RefreshCwIcon,
  ClockIcon,
  AlertCircleIcon,
  XIcon,
  HistoryIcon,
} from 'lucide-react';
import { useWebSocketChat } from '../hooks/useWebSocketChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { SearchHistoryItem } from '../../types/userSymbolSearch.types';

interface ChatContainerProps {
  onViewHistory?: () => void;
  searchHistory?: SearchHistoryItem[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  onViewHistory,
  searchHistory = [],
}) => {
  const {
    messages,
    isConnected,
    isTyping,
    connectionStatus,
    error,
    rateLimit,
    sendSymbols,
    connect,
    clearMessages,
    clearError,
  } = useWebSocketChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendSymbols = (symbols: string[]) => {
    sendSymbols(symbols);
  };

  const formatResetTime = (resetTime: string) => {
    return new Date(resetTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Tokabi Analysis Assistant
            </h2>
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div
                className={`flex items-center gap-1 text-xs ${
                  isConnected ? 'text-emerald-400' : 'text-gray-500'
                }`}
              >
                {isConnected ? (
                  <>
                    <WifiIcon className="w-3 h-3" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOffIcon className="w-3 h-3" />
                    <span>
                      {connectionStatus === 'connecting'
                        ? 'Connecting...'
                        : 'Disconnected'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Rate Limit Badge */}
          {rateLimit && (
            <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-1.5">
              <ClockIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">
                {rateLimit.searches_remaining} left
              </span>
              {rateLimit.searches_remaining === 0 && (
                <span className="text-xs text-gray-500">
                  Resets at {formatResetTime(rateLimit.reset_time)}
                </span>
              )}
            </div>
          )}

          {/* History Button */}
          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <HistoryIcon className="w-4 h-4" />
              <span className="text-sm">History</span>
              {searchHistory.length > 0 && (
                <span className="bg-cyan-500/30 text-cyan-300 text-xs px-1.5 py-0.5 rounded-full">
                  {searchHistory.length}
                </span>
              )}
            </button>
          )}

          {/* Reconnect Button (when disconnected) */}
          {!isConnected && connectionStatus !== 'connecting' && (
            <button
              onClick={connect}
              className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span className="text-sm">Reconnect</span>
            </button>
          )}

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-gray-400 hover:text-gray-300 transition-colors p-2"
              title="Clear chat"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircleIcon className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Ready to analyze
            </h3>
            <p className="text-gray-400 max-w-sm">
              Enter cryptocurrency symbols below to get AI-powered analysis with
              technical signals, risk metrics, and trade recommendations.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                BTCUSDT
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                ETHUSDT
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                SOLUSDT
              </span>
            </div>
          </div>
        )}

        {/* Render messages */}
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendSymbols}
        disabled={!isConnected || (rateLimit?.searches_remaining === 0)}
        isLoading={isTyping}
        maxSymbols={5}
      />
    </div>
  );
};
