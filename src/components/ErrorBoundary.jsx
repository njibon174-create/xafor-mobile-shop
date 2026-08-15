import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-dark dark:bg-surface-dark px-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-400 mb-4">
              The page hit a rendering error. Please refresh, or contact support if it persists.
            </p>
            <pre className="text-left text-xs text-red-400 bg-gray-900/60 border border-gray-800 rounded-lg p-3 overflow-auto max-h-40">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
