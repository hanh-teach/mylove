import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, QrCode, Globe, Sparkles, ExternalLink, ShieldCheck, X, Link, Sliders, CheckCircle2, Lock, Download, Eye } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '../ui/Button';

interface WebCardShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    title: string;
    message: string;
    senderName?: string;
    receiverName?: string;
    categoryLabel?: string;
    photoUrl?: string;
  };
  onOpenStandalonePreview?: () => void;
}

export const WebCardShareModal: React.FC<WebCardShareModalProps> = ({
  isOpen,
  onClose,
  cardData,
  onOpenStandalonePreview
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'custom-domain' | 'qr' | 'settings'>('link');
  const [subdomainSlug, setSubdomainSlug] = useState('khoang-khac-y-nghia');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [isCustomDomainActive, setIsCustomDomainActive] = useState(false);
  const [enableSparkles, setEnableSparkles] = useState(true);
  const [hideSystemBranding, setHideSystemBranding] = useState(true);
  const [passwordProtection, setPasswordProtection] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const finalShareableUrl = isCustomDomainActive && customDomainInput
    ? `https://${customDomainInput.trim()}`
    : `https://${subdomainSlug.trim() || 'ky-niem'}.noteme.app`;

  // Real Dynamic QR Code Generator Effect
  useEffect(() => {
    if (finalShareableUrl) {
      QRCode.toDataURL(finalShareableUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Real QR Code generation error:', err));
    }
  }, [finalShareableUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalShareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `QRCode-${subdomainSlug || 'noteme'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-b-full blur-sm" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Globe size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">NoteMe v2.0 — Cổng Thông Tin Kỷ Niệm Độc Lập</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Tên Miền Tùy Chỉnh
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Xuất bản trang ghi nhớ cá nhân kín kẽ, hiển thị mượt màng trên mọi trình duyệt di động & máy tính.
            </p>
          </div>
        </div>

        {/* Preview Card Mini Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
          {cardData.photoUrl && (
            <img
              src={cardData.photoUrl}
              alt="Card Preview"
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">
              {cardData.categoryLabel || 'Thiệp Kỷ Niệm'}
            </span>
            <h4 className="text-xs font-bold text-white truncate">{cardData.title}</h4>
            <p className="text-[11px] text-slate-400 truncate">
              Thân gửi: <strong className="text-slate-200">{cardData.receiverName || 'Trân Quý'}</strong>
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'link' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 size={13} />
            <span>Tên Miền NoteMe</span>
          </button>
          <button
            onClick={() => setActiveTab('custom-domain')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'custom-domain' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link size={13} />
            <span>Tên Miền Riêng</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode size={13} />
            <span>Mã QR Quét</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Riêng Tư & Hiệu Ứng</span>
          </button>
        </div>

        {/* Tab 1: NoteMe Subdomain Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Đường dẫn phụ cá nhân hóa (Subdomain Slug):
              </label>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-3 rounded-2xl border border-slate-800">
                  https://
                </span>
                <input
                  type="text"
                  value={subdomainSlug}
                  onChange={(e) => setSubdomainSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="khoang-khac-y-nghia"
                  className="flex-1 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-pink-300 font-mono text-xs focus:outline-none focus:border-pink-500"
                />
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-3 rounded-2xl border border-slate-800">
                  .noteme.app
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  readOnly
                  value={finalShareableUrl}
                  className="flex-1 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Đã chép!' : 'Sao Chép'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share */}
            <div>
              <span className="block text-[11px] font-bold text-slate-400 mb-2">
                Gửi liên kết nhanh:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://zalo.me/share?url=${encodeURIComponent(finalShareableUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold text-center hover:bg-blue-600/30 transition-colors block"
                >
                  Gửi qua Zalo
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalShareableUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold text-center hover:bg-indigo-600/30 transition-colors block"
                >
                  Messenger / Message
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(finalShareableUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-bold text-center hover:bg-sky-600/30 transition-colors block"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Domain */}
        {activeTab === 'custom-domain' && (
          <div className="space-y-4 py-1">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                Nhập Tên Miền Riêng Của Bạn (Custom Domain):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="kyniem.nguyenvana.com"
                  className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomDomainActive(!isCustomDomainActive)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isCustomDomainActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {isCustomDomainActive ? 'Đã Kích Hoạt' : 'Kích Hoạt'}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-pink-400 font-bold">
                  <CheckCircle2 size={13} />
                  <span>Cấu hình bản ghi DNS CNAME:</span>
                </div>
                <p className="font-mono bg-slate-900 p-2 rounded-xl text-slate-300 text-[10px]">
                  CNAME host.domain.com -&gt; custom.noteme.app
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: QR Code */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="p-3 bg-white rounded-2xl border-4 border-pink-400/40 shadow-xl inline-block relative group">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Dynamic QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-slate-500 text-xs font-bold">
                  Đang tạo mã QR...
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Mã QR động thực tế (Quét để mở trang)</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 mb-3">
                Chụp hoặc quét trực tiếp bằng camera điện thoại/Zalo để mở trang kỷ niệm độc lập.
              </p>
              {qrCodeDataUrl && (
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Download size={14} className="text-pink-400" />
                  <span>Tải Mã QR Ảnh High-Res (PNG)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Settings & Privacy */}
        {activeTab === 'settings' && (
          <div className="space-y-3 py-1 text-xs">
            {/* Sparkles Effect */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-white block">Hiệu ứng ánh sao lấp lánh</span>
                  <span className="text-[10px] text-slate-400">Tạo điểm nhấn trang trọng khi lật mở thiệp</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableSparkles}
                onChange={(e) => setEnableSparkles(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Discrete Branding Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">Chế độ kín kẽ & riêng tư</span>
                  <span className="text-[10px] text-slate-400">Ẩn hoàn toàn logo và thông tin thương hiệu hệ thống</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hideSystemBranding}
                onChange={(e) => setHideSystemBranding(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Optional Password Protection */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Lock size={14} className="text-rose-400" />
                <span>Mật khẩu bảo vệ (Tùy chọn):</span>
              </div>
              <input
                type="password"
                value={passwordProtection}
                onChange={(e) => setPasswordProtection(e.target.value)}
                placeholder="Để trống nếu không đặt mật khẩu"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            className="border-slate-700 text-slate-300 text-xs py-2 px-4 rounded-xl"
          >
            Đóng
          </Button>
          <button
            type="button"
            onClick={() => {
              if (onOpenStandalonePreview) {
                onOpenStandalonePreview();
              } else {
                window.open(finalShareableUrl, '_blank');
              }
            }}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Eye size={15} />
            <span>Mở Trang Trải Nghiệm Mới (Cửa Sổ Độc Lập)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
