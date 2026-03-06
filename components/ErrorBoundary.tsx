import React, { ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Outfit, Inter, sans-serif",
            padding: "2rem",
            background: "#f8f7f4",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#9888;</div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#1a1a1a",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: "#666",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#6366f1",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
