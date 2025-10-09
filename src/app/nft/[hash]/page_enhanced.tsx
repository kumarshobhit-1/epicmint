'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNftStore } from '@/hooks/use-nft-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Eye, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { FavoriteButton } from '@/components/favorite-button';
import { ShareButton } from '@/components/share-button';
import { ReviewsSection } from '@/components/reviews-section';
import { CommentsSection } from '@/components/comments-section';
import { ListNFTDialog, BuyNFTButton } from '@/components/marketplace-actions';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/wallet-context';
import Image from 'next/image';

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getNftByHash, incrementViews } = useNftStore();
  const { user } = useAuth();
  const { walletAddress } = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);

  const hash = params.hash as string;
  const nft = getNftByHash(hash);

  useEffect(() => {
    setIsLoaded(true);
    if (nft) {
      incrementViews(hash);
    }
  }, [hash, nft, incrementViews]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">NFT Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The NFT you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  const currentOwner = nft.owners[nft.owners.length - 1];
  const isOwner = walletAddress && currentOwner.address.toLowerCase() === walletAddress.toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const nftUrl = `${appUrl}/nft/${hash}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Image Section */}
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={nft.imageUrl}
                alt={nft.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h1 className="font-headline text-4xl font-bold mb-2">
                  {nft.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{nft.views || 0} views</span>
                  <span>•</span>
                  <span>{format(nft.createdAt, 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <FavoriteButton
                  nftHash={hash}
                  initialCount={nft.favorites || 0}
                />
                <ShareButton
                  title={nft.title}
                  description={nft.description}
                  url={nftUrl}
                />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge variant="secondary">{nft.category}</Badge>
              {nft.status && (
                <Badge variant="outline">{nft.status}</Badge>
              )}
              {nft.isListed && (
                <Badge variant="default">For Sale</Badge>
              )}
            </div>

            {nft.tags && nft.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {nft.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Price & Actions */}
          {nft.isListed && nft.price && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-3xl font-bold">{nft.price} ETH</p>
              </div>
              {isOwner ? (
                <ListNFTDialog
                  nftHash={hash}
                  tokenId={nft.tokenId || ''}
                  currentPrice={nft.price}
                  isListed={true}
                />
              ) : (
                <BuyNFTButton
                  nftHash={hash}
                  tokenId={nft.tokenId || ''}
                  price={nft.price}
                  sellerAddress={currentOwner.address}
                />
              )}
            </div>
          )}

          {!nft.isListed && isOwner && nft.tokenId && (
            <ListNFTDialog
              nftHash={hash}
              tokenId={nft.tokenId}
            />
          )}

          <Separator />

          {/* Owner Info */}
          <div>
            <p className="text-sm font-medium mb-2">Current Owner</p>
            <p className="text-sm font-mono text-muted-foreground break-all">
              {currentOwner.address}
            </p>
          </div>

          {/* Royalty Info */}
          {nft.royaltyPercentage !== undefined && (
            <div>
              <p className="text-sm font-medium mb-2">Creator Royalty</p>
              <p className="text-sm text-muted-foreground">
                {nft.royaltyPercentage}% on secondary sales
              </p>
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {nft.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-headline text-2xl font-bold mb-4">Content</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground">
              {nft.content}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ownership History */}
      {nft.owners.length > 1 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-headline text-2xl font-bold mb-4">
              Ownership History
            </h2>
            <div className="space-y-3">
              {nft.owners.slice().reverse().map((owner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-mono text-sm">{owner.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(owner.timestamp, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {owner.price && (
                    <Badge variant="secondary">{owner.price} ETH</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <div className="mb-8">
        <ReviewsSection nftHash={hash} />
      </div>

      {/* Comments Section */}
      <CommentsSection nftHash={hash} />
    </div>
  );
}
