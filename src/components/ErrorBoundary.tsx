import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { DataCard } from './DataCard';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--surface)'
        }}>
          <DataCard title="SYSTEM FAILURE" className="flex flex-col gap-4" style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--error)' }}>
              <AlertTriangle size={32} />
              <h1 className="display-md">Critical UI Error</h1>
            </div>
            <p className="body-large text-secondary">
              The Macro-Pilot engine encountered an unexpected runtime error.
              Please switch to Manual Entry Mode.
            </p>
            <div style={{ padding: '16px', background: 'var(--surface-container-highest)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace' }}>
              {this.state.error?.message}
            </div>
            <button 
              className="button-primary" 
              onClick={() => window.location.href = '/log'}
              style={{ marginTop: '16px' }}
            >
              GO TO MANUAL ENTRY
            </button>
          </DataCard>
        </div>
      );
    }

    return this.props.children;
  }
}
