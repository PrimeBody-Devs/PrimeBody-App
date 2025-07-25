'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Address, createWalletClient, custom, http, WalletClient } from 'viem';
import { base } from 'viem/chains';
import { createConfig, WagmiProvider as WagmiProviderBase } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { OnchainKitProvider } from '@coinbase/onchainkit';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Web3ContextType = {
  address?: Address;
  isConnected: boolean;
  walletClient?: WalletClient;
  chainId?: number;
  error?: Error;
};

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
});

export function useWeb3() {
  return useContext(Web3Context);
}

const config = createConfig({
  chains: [base],
  connectors: [
    new MetaMaskConnector({
      chains: [base],
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains: [base],
      options: {
        appName: 'FitCast',
      },
    }),
    new WalletConnectConnector({
      chains: [base],
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        showQrModal: true,
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<Web3ContextType>({
    isConnected: false,
  });

  useEffect(() => {
    setMounted(true);
    
    // Check for wallet connection on mount
    const checkConnection = async () => {
      try {
        const [account] = await window.ethereum?.request({ method: 'eth_accounts' }) || [];
        if (account) {
          const walletClient = createWalletClient({
            chain: base,
            transport: custom(window.ethereum!)
          });
          
          setState({
            address: account as Address,
            isConnected: true,
            walletClient,
            chainId: base.id,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      checkConnection();
      
      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setState({ isConnected: false });
        } else {
          setState(prev => ({
            ...prev,
            address: accounts[0] as Address,
            isConnected: true,
          }));
        }
      };

      // Listen for chain changes
      const handleChainChanged = (chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>
        <OnchainKitProvider
          appName="FitCast"
          appLogo="https://your-app-logo.vercel.app/logo.png"
          theme="light"
          chain={base}
        >
          <Web3Context.Provider value={state}>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            )}
          </Web3Context.Provider>
        </OnchainKitProvider>
      </WagmiProviderBase>
    </QueryClientProvider>
  );
}
