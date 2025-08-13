'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Conversation = {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
};

export function ChatSidebar() {
  const [conversations] = useState<Conversation[]>([
    { id: '1', name: 'John Doe', lastMessage: 'Hey there!', unreadCount: 2 },
    { id: '2', name: 'Team Chat', lastMessage: 'Meeting at 3 PM', unreadCount: 0 },
    { id: '3', name: 'Jane Smith', lastMessage: 'Did you see the docs?', unreadCount: 1 },
  ]);

  const { roomId } = useParams();

  return (
    <div className="w-80 border-r p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={`block p-3 rounded-lg transition-colors ${
              roomId === conv.id ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
          >
            <div className="font-medium">{conv.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {conv.lastMessage}
            </div>
            {conv.unreadCount > 0 && (
              <span className="absolute right-4 mt-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
