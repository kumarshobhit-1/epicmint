'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { searchPerformanceMonitor } from '@/lib/performance-utils';
import { Maximize2, Minimize2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SearchPerformanceDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dashboard when route changes
  useEffect(() => {
    setIsVisible(false);
    setIsExpanded(false);
  }, [pathname]);

  // Close dashboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateStats = () => {
      setStats(searchPerformanceMonitor.getStats());
    };

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    updateStats(); // Initial load

    return () => clearInterval(interval);
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development' || !stats) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2"
        title={isVisible ? "Close Search Stats (ESC)" : "Open Search Stats"}
      >
        🔍 Search Stats
      </Button>
      
      {isVisible && (
        <Card className={`${isExpanded ? 'w-96 max-h-[80vh]' : 'w-80 max-h-[70vh]'} p-4 bg-background/95 backdrop-blur-sm border shadow-lg overflow-hidden flex flex-col transition-all duration-200`}>
          <div className="space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 pb-2 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Search Performance</h3>
                <span className="text-xs text-muted-foreground opacity-60">ESC to close</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    searchPerformanceMonitor.clear();
                    setStats(searchPerformanceMonitor.getStats());
                  }}
                  className="h-6 px-2"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Total Searches</div>
                <div className="font-medium">{stats.totalSearches}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Avg Time</div>
                <div className="font-medium">{stats.averageTime}ms</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Cache Hit Rate</div>
                <div className="font-medium">{stats.cacheHitRate}%</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Slow Searches</div>
                <div className="font-medium text-red-500">{stats.slowSearches}</div>
              </div>
            </div>
            
            <div>
              <div className="text-muted-foreground text-xs mb-2">Search Sources</div>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(stats.sourceBreakdown).map(([source, count]) => (
                  <Badge key={source} variant="secondary" className="text-xs">
                    {source}: {String(count)}
                  </Badge>
                ))}
              </div>
            </div>
            
            {stats.recentSearches.length > 0 && (
              <div className="flex flex-col min-h-0">
                <div className="text-muted-foreground text-xs mb-2 flex justify-between items-center">
                  <span>Recent Searches</span>
                  {stats.recentSearches.length > 5 && (
                    <span className="text-xs opacity-60">Scroll ↕</span>
                  )}
                </div>
                <div className={`space-y-1 overflow-y-auto ${isExpanded ? 'max-h-64' : 'max-h-48'} pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent`}>
                  {stats.recentSearches.map((search: any, idx: number) => (
                    <div key={idx} className="text-xs bg-muted/50 p-2 rounded flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="truncate flex-1 mr-2">"{search.searchQuery}"</span>
                        <div className="flex gap-1 items-center">
                          <Badge 
                            variant={search.duration > 500 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {Math.round(search.duration)}ms
                          </Badge>
                          {search.cacheHit && (
                            <Badge variant="default" className="text-xs">
                              cache
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {search.resultCount} results • {search.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}