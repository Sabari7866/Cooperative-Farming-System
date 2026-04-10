import React from 'react';

type State = { error: Error | null };

export default class DevErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Check if error is related to dynamic imports (chunk loading)
    // This happens when a new deployment occurs and the user's browser still has the old index.html with outdated asset hashes.
    if (error.message.toLowerCase().includes('failed to fetch dynamically imported module') || 
        error.message.toLowerCase().includes('loading chunk')) {
      console.warn('Chunk load failed. Attemping to reload the app...');
      // Small delay before reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    console.error('DevErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.error) {
      const isChunkError = this.state.error.message.toLowerCase().includes('failed to fetch dynamically imported module') || 
                          this.state.error.message.toLowerCase().includes('loading chunk');

      return (
        <div className="p-10 min-h-[400px] flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isChunkError ? 'Updating Application...' : 'Something went wrong'}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              {isChunkError 
                ? 'We are updating Uzhavan X to the latest version. Please wait a moment.' 
                : 'An unexpected error occurred while rendering this component.'}
            </p>
            
            {!isChunkError && (
              <div className="bg-red-50 p-4 rounded-xl mb-6">
                <div className="text-sm text-red-800 font-mono break-words">{this.state.error.message}</div>
              </div>
            )}

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Reload Page
            </button>

            {!isChunkError && (
              <details className="mt-6 text-[10px] text-gray-400">
                <summary className="cursor-pointer hover:text-gray-600 uppercase tracking-widest font-bold">Debug Info</summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
