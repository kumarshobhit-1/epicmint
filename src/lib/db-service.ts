import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { handleError, showLoading, showSuccess } from './error-handler';
import type { 
  Comment, 
  Review, 
  Collection, 
  UserProfile, 
  Transaction,
  Nft,
  PaginatedResponse,
  SearchFilters,
  PaginationParams
} from './types';

// Collections
const USERS_COLLECTION = 'users';
const NFTS_COLLECTION = 'nfts';
const COMMENTS_COLLECTION = 'comments';
const REVIEWS_COLLECTION = 'reviews';
const COLLECTIONS_COLLECTION = 'collections';
const TRANSACTIONS_COLLECTION = 'transactions';
const FAVORITES_COLLECTION = 'favorites';

// Check if Firebase is enabled
const isFirebaseEnabled = () => {
  return process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';
};

// Safe Firebase operation wrapper with comprehensive error handling
async function safeFirebaseOperation<T>(
  operation: () => Promise<T>,
  fallback?: T,
  errorMessage?: string,
  userAction?: string
): Promise<T> {
  if (!isFirebaseEnabled()) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error('Firebase is not enabled');
  }

  try {
    return await operation();
  } catch (error: any) {
    const customMessage = errorMessage || 'डेटाबेस ऑपरेशन में समस्या | Database operation failed';
    handleError(error, userAction || 'Firebase operation');
    
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

// User Profile Operations
export async function createUserProfile(profile: UserProfile): Promise<void> {
  await safeFirebaseOperation(
    async () => {
      const userRef = doc(db, USERS_COLLECTION, profile.uid);
      await setDoc(userRef, {
        ...profile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });
    },
    undefined,
    'प्रोफाइल बनाने में समस्या | Failed to create user profile',
    'Creating user profile'
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return await safeFirebaseOperation(
    async () => {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        // Ensure uid is set from document ID if missing
        if (!userData.uid) {
          userData.uid = userSnap.id;
        }
        return userData;
      }
      return null;
    },
    null,
    'प्रोफाइल लोड करने में समस्या | Failed to load user profile',
    'Loading user profile'
  );
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await safeFirebaseOperation(
    async () => {
      const userRef = doc(db, USERS_COLLECTION, uid);
      
      // Remove undefined values and convert updatedAt to Timestamp
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );
      
      // Use setDoc with merge: true instead of updateDoc
      // This will create the document if it doesn't exist, or update if it does
      await setDoc(userRef, {
        ...cleanUpdates,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    },
    undefined,
    'प्रोफाइल अपडेट करने में समस्या | Failed to update user profile',
    'Updating user profile'
  );
}

// Helper function to remove undefined values from object
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
}

// Search users by name or email
export async function searchUsers(searchQuery: string): Promise<UserProfile[]> {
  if (!searchQuery.trim()) return [];
  
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    
    const lowerQuery = searchQuery.toLowerCase();
    const users: UserProfile[] = [];
    
    snapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;
      // Ensure uid is set from document ID if missing
      if (!userData.uid) {
        userData.uid = doc.id;
      }
      
      const displayName = (userData.displayName || '').toLowerCase();
      const email = (userData.email || '').toLowerCase();
      const walletAddress = (userData.walletAddress || '').toLowerCase();
      
      // Search by display name, email, or wallet address
      if (displayName.includes(lowerQuery) || 
          email.includes(lowerQuery) ||
          walletAddress.includes(lowerQuery)) {
        console.log('[searchUsers] Found user:', { uid: userData.uid, displayName: userData.displayName, email: userData.email });
        users.push(userData);
      }
    });
    
    return users.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error('[searchUsers] Error fetching users:', error);
    return [];
  }
}

