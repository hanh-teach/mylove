import React, { useState } from 'react';
import { ChevronDown, Layers, Check } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { motion, AnimatePresence } from 'motion/react';

const workspaces = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'family', name: 'Family', icon: '🏠' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'archive', name: 'Archive', icon: '📦' },
];

export const WorkspaceSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(workspaces[0]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-elevated transition-colors border border-transparent hover:border-border-subtle"
      >
        <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
          {selected.icon}
        </div>
        <div className="hidden sm:block text-left">
          <Typography variant="label" className="block leading-none mb-0.5">Workspace</Typography>
          <Typography variant="body-sm" className="font-bold leading-none">{selected.name}</Typography>
        </div>
        <ChevronDown size={14} className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-56 bg-white border border-border-base rounded-xl shadow-level-3 z-50 overflow-hidden"
            >
              <div className="p-2 border-b border-border-subtle bg-surface-elevated">
                <Typography variant="label" className="px-2 py-1">Chọn không gian làm việc</Typography>
              </div>
              <div className="p-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelected(ws);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                      selected.id === ws.id ? 'bg-rose-50 text-rose-700' : 'hover:bg-surface-elevated text-text-main'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ws.icon}</span>
                      <Typography variant="body-sm" className="font-bold">{ws.name}</Typography>
                    </div>
                    {selected.id === ws.id && <Check size={16} />}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-border-subtle">
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated text-text-muted transition-colors">
                  <Layers size={14} />
                  <Typography variant="label" className="lowercase">Quản lý Workspace</Typography>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
