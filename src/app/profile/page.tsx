// app/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Set page title
    document.title = 'Profile - EpicMint';
    
    if (!isLoading) {
      if (!user) {
        // Not logged in - redirect to signin
        console.log('[Profile Redirect] No user found, redirecting to /signin');
        router.push('/signin');
      } else {
        // Logged in - redirect to own profile with userId
        console.log('[Profile Redirect] User found, redirecting to:', `/profile/${user.uid}`);
        router.push(`/profile/${user.uid}`);
      }
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="h-48 w-full rounded-2xl bg-muted animate-pulse" />
        <div className="h-96 w-full rounded-2xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}