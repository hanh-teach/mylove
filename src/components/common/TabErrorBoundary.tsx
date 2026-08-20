import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  tabName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TabErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[TabErrorBoundary] Uncaught component error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-rose-100 dark:border-rose-950/40 shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-5 shadow-inner">
              <AlertCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Không thể tải {this.props.tabName || 'nội dung'}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Đã xảy ra sự cố kết nối hoặc tải module trên thiết bị của bạn. Bạn có thể thử lại ngay hoặc làm mới trang.
            </p>

            {this.state.error?.message && (
              <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-left text-xs font-mono text-slate-600 dark:text-slate-300 mb-6 max-h-24 overflow-y-auto border border-slate-200/60 dark:border-slate-700/60">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={this.handleRetry}
                className="flex-1 min-w-[140px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Thử lại</span>
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 min-w-[140px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TabErrorBoundary;

interface SectionProps {
  children: ReactNode;
  sectionName?: string;
  fallbackHeight?: string;
}

export class SectionErrorBoundary extends Component<SectionProps, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[SectionErrorBoundary] Section error in ${this.props.sectionName || 'subcomponent'}:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={`w-full ${this.props.fallbackHeight || 'min-h-[120px]'} p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col items-center justify-center text-center gap-2 my-2`}>
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <AlertCircle size={16} />
            <span>Không thể tải phân hệ {this.props.sectionName || ''}</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xs">Tải lại phân hệ này mà không ảnh hưởng bài viết của bạn.</p>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw size={12} />
            <span>Khôi phục phân hệ</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

