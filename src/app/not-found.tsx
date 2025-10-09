'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Sparkles, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  // Set page title
  useEffect(() => {
    document.title = '404 - Page Not Found | EpicMint';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Animated 404 Number */}
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl rounded-full" />
          
          {/* Main 404 text */}
          <h1 className="relative text-8xl md:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the digital void. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Helpful Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Go Home Card */}
          <div className="group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-500/50 cursor-pointer bg-card rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Go Home</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Return to the homepage and explore amazing NFTs
            </p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/">
                Take Me Home
              </Link>
            </Button>
          </div>

          {/* Search Card */}
          <div className="group hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-pink-500/50 cursor-pointer bg-card rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Search NFTs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find specific stories, comics, or poems
            </p>
            <Button asChild variant="outline" className="w-full border-pink-500 text-pink-600 hover:bg-pink-50">
              <Link href="/?search=true">
                Start Searching
              </Link>
            </Button>
          </div>

          {/* Create Card */}
          <div className="group hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500/50 cursor-pointer bg-card rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Create NFT</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start creating your own digital masterpiece
            </p>
            <Button asChild variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
              <Link href="/create">
                Create Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button asChild size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base px-8">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="border-2 text-base px-8">
            <Link href="#" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="mt-16 p-6 bg-muted/50 rounded-2xl border border-border/50">
          <h3 className="font-semibold text-lg mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span>Check the URL for any typos or spelling errors</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
              <span>Use the search function to find specific content</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>Browse categories to discover new NFTs</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Create your own NFT and join the community</span>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}