import React from 'react';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { PipelineStep } from '../../hooks/useWorkflowProgress';
import { motion } from 'motion/react';

interface WorkflowProgressItemProps {
  task: PipelineStep;
}

export const WorkflowProgressItem: React.FC<WorkflowProgressItemProps> = ({ task }) => {
  const getIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'waiting':
      default:
        return <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />;
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: task.status === 'waiting' ? 0.6 : 1, x: task.status === 'running' ? 4 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-3 text-sm py-1.5"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <span className={`transition-colors duration-200 ${
        task.status === 'completed' ? 'text-gray-700 dark:text-gray-300' :
        task.status === 'running' ? 'text-blue-600 dark:text-blue-400 font-medium' :
        task.status === 'failed' ? 'text-red-600 dark:text-red-400' :
        'text-gray-400 dark:text-gray-500'
      }`}>
        {task.name}
      </span>
    </motion.div>
  );
};
