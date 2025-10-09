'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getFollowers, getFollowing } from '@/lib/db-service';
import { Users, UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

type FollowStatsProps = {
  userId: string;
  followersCount: number;
  followingCount: number;
};

export function FollowStats({ userId, followersCount, followingCount }: FollowStatsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenDialog = async (tab: 'followers' | 'following') => {
    setActiveTab(tab);
    setOpen(true);
    
    if ((tab === 'followers' && followers.length === 0) || 
        (tab === 'following' && following.length === 0)) {
      await loadData(tab);
    }
  };

  const loadData = async (tab: 'followers' | 'following') => {
    setIsLoading(true);
    try {
      if (tab === 'followers') {
        const data = await getFollowers(userId);
        setFollowers(data);
      } else {
        const data = await getFollowing(userId);
        setFollowing(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (uid: string) => {
    setOpen(false);
    router.push(`/profile/${uid}`);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-muted"
          onClick={() => handleOpenDialog('followers')}
        >
          <Users className="w-4 h-4" />
          <span className="font-semibold">{followersCount}</span>
          <span className="text-muted-foreground">Followers</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-muted"
          onClick={() => handleOpenDialog('following')}
        >
          <UserPlus className="w-4 h-4" />
          <span className="font-semibold">{followingCount}</span>
          <span className="text-muted-foreground">Following</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline">
              {activeTab === 'followers' ? 'Followers' : 'Following'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'followers' | 'following')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="followers" onClick={() => loadData('followers')}>
                Followers ({followersCount})
              </TabsTrigger>
              <TabsTrigger value="following" onClick={() => loadData('following')}>
                Following ({followingCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="followers" className="mt-4 max-h-[50vh] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : followers.length > 0 ? (
                <div className="space-y-2">
                  {followers.map((follower) => (
                    <Card
                      key={follower.uid}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleUserClick(follower.uid)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border-2 border-muted">
                            <AvatarImage 
                              src={follower.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.uid}`} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {(follower.displayName || follower.email || 'U')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {follower.displayName || 'Anonymous'}
                            </p>
                            {follower.bio && (
                              <p className="text-sm text-muted-foreground truncate">
                                {follower.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No followers yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="following" className="mt-4 max-h-[50vh] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : following.length > 0 ? (
                <div className="space-y-2">
                  {following.map((user) => (
                    <Card
                      key={user.uid}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleUserClick(user.uid)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border-2 border-muted">
                            <AvatarImage 
                              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {user.displayName || 'Anonymous'}
                            </p>
                            {user.bio && (
                              <p className="text-sm text-muted-foreground truncate">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Not following anyone yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
