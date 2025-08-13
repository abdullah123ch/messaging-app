'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { chatService, type Message } from '@/lib/api/chat';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useToast } from '@/components/ui/use-toast';

type ChatInterfaceProps = {
  className?: string;
};

export function ChatInterface({ className = '' }: ChatInterfaceProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load message history
  const loadMessages = useCallback(async () => {
    if (!roomId || !user) return;
    
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(roomId);
      setMessages(data.reverse()); // Show newest messages at the bottom
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, user, toast]);

  // Set up WebSocket connection
  useEffect(() => {
    if (!roomId || !user) return;

    const connectWebSocket = () => {
      try {
        const wsUrl = chatService.getWebSocketUrl(roomId, user.token!);
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'message') {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(), // Temporary ID, will be replaced by server ID
                content: data.content,
                sender_id: data.sender_id,
                recipient_id: data.recipient_id || null,
                room_id: roomId,
                is_read: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                read_at: null,
                sender: {
                  id: data.sender_id,
                  email: '',
                  full_name: data.sender_name,
                },
                recipient: null,
              },
            ]);
          } else if (data.type === 'typing') {
            if (data.is_typing) {
              setTypingUser(data.user_name);
              
              if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
              }
              
              typingTimeout.current = setTimeout(() => {
                setTypingUser(null);
              }, 2000);
            } else {
              setTypingUser(null);
            }
          }
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed. Reconnecting...');
          // Reconnect after a delay
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.current = socket;

        return () => {
          if (ws.current) {
            ws.current.close();
          }
          if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
          }
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connectWebSocket();
    loadMessages();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [roomId, user, loadMessages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !roomId) return;
    
    try {
      setIsSending(true);
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: Date.now(), // Temporary ID
        content,
        sender_id: user.id,
        recipient_id: null,
        room_id: roomId,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        read_at: null,
        sender: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        recipient: null,
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      
      // Send message via WebSocket
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'message',
          content,
          room_id: roomId,
        }));
      }
      
      // Also send via HTTP for persistence
      await chatService.sendMessage({
        content,
        room_id: roomId,
      });
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      
      // Remove the optimistic message if sending failed
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'typing',
          is_typing: isTyping,
          room_id: roomId,
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">
          {roomId.startsWith('group_') ? `Group: ${roomId.replace('group_', '')}` : 'Direct Message'}
        </h2>
        {typingUser && (
          <div className="text-sm text-muted-foreground">
            {typingUser} is typing...
          </div>
        )}
      </div>
      
      <MessageList 
        messages={messages} 
        currentUserId={user?.id || 0} 
        className="flex-1" 
      />
      
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        isSending={isSending}
        className="border-t"
      />
    </div>
  );
}
