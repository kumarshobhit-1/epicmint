import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Nft } from '@/lib/types';
import { ShareButton } from './share-button';
import { Badge } from './ui/badge';
import { Eye } from 'lucide-react';

interface NftCardProps {
  nft: Nft;
}

export default function NftCard({ nft }: NftCardProps) {
  const nftUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/nft/${nft.hash}` 
    : `https://epicmint.com/nft/${nft.hash}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary group">
      <Link href={`/nft/${nft.hash}`}>
        <CardHeader className="p-0 relative">
          <div className="aspect-[3/2] relative">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={nft.imageHint}
            />
            {nft.isListed && (
              <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                On Sale
              </Badge>
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 space-y-3">
        <Link href={`/nft/${nft.hash}`}>
          <CardTitle className="font-headline text-lg line-clamp-2 hover:text-primary transition-colors">
            {nft.title}
          </CardTitle>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-bold text-primary text-lg">{nft.price} ETH</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {nft.views || 0}
            </span>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <ShareButton 
              title={nft.title}
              description={nft.description}
              url={nftUrl}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
