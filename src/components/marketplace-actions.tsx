'use client';

import { useState } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/wallet-context';
import { useToast } from '@/hooks/use-toast';
import { web3Service } from '@/lib/web3';
import { updateNft, saveTransaction } from '@/lib/db-service';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

interface ListNFTDialogProps {
  nftHash: string;
  tokenId: string;
  currentPrice?: number;
  isListed?: boolean;
  onSuccess?: () => void;
}

export function ListNFTDialog({
  nftHash,
  tokenId,
  currentPrice,
  isListed = false,
  onSuccess,
}: ListNFTDialogProps) {
  const { user } = useAuth();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [price, setPrice] = useState(currentPrice?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleListNFT = async () => {
    if (!user || !isConnected) {
      toast({
        title: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
        variant: 'destructive',
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Initialize contracts
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

      if (!contractAddress || !marketplaceAddress) {
        throw new Error('Contract addresses not configured');
      }

      web3Service.initializeMarketplaceContract(marketplaceAddress);

      // List NFT on marketplace
      const txHash = await web3Service.listNFT(contractAddress, tokenId, price);

      // Update database
      await Promise.all([
        updateNft(nftHash, {
          isListed: true,
          price: priceValue,
          status: 'listed',
        }),
        saveTransaction({
          nftHash,
          from: user.uid,
          to: marketplaceAddress,
          price: priceValue,
          transactionHash: txHash,
          type: 'sale',
          timestamp: Date.now(),
          status: 'completed',
        }),
      ]);

      toast({
        title: SUCCESS_MESSAGES.NFT_LISTED,
        description: `Listed for ${price} ETH`,
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error listing NFT:', error);
      toast({
        title: 'Listing Failed',
        description: error.message || ERROR_MESSAGES.NETWORK_ERROR,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isListed ? 'outline' : 'default'} className="gap-2">
          <Tag className="h-4 w-4" />
          {isListed ? 'Update Listing' : 'List for Sale'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isListed ? 'Update Listing Price' : 'List NFT for Sale'}
          </DialogTitle>
          <DialogDescription>
            Set your desired price in ETH. A marketplace fee may apply.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Listing Price:</span>
              <span className="font-medium">{price || '0'} ETH</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Marketplace Fee (2.5%):</span>
              <span>{(parseFloat(price || '0') * 0.025).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>You'll Receive:</span>
              <span>{(parseFloat(price || '0') * 0.975).toFixed(4)} ETH</span>
            </div>
          </div>
          <Button
            onClick={handleListNFT}
            disabled={isLoading || !price || parseFloat(price) <= 0}
            className="w-full"
          >
            {isLoading ? 'Listing...' : isListed ? 'Update Listing' : 'List NFT'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BuyNFTButtonProps {
  nftHash: string;
  tokenId: string;
  price: number;
  sellerAddress: string;
  onSuccess?: () => void;
}

export function BuyNFTButton({
  nftHash,
  tokenId,
  price,
  sellerAddress,
  onSuccess,
}: BuyNFTButtonProps) {
  const { user } = useAuth();
  const { isConnected, walletAddress } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNFT = async () => {
    if (!user || !isConnected || !walletAddress) {
      toast({
        title: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Initialize contracts
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

      if (!contractAddress || !marketplaceAddress) {
        throw new Error('Contract addresses not configured');
      }

      web3Service.initializeMarketplaceContract(marketplaceAddress);

      // Buy NFT
      const txHash = await web3Service.buyNFT(
        contractAddress,
        tokenId,
        price.toString()
      );

      // Update database
      await Promise.all([
        updateNft(nftHash, {
          isListed: false,
          status: 'sold',
          owners: [
            { address: walletAddress, timestamp: Date.now(), price },
          ] as any,
        }),
        saveTransaction({
          nftHash,
          from: sellerAddress,
          to: walletAddress,
          price,
          transactionHash: txHash,
          type: 'sale',
          timestamp: Date.now(),
          status: 'completed',
        }),
      ]);

      toast({
        title: SUCCESS_MESSAGES.NFT_PURCHASED,
        description: `Purchased for ${price} ETH`,
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error buying NFT:', error);
      
      let errorMessage: string = ERROR_MESSAGES.NETWORK_ERROR;
      if (error.message?.includes('insufficient funds')) {
        errorMessage = ERROR_MESSAGES.INSUFFICIENT_FUNDS;
      } else if (error.message?.includes('rejected')) {
        errorMessage = ERROR_MESSAGES.TRANSACTION_REJECTED;
      }

      toast({
        title: 'Purchase Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuyNFT}
      disabled={isLoading}
      size="lg"
      className="gap-2"
    >
      <ShoppingCart className="h-4 w-4" />
      {isLoading ? 'Processing...' : `Buy for ${price} ETH`}
    </Button>
  );
}
