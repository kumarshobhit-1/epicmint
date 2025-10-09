'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call onError prop if provided
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        onRetry={this.retry}
        level={this.props.level}
        showDetails={this.props.showDetails}
      />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  onRetry: () => void;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
}

function DefaultErrorFallback({
  error,
  errorInfo,
  errorId,
  onRetry,
  level = 'section',
  showDetails = process.env.NODE_ENV === 'development',
}: DefaultErrorFallbackProps) {
  const isPageLevel = level === 'page';
  const isComponentLevel = level === 'component';

  const containerClasses = isPageLevel
    ? 'min-h-screen flex items-center justify-center p-4'
    : isComponentLevel
    ? 'p-4 border border-destructive/20 rounded-lg bg-destructive/5'
    : 'py-12 px-4 text-center';

  const iconSize = isPageLevel ? 'h-16 w-16' : isComponentLevel ? 'h-8 w-8' : 'h-12 w-12';
  const titleSize = isPageLevel ? 'text-2xl' : isComponentLevel ? 'text-lg' : 'text-xl';

  return (
    <div className={containerClasses}>
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <AlertTriangle className={`${iconSize} text-destructive`} />
        </div>
        
        <h2 className={`${titleSize} font-semibold text-foreground mb-2`}>
          {isPageLevel ? 'Something went wrong' : isComponentLevel ? 'Error' : 'Oops! Something went wrong'}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {isPageLevel
            ? 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'
            : isComponentLevel
            ? 'This component failed to load properly.'
            : 'This section failed to load. You can try again or continue browsing.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          {isPageLevel && (
            <>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </>
          )}
          
          {!isPageLevel && !isComponentLevel && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          )}
        </div>

        {showDetails && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error Details (ID: {errorId})
            </summary>
            <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-40">
              <div className="text-destructive font-semibold mb-2">
                {error.name}: {error.message}
              </div>
              {error.stack && (
                <pre className="whitespace-pre-wrap text-muted-foreground">
                  {error.stack}
                </pre>
              )}
              {errorInfo?.componentStack && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-destructive font-semibold mb-1">Component Stack:</div>
                  <pre className="whitespace-pre-wrap text-muted-foreground">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  const handleError = (error: Error) => {
    // In a real app, you might want to log this to an error service
    console.error('Async error caught:', error);
    
    // For now, we'll throw the error to trigger the nearest error boundary
    throw error;
  };

  return handleError;
}

// Specific error boundary for async operations
interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export function AsyncErrorBoundary({ children, fallback, onError }: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      level="component"
      onError={onError}
      fallback={fallback || (
        <div className="p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">Failed to load content</p>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Error boundary for forms
export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      fallback={
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive mb-2" />
          <p className="text-sm text-destructive">
            Form encountered an error. Please refresh and try again.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Error boundary for NFT cards/components
export function NFTErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      fallback={
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load NFT</p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}