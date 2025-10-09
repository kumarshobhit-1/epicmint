'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Hide loader after progress completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }} />

      {/* Loader Content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Animated Logo/Icon */}
        <div className="relative inline-block">
          {/* Rotating Ring */}
          <div className="w-24 h-24 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
        </div>

        {/* App Name */}
        <div className="space-y-3">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
              EpicMint
            </span>
          </h1>
          
          {/* Loading Text */}
          <p className="text-sm md:text-base text-muted-foreground animate-pulse">
            Loading your creative space...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto space-y-2">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground/70">
            {progress}%
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}
