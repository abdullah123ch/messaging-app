'use client';

import { notFound } from 'next/navigation';

// Generate static params for the dynamic route
export async function generateStaticParams() {
  // Pre-render these routes at build time
  return [{ roomId: ['general'] }];
}

type ChatPageProps = {
  params: { roomId?: string[] };
};

export default function ChatPage({ params }: ChatPageProps) {
  const roomName = params.roomId?.[0] || 'general';
  
  // Validate room name - only allow alphanumeric and hyphens/underscores
  if (!/^[a-zA-Z0-9-_]+$/.test(roomName)) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold">Room: {roomName}</h1>
      </div>
      
      <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Sample messages */}
          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
            <div>
              <div className="font-medium">User</div>
              <div className="text-sm text-gray-600">Welcome to the {roomName} room!</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              B
            </div>
            <div>
              <div className="font-medium">Bot</div>
              <div className="text-sm text-gray-600">This is a simple chat interface. You can customize it further!</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}
