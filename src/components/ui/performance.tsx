'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);
  const [performanceData, setPerformanceData] = useState({
    renderTime: 0,
    renderCount: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - mountTime.current;
    
    // Get memory usage if available
    const memoryUsage = (performance as any).memory 
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024
      : 0;

    setPerformanceData({
      renderTime,
      renderCount: renderCount.current,
      memoryUsage,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime}ms`,
        renderCount: renderCount.current,
        memoryUsage: `${memoryUsage.toFixed(2)}MB`,
      });
    }
  });

  return performanceData;
}

// Loading performance tracker
export function useLoadingPerformance() {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { start: number; end?: number; duration?: number };
  }>({});

  const startLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { start: performance.now() }
    }));
  };

  const endLoading = (key: string) => {
    setLoadingStates(prev => {
      const current = prev[key];
      if (!current) return prev;

      const end = performance.now();
      const duration = end - current.start;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Loading Performance] ${key}: ${duration.toFixed(2)}ms`);
      }

      return {
        ...prev,
        [key]: { ...current, end, duration }
      };
    });
  };

  const getLoadingDuration = (key: string) => {
    return loadingStates[key]?.duration || 0;
  };

  return { startLoading, endLoading, getLoadingDuration, loadingStates };
}

// Image lazy loading with performance tracking
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  blur?: boolean;
}

export function LazyImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  placeholder = '/placeholder.jpg',
  blur = true,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const startTime = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          startTime.current = performance.now();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    setLoadTime(duration);
    setIsLoaded(true);
    onLoad?.();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image Load Performance] ${src}: ${duration.toFixed(2)}ms`);
    }
  };

  const handleError = () => {
    onError?.();
    setIsLoaded(true); // Set to true to stop loading state
  };

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
            blur && 'backdrop-blur-sm'
          )}
        >
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Development performance info */}
      {process.env.NODE_ENV === 'development' && loadTime && (
        <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

// Virtualized list for better performance with large datasets
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
  overscan?: number;
}

export function VirtualizedList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className,
  overscan = 3,
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (items[i]) {
      visibleItems.push(
        <div
          key={i}
          style={{
            height: itemHeight,
            transform: `translateY(${i * itemHeight}px)`,
          }}
          className="absolute w-full"
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
  }

  return (
    <div
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>

      {/* Scrolling indicator */}
      {isScrolling && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
          Scrolling... ({visibleItems.length} visible)
        </div>
      )}
    </div>
  );
}

// Debounced search component for better performance
interface DebouncedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function DebouncedSearch({
  onSearch,
  placeholder = 'Search...',
  delay = 300,
  className,
}: DebouncedSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const searchCount = useRef(0);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim()) {
      setIsSearching(true);
      timeoutRef.current = setTimeout(() => {
        searchCount.current += 1;
        const startTime = performance.now();
        
        onSearch(query);
        
        const endTime = performance.now();
        setIsSearching(false);

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Search Performance] Query "${query}": ${(endTime - startTime).toFixed(2)}ms (Search #${searchCount.current})`);
        }
      }, delay);
    } else {
      setIsSearching(false);
      onSearch('');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, delay, onSearch]);

  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      />
      
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Performance metrics display (development only)
interface PerformanceMetricsProps {
  className?: string;
}

export function PerformanceMetrics({ className }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          memory,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-4 left-4 bg-black/90 text-white text-xs p-3 rounded-lg font-mono z-50',
      className
    )}>
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>React: {React.version}</div>
    </div>
  );
}

// Bundle size analyzer component (development only)
export function BundleAnalyzer() {
  const [bundleInfo, setBundleInfo] = useState<{
    totalSize: number;
    loadTime: number;
    chunkCount: number;
  } | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const analyzeBundle = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        
        setBundleInfo({
          totalSize: 0, // Would need webpack-bundle-analyzer for actual size
          loadTime: Math.round(loadTime),
          chunkCount: document.querySelectorAll('script[src]').length,
        });
      }
    };

    if (document.readyState === 'complete') {
      analyzeBundle();
    } else {
      window.addEventListener('load', analyzeBundle);
      return () => window.removeEventListener('load', analyzeBundle);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !bundleInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-900/90 text-white text-xs p-3 rounded-lg font-mono z-50">
      <div>Load Time: {bundleInfo.loadTime}ms</div>
      <div>Scripts: {bundleInfo.chunkCount}</div>
      <div>Status: {bundleInfo.loadTime < 3000 ? '✅ Fast' : '⚠️ Slow'}</div>
    </div>
  );
}

// Core Web Vitals monitor
export function CoreWebVitalsMonitor() {
  const [vitals, setVitals] = useState<{
    lcp: number;
    fid: number;
    cls: number;
  }>({ lcp: 0, fid: 0, cls: 0 });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setVitals(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 left-4 bg-gray-900/90 text-white text-xs p-3 rounded-lg font-mono z-50">
      <div className="font-bold mb-2">Core Web Vitals</div>
      <div className={getScoreColor('lcp', vitals.lcp)}>
        LCP: {vitals.lcp}ms
      </div>
      <div className={getScoreColor('fid', vitals.fid)}>
        FID: {vitals.fid}ms
      </div>
      <div className={getScoreColor('cls', vitals.cls)}>
        CLS: {vitals.cls}
      </div>
    </div>
  );
}