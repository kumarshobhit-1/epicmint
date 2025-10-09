'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NftCard from '@/components/nft-card';
import { FileText, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Nft } from '@/lib/types';

type NftShowcaseProps = {
  createdNfts: Nft[];
  ownedNfts: Nft[];
  favoriteNfts: Nft[];
};

export function NftShowcase({ createdNfts, ownedNfts, favoriteNfts }: NftShowcaseProps) {
  const router = useRouter();

  return (
    <Tabs defaultValue="created" className="space-y-6">
      <TabsList className="grid w-full max-w-2xl grid-cols-3">
        <TabsTrigger value="created">
          <FileText className="w-4 h-4 mr-2" />
          Created ({createdNfts.length})
        </TabsTrigger>
        <TabsTrigger value="owned">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Owned ({ownedNfts.length})
        </TabsTrigger>
        <TabsTrigger value="favorites">
          <Heart className="w-4 h-4 mr-2" />
          Favorites ({favoriteNfts.length})
        </TabsTrigger>
      </TabsList>

      {/* Created NFTs Tab */}
      <TabsContent value="created" className="space-y-4">
        {createdNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {createdNfts.map((nft) => (
              <NftCard key={nft.hash} nft={nft} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No NFTs Created Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Start creating your first masterpiece and share it with the world!
              </p>
              <Button onClick={() => router.push('/create')}>
                Create Your First NFT
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Owned NFTs Tab */}
      <TabsContent value="owned" className="space-y-4">
        {ownedNfts.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                NFTs you've purchased or received
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ownedNfts.map((nft) => (
                <NftCard key={nft.hash} nft={nft} />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No NFTs Owned Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Explore the marketplace and purchase your first NFT!
              </p>
              <Button onClick={() => router.push('/')}>
                Browse Marketplace
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Favorites Tab */}
      <TabsContent value="favorites" className="space-y-4">
        {favoriteNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteNfts.map((nft) => (
              <NftCard key={nft.hash} nft={nft} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Explore the marketplace and add NFTs to your favorites!
              </p>
              <Button onClick={() => router.push('/')}>
                Browse NFTs
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
