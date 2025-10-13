// src/api/services/websocketService.ts
import { API } from "../endpoints";
import {
  WSMessage,
  PortfolioUpdateMessage,
  WSConnectionStatus,
} from "../../types/websocket.types";

type EventCallback = (message: WSMessage) => void;

interface WebSocketServiceOptions {
  maxReconnectAttempts?: number;
  reconnectBaseInterval?: number;
  debug?: boolean;
  heartbeatInterval?: number;
  connectionTimeout?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private status: WSConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectBaseInterval: number;
  private heartbeatInterval: number;
  private connectionTimeout: number;
  private userId: string | null = null;
  private token: string | null = null;
  private messageQueue: string[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private connectionTimer: NodeJS.Timeout | null = null;
  private eventListeners = new Map<string, Set<EventCallback>>();
  private debug: boolean;

  constructor(options: WebSocketServiceOptions = {}) {
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
    this.reconnectBaseInterval = options.reconnectBaseInterval ?? 5000;
    this.heartbeatInterval = options.heartbeatInterval ?? 30_000; // 30s
    this.connectionTimeout = options.connectionTimeout ?? 10_000; // 10s
    this.debug = options.debug ?? false;
  }

  connect(userId: string, token: string): void {
    if (this.ws && this.status === "connected") {
      this.log("WebSocket already connected.");
      return;
    }

    this.userId = userId;
    this.token = token;

    const url = `${process.env.REACT_APP_API_BASE_URL}${API.STREAM.WS_PORTFOLIO(
      userId
    )}?token=${token}`;

    this.log(`Connecting to WebSocket: ${url}`);
    this.ws = new WebSocket(url);
    this.status = "connecting";

    // Set up connection timeout
    this.connectionTimer = setTimeout(() => {
      if (this.status !== "connected") {
        this.log("WebSocket connection timed out.");
        this.ws?.close();
      }
    }, this.connectionTimeout);

    this.ws.onopen = () => {
      this.status = "connected";
      this.reconnectAttempts = 0;
      this.log("✅ WebSocket connected");
      this.flushMessageQueue();
      this.startHeartbeat();
      this.clearConnectionTimer();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    this.ws.onclose = (event) => {
      this.log(`WebSocket closed (code ${event.code})`);
      this.status = "disconnected";
      this.stopHeartbeat();
      this.clearConnectionTimer();
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.status = "error";
      this.ws?.close(); // Force reconnect cycle
    };
  }

  private handleMessage(message: WSMessage): void {
    switch (message.type) {
      case "portfolio_update":
        window.dispatchEvent(
          new CustomEvent("portfolioUpdate", {
            detail: message as PortfolioUpdateMessage,
          })
        );
        this.emit("portfolio_update", message);
        break;

      case "heartbeat":
      case "pong":
        this.log("Received heartbeat/pong");
        break;

      case "token_expired":
        this.log("Token expired. Closing connection.");
        this.disconnect();
        break;

      case "error":
        console.error("WS Error:", message.message);
        break;

      default:
        this.emit(message.type, message);
        break;
    }
  }

  private attemptReconnect(): void {
    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      this.userId &&
      this.token
    ) {
      const delay =
        this.reconnectBaseInterval * Math.pow(2, this.reconnectAttempts); // Exponential backoff
      this.reconnectAttempts++;
      this.log(`Reconnecting in ${delay / 1000}s... (Attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(this.userId!, this.token!), delay);
    } else {
      this.log("Max reconnect attempts reached. Giving up.");
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // clear existing
    this.heartbeatTimer = setInterval(() => {
      this.sendMessage({ type: "ping" });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearConnectionTimer(): void {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }
  }

  sendMessage(message: { type: string; data?: any }): void {
    const payload = JSON.stringify(message);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    } else {
      this.log("WS not ready, queueing message:", message.type);
      this.messageQueue.push(payload);
    }
  }

  private flushMessageQueue(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg) this.ws.send(msg);
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.clearConnectionTimer();
    if (this.ws) {
      this.log("Closing WebSocket connection.");
      this.ws.close();
      this.ws = null;
      this.status = "disconnected";
    }
  }

  getStatus(): WSConnectionStatus {
    return this.status;
  }

  // -------------------- Event Emitter Pattern --------------------
  on(eventType: string, callback: EventCallback): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(callback);
  }

  off(eventType: string, callback: EventCallback): void {
    this.eventListeners.get(eventType)?.delete(callback);
  }

  private emit(eventType: string, message: WSMessage): void {
    this.eventListeners.get(eventType)?.forEach((cb) => cb(message));
  }

  // -------------------- Debug Helper --------------------
  private log(...args: any[]): void {
    if (this.debug) {
      console.log("[WebSocketService]", ...args);
    }
  }
}

export const websocketService = new WebSocketService({
  maxReconnectAttempts: 7,
  debug: process.env.NODE_ENV !== "production",
});