// NFT Operations
export async function saveNft(nft: Nft): Promise<void> {
  const nftRef = doc(db, NFTS_COLLECTION, nft.hash);
  
  // Remove undefined fields to prevent Firestore errors
  const cleanedNft = removeUndefined({
    ...nft,
    createdAt: nft.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  await setDoc(nftRef, cleanedNft);
}

export async function getNft(hash: string): Promise<Nft | null> {
  const nftRef = doc(db, NFTS_COLLECTION, hash);
  const nftSnap = await getDoc(nftRef);
  
  if (nftSnap.exists()) {
    return nftSnap.data() as Nft;
  }
  return null;
}

export async function updateNft(hash: string, updates: Partial<Nft>): Promise<void> {
  const nftRef = doc(db, NFTS_COLLECTION, hash);
  
  // Remove undefined fields to prevent Firestore errors
  const cleanedUpdates = removeUndefined({
    ...updates,
    updatedAt: Timestamp.now(),
  });
  
  await updateDoc(nftRef, cleanedUpdates);
}

export async function incrementNftViews(hash: string): Promise<void> {
  await safeFirebaseOperation(
    async () => {
      const nftRef = doc(db, NFTS_COLLECTION, hash);
      await updateDoc(nftRef, {
        views: increment(1),
        updatedAt: Timestamp.now(),
      });
    },
    undefined,
    `Failed to increment views for NFT: ${hash}`
  );
}

// Search and Filter NFTs
export async function searchNfts(
  filters: SearchFilters,
  pagination: PaginationParams
): Promise<PaginatedResponse<Nft>> {
  let q = query(collection(db, NFTS_COLLECTION));

  // Apply filters
  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }
  
  if (filters.isListed !== undefined) {
    q = query(q, where('isListed', '==', filters.isListed));
  }

  if (filters.minPrice !== undefined) {
    q = query(q, where('price', '>=', filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    q = query(q, where('price', '<=', filters.maxPrice));
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'recent':
      q = query(q, orderBy('createdAt', 'desc'));
      break;
    case 'oldest':
      q = query(q, orderBy('createdAt', 'asc'));
      break;
    case 'price-high':
      q = query(q, orderBy('price', 'desc'));
      break;
    case 'price-low':
      q = query(q, orderBy('price', 'asc'));
      break;
    case 'popular':
      q = query(q, orderBy('views', 'desc'));
      break;
    default:
      q = query(q, orderBy('createdAt', 'desc'));
  }

  // Apply pagination
  q = query(q, limit(pagination.limit));

  const snapshot = await getDocs(q);
  const nfts = snapshot.docs.map(doc => doc.data() as Nft);

  // Get total count (simplified - in production, use a separate counter)
  const totalSnapshot = await getDocs(collection(db, NFTS_COLLECTION));
  const total = totalSnapshot.size;

  return {
    data: nfts,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

// Comments Operations
export async function addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  const commentRef = doc(collection(db, COMMENTS_COLLECTION));
  const newComment: Comment = {
    ...comment,
    id: commentRef.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(commentRef, newComment);
  return newComment;
}

export async function getComments(nftHash: string): Promise<Comment[]> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('nftHash', '==', nftHash),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Comment);
}

export async function deleteComment(commentId: string): Promise<void> {
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(commentRef);
}

// Reviews Operations
export async function addReview(review: Omit<Review, 'id'>): Promise<Review> {
  const reviewRef = doc(collection(db, REVIEWS_COLLECTION));
  const newReview: Review = {
    ...review,
    id: reviewRef.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(reviewRef, newReview);
  return newReview;
}

export async function getReviews(nftHash: string): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('nftHash', '==', nftHash),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Review);
}

export async function getAverageRating(nftHash: string): Promise<number> {
  const reviews = await getReviews(nftHash);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// Collections Operations
export async function createCollection(collectionData: Omit<Collection, 'id'>): Promise<Collection> {
  const collectionRef = doc(collection(db, COLLECTIONS_COLLECTION));
  const newCollection: Collection = {
    ...collectionData,
    id: collectionRef.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(collectionRef, newCollection);
  return newCollection;
}

export async function getUserCollections(userId: string): Promise<Collection[]> {
  const q = query(
    collection(db, COLLECTIONS_COLLECTION),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Collection);
}

export async function addNftToCollection(collectionId: string, nftHash: string): Promise<void> {
  const collectionRef = doc(db, COLLECTIONS_COLLECTION, collectionId);
  await updateDoc(collectionRef, {
    nftHashes: arrayUnion(nftHash),
    updatedAt: Timestamp.now(),
  });
}

export async function removeNftFromCollection(collectionId: string, nftHash: string): Promise<void> {
  const collectionRef = doc(db, COLLECTIONS_COLLECTION, collectionId);
  await updateDoc(collectionRef, {
    nftHashes: arrayRemove(nftHash),
    updatedAt: Timestamp.now(),
  });
}

// Favorites Operations
export async function addToFavorites(userId: string, nftHash: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    favorites: arrayUnion(nftHash),
  });

  // Increment NFT favorites count
  const nftRef = doc(db, NFTS_COLLECTION, nftHash);
  await updateDoc(nftRef, {
    favorites: increment(1),
  });
}

export async function removeFromFavorites(userId: string, nftHash: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    favorites: arrayRemove(nftHash),
  });

  // Decrement NFT favorites count
  const nftRef = doc(db, NFTS_COLLECTION, nftHash);
  await updateDoc(nftRef, {
    favorites: increment(-1),
  });
}

