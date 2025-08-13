'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      router.push('/dashboard/chat/general');
    } else if (!isLoading) {
      // Only redirect to login if we're not loading and not authenticated
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Messaging App</h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect and chat with your friends in real-time
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/auth/register"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
