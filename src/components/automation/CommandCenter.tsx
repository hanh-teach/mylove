import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  Zap, 
  FilePlus, 
  Trash2, 
  ArrowRight,
  Sparkles,
  History,
  MousePointer,
  Settings,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { automationService } from '../../modules/automation/AutomationService';
import { CommandType } from '../../modules/automation/AutomationTypes';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'c1', label: 'Create New Project', icon: <FilePlus size={18} />, type: 'create_project' as CommandType },
    { id: 'c2', label: 'New Memory Entry', icon: <Zap size={18} />, type: 'create_memory' as CommandType },
    { id: 'c3', label: 'Export as PDF', icon: <ChevronRight size={18} />, type: 'export_pdf' as CommandType },
    { id: 'c4', label: 'Generate AI Draft', icon: <Sparkles size={18} />, type: 'generate_draft' as CommandType },
    { id: 'c5', label: 'Delete Selected', icon: <Trash2 size={18} />, type: 'delete_project' as CommandType },
    { id: 'c6', label: 'System Settings', icon: <Settings size={18} />, type: 'update_project' as CommandType },
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      const selected = filteredCommands[selectedIndex];
      if (selected) handleExecute(selected);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleExecute = (cmd: any) => {
    automationService.executeCommand(cmd.type, {}, cmd.label);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden relative z-10"
      >
        <div className="flex items-center px-6 py-5 border-b border-slate-100">
          <Search size={22} className="text-slate-400 mr-4" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none focus:outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Command size={10} /> K
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-3">
          <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Available Commands
          </div>
          
          <div className="space-y-1">
            {filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => handleExecute(cmd)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  selectedIndex === idx ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedIndex === idx ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {cmd.icon}
                  </div>
                  <span className="font-bold text-sm">{cmd.label}</span>
                </div>
                {selectedIndex === idx && (
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest opacity-60">
                    Execute <ArrowRight size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredCommands.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">No results found</h4>
                <p className="text-xs text-slate-400">Try searching for 'Project', 'Export', or 'AI'</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
            <FooterIcon icon={<Zap size={14} />} label="Automations" />
            <FooterIcon icon={<History size={14} />} label="History" />
            <FooterIcon icon={<ShieldCheck size={14} />} label="Review" />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MousePointer size={12} /> Use arrows to navigate
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FooterIcon: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 cursor-pointer transition-colors">
    {icon}
    {label}
  </div>
);
