'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { WalletConnectButton } from '@/components/web3/wallet-connect-button';
import { APP_CONFIG } from '@/lib/constants';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isScrolled?: boolean;
  className?: string;
}

const navigationLinks = [
  { href: '#features', label: 'Características' },
  { href: '#demo', label: 'Demo' },
  { href: '#about', label: 'Acerca de' },
] as const;

export function Header({ isScrolled: propIsScrolled, className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(propIsScrolled || false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (propIsScrolled !== undefined) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propIsScrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-background/60',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            onClick={closeMobileMenu}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Theme Toggle + CTA */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Desktop CTA */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <WalletConnectButton />
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Iniciar prueba
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="px-3 pt-2">
                <Button className="w-full font-medium" onClick={closeMobileMenu}>
                  Comenzar Desafío
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export type { HeaderProps };