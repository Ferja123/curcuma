import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // If it's the Google Translate DOM error, try to auto-recover
    if (error.message?.includes('insertBefore') || error.message?.includes('removeChild')) {
      // Force a clean reload after a brief delay
      setTimeout(() => window.location.reload(), 100);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught:', error.message);
    
    // Auto-recover from DOM manipulation errors caused by extensions
    if (error.message?.includes('insertBefore') || error.message?.includes('removeChild') || error.message?.includes('not a child')) {
      console.warn('DOM conflict detected (likely browser extension). Auto-recovering...');
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          fontFamily: 'Inter, sans-serif',
          background: '#0f172a',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
            ⚠️ Error temporal
          </h1>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: '#94a3b8' }}>
            La página tuvo un problema. Por favor recarga.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              background: '#f59e0b', 
              color: '#0f172a', 
              border: 'none', 
              padding: '16px 32px', 
              borderRadius: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
