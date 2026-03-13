import { Component } from 'react';

/**
 * ErrorBoundary - catches render/lifecycle errors in the subtree and
 * renders a graceful fallback instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeView />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production wire this to your error-reporting service (Sentry etc.)
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (!hasError) return children;

    if (fallback) return fallback;

    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8 text-center">
        <div className="text-4xl">\u26a0</div>
        <h2 className="text-xl font-semibold text-ink-900">Something went wrong</h2>
        <p className="text-sm text-ink-500 max-w-md">
          {error?.message ?? 'An unexpected error occurred. Reload the page or click below to try again.'}
        </p>
        <button
          onClick={this.handleReset}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}
