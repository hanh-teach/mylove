import React, { useState } from 'react';
import { Sparkles, Play, Film, Heart, BookOpen } from 'lucide-react';

interface Props {
  onStartWorkflow: (goal: string) => void;
}

export const WorkflowEmptyState: React.FC<Props> = ({ onStartWorkflow }) => {
  const [goal, setGoal] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onStartWorkflow(goal.trim());
    } else {
      onStartWorkflow('Tạo video kỷ niệm 5 năm hành trình');
    }
  };

  const quickPrompts = [
    { title: 'Video Kỷ Niệm 5 Năm', goal: 'Tạo video kỷ niệm 5 năm hành trình ý nghĩa', icon: Film },
    { title: 'AI Story Hành Trình', goal: 'AI kể lại câu chuyện hành trình qua các chuyến đi', icon: BookOpen },
    { title: 'Thư & Thiệp Kỷ Niệm', goal: 'Tạo thư tri ân và thiệp chúc mừng kỷ niệm', icon: Heart }
  ];

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200/80 shadow-sm text-center space-y-6 max-w-xl mx-auto my-6">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <Sparkles size={28} />
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900">Chưa có Workflow đang chạy</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          Nhập ý tưởng hoặc chọn mẫu bên dưới để AI Runtime lập kế hoạch execution DAG tự động.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Nhập ý tưởng (ví dụ: Tạo video kỷ niệm 5 năm hành trình)..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-28 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Play size={12} fill="currentColor" />
            Lập kế hoạch
          </button>
        </div>
      </form>

      <div className="pt-2">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Gợi ý nhanh
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {quickPrompts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => onStartWorkflow(item.goal)}
                className="p-3 bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-100 rounded-xl text-left transition-all group"
              >
                <Icon size={16} className="text-indigo-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600">
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
