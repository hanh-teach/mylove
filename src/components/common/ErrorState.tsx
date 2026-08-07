import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-100">
    <p className="text-rose-600 font-semibold mb-4 text-sm">{message}</p>
    <button onClick={onRetry} className="px-4 py-2 bg-rose-500 text-white rounded-xl font-bold text-sm">Retry</button>
  </div>
);
