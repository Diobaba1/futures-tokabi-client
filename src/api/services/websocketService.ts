// src/api/services/websocketService.ts
type WSStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface WebSocketServiceOptions {
  maxReconnectAttempts?: number;
  debug?: boolean;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private status: WSStatus = "idle";
  private heartbeatInterval: number | null = null;
  private connectionTimer: number | null = null;

  private maxReconnectAttempts: number;
  private debug: boolean;
  private currentPath: string = "";
  private currentToken: string = "";

  // Event listeners for connection status changes
  private connectionChangeCallbacks: Array<(status: WSStatus) => void> = [];

  constructor(options: WebSocketServiceOptions = {}) {
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 7;
    this.debug = options.debug ?? false;

    // Clean up on tab close / logout
    window.addEventListener("beforeunload", () => this.disconnect(), {
      once: true,
    });
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log("[WebSocketService]", ...args);
    }
  }

  private setStatus(newStatus: WSStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.notifyConnectionChange();
    }
  }

  private notifyConnectionChange() {
    this.connectionChangeCallbacks.forEach((callback) => {
      try {
        callback(this.status);
      } catch (error) {
        console.error("Error in connection change callback:", error);
      }
    });
  }

  onConnectionChange(callback: (status: WSStatus) => void) {
    this.connectionChangeCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.connectionChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionChangeCallbacks.splice(index, 1);
      }
    };
  }

  private buildWebSocketUrl(path: string, token?: string): string {
    try {
      // For localhost development, use the environment variable
      const baseApi = process.env.REACT_APP_API_BASE_URL || "https://server.tokabi.org/api";
      
      // Convert HTTP to WebSocket protocol
      const wsBase = baseApi
        .replace(/^http/, "ws")
        .replace(/^https/, "wss")
        .replace(/\/+$/, ""); // remove trailing slashes

      // Your backend WebSocket route is mounted at /api/stream
      // The full path should be: /stream/ws/portfolio/{user_id}
      let normalizedPath = path;
      
      // Ensure the path starts with /stream
      if (!normalizedPath.startsWith("/stream")) {
        normalizedPath = `/stream${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
      }

      let url = `${wsBase}${normalizedPath}`;

      if (token) {
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}token=${encodeURIComponent(token)}`;
      }

      this.log("Built WebSocket URL:", url);
      return url;
    } catch (error) {
      console.error("Error building WebSocket URL:", error);
      throw new Error("Failed to build WebSocket URL");
    }
  }

  connect(path: string, token?: string) {
    try {
      // Prevent duplicate connects
      if (this.status === "connecting" || this.status === "connected") {
        this.log("Already connected/connecting, skipping new connect()");
        return;
      }

      this.currentPath = path;
      this.currentToken = token || "";

      const url = this.buildWebSocketUrl(path, token);
      this.log("Connecting to WebSocket...", url);

      this.setStatus("connecting");

      // Clean up any existing connection
      if (this.ws) {
        this.ws.close(1000, "Reconnecting");
        this.ws = null;
      }

      this.ws = new WebSocket(url);

      this.ws.onopen = (event) => {
        try {
          this.log("WebSocket connected successfully");
          this.setStatus("connected");
          this.reconnectAttempts = 0;
          this.startHeartbeat();
        } catch (error) {
          console.error("Error in onopen:", error);
          this.setStatus("error");
        }
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event).catch((error) => {
          console.error("Error handling message:", error);
        });
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket connection error:", error);
        this.setStatus("error");
      };

      this.ws.onclose = (event) => {
        try {
          this.log(
            `WebSocket closed - Code: ${event.code}, Reason: ${
              event.reason || "No reason provided"
            }, Clean: ${event.wasClean}`
          );
          this.setStatus("disconnected");
          this.stopHeartbeat();
          this.clearConnectionTimer();

          // Handle different closure codes
          switch (event.code) {
            case 1000: // Normal closure
              this.log("WebSocket closed normally");
              break;
            case 1001: // Going away
              this.log("WebSocket going away");
              break;
            case 1006: // Abnormal closure
              console.error("WebSocket connection failed abnormally (1006)");
              this.attemptReconnect();
              break;
            case 1008: // Policy violation (auth failed)
              console.error("WebSocket authentication failed (1008)");
              // Don't reconnect on auth failures
              break;
            default:
              // For other unexpected closures, attempt reconnect
              if (event.code !== 1000 && event.code !== 1001) {
                this.attemptReconnect();
              }
          }
        } catch (error) {
          console.error("Error in onclose:", error);
        }
      };
    } catch (error) {
      console.error("Error in connect:", error);
      this.setStatus("error");
    }
  }

  private async attemptReconnect() {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(
          `Max reconnect attempts (${this.maxReconnectAttempts}) reached. Giving up.`
        );
        this.setStatus("error");
        return;
      }

      this.reconnectAttempts++;

      // Exponential backoff with jitter
      const baseDelay = 2000;
      const maxDelay = 30000;
      const delay = Math.min(
        maxDelay,
        baseDelay * Math.pow(2, this.reconnectAttempts - 1)
      );
      const jitter = delay * 0.1 * Math.random();
      const totalDelay = delay + jitter;

      this.log(
        `Reconnecting in ${(totalDelay / 1000).toFixed(1)}s... (attempt ${
          this.reconnectAttempts
        }/${this.maxReconnectAttempts})`
      );

      this.connectionTimer = window.setTimeout(() => {
        try {
          if (this.currentPath && this.currentToken) {
            this.connect(this.currentPath, this.currentToken);
          }
        } catch (error) {
          console.error("Reconnect failed:", error);
        }
      }, totalDelay);
    } catch (error) {
      console.error("Error in attemptReconnect:", error);
    }
  }

  private clearConnectionTimer() {
    try {
      if (this.connectionTimer) {
        clearTimeout(this.connectionTimer);
        this.connectionTimer = null;
      }
    } catch (error) {
      console.error("Error clearing connection timer:", error);
    }
  }

  private startHeartbeat() {
    try {
      this.stopHeartbeat();
      this.heartbeatInterval = window.setInterval(() => {
        try {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "ping" }));
            this.log("Sent heartbeat ping");
          } else {
            console.warn("Heartbeat failed: WebSocket not open");
            this.stopHeartbeat();
          }
        } catch (error) {
          console.error("Heartbeat error:", error);
          this.stopHeartbeat();
        }
      }, 25000); // 25s heartbeat
    } catch (error) {
      console.error("Error starting heartbeat:", error);
    }
  }

  private stopHeartbeat() {
    try {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    } catch (error) {
      console.error("Error stopping heartbeat:", error);
    }
  }

  private async handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.log("Received WebSocket message:", data);

      // Handle heartbeat response
      if (data.type === "pong") {
        this.log("Received heartbeat pong");
        return;
      }

      // Dispatch custom events based on message type
      if (data.type === "portfolio_update") {
        const eventDetail = { detail: data };
        window.dispatchEvent(new CustomEvent("portfolioUpdate", eventDetail));
        this.log("Dispatched portfolioUpdate event");
      }

      // Handle other message types
      if (data.type === "error") {
        console.error("WebSocket error from server:", data.message);
        // You can dispatch an error event if needed
        const eventDetail = { detail: data };
        window.dispatchEvent(new CustomEvent("websocketError", eventDetail));
      }
    } catch (parseError) {
      console.error(
        "Failed to parse WebSocket message:",
        parseError,
        event.data
      );
    }
  }

  send(data: any): boolean {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
        this.log("Sent WebSocket message:", data);
        return true;
      } else {
        console.warn(
          "Cannot send message - WebSocket not open. Status:",
          this.status
        );
        return false;
      }
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  }

  disconnect() {
    try {
      this.log("Disconnecting WebSocket...");
      this.stopHeartbeat();
      this.clearConnectionTimer();

      if (this.ws) {
        // Only close if not already closing or closed
        if (
          this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING
        ) {
          this.ws.close(1000, "Client disconnected");
        }
        this.ws = null;
      }

      this.setStatus("idle");
      this.reconnectAttempts = 0;
      this.currentPath = "";
      this.currentToken = "";
    } catch (error) {
      console.error("Error in disconnect:", error);
    }
  }

  getStatus(): WSStatus {
    return this.status;
  }

  isConnected(): boolean {
    return (
      this.status === "connected" && this.ws?.readyState === WebSocket.OPEN
    );
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

// Create and export a singleton instance
export const websocketService = new WebSocketService({
  debug: process.env.NODE_ENV === "development",
  maxReconnectAttempts: 5,
});