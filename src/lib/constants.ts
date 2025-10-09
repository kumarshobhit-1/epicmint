// App Constants
export const APP_NAME = 'EpicMint';
export const APP_DESCRIPTION = 'Write, Own, and Earn: The Web3 Marketplace for Stories, Comics, and Poems';

// NFT Categories
export const NFT_CATEGORIES = [
  { value: 'story', label: 'Story' },
  { value: 'poem', label: 'Poem' },
  { value: 'comic', label: 'Comic' },
  { value: 'novel', label: 'Novel' },
  { value: 'shortstory', label: 'Short Story' },
  { value: 'other', label: 'Other' },
] as const;

export type NftCategory = typeof NFT_CATEGORIES[number]['value'];

// Blockchain Networks
export const SUPPORTED_CHAINS = {
  ETHEREUM_MAINNET: 1,
  SEPOLIA: 11155111,
  POLYGON: 137,
  MUMBAI: 80001,
} as const;

export const CHAIN_NAMES = {
  [SUPPORTED_CHAINS.ETHEREUM_MAINNET]: 'Ethereum',
  [SUPPORTED_CHAINS.SEPOLIA]: 'Sepolia Testnet',
  [SUPPORTED_CHAINS.POLYGON]: 'Polygon',
  [SUPPORTED_CHAINS.MUMBAI]: 'Mumbai Testnet',
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'popular', label: 'Most Popular' },
] as const;

// Royalty Settings
export const DEFAULT_ROYALTY_PERCENTAGE = 10; // 10%
export const MAX_ROYALTY_PERCENTAGE = 30; // 30%
export const MIN_ROYALTY_PERCENTAGE = 0; // 0%

// File Upload Limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_CONTENT_LENGTH = 50000; // characters

// Status
export const NFT_STATUS = {
  DRAFT: 'draft',
  MINTING: 'minting',
  MINTED: 'minted',
  LISTED: 'listed',
  SOLD: 'sold',
  TRANSFERRED: 'transferred',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  NETWORK_ERROR: 'Network error. Please try again',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  MINTING_FAILED: 'NFT minting failed. Please try again',
  UPLOAD_FAILED: 'File upload failed. Please try again',
  INVALID_ADDRESS: 'Invalid wallet address',
  NOT_AUTHORIZED: 'You are not authorized to perform this action',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  NFT_MINTED: 'NFT minted successfully!',
  NFT_LISTED: 'NFT listed for sale successfully!',
  NFT_PURCHASED: 'NFT purchased successfully!',
  NFT_TRANSFERRED: 'NFT transferred successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites!',
} as const;

// Social Media
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com',
  DISCORD: 'https://discord.com',
  TELEGRAM: 'https://telegram.org',
  GITHUB: 'https://github.com',
} as const;

// Gas Estimation
export const GAS_BUFFER_PERCENTAGE = 20; // 20% buffer for gas estimation

// Rating
export const MAX_RATING = 5;
export const MIN_RATING = 1;
