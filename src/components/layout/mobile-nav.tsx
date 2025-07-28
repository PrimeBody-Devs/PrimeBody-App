'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-nav-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="h-10 w-10"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container flex h-full flex-col items-center justify-center space-y-8 text-center">
            <nav className="flex flex-col items-center space-y-6 text-xl">
              <Link 
                href="/" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/desafios" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Desafíos
              </Link>
              <Link 
                href="/comunidad" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comunidad
              </Link>
              <Link 
                href="/precios" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Precios
              </Link>
            </nav>
            
            <div className="pt-8 border-t border-border w-full max-w-xs">
              <Button className="w-full" size="lg" onClick={() => setIsOpen(false)}>
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
