'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Check, Copy, ExternalLink, LogOut, Wallet, AlertTriangle, RefreshCw, Shield, Users, Trophy } from 'lucide-react';
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

  const handleConnect = async (connector: (typeof connectors)[number]) => {
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
          <Button variant="outline" className="w-full sm:w-auto group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <Wallet className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-6 border-b">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  Connect Your Wallet
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  Choose your preferred wallet to start earning PRIME tokens with PrimeBody
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Benefits section */}
            <div className="p-6 bg-muted/30 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium">Earn Rewards</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium">Community</span>
                </div>
              </div>
            </div>

            {/* Wallet options */}
            <div className="p-6 space-y-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-4 py-4 px-4 text-left h-auto border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300",
                    !connector.ready && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleConnect(connector)}
                  disabled={!connector.ready || isPending}
                >
                  <div className="relative">
                    <Image
                      src={`/wallets/${connector.id}.svg`}
                      alt={connector.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/wallets/wallet.svg';
                      }}
                    />
                    {connector.ready ? (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {connector.name}
                      {!connector.ready ? (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">(Not Available)</span>
                      ) : null}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {connector.name === 'MetaMask' && 'Most popular Web3 wallet'}
                      {connector.name === 'WalletConnect' && 'Connect any wallet via QR code'}
                      {connector.name === 'Coinbase Wallet' && 'Simple and secure wallet'}
                    </div>
                  </div>
                  {isPending && connector.id === 'metaMask' && (
                    <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  )}
                </Button>
              ))}

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Connection Failed</div>
                    <div className="text-xs mt-1">
                      {error.message.includes('User rejected') 
                        ? 'You rejected the connection. Please try again.' 
                        : 'Unable to connect. Please check your wallet and try again.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {isPending && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  <div className="text-sm">
                    <div className="font-medium text-primary">Connecting...</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Please approve the connection in your wallet
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-muted/20 border-t">
              <div className="text-center text-xs text-muted-foreground">
                <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {ensName || formatAddress(address!)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-green-500/10 via-primary/10 to-green-500/5 p-6 border-b">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Wallet Connected
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                You&apos;re ready to start earning PRIME tokens with PrimeBody
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Account info */}
          <div className="p-6 space-y-6">
            <div className="rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Connected with {connectors.find(c => c.id === 'metaMask')?.name || 'Wallet'}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={handleDisconnect}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-background p-4 border">
                <div className="font-mono text-sm">
                  {ensName && (
                    <div className="font-semibold text-foreground mb-1">{ensName}</div>
                  )}
                  <div className={cn("text-muted-foreground", { 'mt-1': ensName })}>
                    {formatAddress(address!)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-green-100 dark:hover:bg-green-900/20"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy address</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    onClick={viewOnExplorer}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View on Explorer</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Network status */}
            <div className="space-y-3">
              <div className="text-sm font-semibold">Network Status</div>
              <div className={cn(
                "flex items-center justify-between rounded-lg border-2 p-4 transition-all duration-300",
                currentNetwork === 'mainnet' 
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" 
                  : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
              )}>
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "h-3 w-3 rounded-full animate-pulse",
                    currentNetwork === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
                  )} />
                  <div>
                    <div className="font-medium">
                      {currentNetwork ? getNetworkDisplayName(currentNetwork) : 'Unknown Network'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentNetwork === 'mainnet' ? 'Ready to earn PRIME tokens' : 'Switch to Base for full functionality'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentNetwork !== 'mainnet' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwitchToBase}
                      disabled={isSwitchingNetwork}
                      className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/20"
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
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      Connected
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-3">
              <div className="text-sm font-semibold">Quick Actions</div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs">View Rewards</span>
                </Button>
                <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Community</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
