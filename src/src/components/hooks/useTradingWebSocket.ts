// =============================================================================
// FILE: src/components/hooks/useTradingWebSocket.ts
// =============================================================================
// React Hook for Real-time Trading Updates via WebSocket
// =============================================================================

import { useState, useEffect, useCallback, useRef } from "react";
import tradingWebSocket, {
  Position,
  Balance,
  Portfolio,
  Trade,
  OrderUpdate,
  WebSocketMessage,
  WelcomeMessage,
} from "../../api/services/tradingWebSocketService";

export interface TradingState {
  isConnected: boolean;
  isConnecting: boolean;
  hasApiKey: boolean;
  isTestnet: boolean | null;
  portfolio: Portfolio | null;
  positions: Position[];
  balances: Balance[];
  trades: Trade[];
  lastSync: string | null;
  error: string | null;
}

export interface UseTradingWebSocketReturn extends TradingState {
  connect: () => void;
  disconnect: () => void;
  syncPositions: () => void;
  refreshPositions: () => void;
  refreshTrades: () => void;
}

export function useTradingWebSocket(
  autoConnect: boolean = true
): UseTradingWebSocketReturn {
  const [state, setState] = useState<TradingState>({
    isConnected: false,
    isConnecting: false,
    hasApiKey: false,
    isTestnet: null,
    portfolio: null,
    positions: [],
    balances: [],
    trades: [],
    lastSync: null,
    error: null,
  });

  const mountedRef = useRef(true);

  // Update state safely
  const updateState = useCallback((updates: Partial<TradingState>) => {
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case "welcome": {
          const data = message.data as WelcomeMessage;
          const positions = data.portfolio?.positions || [];
          const balances = data.portfolio?.assets || [];

          updateState({
            hasApiKey: data.has_api_key,
            isTestnet: data.testnet,
            portfolio: data.portfolio,
            positions: positions.map(normalizePosition),
            balances: balances.map(normalizeBalance),
            lastSync: data.portfolio?.last_synced || null,
            error: data.has_api_key ? null : "No API key configured",
          });
          break;
        }

        case "position_update": {
          const data = message.data as {
            positions: Array<{
              symbol: string;
              position_amount: number;
              entry_price: number;
              unrealized_pnl: number;
              position_side: string;
              margin_type: string;
              isolated_wallet: number;
            }>;
            event_time: number;
          };

          updateState({
            positions: data.positions.map((p) => ({
              symbol: p.symbol,
              position_amount: p.position_amount,
              entry_price: p.entry_price,
              mark_price: p.entry_price, // Will be updated
              unrealized_pnl: p.unrealized_pnl,
              liquidation_price: null,
              leverage: 1,
              margin_type: p.margin_type || "cross",
              position_side: p.position_side,
              notional: null,
              side: p.position_amount > 0 ? "long" : "short",
            })),
            lastSync: new Date(data.event_time).toISOString(),
          });
          break;
        }

        case "order_update": {
          const data = message.data as OrderUpdate;
          console.log("[Trading] Order update:", data);
          // Trigger position refresh after order update
          tradingWebSocket.getPositions();
          break;
        }

        case "account_update": {
          const data = message.data as {
            balances: Array<{
              asset: string;
              wallet_balance: number;
              cross_wallet_balance: number;
            }>;
            total_wallet_balance: number;
            available_balance: number;
          };

          updateState({
            balances: data.balances.map((b) => ({
              asset: b.asset,
              wallet_balance: b.wallet_balance,
              available_balance: b.cross_wallet_balance,
              unrealized_pnl: 0,
            })),
          });
          break;
        }

        case "sync_complete": {
          const data = message.data as {
            portfolio: Portfolio;
            positions_count: number;
          };

          updateState({
            portfolio: data.portfolio,
            positions: (data.portfolio?.positions || []).map(normalizePosition),
            balances: (data.portfolio?.assets || []).map(normalizeBalance),
            lastSync: data.portfolio?.last_synced || new Date().toISOString(),
          });
          break;
        }

        case "positions": {
          const data = message.data as {
            positions: Position[];
            last_synced: string | null;
          };

          updateState({
            positions: data.positions,
            lastSync: data.last_synced,
          });
          break;
        }

        case "trades": {
          const data = message.data as { trades: Trade[] };
          updateState({ trades: data.trades });
          break;
        }

        case "stream_started":
          console.log("[Trading] Stream started");
          break;

        case "stream_stopped":
          console.log("[Trading] Stream stopped");
          break;

        case "error": {
          const data = message.data as { code: string; message: string };
          console.error("[Trading] Error:", data.message);
          updateState({ error: data.message });
          break;
        }

        case "pong":
          // Ping/pong heartbeat
          break;

        default:
          console.log("[Trading] Unknown message:", message.type);
      }
    },
    [updateState]
  );

  // Connect to WebSocket
  const connect = useCallback(() => {
    updateState({ isConnecting: true, error: null });
    tradingWebSocket.connect();
  }, [updateState]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    tradingWebSocket.disconnect();
  }, []);

  // Sync positions from Binance
  const syncPositions = useCallback(() => {
    tradingWebSocket.syncPositions();
  }, []);

  // Refresh positions from cache
  const refreshPositions = useCallback(() => {
    tradingWebSocket.getPositions();
  }, []);

  // Refresh trades
  const refreshTrades = useCallback(() => {
    tradingWebSocket.getTrades();
  }, []);

  // Setup WebSocket handlers
  useEffect(() => {
    mountedRef.current = true;

    const unsubMessage = tradingWebSocket.onMessage(handleMessage);

    const unsubConnect = tradingWebSocket.onConnect(() => {
      updateState({ isConnected: true, isConnecting: false, error: null });
    });

    const unsubDisconnect = tradingWebSocket.onDisconnect(() => {
      updateState({ isConnected: false, isConnecting: false });
    });

    const unsubError = tradingWebSocket.onError((error) => {
      updateState({
        isConnecting: false,
        error: error instanceof Error ? error.message : "Connection error",
      });
    });

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      unsubMessage();
      unsubConnect();
      unsubDisconnect();
      unsubError();
    };
  }, [autoConnect, connect, handleMessage, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount - let the WebSocket stay connected
      // for other components. Only disconnect if explicitly called.
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    syncPositions,
    refreshPositions,
    refreshTrades,
  };
}

