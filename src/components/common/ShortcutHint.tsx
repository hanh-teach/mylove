import React from 'react';

export const ShortcutHint: React.FC<{ shortcut: string }> = ({ shortcut }) => (
  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200">
    {shortcut}
  </span>
);
