// Core component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Card component types
export type CardVariant = 'default' | 'feature' | 'demo';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  hover?: boolean;
  padding?: CardPadding;
}

// Modal component types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: Record<string, [string, string]>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

// Re-export content types from dedicated content types file
export * from './content';

// Analytics types
export interface AnalyticsEvent {
  event: string;
  properties: {
    section?: string;
    action?: string;
    value?: string | number;
    timestamp: number;
  };
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingProps {
  state: LoadingState;
  error?: string;
  retry?: () => void;
}