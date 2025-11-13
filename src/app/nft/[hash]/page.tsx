'use client';

import { useNftStore } from '@/hooks/use-nft-store';
import { useWallet } from '@/contexts/wallet-context';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Nft } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight, CheckCircle2, Copy, Download, ExternalLink, Heart, Eye, DollarSign, Tag, Clock, User, Palette, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ethers } from 'ethers'; // 1. IMPORT ethers library
import { addToFavorites, removeFromFavorites, getUserProfile } from '@/lib/db-service';
import Link from 'next/link';
import { ShareButton } from '@/components/share-button';

// Safe date formatting helper
const formatSafeDate = (timestamp: number | string | Date, formatStr: string = "PPp"): string => {
  try {
    if (!timestamp || timestamp === 0) return 'Unknown';
    
    // Handle different types of timestamps
    let date: Date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      // Handle both milliseconds and seconds timestamps
      date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) return 'Unknown';
    return format(date, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Unknown';
  }
};

export default function NftPage() {
  const params = useParams<{ hash: string }>();
  const hash = params.hash;

  const { getNftByHash, transferNft, incrementViews, isLoaded } = useNftStore();
  const { walletAddress, isConnected } = useWallet();
  const { user } = useAuth();
  const [nft, setNft] = useState<Nft | null | undefined>(undefined);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const { toast } = useToast();
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  // Set page title
  useEffect(() => {
    if (nft?.title) {
      document.title = `${nft.title} - EpicMint`;
    } else {
      document.title = 'NFT Details - EpicMint';
    }
  }, [nft?.title]);
  const [receipt, setReceipt] = useState<{
    prevOwner: string;
    newOwner: string;
    hash: string;
    title: string;
    date: string;
  } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Download NFT image
  const handleDownload = async () => {
    if (!nft || isDownloading) return;
    
    setIsDownloading(true);
    try {
      // Show loading toast
      toast({
        title: 'Downloading...',
        description: 'Preparing your NFT image',
      });

      // Method 1: Try direct fetch approach
      try {
        const response = await fetch(nft.imageUrl);
        if (!response.ok) throw new Error('Fetch failed');
        
        const blob = await response.blob();
        
        // Determine file extension from content type or URL
        let extension = 'jpg'; // default
        const contentType = response.headers.get('content-type');
        
        if (contentType) {
          if (contentType.includes('png')) extension = 'png';
          else if (contentType.includes('gif')) extension = 'gif';
          else if (contentType.includes('webp')) extension = 'webp';
          else if (contentType.includes('svg')) extension = 'svg';
          else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpg';
        } else {
          // Try to get extension from URL
          const urlExtension = nft.imageUrl.split('.').pop()?.toLowerCase();
          if (urlExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(urlExtension)) {
            extension = urlExtension;
          }
        }
        
        // Create download with proper MIME type
        const imageBlob = new Blob([blob], { type: contentType || `image/${extension}` });
        const url = window.URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        
        const sanitizedTitle = nft.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
        link.download = `${sanitizedTitle}_nft.${extension}`;
        
        // Force download
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        
        toast({
          title: 'Download Complete',
          description: `${nft.title} downloaded as ${extension.toUpperCase()} file`,
        });
        
      } catch (fetchError) {
        // Method 2: Canvas approach for CORS issues
        console.log('Fetch method failed, trying canvas method...');
        
        const img = document.createElement('img') as HTMLImageElement;
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              canvas.width = img.width;
              canvas.height = img.height;
              
              ctx?.drawImage(img, 0, 0);
              
              // Convert to blob
              canvas.toBlob((blob) => {
                if (blob) {
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  
                  const sanitizedTitle = nft.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
                  link.download = `${sanitizedTitle}_nft.png`;
                  
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  window.URL.revokeObjectURL(url);
                  resolve(true);
                } else {
                  reject(new Error('Canvas to blob conversion failed'));
                }
              }, 'image/png');
              
            } catch (canvasError) {
              reject(canvasError);
            }
          };
          
          img.onerror = () => reject(new Error('Image load failed'));
          img.src = nft.imageUrl;
        });
        
        toast({
          title: 'Download Complete',
          description: `${nft.title} downloaded as PNG file`,
        });
      }
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Method 3: Simple link approach as final fallback
      try {
        const link = document.createElement('a');
        link.href = nft.imageUrl;
        link.target = '_blank';
        link.download = `${nft.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}_nft`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'Opening Image',
          description: 'Image opened in new tab. Right-click to save.',
        });
      } catch (linkError) {
        toast({
          title: 'Download Failed',
          description: 'Could not download the image. Please right-click the image and save manually.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };  // View on IPFS
  const handleViewOnIPFS = () => {
    if (!nft) return;
    
    let ipfsHash = nft.ipfsHash;
    
    // If no direct IPFS hash, try to extract from imageUrl
    if (!ipfsHash) {
      const ipfsMatch = nft.imageUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
      if (ipfsMatch) {
        ipfsHash = ipfsMatch[1];
      }
    }
    
    if (ipfsHash) {
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      window.open(ipfsUrl, '_blank');
      toast({
        title: 'Opening IPFS',
        description: 'NFT is being opened on IPFS gateway',
      });
    } else {
      // Try different IPFS gateways as fallback
      const alternativeGateways = [
        'https://gateway.pinata.cloud/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://dweb.link/ipfs/'
      ];
      
      // Try to open original image URL in new tab as fallback
      window.open(nft.imageUrl, '_blank');
      toast({
        title: 'Opening Original Image',
        description: 'IPFS hash not available, opening original image URL',
      });
    }
  };

  // All useEffect hooks MUST be called before any conditional returns
  useEffect(() => {
    if (isLoaded && hash) {
      const foundNft = getNftByHash(hash);
      setNft(foundNft);
      
      // Increment view count only once per session per NFT
      if (foundNft) {
        const viewedKey = `nft_viewed_${hash}`;
        const hasViewed = sessionStorage.getItem(viewedKey);
        
        if (!hasViewed) {
          incrementViews(hash);
          sessionStorage.setItem(viewedKey, 'true');
        }
      }
    }
  }, [hash, isLoaded, getNftByHash, incrementViews]);

  useEffect(() => {
    if (nft) {
      const reversedOwners = [...nft.owners].reverse();
      const dates = reversedOwners.slice(1).map((owner, index) => {
        const previousOwnerTimestamp = reversedOwners[index].timestamp;
        return formatSafeDate(previousOwnerTimestamp);
      });
      setFormattedDates(dates);
    }
  }, [nft]);

  // Debug: Log ownership status (moved here, before returns)
  useEffect(() => {
    if (nft) {
      const currentOwner = nft.owners[nft.owners.length - 1];
      const isOwner = !!(isConnected && walletAddress && walletAddress.toLowerCase() === currentOwner.address.toLowerCase());
      
      console.log('🔍 Ownership Check:', {
        isConnected,
        walletAddress,
        currentOwner: currentOwner.address,
        isOwner,
        match: walletAddress?.toLowerCase() === currentOwner.address.toLowerCase()
      });
    }
  }, [isConnected, walletAddress, nft]);

  // Check if NFT is in user's favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.uid && hash) {
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile && userProfile.favorites) {
            setIsFavorite(userProfile.favorites.includes(hash));
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [user, hash]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      return;
    }

    if (!hash) return;

    setIsLoadingFavorite(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(user.uid, hash);
        setIsFavorite(false);
        // Update local NFT state
        if (nft) {
          const updatedNft: Nft = { ...nft, favorites: (nft.favorites || 0) - 1 };
          setNft(updatedNft);
        }
        toast({
          title: 'Removed from favorites',
          description: 'NFT removed from your favorites',
        });
      } else {
        await addToFavorites(user.uid, hash);
        setIsFavorite(true);
        // Update local NFT state
        if (nft) {
          const updatedNft: Nft = { ...nft, favorites: (nft.favorites || 0) + 1 };
          setNft(updatedNft);
        }
        toast({
          title: 'Added to favorites',
          description: 'NFT added to your favorites',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleTransfer = async () => {
    if (!newOwnerAddress.trim() || !nft) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address.',
        variant: 'destructive',
      });
      return;
    }

    // 2. ADD address validation check
    if (!ethers.isAddress(newOwnerAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a correct wallet address (e.g., 0x...).',
        variant: 'destructive',
      });
      return; // Stop the function if the address is not valid
    }

    const previousOwner = nft.owners[nft.owners.length - 1].address;
    const success = await transferNft(hash, newOwnerAddress);

    if (success) {
      const updatedNft = getNftByHash(hash);
      setNft(updatedNft);
      setNewOwnerAddress('');
      setReceipt({
        prevOwner: previousOwner,
        newOwner: newOwnerAddress,
        hash: nft.hash,
        title: nft.title,
        date: new Date().toLocaleString(),
      });
      toast({
        title: 'Transfer Successful!',
        description: 'Ownership has been transferred locally.',
      });
    } else {
      toast({
        title: 'Transfer Failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (nft === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-8 w-3/4 mt-4" />
        <Skeleton className="h-24 w-full mt-4" />
      </div>
    );
  }

  if (nft === null) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>NFT Not Found</AlertTitle>
          <AlertDescription>
            The NFT with hash "{hash}" could not be found. Please check the hash and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentOwner = nft.owners[nft.owners.length - 1];
  // Check if user is LOGGED IN + wallet connected + address matches current owner
  const isOwner = !!(user && isConnected && walletAddress && walletAddress.toLowerCase() === currentOwner.address.toLowerCase());
  const ownershipHistory = [...nft.owners].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        {receipt && (
        <Dialog open={!!receipt} onOpenChange={() => setReceipt(null)}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
            {/* Success Header with Animation */}
            <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 p-4 text-center border-b shrink-0">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
                  <div className="absolute inset-0 h-12 w-12 bg-green-500/20 rounded-full animate-ping" />
                </div>
              </div>
              <DialogTitle className="text-xl font-headline text-green-500 mb-1">
                Transfer Successful! 🎉
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Your NFT has been transferred successfully
              </p>
            </div>

            {/* Receipt Content - Scrollable */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* NFT Info Section */}
              <div className="bg-secondary/50 rounded-lg p-3 space-y-2 border">
                <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <span className="h-1 w-1 bg-primary rounded-full" />
                  NFT Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-muted-foreground shrink-0">Title:</span>
                    <span className="font-semibold text-sm text-right break-words">{receipt.title}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-muted-foreground shrink-0">Hash:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs truncate max-w-[140px]" title={receipt.hash}>{receipt.hash}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(receipt.hash);
                          toast({ title: 'Hash copied!', description: 'NFT hash copied to clipboard' });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Info Section */}
              <div className="bg-secondary/50 rounded-lg p-3 space-y-2 border">
                <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <span className="h-1 w-1 bg-primary rounded-full" />
                  Transfer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">From (Previous Owner)</span>
                    <div className="flex items-center gap-1 bg-background/50 rounded p-2">
                      <span className="font-mono text-[10px] break-all flex-1">{receipt.prevOwner}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(receipt.prevOwner);
                          toast({ title: 'Address copied!', description: 'Previous owner address copied' });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">To (New Owner)</span>
                    <div className="flex items-center gap-1 bg-background/50 rounded p-2">
                      <span className="font-mono text-[10px] break-all text-green-500 flex-1">{receipt.newOwner}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(receipt.newOwner);
                          toast({ title: 'Address copied!', description: 'New owner address copied' });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp Section */}
              <div className="bg-secondary/50 rounded-lg p-3 border">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Transfer Date:</span>
                  <span className="font-mono text-xs font-semibold text-right">{receipt.date}</span>
                </div>
              </div>

              {/* Transaction ID (Optional) */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex items-start gap-2">
                  <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-xs mb-1">Transaction Receipt</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      This transfer has been recorded locally. For blockchain verification, deploy your NFT to a blockchain network.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <DialogFooter className="bg-secondary/30 p-3 gap-2 shrink-0 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const receiptText = `
NFT Transfer Receipt
═══════════════════════════════════
NFT Title: ${receipt.title}
NFT Hash: ${receipt.hash}
From: ${receipt.prevOwner}
To: ${receipt.newOwner}
Date/Time: ${receipt.date}
═══════════════════════════════════
Transfer completed successfully!
                  `.trim();
                  navigator.clipboard.writeText(receiptText);
                  toast({ 
                    title: 'Receipt copied!', 
                    description: 'Transfer receipt copied to clipboard' 
                  });
                }}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Receipt
              </Button>
              <Button size="sm" onClick={() => setReceipt(null)} className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

        {/* Main NFT Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* NFT Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
              <div className="relative aspect-square w-full bg-gradient-to-br from-primary/10 to-secondary/20">
                <Image
                  src={nft.imageUrl}
                  alt={nft.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full p-2">
                  <Button
                    variant={isFavorite ? "default" : "ghost"}
                    size="icon"
                    onClick={handleToggleFavorite}
                    disabled={isLoadingFavorite}
                    className={`h-10 w-10 ${isFavorite ? 'bg-pink-500 hover:bg-pink-600' : 'hover:bg-background'}`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      className={`h-5 w-5 ${isFavorite ? 'fill-white text-white' : 'text-muted-foreground'}`}
                    />
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2 hover:bg-primary/10" 
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2 hover:bg-primary/10" 
                onClick={handleViewOnIPFS}
              >
                <ExternalLink className="h-4 w-4" />
                View on IPFS
              </Button>
              
              {/* <ShareButton 
                title={nft.title}
                description={nft.description}
                url={typeof window !== 'undefined' ? window.location.href : `https://epicmint.com/nft/${hash}`}
              /> */}
              
            </div>
          </div>

          {/* NFT Details Section */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Palette className="h-3 w-3" />
                    {nft.category}
                  </Badge>
                  {nft.isListed && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      On Sale
                    </Badge>
                  )}
                </div>
                <ShareButton 
                  title={nft.title}
                  description={nft.description}
                  url={typeof window !== 'undefined' ? window.location.href : `https://epicmint.com/nft/${hash}`}
                />
              </div>
              <h1 className="font-headline text-4xl lg:text-5xl mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {nft.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {nft.description}
              </p>
            </div>

            {/* Price and Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Price</span>
                </div>
                <p className="text-2xl font-bold text-primary">{nft.price} ETH</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Views</span>
                </div>
                <p className="text-2xl font-bold">{nft.views || 0}</p>
              </Card>
            </div>

            {/* Tags Section */}
            {nft.tags && nft.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nft.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-1 text-sm hover:bg-primary/10 cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <Card className="p-4 bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-semibold">Current Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {currentOwner.address.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm break-all">{currentOwner.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Owned since {formatSafeDate(currentOwner.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(currentOwner.address);
                    toast({ title: 'Address copied!', description: 'Owner address copied to clipboard' });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-4 w-4 text-pink-500" />
                </div>
                <p className="text-2xl font-bold">{nft.favorites || 0}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{nft.owners.length}</p>
                <p className="text-xs text-muted-foreground">Owners</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{nft.tags?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <Card className="mb-8 border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-wrap font-body leading-relaxed">
              {nft.content}
            </div>
          </CardContent>
        </Card>

        {/* NFT Metadata */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-xl">NFT Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">NFT Hash</span>
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                    <span className="font-mono text-sm break-all flex-1">{nft.hash}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(nft.hash);
                        toast({ title: 'Hash copied!', description: 'NFT hash copied to clipboard' });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">Created</span>
                  <p className="text-sm bg-secondary/50 rounded-lg p-3">
                    {formatSafeDate(nft.createdAt, "PPpp")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">Last Updated</span>
                  <p className="text-sm bg-secondary/50 rounded-lg p-3">
                    {formatSafeDate(nft.updatedAt || nft.createdAt, "PPpp")}
                  </p>
                </div>
                
                {nft.royaltyPercentage && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground block mb-1">Royalty</span>
                    <p className="text-sm bg-secondary/50 rounded-lg p-3">
                      {nft.royaltyPercentage}% to creator
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Ownership History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Ownership History
            </CardTitle>
            <CardDescription>
              Complete transaction history of this NFT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ownershipHistory.map((owner, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm break-all mb-1">{owner.address}</div>
                    {index === 0 ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Current Owner
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Transferred on {formattedDates[index - 1]}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(owner.address);
                      toast({ title: 'Address copied!', description: 'Wallet address copied to clipboard' });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transfer Section - Only visible to connected owner */}
        {isOwner && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/10">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Transfer Ownership
              </CardTitle>
              <CardDescription>
                Transfer this NFT to another wallet address. This action is irreversible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Recipient's wallet address (e.g., 0x...)"
                  value={newOwnerAddress}
                  onChange={(e) => setNewOwnerAddress(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={handleTransfer} className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Alerts */}
        {!isConnected && (
          <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Connect Wallet to Transfer</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Connect your wallet to transfer this NFT if you're the owner.
            </AlertDescription>
          </Alert>
        )}

        {isConnected && !isOwner && walletAddress && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>You're Not the Owner</AlertTitle>
            <AlertDescription>
              Only the current owner ({currentOwner.address}) can transfer this NFT.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
