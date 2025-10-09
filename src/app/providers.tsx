'use client';

import { WalletProvider } from '@/contexts/wallet-context';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Import console suppressor on client side
    import('@/lib/console-suppressor');
  }, []);

  return <WalletProvider>{children}</WalletProvider>;
}
