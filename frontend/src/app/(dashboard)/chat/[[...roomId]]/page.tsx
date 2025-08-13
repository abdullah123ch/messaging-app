'use client';

import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { roomId } = useParams() as { roomId?: string[] };
  const chatId = roomId?.[0];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      {chatId ? (
        <ChatInterface className="flex-1" />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/50">
          <div className="text-center p-8 max-w-md">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose an existing conversation or start a new one to begin messaging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
