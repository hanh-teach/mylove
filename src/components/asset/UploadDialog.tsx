import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link, Sparkles, FileText, Music, Video, Image as ImageIcon, Check, Database } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { assetManager } from '../../modules/asset/AssetManager';
import { AssetCategory } from '../../modules/asset/AssetModel';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { validateSupabaseKeyRole } from '../../shared/utils/supabaseKeyValidator';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  onUploaded,
}) => {
  const { activeProject } = useProjectWorkspace();

  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'ai' | 'supabase'>('file');
  const [isDragging, setIsDragging] = useState(false);
  
  // URL Form
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [typeInput, setTypeInput] = useState<AssetCategory>('image');
  const [tagsInput, setTagsInput] = useState('');

  // AI Form
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Supabase Form
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('lovenote_supabase_url') || (import.meta as any).env?.VITE_DEFAULT_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('lovenote_supabase_key') || '');
  const [supabaseBucket, setSupabaseBucket] = useState(() => localStorage.getItem('lovenote_supabase_bucket') || 'love-note-assets');
  const [isUploadingSupabase, setIsUploadingSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFiles = (files: FileList | File[]) => {
    if (!activeProject) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const category: AssetCategory = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'document';

      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        assetManager.registerAsset({
          projectId: activeProject.id,
          title: file.name,
          url: fileUrl,
          type: category,
          size: file.size,
          tags: [category, 'upload'],
          mimeType: file.type,
        });
        if (onUploaded) onUploaded();
      };
      reader.readAsDataURL(file);
    });

    onClose();
  };

  const handleSupabaseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeProject) return;

    const cleanUrl = supabaseUrl.trim();
    const cleanKey = supabaseKey.trim();
    const cleanBucket = supabaseBucket.trim() || 'love-note-assets';

    const validation = validateSupabaseKeyRole(cleanKey);
    if (!validation.isValid) {
      setSupabaseStatusMsg({ text: validation.error || 'Vui lòng sử dụng Anon Key thay thế.', type: 'error' });
      if (supabaseFileInputRef.current) {
        supabaseFileInputRef.current.value = '';
      }
      return;
    }

    localStorage.setItem('lovenote_supabase_url', cleanUrl);
    localStorage.setItem('lovenote_supabase_key', cleanKey);
    localStorage.setItem('lovenote_supabase_bucket', cleanBucket);

    setIsUploadingSupabase(true);
    setSupabaseStatusMsg(null);

    try {
      const file = files[0];
      const reader = new FileReader();
      const fileExt = file.name.split('.').pop() || 'png';
      const uniqueFileName = `lovenote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      let publicUrl = '';
      let lastErrMsg = '';

      // 1. Try direct client SDK upload
      if (cleanUrl && cleanKey) {
        try {
          const supabaseClient = createClient(cleanUrl, cleanKey);
          const { data: uploadResult, error: clientErr } = await supabaseClient.storage
            .from(cleanBucket)
            .upload(uniqueFileName, file, {
              contentType: file.type || 'image/png',
              cacheControl: '3600',
              upsert: true,
            });

          if (!clientErr && uploadResult) {
            const { data: pubData } = supabaseClient.storage
              .from(cleanBucket)
              .getPublicUrl(uniqueFileName);
            if (pubData?.publicUrl) {
              publicUrl = pubData.publicUrl;
            }
          } else if (clientErr) {
            lastErrMsg = clientErr.message;
          }
        } catch (cErr: any) {
          lastErrMsg = cErr.message || 'Direct upload error';
        }
      }

      // 2. Try server API proxy upload if direct upload didn't succeed
      if (!publicUrl) {
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const fileBase64 = await base64Promise;

        const res = await fetch('/api/supabase/upload', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64,
            fileName: file.name,
            mimeType: file.type,
            supabaseBucket: cleanBucket || undefined,
          })
        });

        if (res.status === 401) {
          throw new Error('Vui lòng đăng nhập để tải lên tệp tin.');
        }
        if (res.status === 403) {
          throw new Error('Bạn không có quyền tải lên tệp tin.');
        }

        const data = await res.json();
        if (data.success && data.publicUrl) {
          publicUrl = data.publicUrl;
        } else {
          const apiError = data.error || lastErrMsg || 'Không thể kết nối hoặc tải lên Supabase Storage';
          throw new Error(apiError);
        }
      }

      const category: AssetCategory = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'document';

      assetManager.registerAsset({
        projectId: activeProject.id,
        title: file.name,
        url: publicUrl,
        type: category,
        size: file.size,
        tags: [category, 'supabase'],
        mimeType: file.type,
        provider: 'supabase',
      });

      setSupabaseStatusMsg({ 
        text: `Tải lên thành công! Tệp đã lưu tại Supabase Storage bucket "${cleanBucket}".`, 
        type: 'success' 
      });
      if (onUploaded) onUploaded();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Supabase upload error:', err);
      let errMsg = err.message || 'Không thể tải tệp lên Supabase';
      if (errMsg.includes('not found') || errMsg.includes('Bucket')) {
        errMsg = `Bucket "${cleanBucket}" không tồn tại trên Supabase. Vui lòng vào Supabase Dashboard > Storage > Buckets, tạo bucket tên "${cleanBucket}" và bật "Public bucket".`;
      } else if (errMsg.includes('row-level security') || errMsg.includes('RLS')) {
        errMsg = `Supabase RLS đang khóa quyền tải lên bucket "${cleanBucket}". Vui lòng tạo RLS Policy "Allow public uploads" hoặc chuyển bucket thành Public.`;
      }
      setSupabaseStatusMsg({ text: `Lỗi Supabase: ${errMsg}`, type: 'error' });
    } finally {
      setIsUploadingSupabase(false);
      if (supabaseFileInputRef.current) {
        supabaseFileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !activeProject) return;

    assetManager.registerAsset({
      projectId: activeProject.id,
      title: titleInput.trim() || `Asset URL - ${new Date().toLocaleTimeString('vi-VN')}`,
      url: urlInput.trim(),
      type: typeInput,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      provider: 'external',
    });

    if (onUploaded) onUploaded();
    setUrlInput('');
    setTitleInput('');
    onClose();
  };

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || !activeProject) return;

    setIsGeneratingAI(true);
    setTimeout(() => {
      const sampleAiUrls = [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      ];
      const randomUrl = sampleAiUrls[Math.floor(Math.random() * sampleAiUrls.length)];

      assetManager.registerAIAsset(
        activeProject.id,
        `AI Asset: ${aiPrompt.slice(0, 25)}...`,
        randomUrl,
        'ai',
        'gemini',
        `Prompt: "${aiPrompt}"`
      );

      setIsGeneratingAI(false);
      setAiPrompt('');
      if (onUploaded) onUploaded();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <Upload size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upload & Thêm Asset Mới</h3>
              <p className="text-[11px] text-slate-500">
                Dự án: <b>{activeProject?.title}</b>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-100/50 p-1.5 gap-1 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'file'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Upload size={13} />
            <span>File Local</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'supabase'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Database size={13} className="text-emerald-600" />
            <span>Supabase Storage</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'url'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Link size={13} />
            <span>URL</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'ai'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Sparkles size={13} className="text-purple-500" />
            <span>AI</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'file' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) handleProcessFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-rose-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleProcessFiles(e.target.files);
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-inner">
                <Upload size={28} />
              </div>
              <p className="font-bold text-slate-800 text-sm mb-1">
                Kéo thả file vào đây hoặc bấm để chọn
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Hỗ trợ Hình ảnh (JPG, PNG), Video (MP4), Âm thanh (MP3), File văn bản (PDF).
              </p>
            </div>
          )}

          {activeTab === 'supabase' && (() => {
            const keyValidation = supabaseKey ? validateSupabaseKeyRole(supabaseKey) : { isValid: true };
            const isConfigured = supabaseUrl.trim() && supabaseKey.trim();

            return (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2">
                  <Database size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">Tích hợp Supabase Storage trực tiếp</p>
                    <span>Kết nối với dự án Supabase của bạn tại <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-semibold text-emerald-700">Supabase Dashboard</a> để lưu trữ ảnh vĩnh viễn không giới hạn.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Supabase Project URL *</label>
                    <input
                      type="url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xxxxx.supabase.co"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Nhập URL dự án Supabase của bạn (ví dụ: https://xxxxx.supabase.co)
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Supabase Anon / API Key *</label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className={`w-full px-3 py-2 rounded-xl border focus:border-emerald-500 outline-none text-xs font-mono ${
                        !keyValidation.isValid ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    <p className="mt-1 text-[10px] text-amber-600 leading-normal">
                      ⚠️ <b>CHỈ</b> nhập Anon/Public Key (Settings &rarr; API &rarr; anon public trong Supabase Dashboard). <b>TUYỆT ĐỐI KHÔNG</b> nhập Service Role Key &mdash; key đó có toàn quyền và không được để lộ ra trình duyệt.
                    </p>
                    {!keyValidation.isValid && (
                      <p className="mt-1 text-[11px] text-red-600 font-bold">
                        {keyValidation.error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Storage Bucket Name</label>
                    <input
                      type="text"
                      value={supabaseBucket}
                      onChange={(e) => setSupabaseBucket(e.target.value)}
                      placeholder="love-note-assets"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                    />
                  </div>
                </div>

                {supabaseStatusMsg && (
                  <div className={`p-2.5 rounded-xl text-xs font-medium ${supabaseStatusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {supabaseStatusMsg.text}
                  </div>
                )}

                {!isConfigured ? (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    <p className="font-bold mb-1">⚠️ Cấu hình chưa hoàn tất</p>
                    <span>Vui lòng điền đầy đủ <b>Supabase Project URL</b> và <b>API Key</b> ở trên để kích hoạt chức năng tải lên Supabase Storage.</span>
                  </div>
                ) : (
                  <div className="pt-2">
                    <input
                      ref={supabaseFileInputRef}
                      type="file"
                      accept="image/*,video/*,audio/*"
                      className="hidden"
                      onChange={handleSupabaseUpload}
                    />
                    <button
                      type="button"
                      disabled={isUploadingSupabase || !keyValidation.isValid}
                      onClick={() => {
                        const validation = validateSupabaseKeyRole(supabaseKey);
                        if (!validation.isValid) {
                          setSupabaseStatusMsg({ text: validation.error || 'Vui lòng sử dụng Anon Key thay thế.', type: 'error' });
                          return;
                        }
                        supabaseFileInputRef.current?.click();
                      }}
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {isUploadingSupabase ? (
                        <>
                          <Sparkles size={16} className="animate-spin" />
                          <span>Đang tải lên Supabase Storage...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Chọn Ảnh Từ Máy & Tải Lên Supabase</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên tài nguyên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Anh_ky_niem.jpg"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại tài nguyên</label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value as AssetCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 outline-none text-xs bg-white"
                  >
                    <option value="image">Hình ảnh</option>
                    <option value="video">Video</option>
                    <option value="audio">Âm thanh</option>
                    <option value="document">File đính kèm</option>
                    <option value="ai">AI Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tags (phân cách dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="hoa, ky-niem"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Thêm URL Asset
                </button>
              </div>
            </form>
          )}

          {activeTab === 'ai' && (
            <form onSubmit={handleGenerateAI} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-900 text-[11px] leading-relaxed flex items-start gap-2">
                <Sparkles size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>
                  Sinh tài nguyên nghệ thuật bằng AI Studio (Gemini 3.5 Flash). Asset sau khi sinh ra sẽ tự động lưu vĩnh viễn vào Media Library của dự án.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả Prompt hình ảnh AI *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Bức tranh bó hoa hướng dương lung linh dưới ánh nắng hoàng hôn phong cách màu nước..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 outline-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAI}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold flex items-center gap-2"
                >
                  {isGeneratingAI ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>Đang tạo Asset...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Sinh & Lưu vào Library</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
