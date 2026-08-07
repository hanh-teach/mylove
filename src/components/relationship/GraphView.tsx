
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  Search, 
  Info,
  Settings,
  Share2,
  Filter
} from 'lucide-react';
import { relationshipService } from '../../modules/relationship/RelationshipService';

export const GraphView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Basic animation loop for "Smart Workspace" feel
    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Mock Nodes & Connections
      const nodes = [
        { x: 200, y: 200, label: 'Memory: Đà Lạt', color: '#f43f5e' },
        { x: 400, y: 150, label: 'Person: Nguyễn Văn A', color: '#3b82f6' },
        { x: 350, y: 350, label: 'Place: Hồ Xuân Hương', color: '#10b981' },
        { x: 550, y: 250, label: 'Draft: Nhật ký', color: '#8b5cf6' },
      ];

      // Draw Connections
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.lineTo(nodes[0].x, nodes[0].y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Nodes
      nodes.forEach(node => {
        const pulse = Math.sin(frame * 0.05) * 2;
        
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(node.label, node.x + 15, node.y + 5);
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex bg-slate-50 relative overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="absolute left-6 top-6 bottom-6 w-72 bg-white/80 backdrop-blur-md rounded-[32px] border border-slate-200/60 shadow-xl z-20 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-black text-xl text-slate-900 tracking-tighter">Content Graph</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Desktop Beta v1.0</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thống kê liên kết</div>
              <div className="space-y-4">
                <GraphStat label="Kỷ niệm" value={12} color="rose" />
                <GraphStat label="Nhân vật" value={4} color="blue" />
                <GraphStat label="Địa điểm" value={6} color="emerald" />
                <GraphStat label="Bản nháp" value={8} color="purple" />
                <GraphStat label="Knowledge" value={15} color="amber" />
                <GraphStat label="AI Notes" value={32} color="slate" />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><Info size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><Settings size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><Share2 size={18} /></button>
          </div>
        </motion.div>
      )}

      {/* Main Canvas Area */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Controls */}
      <div className="absolute right-6 top-6 flex flex-col gap-3 z-20">
        <GraphControl icon={<Search size={18} />} />
        <GraphControl icon={<Filter size={18} />} />
        <GraphControl icon={<Maximize2 size={18} />} />
      </div>

      {/* Navigation Help */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl z-20">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-white/20">MOUSE</span>
          <span>Di chuyển</span>
        </div>
        <div className="w-px h-3 bg-white/20" />
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-white/20">SCROLL</span>
          <span>Phóng to/thu nhỏ</span>
        </div>
      </div>
    </div>
  );
};

const GraphStat: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => {
  const colors: any = {
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-500'
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[color]}`} />
        <span className="text-xs font-bold text-slate-600">{label}</span>
      </div>
      <span className="text-xs font-black text-slate-900">{value}</span>
    </div>
  );
};

const GraphControl: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
    {icon}
  </button>
);
