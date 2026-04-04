import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
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
          flexDirection: 'column',
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
          <p style={{ fontSize: '12px', marginTop: '16px', color: '#64748b' }}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
