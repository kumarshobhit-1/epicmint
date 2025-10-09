import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider as NextThemesProvider } from '@/contexts/theme-context';
import { ThemeProvider } from '@/components/ui/theme-system';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import Header from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import DeploymentHistory from '@/components/deployment-history';
import { ErrorBoundary } from '@/components/error-boundary';
import { PageLoader } from '@/components/page-loader';
import { SkipLink } from '@/components/ui/accessibility';
import { NetworkStatus } from '@/components/ui/loading-states';
import SearchPerformanceDashboard from '@/components/search-performance-dashboard';

export const metadata: Metadata = {
  title: 'EpicMint - NFT Marketplace for Stories, Comics & Poems',
  description:
    'Write, Own, and Earn: The Web3 Marketplace for Stories, Comics, and Poems',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EpicMint',
  },
};

// Viewport configuration (separate from metadata in Next.js 15+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#A37ACC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload critical resources */}
        <link rel="dns-prefetch" href="https://ipfs.io" />
        <link rel="dns-prefetch" href="https://gateway.pinata.cloud" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider defaultTheme="system" defaultColorScheme="blue">
          <NextThemesProvider>
            {/* Network status indicator */}
            <NetworkStatus />
            
            {/* Skip link for accessibility */}
            <SkipLink href="#main-content">
              Skip to main content
            </SkipLink>
            
            <PageLoader />
            
            <ErrorBoundary level="page">
              <AuthProvider>
                <Providers>
                  <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main id="main-content" className="flex-1" tabIndex={-1}>
                      {children}
                    </main>
                    <Footer />
                  </div>
                  {/* <DeploymentHistory /> */}
                  <SearchPerformanceDashboard />
                  <Toaster />
                </Providers>
              </AuthProvider>
            </ErrorBoundary>
          </NextThemesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
