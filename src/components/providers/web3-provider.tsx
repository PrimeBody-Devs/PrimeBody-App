'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { http } from 'viem';
import { base, baseGoerli } from 'viem/chains';
import { createConfig, WagmiProvider as WagmiProviderBase } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Enhanced config with better RPC configuration
const config = createConfig({
  chains: [base, baseGoerli], // Support both mainnet and testnet
  connectors: [
    metaMask(),
    // Only include Coinbase Wallet in production to avoid COOP issues in development
    ...(process.env.NODE_ENV === 'production' ? [
      coinbaseWallet({ 
        appName: 'PrimeBody',
        jsonRpcUrl: 'https://mainnet.base.org',
      })
    ] : []),
    // Only include WalletConnect if project ID is configured
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? [
      walletConnect({ 
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: 'PrimeBody',
          description: 'Transform your body with crypto rewards',
          url: 'https://primebody.app',
          icons: ['https://primebody.app/icon.png'],
        },
      })
    ] : []),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseGoerli.id]: http('https://goerli.base.org'),
  },
  ssr: true,
});

// Simplified Web3 Provider Component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>
        <>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </>
      </WagmiProviderBase>
    </QueryClientProvider>
  );
}
