'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Nft, UserProfile } from '@/lib/types';
import { useNftStore } from '@/hooks/use-nft-store';
import { useAuth } from '@/contexts/auth-context';
import { searchUsers, searchNftsSimple } from '@/lib/db-service';
import { searchPerformanceMonitor, SearchCache } from '@/lib/performance-utils';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchFormProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
}

export function SearchForm({ onSearch, onFilterClick, placeholder = "Search NFTs or Users..." }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nftSuggestions, setNftSuggestions] = useState<Nft[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCache, setSearchCache] = useState<Map<string, { nfts: Nft[], users: UserProfile[], timestamp: number }>>(new Map());
  const [isClickingOnSuggestion, setIsClickingOnSuggestion] = useState(false);
  const { nfts } = useNftStore();
  const { user, isLoading } = useAuth(); // Get current logged-in user and loading state

  // Cache expiry time (5 minutes)
  const CACHE_EXPIRY = 5 * 60 * 1000;

  // Debounced search suggestions with caching and performance monitoring
  const searchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setNftSuggestions([]);
      setUserSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const startTime = searchPerformanceMonitor.startSearch(query);
    const lowerQuery = query.toLowerCase();
    const cacheKey = lowerQuery;

    // Check cache first
    const cached = searchCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
      setNftSuggestions(cached.nfts);
      setUserSuggestions(cached.users);
      setIsSearching(false);
      
      searchPerformanceMonitor.endSearch(
        query,
        startTime,
        cached.nfts.length + cached.users.length,
        true, // cache hit
        'local'
      );
      return;
    }

    try {
      // Search NFTs - Priority: local first, then Firebase
      let nftResults: Nft[] = [];
      let searchSource: 'local' | 'firebase' | 'mixed' = 'local';
      const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';
      
      // Always try local search first (faster)
      const localNftResults = nfts
        .filter(nft => 
          nft.title.toLowerCase().includes(lowerQuery) ||
          nft.description.toLowerCase().includes(lowerQuery) ||
          nft.category.toLowerCase().includes(lowerQuery) ||
          (nft.tags && nft.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        )
        .slice(0, 5);

      if (localNftResults.length >= 3 || !USE_FIREBASE) {
        // Use local results if we have enough or Firebase is disabled
        nftResults = localNftResults;
        searchSource = 'local';
      } else {
        // Supplement with Firebase search if local results are insufficient
        try {
          const firebaseResults = await searchNftsSimple(query, 5);
          // Merge and deduplicate results
          const allResults = [...localNftResults];
          
          firebaseResults.forEach(firebaseNft => {
            if (!allResults.some(localNft => localNft.hash === firebaseNft.hash)) {
              allResults.push(firebaseNft);
            }
          });
          
          nftResults = allResults.slice(0, 5);
          searchSource = localNftResults.length > 0 ? 'mixed' : 'firebase';
        } catch (error) {
          console.log('Firebase search failed, using local results');
          nftResults = localNftResults;
          searchSource = 'local';
        }
      }
      
      // Search Users (exclude current logged-in user)
      let userResults: UserProfile[] = [];
      try {
        userResults = await searchUsers(query);
      } catch (error) {
        console.log('User search failed');
        userResults = [];
      }
      
      // Only filter if user is loaded (not during initial auth loading)
      const filteredUsers = !isLoading && user 
        ? userResults.filter(u => {
            const currentUID = (user.uid || '').trim();
            const firestoreUID = (u.uid || '').trim();
            return firestoreUID !== currentUID;
          })
        : userResults; // Show all users if auth still loading

      const finalNfts = nftResults;
      const finalUsers = filteredUsers.slice(0, 5);

      // Cache results
      setSearchCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, {
          nfts: finalNfts,
          users: finalUsers,
          timestamp: Date.now()
        });
        
        // Clean old cache entries (keep only last 20)
        if (newCache.size > 20) {
          const oldestKey = Array.from(newCache.keys())[0];
          newCache.delete(oldestKey);
        }
        
        return newCache;
      });

      setNftSuggestions(finalNfts);
      setUserSuggestions(finalUsers);

      // Log performance
      searchPerformanceMonitor.endSearch(
        query,
        startTime,
        finalNfts.length + finalUsers.length,
        false, // cache miss
        searchSource
      );

    } catch (error) {
      console.log('Search error:', error);
      // Fallback to empty results
      setNftSuggestions([]);
      setUserSuggestions([]);
      
      searchPerformanceMonitor.endSearch(
        query,
        startTime,
        0,
        false,
        'local'
      );
    } finally {
      setIsSearching(false);
    }
  }, [nfts, user, isLoading, searchCache]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchSuggestions(searchQuery);
    }, 200); // Reduced debounce to 200ms for faster response

    return () => clearTimeout(timer);
  }, [searchQuery, searchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setNftSuggestions([]);
    setUserSuggestions([]);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSelectItem = () => {
    // Small delay to ensure navigation completes before clearing
    setTimeout(() => {
      setShowSuggestions(false);
      setSearchQuery('');
      setNftSuggestions([]);
      setUserSuggestions([]);
    }, 100);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder={placeholder}
            className="w-full bg-secondary/50 pl-10 pr-12 border-2 focus:border-primary transition-colors [&::-webkit-search-cancel-button]:hidden"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Only hide suggestions if not clicking on a suggestion
              if (!isClickingOnSuggestion) {
                setTimeout(() => setShowSuggestions(false), 200);
              }
            }}
            onKeyDown={(e) => {
              // Handle keyboard navigation
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                e.currentTarget.blur();
              }
              // Future: Add arrow key navigation
            }}
          />
          {isSearching && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {onFilterClick && (
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={onFilterClick}
            className="shrink-0 border-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (nftSuggestions.length > 0 || userSuggestions.length > 0) && (
        <Card 
          className="absolute top-full mt-2 w-full z-50 p-2 shadow-2xl border-2 max-h-[500px] overflow-y-auto"
          onMouseEnter={() => setIsClickingOnSuggestion(true)}
          onMouseLeave={() => setIsClickingOnSuggestion(false)}
          onMouseDown={(e) => {
            // Prevent input from losing focus when clicking on suggestions
            e.preventDefault();
          }}
        >
          {/* User Results */}
          {userSuggestions.length > 0 && (
            <div className="mb-3" key="users-section">
              <div className="text-xs text-muted-foreground px-2 py-1 font-semibold flex items-center gap-2">
                <User className="w-3 h-3" />
                Users ({userSuggestions.length})
              </div>
              <div className="space-y-1">
                {userSuggestions.map((searchUser) => (
                  <Link
                    key={`user-${searchUser.uid}`}
                    href={`/profile/${searchUser.uid}`}
                    onClick={(e) => {
                      // Don't prevent default - let the navigation happen
                      handleSelectItem();
                    }}
                    onMouseDown={(e) => {
                      // Prevent input blur when clicking
                      e.preventDefault();
                    }}
                    className="block p-2 hover:bg-secondary rounded-md transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2">
                        <AvatarImage src={searchUser.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                          {(searchUser.displayName || searchUser.email || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {searchUser.displayName || 'Unnamed User'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {searchUser.email}
                        </div>
                        {searchUser.walletAddress && (
                          <div className="text-xs text-muted-foreground truncate font-mono">
                            {searchUser.walletAddress.slice(0, 6)}...{searchUser.walletAddress.slice(-4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* NFT Results */}
          {nftSuggestions.length > 0 && (
            <div key="nfts-section">
              <div className="text-xs text-muted-foreground px-2 py-1 font-semibold">
                NFTs ({nftSuggestions.length})
              </div>
              <div className="space-y-1">
                {nftSuggestions.map((nft) => (
                  <Link
                    key={`nft-${nft.hash}`}
                    href={`/nft/${nft.hash}`}
                    onClick={(e) => {
                      // Don't prevent default - let the navigation happen
                      handleSelectItem();
                    }}
                    onMouseDown={(e) => {
                      // Prevent input blur when clicking
                      e.preventDefault();
                    }}
                    className="block p-2 hover:bg-secondary rounded-md transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md bg-secondary/50 shrink-0 overflow-hidden">
                        {nft.imageUrl && (
                          <img 
                            src={nft.imageUrl} 
                            alt={nft.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{nft.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{nft.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {nft.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {nft.views || 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {showSuggestions && searchQuery.length >= 2 && nftSuggestions.length === 0 && userSuggestions.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-4 shadow-2xl border-2">
          <div className="text-center text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        </Card>
      )}
    </div>
  );
}
