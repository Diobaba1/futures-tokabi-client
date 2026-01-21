// ============================================================================
// FILE: src/components/chat/ChatInput.tsx
// Chat input component with symbol tags
// ============================================================================

import React, { useState, useCallback } from 'react';
import { PlusIcon, XIcon, SendIcon, Loader2Icon } from 'lucide-react';

interface ChatInputProps {
  onSend: (symbols: string[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  maxSymbols?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  isLoading = false,
  maxSymbols = 5,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [symbols, setSymbols] = useState<string[]>([]);

  const addSymbol = useCallback(() => {
    const symbol = inputValue.toUpperCase().trim();
    if (!symbol) return;

    if (symbols.includes(symbol)) {
      setInputValue('');
      return;
    }

    if (symbols.length >= maxSymbols) {
      return;
    }

    setSymbols(prev => [...prev, symbol]);
    setInputValue('');
  }, [inputValue, symbols, maxSymbols]);

  const removeSymbol = useCallback((symbol: string) => {
    setSymbols(prev => prev.filter(s => s !== symbol));
  }, []);

  const clearAllSymbols = useCallback(() => {
    setSymbols([]);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim()) {
          addSymbol();
        } else if (symbols.length > 0 && !disabled && !isLoading) {
          onSend(symbols);
        }
      }
    },
    [inputValue, symbols, addSymbol, disabled, isLoading, onSend]
  );

  const handleSend = useCallback(() => {
    if (symbols.length === 0 || disabled || isLoading) return;
    onSend(symbols);
    setSymbols([]);
  }, [symbols, disabled, isLoading, onSend]);

  const isDisabled = disabled || isLoading;
  const canAddMore = symbols.length < maxSymbols;
  const canSend = symbols.length > 0 && !isDisabled;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-4">
      {/* Symbol Tags */}
      {symbols.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {symbols.map(symbol => (
            <div
              key={symbol}
              className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-full border border-cyan-500/30 text-sm font-medium"
            >
              <span>{symbol}</span>
              <button
                onClick={() => removeSymbol(symbol)}
                disabled={isDisabled}
                className="text-cyan-400 hover:text-cyan-200 transition-colors disabled:opacity-50"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {symbols.length > 1 && (
            <button
              onClick={clearAllSymbols}
              disabled={isDisabled}
              className="text-xs text-gray-400 hover:text-gray-300 underline transition-colors disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isDisabled || !canAddMore}
            placeholder={
              canAddMore
                ? 'Enter symbol (e.g., BTCUSDT)...'
                : `Max ${maxSymbols} symbols`
            }
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={addSymbol}
            disabled={isDisabled || !inputValue.trim() || !canAddMore}
            className="text-gray-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl font-medium transition-all
            ${
              canSend
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
        <span>
          {symbols.length}/{maxSymbols} symbols selected
        </span>
        <span>Press Enter to add symbol or send</span>
      </div>
    </div>
  );
};
