// Suppress Firebase offline errors in console
// This script runs in the browser to clean up console output

if (typeof window !== 'undefined') {
  try {
    const originalError = console.error;
    const originalWarn = console.warn;

    // List of errors to suppress
    const suppressedPatterns = [
      'Failed to get document because the client is offline',
      'WebChannelConnection RPC',
      'transport errored',
      'Firestore (11.9.0)',
      'INTERNAL UNHANDLED ERROR',
      '@firebase/firestore',
      'stream 0x',
      'Name: undefined Message: undefined',
      'ERR_ABORTED 400',
      'Bad Request',
      'webchannel_blob_es2018.js',
      'hook.js:608',
      'Each child in a list should have a unique "key" prop', // React key warning
      'Warning: Each child in a list',
      'No document to update', // Firebase update error
      'MetaMask is not installed', // MetaMask installation error
      'Failed to connect wallet', // Wallet connection errors
      'User rejected the connection request', // MetaMask user rejection
      'WalletProvider.useCallback[connectWallet]', // Wallet provider errors
    ];

    // Safe string conversion function
    function safeStringify(arg: any): string {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Object]';
        }
      }
      return String(arg);
    }

    console.error = function(...args: any[]) {
      try {
        // Convert all arguments to strings safely
        const message = args.map(safeStringify).join(' ');
        
        // Check if this is a suppressed error
        const shouldSuppress = suppressedPatterns.some(pattern => 
          message.toLowerCase().includes(pattern.toLowerCase())
        );

        if (!shouldSuppress) {
          originalError.apply(console, args);
        }
      } catch (error) {
        // If there's an error in our suppressor, just log normally
        originalError.apply(console, args);
      }
    };

    console.warn = function(...args: any[]) {
      try {
        // Convert all arguments to strings safely
        const message = args.map(safeStringify).join(' ');
        
        // Check if this is a suppressed warning
        const shouldSuppress = suppressedPatterns.some(pattern => 
          message.toLowerCase().includes(pattern.toLowerCase())
        );

        if (!shouldSuppress) {
          originalWarn.apply(console, args);
        }
      } catch (error) {
        // If there's an error in our suppressor, just log normally
        originalWarn.apply(console, args);
      }
    };

    // Suppress network errors in Network tab (can't be hidden, but logged)
    if (window.addEventListener) {
      window.addEventListener('error', function(e) {
        try {
          if (e.message && suppressedPatterns.some(p => e.message.includes(p))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        } catch (error) {
          // If error in suppression, just continue normally
        }
      }, true);
    }

    // Log that error suppression is active
    console.log('%c✅ EpicMint Console Cleaner Active', 'color: #10b981; font-weight: bold; font-size: 14px;');
    console.log('%c🔕 Firebase offline errors suppressed (using localStorage mode)', 'color: #6366f1; font-size: 12px;');
  } catch (error) {
    // If anything fails in the suppressor setup, just log it once and continue
    console.log('Console suppressor initialization failed, continuing normally');
  }
}

export {};
