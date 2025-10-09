// components/ui/loading-states.tsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

// Generic Loading Spinner
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}> = ({ size = 'md', text, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

// NFT Card Skeleton
export const NFTCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden">
    <div className="aspect-square relative">
      <Skeleton className="w-full h-full" />
    </div>
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

// Grid of NFT Card Skeletons
export const NFTGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <NFTCardSkeleton key={index} />
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-14 mx-auto" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Comment Section Skeleton
export const CommentSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Search Results Skeleton
export const SearchSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
);

// Page Loading
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = 'लोड हो रहा है... Loading...' 
}) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-muted-foreground text-center">{message}</p>
  </div>
);

// Section Loading
export const SectionLoading: React.FC<{ message?: string }> = ({ 
  message = 'Loading section...' 
}) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner text={message} />
  </div>
);

// Network Status Indicator
export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>कोई इंटरनेट कनेक्शन नहीं है | No internet connection</span>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
    {icon && (
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    )}
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
    {action && action}
  </div>
);

// Retry Component
export const RetryComponent: React.FC<{
  onRetry: () => void;
  message?: string;
  isLoading?: boolean;
}> = ({ 
  onRetry, 
  message = 'कुछ गलत हो गया। पुनः प्रयास करें। | Something went wrong. Please try again.',
  isLoading = false 
}) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <p className="text-center text-muted-foreground">{message}</p>
    <button
      onClick={onRetry}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wifi className="h-4 w-4" />
      )}
      {isLoading ? 'Retrying...' : 'पुनः प्रयास करें | Retry'}
    </button>
  </div>
);