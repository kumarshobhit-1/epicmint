
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Nft } from '@/lib/types';
import placeholderData from '@/lib/placeholder-images.json';
import { saveNft, getNft, updateNft as updateNftInDb, incrementNftViews } from '@/lib/db-service';
import { collection, getDocs, query, orderBy, limit as fbLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleError, showSuccess, showLoading } from '@/lib/error-handler';

const NFT_STORAGE_KEY = 'epicmint_nfts';
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true'; // Toggle for Firebase

// This function is safe because it's only called within `addNft`, which is a client-side interaction.
const generateRandomHash = () => `0x${Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;

export function useNftStore() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load NFTs from localStorage or Firebase
    const loadNfts = async () => {
      try {
        if (USE_FIREBASE) {
          // Load from Firebase
          const nftsRef = collection(db, 'nfts');
          const q = query(nftsRef, orderBy('createdAt', 'desc'), fbLimit(100));
          const snapshot = await getDocs(q);
          const firebaseNfts = snapshot.docs.map(doc => doc.data() as Nft);
          setNfts(firebaseNfts);
        } else {
          // Load from localStorage
          const storedNfts = localStorage.getItem(NFT_STORAGE_KEY);
          if (storedNfts) {
            const parsedNfts = JSON.parse(storedNfts) as Nft[];
            
            // Migration: Fix NFTs without hash property or missing timestamps
            let needsMigration = false;
            const currentTime = Date.now();
            const migratedNfts = parsedNfts.map(nft => {
              let updatedNft = { ...nft };
              
              // Fix missing hash
              if (!nft.hash) {
                needsMigration = true;
                updatedNft.hash = generateRandomHash();
              }
              
              // Fix missing or invalid createdAt
              if (!nft.createdAt || nft.createdAt === 0 || typeof nft.createdAt !== 'number') {
                needsMigration = true;
                updatedNft.createdAt = currentTime;
              }
              
              // Fix missing or invalid updatedAt
              if (!nft.updatedAt || nft.updatedAt === 0 || typeof nft.updatedAt !== 'number') {
                needsMigration = true;
                updatedNft.updatedAt = nft.createdAt || currentTime;
              }
              
              return updatedNft;
            });
            
            // Save migrated data if needed
            if (needsMigration) {
              console.log('🔄 Migrating NFTs: Adding missing hash properties and timestamps');
              localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(migratedNfts));
              setNfts(migratedNfts);
            } else {
              setNfts(parsedNfts);
            }
          } else {
            // No stored data - empty state
            setNfts([]);
          }
        }
      } catch (error) {
        console.error('Failed to load NFTs:', error);
        setNfts([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadNfts();
  }, []);

  const updateStorage = async (updatedNfts: Nft[]) => {
    try {
      if (USE_FIREBASE) {
        // Firebase automatically updates via individual saveNft calls
        setNfts(updatedNfts);
      } else {
        // Update localStorage
        localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(updatedNfts));
        setNfts(updatedNfts);
      }
    } catch (error) {
      console.error('Failed to save NFTs:', error);
    }
  };

  const addNft = useCallback(async (newNftData: Omit<Nft, 'hash' | 'imageUrl' | 'imageHint' | 'owners' | 'createdAt' | 'updatedAt' | 'views' | 'favorites'> & { owner: string; imageUrl?: string }): Promise<Nft> => {
    const loadingToast = showLoading('NFT बनाई जा रही है... | Creating NFT...', 'कृपया प्रतीक्षा करें | Please wait');
    
    try {
      // Use provided imageUrl or generate random one
      const randomImage = placeholderData.placeholderImages[Math.floor(Math.random() * placeholderData.placeholderImages.length)];
      
      const timestamp = Date.now();
      const newNft: Nft = {
        title: newNftData.title,
        description: newNftData.description,
        content: newNftData.content,
        hash: generateRandomHash(),
        imageUrl: newNftData.imageUrl || randomImage.imageUrl,
        imageHint: randomImage.imageHint, // Always use random hint
        owners: [{ address: newNftData.owner, timestamp }],
        category: newNftData.category || 'story',
        tags: newNftData.tags || [],
        price: newNftData.price || 0,
        isListed: newNftData.isListed || false,
        royaltyPercentage: newNftData.royaltyPercentage || 10,
        views: 0,
        favorites: 0,
        status: newNftData.status || 'minted',
        createdAt: timestamp,
        updatedAt: timestamp,
        tokenId: newNftData.tokenId,
        ipfsHash: newNftData.ipfsHash,
      };
      
      if (USE_FIREBASE) {
        // Save to Firebase
        await saveNft(newNft);
        
        // Refresh the entire NFT list to ensure we have the latest data
        const nftsRef = collection(db, 'nfts');
        const q = query(nftsRef, orderBy('createdAt', 'desc'), fbLimit(100));
        const snapshot = await getDocs(q);
        const refreshedNfts = snapshot.docs.map(doc => doc.data() as Nft);
        setNfts(refreshedNfts);
      } else {
        // Save to localStorage
        const currentNfts = JSON.parse(localStorage.getItem(NFT_STORAGE_KEY) || '[]');
        const updatedNfts = [newNft, ...currentNfts];
        await updateStorage(updatedNfts);
      }
      
      // Dismiss loading toast
      if (loadingToast) {
        loadingToast.dismiss?.();
      }
      
      showSuccess(
        'NFT सफलतापूर्वक बनाई गई! | NFT created successfully!',
        `"${newNft.title}" अब आपके संग्रह में है | "${newNft.title}" is now in your collection`
      );
      
      return newNft;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToast) {
        loadingToast.dismiss?.();
      }
      
      handleError(error, 'Creating NFT');
      throw error;
    }
  }, []);

  const updateNft = useCallback(async (hash: string, updates: Partial<Nft>): Promise<boolean> => {
    try {
      if (USE_FIREBASE) {
        // Update in Firebase
        await updateNftInDb(hash, updates);
        const updatedNfts = nfts.map(nft => 
          nft.hash === hash ? { ...nft, ...updates, updatedAt: Date.now() } : nft
        );
        setNfts(updatedNfts);
      } else {
        // Update in localStorage
        const currentNfts = JSON.parse(localStorage.getItem(NFT_STORAGE_KEY) || '[]');
        const nftIndex = currentNfts.findIndex((nft: Nft) => nft.hash === hash);
        if (nftIndex === -1) return false;

        const updatedNft = {
          ...currentNfts[nftIndex],
          ...updates,
          updatedAt: Date.now(),
        };

        const updatedNfts = [...currentNfts];
        updatedNfts[nftIndex] = updatedNft;
        
        await updateStorage(updatedNfts);
      }
      return true;
    } catch (error) {
      console.error('Failed to update NFT:', error);
      return false;
    }
  }, [nfts]);

  const transferNft = useCallback(async (hash: string, newOwnerAddress: string): Promise<boolean> => {
    try {
      if (USE_FIREBASE) {
        const currentNft = nfts.find(nft => nft.hash === hash);
        if (!currentNft) return false;

        const updatedOwners = [...currentNft.owners, { address: newOwnerAddress, timestamp: Date.now() }];
        await updateNftInDb(hash, { owners: updatedOwners as any });
        
        const updatedNfts = nfts.map(nft => 
          nft.hash === hash ? { ...nft, owners: updatedOwners, updatedAt: Date.now() } : nft
        );
        setNfts(updatedNfts);
      } else {
        const currentNfts = JSON.parse(localStorage.getItem(NFT_STORAGE_KEY) || '[]');
        const nftIndex = currentNfts.findIndex((nft: Nft) => nft.hash === hash);
        if (nftIndex === -1) return false;

        const updatedNft = {
          ...currentNfts[nftIndex],
          owners: [...currentNfts[nftIndex].owners, { address: newOwnerAddress, timestamp: Date.now() }],
          updatedAt: Date.now(),
        };

        const updatedNfts = [...currentNfts];
        updatedNfts[nftIndex] = updatedNft;
        
        await updateStorage(updatedNfts);
      }
      return true;
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      return false;
    }
  }, [nfts]);
  
  const getNftByHash = useCallback((hash: string): Nft | undefined => {
    // This function can be called on server and client. 
    // It relies on the `nfts` state, which is safely initialized in useEffect.
    return nfts.find(nft => nft.hash === hash);
  }, [nfts]);

  const incrementViews = useCallback(async (hash: string): Promise<boolean> => {
    try {
      if (USE_FIREBASE) {
        // Use Firestore's atomic increment for better performance and consistency
        await incrementNftViews(hash);
        // Update local state
        const updatedNfts = nfts.map(nft => 
          nft.hash === hash ? { ...nft, views: (nft.views || 0) + 1 } : nft
        );
        setNfts(updatedNfts);
      } else {
        // Use manual update for localStorage
        return await updateNft(hash, { views: (getNftByHash(hash)?.views || 0) + 1 });
      }
      return true;
    } catch (error) {
      console.error('Failed to increment views:', error);
      return false;
    }
  }, [nfts, getNftByHash, updateNft]);

  const refreshNfts = useCallback(async () => {
    try {
      if (USE_FIREBASE) {
        const nftsRef = collection(db, 'nfts');
        const q = query(nftsRef, orderBy('createdAt', 'desc'), fbLimit(100));
        const snapshot = await getDocs(q);
        const allNfts = snapshot.docs.map(doc => doc.data() as Nft);
        setNfts(allNfts);
      } else {
        const storedNfts = localStorage.getItem(NFT_STORAGE_KEY);
        if (storedNfts && storedNfts !== 'undefined') {
          const parsedNfts = JSON.parse(storedNfts);
          setNfts(Array.isArray(parsedNfts) ? parsedNfts : []);
        } else {
          setNfts([]);
        }
      }
    } catch (error) {
      console.error('Failed to refresh NFTs:', error);
    }
  }, []);

  return { nfts, isLoaded, addNft, updateNft, transferNft, getNftByHash, incrementViews, refreshNfts };
}
