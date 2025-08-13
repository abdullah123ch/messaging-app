'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect to dashboard
    window.location.href = '/dashboard/chat/general';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md mt-2"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Sign in
          </button>
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
