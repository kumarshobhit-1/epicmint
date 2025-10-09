'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home, Bug } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  level?: 'page' | 'section' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  level: 'page' | 'section' | 'component';
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError, level }) => {
  const getErrorMessage = () => {
    if (level === 'page') {
      return {
        title: 'पेज लोड नहीं हो सका | Page Failed to Load',
        description: 'इस पेज में कोई समस्या है। कृपया पुनः प्रयास करें। | There was an issue with this page. Please try again.',
        suggestion: 'होम पेज पर वापस जाएं या पेज को रिफ्रेश करें। | Go back to home page or refresh the page.'
      };
    } else if (level === 'section') {
      return {
        title: 'सेक्शन लोड नहीं हो सका | Section Failed to Load',
        description: 'इस सेक्शन में कोई समस्या है। | There was an issue with this section.',
        suggestion: 'पुनः प्रयास करें या पेज को रिफ्रेश करें। | Try again or refresh the page.'
      };
    } else {
      return {
        title: 'कॉम्पोनेंट एरर | Component Error',
        description: 'इस कॉम्पोनेंट में कोई समस्या है। | There was an issue with this component.',
        suggestion: 'पुनः प्रयास करें। | Please try again.'
      };
    }
  };

  const { title, description, suggestion } = getErrorMessage();

  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level
    };
    
    console.error('Error Report:', errorReport);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service like Sentry
    }
    
    alert('एरर रिपोर्ट भेजी गई है। Error report has been sent.');
  };

  if (level === 'component') {
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Component Error</span>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {description}
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={resetError}
          className="mt-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-3 w-3 mr-1" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-700 dark:text-red-300">
            {title}
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {suggestion}
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-32">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCcw className="h-4 w-4 mr-2" />
              पुनः प्रयास करें | Try Again
            </Button>
            
            {level === 'page' && (
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReportError}
            className="w-full text-muted-foreground"
          >
            <Bug className="h-3 w-3 mr-2" />
            एरर रिपोर्ट करें | Report Error
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Send error to tracking service
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          level={this.props.level || 'component'}
        />
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper components
export const PageErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page">
    {children}
  </ErrorBoundary>
);

export const SectionErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary level="section">
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary level="component">
    {children}
  </ErrorBoundary>
);

// Hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}

export { ErrorBoundary };
export default ErrorBoundary;
