'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { followUser, unfollowUser, isFollowing } from '@/lib/db-service';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type FollowButtonProps = {
  targetUserId: string;
  onFollowChange?: () => void;
};

export function FollowButton({ targetUserId, onFollowChange }: FollowButtonProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const status = await isFollowing(user.uid, targetUserId);
        setFollowing(status);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [user, targetUserId]);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to follow users',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (following) {
        await unfollowUser(user.uid, targetUserId);
        setFollowing(false);
        toast({
          title: 'Unfollowed',
          description: 'You are no longer following this user',
        });
      } else {
        await followUser(user.uid, targetUserId);
        setFollowing(true);
        toast({
          title: 'Following',
          description: 'You are now following this user',
        });
      }
      onFollowChange?.();
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update follow status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if user is viewing their own profile
  if (user?.uid === targetUserId) {
    return null;
  }

  if (isCheckingStatus) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      variant={following ? 'outline' : 'default'}
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : following ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
