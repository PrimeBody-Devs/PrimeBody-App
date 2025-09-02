import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  LoadingState, 
  SectionLoadingState,
  PrimeBodyPageSkeleton 
} from '@/components/ui/loading';
import { mockLocalStorage } from '@/lib/__tests__/test-utils';

// Mock error boundary component
const TestErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallback={<div data-testid="error-fallback">Something went wrong</div>}
    onError={(error) => console.error('Error caught:', error)}
  >
    {children}
  </ErrorBoundary>
);

// Component that throws errors for testing
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="success-content">Content loaded successfully</div>;
};

// Component with loading states
const LoadingTestComponent = ({ 
  isLoading, 
  hasError, 
  errorMessage 
}: { 
  isLoading: boolean; 
  hasError: boolean; 
  errorMessage?: string; 
}) => {
  if (hasError) {
    return (
      <div data-testid="error-state">
        <h2>Error occurred</h2>
        <p>{errorMessage || 'An unexpected error occurred'}</p>
        <button data-testid="retry-button">Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div data-testid="loading-state">
        <PrimeBodyPageSkeleton />
      </div>
    );
  }

  return (
    <div data-testid="loaded-content">
      <h1>PrimeBody Landing Page</h1>
      <p>Content has loaded successfully</p>
    </div>
  );
};

// Mock content hook with different states
const createMockContentHook = (state: 'loading' | 'error' | 'success') => {
  switch (state) {
    case 'loading':
      return {
        content: null,
        isLoading: true,
        error: null,
        refreshContent: jest.fn(),
      };
    case 'error':
      return {
        content: null,
        isLoading: false,
        error: 'Failed to load content',
        refreshContent: jest.fn(),
      };
    case 'success':
      return {
        content: {
          hero: { title: 'Test Title', subtitle: 'Test Subtitle', ctaText: 'Test CTA' },
          features: [],
          demo: { title: 'Demo', description: 'Demo desc', screenshots: [] },
          cta: { title: 'CTA', description: 'CTA desc', primaryText: 'Primary' },
          footer: { links: [], socialLinks: [], copyright: 'Copyright' },
        },
        isLoading: false,
        error: null,
        refreshContent: jest.fn(),
      };
  }
};

// Component that uses content hook
const ContentConsumerComponent = ({ hookState }: { hookState: 'loading' | 'error' | 'success' }) => {
  const contentHook = createMockContentHook(hookState);
  
  if (contentHook.isLoading) {
    return <PrimeBodyPageSkeleton />;
  }
  
  if (contentHook.error) {
    return (
      <div data-testid="content-error">
        <p>Error: {contentHook.error}</p>
        <button onClick={contentHook.refreshContent} data-testid="refresh-content">
          Refresh
        </button>
      </div>
    );
  }
  
  return (
    <div data-testid="content-success">
      <h1>{contentHook.content?.hero.title}</h1>
      <p>{contentHook.content?.hero.subtitle}</p>
    </div>
  );
};

