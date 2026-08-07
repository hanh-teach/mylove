import React, { useState, useEffect } from 'react';
import { X, User, Crown, ShieldAlert, Key, Mail, CheckCircle2, LogOut, ArrowRight, Sparkles, ExternalLink, ShieldCheck, Lock, Copy } from 'lucide-react';
import { useCurrentUser, useWorkspaceZustandStore } from '../../modules/workspace/WorkspaceZustandStore';
import { isOwnerUser } from '../../shared/utils/authPermissions';
import { SUPPORT_CONTACT_EMAILS, SUPPORT_DISPLAY_NAME } from '../../config/contact';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const currentUser = useCurrentUser();
  const updateCurrentUser = useWorkspaceZustandStore(state => state.updateCurrentUser);

  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [huggingKey, setHuggingKey] = useState(() => localStorage.getItem('lovenote_huggingface_api_key') || '');
  const [activeTab, setActiveTab] = useState<'status' | 'login' | 'hugging'>('status');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [requestsList, setRequestsList] = useState<Array<{ id: string; email: string; name: string; date: string; status: string }>>([]);

  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const [is2FARequired, setIs2FARequired] = useState(false);
  const [twoFactorInputCode, setTwoFactorInputCode] = useState('');
  const [twoFactorOtpNotice, setTwoFactorOtpNotice] = useState('');

  useEffect(() => {
    if (currentUser.email) {
      setInputEmail(currentUser.email);
    }
    if (currentUser.name) {
      setInputName(currentUser.name);
    }
  }, [currentUser]);

  const fetchRequestsList = async () => {
    try {
      const res = await fetch('/api/contact-requests', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        // Handle unauthorized or non-owner gracefully
        setRequestsList([]);
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const rawRequests = localStorage.getItem('lovenote_contact_requests') || '[]';
        const rawRegistered = localStorage.getItem('lovenote_registered_users') || '[]';
        const parsedRequests = JSON.parse(rawRequests);
        const parsedRegistered = JSON.parse(rawRegistered);
        
        const combined = [...data.requests];
        parsedRequests.forEach((item: any) => {
          if (!combined.some(c => c.email.toLowerCase() === item.email.toLowerCase())) {
            combined.push(item);
          }
        });
        parsedRegistered.forEach((item: any) => {
          if (!combined.some(c => c.email.toLowerCase() === item.email.toLowerCase())) {
            combined.push({ id: Date.now().toString() + Math.random(), email: item.email, name: item.name, date: item.date, status: 'pending' });
          }
        });
        
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRequestsList(combined);
        return;
      }
    } catch (err) {
      console.error('Error fetching server requests:', err);
    }

    try {
      const rawRequests = localStorage.getItem('lovenote_contact_requests') || '[]';
      const rawRegistered = localStorage.getItem('lovenote_registered_users') || '[]';
      const parsedRequests = JSON.parse(rawRequests);
      const parsedRegistered = JSON.parse(rawRegistered);
      
      const combined = [...parsedRequests];
      parsedRegistered.forEach((item: any) => {
        if (!combined.some(c => c.email.toLowerCase() === item.email.toLowerCase())) {
          combined.push({ id: Date.now().toString() + Math.random(), email: item.email, name: item.name, date: item.date, status: 'pending' });
        }
      });
      setRequestsList(combined);
    } catch {
      setRequestsList([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequestsList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isOwner = isOwnerUser(currentUser.role, currentUser.email);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveContactRequest = async (email: string, name: string) => {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();
    
    // Save locally
    const raw = localStorage.getItem('lovenote_contact_requests') || '[]';
    let requests: Array<{ id: string; email: string; name: string; date: string; status: string }> = [];
    try { requests = JSON.parse(raw); } catch { requests = []; }
    if (!requests.some(r => r.email.toLowerCase() === cleanEmail)) {
      requests.push({ id: Date.now().toString(), email: cleanEmail, name: name || cleanEmail.split('@')[0], date: new Date().toISOString(), status: 'pending' });
      localStorage.setItem('lovenote_contact_requests', JSON.stringify(requests));
    }

    // Save on backend server
    try {
      await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: name || cleanEmail.split('@')[0] })
      });
      fetchRequestsList();
    } catch (err) {
      console.error('Failed to sync contact request with backend:', err);
    }
  };

  const getContactMailData = (customEmail?: string, customName?: string) => {
    const email = customEmail || currentUser.email || '';
    const name = customName || currentUser.name || 'Khách hàng';
    const subject = `[NoteMe Auth] Yêu cầu duyệt Email: ${email || name}`;
    const body = `Kính gửi ${SUPPORT_DISPLAY_NAME},\n\nTôi muốn gửi yêu cầu thêm email của tôi vào Supabase Authentication để mở khóa toàn bộ quyền sử dụng trên ứng dụng NoteMe (https://mylove-7ho2.onrender.com/).\n\nThông tin người dùng:\n- Họ và tên: ${name}\n- Email: ${email || 'Chưa cung cấp'}\n- Thời gian yêu cầu: ${new Date().toLocaleString('vi-VN')}\n\nKính mong quý hệ thống hỗ trợ duyệt và thêm email này giúp tôi.\nTrân trọng cảm ơn!`;
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${SUPPORT_CONTACT_EMAILS.join(',')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${SUPPORT_CONTACT_EMAILS.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return { email, name, subject, body, webGmailUrl, mailtoUrl };
  };

  const handleSendWebGmail = (customEmail?: string, customName?: string) => {
    const data = getContactMailData(customEmail, customName);
    saveContactRequest(data.email, data.name);
    window.open(data.webGmailUrl, '_blank');
    showToast('Đã mở Gmail Web! Vui lòng bấm "Gửi" trong tab Gmail vừa mở.');
  };

  const handleSendMailto = (customEmail?: string, customName?: string) => {
    const data = getContactMailData(customEmail, customName);
    saveContactRequest(data.email, data.name);
    window.open(data.mailtoUrl, '_blank');
    showToast('Đã mở ứng dụng Mail máy tính. Hãy bấm "Gửi" trong ứng dụng.');
  };

  const handleCopyContact = (customEmail?: string, customName?: string) => {
    const data = getContactMailData(customEmail, customName);
    saveContactRequest(data.email, data.name);
    const fullCopyText = `Gửi tới: ${SUPPORT_CONTACT_EMAILS.join(', ')}\nTiêu đề: ${data.subject}\n\nNội dung:\n${data.body}`;
    navigator.clipboard.writeText(fullCopyText);
    showToast('Đã sao chép Email Chủ hệ thống & Nội dung yêu cầu!');
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputPassword) {
      alert('Vui lòng nhập email và mật khẩu.');
      return;
    }
    try {
      const payload: any = { email: inputEmail, password: inputPassword };
      if (is2FARequired && twoFactorInputCode.trim()) {
        payload.twoFactorCode = twoFactorInputCode.trim();
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Email hoặc mật khẩu không chính xác');
      }

      if (data.require2FA) {
        setIs2FARequired(true);
        setTwoFactorOtpNotice(data.twoFactorOtp || '');
        showToast('Tài khoản đã kích hoạt 2FA. Vui lòng nhập mã xác thực OTP.');
        return;
      }

      // Successful login
      setIs2FARequired(false);
      setTwoFactorInputCode('');
      setTwoFactorOtpNotice('');
      if (data.token) {
        localStorage.setItem('lovenote_auth_token', data.token);
      }
      updateCurrentUser({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role === 'owner' ? 'Tài khoản Chủ (Toàn quyền)' : 'Tài khoản Người dùng',
        twoFactorEnabled: data.user.twoFactorEnabled || false
      });
      showToast(`Đăng nhập thành công với email: ${data.user.email}`);
      setActiveTab('status');
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng nhập');
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputPassword) {
      alert('Vui lòng nhập email và mật khẩu.');
      return;
    }
    if (inputPassword.length < 8) {
      alert('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: inputPassword, name: inputName }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }
      if (data.token) {
        localStorage.setItem('lovenote_auth_token', data.token);
      }
      updateCurrentUser({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role === 'owner' ? 'Tài khoản Chủ (Toàn quyền)' : 'Tài khoản Người dùng'
      });
      setIsRegisterSuccess(true);
      showToast(`Đăng ký & Đăng nhập thành công cho ${data.user.email}`);
      setActiveTab('status');
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng ký');
    }
  };

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) {
      alert('Vui lòng nhập Email của bạn.');
      return;
    }
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Yêu cầu mã OTP thất bại');
      }
      setGeneratedOtp(data.resetCode || '');
      setForgotStep(2);
      showToast(`Mã OTP khôi phục: ${data.resetCode}`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi yêu cầu mã khôi phục');
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp.trim() || !newPassword) {
      alert('Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Mật khẩu mới phải từ 8 ký tự trở lên.');
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputEmail,
          code: resetOtp,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đặt lại mật khẩu thất bại');
      }
      showToast('Đã đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
      setInputPassword(newPassword);
      setAuthMode('login');
      setForgotStep(1);
      setResetOtp('');
      setNewPassword('');
    } catch (err: any) {
      alert(err.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  const handleSaveHuggingKey = () => {
    localStorage.setItem('lovenote_huggingface_api_key', huggingKey.trim());
    showToast('Đã lưu Hugging Face API Key thành công!');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    updateCurrentUser({
      email: '',
      name: 'Khách hàng',
      role: 'Chưa đăng nhập'
    });
    showToast('Đã đăng xuất khỏi tài khoản.');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[130] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-emerald-500/30">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="font-bold text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white shadow-inner">
              {isOwner ? <Crown size={22} className="text-amber-200 animate-pulse" /> : <User size={22} />}
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Xác thực & Phân quyền</h3>
              <p className="text-xs text-rose-100 font-medium">Supabase Authentication & Security Policy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'status' 
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={16} />
            Trạng thái Tài khoản
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login' 
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User size={16} />
            Đăng nhập / Đổi Acc
          </button>
          <button
            onClick={() => setActiveTab('hugging')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'hugging' 
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Key size={16} />
            API Key Hugging
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Current Account Card */}
              <div className={`p-5 rounded-2xl border ${
                isOwner 
                  ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/20' 
                  : currentUser.email 
                    ? 'bg-blue-500/10 border-blue-500/30 dark:bg-blue-950/20' 
                    : 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        {currentUser.name || 'Khách trải nghiệm'}
                      </span>
                      {isOwner ? (
                        <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Crown size={12} /> Tài khoản Chủ (Owner)
                        </span>
                      ) : currentUser.email ? (
                        <span className="px-2.5 py-0.5 bg-blue-500 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                          Người dùng Chuẩn
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-400 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                          Chưa đăng nhập
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      {currentUser.email || 'Chưa có email xác thực'}
                    </p>
                  </div>

                  {currentUser.email && (
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <LogOut size={14} />
                      Đăng xuất
                    </button>
                  )}
                </div>
              </div>

              {/* Permissions Summary Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Chi tiết Phân quyền tài khoản</h4>
                
                <div className="space-y-2">
                  {/* Supabase Storage Permission */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Lock size={16} className={isOwner ? 'text-emerald-500' : 'text-amber-500'} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Kết nối Supabase Storage (Tab Cài Đặt)</span>
                    </div>
                    {isOwner ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">Toàn quyền sửa</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg">Khóa (Chỉ xem)</span>
                    )}
                  </div>

                  {/* Video Export Permission */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className={isOwner || huggingKey ? 'text-emerald-500' : 'text-amber-500'} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Xuất video animation</span>
                    </div>
                    {isOwner ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">Toàn quyền</span>
                    ) : huggingKey ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">Dùng API Key riêng</span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/30 px-2.5 py-1 rounded-lg">Cần API Key hoặc Acc Chủ</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Banner for Regular Users */}
              {!isOwner && (
                <div className="p-4 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert size={20} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs text-rose-900 dark:text-rose-200">Muốn mở khóa đầy đủ chức năng không giới hạn?</h5>
                      <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
                        Bạn cần gửi yêu cầu cho Tài khoản Chủ qua Gmail <strong className="font-bold text-rose-900 dark:text-rose-100">{SUPPORT_CONTACT_EMAILS[0]}</strong> để thêm Gmail của bạn vào mục <span className="underline font-bold">Authentication của Supabase</span>.
                      </p>
                    </div>
                  </div>

                  {/* Warning notice explaining the browser/app draft mechanism */}
                  <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-xl text-left space-y-1.5">
                    <div className="text-[11px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <span>⚠️ BẠN CẦN LƯU Ý:</span>
                    </div>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-normal">
                      Khi bấm nút, trang web sẽ <strong>mở sẵn thư nháp</strong> đã soạn đầy đủ thông tin. Bạn <strong>BẮT BUỘC PHẢI BẤM NÚT "GỬI" (SEND)</strong> trong Gmail Web hoặc ứng dụng Outlook vừa hiện ra để gửi thư đi thực tế. Nếu chỉ bấm rồi tắt đi, thư sẽ không được gửi đi!
                    </p>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-normal">
                      Nếu ứng dụng Mail bị lỗi không gửi được, hãy dùng <strong>Cách 2 (Sao chép)</strong> để tự dán và gửi thủ công từ hòm thư cá nhân của bạn.
                    </p>
                  </div>

                  {/* Contact Options */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSendWebGmail()}
                      className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail size={18} className="group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <div className="font-black">1. Mở Trực tiếp Gmail Web (Khuyên dùng)</div>
                          <div className="text-[10px] text-rose-100 font-normal">Mở ngay tab Gmail trên trình duyệt - Khắc phục lỗi Outlook máy tính</div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="opacity-80 shrink-0" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyContact()}
                        className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Copy size={14} className="text-rose-500" />
                        2. Sao chép Email & Mẫu
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendMailto()}
                        className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Mail size={14} className="text-slate-500" />
                        3. Mở Mail App (Mailto)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Requests List for Owner Users */}
              {isOwner && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown size={18} className="text-amber-600 dark:text-amber-400" />
                      <h5 className="font-bold text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider">Danh sách Khách hàng Đăng ký / Yêu cầu</h5>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-full">
                      {requestsList.length} tài khoản
                    </span>
                  </div>

                  {requestsList.length === 0 ? (
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 italic">Chưa có yêu cầu đăng ký mới nào từ khách hàng trên thiết bị này.</p>
                  ) : (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {requestsList.map((req, idx) => (
                        <div key={req.id || idx} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs shadow-xs">
                          <div className="space-y-0.5 overflow-hidden mr-2">
                            <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{req.name || 'Khách hàng'}</div>
                            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">{req.email}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(req.email);
                              showToast(`Đã sao chép email: ${req.email}`);
                            }}
                            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-bold rounded-lg text-[11px] flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                          >
                            <Copy size={12} /> Sao chép Email
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LOGIN / SWITCH ACCOUNT */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Mode Toggle: Login vs Register vs Forgot */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setIsRegisterSuccess(false); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setIsRegisterSuccess(false); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'register'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Đăng Ký Mới ✨
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setForgotStep(1); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'forgot'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Quên Mật Khẩu
                </button>
              </div>

              {/* Mode 1: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleCustomLogin} className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    {is2FARequired ? 'Bước 2: Xác thực 2 lớp (2FA)' : 'Đăng nhập bằng Email người dùng'}
                  </h4>
                  
                  {is2FARequired ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                          <ShieldCheck size={18} />
                          <span>Tài khoản đã bật Xác thực 2 lớp (2FA)</span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                          Hệ thống đã tự động cấp Mã OTP xác minh 2FA cho tài khoản <strong className="text-slate-900 dark:text-white">{inputEmail}</strong>.
                        </p>
                        {twoFactorOtpNotice && (
                          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl font-mono text-center text-xs font-black text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                            MÃ OTP 2FA CỦA BẠN: <span className="text-sm tracking-widest text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-xs ml-1">{twoFactorOtpNotice}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Nhập Mã xác thực 2 lớp OTP (6 chữ số) (*)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={twoFactorInputCode}
                          onChange={(e) => setTwoFactorInputCode(e.target.value)}
                          placeholder="Nhập 6 chữ số OTP"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-emerald-500 rounded-xl text-center font-mono text-lg tracking-widest font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIs2FARequired(false);
                            setTwoFactorInputCode('');
                          }}
                          className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck size={16} />
                          Xác nhận & Đăng nhập
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email của bạn</label>
                        <input
                          type="email"
                          required
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          placeholder="nhap.email.cua.ban@gmail.com"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tên hiển thị</label>
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                          placeholder="Tên của bạn"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mật khẩu (*)</label>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('forgot'); setForgotStep(1); }}
                            className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                          >
                            Quên mật khẩu?
                          </button>
                        </div>
                        <input
                          type="password"
                          required
                          value={inputPassword}
                          onChange={(e) => setInputPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        Xác nhận Đăng nhập
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Mode 2: REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterUser} className="space-y-4">
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs space-y-1.5">
                    <h5 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-rose-500" />
                      Đăng ký Tài khoản Trực tiếp
                    </h5>
                    <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
                      Điền email và mật khẩu bên dưới để khởi tạo tài khoản mới. Hệ thống sẽ <strong>tự động cấp phiên đăng nhập ngay lập tức</strong> mà không cần qua nhiều bước phức tạp.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email đăng ký mới (*)</label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="email.dang.ky@gmail.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tên hiển thị (*)</label>
                    <input
                      type="text"
                      required
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mật khẩu khởi tạo (Ít nhất 8 ký tự) (*)</label>
                    <input
                      type="password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User size={16} />
                    Đăng ký & Đăng nhập Tự động
                  </button>
                </form>
              )}

              {/* Mode 3: FORGOT PASSWORD */}
              {authMode === 'forgot' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1.5">
                    <h5 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Key size={16} className="text-amber-500" />
                      Khôi phục & Cấp lại Mật khẩu
                    </h5>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                      Nhập email đã đăng ký để hệ thống cấp mã OTP xác minh, sau đó tiến hành tạo mật khẩu mới.
                    </p>
                  </div>

                  {forgotStep === 1 ? (
                    <form onSubmit={handleRequestResetOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email cần khôi phục (*)</label>
                        <input
                          type="email"
                          required
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          placeholder="email.da.dang.ky@gmail.com"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Mail size={16} />
                        Gửi Mã Xác Nhận Khôi Phục (OTP)
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmResetPassword} className="space-y-4">
                      {generatedOtp && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                          <span>Mã OTP khôi phục của bạn là: <strong className="text-emerald-600 font-mono text-sm">{generatedOtp}</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedOtp);
                              showToast('Đã sao chép mã OTP!');
                            }}
                            className="px-2 py-1 bg-emerald-200 dark:bg-emerald-800 rounded font-bold text-[10px]"
                          >
                            Sao chép
                          </button>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mã OTP xác nhận (6 chữ số) (*)</label>
                        <input
                          type="text"
                          required
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value)}
                          placeholder="Nhập 6 số OTP"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mật khẩu mới (Ít nhất 8 ký tự) (*)</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mật khẩu mới của bạn"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setForgotStep(1)}
                          className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 size={16} />
                          Xác Nhận Đặt Lại Mật Khẩu
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HUGGING FACE API KEY */}
          {activeTab === 'hugging' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Thiết lập Hugging Face API Key</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Đối với tài khoản người dùng chuẩn, bạn có thể tự cài đặt API Key Hugging Face cá nhân để sử dụng tính năng <strong>Xuất video animation</strong> mà không cần phải chuyển sang tài khoản chủ.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hugging Face API Key (`hf_...`)</label>
                <input
                  type="password"
                  value={huggingKey}
                  onChange={(e) => setHuggingKey(e.target.value)}
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleSaveHuggingKey}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Key size={16} />
                  Lưu API Key
                </button>
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  Lấy Key Hugging Face
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
