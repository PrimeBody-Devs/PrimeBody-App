import { Address, getAddress, isAddress, parseEther, formatEther } from 'viem';
import { base, baseGoerli } from 'viem/chains';

// Base network configuration
export const BASE_NETWORKS = {
  mainnet: base,
  testnet: baseGoerli,
} as const;

export const BASE_RPC_URLS = {
  mainnet: 'https://mainnet.base.org',
  testnet: 'https://goerli.base.org',
} as const;

export const BASE_EXPLORER_URLS = {
  mainnet: 'https://basescan.org',
  testnet: 'https://goerli.basescan.org',
} as const;

// Enhanced address formatting
export const formatAddress = (address?: Address, length: number = 6): string => {
  if (!address) return '';
  try {
    const validatedAddress = getAddress(address);
    return `${validatedAddress.slice(0, length + 2)}...${validatedAddress.slice(-length)}`;
  } catch {
    return 'Invalid Address';
  }
};

// Enhanced balance formatting with proper decimal handling
export const formatBalance = (balance: bigint, decimals = 18, precision = 4): string => {
  try {
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = balance / divisor;
    const fraction = (balance % divisor).toString().padStart(decimals, '0').slice(0, precision);
    
    // Remove trailing zeros
    const cleanFraction = fraction.replace(/0+$/, '');
    
    if (cleanFraction === '') {
      return whole.toString();
    }
    
    return `${whole}.${cleanFraction}`;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
};

// Enhanced transaction hash formatting
export const shortenTransactionHash = (hash: string, length: number = 6): string => {
  if (!hash || hash.length < length * 2 + 2) return hash;
  return `${hash.substring(0, length + 2)}...${hash.substring(hash.length - length)}`;
};

// Enhanced address equality check
export const isAddressEqual = (a?: Address, b?: Address): boolean => {
  if (!a || !b) return false;
  try {
    return getAddress(a) === getAddress(b);
  } catch {
    return false;
  }
};

// Validate if address is valid
export const isValidAddress = (address: string): boolean => {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
};

// Enhanced Base network switching with better error handling
export const switchToBaseNetwork = async (network: 'mainnet' | 'testnet' = 'mainnet'): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('No Ethereum provider found');
    return false;
  }
  
  const targetChain = BASE_NETWORKS[network];
  const chainId = `0x${targetChain.id.toString(16)}`;
  
  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (error: unknown) {
    // Check if the error is due to the chain not being added
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      try {
        // Add the network to the wallet
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: targetChain.name,
              nativeCurrency: targetChain.nativeCurrency,
              rpcUrls: [BASE_RPC_URLS[network]],
              blockExplorerUrls: [BASE_EXPLORER_URLS[network]],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error(`Error adding ${network} network:`, addError);
        return false;
      }
    }
    
    console.error(`Error switching to ${network} network:`, error);
    return false;
  }
};

// Get current network
export const getCurrentNetwork = async (): Promise<'mainnet' | 'testnet' | null> => {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const chainIdNumber = parseInt(chainId, 16);
    
    if (chainIdNumber === base.id) return 'mainnet';
    if (chainIdNumber === baseGoerli.id) return 'testnet';
    
    return null;
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
};

// Enhanced ETH formatting utilities
export const parseEth = (value: string): bigint => {
  try {
    return parseEther(value);
  } catch (error) {
    console.error('Error parsing ETH:', error);
    return BigInt(0);
  }
};

export const formatEth = (value: bigint): string => {
  try {
    return formatEther(value);
  } catch (error) {
    console.error('Error formatting ETH:', error);
    return '0';
  }
};

// Get explorer URL for address or transaction
export const getExplorerUrl = (
  type: 'address' | 'tx',
  value: string,
  network: 'mainnet' | 'testnet' = 'mainnet'
): string => {
  const baseUrl = BASE_EXPLORER_URLS[network];
  return `${baseUrl}/${type}/${value}`;
};

// Validate transaction hash
export const isValidTransactionHash = (hash: string): boolean => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

// Get network display name
export const getNetworkDisplayName = (network: 'mainnet' | 'testnet'): string => {
  return network === 'mainnet' ? 'Base' : 'Base Goerli';
};

// Check if user is on correct network
export const isOnCorrectNetwork = async (targetNetwork: 'mainnet' | 'testnet' = 'mainnet'): Promise<boolean> => {
  const currentNetwork = await getCurrentNetwork();
  return currentNetwork === targetNetwork;
};
