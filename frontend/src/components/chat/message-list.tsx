'use client';

import { useEffect, useRef } from 'react';
import { formatMessageDate } from '@/lib/utils/date';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/lib/api/chat';

type MessageListProps = {
  messages: Message[];
  currentUserId: number;
  className?: string;
};

export function MessageList({ messages, currentUserId, className = '' }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className={`flex-1 ${className}`}>
      <div className="flex flex-col space-y-4 p-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === currentUserId;
          const formattedTime = formatMessageDate(message.created_at);
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <div className="flex-shrink-0 mr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender.email}`} 
                      alt={message.sender.full_name} 
                    />
                    <AvatarFallback>{message.sender.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                {!isCurrentUser && (
                  <div className="font-semibold text-sm mb-1">
                    {message.sender.full_name}
                  </div>
                )}
                <div className="break-words">{message.content}</div>
                <div 
                  className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                    isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  <span>{formattedTime}</span>
                  {isCurrentUser && message.is_read && (
                    <span>✓✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
