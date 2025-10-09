'use client';

import { useWallet } from '@/contexts/wallet-context';
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
  const { toast } = useToast();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = async () => {
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

  if (isConnected && walletAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Wallet className="mr-2 h-4 w-4" />
            {truncateAddress(walletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => {
              navigator.clipboard.writeText(walletAddress);
              toast({ title: 'Address copied!', description: 'Wallet address copied to clipboard' });
            }}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnectWallet}>
            Disconnect
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
