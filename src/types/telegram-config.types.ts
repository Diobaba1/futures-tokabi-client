// src/api/types/telegram-config.types.ts

export interface TelegramConfigCreate {
  chat_id: string;
  bot_token: string;
}

export interface TelegramConfigUpdate {
  chat_id?: string;
  bot_token?: string;
}

export interface TelegramConfigResponse {
  id: string;
  user_id: string;
  chat_id: string;
  bot_token: string;
  created_at: string;
  updated_at?: string;
}