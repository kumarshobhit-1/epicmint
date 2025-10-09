'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Responsive breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Hook for responsive design
export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.sm;
  const isTablet = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  const isLargeDesktop = windowSize.width >= breakpoints.xl;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmallScreen: windowSize.width < breakpoints.md,
    isMediumScreen: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.xl,
    isLargeScreen: windowSize.width >= breakpoints.xl,
  };
}

// Responsive container component
interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveGrid({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  const gridCols = [];
  if (cols.sm) gridCols.push(`grid-cols-${cols.sm}`);
  if (cols.md) gridCols.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridCols.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridCols.push(`xl:grid-cols-${cols.xl}`);
  if (cols['2xl']) gridCols.push(`2xl:grid-cols-${cols['2xl']}`);

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        ...gridCols,
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function ResponsiveText({
  children,
  as: Component = 'p',
  size = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
  weight = 'normal',
  className,
}: ResponsiveTextProps) {
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const responsiveClasses = [];
  if (size.sm) responsiveClasses.push(size.sm);
  if (size.md) responsiveClasses.push(`md:${size.md}`);
  if (size.lg) responsiveClasses.push(`lg:${size.lg}`);
  if (size.xl) responsiveClasses.push(`xl:${size.xl}`);

  return (
    <Component
      className={cn(
        weightClasses[weight],
        ...responsiveClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: {
    sm?: { width: number; height: number };
    md?: { width: number; height: number };
    lg?: { width: number; height: number };
  };
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export function ResponsiveImage({
  src,
  alt,
  className,
  sizes,
  fallback = '/placeholder-image.jpg',
  loading = 'lazy',
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageSrc(fallback);
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

// Responsive card layout
interface ResponsiveCardLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'compact' | 'comfortable' | 'spacious';
  orientation?: 'vertical' | 'horizontal' | 'auto';
}

export function ResponsiveCardLayout({
  children,
  className,
  variant = 'comfortable',
  orientation = 'auto',
}: ResponsiveCardLayoutProps) {
  const { isMobile, isTablet } = useResponsive();

  const variantClasses = {
    compact: 'p-3 gap-2',
    comfortable: 'p-4 sm:p-6 gap-4',
    spacious: 'p-6 sm:p-8 gap-6',
  };

  const orientationClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
    auto: isMobile ? 'flex-col' : 'flex-row',
  };

  return (
    <div
      className={cn(
        'bg-card rounded-lg border shadow-sm flex',
        variantClasses[variant],
        orientationClasses[orientation],
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive navigation component
interface ResponsiveNavProps {
  children: ReactNode;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'adaptive';
  collapse?: boolean;
}

export function ResponsiveNav({
  children,
  className,
  variant = 'adaptive',
  collapse = true,
}: ResponsiveNavProps) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);

  const shouldCollapse = collapse && isMobile;
  const navVariant = variant === 'adaptive' ? (isMobile ? 'vertical' : 'horizontal') : variant;

  const variantClasses = {
    horizontal: 'flex-row space-x-4',
    vertical: 'flex-col space-y-2',
  };

  if (shouldCollapse) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-accent"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        
        <nav
          className={cn(
            'flex transition-all duration-200',
            variantClasses[navVariant],
            isOpen ? 'block' : 'hidden md:flex'
          )}
        >
          {children}
        </nav>
      </div>
    );
  }

  return (
    <nav
      className={cn(
        'flex',
        variantClasses[navVariant],
        className
      )}
    >
      {children}
    </nav>
  );
}

// Responsive spacing utility
export function getResponsiveSpacing(
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  type: 'padding' | 'margin' | 'gap' = 'padding'
) {
  const spacingMap = {
    xs: { sm: '2', md: '3', lg: '4' },
    sm: { sm: '3', md: '4', lg: '6' },
    md: { sm: '4', md: '6', lg: '8' },
    lg: { sm: '6', md: '8', lg: '12' },
    xl: { sm: '8', md: '12', lg: '16' },
  };

  const prefix = {
    padding: 'p',
    margin: 'm',
    gap: 'gap',
  }[type];

  const spacing = spacingMap[size];

  return `${prefix}-${spacing.sm} sm:${prefix}-${spacing.md} lg:${prefix}-${spacing.lg}`;
}

// Responsive visibility utility
interface ResponsiveShowProps {
  children: ReactNode;
  on?: ('sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  className?: string;
}

export function ResponsiveShow({ children, on = ['md'], className }: ResponsiveShowProps) {
  const showClasses = on.map(breakpoint => `${breakpoint}:block`).join(' ');
  
  return (
    <div className={cn('hidden', showClasses, className)}>
      {children}
    </div>
  );
}

interface ResponsiveHideProps {
  children: ReactNode;
  on?: ('sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  className?: string;
}

export function ResponsiveHide({ children, on = ['sm'], className }: ResponsiveHideProps) {
  const hideClasses = on.map(breakpoint => `${breakpoint}:hidden`).join(' ');
  
  return (
    <div className={cn('block', hideClasses, className)}>
      {children}
    </div>
  );
}

// Responsive card grid for NFTs, profiles etc.
interface ResponsiveCardGridProps {
  children: ReactNode;
  className?: string;
  minCardWidth?: number;
  maxCols?: number;
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveCardGrid({
  children,
  className,
  minCardWidth = 280,
  maxCols = 4,
  gap = 'md',
}: ResponsiveCardGridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minCardWidth}px, 100%), 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

// Responsive section spacing
interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
}

export function ResponsiveSection({
  children,
  className,
  spacing = 'normal',
}: ResponsiveSectionProps) {
  const spacingClasses = {
    tight: 'py-8 sm:py-12',
    normal: 'py-12 sm:py-16 lg:py-20',
    relaxed: 'py-16 sm:py-20 lg:py-24',
    loose: 'py-20 sm:py-24 lg:py-32',
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

// Media query hook
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Responsive breakpoint hook
export function useBreakpoint() {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']}px)`);

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    active: is2Xl ? '2xl' : isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : 'xs',
  };
}