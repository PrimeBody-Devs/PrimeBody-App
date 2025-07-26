'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Check, Copy, ExternalLink, LogOut, Wallet, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { 
  formatAddress, 
  getExplorerUrl, 
  getCurrentNetwork, 
  getNetworkDisplayName,
  switchToBaseNetwork
} from '@/lib/web3-utils';

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<'mainnet' | 'testnet' | null>(null);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const { data: ensName } = useEnsName({ address });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Check current network
  useEffect(() => {
    const checkNetwork = async () => {
      if (isConnected) {
        const network = await getCurrentNetwork();
        setCurrentNetwork(network);
      }
    };
    
    checkNetwork();
  }, [isConnected]);

  const copyToClipboard = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const viewOnExplorer = () => {
    if (!address) return;
    const url = getExplorerUrl('address', address, currentNetwork || 'mainnet');
    window.open(url, '_blank');
  };

  const handleSwitchToBase = async () => {
    setIsSwitchingNetwork(true);
    try {
      const success = await switchToBaseNetwork();
      if (success) {
        setCurrentNetwork('mainnet');
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
    setCurrentNetwork(null);
  };

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      setOpen(false);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  if (!mounted) {
    return (
      <Button disabled variant="outline" className="w-full sm:w-auto">
        <span className="sr-only">Loading wallet...</span>
        <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="w-full justify-start gap-3 py-6 text-base"
                onClick={() => handleConnect(connector as any)}
                disabled={!connector.ready || isPending}
              >
                <Image
                  src={`/wallets/${connector.id}.svg`}
                  alt={connector.name}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/wallets/wallet.svg';
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {connector.name === 'MetaMask' && 'Connect using browser extension'}
                    {connector.name === 'WalletConnect' && 'Scan with WalletConnect'}
                    {connector.name === 'Coinbase Wallet' && 'Connect using Coinbase Wallet'}
                  </div>
                </div>
              </Button>
            ))}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {error.message.includes('User rejected') 
                  ? 'Connection rejected. Please try again.' 
                  : 'Failed to connect. Please try again.'}
              </div>
            )}
            {isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Connecting...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
          {ensName || formatAddress(address!)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Connected with {connectors.find(c => c.id === 'metaMask')?.name || 'Wallet'}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleDisconnect}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-between rounded-md bg-muted p-3">
              <div className="font-mono text-sm">
                {ensName && <div className="font-medium">{ensName}</div>}
                <div className={cn("text-muted-foreground", { 'mt-1': ensName })}>
                  {formatAddress(address!)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy address</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={viewOnExplorer}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on Explorer</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Network</div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  currentNetwork === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
                )} />
                <span>{currentNetwork ? getNetworkDisplayName(currentNetwork) : 'Unknown Network'}</span>
              </div>
              <div className="flex items-center space-x-2">
                {currentNetwork !== 'mainnet' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwitchToBase}
                    disabled={isSwitchingNetwork}
                    className="text-xs"
                  >
                    {isSwitchingNetwork ? (
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    Switch to Base
                  </Button>
                )}
                {currentNetwork === 'mainnet' && (
                  <div className="text-sm text-green-600">Connected</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
