'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin-login';

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const session = localStorage.getItem('epicmint_admin_session');
      const timestamp = localStorage.getItem('epicmint_admin_timestamp');
      
      if (session === 'authenticated' && timestamp) {
        // Check if session is still valid (24 hours)
        const sessionTime = parseInt(timestamp);
        const currentTime = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (currentTime - sessionTime < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('epicmint_admin_session');
          localStorage.removeItem('epicmint_admin_timestamp');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('epicmint_admin_session');
    localStorage.removeItem('epicmint_admin_timestamp');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Pass logout function to authenticated admin components
  return (
    <div>
      {/* Admin Header with Logout */}
      <div className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
}