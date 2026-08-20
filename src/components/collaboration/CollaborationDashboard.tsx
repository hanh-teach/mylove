import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, MessageSquare, Check, X, Shield, 
  Settings, Clock, Activity, AlertCircle, Edit3, MessageCircle,
  FileText, ImageIcon, Zap, ChevronRight, ShieldCheck, Mail, Copy, Trash2, ExternalLink, Sparkles, Send, Loader2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Project } from '../../modules/workspace/Project';
import { ProjectMember, ProjectRole, ProjectSuggestion, ProjectComment, ProjectPermissions } from '../../modules/collaboration/types';
import { collaborationService } from '../../modules/collaboration/CollaborationService';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { requestGmailAccessToken, sendEmailViaGmailApi, DEFAULT_GOOGLE_CLIENT_ID } from '../../utils/gmailService';
import { SUPPORT_CONTACT_EMAILS } from '../../config/contact';

interface CollaborationDashboardProps {
  project: Project;
  onNavigateToModule: (module: string) => void;
  onUpdateProject: (updates: Partial<Project>) => void;
}

const ROLE_LABELS: Record<ProjectRole, string> = {
  owner: 'Tài khoản Chủ (Toàn quyền)',
  editor: 'Biên tập viên (Editor)',
  contributor: 'Người đóng góp (Contributor)',
  reviewer: 'Người duyệt bình luận (Reviewer)',
  viewer: 'Người xem (Viewer)'
};

const DEFAULT_PERMISSIONS: Record<ProjectRole, ProjectPermissions> = {
  owner: { view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: true },
  editor: { view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: false },
  contributor: { view: true, comment: true, addMemory: true, editDraft: false, export: false, delete: false },
  reviewer: { view: true, comment: true, addMemory: false, editDraft: false, export: false, delete: false },
  viewer: { view: true, comment: false, addMemory: false, editDraft: false, export: false, delete: false }
};

