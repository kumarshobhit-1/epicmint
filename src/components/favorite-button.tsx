'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addToFavorites, removeFromFavorites } from '@/lib/db-service';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

interface FavoriteButtonProps {
  nftHash: string;
  initialIsFavorite?: boolean;
  initialCount?: number;
}

export function FavoriteButton({
  nftHash,
  initialIsFavorite = false,
  initialCount = 0,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add favorites',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(user.uid, nftHash);
        setIsFavorite(false);
        setFavoriteCount((prev) => Math.max(0, prev - 1));
        toast({
          title: SUCCESS_MESSAGES.FAVORITE_REMOVED,
        });
      } else {
        await addToFavorites(user.uid, nftHash);
        setIsFavorite(true);
        setFavoriteCount((prev) => prev + 1);
        toast({
          title: SUCCESS_MESSAGES.FAVORITE_ADDED,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
      />
      <span>{favoriteCount}</span>
    </Button>
  );
}
