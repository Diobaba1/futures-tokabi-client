import axiosInstance from '../axiosConfig';

export interface TokenPrice {
  id: number;
  chain_id: string;
  token_address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  usd_price: string;
  market_cap: number;
  liquidity_usd: string;
  holders: number;
  price_change_1h?: number;
  price_change_4h?: number;
  price_change_12h?: number;
  price_change_24h?: number;
  transactions_1h?: number;
  transactions_24h?: number;
  buyers_1h?: number;
  buyers_24h?: number;
  sellers_1h?: number;
  sellers_24h?: number;
  volume_usd_1h?: string;
  volume_usd_24h?: string;
  timestamp: string;
}

export const priceService = {
  // Get live prices
  getLivePrices: async (): Promise<TokenPrice[]> => {
    const response = await axiosInstance.get("API.PRICES.LIVE");
    return response.data;
  },

  // Get trending tokens (you might want to add filters later)
  getTrendingTokens: async (params?: {
    limit?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }): Promise<TokenPrice[]> => {
    const response = await axiosInstance.get("API.PRICES.LIVE", { params });
    return response.data;
  },
};