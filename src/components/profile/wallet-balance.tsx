'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Wallet, RefreshCw, TrendingUp, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

type WalletBalanceProps = {
  walletAddress: string | null;
};

type BalanceData = {
  eth: string;
  usd: string;
  lastUpdated: number;
};

export function WalletBalance({ walletAddress }: WalletBalanceProps) {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
      fetchEthPrice();
    }
  }, [walletAddress]);

  const fetchEthPrice = async () => {
    try {
      // Try multiple APIs as fallbacks
      const apis = [
        // CryptoCompare (No CORS issues, no API key needed)
        {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
          parse: (data: any) => data.USD
        },
        // Binance Public API
        {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
          parse: (data: any) => parseFloat(data.price)
        },
        // CoinGecko (as fallback)
        {
          url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
          parse: (data: any) => data.ethereum.usd
        }
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api.url);
          if (response.ok) {
            const data = await response.json();
            const price = api.parse(data);
            setEthPrice(price);
            console.log('[WalletBalance] ETH price fetched:', price);
            return; // Success, exit loop
          }
        } catch (err) {
          console.warn('[WalletBalance] API failed, trying next...', err);
          continue;
        }
      }
      
      // If all APIs fail, use a fallback price
      console.warn('[WalletBalance] All price APIs failed, using fallback');
      setEthPrice(2000); // Fallback price
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      setEthPrice(2000); // Fallback price
    }
  };

  const fetchBalance = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    try {
      // Connect to Ethereum mainnet (or testnet)
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://eth.llamarpc.com'
      );

      // Get balance
      const balanceBigInt = await provider.getBalance(walletAddress);
      const ethBalance = ethers.formatEther(balanceBigInt);

      // Fetch current ETH price if not already fetched
      let currentEthPrice = ethPrice;
      if (currentEthPrice === 0) {
        try {
          // Try CryptoCompare first (more reliable for CORS)
          const response = await fetch(
            'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
          );
          const data = await response.json();
          currentEthPrice = data.USD;
          setEthPrice(currentEthPrice);
        } catch (err) {
          console.warn('[WalletBalance] Price fetch failed, using fallback');
          currentEthPrice = 2000; // Fallback price
          setEthPrice(currentEthPrice);
        }
      }

      // Calculate USD value
      const usdValue = (parseFloat(ethBalance) * currentEthPrice).toFixed(2);

      setBalance({
        eth: parseFloat(ethBalance).toFixed(4),
        usd: usdValue,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Don't show error toast for price API failures, just log it
      // Only show for critical balance fetch failures
      if (!balance) {
        toast({
          title: 'Failed to fetch balance',
          description: 'Please check your wallet connection',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBalance();
    fetchEthPrice();
  };

  if (!walletAddress) {
    return (
      <Card className="border-2 border-dashed border-purple-500/50 bg-purple-500/5">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-lg mb-1">No Wallet Connected</h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view your balance
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !balance) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-500" />
            Wallet Balance
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ETH Balance */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Ethereum Balance</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold font-headline bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {balance?.eth || '0.0000'}
            </p>
            <span className="text-xl font-semibold text-muted-foreground">ETH</span>
          </div>
        </div>

        {/* USD Value */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-1">USD Value</p>
            <p className="text-2xl font-bold">
              ${balance?.usd || '0.00'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              ${ethPrice.toLocaleString()} / ETH
            </span>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
          <code className="text-xs bg-muted px-3 py-2 rounded-md block">
            {walletAddress}
          </code>
        </div>

        {/* Last Updated */}
        {balance && (
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(balance.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
