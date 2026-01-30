// =============================================================================
// FILE: src/api/services/tradingWebSocketService.ts
// =============================================================================
// WebSocket Service for Real-time Trading Updates (Positions, Orders, Balances)
// =============================================================================

export type WebSocketMessageType =
  | "welcome"
  | "position_update"
  | "order_update"
  | "account_update"
  | "stream_started"
  | "stream_stopped"
  | "sync_complete"
  | "positions"
  | "trades"
  | "error"
  | "pong"
  | "info";

export interface Position {
  symbol: string;
  position_amount: number;
  entry_price: number;
  mark_price: number;
  unrealized_pnl: number;
  liquidation_price: number | null;
  leverage: number;
  margin_type: string;
  position_side: string;
  notional: number | null;
  side: "long" | "short";
}

export interface Balance {
  asset: string;
  wallet_balance: number;
  available_balance: number;
  unrealized_pnl: number;
}

export interface Portfolio {
  id: string;
  user_id: string;
  total_wallet_balance: number;
  total_margin_balance: number;
  total_unrealized_profit: number;
  available_balance: number;
  positions: Position[];
  assets: Balance[];
  last_synced: string | null;
  sync_status: string;
}

export interface Trade {
  id: string;
  symbol: string;
  side: string;
  entry_price: number;
  quantity: number;
  leverage: number;
  stop_loss_price: number;
  take_profit_price: number;
  unrealized_pnl_usd: number;
  status: string;
  created_at: string;
}

export interface OrderUpdate {
  order_id: string;
  symbol: string;
  side: string;
  order_type: string;
  order_status: string;
  execution_type: string;
  average_price: number;
  filled_quantity: number;
  realized_profit: number;
  event_time: number;
}

export interface WelcomeMessage {
  message: string;
  has_api_key: boolean;
  portfolio: Portfolio | null;
  positions_count: number;
  testnet: boolean | null;
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: unknown;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionHandler = () => void;
export type ErrorHandler = (error: Event | Error) => void;

class TradingWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectHandlers: Set<ConnectionHandler> = new Set();
  private disconnectHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private isIntentionallyClosed = false;

  private getWebSocketUrl(): string {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsBase = baseUrl.replace(/^https?/, wsProtocol);
    return `${wsBase}/ws/trading`;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("[TradingWS] Already connected");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("[TradingWS] No access token found");
      this.errorHandlers.forEach((handler) =>
        handler(new Error("No access token"))
      );
      return;
    }

    this.isIntentionallyClosed = false;
    const url = `${this.getWebSocketUrl()}?token=${token}`;

    console.log("[TradingWS] Connecting...");

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("[TradingWS] Connected");
        this.reconnectAttempts = 0;
        this.startPingInterval();
        this.connectHandlers.forEach((handler) => handler());
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("[TradingWS] Received:", message.type);
          this.messageHandlers.forEach((handler) => handler(message));
        } catch (error) {
          console.error("[TradingWS] Parse error:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("[TradingWS] Closed:", event.code, event.reason);
        this.stopPingInterval();
        this.disconnectHandlers.forEach((handler) => handler());

        if (!this.isIntentionallyClosed && event.code !== 4001) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("[TradingWS] Error:", error);
        this.errorHandlers.forEach((handler) => handler(error));
      };
    } catch (error) {
      console.error("[TradingWS] Connection error:", error);
      this.errorHandlers.forEach((handler) =>
        handler(error instanceof Error ? error : new Error(String(error)))
      );
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close(1000, "User disconnect");
      this.ws = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[TradingWS] Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `[TradingWS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.connect();
      }
    }, delay);
  }

  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      this.send({ action: "ping" });
    }, 30000);
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  send(data: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("[TradingWS] Cannot send, not connected");
    }
  }

  // Actions
  subscribe(): void {
    this.send({ action: "subscribe" });
  }

  unsubscribe(): void {
    this.send({ action: "unsubscribe" });
  }

  syncPositions(): void {
    this.send({ action: "sync" });
  }

  getPositions(): void {
    this.send({ action: "get_positions" });
  }

  getTrades(): void {
    this.send({ action: "get_trades" });
  }

  // Event handlers
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.add(handler);
    return () => this.connectHandlers.delete(handler);
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Singleton instance
export const tradingWebSocket = new TradingWebSocketService();
export default tradingWebSocket;
