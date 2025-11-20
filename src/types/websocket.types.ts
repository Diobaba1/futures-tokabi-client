// src/types/websocket.types.ts
export interface WSMessage {
  type: string;
  data?: any;
  message?: string;
  timestamp?: number;
}

export interface PortfolioUpdateMessage {
  type: 'portfolio_update';
  data: {
    id: string;
    user_id: string;
    total_wallet_balance: number;
    total_margin_balance: number;
    total_unrealized_profit: number;
    available_balance: number;
    leverage: number;
    positions: any[];
    assets: any[];
    last_synced: string;
  };
}

export type WSConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';