'use client';

import { useNftStore } from '@/hooks/use-nft-store';
import { useWallet } from '@/contexts/wallet-context';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Nft } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { 
  Eye, 
  Heart, 
  Share2, 
  Clock, 
  User, 
  Tag, 
  DollarSign,
  ArrowLeft,
  MessageSquare,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { FavoriteButton } from '@/components/favorite-button';
import { ShareButton } from '@/components/share-button';
import { ListNFTDialog, BuyNFTButton } from '@/components/marketplace-actions';
import { CommentsSection } from '@/components/comments-section';
import { ReviewsSection } from '@/components/reviews-section';
import Link from 'next/link';

export default function NftPage() {
  const params = useParams<{ hash: string }>();
  const router = useRouter();
  const hash = params.hash;

  const { getNftByHash, incrementViews, isLoaded } = useNftStore();
  const { walletAddress, isConnected } = useWallet();
  const [nft, setNft] = useState<Nft | null | undefined>(undefined);
  const { toast } = useToast();
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (isLoaded && hash) {
      const foundNft = getNftByHash(hash);
      setNft(foundNft);
      
      if (foundNft) {
        // Increment views
        incrementViews(hash);
      }
    }
  }, [hash, isLoaded, getNftByHash, incrementViews]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[600px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-md mx-auto border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">NFT Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The NFT you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentOwner = nft.owners[nft.owners.length - 1];
  const isOwner = walletAddress?.toLowerCase() === currentOwner.address.toLowerCase();
  const category = nft.category || 'story';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* NFT Image */}
            <Card className="overflow-hidden border-2 shadow-xl">
              <div className="relative aspect-video">
                <Image
                  src={nft.imageUrl}
                  alt={nft.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Floating Stats */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="backdrop-blur-md bg-black/60 text-white border-0">
                    <Eye className="w-3 h-3 mr-1" />
                    {nft.views || 0} views
                  </Badge>
                  {nft.isListed && (
                    <Badge className="backdrop-blur-md bg-green-600/90 text-white border-0">
                      On Sale
                    </Badge>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <FavoriteButton nftHash={hash} />
                  <ShareButton 
                    url={`${typeof window !== 'undefined' ? window.location.href : ''}`}
                    title={nft.title}
                    description={nft.description}
                  />
                </div>
              </div>
            </Card>

            {/* Title and Description */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="text-sm">
                        <Tag className="w-3 h-3 mr-1" />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                      {nft.status === 'minted' && (
                        <Badge className="gap-1">
                          <Shield className="w-3 h-3" />
                          Minted
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-4xl font-headline mb-3">
                      {nft.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {nft.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="w-4 h-4 mr-2" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="comments">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Full Content</CardTitle>
                      <Button
                        variant={isReading ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsReading(!isReading)}
                      >
                        {isReading ? 'Exit Reading Mode' : 'Reading Mode'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`
                        prose prose-lg dark:prose-invert max-w-none
                        ${isReading ? 'font-serif text-lg leading-relaxed' : 'font-mono text-sm'}
                      `}
                    >
                      <p className="whitespace-pre-wrap">{nft.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsSection nftHash={hash} />
              </TabsContent>

              <TabsContent value="comments">
                <CommentsSection nftHash={hash} />
              </TabsContent>
            </Tabs>

            {/* Owner History */}
            {nft.owners.length > 1 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Ownership History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...nft.owners].reverse().map((owner, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          #{nft.owners.length - index}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {owner.address.slice(0, 6)}...{owner.address.slice(-4)}
                            </code>
                            {index === 0 && (
                              <Badge variant="secondary">Current Owner</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(owner.timestamp), 'PPp')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Actions Card */}
            <Card className="border-2 sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                {nft.price !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-headline">
                        {nft.price}
                      </span>
                      <span className="text-xl text-muted-foreground">ETH</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ ${(nft.price * 2000).toFixed(2)} USD
                    </p>
                  </div>
                )}

                <Separator />

                {/* Owner Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Owner</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div>
                      <p className="font-semibold">
                        {isOwner ? 'You' : 'Anonymous'}
                      </p>
                      <code className="text-xs text-muted-foreground">
                        {currentOwner.address.slice(0, 6)}...{currentOwner.address.slice(-4)}
                      </code>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Marketplace Actions */}
                {isConnected ? (
                  <div className="space-y-3">
                    {isOwner && (
                      <ListNFTDialog
                        nftHash={hash}
                        tokenId={nft.tokenId || ''}
                        currentPrice={nft.price}
                        isListed={nft.isListed}
                      />
                    )}
                    {!isOwner && nft.isListed && nft.price && (
                      <BuyNFTButton
                        nftHash={hash}
                        tokenId={nft.tokenId || ''}
                        price={nft.price}
                        sellerAddress={currentOwner.address}
                      />
                    )}
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={() => router.push('/signin')}>
                    Sign In to Purchase
                  </Button>
                )}

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <Eye className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-2xl font-bold">{nft.views || 0}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600" />
                    <p className="text-2xl font-bold">{nft.favorites || 0}</p>
                    <p className="text-xs text-muted-foreground">Favorites</p>
                  </div>
                </div>

                {/* Tags */}
                {nft.tags && nft.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {nft.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Royalty */}
                {nft.royaltyPercentage !== undefined && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Creator Royalty</span>
                      <Badge variant="outline" className="gap-1">
                        <DollarSign className="w-3 h-3" />
                        {nft.royaltyPercentage}%
                      </Badge>
                    </div>
                  </>
                )}

                {/* Created At */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {nft.createdAt && format(new Date(nft.createdAt), 'PP')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* More from Creator */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  About Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
