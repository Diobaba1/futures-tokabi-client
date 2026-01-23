// ============================================================================
// FILE: src/types/chatMessage.types.ts
// Chat message type definitions for WebSocket communication
// ============================================================================

import { SymbolAnalysisResult, RateLimitInfo, AnalysisStatus } from './userSymbolSearch.types';

/**
 * Types of messages in the chat system
 */
export type MessageType =
  | 'user_message'
  | 'bot_thinking'
  | 'bot_response'
  | 'status_update'
  | 'error'
  | 'rate_limit'
  | 'welcome'
  | 'pong';

/**
 * WebSocket connection status
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Base chat message interface
 */
export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: ChatMessageMetadata;
}

/**
 * Metadata attached to chat messages
 */
export interface ChatMessageMetadata {
  symbols?: string[];
  searchId?: string;
  progress?: number;
  symbol?: string;
  analysisResults?: SymbolAnalysisResult[];
  rateLimit?: RateLimitInfo;
  rate_limit?: RateLimitInfo;
  errorCode?: string;
  // Rate limit specific fields
  searchesRemaining?: number;
  resetTime?: string;
  limitPer4h?: number;
}

/**
 * Welcome message from server
 */
export interface WelcomeMessage extends ChatMessage {
  type: 'welcome';
}

/**
 * User's symbol analysis request
 */
export interface UserChatMessage extends ChatMessage {
  type: 'user_message';
  metadata: {
    symbols: string[];
  };
}

/**
 * Bot thinking/processing indicator
 */
export interface BotThinkingMessage extends ChatMessage {
  type: 'bot_thinking';
  metadata?: {
    searchId?: string;
    symbols?: string[];
  };
}

/**
 * Status update during analysis
 */
export interface StatusUpdateMessage extends ChatMessage {
  type: 'status_update';
  metadata: {
    searchId: string;
    symbol?: string;
    progress?: number;
  };
}

/**
 * Bot response with analysis results
 */
export interface BotResponseMessage extends ChatMessage {
  type: 'bot_response';
  metadata: {
    searchId: string;
    analysisResults: SymbolAnalysisResult[];
    rateLimit?: RateLimitInfo;
  };
}

/**
 * Error message
 */
export interface ErrorChatMessage extends ChatMessage {
  type: 'error';
  metadata?: {
    errorCode?: string;
    searchId?: string;
  };
}

/**
 * Rate limit message
 */
export interface RateLimitChatMessage extends ChatMessage {
  type: 'rate_limit';
}

/**
 * Raw message from WebSocket server
 */
export interface RawChatMessage {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  metadata?: {
    symbols?: string[];
    search_id?: string;
    progress?: number;
    symbol?: string;
    analysis_results?: SymbolAnalysisResult[];
    rate_limit?: {
      searches_remaining: number;
      reset_time: string;
      limit_per_4h: number;
    };
    error_code?: string;
  };
}

/**
 * Outgoing message to WebSocket server
 */
export interface OutgoingMessage {
  action: 'analyze' | 'ping';
  symbols?: string[];
}

/**
 * Chat state for the hook
 */
export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
  rateLimit: RateLimitInfo | null;
}

/**
 * Transform API analysis result to frontend expected structure.
 * The API returns data in a nested `signal` object, but frontend expects
 * `final_decision`, `risk_metrics`, `market_data_summary`, etc.
 */
function transformAnalysisResult(apiResult: any): SymbolAnalysisResult {
  // If already in expected format (has final_decision) or is an error/pending, return as-is
  if (apiResult.final_decision !== undefined || !apiResult.signal) {
    // Already transformed or no signal data
    if (!apiResult.signal && apiResult.status !== 'success') {
      return {
        symbol: apiResult.symbol,
        status: apiResult.status || 'pending',
        error: apiResult.error,
        timestamp: apiResult.timestamp || new Date().toISOString(),
      };
    }
    // Already has final_decision - minimal transformation needed
    return apiResult as SymbolAnalysisResult;
  }

  const signal = apiResult.signal || {};
  const marketData = signal.market_data || {};
  const indicators = signal.indicators || marketData.indicators || {};

  return {
    symbol: apiResult.symbol || signal.symbol,
    status: apiResult.status as AnalysisStatus,
    final_decision: signal.decision || null,
    consensus_strength: signal.consensus_strength || null,
    risk_metrics: signal.entry_price ? {
      entry_price: signal.entry_price || null,
      stop_loss_price: signal.stop_loss_price || null,
      take_profit_price: signal.take_profit_price || null,
      estimated_sl_percent: signal.stop_loss_percent || null,
      estimated_tp_percent: signal.take_profit_percent || null,
      risk_reward_ratio: signal.risk_reward_ratio || null,
      suggested_leverage: signal.suggested_leverage || null,
    } : null,
    market_data_summary: {
      current_price: signal.current_price || marketData.current_price || 0,
      price_change_24h: marketData.price_change_24h || marketData.priceChangePercent || 0,
      volume_24h: marketData.volume_24h || marketData.volume || 0,
      high_24h: marketData.high_24h || marketData.highPrice,
      low_24h: marketData.low_24h || marketData.lowPrice,
    },
    indicators_summary: indicators.rsi ? {
      rsi: indicators.rsi || 0,
      macd: indicators.macd || 0,
      signal_line: indicators.signal_line || indicators.macd_signal || 0,
      atr: indicators.atr || 0,
      trend: indicators.trend || 'neutral',
    } : undefined,
    error: apiResult.error,
    timestamp: apiResult.timestamp || signal.created_at || new Date().toISOString(),
  };
}

/**
 * Transform array of API results to frontend format
 */
function transformAnalysisResults(apiResults: any[] | null | undefined): SymbolAnalysisResult[] {
  if (!apiResults || !Array.isArray(apiResults)) {
    return [];
  }
  return apiResults.map(transformAnalysisResult);
}

/**
 * Parse raw message from server into typed ChatMessage
 */
export function parseRawMessage(raw: RawChatMessage): ChatMessage {
  const metadata: ChatMessageMetadata = {};

  if (raw.metadata) {
    if (raw.metadata.symbols) metadata.symbols = raw.metadata.symbols;
    if (raw.metadata.search_id) metadata.searchId = raw.metadata.search_id;
    if (raw.metadata.progress !== undefined) metadata.progress = raw.metadata.progress;
    if (raw.metadata.symbol) metadata.symbol = raw.metadata.symbol;
    // Transform analysis results from API format to frontend format
    if (raw.metadata.analysis_results) {
      metadata.analysisResults = transformAnalysisResults(raw.metadata.analysis_results);
    }
    if (raw.metadata.error_code) metadata.errorCode = raw.metadata.error_code;
    if (raw.metadata.rate_limit) {
      metadata.rateLimit = {
        searches_remaining: raw.metadata.rate_limit.searches_remaining,
        reset_time: raw.metadata.rate_limit.reset_time,
        limit_per_4h: raw.metadata.rate_limit.limit_per_4h,
      };
    }
  }

  return {
    id: raw.id,
    type: raw.type as MessageType,
    content: raw.content,
    timestamp: new Date(raw.timestamp),
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}
