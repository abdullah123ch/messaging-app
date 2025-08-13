import { redirect } from 'next/navigation';

export default function Home() {
  // For now, redirect to login page
  // In a real app, you would check auth status first
  redirect('/(auth)/login');

  return null;
}
