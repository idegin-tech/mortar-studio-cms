import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { apiConfig } from '../config/api'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (apiConfig.isLocal) {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => {
          this.setState({ hasError: false, error: undefined })
        })
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Something went wrong
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>An unexpected error occurred in the application.</p>
                  {apiConfig.isLocal && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">
                        Error Details
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function QueryErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={(error, resetError) => (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      Query Error
                    </h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Failed to load data. Please check your connection and try again.</p>
                      {apiConfig.isLocal && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-medium">
                            Error Details
                          </summary>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {error.message}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      reset()
                      resetError()
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}