
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useNftStore } from '@/hooks/use-nft-store';
import NftCard from '@/components/nft-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsClient } from '@/hooks/use-is-client';
import { AdvancedFilters } from '@/components/advanced-filters';
import { PaginationControls } from '@/components/pagination-controls';
import { SearchForm } from '@/components/search-form';
import type { SearchFilters, Nft } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { Sparkles, TrendingUp, Zap, ArrowRight, Flame, BookOpen, Palette, FileText, Star, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CryptoPrices } from '@/components/crypto-prices';
import { AnimatedElement, ScrollAnimation, StaggerContainer, AnimatedCard } from '@/components/ui/animations';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveSection } from '@/components/ui/responsive';
import { ErrorBoundary, NFTErrorBoundary } from '@/components/ui/error-boundary';
import { PageLoading, NFTCardSkeleton } from '@/components/ui/loading-skeletons';
import { NoNFTsFound } from '@/components/ui/empty-states';
import styles from './page.module.css';

export default function Home() {
  const { nfts, isLoaded } = useNftStore();
  const isClient = useIsClient();
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'recent' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'EpicMint - NFT Marketplace for Stories, Comics & Poems';
  }, []);

  // Calculate stats safely
  const stats = {
    totalNFTs: isClient && isLoaded ? nfts.length : 0,
    totalViews: isClient && isLoaded ? nfts.reduce((sum, nft) => sum + (nft.views || 0), 0) : 0,
    onSale: isClient && isLoaded ? nfts.filter(nft => nft.isListed).length : 0,
    stories: isClient && isLoaded ? nfts.filter(nft => nft.category === 'story').length : 0,
    comics: isClient && isLoaded ? nfts.filter(nft => nft.category === 'comic').length : 0,
    poems: isClient && isLoaded ? nfts.filter(nft => nft.category === 'poem').length : 0,
  };

  // Enhanced filter and search logic
  const filteredNfts = nfts.filter((nft: Nft) => {
    // Category filter
    if (filters.category && nft.category !== filters.category) return false;
    
    // Listed status filter
    if (filters.isListed !== undefined && nft.isListed !== filters.isListed) return false;
    
    // Price range filter
    if (filters.minPrice !== undefined && nft.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && nft.price > filters.maxPrice) return false;
    
    // Date range filter
    if (filters.dateFrom && nft.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && nft.createdAt > filters.dateTo) return false;
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!nft.tags || !nft.tags.some(tag => filters.tags?.includes(tag))) {
        return false;
      }
    }
    
    // Text search filter (search in title, description, creator)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = nft.title.toLowerCase().includes(query);
      const matchesDescription = nft.description.toLowerCase().includes(query);
      const matchesContent = nft.content.toLowerCase().includes(query);
      const matchesCreator = nft.owners[nft.owners.length - 1]?.address.toLowerCase().includes(query);
      const matchesCategory = nft.category.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesDescription && !matchesContent && !matchesCreator && !matchesCategory) {
        return false;
      }
    }
    
    return true;
  });

  // Sort NFTs
  const sortedNfts = [...filteredNfts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'recent':
        return (b.createdAt || 0) - (a.createdAt || 0);
      case 'oldest':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Paginate NFTs
  const totalItems = sortedNfts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNfts = sortedNfts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Animations */}
      <ResponsiveSection spacing="loose" className="relative overflow-hidden border-b">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>
        
        {/* Floating Orbs with Enhanced Animation */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Badge with Animation */}
            <AnimatedElement animation="fadeInDown">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm hover:bg-purple-500/20 transition-colors cursor-pointer">
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-sm font-medium">Web3 Marketplace for Creators</span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            </AnimatedElement>

            {/* Main Heading with Enhanced Animation */}
            <AnimatedElement animation="fadeInUp" delay={200}>
              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform cursor-pointer">
                  EpicMint
                </span>
              </h1>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeInUp" delay={400}>
              <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Write, Own, and Earn: The Web3 Marketplace for 
                <span className="text-purple-600 font-semibold hover:text-purple-500 transition-colors"> Stories</span>,
                <span className="text-pink-600 font-semibold hover:text-pink-500 transition-colors"> Comics</span>, and
                <span className="text-blue-600 font-semibold hover:text-blue-500 transition-colors"> Poems</span>
              </p>
            </AnimatedElement>
            
            {/* Enhanced CTA Buttons */}
            <AnimatedElement animation="fadeInUp" delay={600}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base px-8 transform hover:scale-105 transition-all duration-200">
                  <Link href="/create">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Creating
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <div className="relative z-10">
                  <Link 
                    href="/create-ai"
                    className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 text-base font-medium border-2 border-border bg-background transition-all duration-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:scale-105 hover:shadow-lg no-underline cursor-pointer relative z-20"
                    style={{
                      pointerEvents: 'all',
                      position: 'relative',
                      zIndex: 999
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Create with AI button clicked!');
                      window.location.href = '/create-ai';
                    }}
                  >
                    <Sparkles className="w-5 h-5 transition-transform hover:rotate-12" />
                    Create with AI
                  </Link>
                </div>
              </div>
            </AnimatedElement>

            {/* Enhanced Stats */}
            <AnimatedElement animation="fadeInUp" delay={800}>
              <ResponsiveGrid cols={{ sm: 3 }} gap="lg" className="pt-12 max-w-3xl mx-auto">
                {[
                  { 
                    value: `${stats.totalNFTs}+`, 
                    label: 'NFTs Created', 
                    color: 'purple',
                    gradient: 'from-purple-600 to-pink-600'
                  },
                  { 
                    value: `${stats.totalViews}+`, 
                    label: 'Total Views', 
                    color: 'pink',
                    gradient: 'from-pink-600 to-blue-600'
                  },
                  { 
                    value: `${stats.onSale}+`, 
                    label: 'On Sale', 
                    color: 'blue',
                    gradient: 'from-blue-600 to-purple-600'
                  }
                ].map((stat, index) => (
                  <div key={stat.label} className="group hover:scale-105 transition-transform text-center">
                    <div className="relative mb-2">
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity`} />
                      <div className={`relative text-3xl md:text-5xl font-bold font-headline bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {!isClient || !isLoaded ? (
                          <div className="animate-pulse bg-muted rounded h-12 w-16 mx-auto" />
                        ) : (
                          stat.value
                        )}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </ResponsiveGrid>
            </AnimatedElement>
          </div>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Live Crypto Prices Section with Error Boundary */}
      <ErrorBoundary level="section">
        <ScrollAnimation animation="fadeInUp">
          <section className="border-t bg-secondary/30">
            <ResponsiveContainer maxWidth="xl" padding="lg">
              <div className="text-center mb-6">
                <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Live Market Prices
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time cryptocurrency prices • Updates every 60 seconds
                </p>
              </div>
              <CryptoPrices />
            </ResponsiveContainer>
          </section>
        </ScrollAnimation>
      </ErrorBoundary>

      {/* Enhanced Category Cards Section */}
      <ResponsiveSection spacing="normal" className="border-t">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <ScrollAnimation animation="fadeInUp">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">
                Choose Your Creative Path
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a category to start your NFT journey
              </p>
            </div>
          </ScrollAnimation>
          
          <StaggerContainer staggerDelay={150}>
            <ResponsiveGrid cols={{ sm: 1, md: 3 }} gap="lg" className="max-w-5xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: 'Stories',
                  description: 'Craft captivating narratives and share your tales with the world',
                  color: 'purple',
                  category: 'story',
                  gradient: 'from-purple-500 to-purple-600'
                },
                {
                  icon: Palette,
                  title: 'Comics',
                  description: 'Create visual stories that bring your imagination to life',
                  color: 'pink',
                  category: 'comic',
                  gradient: 'from-pink-500 to-pink-600'
                },
                {
                  icon: FileText,
                  title: 'Poems',
                  description: 'Express emotions through beautiful verses and rhythms',
                  color: 'blue',
                  category: 'poem',
                  gradient: 'from-blue-500 to-blue-600'
                }
              ].map((item) => (
                <AnimatedCard
                  key={item.title}
                  animation="lift"
                  className={`group border-2 hover:border-${item.color}-500/50 cursor-pointer`}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Eye className="w-4 h-4" />
                      <span>
                        {!isClient || !isLoaded ? (
                          <div className="animate-pulse bg-muted rounded h-4 w-16" />
                        ) : (
                          `${item.category === 'story' ? stats.stories : 
                             item.category === 'comic' ? stats.comics : 
                             stats.poems} ${item.title}`
                        )}
                      </span>
                    </div>
                    <Button 
                      asChild 
                      className={`w-full hover:scale-105 transition-all duration-200`}
                      style={{
                        backgroundColor: item.color === 'purple' ? 'rgb(147 51 234)' : 
                                       item.color === 'pink' ? 'rgb(236 72 153)' : 
                                       'rgb(59 130 246)',
                      }}
                    >
                      <Link href="/create">
                        {item.title === 'Stories' ? 'Start Writing' : item.title === 'Comics' ? 'Create Comic' : 'Write Poem'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </ResponsiveGrid>
          </StaggerContainer>
        </ResponsiveContainer>
      </ResponsiveSection>

      {/* Enhanced Featured/Trending Section */}
      {nfts.length > 0 && (
        <ErrorBoundary level="section">
          <ScrollAnimation animation="fadeInUp">
            <ResponsiveSection spacing="normal" className="bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl my-8">
              <ResponsiveContainer maxWidth="xl" padding="lg">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold flex items-center gap-3">
                      <Flame className="w-8 h-8 text-orange-500" />
                      Trending Now
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Most viewed creations this week
                    </p>
                  </div>
                </div>

                <StaggerContainer staggerDelay={100}>
                  <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
                    {[...nfts]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 4)
                      .map((nft) => (
                        <div key={nft.hash} className="group relative">
                          <Badge className="absolute top-4 right-4 z-10 bg-orange-500 hover:bg-orange-600">
                            <Flame className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                          <NFTErrorBoundary>
                            <NftCard nft={nft} />
                          </NFTErrorBoundary>
                        </div>
                      ))}
                  </ResponsiveGrid>
                </StaggerContainer>
              </ResponsiveContainer>
            </ResponsiveSection>
          </ScrollAnimation>
        </ErrorBoundary>
      )}

      {/* Enhanced Explore Section */}
      <ResponsiveSection spacing="normal">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          {/* Search Bar with Animation */}
          <ScrollAnimation animation="fadeInUp">
            <div className="max-w-3xl mx-auto mb-12">
              <SearchForm 
                onSearch={setSearchQuery}
                onFilterClick={() => setShowFilters(!showFilters)}
                placeholder="Search NFTs by title, creator, category, or description..."
              />
              {searchQuery && (
                <div className="mt-3 text-sm text-muted-foreground text-center">
                  Showing results for: <span className="font-semibold text-foreground">"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeInUp">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-headline text-4xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  Explore Creations
                </h2>
                <p className="text-muted-foreground mt-2">
                  {filteredNfts.length} {filteredNfts.length === 1 ? 'creation' : 'creations'} found
                </p>
              </div>
              <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </ScrollAnimation>

          {!isClient || !isLoaded ? (
            <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="lg">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <NFTCardSkeleton key={i} />
              ))}
            </ResponsiveGrid>
          ) : paginatedNfts.length > 0 ? (
            <ErrorBoundary level="section">
              <StaggerContainer staggerDelay={75}>
                <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="lg">
                  {paginatedNfts.map((nft) => (
                    <div key={nft.hash} className="group">
                      <NFTErrorBoundary>
                        <NftCard nft={nft} />
                      </NFTErrorBoundary>
                    </div>
                  ))}
                </ResponsiveGrid>
              </StaggerContainer>
              {totalPages > 1 && (
                <AnimatedElement animation="fadeInUp" className="mt-12">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </AnimatedElement>
              )}
            </ErrorBoundary>
          ) : (
            <AnimatedElement animation="fadeInUp">
              <NoNFTsFound 
                title={nfts.length === 0 ? 'No Creations Yet' : 'No Results Found'}
                description={nfts.length === 0
                  ? 'Be the first to create an amazing masterpiece!'
                  : 'Try adjusting your filters to see more results'
                }
                actionLabel="Create Now"
                actionHref="/create"
              />
            </AnimatedElement>
          )}
        </ResponsiveContainer>
      </ResponsiveSection>
    </div>
  );
}
