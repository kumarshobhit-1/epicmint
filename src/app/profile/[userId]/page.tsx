// app/profile/[userId]/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/wallet-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNftStore } from '@/hooks/use-nft-store';
import { getUserProfile, updateUserProfile } from '@/lib/db-service';
import { ProfileEditDialog } from '@/components/profile/profile-edit-dialog';
import { NftShowcase } from '@/components/profile/nft-showcase';
import { FollowStats } from '@/components/profile/follow-stats';
import { FollowButton } from '@/components/profile/follow-button';
import { AchievementBadges } from '@/components/profile/achievement-badges';
import { WalletBalance } from '@/components/profile/wallet-balance';
import ConnectWallet from '@/components/connect-wallet';
import { 
  Wallet, 
  FileText, 
  Heart, 
  TrendingUp, 
  Mail,
  Shield,
  Twitter,
  Instagram,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Home
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Nft, UserProfile } from '@/lib/types';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { walletAddress, isConnected } = useWallet();
  const { nfts } = useNftStore();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Check if viewing own profile
  const isOwnProfile = currentUser?.uid === userId;

  // Set page title
  useEffect(() => {
    if (userProfile?.displayName) {
      document.title = `${userProfile.displayName} - EpicMint`;
    } else {
      document.title = 'Profile - EpicMint';
    }
  }, [userProfile?.displayName]);

  useEffect(() => {
    if (!authLoading && userId) {
      loadProfile();
    }
  }, [userId, currentUser, authLoading]);

  const loadProfile = async () => {
    setIsLoading(true);
    setNotFound(false);
    
    try {
      console.log('[Profile] Loading profile for userId:', userId);
      let profile = await getUserProfile(userId);
      console.log('[Profile] Got profile data:', profile ? 'SUCCESS' : 'NULL');
      
      // If no profile found and it's current user, create one
      if (!profile && isOwnProfile && currentUser) {
        console.log('[Profile] Creating missing profile for current user');
        const newProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email || 'User',
          photoURL: currentUser.photoURL || undefined,
          bio: '',
          walletAddress: walletAddress || '',
          socialLinks: {},
          followers: [],
          following: [],
          favorites: [],
          collections: [],
          createdNfts: [],
          ownedNfts: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        // Save to Firestore
        await updateUserProfile(currentUser.uid, newProfile);
        setUserProfile(newProfile);
        console.log('[Profile] Profile created successfully');
        return;
      }
      
      if (profile) {
        setUserProfile(profile);
      } else {
        setNotFound(true);
        toast({
          title: 'Profile not found',
          description: 'This user does not exist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('[Profile] Failed to load profile:', error);
      setNotFound(true);
      toast({
        title: 'Error loading profile',
        description: 'Please try clearing site data (F12 → Application → Clear site data)',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's NFTs
  // Note: NFTs are stored with wallet addresses in owners[], not Firebase UIDs
  const userWalletAddress = userProfile?.walletAddress?.toLowerCase();
  
  console.log('[Profile NFTs] Debug Info:', {
    userId,
    userWalletAddress,
    totalNftsInStore: nfts.length,
    userProfileData: userProfile,
  });
  
  const userNfts = nfts.filter((nft) => {
    if (!userWalletAddress) return false;
    const firstOwner = nft.owners[0]?.address?.toLowerCase();
    const currentOwner = nft.owners[nft.owners.length - 1]?.address?.toLowerCase();
    const matches = firstOwner === userWalletAddress || currentOwner === userWalletAddress;
    if (matches) {
      console.log('[Profile NFTs] Found user NFT:', nft.title, 'firstOwner:', firstOwner);
    }
    return matches;
  });
  
  console.log('[Profile NFTs] Filtered NFTs:', {
    userNfts: userNfts.length,
  });
  
  const createdNfts = userNfts.filter((nft) => 
    nft.owners[0]?.address?.toLowerCase() === userWalletAddress
  );
  
  const ownedNfts = userNfts.filter((nft) => {
    const currentOwner = nft.owners[nft.owners.length - 1]?.address?.toLowerCase();
    const firstOwner = nft.owners[0]?.address?.toLowerCase();
    return currentOwner === userWalletAddress && firstOwner !== userWalletAddress;
  });
  
  const favoriteNfts = nfts.filter((nft) => userProfile?.favorites?.includes(nft.hash));
  
  // Calculate sales count (NFTs created by user and sold to others)
  const salesCount = createdNfts.filter((nft) => {
    const currentOwner = nft.owners[nft.owners.length - 1]?.address?.toLowerCase();
    // If current owner is different from creator, it means it was sold
    return currentOwner !== userWalletAddress && nft.owners.length > 1;
  }).length;
  
  console.log('[Profile NFTs] Final Counts:', {
    created: createdNfts.length,
    owned: ownedNfts.length,
    favorites: favoriteNfts.length,
    sales: salesCount,
  });

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              If you're seeing this error, try:<br/>
              1. Press <kbd className="px-2 py-1 bg-muted rounded">F12</kbd> → Application → Clear site data<br/>
              2. Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Shift+R</kbd> to hard refresh
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => loadProfile()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => router.push('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Back Button (only for other profiles) */}
        {!isOwnProfile && (
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        {/* Profile Header */}
        <Card className="border-2 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={userProfile.photoURL || ''} />
                <AvatarFallback className="text-3xl font-headline">
                  {userProfile.displayName?.[0] || userProfile.email?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold font-headline">
                      {userProfile.displayName || 'Anonymous User'}
                    </h1>
                    {userProfile.bio && (
                      <p className="text-muted-foreground mt-2 max-w-2xl">
                        {userProfile.bio}
                      </p>
                    )}
                  </div>
                  
                  {isOwnProfile ? (
                    <ProfileEditDialog 
                      user={currentUser!} 
                      userProfile={userProfile} 
                      onProfileUpdated={loadProfile} 
                    />
                  ) : (
                    <FollowButton 
                      targetUserId={userId}
                      onFollowChange={loadProfile}
                    />
                  )}
                </div>

                {/* Social Links */}
                {userProfile.socialLinks && (
                  <div className="flex gap-3 flex-wrap">
                    {userProfile.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://twitter.com/${userProfile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {userProfile.socialLinks.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://instagram.com/${userProfile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-4 h-4 mr-2" />
                          Instagram
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {userProfile.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={userProfile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {userProfile.socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://github.com/${userProfile.socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {userProfile.socialLinks.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://linkedin.com/in/${userProfile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Follow Stats */}
                <FollowStats 
                  userId={userId}
                  followersCount={userProfile.followers?.length || 0}
                  followingCount={userProfile.following?.length || 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <FileText className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{createdNfts.length}</p>
                  <p className="text-sm text-muted-foreground">Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Wallet className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{ownedNfts.length}</p>
                  <p className="text-sm text-muted-foreground">Owned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-pink-500/10">
                  <Heart className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{favoriteNfts.length}</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{salesCount}</p>
                  <p className="text-sm text-muted-foreground">Sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Balance (only for own profile) */}
        {isOwnProfile && (
          isConnected && walletAddress ? (
            <WalletBalance walletAddress={walletAddress} />
          ) : (
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to view your balance and manage your NFTs
                    </p>
                    <ConnectWallet />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* Achievement Badges */}
        <AchievementBadges 
          userId={userId}
          nfts={userNfts}
          nftCount={createdNfts.length}
          followerCount={userProfile.followers?.length || 0}
          salesCount={salesCount}
        />

        {/* NFT Showcase */}
        <NftShowcase 
          createdNfts={createdNfts}
          ownedNfts={ownedNfts}
          favoriteNfts={favoriteNfts}
        />
      </div>
    </div>
  );
}
