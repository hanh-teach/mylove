import React from 'react';
import { WorkflowTaskViewModel } from './WorkflowViewModel';
import { CheckCircle2, Loader2, Circle, AlertCircle, PauseCircle } from 'lucide-react';

interface Props {
  tasks: WorkflowTaskViewModel[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export const WorkflowExecutionGraph: React.FC<Props> = ({
  tasks,
  selectedTaskId,
  onSelectTask
}) => {
  const renderIcon = (status: WorkflowTaskViewModel['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'running':
        return (
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
        );
      case 'paused':
        return <PauseCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
      case 'waiting':
      default:
        return <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />;
    }
  };

  const getNodeStyles = (status: WorkflowTaskViewModel['status'], isSelected: boolean) => {
    let base = 'transition-all duration-300 border flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ';
    if (isSelected) {
      base += 'ring-2 ring-indigo-500 shadow-sm ';
    }

    switch (status) {
      case 'completed':
        return base + 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80';
      case 'running':
        return base + 'bg-indigo-50/90 text-indigo-900 border-indigo-300 shadow-sm animate-pulse';
      case 'paused':
        return base + 'bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100/80';
      case 'failed':
        return base + 'bg-rose-50/80 text-rose-800 border-rose-200 hover:bg-rose-100/80';
      case 'waiting':
      default:
        return base + 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Execution Graph (DAG)
        </h3>
        <span className="text-[10px] text-gray-400 font-mono">{tasks.length} Nodes</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-2 overflow-x-auto">
        {tasks.map((task, index) => {
          const isSelected = selectedTaskId === task.id;
          return (
            <React.Fragment key={task.id}>
              <div
                onClick={() => onSelectTask(task.id)}
                className={getNodeStyles(task.status, isSelected)}
              >
                {renderIcon(task.status)}
                <span>{task.title}</span>
              </div>

              {index < tasks.length - 1 && (
                <span className="text-gray-300 text-xs font-bold font-mono select-none">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