export async function getFavorites(userId: string): Promise<Nft[]> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile || !userProfile.favorites.length) return [];

  const nftsPromises = userProfile.favorites.map(hash => getNft(hash));
  const nfts = await Promise.all(nftsPromises);
  
  return nfts.filter((nft): nft is Nft => nft !== null);
}

// Transaction Operations
export async function saveTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION));
  const newTransaction: Transaction = {
    ...transaction,
    id: transactionRef.id,
  };
  
  await setDoc(transactionRef, newTransaction);
  return newTransaction;
}

export async function getTransactionHistory(nftHash: string): Promise<Transaction[]> {
  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('nftHash', '==', nftHash),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Transaction);
}

export async function getUserTransactions(userAddress: string): Promise<Transaction[]> {
  const q1 = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('from', '==', userAddress),
    orderBy('timestamp', 'desc')
  );
  
  const q2 = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('to', '==', userAddress),
    orderBy('timestamp', 'desc')
  );
  
  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  
  const transactions = [
    ...snapshot1.docs.map(doc => doc.data() as Transaction),
    ...snapshot2.docs.map(doc => doc.data() as Transaction),
  ];
  
  // Sort by timestamp and remove duplicates
  return transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((tx, index, self) => 
      index === self.findIndex(t => t.id === tx.id)
    );
}

// Follower/Following Operations
export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const followerRef = doc(db, USERS_COLLECTION, followerId);
  const followingRef = doc(db, USERS_COLLECTION, followingId);

  // Update both users atomically
  await Promise.all([
    updateDoc(followerRef, {
      following: arrayUnion(followingId),
      updatedAt: Timestamp.now(),
    }),
    updateDoc(followingRef, {
      followers: arrayUnion(followerId),
      updatedAt: Timestamp.now(),
    }),
  ]);
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const followerRef = doc(db, USERS_COLLECTION, followerId);
  const followingRef = doc(db, USERS_COLLECTION, followingId);

  // Update both users atomically
  await Promise.all([
    updateDoc(followerRef, {
      following: arrayRemove(followingId),
      updatedAt: Timestamp.now(),
    }),
    updateDoc(followingRef, {
      followers: arrayRemove(followerId),
      updatedAt: Timestamp.now(),
    }),
  ]);
}

export async function getFollowers(userId: string): Promise<UserProfile[]> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return [];
  }

  const user = userSnap.data() as UserProfile;
  const followerIds = user.followers || [];

  if (followerIds.length === 0) {
    return [];
  }

  // Fetch all follower profiles
  const followerProfiles = await Promise.all(
    followerIds.map(id => getUserProfile(id))
  );

  return followerProfiles.filter((profile): profile is UserProfile => profile !== null);
}

export async function getFollowing(userId: string): Promise<UserProfile[]> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return [];
  }

  const user = userSnap.data() as UserProfile;
  const followingIds = user.following || [];

  if (followingIds.length === 0) {
    return [];
  }

  // Fetch all following profiles
  const followingProfiles = await Promise.all(
    followingIds.map(id => getUserProfile(id))
  );

  return followingProfiles.filter((profile): profile is UserProfile => profile !== null);
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const followerRef = doc(db, USERS_COLLECTION, followerId);
  const followerSnap = await getDoc(followerRef);
  
  if (!followerSnap.exists()) {
    return false;
  }

  const follower = followerSnap.data() as UserProfile;
  return follower.following?.includes(followingId) || false;
}

// Achievement Operations
export type AchievementCriteria = {
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  description: string;
  icon: string;
  requirement: {
    nfts?: number;
    followers?: number;
    sales?: number;
    earnings?: number;
  };
};

export const ACHIEVEMENT_BADGES: AchievementCriteria[] = [
  {
    badge: 'bronze',
    name: 'Bronze Creator',
    description: 'Created 5 or more NFTs',
    icon: '🥉',
    requirement: { nfts: 5 },
  },
  {
    badge: 'silver',
    name: 'Silver Creator',
    description: 'Created 10+ NFTs and gained 100+ followers',
    icon: '🥈',
    requirement: { nfts: 10, followers: 100 },
  },
  {
    badge: 'gold',
    name: 'Gold Creator',
    description: 'Created 25+ NFTs, 500+ followers, and 10+ sales',
    icon: '🥇',
    requirement: { nfts: 25, followers: 500, sales: 10 },
  },
  {
    badge: 'platinum',
    name: 'Platinum Creator',
    description: 'Created 50+ NFTs, 1000+ followers, and 50+ sales',
    icon: '💎',
    requirement: { nfts: 50, followers: 1000, sales: 50 },
  },
];

