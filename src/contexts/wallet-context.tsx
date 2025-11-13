// src/contexts/wallet-context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { useAuth } from './auth-context';
import { updateUserProfile } from '@/lib/db-service';

// Define the window.ethereum type to avoid TypeScript errors
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const { user } = useAuth(); // Get current user

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress(null);
    setSigner(null);
    setProvider(null);
    localStorage.removeItem('walletAddress');
    console.log("Wallet disconnected.");
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        // MetaMask not installed - handle gracefully
        console.log('MetaMask extension not detected');
        // Don't show alert, just return silently or show a toast
        return;
      }

      // Just use eth_requestAccounts - it will show popup if needed
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();

      setWalletAddress(address);
      setSigner(ethersSigner);
      setProvider(ethersProvider);
      setIsConnected(true);
      localStorage.setItem('walletAddress', address);
      console.log("Wallet connected:", address);

      // Save wallet address to Firebase profile
      if (user?.uid) {
        try {
          await updateUserProfile(user.uid, { walletAddress: address });
          console.log('[Wallet] Saved wallet address to Firebase profile');
        } catch (error) {
          console.log('[Wallet] Could not save wallet address to profile');
        }
      }

    } catch (error: any) {
      if (error.code === 4001) {
        console.log('User declined wallet connection');
      } else {
        console.log('Wallet connection failed');
      }
    }
  }, [user]);

  // Effect to handle listeners and auto-connect
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('User disconnected from MetaMask.');
        disconnectWallet();
      } else if (walletAddress !== accounts[0]) {
        // Automatically reconnect with the new account
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // As per MetaMask docs, reload the page on chain change
      window.location.reload();
    };

    // Auto-connect if wallet address is in localStorage
    if (localStorage.getItem('walletAddress')) {
      connectWallet();
    }

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    // Cleanup function to remove listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, disconnectWallet, walletAddress]); // Dependencies add ki gayi hain

  return (
    <WalletContext.Provider
      value={{ isConnected, walletAddress, signer, provider, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
