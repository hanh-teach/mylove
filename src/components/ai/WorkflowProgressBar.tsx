import React from 'react';

interface WorkflowProgressBarProps {
  progress: number;
}

export const WorkflowProgressBar: React.FC<WorkflowProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5 text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
