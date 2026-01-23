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
    // log to console for developer
    // eslint-disable-next-line no-console
    console.error('DevErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 bg-red-50 text-red-800 rounded-lg shadow-md">
          <h3 className="font-bold mb-2">An error occurred while rendering the component</h3>
          <div className="text-sm mb-2">{this.state.error.message}</div>
          <details className="text-xs text-gray-700">
            <summary className="cursor-pointer">Stack trace</summary>
            <pre className="whitespace-pre-wrap text-xs">{this.state.error.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
