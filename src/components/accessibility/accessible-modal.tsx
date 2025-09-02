'use client';

import { ReactNode, useEffect, useRef, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { focusManagement, keyboardNavigation, ariaLabels } from '@/lib/accessibility';
import { IconButton } from '@/components/ui/responsive-button';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Set up focus trap
      const cleanup = modalRef.current ? focusManagement.trapFocus(modalRef.current) : undefined;
      
      return () => {
        cleanup?.();
        document.body.style.overflow = '';
        
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape) {
        keyboardNavigation.handleEscape(event, onClose);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-background border border-border rounded-lg shadow-xl',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 pr-4">
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          
          <IconButton
            onClick={onClose}
            aria-label={ariaLabels.closeMenu}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal in portal
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

// Accessible modal trigger button
interface ModalTriggerProps {
  children: ReactNode;
  modalTitle: string;
  modalContent: ReactNode;
  modalDescription?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function ModalTrigger({
  children,
  modalTitle,
  modalContent,
  modalDescription,
  buttonProps,
}: ModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        {...buttonProps}
      >
        {children}
      </button>
      
      <AccessibleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        description={modalDescription}
      >
        {modalContent}
      </AccessibleModal>
    </>
  );
}