export const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({
  project,
  onNavigateToModule,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'suggestions' | 'comments' | 'activity' | 'email-logs'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('editor');

  // Permission settings modal state
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState<ProjectMember | null>(null);
  const [editRole, setEditRole] = useState<ProjectRole>('editor');
  const [editPermissions, setEditPermissions] = useState<ProjectPermissions>({
    view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: false
  });

  const [simulatedMails, setSimulatedMails] = useState<Array<{
    id: string;
    recipient: string;
    subject: string;
    status: string;
    link: string;
    timestamp: number;
    body: string;
  }>>(() => {
    const saved = localStorage.getItem(`lovenote_simulated_mails_${project.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const saveMails = (newMails: typeof simulatedMails) => {
    setSimulatedMails(newMails);
    localStorage.setItem(`lovenote_simulated_mails_${project.id}`, JSON.stringify(newMails));
  };

  const [sendingGmailId, setSendingGmailId] = useState<string | null>(null);
  const [gmailSuccessMsg, setGmailSuccessMsg] = useState<string | null>(null);
  const [gmailErrorMsg, setGmailErrorMsg] = useState<string | null>(null);

  // Realtime polling to sync invite acceptances from server API
  useEffect(() => {
    if (!project?.id) return;

    // First ensure all pending members are registered on server
    if (project.members && project.members.length > 0) {
      project.members.forEach(m => {
        if (m.status === 'pending' && m.id) {
          fetch('/api/collaboration/invites', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inviteId: m.id,
              projectId: project.id,
              email: m.email || '',
              name: m.name,
              role: m.role,
              status: 'pending'
            })
          }).catch(() => {});
        }
      });
    }

    const syncServerInvites = async () => {
      try {
        const res = await fetch(`/api/collaboration/invites?projectId=${project.id}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && Array.isArray(data.invites)) {
          let updatedAny = false;
          const currentMembers = project.members || [];

          data.invites.forEach((inv: any) => {
            if (inv.status === 'active') {
              const targetMember = currentMembers.find(m => 
                m.id === inv.inviteId || 
                (m.email && inv.email && m.email.toLowerCase() === inv.email.toLowerCase())
              );

              if (targetMember && targetMember.status === 'pending') {
                collaborationService.updateMemberRoleAndPermissions(
                  project.id,
                  targetMember.id,
                  targetMember.role,
                  targetMember.permissions,
                  'active',
                  inv.name || targetMember.name
                );
                updatedAny = true;
              }
            }
          });

          if (updatedAny) {
            setGmailSuccessMsg('🎉 Đã đồng bộ thành công! Thành viên mới đã chấp nhận lời mời từ Email và chính thức tham gia dự án!');
          }
        }
      } catch (e) {
        // network polling silent retry
      }
    };

    syncServerInvites();
    const intervalId = setInterval(syncServerInvites, 3000);
    return () => clearInterval(intervalId);
  }, [project.id, project.members]);

  const handleSendViaGmailApi = async (to: string, subject: string, body: string, mailId?: string) => {
    const targetId = mailId || to;
    setSendingGmailId(targetId);
    setGmailSuccessMsg(null);
    setGmailErrorMsg(null);

    try {
      const accessToken = await requestGmailAccessToken(DEFAULT_GOOGLE_CLIENT_ID);
      await sendEmailViaGmailApi(accessToken, to, subject, body);
      
      setGmailSuccessMsg(`Đã gửi thư mời trực tiếp tới ${to} qua Google Gmail API (OAuth 2.0)!`);
      
      if (mailId) {
        const updated = simulatedMails.map(m => m.id === mailId ? { ...m, status: 'ĐÃ GỬI QUA GMAIL API (OAUTH)' } : m);
        saveMails(updated);
      }
    } catch (err: any) {
      console.error('Lỗi gửi email qua Gmail API:', err);
      setGmailErrorMsg(err.message || 'Không thể gửi thư qua Gmail API');
    } finally {
      setSendingGmailId(null);
    }
  };

  const members = project.members || [];
  const suggestions = project.suggestions || [];
  const comments = project.comments || [];
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const unresolvedComments = comments.filter(c => !c.resolved);

  // Active vs Pending members
  const activeMembers = members.filter(m => !m.status || m.status === 'active');
  const pendingMembers = members.filter(m => m.status === 'pending');

  const handleInvite = () => {
    if (!inviteEmail) return;
    const cleanEmail = inviteEmail.trim().toLowerCase();
    const name = cleanEmail.split('@')[0];
    
    // Add pending member in project's members array
    const member = collaborationService.addMember(
      project.id, 
      `usr_${Date.now()}`, 
      name, 
      inviteRole, 
      undefined, 
      'pending', 
      cleanEmail
    );

    // Register invitation on server API for real-time cross-device sync
    fetch('/api/collaboration/invites', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inviteId: member.id,
        projectId: project.id,
        email: cleanEmail,
        name,
        role: inviteRole,
        status: 'pending'
      })
    }).catch(() => {});

    // Create Simulated Mail Delivery Log
    const inviteLink = `${window.location.origin}${window.location.pathname}?inviteId=${member.id}&projectId=${project.id}`;
    const mailBody = `Kính gửi ${name},\n\nBạn nhận được lời mời tham gia cộng tác thiết kế thiệp và lưu bút trên hệ thống nghệ thuật NoteMe!\n\nDự án: ${project.title}\nVai trò của bạn: ${ROLE_LABELS[inviteRole]}\n\nĐể chấp nhận lời mời và tham gia biên tập ngay, vui lòng nhấp vào liên kết sau:\n${inviteLink}\n\nTrân trọng,\nChủ hệ thống NoteMe`;
    
    const newMail = {
      id: `mail_${Date.now()}`,
      recipient: cleanEmail,
      subject: `[NoteMe] Lời mời cộng tác dự án nghệ thuật: ${project.title}`,
      status: 'Đã gửi (Xếp hàng hàng đợi SMTP giả lập)',
      link: inviteLink,
      timestamp: Date.now(),
      body: mailBody
    };

    saveMails([newMail, ...simulatedMails]);

    setInviteEmail('');
    setShowInviteModal(false);
    alert(`Đã gửi thư mời cộng tác thành công tới ${cleanEmail}! Thư mời được đẩy vào hòm thư giả lập. Hãy chuyển sang Tab "Hòm thư giả lập" để sao chép liên kết mời hoặc kích hoạt giả lập người nhận tự chấp nhận nhé!`);
    setActiveTab('email-logs');
  };

  const handleSimulateAccept = (memberId: string, email: string, role: string) => {
    const finalName = email.split('@')[0] + ' (Simulated)';
    
    // Notify server API
    fetch('/api/collaboration/accept-invite', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inviteId: memberId,
        projectId: project.id,
        email,
        name: finalName
      })
    }).catch(() => {});

    // Update role & status in service
    collaborationService.updateMemberRoleAndPermissions(
      project.id,
      memberId,
      role as any,
      DEFAULT_PERMISSIONS[role as ProjectRole] || DEFAULT_PERMISSIONS.editor,
      'active',
      finalName
    );

    // Update mail list status
    const updatedMails = simulatedMails.map(m => {
      if (m.link.includes(memberId)) {
        return { ...m, status: 'Đã chấp nhận (Simulated Accepted)' };
      }
      return m;
    });
    saveMails(updatedMails);

    alert(`Giả lập thành công! Người dùng ${email} đã tự động chấp nhận lời mời làm ${role}. Họ hiện là thành viên chính thức hoạt động trong danh sách.`);
    
    // Refresh parent state by forcing update project structure
    const updatedProj = { ...project };
    onUpdateProject(updatedProj);
  };

  const handleOpenEditMember = (member: ProjectMember) => {
    setSelectedMemberToEdit(member);
    setEditRole(member.role);
    setEditPermissions(member.permissions || DEFAULT_PERMISSIONS[member.role]);
  };

  const handleRoleChange = (role: ProjectRole) => {
    setEditRole(role);
    setEditPermissions(DEFAULT_PERMISSIONS[role]);
  };

  const handlePermissionToggle = (key: keyof ProjectPermissions) => {
    setEditPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedMemberToEdit) return;
    collaborationService.updateMemberRoleAndPermissions(
      project.id,
      selectedMemberToEdit.id,
      editRole,
      editPermissions,
      selectedMemberToEdit.status,
      selectedMemberToEdit.name
    );
    setSelectedMemberToEdit(null);
    alert(`Đã cập nhật quyền hạn cho thành viên ${selectedMemberToEdit.name} thành công!`);
    onUpdateProject({ ...project });
  };

  const handleKickMember = () => {
    if (!selectedMemberToEdit) return;
    if (confirm(`Bạn có chắc chắn muốn loại bỏ thành viên ${selectedMemberToEdit.name} khỏi dự án này không?`)) {
      collaborationService.removeMember(project.id, selectedMemberToEdit.id);
      setSelectedMemberToEdit(null);
      alert(`Đã loại bỏ thành viên thành công.`);
      onUpdateProject({ ...project });
    }
  };

  const handleResolveSuggestion = (suggId: string, action: 'accepted' | 'rejected') => {
    collaborationService.resolveSuggestion(project.id, suggId, action);
    onUpdateProject({ ...project });
  };

  const handleResolveComment = (commentId: string) => {
    collaborationService.resolveComment(project.id, commentId);
    onUpdateProject({ ...project });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Đã sao chép liên kết mời vào bộ nhớ tạm! Bạn có thể gửi liên kết này cho bạn bè qua Zalo, Facebook hoặc Messenger để họ nhấn vào tham gia.');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-surface rounded-3xl p-8 border border-border-subtle shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest mb-2">
              <Users size={16} />
              <span>Collaboration Hub</span>
            </div>
            <Typography variant="h2" className="text-text-main tracking-tighter">
              Cộng tác viên & Phê duyệt
            </Typography>
            <Typography variant="body" className="text-text-muted mt-2 max-w-xl">
              Cùng nhau xây dựng nội dung. Quản lý thành viên, xét duyệt các thay đổi, phân chia quyền hạn và xem bình luận trong dự án.
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
          <StatBox icon={<Users size={18} />} label="Thành viên" value={activeMembers.length} color="indigo" />
          <StatBox icon={<Edit3 size={18} />} label="Đề xuất" value={pendingSuggestions.length} color="amber" />
          <StatBox icon={<MessageCircle size={18} />} label="Bình luận" value={unresolvedComments.length} color="blue" />
          <StatBox icon={<Mail size={18} />} label="Hòm thư giả lập" value={simulatedMails.length} color="emerald" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-border-subtle overflow-x-auto whitespace-nowrap">
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} label={`Thành viên chính thức (${activeMembers.length})`} />
            <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')} label={`Đề xuất (${pendingSuggestions.length})`} />
            <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label={`Bình luận (${unresolvedComments.length})`} />
            <TabButton active={activeTab === 'email-logs'} onClick={() => setActiveTab('email-logs')} label={`Hòm thư giả lập (${simulatedMails.length})`} />
            <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Hoạt động" />
          </div>

          {/* Gmail API Notification Banners */}
          {gmailSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span>{gmailSuccessMsg}</span>
              </div>
              <button onClick={() => setGmailSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}

          {gmailErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{gmailErrorMsg}</span>
              </div>
              <button onClick={() => setGmailErrorMsg(null)} className="text-rose-600 hover:text-rose-800 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-surface rounded-3xl p-6 border border-border-subtle shadow-xs min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'members' && (
                <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <Typography variant="title" className="text-text-main mb-2">Thành viên đang tham gia</Typography>
                    <Typography variant="body-sm" className="text-text-muted mb-4">Các thành viên dưới đây có quyền truy cập trực tiếp và thao tác theo vai trò của họ.</Typography>
                    
                    <div className="space-y-3">
                      {activeMembers.map(member => (
                        <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-elevated rounded-2xl border border-border-subtle gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-xs uppercase">
                              {member.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-text-main">{member.name}</div>
                              <div className="text-xs font-semibold text-text-muted mt-0.5">{member.email || `Chủ hệ thống / ${SUPPORT_CONTACT_EMAILS[0]}`}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-subtle">
                            <span className="text-[11px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wide">
                              {member.role === 'owner' ? 'Tài khoản Chủ' : member.role}
                            </span>
                            
                            {member.role !== 'owner' && (
                              <Button variant="outlined" size="sm" onClick={() => handleOpenEditMember(member)} className="text-text-main border-border-base hover:border-border-strong hover:bg-surface-elevated">
                                <Settings size={14} className="mr-1.5" /> Phân quyền
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {activeMembers.length === 0 && (
                        <EmptyState icon={<Users size={32} />} title="Không tìm thấy thành viên chính thức" desc="Tạo dự án mới hoặc kiểm tra phân quyền." />
                      )}
                    </div>
                  </div>

                  {pendingMembers.length > 0 && (
                    <div className="border-t border-border-subtle pt-6">
                      <Typography variant="title" className="text-text-main mb-2">Lời mời đang chờ chấp nhận ({pendingMembers.length})</Typography>
                      <Typography variant="body-sm" className="text-text-muted mb-4">Các tài khoản dưới đây đã được gửi thư mời cộng tác và đang chờ họ xác nhận đường dẫn link liên kết mời.</Typography>
                      
                      <div className="space-y-3">
                        {pendingMembers.map(member => (
                          <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm shadow-xs uppercase">
                                {member.name.substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-black text-text-main">{member.name}</div>
                                <div className="text-xs font-semibold text-text-muted mt-0.5">{member.email}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-500/30">
                              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Đang chờ phản hồi</span>
                              
                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  disabled={sendingGmailId === member.email}
                                  onClick={() => {
                                    const inviteLink = `${window.location.origin}${window.location.pathname}?inviteId=${member.id}&projectId=${project.id}`;
                                    const subject = `[NoteMe] Lời mời cộng tác dự án nghệ thuật: ${project.title}`;
                                    const body = `Kính gửi ${member.name},\n\nBạn nhận được lời mời tham gia cộng tác thiết kế thiệp và lưu bút trên hệ thống nghệ thuật NoteMe!\n\nDự án: ${project.title}\n\nĐể chấp nhận lời mời và tham gia biên tập ngay, vui lòng nhấp vào liên kết sau:\n${inviteLink}\n\nTrân trọng,\nChủ hệ thống NoteMe`;
                                    handleSendViaGmailApi(member.email || '', subject, body);
                                  }} 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                >
                                  {sendingGmailId === member.email ? (
                                    <>
                                      <Loader2 size={12} className="mr-1 animate-spin" /> Đang gửi Gmail...
                                    </>
                                  ) : (
                                    <>
                                      <Send size={12} className="mr-1" /> Gửi qua Gmail API (OAuth)
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="sm" 
                                  onClick={() => {
                                    const inviteLink = `${window.location.origin}${window.location.pathname}?inviteId=${member.id}&projectId=${project.id}`;
                                    const subject = `[NoteMe] Lời mời cộng tác dự án nghệ thuật: ${project.title}`;
                                    const body = `Kính gửi ${member.name},\n\nBạn nhận được lời mời tham gia cộng tác thiết kế thiệp và lưu bút trên hệ thống nghệ thuật NoteMe!\n\nDự án: ${project.title}\n\nĐể chấp nhận lời mời và tham gia biên tập ngay, vui lòng nhấp vào liên kết sau:\n${inviteLink}\n\nTrân trọng,\nChủ hệ thống NoteMe`;
                                    const mailtoUrl = `mailto:${encodeURIComponent(member.email || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                    window.location.href = mailtoUrl;
                                  }} 
                                  className="text-indigo-500 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20"
                                >
                                  <Mail size={12} className="mr-1" /> Mở Gmail (mailto:)
                                </Button>
                                <Button variant="outlined" size="sm" onClick={() => handleCopyLink(`${window.location.origin}${window.location.pathname}?inviteId=${member.id}&projectId=${project.id}`)} className="text-text-main border-border-base bg-surface hover:bg-surface-elevated">
                                  <Copy size={12} className="mr-1" /> Link mời
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => handleSimulateAccept(member.id, member.email || '', member.role)} className="bg-amber-600 hover:bg-amber-700 text-white border-transparent">
                                  Giả lập Chấp nhận
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'suggestions' && (
                <motion.div key="suggestions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="title" className="text-text-main font-black">Review Suggestions</Typography>
                    <div className="flex gap-2">
                      <Button variant="outlined" size="sm"><Filter size={14} className="mr-2" /> Lọc</Button>
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
                    <Typography variant="h3" className="text-text-main font-black">Bình luận nội bộ</Typography>
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

              {activeTab === 'email-logs' && (
                <motion.div key="email-logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <Typography variant="title" className="text-text-main mb-2">Hộp Thư SMTP Giả Lập & Nhật Ký Lời Mời</Typography>
                    <Typography variant="body-sm" className="text-text-muted mb-4">Do đây là môi trường phát triển ngoại tuyến biệt lập, hệ thống không thể tự ý bắn thư thực tế lên mạng máy chủ Google Mail (nguoinhan@gmail.com...). Toàn bộ thư mời tạo ra sẽ được xếp hàng truyền tải ở đây. Bạn có thể xem chi tiết thư, lấy liên kết hoặc kích hoạt giả lập tự chấp nhận.</Typography>
                    
                    <div className="space-y-4">
                      {simulatedMails.map(mail => (
                        <div key={mail.id} className="bg-surface-elevated rounded-2xl border border-border-base overflow-hidden shadow-xs">
                          <div className="p-4 bg-surface border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-text-muted">Tới: <span className="text-text-main font-black">{mail.recipient}</span></div>
                              <div className="text-xs font-bold text-text-main mt-1">{mail.subject}</div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full self-start sm:self-auto">
                              {mail.status}
                            </span>
                          </div>
                          <div className="p-4 bg-surface">
                            <pre className="font-mono text-xs text-text-main whitespace-pre-wrap bg-surface-elevated p-4 rounded-xl border border-border-subtle max-h-48 overflow-y-auto">
                              {mail.body}
                            </pre>
                            
                            <div className="mt-4 flex flex-wrap gap-2 justify-end">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                disabled={sendingGmailId === mail.id}
                                onClick={() => handleSendViaGmailApi(mail.recipient, mail.subject, mail.body, mail.id)} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                              >
                                {sendingGmailId === mail.id ? (
                                  <>
                                    <Loader2 size={13} className="mr-1.5 animate-spin" /> Đang gửi Gmail...
                                  </>
                                ) : (
                                  <>
                                    <Send size={13} className="mr-1.5" /> Gửi trực tiếp qua Gmail API (OAuth)
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="sm" 
                                onClick={() => {
                                  const mailtoUrl = `mailto:${encodeURIComponent(mail.recipient)}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
                                  window.location.href = mailtoUrl;
                                }} 
                                className="text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30"
                              >
                                <Mail size={13} className="mr-1.5" /> Mở Gmail gửi lời mời (mailto:)
                              </Button>
                              <Button variant="outlined" size="sm" onClick={() => handleCopyLink(mail.link)} className="text-text-main bg-surface border-border-base hover:bg-surface-elevated">
                                <Copy size={13} className="mr-1.5" /> Sao chép Link mời
                              </Button>
                              
                              {mail.status.includes('SMTP') && (
                                <Button variant="primary" size="sm" onClick={() => {
                                  const inviteId = new URLSearchParams(mail.link.split('?')[1]).get('inviteId') || '';
                                  const role = mail.body.includes('Biên tập viên') ? 'editor' : mail.body.includes('Người đóng góp') ? 'contributor' : mail.body.includes('Người duyệt') ? 'reviewer' : 'viewer';
                                  handleSimulateAccept(inviteId, mail.recipient, role);
                                }} className="bg-emerald-600 hover:bg-emerald-700 border-transparent text-white">
                                  <Sparkles size={13} className="mr-1.5" /> Giả lập người nhận Nhấp link & Tham gia
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {simulatedMails.length === 0 && (
                        <EmptyState icon={<Mail size={32} />} title="Hòm thư trống rỗng" desc="Hãy nhấp 'Thêm thành viên' ở góc phải để tạo thư mời cộng tác đầu tiên." />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-text-main font-black">Lịch sử hoạt động</Typography>
                  </div>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-base before:to-transparent">
                    {(project.recentActivity || []).slice(0, 15).map((activity) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surface-elevated text-text-muted shadow-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {activity.type === 'edit' ? <Edit3 size={16} /> : 
                           activity.type === 'add' ? <Zap size={16} /> : 
                           activity.type === 'system' ? <Settings size={16} /> : <Activity size={16} />}
                        </div>
                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface p-4 rounded-2xl border border-border-base shadow-xs hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <Typography variant="body-sm" className="font-semibold text-text-main">{activity.description}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Members Info Card */}
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="title" className="text-text-main flex items-center gap-2 font-black">
                <ShieldCheck size={18} className="text-indigo-500" />
                Danh sách nhanh
              </Typography>
              <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full text-xs font-bold">{members.length}</span>
            </div>
            
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-xs uppercase">
                      {member.name.substring(0,2)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-text-main leading-none">{member.name}</div>
                      <div className="text-[9px] font-bold text-text-muted mt-1 capitalize">{member.status === 'pending' ? 'Chờ duyệt' : member.role}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditMember(member)} className="text-text-muted hover:text-text-main px-2">
                    <Settings size={14} />
                  </Button>
                </div>
              ))}
              
              {members.length === 0 && (
                <div className="text-center py-6">
                  <Typography variant="body-sm" className="text-text-muted">Chưa có thành viên nào.</Typography>
                </div>
              )}
            </div>
            
            <Button variant="outlined" className="w-full mt-4" onClick={() => setShowInviteModal(true)}>
              Mời thêm bằng Email
            </Button>
          </div>

          <div className="bg-surface-elevated text-text-muted rounded-3xl p-6 border border-border-subtle shadow-xs">
            <h4 className="text-sm font-black tracking-tight text-text-main flex items-center gap-2 mb-3">
              <Shield size={16} className="text-indigo-400" /> Vai trò & Quyền hạn
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-text-muted">
              <p>Hệ thống hỗ trợ 4 vai trò cộng tác viên và phân quyền bảo mật chặt chẽ:</p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="text-text-main">Editor:</strong> Soạn thảo bản nháp, chèn kỷ vật và trang trí.</li>
                <li><strong className="text-text-main">Contributor:</strong> Thêm kỷ niệm, chèn ảnh, viết lưu bút.</li>
                <li><strong className="text-text-main">Reviewer:</strong> Xem bản thiết kế và gửi bình luận thảo luận.</li>
                <li><strong className="text-text-main">Viewer:</strong> Chỉ xem thiệp thành phẩm, không sửa đổi.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border-subtle"
            >
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/50">
                <Typography variant="title" className="text-text-main font-black">Mời thành viên cộng tác</Typography>
                <button onClick={() => setShowInviteModal(false)} className="p-2 rounded-xl hover:bg-surface-elevated text-text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-widest mb-2">Email Người nhận (Ví dụ: nguoinhan@gmail.com)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-text-muted" />
                    <input 
                      type="email" 
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="nguoinhan@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold bg-surface-elevated text-text-main"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-widest mb-2">Vai trò chỉ định</label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold bg-surface-elevated text-text-main"
                  >
                    <option value="editor">Editor (Biên tập viên - Toàn quyền sửa)</option>
                    <option value="contributor">Contributor (Người đóng góp - Chỉ viết/thêm kỷ niệm)</option>
                    <option value="reviewer">Reviewer (Người duyệt - Chỉ xem và bình luận)</option>
                    <option value="viewer">Viewer (Chỉ xem - Read-only)</option>
                  </select>
                </div>
                
                <div className="bg-indigo-500/10 text-indigo-500 p-4 rounded-xl text-xs font-medium border border-indigo-500/20 mt-2 flex gap-3">
                  <Shield size={16} className="shrink-0 text-indigo-500" />
                  <span>Sau khi nhấp "Gửi lời mời", hệ thống tự động soạn thảo thư gửi mẫu và lập trình liên kết mã hóa. Bạn có thể tự mình gửi liên kết này hoặc mô phỏng chấp nhận.</span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 bg-surface-elevated/50">
                <Button variant="outlined" onClick={() => setShowInviteModal(false)}>Hủy</Button>
                <Button variant="primary" onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700 text-white">Gửi lời mời</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permissions & Roles Manager Modal */}
      <AnimatePresence>
        {selectedMemberToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border-subtle"
            >
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/50">
                <div>
                  <Typography variant="title" className="text-text-main font-black">Phân quyền & Vai trò</Typography>
                  <span className="text-xs font-bold text-text-muted mt-0.5 block">Thành viên: {selectedMemberToEdit.name} ({selectedMemberToEdit.email || 'Không có email'})</span>
                </div>
                <button onClick={() => setSelectedMemberToEdit(null)} className="p-2 rounded-xl hover:bg-surface-elevated text-text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-text-main uppercase tracking-widest mb-2">Vai trò chính</label>
                  <select 
                    value={editRole}
                    onChange={(e) => handleRoleChange(e.target.value as ProjectRole)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold bg-surface-elevated text-text-main"
                  >
                    <option value="editor">Editor (Biên tập viên)</option>
                    <option value="contributor">Contributor (Người đóng góp)</option>
                    <option value="reviewer">Reviewer (Người duyệt bình luận)</option>
                    <option value="viewer">Viewer (Người xem)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-text-main uppercase tracking-widest mb-3">Tùy biến quyền hạn chi tiết</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <PermissionToggle label="Xem nội dung thiệp" checked={editPermissions.view} onChange={() => handlePermissionToggle('view')} />
                    <PermissionToggle label="Gửi bình luận thảo luận" checked={editPermissions.comment} onChange={() => handlePermissionToggle('comment')} />
                    <PermissionToggle label="Thêm kỷ niệm / lưu bút" checked={editPermissions.addMemory} onChange={() => handlePermissionToggle('addMemory')} />
                    <PermissionToggle label="Sửa đổi bản nháp chính" checked={editPermissions.editDraft} onChange={() => handlePermissionToggle('editDraft')} />
                    <PermissionToggle label="Tải & Xuất bản PDF/Docx" checked={editPermissions.export} onChange={() => handlePermissionToggle('export')} />
                    <PermissionToggle label="Xóa phần tử dự án" checked={editPermissions.delete} onChange={() => handlePermissionToggle('delete')} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-surface-elevated/50">
                <Button variant="outlined" onClick={handleKickMember} className="text-rose-600 hover:bg-rose-50 border-rose-150 hover:border-rose-200">
                  <Trash2 size={14} className="mr-1.5" /> Loại bỏ khỏi dự án
                </Button>
                <div className="flex gap-2">
                  <Button variant="outlined" onClick={() => setSelectedMemberToEdit(null)}>Hủy</Button>
                  <Button variant="primary" onClick={handleSavePermissions} className="bg-indigo-600 hover:bg-indigo-700 text-white">Lưu thay đổi</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PermissionToggle: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between p-3 bg-surface-elevated hover:bg-surface/80 rounded-xl border border-border-subtle cursor-pointer select-none transition-colors">
    <span className="text-xs font-bold text-text-main">{label}</span>
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange}
      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-border-base bg-surface"
    />
  </label>
);

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: number, color: string }> = ({ icon, label, value, color }) => {
  const colorMap: any = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} flex items-center gap-4`}>
      <div className="p-3 bg-surface rounded-xl shadow-xs">{icon}</div>
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
      active ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-text-muted hover:text-text-main'
    }`}
  >
    {label}
  </button>
);

const EmptyState: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="py-12 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 rounded-full bg-surface-elevated text-text-muted flex items-center justify-center mb-4">
      {icon}
    </div>
    <Typography variant="title" className="text-text-main mb-2">{title}</Typography>
    <Typography variant="body-sm" className="text-text-muted">{desc}</Typography>
  </div>
);

const SuggestionCard: React.FC<{ suggestion: ProjectSuggestion, onResolve: (action: 'accepted' | 'rejected') => void }> = ({ suggestion, onResolve }) => (
  <div className="bg-surface-elevated rounded-2xl border border-border-base overflow-hidden">
    <div className="p-4 border-b border-border-subtle bg-surface flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-xs">
          {suggestion.authorName.substring(0,2).toUpperCase()}
        </div>
        <div>
          <span className="font-bold text-text-main text-sm">{suggestion.authorName}</span>
          <span className="text-text-muted text-xs ml-2">đề xuất sửa đổi</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-text-muted uppercase">{new Date(suggestion.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="p-4 space-y-3">
      <Typography variant="body-sm" className="font-semibold text-text-main">{suggestion.description}</Typography>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Bản cũ</div>
          <div className="text-sm line-through text-text-muted">{suggestion.originalContent}</div>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Đề xuất</div>
          <div className="text-sm font-medium text-text-main">{suggestion.suggestedContent}</div>
        </div>
      </div>
    </div>
    <div className="p-4 bg-surface border-t border-border-subtle flex justify-end gap-3">
      <Button variant="outlined" size="sm" onClick={() => onResolve('rejected')} className="text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20">
        <X size={14} className="mr-1" /> Từ chối
      </Button>
      <Button variant="primary" size="sm" onClick={() => onResolve('accepted')} className="bg-emerald-500 hover:bg-emerald-600 border-transparent text-white shadow-md">
        <Check size={14} className="mr-1" /> Chấp nhận
      </Button>
    </div>
  </div>
);

const CommentCard: React.FC<{ comment: ProjectComment, onResolve: () => void }> = ({ comment, onResolve }) => (
  <div className="bg-surface rounded-2xl border border-border-subtle p-4 shadow-sm flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center shrink-0">
      {comment.authorName.substring(0,2).toUpperCase()}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-text-main text-sm">{comment.authorName}</span>
        <span className="text-[10px] font-bold text-text-muted uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <Typography variant="body-sm" className="text-text-main mb-3">{comment.content}</Typography>
      
      <div className="flex items-center justify-between border-t border-border-subtle pt-3">
        <button className="text-[11px] font-bold text-text-muted hover:text-indigo-500 transition-colors flex items-center gap-1">
          <MessageCircle size={12} /> Trả lời
        </button>
        <Button variant="outlined" size="sm" onClick={onResolve} className="h-7 text-[10px] bg-surface-elevated text-text-main border-border-base hover:border-border-strong">
          <Check size={12} className="mr-1" /> Đã giải quyết
        </Button>
      </div>
    </div>
  </div>
);

export default CollaborationDashboard;

