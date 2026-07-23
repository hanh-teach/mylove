import React from 'react';
import { Typography } from '../../components/ui/Typography';
import { Check, Cloud, Wifi, Cpu, Layers } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="hidden lg:flex h-8 bg-white border-t border-border-subtle px-4 items-center justify-between text-text-muted z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Check size={12} className="text-green-500" />
          <Typography variant="label" className="lowercase">Sẵn sàng</Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <Cloud size={12} />
          <Typography variant="label" className="lowercase">Đã lưu tự động</Typography>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Wifi size={12} />
            <Typography variant="label" className="lowercase">Online</Typography>
          </div>
          <div className="w-px h-3 bg-border-subtle" />
          <div className="flex items-center gap-1">
            <Cpu size={12} />
            <Typography variant="label" className="lowercase">v4.0.0-beta</Typography>
          </div>
          <div className="w-px h-3 bg-border-subtle" />
          <div className="flex items-center gap-1">
            <Layers size={12} />
            <Typography variant="label" className="lowercase">Sprint 75.9</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
