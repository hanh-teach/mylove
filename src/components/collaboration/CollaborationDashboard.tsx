import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, MessageSquare, Check, X, Shield, 
  Settings, Clock, Activity, AlertCircle, Edit3, MessageCircle,
  FileText, ImageIcon, Zap, ChevronRight, ShieldCheck, Mail
} from 'lucide-react';
import { Project } from '../../modules/workspace/Project';
import { ProjectMember, ProjectRole, ProjectSuggestion, ProjectComment } from '../../modules/collaboration/types';
import { collaborationService } from '../../modules/collaboration/CollaborationService';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';

interface CollaborationDashboardProps {
  project: Project;
  onNavigateToModule: (module: string) => void;
  onUpdateProject: (updates: Partial<Project>) => void;
}

export const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({
  project,
  onNavigateToModule,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'suggestions' | 'comments' | 'activity'>('suggestions');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('editor');

  const members = project.members || [];
  const suggestions = project.suggestions || [];
  const comments = project.comments || [];
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const unresolvedComments = comments.filter(c => !c.resolved);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const name = inviteEmail.split('@')[0];
    collaborationService.addMember(project.id, `usr_${Date.now()}`, name, inviteRole);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleResolveSuggestion = (suggId: string, action: 'accepted' | 'rejected') => {
    collaborationService.resolveSuggestion(project.id, suggId, action);
  };

  const handleResolveComment = (commentId: string) => {
    collaborationService.resolveComment(project.id, commentId);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Users size={16} />
              <span>Collaboration Hub</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Cộng tác viên & Phê duyệt
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Cùng nhau xây dựng nội dung. Quản lý thành viên, xét duyệt các thay đổi và xem bình luận trong dự án.
            </Typography>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setShowInviteModal(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20">
              <UserPlus size={16} className="mr-2" /> Thêm thành viên
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatBox icon={<Users size={18} />} label="Thành viên" value={members.length} color="indigo" />
          <StatBox icon={<Edit3 size={18} />} label="Suggestions" value={pendingSuggestions.length} color="amber" />
          <StatBox icon={<MessageCircle size={18} />} label="Bình luận" value={unresolvedComments.length} color="blue" />
          <StatBox icon={<Activity size={18} />} label="Hoạt động" value={project.recentActivity?.length || 0} color="emerald" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')} label={`Suggestions (${pendingSuggestions.length})`} />
            <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label={`Bình luận (${unresolvedComments.length})`} />
            <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Activity Feed" />
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'suggestions' && (
                <motion.div key="suggestions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-slate-900">Review Suggestions</Typography>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Filter size={14} className="mr-2" /> Lọc</Button>
                    </div>
                  </div>
                  
                  {pendingSuggestions.length === 0 ? (
                    <EmptyState icon={<Check size={32} />} title="Không có đề xuất mới" desc="Dự án của bạn đã được cập nhật hoàn toàn." />
                  ) : (
                    <div className="space-y-4">
                      {pendingSuggestions.map(sugg => (
                        <SuggestionCard key={sugg.id} suggestion={sugg} onResolve={(action) => handleResolveSuggestion(sugg.id, action)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div key="comments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-slate-900">Inline Comments</Typography>
                  </div>
                  {unresolvedComments.length === 0 ? (
                    <EmptyState icon={<MessageSquare size={32} />} title="Không có bình luận chưa đọc" desc="Bạn đã giải quyết tất cả các bình luận." />
                  ) : (
                    <div className="space-y-4">
                      {unresolvedComments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} onResolve={() => handleResolveComment(comment.id)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-slate-900">Activity Feed</Typography>
                  </div>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {(project.recentActivity || []).slice(0, 15).map((activity, idx) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {activity.type === 'edit' ? <Edit3 size={16} /> : 
                           activity.type === 'add' ? <Zap size={16} /> : 
                           activity.type === 'system' ? <Settings size={16} /> : <Activity size={16} />}
                        </div>
                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <Typography variant="body-sm" className="font-semibold text-slate-700">{activity.description}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Members */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h4" className="text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" />
                Thành viên
              </Typography>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">{members.length}</span>
            </div>
            
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {member.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-none">{member.name}</div>
                      <div className="text-[10px] font-semibold text-slate-500 mt-1 capitalize">{member.role}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 px-2">
                    <Settings size={14} />
                  </Button>
                </div>
              ))}
              
              {members.length === 0 && (
                <div className="text-center py-6">
                  <Typography variant="body-sm" className="text-slate-500">Chưa có thành viên nào.</Typography>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowInviteModal(true)}>
              Mời thêm
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <Typography variant="h4" className="text-slate-900">Mời thành viên</Typography>
                <button onClick={() => setShowInviteModal(false)} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Email hoặc Tên</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Vai trò</label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold bg-white"
                  >
                    <option value="editor">Editor (Có thể sửa)</option>
                    <option value="contributor">Contributor (Thêm nội dung)</option>
                    <option value="reviewer">Reviewer (Chỉ xem và bình luận)</option>
                    <option value="viewer">Viewer (Chỉ xem)</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs font-medium border border-blue-100 mt-2 flex gap-3">
                  <Shield size={16} className="shrink-0 text-blue-500" />
                  <span>Editor có thể sửa đổi nội dung. Viewer chỉ có thể xem. Hãy chọn quyền phù hợp.</span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>Hủy</Button>
                <Button variant="primary" onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700">Mời</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: number, color: string }> = ({ icon, label, value, color }) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} flex items-center gap-4`}>
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</div>
        <div className="text-xl font-black">{value}</div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
      active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {label}
  </button>
);

const EmptyState: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="py-12 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
      {icon}
    </div>
    <Typography variant="h4" className="text-slate-900 mb-2">{title}</Typography>
    <Typography variant="body-sm" className="text-slate-500">{desc}</Typography>
  </div>
);

const SuggestionCard: React.FC<{ suggestion: ProjectSuggestion, onResolve: (action: 'accepted' | 'rejected') => void }> = ({ suggestion, onResolve }) => (
  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
    <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
          {suggestion.authorName.substring(0,2).toUpperCase()}
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm">{suggestion.authorName}</span>
          <span className="text-slate-500 text-xs ml-2">đề xuất sửa đổi</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(suggestion.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="p-4 space-y-3">
      <Typography variant="body-sm" className="font-semibold text-slate-700">{suggestion.description}</Typography>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
          <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Bản cũ</div>
          <div className="text-sm line-through text-slate-500">{suggestion.originalContent}</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Đề xuất</div>
          <div className="text-sm font-medium text-slate-800">{suggestion.suggestedContent}</div>
        </div>
      </div>
    </div>
    <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
      <Button variant="outline" size="sm" onClick={() => onResolve('rejected')} className="text-rose-600 hover:bg-rose-50 hover:border-rose-200">
        <X size={14} className="mr-1" /> Từ chối
      </Button>
      <Button variant="primary" size="sm" onClick={() => onResolve('accepted')} className="bg-emerald-500 hover:bg-emerald-600 border-transparent text-white shadow-md">
        <Check size={14} className="mr-1" /> Chấp nhận
      </Button>
    </div>
  </div>
);

const CommentCard: React.FC<{ comment: ProjectComment, onResolve: () => void }> = ({ comment, onResolve }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
      {comment.authorName.substring(0,2).toUpperCase()}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-slate-900 text-sm">{comment.authorName}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <Typography variant="body-sm" className="text-slate-700 mb-3">{comment.content}</Typography>
      
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <button className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
          <MessageCircle size={12} /> Trả lời
        </button>
        <Button variant="outline" size="sm" onClick={onResolve} className="h-7 text-[10px] bg-slate-50">
          <Check size={12} className="mr-1" /> Đã giải quyết
        </Button>
      </div>
    </div>
  </div>
);
