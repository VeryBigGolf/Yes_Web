import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(err: any, info: any) { console.error("UI Error:", err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <div className="font-semibold">Something went wrong.</div>
            <div className="text-sm opacity-80 mt-1">{String(this.state.error)}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
