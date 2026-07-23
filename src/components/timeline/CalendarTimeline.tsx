import React, { useState, useMemo } from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { resolveMemoryCategory, MemoryService } from '../../modules/memory/MemoryService';
import { ChevronLeft, ChevronRight, Calendar, Info, Heart, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarTimelineProps {
  memories: IMemory[];
  collections: ICollection[];
  allTags: ITag[];
  onSelectMemory: (memory: IMemory) => void;
  onEditMemory?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onUpdateMemoryDate?: (id: string, newDate: string) => void;
}

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
  memories,
  collections,
  allTags,
  onSelectMemory,
  onEditMemory,
  onToggleFavorite,
  onUpdateMemoryDate
}) => {
  // Current view date state
  const [currentDate, setCurrentDate] = useState(() => {
    // Default to the date of the latest event, or today
    if (memories.length > 0) {
      const sorted = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const latestDate = new Date(sorted[0].date);
      if (!isNaN(latestDate.getTime())) {
        return new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
      }
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Group memories by date string "YYYY-MM-DD"
  const memoriesByDate = useMemo(() => {
    const map: Record<string, IMemory[]> = {};
    memories.forEach((m) => {
      if (m.date) {
        const dStr = m.date.substring(0, 10); // Standardize to YYYY-MM-DD
        if (!map[dStr]) map[dStr] = [];
        map[dStr].push(m);
      }
    });
    return map;
  }, [memories]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday

    const days: { day: number | null; dateString: string | null; isCurrentMonth: boolean }[] = [];

    // Padding for days of the previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        dateString: null,
        isCurrentMonth: false
      });
    }

    // Days of the current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = (month + 1).toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      const dateString = `${year}-${mStr}-${dStr}`;

      days.push({
        day: d,
        dateString,
        isCurrentMonth: true
      });
    }

    // Padding for days of the next month to complete the 6-week grid (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        dateString: null,
        isCurrentMonth: false
      });
    }

    return days;
  }, [year, month]);

  // Drag-and-drop support
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    setDragOverDate(dateString);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDragOverDate(null);
    try {
      const memoryDataRaw = e.dataTransfer.getData('text/plain');
      if (memoryDataRaw) {
        const memoryData = JSON.parse(memoryDataRaw);
        if (memoryData && memoryData.id && onUpdateMemoryDate) {
          onUpdateMemoryDate(memoryData.id, targetDate);
        }
      }
    } catch (err) {
      console.error('Error handling drop on Calendar day', err);
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 p-6 shadow-sm space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-50 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-xs">
            <Calendar size={20} />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-800">
              {monthNames[month]} - Năm {year}
            </h2>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Chế độ xem sự kiện theo Lịch thời gian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs border border-slate-200 transition-all"
          >
            Tháng hiện tại
          </button>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-rose-600 transition-all"
              title="Tháng trước"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="h-4 w-px bg-slate-300 mx-1" />
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-rose-600 transition-all"
              title="Tháng sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Drag instruction notice */}
      <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/50 text-slate-600 text-xs flex items-center gap-2">
        <Info size={14} className="text-rose-500 shrink-0" />
        <span className="font-medium">
          Mẹo: Bạn có thể <strong>kéo mốc kỷ niệm</strong> từ danh sách và thả trực tiếp vào một ngày bất kỳ trên Lịch để dời lịch hoặc gắn ngày tức thì!
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px] grid grid-cols-7 gap-2">
          {/* Days of week header */}
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, idx) => (
            <div
              key={idx}
              className={`text-center py-2 text-xs font-black tracking-wider ${
                idx === 0 ? 'text-rose-600' : idx === 6 ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              {day}
            </div>
          ))}

          {/* Days mapping */}
          {calendarDays.map((cell, idx) => {
            const hasEvents = cell.dateString && memoriesByDate[cell.dateString];
            const dayEvents = cell.dateString ? memoriesByDate[cell.dateString] : [];
            const isToday = cell.dateString === new Date().toISOString().substring(0, 10);
            const isDraggingOver = cell.dateString && dragOverDate === cell.dateString;

            return (
              <div
                key={idx}
                onDragOver={(e) => cell.dateString && handleDragOver(e, cell.dateString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => cell.dateString && handleDrop(e, cell.dateString)}
                className={`min-h-[90px] rounded-2xl border p-2 flex flex-col justify-between transition-all relative ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 text-slate-300 border-transparent'
                    : 'bg-white text-slate-800 border-slate-100'
                } ${isToday ? 'ring-2 ring-rose-500/80 bg-rose-50/10' : ''} ${
                  isDraggingOver ? 'bg-rose-100/50 border-dashed border-rose-400 scale-[1.02]' : ''
                } hover:border-rose-200 hover:shadow-xs`}
              >
                {/* Day number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                      isToday
                        ? 'bg-rose-500 text-white'
                        : cell.isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Day Events List */}
                <div className="mt-1 flex-1 flex flex-col gap-1 justify-end">
                  {cell.dateString && dayEvents.map((mem) => {
                    const cat = mem.category || resolveMemoryCategory(mem);
                    const catConfig = TIMELINE_CATEGORIES[cat] || TIMELINE_CATEGORIES.Love;

                    return (
                      <div
                        key={mem.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify({ id: mem.id }));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onClick={() => onSelectMemory(mem)}
                        className={`group/item text-[10px] font-bold p-1 rounded-lg border ${catConfig.badgeBg} ${catConfig.badgeBorder} cursor-pointer truncate hover:ring-1 hover:ring-rose-400/80 hover:translate-y-[-1px] transition-all flex items-center gap-1`}
                        title={`${mem.title} (${mem.location || ''})`}
                      >
                        <span className="shrink-0">{catConfig.icon}</span>
                        <span className="truncate flex-1">{mem.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
