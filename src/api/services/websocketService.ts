// ============================================================================
// FILE: src/api/services/websocketService.ts
// WebSocket service for real-time chat communication
// ============================================================================

import { RawChatMessage, OutgoingMessage, ConnectionStatus } from '../../types/chatMessage.types';

type MessageHandler = (message: RawChatMessage) => void;
type StatusHandler = (status: ConnectionStatus) => void;
type ErrorHandler = (error: string) => void;

/**
 * WebSocket service for chat-like symbol analysis
 */
class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5; // Reduced from 10
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 10000; // Reduced from 30 seconds
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private connectionTimeoutMs = 15000; // 15 second connection timeout
  private pingInterval: NodeJS.Timeout | null = null;
  private pingIntervalMs = 25000; // 25 seconds

  private isIntentionalClose = false;
  private currentStatus: ConnectionStatus = 'disconnected';

  /**
   * Get the WebSocket URL based on the API base URL
   */
  private getWebSocketUrl(): string {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

    // Convert HTTP URL to WebSocket URL
    let wsUrl = apiBaseUrl
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://');

    // Remove trailing slash if present, but keep /api
    wsUrl = wsUrl.replace(/\/$/, '');

    // WebSocket endpoint is at /api/ws/chat
    return `${wsUrl}/ws/chat`;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Clean up any existing socket in connecting state
    if (this.socket?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket already connecting, closing stale connection');
      this.socket.close();
      this.socket = null;
    }

    this.isIntentionalClose = false;
    this.updateStatus('connecting');

    try {
      // Auth is handled via httpOnly cookies sent automatically on WS upgrade.
      const wsUrl = this.getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);

      this.socket = new WebSocket(wsUrl);

      // Set connection timeout
      this.clearConnectionTimeout();
      this.connectionTimeout = setTimeout(() => {
        if (this.socket?.readyState === WebSocket.CONNECTING) {
          console.error('WebSocket connection timeout');
          this.socket.close();
          this.socket = null;
          this.updateStatus('error');
          this.notifyError('Connection timeout. Server may be unavailable.');
          this.scheduleReconnect();
        }
      }, this.connectionTimeoutMs);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.notifyError('Failed to connect to server');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    this.isIntentionalClose = true;
    this.clearReconnectTimeout();
    this.clearConnectionTimeout();
    this.stopPing();

    if (this.socket) {
      this.socket.close(1000, 'Client disconnecting');
      this.socket = null;
    }

    this.updateStatus('disconnected');
  }

  /**
   * Send a message to the server
   */
  send(message: OutgoingMessage): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected. Cannot send message.');
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * Send symbols for analysis
   */
  analyzeSymbols(symbols: string[]): boolean {
    return this.send({
      action: 'analyze',
      symbols,
    });
  }

  /**
   * Send a ping to keep connection alive
   */
  ping(): boolean {
    return this.send({ action: 'ping' });
  }

  /**
   * Register a message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register a status change handler
   */
  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    // Immediately notify of current status
    handler(this.currentStatus);
    return () => this.statusHandlers.delete(handler);
  }

  /**
   * Register an error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // =========================================================================
  // Private handlers
  // =========================================================================

  private handleOpen(): void {
    console.log('WebSocket connected successfully');
    this.clearConnectionTimeout();
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    this.updateStatus('connected');
    this.startPing();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      // Handle pong responses (keep-alive)
      if (data.type === 'pong') {
        return;
      }

      // Notify all message handlers
      this.messageHandlers.forEach(handler => {
        try {
          handler(data as RawChatMessage);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    this.clearConnectionTimeout();
    this.stopPing();

    if (this.isIntentionalClose) {
      this.updateStatus('disconnected');
      return;
    }

    // Handle authentication failure
    if (event.code === 4001) {
      this.notifyError('Authentication failed. Please log in again.');
      this.updateStatus('error');
      return;
    }

    this.updateStatus('disconnected');
    this.scheduleReconnect();
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.clearConnectionTimeout();
    this.updateStatus('error');
  }

  // =========================================================================
  // Reconnection logic
  // =========================================================================

  private scheduleReconnect(): void {
    if (this.isIntentionalClose) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.notifyError('Unable to connect to server. Please check your connection and try again.');
      return;
    }

    this.clearReconnectTimeout();

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  // =========================================================================
  // Keep-alive ping
  // =========================================================================

  private startPing(): void {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      this.ping();
    }, this.pingIntervalMs);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // =========================================================================
  // Notification helpers
  // =========================================================================

  private updateStatus(status: ConnectionStatus): void {
    this.currentStatus = status;
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in status handler:', error);
      }
    });
  }

  private notifyError(error: string): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
