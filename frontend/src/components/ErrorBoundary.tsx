import React, { ReactNode, ReactElement } from 'react';
import * as Sentry from '@sentry/react';
import { logError } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
  retryCount: number;
}

/**
 * Enhanced ErrorBoundary with Sentry integration, error logging, and recovery strategies
 *
 * Features:
 * - Captures errors to Sentry for monitoring
 * - Logs detailed error info to localStorage for post-reload diagnostics
 * - Provides retry mechanism
 * - Custom fallback UI support
 * - Automatic page reload with cache clearing on critical errors
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly ERROR_STORAGE_KEY = 'akiprisaye_error_log';
  private readonly MAX_STORED_ERRORS = 10;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'true',
        component: errorInfo.componentStack,
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error);
      console.error('[ErrorBoundary Component Stack]', errorInfo.componentStack);
    }

    // Log to application logger
    logError('error_boundary_caught', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });

    // Store error in localStorage for post-reload diagnostics
    this.storeErrorInLocalStorage(error, errorInfo);
  }

  private storeErrorInLocalStorage(error: Error, errorInfo: React.ErrorInfo): void {
    try {
      const errorLog = JSON.parse(
        localStorage.getItem(this.ERROR_STORAGE_KEY) || '[]'
      ) as Array<{
        timestamp: string;
        message: string;
        stack?: string;
        componentStack?: string;
        errorId: string;
      }>;

      // Add new error (keep most recent)
      errorLog.unshift({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
      });

      // Trim to MAX_STORED_ERRORS
      if (errorLog.length > this.MAX_STORED_ERRORS) {
        errorLog.pop();
      }

      localStorage.setItem(this.ERROR_STORAGE_KEY, JSON.stringify(errorLog));
    } catch (storageError) {
      // Silently fail if storage is full or unavailable
      if (import.meta.env.DEV) {
        console.warn('[ErrorBoundary] Failed to store error in localStorage', storageError);
      }
    }
  }

  private handleRetry = (): void => {
    if (this.state.retryCount < this.MAX_RETRIES) {
      this.setState(
        (prevState) => ({
          hasError: false,
          error: null,
          retryCount: prevState.retryCount + 1,
        }),
        () => {
          // Clear any pending timeouts
          if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
          }
        }
      );
    } else {
      // Max retries exceeded, trigger recovery
      this.handleRecovery();
    }
  };

  private handleRecovery = (): void => {
    // Clear localStorage cache and session storage
    try {
      const keysToPreserve = ['akiprisaye_error_log', 'akiprisaye_user_preferences'];
      const keysToDelete = Object.keys(localStorage).filter(
        (key) => !keysToPreserve.includes(key)
      );

      keysToDelete.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore individual removal errors
        }
      });

      // Clear IndexedDB if available
      if (window.indexedDB) {
        const dbs = ['akiprisaye-cache', 'akiprisaye-data'];
        dbs.forEach((dbName) => {
          try {
            const deleteRequest = window.indexedDB.deleteDatabase(dbName);
            deleteRequest.onerror = () => console.warn(`Failed to delete IndexedDB: ${dbName}`);
          } catch (e) {
            // Ignore IndexedDB errors
          }
        });
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('[ErrorBoundary] Failed to clear caches', e);
      }
    }

    // Hard reload with cache bypass
    window.location.href = `${window.location.origin}${import.meta.env.BASE_URL}?cache-bust=${Date.now()}`;
  };

  componentWillUnmount(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-lg border border-red-500/20 p-6 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-center mb-2">Erreur d'application</h1>
            <p className="text-slate-400 text-center text-sm mb-6">
              Une erreur inattendue s'est produite. Nous avons enregistré les détails.
            </p>

            {/* Error Details */}
            <div className="bg-slate-900/50 rounded border border-slate-700 p-4 mb-6 max-h-32 overflow-y-auto">
              <p className="text-xs font-mono text-red-400 break-words">
                {this.state.error.message || 'Erreur inconnue'}
              </p>
              {import.meta.env.DEV && this.state.error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                    Stack trace
                  </summary>
                  <pre className="text-xs text-slate-500 mt-2 overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            {/* Error ID for support */}
            <div className="bg-slate-700/30 rounded p-2 mb-6">
              <p className="text-xs text-slate-400">
                <strong>ID d'erreur:</strong>
              </p>
              <p className="text-xs text-slate-300 font-mono break-all">{this.state.errorId}</p>
            </div>

            {/* Retry Count */}
            {this.state.retryCount > 0 && (
              <p className="text-xs text-yellow-400 text-center mb-4">
                Tentative {this.state.retryCount} / {this.MAX_RETRIES}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {this.state.retryCount < this.MAX_RETRIES && (
                <button
                  onClick={this.handleRetry}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  type="button"
                >
                  Réessayer ({this.MAX_RETRIES - this.state.retryCount})
                </button>
              )}
              <button
                onClick={() => {
                  if (this.state.retryCount >= this.MAX_RETRIES) {
                    this.handleRecovery();
                  } else {
                    window.location.href = `${window.location.origin}${import.meta.env.BASE_URL}`;
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                type="button"
              >
                {this.state.retryCount >= this.MAX_RETRIES ? 'Récupérer' : 'Accueil'}
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500 text-center mt-4">
              Contactez le support si le problème persiste.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
