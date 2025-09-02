import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../modal';

// Mock Radix UI Dialog components
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange }: any) => (
    <div data-testid="modal-root" data-open={open} onClick={() => onOpenChange?.(false)}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="modal-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: any) => <div data-testid="modal-portal">{children}</div>,
  Overlay: React.forwardRef(({ children, className, ...props }: any, ref) => (
    <div ref={ref} data-testid="modal-overlay" className={className} {...props}>
      {children}
    </div>
  )),
  Content: React.forwardRef(({ children, className, ...props }: any, ref) => (
    <div ref={ref} data-testid="modal-content" className={className} {...props}>
      {children}
    </div>
  )),
  Close: ({ children, className, ...props }: any) => (
    <button data-testid="modal-close" className={className} {...props}>
      {children}
    </button>
  ),
  Title: React.forwardRef(({ children, className, ...props }: any, ref) => (
    <h2 ref={ref} data-testid="modal-title" className={className} {...props}>
      {children}
    </h2>
  )),
  Description: React.forwardRef(({ children, className, ...props }: any, ref) => (
    <p ref={ref} data-testid="modal-description" className={className} {...props}>
      {children}
    </p>
  )),
}));

describe('Modal Components', () => {
  describe('Modal Root', () => {
    it('renders correctly', () => {
      render(
        <Modal>
          <ModalTrigger>Open Modal</ModalTrigger>
        </Modal>
      );
      
      expect(screen.getByTestId('modal-root')).toBeInTheDocument();
      expect(screen.getByTestId('modal-trigger')).toBeInTheDocument();
    });
  });

  describe('ModalTrigger', () => {
    it('renders trigger button correctly', () => {
      render(
        <Modal>
          <ModalTrigger>Open Modal</ModalTrigger>
        </Modal>
      );
      
      const trigger = screen.getByTestId('modal-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Open Modal');
    });
  });

  describe('ModalContent', () => {
    it('renders with default size', () => {
      render(
        <Modal open>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      );
      
      const content = screen.getByTestId('modal-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('max-w-md'); // default size
    });

    it('renders with different sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'] as const;
      
      sizes.forEach((size) => {
        const { unmount } = render(
          <Modal open>
            <ModalContent size={size}>
              <div>Content</div>
            </ModalContent>
          </Modal>
        );
        
        const content = screen.getByTestId('modal-content');
        
        switch (size) {
          case 'sm':
            expect(content).toHaveClass('max-w-sm');
            break;
          case 'md':
            expect(content).toHaveClass('max-w-md');
            break;
          case 'lg':
            expect(content).toHaveClass('max-w-lg');
            break;
          case 'xl':
            expect(content).toHaveClass('max-w-xl');
            break;
          case '2xl':
            expect(content).toHaveClass('max-w-2xl');
            break;
          case '3xl':
            expect(content).toHaveClass('max-w-3xl');
            break;
          case '4xl':
            expect(content).toHaveClass('max-w-4xl');
            break;
          case 'full':
            expect(content).toHaveClass('max-w-[95vw]', 'max-h-[95vh]');
            break;
        }
        
        unmount();
      });
    });

    it('applies custom className', () => {
      render(
        <Modal open>
          <ModalContent className="custom-modal">
            <div>Content</div>
          </ModalContent>
        </Modal>
      );
      
      const content = screen.getByTestId('modal-content');
      expect(content).toHaveClass('custom-modal');
    });

    it('includes close button', () => {
      render(
        <Modal open>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      );
      
      const closeButton = screen.getByTestId('modal-close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('absolute', 'right-4', 'top-4');
    });

    it('has proper animation classes', () => {
      render(
        <Modal open>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      );
      
      const content = screen.getByTestId('modal-content');
      expect(content).toHaveClass(
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0',
        'data-[state=closed]:fade-out-0'
      );
    });
  });

  describe('ModalHeader', () => {
    it('renders correctly', () => {
      render(
        <ModalHeader data-testid="modal-header">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
        </ModalHeader>
      );
      
      const header = screen.getByTestId('modal-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
    });

    it('applies custom className', () => {
      render(
        <ModalHeader className="custom-header" data-testid="modal-header">
          Header Content
        </ModalHeader>
      );
      
      const header = screen.getByTestId('modal-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('ModalTitle', () => {
    it('renders correctly', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalTitle>Test Modal Title</ModalTitle>
          </ModalContent>
        </Modal>
      );
      
      const title = screen.getByTestId('modal-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Modal Title');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('applies custom className', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalTitle className="custom-title">Title</ModalTitle>
          </ModalContent>
        </Modal>
      );
      
      const title = screen.getByTestId('modal-title');
      expect(title).toHaveClass('custom-title');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(
        <Modal open>
          <ModalContent>
            <ModalTitle ref={ref}>Title</ModalTitle>
          </ModalContent>
        </Modal>
      );
      
      expect(ref.current).toBeTruthy();
    });
  });

  describe('ModalDescription', () => {
    it('renders correctly', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalDescription>Test modal description</ModalDescription>
          </ModalContent>
        </Modal>
      );
      
      const description = screen.getByTestId('modal-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Test modal description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('applies custom className', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalDescription className="custom-description">Description</ModalDescription>
          </ModalContent>
        </Modal>
      );
      
      const description = screen.getByTestId('modal-description');
      expect(description).toHaveClass('custom-description');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(
        <Modal open>
          <ModalContent>
            <ModalDescription ref={ref}>Description</ModalDescription>
          </ModalContent>
        </Modal>
      );
      
      expect(ref.current).toBeTruthy();
    });
  });

  describe('ModalFooter', () => {
    it('renders correctly', () => {
      render(
        <ModalFooter data-testid="modal-footer">
          <button>Cancel</button>
          <button>Confirm</button>
        </ModalFooter>
      );
      
      const footer = screen.getByTestId('modal-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      );
    });

    it('applies custom className', () => {
      render(
        <ModalFooter className="custom-footer" data-testid="modal-footer">
          Footer Content
        </ModalFooter>
      );
      
      const footer = screen.getByTestId('modal-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('ModalClose', () => {
    it('renders close button correctly', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalClose>Close</ModalClose>
          </ModalContent>
        </Modal>
      );
      
      const closeButton = screen.getByTestId('modal-close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('Close');
    });
  });

  describe('Complete Modal Structure', () => {
    it('renders a complete modal with all components', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Complete Modal</ModalTitle>
              <ModalDescription>This is a complete modal example</ModalDescription>
            </ModalHeader>
            <div>Modal body content</div>
            <ModalFooter>
              <ModalClose>Cancel</ModalClose>
              <button>Confirm</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByText('Complete Modal')).toBeInTheDocument();
      expect(screen.getByText('This is a complete modal example')).toBeInTheDocument();
      expect(screen.getByText('Modal body content')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalTitle>Accessible Modal</ModalTitle>
            <ModalDescription>Modal description for screen readers</ModalDescription>
          </ModalContent>
        </Modal>
      );

      const title = screen.getByTestId('modal-title');
      const description = screen.getByTestId('modal-description');
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('close button has screen reader text', () => {
      render(
        <Modal open>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      );
      
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });
});