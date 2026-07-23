import React from 'react';
import { motion } from 'motion/react';
import { Button, ButtonVariant } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { FileQuestion, LucideIcon } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: EmptyStateAction[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon = FileQuestion, 
  actions = [] 
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px] max-w-lg mx-auto">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-24 h-24 bg-rose-50 rounded-[32px] mb-8 flex items-center justify-center text-rose-500 shadow-inner border border-rose-100"
    >
      <Icon size={48} strokeWidth={1.5} />
    </motion.div>
    
    <Typography variant="h2" className="mb-3 font-black tracking-tight text-slate-900">{title}</Typography>
    <Typography variant="body" className="mb-10 text-slate-500 font-medium leading-relaxed">{description}</Typography>
    
    {actions.length > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actions.map((action, idx) => (
          <Button 
            key={idx}
            onClick={action.onClick} 
            variant={action.variant || (idx === 0 ? 'primary' : 'secondary')}
            leftIcon={action.icon && <action.icon size={18} />}
          >
            {action.label}
          </Button>
        ))}
      </div>
    )}
  </div>
);
