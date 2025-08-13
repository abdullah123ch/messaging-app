'use client';

import { Loader2 } from 'lucide-react';

type LoadingProps = {
  fullScreen?: boolean;
  className?: string;
};

export function Loading({ fullScreen = false, className = '' }: LoadingProps) {
  const containerClasses = fullScreen 
    ? 'flex items-center justify-center min-h-screen w-full'
    : 'flex items-center justify-center w-full py-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
