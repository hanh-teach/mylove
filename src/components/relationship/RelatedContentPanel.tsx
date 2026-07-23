
import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ImageIcon, 
  FileText, 
  User, 
  MapPin, 
  Link as LinkIcon,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { EntityType } from '../../modules/relationship/types';
import { relationshipService } from '../../modules/relationship/RelationshipService';

interface RelatedContentPanelProps {
  entityId: string;
  entityType: EntityType;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: EntityType, id: string) => void;
}

export const RelatedContentPanel: React.FC<RelatedContentPanelProps> = ({
  entityId,
  entityType,
  isOpen,
  onClose,
  onNavigate
}) => {
  const related = relationshipService.getRelatedEntities(entityId);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="fixed right-0 top-[3.5rem] bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-[50] flex flex-col"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-tighter">Liên quan</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Relationship Engine
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {related.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300 mb-4">
              <LinkIcon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-400">Chưa có liên kết nào</p>
            <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-4 hover:underline">
              Tìm liên kết với AI
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Categorized Related Items */}
            <RelatedSection 
              title="📅 Timeline" 
              items={related.filter(r => r.type === 'timeline_event')} 
              onNavigate={onNavigate}
            />
            <RelatedSection 
              title="📷 Hình ảnh" 
              items={related.filter(r => r.type === 'asset')} 
              onNavigate={onNavigate}
            />
            <RelatedSection 
              title="📝 Drafts" 
              items={related.filter(r => r.type === 'draft')} 
              onNavigate={onNavigate}
            />
            <RelatedSection 
              title="👤 Nhân vật" 
              items={related.filter(r => r.type === 'person')} 
              onNavigate={onNavigate}
            />
            <RelatedSection 
              title="📍 Địa điểm" 
              items={related.filter(r => r.type === 'place')} 
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors">
          <Sparkles size={14} className="text-amber-500" />
          Smart Linking
        </button>
      </div>
    </motion.div>
  );
};

const RelatedSection: React.FC<{ 
  title: string, 
  items: any[], 
  onNavigate: (type: EntityType, id: string) => void 
}> = ({ title, items, onNavigate }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{title}</h4>
      <div className="space-y-1">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.type, item.id)}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                {getEntityIcon(item.type)}
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-slate-900 truncate">Sự kiện liên quan</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.relationshipType}
                </div>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

const getEntityIcon = (type: EntityType) => {
  switch (type) {
    case 'memory': return <Sparkles size={14} />;
    case 'timeline_event': return <Calendar size={14} />;
    case 'asset': return <ImageIcon size={14} />;
    case 'draft': return <FileText size={14} />;
    case 'person': return <User size={14} />;
    case 'place': return <MapPin size={14} />;
    default: return <LinkIcon size={14} />;
  }
};
