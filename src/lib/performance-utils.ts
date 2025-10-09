// Performance monitoring utilities for search optimization

interface PerformanceMetrics {
  searchQuery: string;
  startTime: number;
  endTime: number;
  duration: number;
  resultCount: number;
  cacheHit: boolean;
  source: 'local' | 'firebase' | 'mixed';
}

class SearchPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100;

  startSearch(searchQuery: string): number {
    return performance.now();
  }

  endSearch(
    searchQuery: string, 
    startTime: number, 
    resultCount: number, 
    cacheHit: boolean = false,
    source: 'local' | 'firebase' | 'mixed' = 'firebase'
  ): void {
    const endTime = performance.now();
    const duration = endTime - startTime;

    const metric: PerformanceMetrics = {
      searchQuery,
      startTime,
      endTime,
      duration,
      resultCount,
      cacheHit,
      source
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow searches for debugging
    if (duration > 1000) {
      console.warn(`Slow search detected: "${searchQuery}" took ${duration.toFixed(2)}ms`);
    }

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Search "${searchQuery}": ${duration.toFixed(2)}ms, ${resultCount} results, ${cacheHit ? 'cache hit' : 'cache miss'}, source: ${source}`);
    }
  }

  getAverageSearchTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / this.metrics.length;
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    const cacheHits = this.metrics.filter(metric => metric.cacheHit).length;
    return (cacheHits / this.metrics.length) * 100;
  }

  getSlowSearches(threshold: number = 500): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.duration > threshold);
  }

  getRecentMetrics(count: number = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }

  clear(): void {
    this.metrics = [];
  }

  getStats() {
    const totalSearches = this.metrics.length;
    const avgTime = this.getAverageSearchTime();
    const cacheHitRate = this.getCacheHitRate();
    const slowSearches = this.getSlowSearches().length;

    const sourceBreakdown = this.metrics.reduce((acc, metric) => {
      acc[metric.source] = (acc[metric.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSearches,
      averageTime: Math.round(avgTime * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      slowSearches,
      sourceBreakdown,
      recentSearches: this.getRecentMetrics(5)
    };
  }
}

// Singleton instance
export const searchPerformanceMonitor = new SearchPerformanceMonitor();

// Debounce utility with performance tracking
export function createPerformantDebounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  let activeSearches = 0;

  return ((...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        activeSearches++;
        
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          activeSearches--;
        }
      }, delay);
    });
  }) as T;
}

// Cache implementation with TTL and performance tracking
export class SearchCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; hits: number }>();
  private ttl: number;
  private maxSize: number;

  constructor(ttlMs: number = 5 * 60 * 1000, maxSize: number = 100) {
    this.ttl = ttlMs;
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    
    return entry.data;
  }

  set(key: string, data: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const avgAge = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + (Date.now() - entry.timestamp), 0) / entries.length
      : 0;

    return {
      size: this.cache.size,
      totalHits,
      averageAge: Math.round(avgAge / 1000), // in seconds
      oldestEntry: entries.length > 0 ? Math.max(...entries.map(e => Date.now() - e.timestamp)) / 1000 : 0
    };
  }
}