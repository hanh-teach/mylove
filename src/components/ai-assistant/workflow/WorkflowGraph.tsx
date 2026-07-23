import React from 'react';
import { WorkflowTaskViewModel } from './WorkflowViewModel';
import { CheckCircle2, Loader2, AlertCircle, Circle, PauseCircle } from 'lucide-react';

interface Props {
  tasks: WorkflowTaskViewModel[];
  selectedTaskId?: string;
  onSelectTask?: (taskId: string) => void;
}

export const WorkflowGraph: React.FC<Props> = ({ tasks, selectedTaskId, onSelectTask }) => {
  const renderNodeIcon = (status: WorkflowTaskViewModel['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />;
      case 'paused':
        return <PauseCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      case 'waiting':
      default:
        return <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />;
    }
  };

  const renderBadgeColor = (status: WorkflowTaskViewModel['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'running':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-200';
      case 'paused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'waiting':
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Execution Graph (DAG)
        </h3>
        <span className="text-[10px] text-gray-400 font-mono">7 Nodes</span>
      </div>

      {/* DAG Flow Display */}
      <div className="flex flex-wrap items-center gap-2 py-2 overflow-x-auto">
        {tasks.map((task, index) => {
          const isSelected = selectedTaskId === task.id;
          return (
            <React.Fragment key={task.id}>
              <button
                onClick={() => onSelectTask && onSelectTask(task.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${renderBadgeColor(
                  task.status
                )} ${isSelected ? 'ring-2 ring-indigo-500 shadow-sm' : 'hover:bg-opacity-80'}`}
              >
                {renderNodeIcon(task.status)}
                <span className="whitespace-nowrap font-semibold">{task.title}</span>
              </button>

              {index < tasks.length - 1 && (
                <div className="text-gray-300 text-xs font-mono select-none">↓</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
