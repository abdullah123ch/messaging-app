import { apiClient } from './client';

export type Message = {
  id: number;
  content: string;
  sender_id: number;
  recipient_id: number | null;
  room_id: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  sender: {
    id: number;
    email: string;
    full_name: string;
  };
  recipient: {
    id: number;
    email: string;
    full_name: string;
  } | null;
};

export type SendMessageData = {
  content: string;
  room_id: string;
  recipient_id?: number;
};

export const chatService = {
  async getMessages(roomId: string, skip: number = 0, limit: number = 50) {
    const response = await apiClient.get<Message[]>('/messages/', {
      params: { room_id: roomId, skip, limit },
    });
    return response.data;
  },

  async sendMessage(data: SendMessageData) {
    const response = await apiClient.post<Message>('/messages/', data);
    return response.data;
  },

  async markAsRead(messageId: number) {
    const response = await apiClient.put<Message>(`/messages/${messageId}/read`);
    return response.data;
  },

  async getConversations() {
    // This would be implemented based on your API
    // For now, we'll return an empty array
    return [];
  },

  getWebSocketUrl(roomId: string, token: string) {
    return apiClient.getWebSocketUrl(roomId, token);
  },
};
