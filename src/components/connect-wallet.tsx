'use client';

import { useWallet } from '@/contexts/wallet-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Wallet, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConnectWallet() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } =
    useWallet();
  const { user } = useAuth();
  const { toast } = useToast();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login first to connect your wallet.',
        variant: 'destructive',
      });
      return;
    }

    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to connect your wallet.',
        variant: 'destructive',
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://metamask.io/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Install
          </Button>
        ),
      });
      return;
    }

    try {
      await connectWallet();
      if (isConnected) {
        toast({
          title: 'Wallet Connected',
          description: 'Your wallet has been connected successfully!',
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Don't show wallet button if user is not logged in
  if (!user) {
    return null;
  }

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected successfully.',
    });
  };

  if (isConnected && walletAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <Wallet className="mr-2 h-4 w-4 ml-2" />
            {truncateAddress(walletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold">
            Connected Wallet
          </div>
          <DropdownMenuItem 
            onClick={() => {
              navigator.clipboard.writeText(walletAddress);
              toast({ 
                title: 'Address Copied!', 
                description: 'Wallet address copied to clipboard' 
              });
            }}
          >
            <svg 
              className="mr-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDisconnect}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <svg 
              className="mr-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleConnectWallet}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
