// ============================================================================
// FILE: src/components/chat/TypingIndicator.tsx
// Animated typing indicator component
// ============================================================================

import React from 'react';

interface TypingIndicatorProps {
  text?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  text = 'Analyzing...',
}) => {
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      {/* Bot Avatar */}
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

      {/* Typing Bubble */}
      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          {/* Animated Dots */}
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1s' }}
            />
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', animationDuration: '1s' }}
            />
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', animationDuration: '1s' }}
            />
          </div>
          <span className="text-sm text-gray-400 ml-2">{text}</span>
        </div>
      </div>
    </div>
  );
};