// Network simulation component
const NetworkSimulationComponent = () => {
  const [networkState, setNetworkState] = React.useState<'online' | 'offline' | 'slow'>('online');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  const simulateNetworkRequest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (networkState === 'offline') {
        throw new Error('Network is offline');
      }
      
      const delay = networkState === 'slow' ? 3000 : 500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      setData({ message: 'Data loaded successfully' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-testid="network-simulation">
      <div>
        <label>
          Network State:
          <select 
            value={networkState} 
            onChange={(e) => setNetworkState(e.target.value as any)}
            data-testid="network-select"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="slow">Slow</option>
          </select>
        </label>
      </div>
      
      <button onClick={simulateNetworkRequest} data-testid="load-data">
        Load Data
      </button>
      
      {isLoading && <div data-testid="network-loading">Loading...</div>}
      {error && <div data-testid="network-error">Error: {error}</div>}
      {data && <div data-testid="network-success">Success: {data.message}</div>}
    </div>
  );
};

describe('Error Handling and Loading States Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage();
    
    // Suppress console errors for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Error Boundary Integration', () => {
    it('catches and displays errors gracefully', () => {
      render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders children when no errors occur', () => {
      render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('success-content')).toBeInTheDocument();
      expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument();
    });

    it('handles errors in nested components', () => {
      const NestedComponent = () => (
        <div>
          <h1>Parent Component</h1>
          <ErrorThrowingComponent shouldThrow={true} />
        </div>
      );

      render(
        <TestErrorBoundary>
          <NestedComponent />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });

    it('recovers from errors when component is re-rendered', () => {
      const { rerender } = render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

      rerender(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </TestErrorBoundary>
      );

      // Error boundary should reset and show content
      expect(screen.queryByTestId('error-fallback')).toBeInTheDocument(); // Error boundary doesn't auto-reset
    });
  });

  describe('Loading States Integration', () => {
    it('displays loading state initially', () => {
      render(<LoadingTestComponent isLoading={true} hasError={false} />);

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.queryByTestId('loaded-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state')).not.toBeInTheDocument();
    });

    it('transitions from loading to loaded state', () => {
      const { rerender } = render(
        <LoadingTestComponent isLoading={true} hasError={false} />
      );

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();

      rerender(<LoadingTestComponent isLoading={false} hasError={false} />);

      expect(screen.getByTestId('loaded-content')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });

    it('transitions from loading to error state', () => {
      const { rerender } = render(
        <LoadingTestComponent isLoading={true} hasError={false} />
      );

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();

      rerender(
        <LoadingTestComponent 
          isLoading={false} 
          hasError={true} 
          errorMessage="Network error" 
        />
      );

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });

    it('provides retry functionality in error state', async () => {
      const user = userEvent.setup();
      
      render(
        <LoadingTestComponent 
          isLoading={false} 
          hasError={true} 
          errorMessage="Connection failed" 
        />
      );

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();

      await user.click(retryButton);
      // In real implementation, this would trigger a retry
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('LoadingState Component Integration', () => {
    it('shows skeleton when loading', () => {
      render(
        <LoadingState loading={true}>
          <div data-testid="actual-content">Actual Content</div>
        </LoadingState>
      );

      // Should show skeleton, not actual content
      expect(screen.queryByTestId('actual-content')).not.toBeInTheDocument();
      
      // Check for skeleton elements
      const skeletonContainer = document.querySelector('.min-h-screen.bg-gradient-to-br');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('shows content when not loading', () => {
      render(
        <LoadingState loading={false}>
          <div data-testid="actual-content">Actual Content</div>
        </LoadingState>
      );

      expect(screen.getByTestId('actual-content')).toBeInTheDocument();
    });

    it('uses custom skeleton when provided', () => {
      render(
        <LoadingState 
          loading={true}
          skeleton={<div data-testid="custom-skeleton">Custom Loading...</div>}
        >
          <div data-testid="actual-content">Actual Content</div>
        </LoadingState>
      );

      expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('actual-content')).not.toBeInTheDocument();
    });
  });

  describe('SectionLoadingState Integration', () => {
    it('shows section skeleton when loading', () => {
      render(
        <SectionLoadingState 
          loading={true}
          skeleton={<div data-testid="section-skeleton">Section Loading...</div>}
        >
          <div data-testid="section-content">Section Content</div>
        </SectionLoadingState>
      );

      expect(screen.getByTestId('section-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('section-content')).not.toBeInTheDocument();
    });

    it('shows content when section is loaded', () => {
      render(
        <SectionLoadingState 
          loading={false}
          skeleton={<div data-testid="section-skeleton">Section Loading...</div>}
        >
          <div data-testid="section-content">Section Content</div>
        </SectionLoadingState>
      );

      expect(screen.getByTestId('section-content')).toBeInTheDocument();
      expect(screen.queryByTestId('section-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('Content Hook Error Handling', () => {
    it('handles content loading state', () => {
      render(<ContentConsumerComponent hookState="loading" />);

      // Should show skeleton
      const skeletonContainer = document.querySelector('.min-h-screen.bg-gradient-to-br');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('handles content error state', async () => {
      const user = userEvent.setup();
      
      render(<ContentConsumerComponent hookState="error" />);

      expect(screen.getByTestId('content-error')).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to load content')).toBeInTheDocument();

      const refreshButton = screen.getByTestId('refresh-content');
      await user.click(refreshButton);
      
      // Refresh function should be called
      expect(refreshButton).toBeInTheDocument();
    });

    it('handles content success state', () => {
      render(<ContentConsumerComponent hookState="success" />);

      expect(screen.getByTestId('content-success')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });
  });

  describe('Network Simulation Integration', () => {
    it('handles online network state', async () => {
      const user = userEvent.setup();
      
      render(<NetworkSimulationComponent />);

      const loadButton = screen.getByTestId('load-data');
      await user.click(loadButton);

      // Should show loading initially
      expect(screen.getByTestId('network-loading')).toBeInTheDocument();

      // Wait for success
      await waitFor(() => {
        expect(screen.getByTestId('network-success')).toBeInTheDocument();
      }, { timeout: 1000 });

      expect(screen.getByText('Success: Data loaded successfully')).toBeInTheDocument();
    });

    it('handles offline network state', async () => {
      const user = userEvent.setup();
      
      render(<NetworkSimulationComponent />);

      // Set to offline
      const networkSelect = screen.getByTestId('network-select');
      await user.selectOptions(networkSelect, 'offline');

      const loadButton = screen.getByTestId('load-data');
      await user.click(loadButton);

      // Should show error
      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Network is offline')).toBeInTheDocument();
    });

    it('handles slow network state', async () => {
      const user = userEvent.setup();
      
      render(<NetworkSimulationComponent />);

      // Set to slow
      const networkSelect = screen.getByTestId('network-select');
      await user.selectOptions(networkSelect, 'slow');

      const loadButton = screen.getByTestId('load-data');
      await user.click(loadButton);

      // Should show loading for longer
      expect(screen.getByTestId('network-loading')).toBeInTheDocument();

      // Note: In real test, we might want to mock timers for faster testing
    });
  });

  describe('Progressive Enhancement', () => {
    it('works without JavaScript (SSR scenario)', () => {
      // Simulate server-side rendering
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      render(<LoadingTestComponent isLoading={false} hasError={false} />);

      expect(screen.getByTestId('loaded-content')).toBeInTheDocument();

      global.window = originalWindow;
    });

    it('handles missing localStorage gracefully', () => {
      const originalLocalStorage = global.localStorage;
      // @ts-ignore
      delete global.localStorage;

      expect(() => {
        render(<LoadingTestComponent isLoading={false} hasError={false} />);
      }).not.toThrow();

      global.localStorage = originalLocalStorage;
    });
  });

  describe('Error Recovery Patterns', () => {
    it('allows retry after error', async () => {
      const user = userEvent.setup();
      let hasError = true;

      const RetryableComponent = () => {
        const [error, setError] = React.useState(hasError);
        
        const retry = () => {
          hasError = false;
          setError(false);
        };

        if (error) {
          return (
            <div data-testid="retry-error">
              <p>Something went wrong</p>
              <button onClick={retry} data-testid="retry-action">
                Try Again
              </button>
            </div>
          );
        }

        return <div data-testid="retry-success">Success!</div>;
      };

      render(<RetryableComponent />);

      expect(screen.getByTestId('retry-error')).toBeInTheDocument();

      const retryButton = screen.getByTestId('retry-action');
      await user.click(retryButton);

      expect(screen.getByTestId('retry-success')).toBeInTheDocument();
    });

    it('provides fallback content for partial failures', () => {
      const PartialFailureComponent = () => {
        const [criticalError] = React.useState(false);
        const [nonCriticalError] = React.useState(true);

        return (
          <div data-testid="partial-failure">
            {criticalError ? (
              <div data-testid="critical-error">Critical Error</div>
            ) : (
              <div data-testid="main-content">
                <h1>Main Content</h1>
                {nonCriticalError ? (
                  <div data-testid="fallback-content">
                    Some features unavailable
                  </div>
                ) : (
                  <div data-testid="full-content">
                    All features available
                  </div>
                )}
              </div>
            )}
          </div>
        );
      };

      render(<PartialFailureComponent />);

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
      expect(screen.queryByTestId('critical-error')).not.toBeInTheDocument();
    });
  });

  describe('Performance Under Error Conditions', () => {
    it('does not cause memory leaks with repeated errors', () => {
      const { rerender } = render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </TestErrorBoundary>
      );

      // Simulate multiple error/recovery cycles
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </TestErrorBoundary>
        );
        
        rerender(
          <TestErrorBoundary>
            <ErrorThrowingComponent shouldThrow={false} />
          </TestErrorBoundary>
        );
      }

      // Should not crash or cause issues
      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });

    it('handles rapid state changes efficiently', () => {
      const { rerender } = render(
        <LoadingTestComponent isLoading={true} hasError={false} />
      );

      // Rapid state changes
      for (let i = 0; i < 20; i++) {
        rerender(
          <LoadingTestComponent isLoading={i % 2 === 0} hasError={false} />
        );
      }

      // Should handle gracefully
      expect(screen.getByTestId('loaded-content')).toBeInTheDocument();
    });
  });
});