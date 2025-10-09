import { NftCategory } from './constants';

export type NftOwner = {
  address: string;
  timestamp: number;
  price?: number; // Price at which it was bought
};

export type Nft = {
  hash: string;
  title: string;
  description: string;
  content: string;
  owners: NftOwner[];
  imageUrl: string;
  imageHint: string;
  category: NftCategory;
  tags?: string[];
  price: number; // Required now for consistent filtering
  isListed?: boolean;
  royaltyPercentage?: number;
  views?: number;
  favorites?: number;
  status?: 'draft' | 'minting' | 'minted' | 'listed' | 'sold' | 'transferred';
  createdAt: number;
  updatedAt: number;
  tokenId?: string;
  ipfsHash?: string;
};

export type Comment = {
  id: string;
  nftHash: string;
  userId: string;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

export type Review = {
  id: string;
  nftHash: string;
  userId: string;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: number;
  updatedAt: number;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  nftHashes: string[];
  coverImage?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  walletAddress?: string;
  // Social Media Links
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    github?: string;
    linkedin?: string;
  };
  favorites: string[]; // NFT hashes
  collections: string[]; // Collection IDs
  createdNfts: string[]; // NFT hashes
  ownedNfts: string[]; // NFT hashes
  followers?: string[]; // User IDs
  following?: string[]; // User IDs
  // Achievements
  achievements?: {
    badge: 'bronze' | 'silver' | 'gold' | 'platinum';
    earnedAt: number;
  }[];
  totalViews?: number;
  totalEarnings?: number;
  // Wallet Balance (cached)
  walletBalance?: {
    eth: string;
    usd: string;
    lastUpdated: number;
  };
  createdAt: number;
  updatedAt: number;
};

export type Transaction = {
  id: string;
  nftHash: string;
  from: string;
  to: string;
  price: number;
  transactionHash: string;
  type: 'mint' | 'sale' | 'transfer';
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
};

export type SearchFilters = {
  category?: NftCategory;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: 'recent' | 'oldest' | 'price-high' | 'price-low' | 'popular';
  isListed?: boolean;
  dateFrom?: number; // timestamp
  dateTo?: number; // timestamp
  searchQuery?: string; // text search
  creator?: string; // wallet address
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