// Helper functions to normalize position data from various formats
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePosition(pos: any): Position {
  const positionAmt = Number(pos.positionAmt || pos.position_amount || 0);
  return {
    symbol: String(pos.symbol || ""),
    position_amount: positionAmt,
    entry_price: Number(pos.entryPrice || pos.entry_price || 0),
    mark_price: Number(pos.markPrice || pos.mark_price || 0),
    unrealized_pnl: Number(pos.unRealizedProfit || pos.unrealized_pnl || 0),
    liquidation_price: pos.liquidationPrice
      ? Number(pos.liquidationPrice)
      : pos.liquidation_price
      ? Number(pos.liquidation_price)
      : null,
    leverage: Number(pos.leverage || 1),
    margin_type: String(pos.marginType || pos.margin_type || "cross"),
    position_side: String(pos.positionSide || pos.position_side || "BOTH"),
    notional: pos.notional ? Number(pos.notional) : null,
    side: positionAmt > 0 ? "long" : "short",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBalance(bal: any): Balance {
  return {
    asset: String(bal.asset || ""),
    wallet_balance: Number(bal.walletBalance || bal.wallet_balance || 0),
    available_balance: Number(bal.availableBalance || bal.available_balance || 0),
    unrealized_pnl: Number(bal.unrealizedProfit || bal.unrealized_pnl || 0),
  };
}

export default useTradingWebSocket;
