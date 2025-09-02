'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/responsive-button';
import { touchTargets, visibility } from '@/lib/responsive';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface ResponsiveNavProps {
  items: NavItem[];
  className?: string;
}

export function ResponsiveNav({ items, className }: ResponsiveNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-mobile-nav]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className={cn('relative', className)} data-mobile-nav>
      {/* Desktop Navigation */}
      <div className={cn(visibility.hideDesktop, 'hidden md:flex items-center space-x-1 lg:space-x-2')}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={cn(
              touchTargets.link,
              'px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-primary/5 transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className={cn(visibility.showDesktop, 'md:hidden')}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          className={cn(
            'relative z-50',
            isOpen && 'bg-primary/10'
          )}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={cn(
            visibility.showDesktop,
            'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm',
            'md:hidden'
          )}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          visibility.showDesktop,
          'fixed top-0 right-0 z-40 h-full w-64 bg-background border-l border-border shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          'md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4">
          {/* Mobile Navigation Items */}
          <div className="flex-1 space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  touchTargets.link,
                  'block px-4 py-3 rounded-lg text-base font-medium',
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-primary/5 transition-all duration-200',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              PrimeBody © 2024
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation items for PrimeBody
export const navigationItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Desafíos', href: '/challenges' },
  { label: 'Comunidad', href: '/community' },
  { label: 'Recompensas', href: '/rewards' },
  { label: 'Acerca de', href: '/about' },
];