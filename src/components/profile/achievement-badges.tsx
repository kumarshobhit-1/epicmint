'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getUserAchievements, ACHIEVEMENT_BADGES, type AchievementCriteria } from '@/lib/db-service';
import { Trophy, Lock } from 'lucide-react';
import type { Nft } from '@/lib/types';

type AchievementBadgesProps = {
  userId: string;
  nfts: Nft[];
  nftCount: number;
  followerCount: number;
  salesCount: number;
};

export function AchievementBadges({ 
  userId, 
  nfts, 
  nftCount, 
  followerCount, 
  salesCount 
}: AchievementBadgesProps) {
  const [earnedAchievements, setEarnedAchievements] = useState<AchievementCriteria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const achievements = await getUserAchievements(userId, nfts);
        setEarnedAchievements(achievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userId, nfts]);

  const calculateProgress = (achievement: AchievementCriteria): number => {
    const req = achievement.requirement;
    let totalProgress = 0;
    let criteriaCount = 0;

    if (req.nfts) {
      criteriaCount++;
      totalProgress += Math.min(100, (nftCount / req.nfts) * 100);
    }
    if (req.followers) {
      criteriaCount++;
      totalProgress += Math.min(100, (followerCount / req.followers) * 100);
    }
    if (req.sales) {
      criteriaCount++;
      totalProgress += Math.min(100, (salesCount / req.sales) * 100);
    }

    return criteriaCount > 0 ? totalProgress / criteriaCount : 0;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'bronze':
        return 'from-orange-600 to-orange-800';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-cyan-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const isEarned = (achievement: AchievementCriteria) => {
    return earnedAchievements.some(earned => earned.badge === achievement.badge);
  };

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <Badge variant="secondary">
            {earnedAchievements.length} / {ACHIEVEMENT_BADGES.length} Earned
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENT_BADGES.map((achievement) => {
            const earned = isEarned(achievement);
            const progress = calculateProgress(achievement);

            return (
              <TooltipProvider key={achievement.badge}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className={`relative overflow-hidden transition-all cursor-pointer ${
                        earned 
                          ? 'border-2 border-yellow-500/50 shadow-lg hover:scale-105' 
                          : 'opacity-60 hover:opacity-80'
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        {/* Badge Icon */}
                        <div 
                          className={`
                            w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-3xl
                            ${earned ? `bg-gradient-to-br ${getBadgeColor(achievement.badge)}` : 'bg-muted'}
                          `}
                        >
                          {earned ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                        </div>

                        {/* Badge Name */}
                        <p className="font-semibold text-sm mb-1">
                          {achievement.name}
                        </p>

                        {/* Progress Bar (if not earned) */}
                        {!earned && (
                          <div className="mt-2">
                            <Progress value={progress} className="h-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round(progress)}%
                            </p>
                          </div>
                        )}

                        {/* Earned Badge */}
                        {earned && (
                          <Badge className="mt-2 bg-green-500 text-white text-xs">
                            Earned
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="pt-2 space-y-1 text-xs">
                        {achievement.requirement.nfts && (
                          <p>• NFTs Created: {nftCount} / {achievement.requirement.nfts}</p>
                        )}
                        {achievement.requirement.followers && (
                          <p>• Followers: {followerCount} / {achievement.requirement.followers}</p>
                        )}
                        {achievement.requirement.sales && (
                          <p>• Sales: {salesCount} / {achievement.requirement.sales}</p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-500">{nftCount}</p>
              <p className="text-xs text-muted-foreground">NFTs Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{followerCount}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{salesCount}</p>
              <p className="text-xs text-muted-foreground">Sales</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
