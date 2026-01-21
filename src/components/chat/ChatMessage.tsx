// ============================================================================
// FILE: src/components/chat/ChatMessage.tsx
// Chat message bubble component
// ============================================================================

import React from 'react';
import {
  UserIcon,
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chatMessage.types';
import { AnalysisResultCard } from './AnalysisResultCard';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // User message (right-aligned)
  if (message.type === 'user_message') {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
            <p className="text-white">{message.content}</p>
            <span className="text-xs text-cyan-200/70 mt-1 block">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // Welcome message
  if (message.type === 'welcome') {
    return (
      <div className="flex items-start gap-3 max-w-[85%]">
        <BotAvatar />
        <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
          <p className="text-gray-200">{message.content}</p>
          {message.metadata?.rateLimit && (
            <div className="mt-2 flex items-center gap-2 text-sm text-cyan-400">
              <ClockIcon className="w-4 h-4" />
              <span>
                {message.metadata.rateLimit.searches_remaining} analyses remaining
              </span>
            </div>
          )}
          <span className="text-xs text-gray-500 mt-2 block">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Status update (centered, subtle)
  if (message.type === 'status_update') {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">{message.content}</span>
          {message.metadata?.progress && (
            <span className="text-xs text-cyan-400">
              {message.metadata.progress}%
            </span>
          )}
        </div>
      </div>
    );
  }

  // Bot response with analysis results
  if (message.type === 'bot_response') {
    return (
      <div className="flex items-start gap-3 max-w-[95%]">
        <BotAvatar />
        <div className="flex-1 space-y-3">
          {/* Response text */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium">
                Analysis Complete
              </span>
            </div>
            <p className="text-gray-200">{message.content}</p>
            <span className="text-xs text-gray-500 mt-2 block">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Analysis result cards */}
          {message.metadata?.analysisResults && (
            <div className="space-y-2">
              {message.metadata.analysisResults.map((result, index) => (
                <AnalysisResultCard key={`${result.symbol}-${index}`} result={result} />
              ))}
            </div>
          )}

          {/* Rate limit info */}
          {message.metadata?.rateLimit && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="w-4 h-4" />
              <span>
                {message.metadata.rateLimit.searches_remaining} analyses remaining
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error message
  if (message.type === 'error') {
    return (
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertCircleIcon className="w-4 h-4 text-red-400" />
        </div>
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
          <p className="text-red-300">{message.content}</p>
          <span className="text-xs text-red-400/70 mt-2 block">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Rate limit message
  if (message.type === 'rate_limit') {
    return (
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <ClockIcon className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
          <p className="text-yellow-300">{message.content}</p>
          <span className="text-xs text-yellow-400/70 mt-2 block">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Default bot message (for any other type)
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <BotAvatar />
      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
        <p className="text-gray-200">{message.content}</p>
        <span className="text-xs text-gray-500 mt-2 block">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

// Bot avatar component
const BotAvatar: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
    <svg
      className="w-4 h-4 text-white"
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
);
