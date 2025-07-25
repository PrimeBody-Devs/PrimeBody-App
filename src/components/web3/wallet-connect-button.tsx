'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Check, Copy, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';

export function WalletConnectButton() {
  const { isConnected, address } = useWeb3();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
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

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  const viewOnExplorer = () => {
    window.open(`https://basescan.org/address/${address}`, '_blank');
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
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                disabled={!connector.ready || isPending}
              >
                <img
                  src={`/wallets/${connector.id}.svg`}
                  alt={connector.name}
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
              <div className="text-sm text-destructive">
                {error.message.includes('User rejected') 
                  ? 'Connection rejected. Please try again.' 
                  : 'Failed to connect. Please try again.'}
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
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
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
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Base</span>
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
