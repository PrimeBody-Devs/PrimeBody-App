import { Address } from 'viem';

export const formatAddress = (address?: Address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: bigint, decimals = 18, precision = 4) => {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = balance / divisor;
  const fraction = (balance % divisor).toString().padStart(decimals, '0').slice(0, precision);
  return `${whole}${fraction === '0'.repeat(precision) ? '' : `.${fraction}`}`;
};

export const shortenTransactionHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

export const isAddressEqual = (a?: Address, b?: Address) => {
  return a && b ? a.toLowerCase() === b.toLowerCase() : false;
};

export const switchToBaseNetwork = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }], // Base Mainnet
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org/'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Base network:', addError);
        return false;
      }
    }
    console.error('Error switching to Base network:', error);
    return false;
  }
};
