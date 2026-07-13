import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

const CHUNK_RETRY_KEY = 'ai_gate_chunk_retry';
const CHUNK_ERROR_PATTERN = /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed/i;

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };
  private retryResetTimer: number | null = null;

  componentDidMount() {
    this.retryResetTimer = window.setTimeout(() => {
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
    }, 10_000);
  }

  componentWillUnmount() {
    if (this.retryResetTimer !== null) window.clearTimeout(this.retryResetTimer);
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render failure:', error, info.componentStack);

    if (
      CHUNK_ERROR_PATTERN.test(error.message) &&
      sessionStorage.getItem(CHUNK_RETRY_KEY) !== '1'
    ) {
      sessionStorage.setItem(CHUNK_RETRY_KEY, '1');
      window.location.reload();
    }
  }

  private retry = () => {
    sessionStorage.removeItem(CHUNK_RETRY_KEY);
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        className="grid min-h-dvh place-items-center bg-[#F8FAFC] p-6 text-slate-900 dark:bg-[#090D16] dark:text-white"
        dir="rtl"
      >
        <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg dark:border-slate-800 dark:bg-[#0E1728]">
          <h1 className="text-lg font-black">پلاتفۆرمەکە پێویستی بە نوێکردنەوە هەیە</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            داتاکانت پارێزراون. تکایە پەڕەکە نوێ بکەرەوە بۆ بارکردنی وەشانی نوێ.
          </p>
          <button
            type="button"
            onClick={this.retry}
            className="mt-5 h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            نوێکردنەوەی پەڕە
          </button>
        </section>
      </main>
    );
  }
}
