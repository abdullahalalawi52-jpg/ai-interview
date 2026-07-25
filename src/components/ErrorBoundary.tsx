"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 bg-error/10 border border-error/30 rounded-2xl text-center w-full my-4">
          <AlertCircle className="w-10 h-10 text-error mb-4" />
          <h3 className="text-lg font-bold text-on-surface mb-2">
            عذراً، حدث خطأ غير متوقع / Sorry, an unexpected error occurred
          </h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-md">
            {this.state.error?.message || "Something went wrong while rendering this component."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="flex items-center gap-2 px-6 py-2.5 bg-surface text-on-surface border border-outline rounded-full hover:bg-surface-variant transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة / Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
