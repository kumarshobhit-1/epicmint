// lib/error-handler.ts
'use client';

import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'PERMISSION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'FIREBASE_ERROR'
  | 'WALLET_ERROR'
  | 'CONTRACT_ERROR';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
  timestamp: Date;
  userAction?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Log error for debugging
  private logError(error: ErrorInfo) {
    this.errorLog.push(error);
    console.error('[ErrorHandler]', error);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  // Get user-friendly message based on error type
  private getUserFriendlyMessage(type: ErrorType, originalMessage?: string): string {
    const messages: Record<ErrorType, string> = {
      NETWORK_ERROR: 'चेक करें कि आपका इंटरनेट कनेक्शन ठीक है। Please check your internet connection.',
      AUTHENTICATION_ERROR: 'कृपया फिर से लॉगिन करें। Please log in again.',
      VALIDATION_ERROR: 'कृपया सभी फील्ड सही तरीके से भरें। Please fill all fields correctly.',
      PERMISSION_ERROR: 'आपको इस एक्शन की अनुमति नहीं है। You don\'t have permission for this action.',
      NOT_FOUND_ERROR: 'यह आइटम नहीं मिला। The requested item was not found.',
      SERVER_ERROR: 'सर्वर में कोई समस्या है। कृपया बाद में कोशिश करें। Server error, please try again later.',
      FIREBASE_ERROR: 'डेटाबेस कनेक्शन में समस्या है। Database connection issue.',
      WALLET_ERROR: 'वॉलेट कनेक्ट करने में समस्या है। Wallet connection problem.',
      CONTRACT_ERROR: 'स्मार्ट कॉन्ट्रैक्ट में समस्या है। Smart contract error.',
      UNKNOWN_ERROR: 'कुछ गलत हो गया है। कृपया पुनः प्रयास करें। Something went wrong, please try again.'
    };

    return originalMessage || messages[type];
  }

  // Handle different types of errors
  handleError(error: any, userAction?: string): void {
    let errorInfo: ErrorInfo;

    if (error.code) {
      // Firebase errors
      errorInfo = this.handleFirebaseError(error, userAction);
    } else if (error.message?.includes('fetch')) {
      // Network errors
      errorInfo = {
        type: 'NETWORK_ERROR',
        message: this.getUserFriendlyMessage('NETWORK_ERROR'),
        details: error.message,
        timestamp: new Date(),
        userAction
      };
    } else if (error.message?.includes('unauthorized') || error.message?.includes('permission')) {
      // Permission errors
      errorInfo = {
        type: 'PERMISSION_ERROR',
        message: this.getUserFriendlyMessage('PERMISSION_ERROR'),
        details: error.message,
        timestamp: new Date(),
        userAction
      };
    } else {
      // Unknown errors
      errorInfo = {
        type: 'UNKNOWN_ERROR',
        message: this.getUserFriendlyMessage('UNKNOWN_ERROR'),
        details: error.message || 'Unknown error occurred',
        timestamp: new Date(),
        userAction
      };
    }

    this.logError(errorInfo);
    this.showErrorToast(errorInfo);
  }

  // Handle Firebase-specific errors
  private handleFirebaseError(error: any, userAction?: string): ErrorInfo {
    const firebaseErrors: Record<string, ErrorType> = {
      'auth/user-not-found': 'AUTHENTICATION_ERROR',
      'auth/wrong-password': 'AUTHENTICATION_ERROR',
      'auth/invalid-email': 'VALIDATION_ERROR',
      'auth/weak-password': 'VALIDATION_ERROR',
      'auth/email-already-in-use': 'VALIDATION_ERROR',
      'permission-denied': 'PERMISSION_ERROR',
      'not-found': 'NOT_FOUND_ERROR',
      'unavailable': 'NETWORK_ERROR',
      'deadline-exceeded': 'NETWORK_ERROR',
    };

    const errorType = firebaseErrors[error.code] || 'FIREBASE_ERROR';
    const customMessages: Record<string, string> = {
      'auth/user-not-found': 'यह ईमेल रजिस्टर्ड नहीं है। This email is not registered.',
      'auth/wrong-password': 'गलत पासवर्ड। Wrong password.',
      'auth/invalid-email': 'गलत ईमेल फॉर्मेट। Invalid email format.',
      'auth/weak-password': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए। Password should be at least 6 characters.',
      'auth/email-already-in-use': 'यह ईमेल पहले से रजिस्टर्ड है। This email is already registered.',
      'permission-denied': 'आपको इस डेटा तक पहुंचने की अनुमति नहीं है। You don\'t have permission to access this data.',
    };

    return {
      type: errorType,
      message: customMessages[error.code] || this.getUserFriendlyMessage(errorType),
      details: error.message,
      code: error.code,
      timestamp: new Date(),
      userAction
    };
  }

  // Show error toast with proper styling
  private showErrorToast(errorInfo: ErrorInfo) {
    toast({
      title: "Error",
      description: errorInfo.message,
      variant: "destructive",
    });
  }

  // Success toast
  success(message: string, description?: string) {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }

  // Warning toast
  warning(message: string, description?: string) {
    toast({
      title: "Warning",
      description: message,
      variant: "destructive",
    });
  }

  // Info toast
  info(message: string, description?: string) {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  }

  // Loading toast - simplified version
  loading(message: string, description?: string) {
    toast({
      title: "Loading",
      description: message,
      variant: "default",
    });
    return { dismiss: () => {} }; // Return object with dismiss method
  }

  // Get appropriate icon for toast type
  private getToastIcon(type: ErrorType) {
    const icons = {
      NETWORK_ERROR: '🌐',
      AUTHENTICATION_ERROR: '🔐',
      VALIDATION_ERROR: '📝',
      PERMISSION_ERROR: '🚫',
      NOT_FOUND_ERROR: '🔍',
      SERVER_ERROR: '🔧',
      FIREBASE_ERROR: '🔥',
      WALLET_ERROR: '👛',
      CONTRACT_ERROR: '📄',
      UNKNOWN_ERROR: '❌'
    };
    return icons[type] || '❌';
  }

  // Get error logs for debugging
  getErrorLogs(): ErrorInfo[] {
    return this.errorLog;
  }

  // Clear error logs
  clearErrorLogs(): void {
    this.errorLog = [];
  }
}

// Create singleton instance
const errorHandler = ErrorHandler.getInstance();

// Export commonly used methods
export const handleError = (error: any, userAction?: string) => 
  errorHandler.handleError(error, userAction);

export const showSuccess = (message: string, description?: string) => 
  errorHandler.success(message, description);

export const showWarning = (message: string, description?: string) => 
  errorHandler.warning(message, description);

export const showInfo = (message: string, description?: string) => 
  errorHandler.info(message, description);

export const showLoading = (message: string, description?: string) => 
  errorHandler.loading(message, description);

export { errorHandler };
export default ErrorHandler;