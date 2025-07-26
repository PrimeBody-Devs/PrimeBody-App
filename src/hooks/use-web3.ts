import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { 
  getCurrentNetwork, 
  switchToBaseNetwork,
  getNetworkDisplayName 
} from '@/lib/web3-utils';

export function useWallet() {
  const { address, isConnected, status } = useAccount();
  const [currentNetwork, setCurrentNetwork] = useState<'mainnet' | 'testnet' | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check current network
  useEffect(() => {
    const checkNetwork = async () => {
      if (isConnected) {
        const network = await getCurrentNetwork();
        setCurrentNetwork(network);
        setIsCorrectNetwork(network === 'mainnet');
      } else {
        setCurrentNetwork(null);
        setIsCorrectNetwork(false);
      }
    };

    checkNetwork();
  }, [isConnected]);

  // Switch to Base network
  const switchToBase = useCallback(async (): Promise<boolean> => {
    return await switchToBaseNetwork();
  }, []);

  return {
    address,
    isConnected,
    status,
    currentNetwork,
    isCorrectNetwork,
    networkName: currentNetwork ? getNetworkDisplayName(currentNetwork) : null,
    switchToBase,
  };
}

export function useNetworkStatus() {
  const { currentNetwork, isCorrectNetwork, networkName } = useWallet();

  return {
    currentNetwork,
    isCorrectNetwork,
    networkName,
    isBaseMainnet: currentNetwork === 'mainnet',
    isBaseTestnet: currentNetwork === 'testnet',
    isWrongNetwork: currentNetwork && !isCorrectNetwork,
  };
}

export function useWalletConnection() {
  const { address, isConnected, status } = useAccount();
  const { switchToBase } = useWallet();
  const { currentNetwork, isCorrectNetwork } = useWallet();

  const connectStatus = {
    isConnecting: status === 'connecting',
    isConnected,
    isDisconnected: status === 'disconnected',
    isReconnecting: status === 'reconnecting',
  };

  return {
    address,
    isConnected,
    status,
    connectStatus,
    currentNetwork,
    isCorrectNetwork,
    switchToBase,
  };
} 