export async function getUserAchievements(userId: string, nfts: Nft[]): Promise<AchievementCriteria[]> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) return [];

  // Calculate user stats
  const createdNfts = nfts.filter(nft => nft.owners[0]?.address === userProfile.walletAddress);
  const nftCount = createdNfts.length;
  const followerCount = userProfile.followers?.length || 0;
  const salesCount = createdNfts.reduce((sum, nft) => sum + ((nft.owners?.length || 1) - 1), 0);

  // Check which achievements are earned
  const earnedAchievements = ACHIEVEMENT_BADGES.filter(achievement => {
    const req = achievement.requirement;
    return (
      (!req.nfts || nftCount >= req.nfts) &&
      (!req.followers || followerCount >= req.followers) &&
      (!req.sales || salesCount >= req.sales)
    );
  });

  return earnedAchievements;
}

// Sales History
export async function getSalesHistory(userId: string, nfts: Nft[]): Promise<Array<{
  nft: Nft;
  soldTo: string;
  price: number;
  soldAt: number;
}>> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) return [];

  // Get NFTs created by the user that have been sold
  const createdNfts = nfts.filter(nft => nft.owners[0]?.address === userProfile.walletAddress);
  
  const salesHistory: Array<{
    nft: Nft;
    soldTo: string;
    price: number;
    soldAt: number;
  }> = [];

  createdNfts.forEach(nft => {
    // If there's more than one owner, it means it was sold
    if (nft.owners.length > 1) {
      // Get all sales (skip the first owner as that's the creator)
      for (let i = 1; i < nft.owners.length; i++) {
        salesHistory.push({
          nft,
          soldTo: nft.owners[i].address,
          price: nft.owners[i].price || nft.price,
          soldAt: nft.owners[i].timestamp,
        });
      }
    }
  });

  // Sort by date, newest first
  return salesHistory.sort((a, b) => b.soldAt - a.soldAt);
}

// Optimized search function for real-time suggestions with better performance
export async function searchNftsSimple(searchQuery: string, maxResults: number = 5): Promise<Nft[]> {
  try {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return [];
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    const searchTerms = lowerQuery.split(' ').filter(term => term.length > 1);
    
    // Strategy 1: Search by exact matches first (most relevant and faster)
    const exactMatches = new Set<string>();
    const results: Nft[] = [];
    
    // Try exact title search first (Firebase supports this efficiently)
    try {
      const nftsRef = collection(db, NFTS_COLLECTION);
      const titleQuery = query(
        nftsRef,
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff'),
        orderBy('title'),
        limit(maxResults)
      );
      
      const titleSnapshot = await getDocs(titleQuery);
      titleSnapshot.forEach(doc => {
        const data = doc.data();
        const nft = {
          ...data,
          createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
          updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
        } as Nft;
        
        if (!exactMatches.has(nft.hash)) {
          results.push(nft);
          exactMatches.add(nft.hash);
        }
      });
    } catch (error) {
      console.log('Title search failed, trying category search');
    }
    
    // If we need more results, try category search
    if (results.length < maxResults) {
      try {
        const nftsRef = collection(db, NFTS_COLLECTION);
        const categoryQuery = query(
          nftsRef,
          where('category', '>=', lowerQuery),
          where('category', '<=', lowerQuery + '\uf8ff'),
          orderBy('category'),
          limit(maxResults - results.length)
        );
        
        const categorySnapshot = await getDocs(categoryQuery);
        categorySnapshot.forEach(doc => {
          const data = doc.data();
          const nft = {
            ...data,
            createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
          } as Nft;
          
          if (!exactMatches.has(nft.hash)) {
            results.push(nft);
            exactMatches.add(nft.hash);
          }
        });
      } catch (error) {
        console.log('Category search failed');
      }
    }
    
    // Only use fallback if we have very few results
    if (results.length < Math.min(maxResults, 3)) {
      const nftsRef = collection(db, NFTS_COLLECTION);
      const fallbackLimit = Math.min(30, maxResults * 6); // Reduced from 100 to 30
      const fallbackQuery = query(nftsRef, orderBy('createdAt', 'desc'), limit(fallbackLimit));
      const fallbackSnapshot = await getDocs(fallbackQuery);

      const fallbackResults = fallbackSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
          } as Nft;
        })
        .filter(nft => {
          if (exactMatches.has(nft.hash)) return false;
          
          const titleMatch = nft.title?.toLowerCase().includes(lowerQuery);
          const descMatch = nft.description?.toLowerCase().includes(lowerQuery);
          const categoryMatch = nft.category?.toLowerCase().includes(lowerQuery);
          const tagMatch = nft.tags && nft.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
          
          return titleMatch || descMatch || categoryMatch || tagMatch;
        })
        .slice(0, maxResults - results.length);

      results.push(...fallbackResults);
    }

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching NFTs:', error);
    return [];
  }
}
